import * as cobble from 'cobble';
export declare class CopyPlugin extends cobble.BasePlugin {
    name(): string;
    process(watcher: cobble.BaseWatcher, settings: cobble.BuildSettings): Promise<cobble.ResetPluginWatchedFilesFn>;
}
