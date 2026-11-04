/**
 * DexterDevKH Apps — Modern Bun Development & Preview Server
 * Native Bun.serve() with on-demand TypeScript bundling, CORS support,
 * and live-reload WebSocket in development mode.
 */

import { watch } from 'fs';
import { resolve, extname } from 'path';

const isPreview = process.argv.includes('--preview');
const PORT = Number(process.env.PORT) || 3000;
const HOST = 'localhost';

const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.map': 'application/json; charset=utf-8'
};

const liveReloadClients = new Set<any>();

// Rebuild on change in dev mode
let isRebuilding = false;
async function rebuildBundle(): Promise<boolean> {
    if (isRebuilding) return false;
    isRebuilding = true;
    try {
        const res = await Bun.build({
            entrypoints: ['./src/main.ts'],
            outdir: './dist',
            naming: 'app.min.js',
            minify: false,
            sourcemap: 'inline',
            target: 'browser',
            format: 'esm'
        });
        isRebuilding = false;
        return res.success;
    } catch (err) {
        console.error('⚠️ Rebuild error:', err);
        isRebuilding = false;
        return false;
    }
}

// Watch src/ and style.css in development mode
if (!isPreview) {
    const watcher = watch(resolve(import.meta.dir, 'src'), { recursive: true }, async () => {
        console.log('🔄 Source change detected, rebuilding...');
        const success = await rebuildBundle();
        if (success) {
            for (const client of liveReloadClients) {
                try {
                    client.send(JSON.stringify({ type: 'reload' }));
                } catch {}
            }
        }
    });

    watch(resolve(import.meta.dir, 'style.css'), () => {
        console.log('🎨 CSS change detected, notifying clients...');
        for (const client of liveReloadClients) {
            try {
                client.send(JSON.stringify({ type: 'reload-css' }));
            } catch {}
        }
    });
}

const server = Bun.serve({
    port: PORT,
    hostname: HOST,

    websocket: {
        open(ws) {
            liveReloadClients.add(ws);
        },
        close(ws) {
            liveReloadClients.delete(ws);
        },
        message() {}
    },

    async fetch(req, server) {
        const url = new URL(req.url);

        // Live-reload websocket upgrade
        if (url.pathname === '/__live_reload') {
            const upgraded = server.upgrade(req);
            if (upgraded) return undefined;
            return new Response('WebSocket upgrade required', { status: 400 });
        }

        let pathname = url.pathname;
        if (pathname === '/' || pathname === '') {
            pathname = '/index.html';
        }

        // On-the-fly rebuild for /dist/app.min.js in dev mode
        if (!isPreview && pathname === '/dist/app.min.js') {
            await rebuildBundle();
        }

        const filePath = resolve(import.meta.dir, `.${pathname}`);
        const file = Bun.file(filePath);

        const exists = await file.exists();
        if (!exists) {
            return new Response('404 Not Found', { status: 404 });
        }

        const ext = extname(pathname).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Add Live-Reload client script to HTML in dev mode
        if (!isPreview && ext === '.html') {
            let html = await file.text();
            const liveScript = `
                <script>
                    (function() {
                        const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
                        const ws = new WebSocket(proto + '//' + location.host + '/__live_reload');
                        ws.onmessage = function(e) {
                            try {
                                const data = JSON.parse(e.data);
                                if (data.type === 'reload') {
                                    location.reload();
                                } else if (data.type === 'reload-css') {
                                    const links = document.querySelectorAll('link[rel="stylesheet"]');
                                    links.forEach(l => {
                                        const href = l.getAttribute('href');
                                        if (href) {
                                            l.setAttribute('href', href.split('?')[0] + '?_t=' + Date.now());
                                        }
                                    });
                                }
                            } catch {}
                        };
                        ws.onclose = () => setTimeout(() => location.reload(), 2000);
                    })();
                </script>
            `;
            html = html.replace('</body>', `${liveScript}</body>`);
            return new Response(html, {
                headers: {
                    'Content-Type': contentType,
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache'
                }
            });
        }

        return new Response(file, {
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': isPreview ? 'public, max-age=3600' : 'no-cache'
            }
        });
    }
});

console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║   ⚡ DexterDevKH Apps — Bun Web Portal                             ║
║   Mode:     ${isPreview ? 'Production Preview' : 'Development (Live-Reload)'}                       ║
║   Local:    http://${HOST}:${PORT}/                                   ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
`);

