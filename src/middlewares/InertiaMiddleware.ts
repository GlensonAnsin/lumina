import { Request, Response, NextFunction } from 'express';
import inertia from 'inertia-node';
import fs from 'fs';
import path from 'path';
import env from '../config/env.js';

export default class InertiaMiddleware {
  public static handle(req: Request, res: Response, next: NextFunction): void {
    const htmlPath = path.join(process.cwd(), 'resources', 'views', 'app.html');
    let template = fs.readFileSync(htmlPath, 'utf-8');

    // Vite Integration for Dev vs Prod
    let viteAssets = '';
    const isDev = env.NODE_ENV === 'development';

    if (isDev) {
      viteAssets = `
        <script type="module">
          import RefreshRuntime from 'http://localhost:5173/@react-refresh'
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script type="module" src="http://localhost:5173/@vite/client"></script>
        <script type="module" src="http://localhost:5173/resources/js/app.tsx"></script>
      `;
    } else {
      try {
        const manifestPath = path.join(process.cwd(), 'public', 'build', '.vite', 'manifest.json');
        if (fs.existsSync(manifestPath)) {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            const mainAsset = manifest['resources/js/app.tsx'];
            
            if (mainAsset) {
                viteAssets = `<script type="module" src="/build/${mainAsset.file}"></script>`;
                if (mainAsset.css) {
                    mainAsset.css.forEach((cssFile: string) => {
                        viteAssets += `\n<link rel="stylesheet" href="/build/${cssFile}" />`;
                    });
                }
            }
        }
      } catch (e) {
          console.error("Failed to load Vite manifest", e);
      }
    }

    // Replace the vite injected assets
    template = template.replace('{{viteAssets}}', viteAssets);

    const inertiaMiddleware = inertia((encodedPage: string) => {
        // inertia-node already encodes the page JSON, so we just inject it
        return template.replace('{{page}}', encodedPage);
    }, process.env.INERTIA_VERSION || '1.0.0');

    return inertiaMiddleware(req, res, () => {
        // Add res.inertia helper to the response object
        res.inertia = (component: string, props: any = {}) => {
            // @ts-ignore - req.Inertia is added by inertia-node
            req.Inertia.render({ component, props });
        };
        next();
    });
  }
}
