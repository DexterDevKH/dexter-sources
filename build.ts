/**
 * DexterDevKH Apps — Production Bun Bundler
 * Compiles TypeScript source modules into optimized, minified production assets.
 */

import { gzipSync } from 'zlib';

console.log('⚡ Building DexterDevKH Apps web portal with Bun...');
const startTime = performance.now();

try {
    const buildResult = await Bun.build({
        entrypoints: ['./src/main.ts'],
        outdir: './dist',
        naming: 'app.min.js',
        minify: true,
        sourcemap: 'external',
        target: 'browser',
        format: 'esm'
    });

    if (!buildResult.success) {
        console.error('❌ Build failed:');
        for (const message of buildResult.logs) {
            console.error(message);
        }
        process.exit(1);
    }

    const elapsed = (performance.now() - startTime).toFixed(1);
    console.log(`✅ Build completed in ${elapsed}ms\n`);

    console.log('📦 Output Artifacts:');
    for (const output of buildResult.outputs) {
        const bytes = output.size;
        const kb = (bytes / 1024).toFixed(2);
        let gzippedKb = '';
        try {
            const buffer = Buffer.from(await output.arrayBuffer());
            const compressed = gzipSync(buffer);
            gzippedKb = ` (gzip: ${(compressed.length / 1024).toFixed(2)} KB)`;
        } catch {}

        console.log(`   • ${output.path} — ${kb} KB${gzippedKb}`);
    }

    console.log('\n🚀 Production build ready in ./dist/app.min.js');
} catch (err) {
    console.error('❌ Unexpected build exception:', err);
    process.exit(1);
}

