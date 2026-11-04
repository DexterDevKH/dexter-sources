/**
 * DexterDevKH Apps — Smooth Horizontal Scroll Engine for PC & Desktop
 * Converts vertical mouse wheel to buttery 60fps horizontal momentum scrolling
 * and adds 1:1 mouse drag-to-scroll (grab-to-scroll).
 * Prevents vertical page and background scrolling.
 */

export function enableHorizontalScroll(container: HTMLElement | null): void {
    if (!container) return;

    // Prevent duplicate binding
    if (container.dataset.hscrollAttached === 'true') return;
    container.dataset.hscrollAttached = 'true';

    let targetScrollLeft = container.scrollLeft;
    let animId: number | null = null;

    function step() {
        if (!container) {
            animId = null;
            return;
        }

        const current = container.scrollLeft;
        const diff = targetScrollLeft - current;

        // When sufficiently close, finish
        if (Math.abs(diff) < 0.6) {
            container.scrollLeft = targetScrollLeft;
            animId = null;
            return;
        }

        // Fluid cubic-like momentum damping (eases towards target position)
        container.scrollLeft = current + diff * 0.22;
        animId = requestAnimationFrame(step);
    }

    // 1. Mouse wheel mapping: delta -> horizontal momentum
    container.addEventListener(
        'wheel',
        (e: WheelEvent) => {
            // Only handle if container has horizontal scroll room
            if (container.scrollWidth <= container.clientWidth) return;

            // Completely stop propagation so the page and modal NEVER scroll vertically
            e.preventDefault();
            e.stopPropagation();

            // Extract delta from either deltaY or deltaX
            let delta = e.deltaY;
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                delta = e.deltaX;
            }

            // Normalize delta across browsers (Firefox line mode vs Chrome pixel mode)
            if (e.deltaMode === 1) {
                delta *= 32;
            }

            // Speed multiplier for comfortable, responsive travel
            const scrollSpeed = 1.25;
            const maxScroll = container.scrollWidth - container.clientWidth;

            // Update target scroll position clamped to bounds
            targetScrollLeft = Math.max(0, Math.min(maxScroll, targetScrollLeft + delta * scrollSpeed));

            if (animId === null) {
                animId = requestAnimationFrame(step);
            }
        },
        { passive: false }
    );

    // 2. Mouse Drag-to-Scroll (Click & Drag)
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    container.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.button !== 0) return; // Left mouse button only

        // Cancel any active wheel momentum animation on grab
        if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
        }

        isDown = true;
        hasDragged = false;
        startX = e.pageX;
        scrollStart = container.scrollLeft;
        targetScrollLeft = scrollStart;
        container.classList.add('is-dragging');
    });

    const onMouseUp = () => {
        if (!isDown) return;
        isDown = false;
        container.classList.remove('is-dragging');
        targetScrollLeft = container.scrollLeft;

        // Keep drag flag briefly to suppress accidental click/open actions
        setTimeout(() => {
            hasDragged = false;
        }, 80);
    };

    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDown) return;
        const delta = e.pageX - startX;

        if (Math.abs(delta) > 4) {
            hasDragged = true;
            e.preventDefault();
            container.scrollLeft = scrollStart - delta;
            targetScrollLeft = container.scrollLeft;
        }
    });

    // 3. Suppress click on slides if the user was dragging
    container.addEventListener(
        'click',
        (e: MouseEvent) => {
            if (hasDragged) {
                e.stopPropagation();
                e.preventDefault();
            }
        },
        true // Capture phase
    );

    // 4. Prevent native browser ghost image dragging
    container.addEventListener('dragstart', (e: DragEvent) => {
        e.preventDefault();
    });
}
