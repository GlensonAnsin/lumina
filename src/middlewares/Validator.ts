import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import ApiResponse from '../utils/ApiResponse.js';

class Validator {
  /**
   * Validates the request body against a Zod schema.
   */
  public validate(schema: ZodType<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          // Check if it's an Inertia request or standard Web request
          if (req.header('X-Inertia') || req.accepts('html')) {
            const errors: Record<string, string> = {};
            error.issues.forEach((err) => {
              const path = err.path.join('.');
              errors[path] = err.message;
            });

            res.cookie('inertia_errors', JSON.stringify(errors), { 
              httpOnly: true, 
              maxAge: 60000 
            });
            
            return res.redirect('back');
          }

          const formattedErrors = error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return ApiResponse.error(res, 'Validation Failed', 422, formattedErrors);
        }
        next(error);
      }
    };
  }
}

export default new Validator();