import type { CategoryFilter } from '../types';
import { store } from '../state/store';

export class SearchAndFilter {
    public static init(): void {
        const searchInput = document.getElementById('appSearchInput') as HTMLInputElement | null;
        const clearBtn = document.getElementById('searchClearBtn');
        const filterTabs = document.querySelectorAll<HTMLButtonElement>('.filter-tab');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.trim().toLowerCase();
                store.setState({ searchQuery: query });

                if (clearBtn) {
                    clearBtn.classList.toggle('hidden', query.length === 0);
                }
            });

            // Keyboard shortcut '/' to search
            window.addEventListener('keydown', (e) => {
                if (
                    e.key === '/' &&
                    document.activeElement !== searchInput &&
                    !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''))
                ) {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }

                if (e.key === 'Escape' && document.activeElement === searchInput) {
                    searchInput.value = '';
                    store.setState({ searchQuery: '' });
                    if (clearBtn) clearBtn.classList.add('hidden');
                    searchInput.blur();
                }
            });
        }

        if (clearBtn && searchInput) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                store.setState({ searchQuery: '' });
                clearBtn.classList.add('hidden');
                searchInput.focus();
            });
        }

        filterTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const filter = (tab.getAttribute('data-filter') || 'all') as CategoryFilter;
                store.setState({ activeCategory: filter });
            });
        });

        // Sync tab styling with store
        store.select(
            (s) => s.activeCategory,
            (cat) => {
                filterTabs.forEach((tab) => {
                    const match = tab.getAttribute('data-filter') === cat;
                    tab.classList.toggle('active', match);
                });
            }
        );

        // When switching sources, hide music tab if manifest doesn't have music apps
        store.select(
            (s) => s.currentSourceKey,
            (key) => {
                const musicTabs = document.querySelectorAll<HTMLButtonElement>('.filter-tab[data-filter="music"]');
                musicTabs.forEach((tab) => {
                    tab.style.display = key === 'dtkace' ? 'none' : '';
                });
                if (key === 'dtkace' && store.getState().activeCategory === 'music') {
                    store.setState({ activeCategory: 'all' });
                }
            }
        );
    }
}

