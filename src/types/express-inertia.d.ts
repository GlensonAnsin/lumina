declare module 'inertia-node' {
  import { Request, Response, NextFunction } from 'express';

  export interface Inertia {
    render(page: { component: string; props?: Record<string, any> }): void;
    shareProps(props: Record<string, any>): void;
    setViewData(data: Record<string, any>): void;
    redirect(url?: string): void;
  }

  function inertia(
    html: (page: string) => string,
    version?: string | (() => string)
  ): (req: Request, res: Response, next: NextFunction) => void;

  export default inertia;
}

declare namespace Express {
  export interface Request {
    Inertia: import('inertia-node').Inertia;
  }

  export interface Response {
    inertia(component: string, props?: Record<string, any>): void;
    flash(type: 'success' | 'error' | 'info' | 'warning' | string, message: string): void;
  }
}
