import { observable, action, makeAutoObservable } from 'mobx'
import type { Page } from '../types';


class AppStore {

    @observable
    page: Page = 'Home';

    @observable
    title = "Tun Player"

    constructor() {
        makeAutoObservable(this);
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

}

export default new AppStore();