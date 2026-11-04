export class Toast {
    private static toastEl: HTMLElement | null = null;
    private static messageEl: HTMLElement | null = null;
    private static timeoutId: number | null = null;

    public static init(): void {
        this.toastEl = document.getElementById('toastPill');
        this.messageEl = document.getElementById('toastMessage');
    }

    public static show(message: string, durationMs: number = 2400): void {
        if (!this.toastEl || !this.messageEl) {
            this.init();
        }

        if (!this.toastEl || !this.messageEl) return;

        this.messageEl.textContent = message;
        this.toastEl.classList.remove('hidden');
        this.toastEl.classList.add('visible');

        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
        }

        this.timeoutId = window.setTimeout(() => {
            if (this.toastEl) {
                this.toastEl.classList.remove('visible');
                setTimeout(() => {
                    this.toastEl?.classList.add('hidden');
                }, 250);
            }
            this.timeoutId = null;
        }, durationMs);
    }
}

