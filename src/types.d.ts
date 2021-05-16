export type Page = 'Home' | 'Preferences';

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
