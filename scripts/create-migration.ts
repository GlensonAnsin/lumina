import fs from 'fs';
import path from 'path';
import Logger from '../src/utils/Logger.js';

interface ColumnDefinition {
  type: string;
  allowNull?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  unique?: boolean;
  defaultValue?: string;
  references?: { model: string; key: string };
  onUpdate?: string;
  onDelete?: string;
}

class MigrationGenerator {
  private nameArgument: string;
  private migrationName: string;
  private className: string;
  private tableName: string;
  private migrationsDir: string;
  private stubPath: string;
  private modelsDir: string;

  constructor() {
    this.nameArgument = process.argv[2];
    this.migrationsDir = path.join(process.cwd(), 'src', 'database', 'migrations');
    this.stubPath = path.join(process.cwd(), 'scripts', 'stubs', 'migration.stub');
    this.modelsDir = path.join(process.cwd(), 'src', 'models');

    // Initialize properties safely
    this.migrationName = '';
    this.className = '';
    this.tableName = 'table_name';
  }

  public run(): void {
    if (!this.validateInput()) return;

    if (this.nameArgument.toLowerCase() === 'all') {
      this.generateAllMigrations();
    } else {
      this.parseNameArgument();
      this.createMigrationFile();
    }
  }

  private validateInput(): boolean {
    if (!this.nameArgument) {
      Logger.error('Please provide a migration name.');
      console.log('\nUsage: npm run create:migration <name> | all');
      console.log('Example: npm run create:migration create_products_table\n');
      process.exit(1);
    }
    return true;
  }

  /**
   * Transforms input "create_products_table" into:
   * ClassName: CreateProductsTable
   * TableName: products (tries to guess it)
   */
  private parseNameArgument(): void {
    this.migrationName = this.nameArgument.toLowerCase();

    // 1. Generate Class Name (PascalCase)
    this.className = this.migrationName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

    // 2. Guess Table Name
    const match = this.migrationName.match(/create_(.+)_table/);
    if (match && match[1]) {
      this.tableName = match[1];
    } else {
      // Also try without _table suffix: "create_users" -> "users"
      const simpleMatch = this.migrationName.match(/create_(.+)/);
      if (simpleMatch && simpleMatch[1]) {
        this.tableName = simpleMatch[1];
      } else {
        this.tableName = this.migrationName;
      }
    }
  }

  /**
   * Generates YYYYMMDDHHMMSS format
   */
  private getTimestamp(date: Date = new Date()): string {
    return date.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  }

  /**
   * Attempts to find a matching model file based on the table name.
   * Tries multiple strategies: PascalCase singularization, direct tableName match,
   * and pluralized tableName match to handle inputs like "user", "users", "refresh_tokens".
   * When a model is found, updates this.tableName to match the model's actual tableName.
   */
  private findModelFile(): string | null {
    if (!fs.existsSync(this.modelsDir)) return null;

    const files = fs.readdirSync(this.modelsDir).filter(
      f => f.endsWith('.ts') && f !== 'index.ts'
    );

    // Strategy 1: Singularize table name and PascalCase it -> Model file
    // e.g. "users" -> "User.ts", "refresh_tokens" -> "RefreshToken.ts"
    const singularized = this.singularize(this.tableName);
    const expectedModelName = this.toPascalCase(singularized);

    const directMatch = files.find(f => f === `${expectedModelName}.ts`);
    if (directMatch) {
      const filePath = path.join(this.modelsDir, directMatch);
      this.syncTableName(filePath);
      return filePath;
    }

    // Strategy 2: Try PascalCase without singularizing (in case table name is already singular)
    const rawPascal = this.toPascalCase(this.tableName);
    const rawMatch = files.find(f => f === `${rawPascal}.ts`);
    if (rawMatch) {
      const filePath = path.join(this.modelsDir, rawMatch);
      this.syncTableName(filePath);
      return filePath;
    }

    // Strategy 3: Scan all model files for a matching tableName (try both singular and plural)
    const possibleTableNames = new Set([this.tableName, this.pluralize(this.tableName), singularized]);
    for (const file of files) {
      const filePath = path.join(this.modelsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const name of possibleTableNames) {
        if (content.includes(`tableName: '${name}'`)) {
          // Update tableName to match what the model actually uses
          this.tableName = name;
          return filePath;
        }
      }
    }

    return null;
  }

