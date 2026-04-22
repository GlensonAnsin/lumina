declare module 'inertia-node' {
  import { Request, Response, NextFunction } from 'express';

  function inertia(
    html: (page: any) => string,
    version?: string | (() => string)
  ): (req: Request, res: Response, next: NextFunction) => void;

  export default inertia;
}

declare namespace Express {
  export interface Response {
    inertia(component: string, props?: Record<string, any>): void;
  }
}
