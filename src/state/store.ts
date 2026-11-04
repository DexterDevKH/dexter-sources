import type { AppState, SourceKey, ThemeMode, CategoryFilter, QrTargetKey } from '../types';
import { DEFAULT_SOURCE_URL, FALLBACK_MANIFESTS } from '../constants';

type StateListener = (state: AppState, prevState: AppState) => void;

class Store {
    private state: AppState;
    private listeners: Set<StateListener> = new Set();

    constructor() {
        this.state = {
            currentSourceKey: 'main',
            currentSourceUrl: DEFAULT_SOURCE_URL,
            manifest: FALLBACK_MANIFESTS.main,
            activeCategory: 'all',
            searchQuery: '',
            theme: 'dark',
            activeQrTarget: 'sidestore',
            selectedApp: null,
            lightboxImages: [],
            lightboxIndex: 0,
            isNewsDismissed: false
        };
    }

    public getState(): Readonly<AppState> {
        return this.state;
    }

    public setState(partial: Partial<AppState>): void {
        const prevState = { ...this.state };
        this.state = { ...this.state, ...partial };
        for (const listener of this.listeners) {
            listener(this.state, prevState);
        }
    }

    public subscribe(listener: StateListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    public select<T>(
        selector: (state: AppState) => T,
        callback: (value: T, prevValue: T) => void
    ): () => void {
        let prevVal = selector(this.state);
        return this.subscribe((state) => {
            const currentVal = selector(state);
            if (currentVal !== prevVal) {
                const old = prevVal;
                prevVal = currentVal;
                callback(currentVal, old);
            }
        });
    }
}

export const store = new Store();

