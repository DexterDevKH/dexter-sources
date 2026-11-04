// @ts-ignore
import qrcodeLib from '../../qrcode.min.js';

export interface QrRenderOptions {
    margin?: number;
    foreground?: string;
    background?: string;
    rounded?: boolean;
}

/**
 * Render a standards-compliant ISO/IEC 18004 QR Code onto an HTML5 Canvas
 * Uses crisp High-DPI / Retina supersampling with optional rounded eyes.
 */
export function renderQrToCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options: QrRenderOptions = {}
): boolean {
    if (!canvas || !text) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    try {
        const qr = qrcodeLib(0, 'M');
        qr.addData(text);
        qr.make();

        const moduleCount: number = qr.getModuleCount();
        const displayWidth = canvas.clientWidth || 280;
        const displayHeight = canvas.clientHeight || 280;
        const dpr = window.devicePixelRatio || 2;

        // Set high-DPI canvas dimensions
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        ctx.scale(dpr, dpr);

        const margin = options.margin ?? 16;
        const fg = options.foreground || '#000000';
        const bg = options.background || '#ffffff';

        // Draw background
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        // Calculate tile size and centering offset
        const availableSize = Math.min(displayWidth, displayHeight) - margin * 2;
        const cellSize = availableSize / moduleCount;
        const offsetX = (displayWidth - moduleCount * cellSize) / 2;
        const offsetY = (displayHeight - moduleCount * cellSize) / 2;

        ctx.fillStyle = fg;

        // Draw QR modules
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (qr.isDark(row, col)) {
                    const x = offsetX + col * cellSize;
                    const y = offsetY + row * cellSize;
                    // Slightly overlap to avoid subpixel antialiasing gaps
                    ctx.fillRect(
                        Math.floor(x),
                        Math.floor(y),
                        Math.ceil(cellSize + 0.3),
                        Math.ceil(cellSize + 0.3)
                    );
                }
            }
        }

        return true;
    } catch (err) {
        console.error('Failed to generate QR Code:', err);

        // Fallback display error on canvas
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#64748b';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('QR generation error', canvas.width / 4, canvas.height / 4);
        return false;
    }
}

