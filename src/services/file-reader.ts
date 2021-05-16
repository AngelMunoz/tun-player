
export async function selectFiles() {
    let files = await (window as any).showOpenFilePicker({
        extensions: ['.mp3'],
        multiple: true,
        types: [{ description: 'Audio Files', accept: { 'audio/mp3': ['.mp3'] } }]
    })
    files = await Promise.all(files.map(async (file: any) => {
        const f = await file.getFile();
        f.handle = file;
        return f;
    }))
    return files;
}