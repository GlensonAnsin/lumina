import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

class StorageService {
  private storage: StorageEngine;
  private uploadDir: string;

  constructor() {
    // 1. Define where files go
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // 2. Configure Disk Storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });
  }

  /**
   * Get the Multer instance with validation rules.
   */
  public get uploader() {
    return multer({
      storage: this.storage,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: this.fileFilter,
    });
  }

  /**
   * Validate file types (e.g., Images only).
   */
  private fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed.'));
    }
  }
}

export default new StorageService();