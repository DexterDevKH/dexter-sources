export class LightboxModal {
    private static modal: HTMLElement | null = null;
    private static imageEl: HTMLImageElement | null = null;
    private static counterEl: HTMLElement | null = null;
    private static prevBtn: HTMLElement | null = null;
    private static nextBtn: HTMLElement | null = null;

    private static images: string[] = [];
    private static currentIndex: number = 0;
    private static currentTitle: string = 'Screenshot';
    private static touchStartX: number = 0;

    public static init(): void {
        this.modal = document.getElementById('screenshotPreviewModal');
        this.imageEl = document.getElementById('lightboxImage') as HTMLImageElement | null;
        this.counterEl = document.getElementById('lightboxCounter');
        this.prevBtn = document.getElementById('lightboxPrevBtn');
        this.nextBtn = document.getElementById('lightboxNextBtn');

        const closeBtn = document.getElementById('lightboxCloseBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target === document.getElementById('lightboxContainer')) {
                    this.close();
                }
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prev();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });
        }

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (!this.isOpen()) return;

            if (e.key === 'Escape') {
                this.close();
            } else if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });

        // Touch swipe handling for mobile
        if (this.modal) {
            this.modal.addEventListener(
                'touchstart',
                (e) => {
                    this.touchStartX = e.changedTouches[0].screenX;
                },
                { passive: true }
            );

            this.modal.addEventListener(
                'touchend',
                (e) => {
                    const touchEndX = e.changedTouches[0].screenX;
                    const diff = touchEndX - this.touchStartX;
                    if (Math.abs(diff) > 40) {
                        if (diff > 0) {
                            this.prev();
                        } else {
                            this.next();
                        }
                    }
                },
                { passive: true }
            );
        }
    }

    public static open(urls: string[], initialIndex: number = 0, title: string = 'Screenshot'): void {
        if (!urls || urls.length === 0) return;
        this.images = urls;
        this.currentTitle = title;
        this.currentIndex = Math.max(0, Math.min(initialIndex, urls.length - 1));

        this.renderImage();
        this.modal?.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    public static close(): void {
        this.modal?.classList.add('hidden');
        setTimeout(() => {
            if (!document.querySelector('.modal-backdrop:not(.hidden)')) {
                document.body.classList.remove('modal-open');
            }
        }, 10);
    }

    public static isOpen(): boolean {
        return !!this.modal && !this.modal.classList.contains('hidden');
    }

    private static prev(): void {
        if (this.images.length <= 1) return;
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.renderImage();
    }

    private static next(): void {
        if (this.images.length <= 1) return;
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.renderImage();
    }

    private static renderImage(): void {
        if (!this.imageEl) return;
        const url = this.images[this.currentIndex];
        this.imageEl.src = url;
        this.imageEl.alt = `${this.currentTitle} (${this.currentIndex + 1} of ${this.images.length})`;

        if (this.counterEl) {
            this.counterEl.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        }

        // Toggle prev/next buttons visibility if only 1 image
        const hasMultiple = this.images.length > 1;
        if (this.prevBtn) this.prevBtn.style.display = hasMultiple ? '' : 'none';
        if (this.nextBtn) this.nextBtn.style.display = hasMultiple ? '' : 'none';
    }
}
