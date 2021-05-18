export type Page = 'Home' | 'Preferences';
export type SongRequest = 'Previous' | 'Next' | 'Current';


export interface FileWithHandle extends File {
    handle?: FileSystemHandle;
}

export interface FileSystemHandlePermissionDescriptor {
    mode?: 'read' | 'readwrite';
}

export interface FileSystemHandle {
    readonly kind: 'file' | 'directory';
    readonly name: string;

    isSameEntry: (other: FileSystemHandle) => Promise<boolean>;

    queryPermission: (
        descriptor?: FileSystemHandlePermissionDescriptor
    ) => Promise<PermissionState>;
    requestPermission: (
        descriptor?: FileSystemHandlePermissionDescriptor
    ) => Promise<PermissionState>;
}
export interface FileSystemCreateWritableOptions {
    keepExistingData: boolean;
};

export interface FileSystemFileHandle extends FileSystemHandle {
    getFile(): Promise<File>;
    createWritable(options?: Partial<FileSystemCreateWritableOptions>): Promise<FileSystemWritableFileStream>;
};

declare global {


    interface Window {
        showOpenFilePicker(options: Partial<OpenFilePickerOptions>): Promise<FileSystemFileHandle[]>;
        showSaveFilePicker(options: Partial<SaveFilePickerOptions>): Promise<FileSystemFileHandle>;
        showDirectoryPicker(options: Partial<DirectoryPickerOptions>): Promise<FileSystemDirectoryHandle>;
    }
    interface FilePickerAcceptType {
        description?: string;
        accept?: Record<string, string | string[]>;
    };

    interface FilePickerOptions {
        types?: FilePickerAcceptType[];
        excludeAcceptAllOption?: boolean;
        extensions?: string[];
    };

    interface OpenFilePickerOptions extends FilePickerOptions {
        multiple?: boolean;
    };

    interface SaveFilePickerOptions extends FilePickerOptions {
    };

    interface DirectoryPickerOptions {
    };
}

