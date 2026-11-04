import { ThemeService } from '../services/themeService';
import { store } from '../state/store';

export class Header {
    public static init(onOpenQrModal: () => void): void {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                ThemeService.toggle();
            });
        }

        const qrBtn = document.getElementById('qrLauncherBtn');
        if (qrBtn) {
            qrBtn.addEventListener('click', () => {
                onOpenQrModal();
            });
        }

        // Tactical Telemetry Live Clock
        const clockEl = document.getElementById('telemetryClock');
        if (clockEl) {
            const updateClock = () => {
                const now = new Date();
                const hours = String(now.getUTCHours()).padStart(2, '0');
                const mins = String(now.getUTCMinutes()).padStart(2, '0');
                const secs = String(now.getUTCSeconds()).padStart(2, '0');
                clockEl.textContent = `${hours}:${mins}:${secs} UTC`;
            };
            updateClock();
            setInterval(updateClock, 1000);
        }

        // Keep status indicator synced
        const statusLabel = document.getElementById('statusLabel');
        if (statusLabel) {
            store.select(
                (s) => s.manifest.apps.length,
                (count) => {
                    statusLabel.textContent = count > 0 ? 'SYSTEM ONLINE' : 'ESTABLISHING LINK...';
                }
            );
        }
    }
}
