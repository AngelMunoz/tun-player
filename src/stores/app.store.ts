import { observable, action, makeAutoObservable, flow, runInAction } from 'mobx'
import { selectFiles } from '../services/file-reader';
import type { FileWithHandle, Page } from '../types';


class AppStore {
    @observable
    _index?: number;

    @observable
    page: Page = 'Home';

    @observable
    title = "Tun Player"

    @observable
    currentSong?: FileWithHandle;

    @observable
    playlist: FileWithHandle[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    @flow
    *loadSongs(): Generator<Promise<FileWithHandle[]>, void, FileWithHandle[]> {
        try {
            const files = yield selectFiles();
            this.playlist.push(...files);
        } catch (error) {
            console.warn(error)
        }
    }

    @action
    setPage(page: Page) {
        this.page = page;
    }

    @action
    setTitle(title: string) {
        if (!title) { this.title = "Tun Player"; return; }
        this.title = `Tun Player | ${title}`;
    }

    @action
    setFile(file: FileWithHandle) {
        if (!file) return;
        const index = this.playlist.findIndex(f => f.name === file.name);
        this.currentSong = file;
        this._index = index;
    }

    @action
    nextSong() {
        const song = this.playlist[(this._index ?? -2) + 1];
        if (!song) return;
        this._index = this._index as number + 1;
        this.currentSong = song;
        return song;
    }

    @action
    previousSong() {
        const song = this.playlist[(this._index ?? -1) - 1];
        if (!song) return;
        this._index = this._index as number - 1;
        this.currentSong = song;
        return song;
    }


}

export default new AppStore();