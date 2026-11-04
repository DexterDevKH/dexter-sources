import { store } from '../state/store';

export class Hero {
    public static init(): void {
        const avatarImg = document.getElementById('heroAvatarImg') as HTMLImageElement | null;
        if (avatarImg) {
            avatarImg.src = 'icons/profile.png';
            avatarImg.alt = 'DexterDevKH Apps';
            avatarImg.onerror = () => {
                avatarImg.onerror = null;
                avatarImg.src = 'https://github.com/DexterDevKH.png';
            };
        }

        const appCountText = document.getElementById('appCountText');
        if (appCountText) {
            const updateCount = (count: number) => {
                appCountText.textContent = `${count} ${count === 1 ? 'App' : 'Apps'} Available`;
            };

            store.select(
                (s) => s.manifest.apps.length,
                (count) => updateCount(count)
            );

            // Initial render
            updateCount(store.getState().manifest.apps.length);
        }
    }
}
