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

        // Keep status indicator synced
        const statusLabel = document.getElementById('statusLabel');
        if (statusLabel) {
            store.select(
                (s) => s.manifest.apps.length,
                (count) => {
                    statusLabel.textContent = count > 0 ? 'Live Repository' : 'Connecting...';
                }
            );
        }
    }
}
