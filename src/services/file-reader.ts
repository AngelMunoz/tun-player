import { get, set, createStore, update } from "idb-keyval";
import type { FileSystemFileHandle, FileWithHandle } from "../types";



export async function selectFiles(): Promise<FileWithHandle[]> {
    let files = await window.showOpenFilePicker({
        extensions: ['.mp3'],
        multiple: true,
        types: [{ description: 'Audio Files', accept: { 'audio/mp3': ['.mp3'] } }]
    });
    files = await Promise.all(files.map(async (file: any) => {
        const f = await file.getFile();
        f.handle = file;
        return f;
    }));
    return files as unknown as FileWithHandle[];
}

const tunStore = createStore('playlistdb', 'tun-store');

export async function getExistingPlaylists(): Promise<string[]> {
    return (await get('playlists', tunStore)) ?? [];
}

export async function savePlaylist(playlistName: string, songs: FileWithHandle[]) {

    const existingPlaylists = await getExistingPlaylists();
    const playlist = existingPlaylists.find(existing => existing === playlistName);

    const handles = songs.map(song => song.handle).filter(f => f) as FileSystemFileHandle[];
    try {
        if (playlist) {
            await update(playlistName, () => handles, tunStore);
            return true;
        }
        await set(playlistName, handles, tunStore);
        await set('playlists', [...existingPlaylists, playlistName], tunStore);
        return true;
    } catch (error) {
        console.warn(`Failed to Save [${playlistName}]: ${error.message}`);
        return false;
    }
}

export async function getPlaylist(playlistName: string) {
    const files = await get<FileSystemFileHandle[]>(playlistName, tunStore);
    const playlist: (FileWithHandle | undefined)[] = await Promise.all(files?.map(async handle => {
        try {
            await handle.requestPermission({ mode: 'read' });
            const file = await handle.getFile();
            (file as FileWithHandle).handle = handle;
            return file as FileWithHandle;
        } catch (error) {
            console.warn(`Could not access ${handle.name}`);
        }
    }) ?? []);
    return playlist.filter(f => f) as FileWithHandle[];
}