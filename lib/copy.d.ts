import { BuildSettings } from 'cobble/lib/composer/settings';
import { BasePlugin, ResetPluginWatchedFilesFn } from 'cobble/lib/plugins/base';
import { BaseWatcher } from 'cobble/lib/watcher/base';
export declare class CopyPlugin extends BasePlugin {
    constructor(opts?: any);
    name(): string;
    process(watcher: BaseWatcher, settings: BuildSettings): Promise<ResetPluginWatchedFilesFn>;
}
