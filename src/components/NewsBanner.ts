import { store } from '../state/store';

export class NewsBanner {
    public static init(): void {
        const banner = document.getElementById('newsBanner');
        const headline = document.getElementById('newsHeadline');
        const caption = document.getElementById('newsCaption');
        const closeBtn = document.getElementById('newsCloseBtn');

        if (!banner || !headline || !caption) return;

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                banner.classList.add('hidden');
                store.setState({ isNewsDismissed: true });
            });
        }

        const render = (): void => {
            const state = store.getState();
            if (state.isNewsDismissed) {
                banner.classList.add('hidden');
                return;
            }

            const latestNews = state.manifest.news?.[0];
            if (latestNews && latestNews.title) {
                headline.textContent = latestNews.title;
                caption.textContent = latestNews.caption || 'Latest builds and release updates.';

                if (latestNews.tintColor) {
                    const color = latestNews.tintColor.startsWith('#')
                        ? latestNews.tintColor
                        : `#${latestNews.tintColor}`;
                    banner.style.setProperty('--news-accent', color);
                }

                banner.classList.remove('hidden');
            } else {
                banner.classList.add('hidden');
            }
        };

        store.select(
            (s) => s.manifest.news,
            () => render()
        );

        render();
    }
}

