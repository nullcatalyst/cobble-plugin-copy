import { BuildSettings } from 'cobble/lib/composer/settings';
import { BasePlugin, ResetPluginWatchedFilesFn } from 'cobble/lib/plugins/base';
import { mkdir } from 'cobble/lib/util/mkdir';
import { BaseWatcher } from 'cobble/lib/watcher/base';
import * as fs from 'fs';

export class CopyPlugin extends BasePlugin {
    constructor(opts?: any) {
        super(opts);
    }

    name(): string {
        return 'copy';
    }

    async process(watcher: BaseWatcher, settings: BuildSettings): Promise<ResetPluginWatchedFilesFn> {
        const srcs = settings.srcs.filter(src => src.protocol == this.name());
        const outputDir = settings.outputPath.dirname();

        const cleanupFns = srcs.map(src => {
            const rel = settings.basePath.relative(src.path);
            const dst = outputDir.join(rel);

            return watcher.add(src.path, async event => {
                await mkdir(dst.dirname());
                await fs.promises.copyFile(src.path.toString(), dst.toString());
            });
        });

        return () => {
            for (const cleanupFn of cleanupFns) {
                cleanupFn();
            }
        };
    }
}