  /**
   * Reads a model file and updates this.tableName to match the model's actual tableName.
   */
  private syncTableName(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const tableNameMatch = content.match(/tableName:\s*'(\w+)'/);
    if (tableNameMatch) {
      this.tableName = tableNameMatch[1];
    }
  }

  /**
   * Converts a snake_case string to PascalCase.
   */
  private toPascalCase(str: string): string {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Basic pluralization: adds trailing 's'.
   */
  private pluralize(word: string): string {
    if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
      return word + 'es';
    }
    if (word.endsWith('y') && !['a','e','i','o','u'].includes(word[word.length - 2])) {
      return word.slice(0, -1) + 'ies';
    }
    return word + 's';
  }

  /**
   * Basic singularization: removes trailing 's'.
   * Handles common patterns like "ies" -> "y".
   */
  private singularize(word: string): string {
    if (word.endsWith('ies')) {
      return word.slice(0, -3) + 'y';
    }
    if (word.endsWith('ses') || word.endsWith('xes') || word.endsWith('zes') || word.endsWith('ches') || word.endsWith('shes')) {
      return word.slice(0, -2);
    }
    if (word.endsWith('s') && !word.endsWith('ss')) {
      return word.slice(0, -1);
    }
    return word;
  }

  /**
   * Parses a Sequelize model file to extract column definitions from the init() call
   * and model options (paranoid, timestamps).
   */
  private parseModelFile(filePath: string): { columns: Map<string, ColumnDefinition>; paranoid: boolean; timestamps: boolean; associations: string[] } {
    const content = fs.readFileSync(filePath, 'utf-8');
    const columns = new Map<string, ColumnDefinition>();
    const associations: string[] = [];

    // Detect paranoid & timestamps from model options
    const paranoid = /paranoid:\s*true/.test(content);
    const timestamps = /timestamps:\s*true/.test(content) || !/timestamps:\s*false/.test(content);

    // Extract the init() block - find the column definitions object
    // We look for the pattern: ModelName.init({ ... }, { ... })
    const initMatch = content.match(/\.init\s*\(\s*\{([\s\S]*?)\}\s*,\s*\{/);
    if (!initMatch) {
      return { columns, paranoid, timestamps, associations };
    }

    const columnsBlock = initMatch[1];

    // Parse individual column definitions using a state-machine approach
    this.parseColumnsBlock(columnsBlock, columns);

    // Parse associations for foreign key references
    this.parseAssociations(content, associations);

    return { columns, paranoid, timestamps, associations };
  }

  /**
   * Parses the columns block from Model.init() to extract column definitions.
   */
  private parseColumnsBlock(block: string, columns: Map<string, ColumnDefinition>): void {
    // Match each column: `columnName: { ... }`
    const columnRegex = /(\w+)\s*:\s*\{([^}]+)\}/g;
    let match;

    while ((match = columnRegex.exec(block)) !== null) {
      const columnName = match[1];
      const columnBody = match[2];

      const colDef: ColumnDefinition = {
        type: this.extractType(columnBody),
      };

      // Extract allowNull
      const allowNullMatch = columnBody.match(/allowNull:\s*(true|false)/);
      if (allowNullMatch) {
        colDef.allowNull = allowNullMatch[1] === 'true';
      }

      // Extract primaryKey
      if (/primaryKey:\s*true/.test(columnBody)) {
        colDef.primaryKey = true;
      }

      // Extract autoIncrement
      if (/autoIncrement:\s*true/.test(columnBody)) {
        colDef.autoIncrement = true;
      }

      // Extract unique
      if (/unique:\s*true/.test(columnBody)) {
        colDef.unique = true;
      }

      // Extract defaultValue
      const defaultMatch = columnBody.match(/defaultValue:\s*(.+?)(?:,|\s*$)/);
      if (defaultMatch) {
        const val = defaultMatch[1].trim();
        // Clean trailing commas or spaces
        colDef.defaultValue = val.replace(/,\s*$/, '');
      }

      columns.set(columnName, colDef);
    }
  }

  /**
   * Extracts the DataTypes.XXX type string from a column definition body.
   */
  private extractType(body: string): string {
    // Match patterns like: DataTypes.STRING, DataTypes.STRING(50), DataTypes.BIGINT
    const typeMatch = body.match(/type:\s*(DataTypes\.\w+(?:\([^)]*\))?)/);
    if (typeMatch) {
      return typeMatch[1];
    }
    return 'DataTypes.STRING';
  }

