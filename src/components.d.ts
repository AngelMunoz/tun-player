import type { TunPlayer } from "./components/tun-player";
import type { TunPlaylist } from "./components/tun-playlist";
import type { TunHome, TunSettings } from "./pages";

declare global {
    interface HTMLElementTagNameMap {
        'tun-player': TunPlayer;
        'tun-playlist': TunPlaylist;
        'tun-home': TunHome;
        'tun-settings': TunSettings
    }
}