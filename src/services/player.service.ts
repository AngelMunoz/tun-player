import type { FileWithHandle } from "../types";

export class PlayerService {
    #player: HTMLAudioElement = new Audio();

    get player() {
        return this.#player;
    }

    async play(song: FileWithHandle) {
        const url = URL.createObjectURL(song)
        this.player.src = url;
        await this.player.play();
        URL.revokeObjectURL(url);
    }

    pause() {
        this.player.pause();
    }

    stop() {
        this.player.srcObject = null;
        this.player.src = '';
    }

    seek(position: number) {
        this.player.fastSeek(position);
    }
}