  /**
   * Parses association methods (belongsTo, hasMany, etc.) for foreign key info.
   */
  private parseAssociations(content: string, associations: string[]): void {
    // Match belongsTo associations to detect foreign keys
    const belongsToRegex = /belongsTo\s*\(\s*models\.(\w+)\s*,\s*\{[^}]*foreignKey:\s*'(\w+)'/g;
    let match;
    while ((match = belongsToRegex.exec(content)) !== null) {
      associations.push(`${match[2]}:${match[1]}`);
    }
  }

  /**
   * Generates the migration file content by scanning the model.
   */
  private generateFromModel(modelPath: string): string {
    const { columns, paranoid, timestamps, associations } = this.parseModelFile(modelPath);

    // Map of foreignKey -> tableName
    const fkMap = new Map<string, string>();
    for (const assoc of associations) {
      const [fk, modelName] = assoc.split(':');
      // Pluralize the lowercased model name to guess target table
      const targetTable = this.pluralize(modelName.toLowerCase());
      fkMap.set(fk, targetTable);
    }

    // Build column definitions string
    const lines: string[] = [];
    const indent = '      ';

    for (const [name, col] of columns) {
      // Skip id — we'll always add it manually with BIGINT for migration
      if (name === 'id') {
        lines.push(`${indent}id: {`);
        lines.push(`${indent}  allowNull: false,`);
        lines.push(`${indent}  autoIncrement: true,`);
        lines.push(`${indent}  primaryKey: true,`);
        lines.push(`${indent}  type: DataTypes.BIGINT,`);
        lines.push(`${indent}},`);
        continue;
      }

      lines.push(`${indent}${name}: {`);
      lines.push(`${indent}  type: ${this.migrationDataType(col.type)},`);

      if (col.allowNull !== undefined) {
        lines.push(`${indent}  allowNull: ${col.allowNull},`);
      }
      if (col.unique) {
        lines.push(`${indent}  unique: true,`);
      }
      if (col.defaultValue !== undefined) {
        lines.push(`${indent}  defaultValue: ${col.defaultValue},`);
      }

      if (fkMap.has(name)) {
        lines.push(`${indent}  references: {`);
        lines.push(`${indent}    model: '${fkMap.get(name)}',`);
        lines.push(`${indent}    key: 'id',`);
        lines.push(`${indent}  },`);
        lines.push(`${indent}  onUpdate: 'CASCADE',`);
        lines.push(`${indent}  onDelete: 'CASCADE',`);
      }

      lines.push(`${indent}},`);
    }

    // Add timestamps
    if (timestamps) {
      lines.push(`${indent}created_at: {`);
      lines.push(`${indent}  type: DataTypes.DATE,`);
      lines.push(`${indent}  allowNull: false,`);
      lines.push(`${indent}  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),`);
      lines.push(`${indent}},`);
      lines.push(`${indent}updated_at: {`);
      lines.push(`${indent}  type: DataTypes.DATE,`);
      lines.push(`${indent}  allowNull: false,`);
      lines.push(`${indent}  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),`);
      lines.push(`${indent}},`);
    }

    // Add deleted_at for paranoid models
    if (paranoid) {
      lines.push(`${indent}deleted_at: {`);
      lines.push(`${indent}  type: DataTypes.DATE,`);
      lines.push(`${indent}  allowNull: true,`);
      lines.push(`${indent}  defaultValue: null,`);
      lines.push(`${indent}},`);
    }

    const columnsStr = lines.join('\n');

    // Build class name from table name: "users" -> "CreateUsersTable"
    const migrationClassName = `Create${this.toPascalCase(this.tableName)}Table`;

    return `import { DataTypes } from 'sequelize';

class ${migrationClassName} {
  /**
   * Run the migrations.
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('${this.tableName}', {
${columnsStr}
    });
  }

  /**
   * Reverse the migrations.
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('${this.tableName}');
  }
}

export default new ${migrationClassName}();
`;
  }

  /**
   * Converts model DataTypes to migration-appropriate DataTypes.
   * e.g., DataTypes.INTEGER for id -> DataTypes.BIGINT in migrations.
   * Keeps explicit types as-is.
   */
  private migrationDataType(type: string): string {
    // Models often use DataTypes.INTEGER for IDs/Foreign Keys, but migrations use BIGINT typically.
    if (type === 'DataTypes.INTEGER') {
      return 'DataTypes.BIGINT';
    }
    return type;
  }

  private createMigrationFile(): void {
    try {
      // 1. Generate Filename with Timestamp
      const timestamp = this.getTimestamp();
      const fileName = `${timestamp}-create_${this.migrationName}.js`;
      const targetPath = path.join(this.migrationsDir, fileName);

      // 2. Try to find and scan the corresponding model
      const modelPath = this.findModelFile();
      let content: string;

      if (modelPath) {
        const modelName = path.basename(modelPath, '.ts');
        Logger.info(`Model found: src/models/${modelName}.ts — scanning columns...`);
        content = this.generateFromModel(modelPath);
      } else {
        // Fall back to stub template
        Logger.info('No matching model found. Using stub template.');
        content = fs.readFileSync(this.stubPath, 'utf-8');
        content = content.replace(/{{ClassName}}/g, this.className);
        content = content.replace(/{{TableName}}/g, this.tableName);
      }

      // 3. Write File
      fs.writeFileSync(targetPath, content);

      Logger.info(`Migration Created: src/database/migrations/${fileName}`);

    } catch (error) {
      Logger.error('Failed to create migration:', error);
      process.exit(1);
    }
  }

  /**
   * Generates migrations for all models in the models directory, considering dependencies (foreign keys).
   */
  private generateAllMigrations(): void {
    if (!fs.existsSync(this.modelsDir)) {
      Logger.error("Models directory not found.");
      return;
    }
    
    // 1. Find all model files
    const files = fs.readdirSync(this.modelsDir).filter(
      f => f.endsWith('.ts') && f !== 'index.ts'
    );
    
    // 2. Parse all models to gather dependencies
    const modelNodes: { file: string, tableName: string, dependencies: string[] }[] = [];
    for (const file of files) {
        const fullPath = path.join(this.modelsDir, file);
        // temporarily set tableName to singularized file name to allow syncTableName to update it
        this.tableName = file.replace('.ts', '').toLowerCase();
        this.syncTableName(fullPath);
        const currentTableName = this.tableName;
        
        const { associations } = this.parseModelFile(fullPath);
        const dependencies: string[] = [];
        for (const assoc of associations) {
            const [fk, modelName] = assoc.split(':');
            const targetTable = this.pluralize(modelName.toLowerCase());
            if (targetTable !== currentTableName) { // avoid self-dependencies
                dependencies.push(targetTable);
            }
        }
        
        modelNodes.push({
            file: fullPath,
            tableName: currentTableName,
            dependencies
        });
    }
    
    // 3. Topological Sort (DFS)
    const sorted: typeof modelNodes = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();
    
    const visit = (node: typeof modelNodes[0]) => {
        if (visited.has(node.tableName)) return;
        if (visiting.has(node.tableName)) {
            Logger.warn(`Circular dependency detected involving model: ${node.tableName}. Output order may not be perfect.`);
            return;
        }
        visiting.add(node.tableName);
        for (const depTable of node.dependencies) {
            const depNode = modelNodes.find(n => n.tableName === depTable);
            if (depNode) visit(depNode);
        }
        visiting.delete(node.tableName);
        visited.add(node.tableName);
        sorted.push(node);
    };
    
    for (const node of modelNodes) visit(node);
    
    // 4. Generate them with incremental timestamps
    let currentTimestamp = new Date();
    for (const node of sorted) {
        this.tableName = node.tableName;
        const timestampStr = this.getTimestamp(currentTimestamp);
        
        const fileName = `${timestampStr}-create_${node.tableName}.js`;
        const targetPath = path.join(this.migrationsDir, fileName);
        
        Logger.info(`Model found: src/models/${path.basename(node.file)} — scanning columns...`);
        const content = this.generateFromModel(node.file);
        fs.writeFileSync(targetPath, content);
        Logger.info(`Migration Created: src/database/migrations/${fileName}`);
        
        // Add 1 second for next file so they execute in order
        currentTimestamp.setSeconds(currentTimestamp.getSeconds() + 1);
    }
  }
}

new MigrationGenerator().run();