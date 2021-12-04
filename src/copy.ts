import * as cobble from 'cobble';
import * as fs from 'fs';

export class CopyPlugin extends cobble.BasePlugin {
    override name(): string {
        return 'copy';
    }

    override async process(
        watcher: cobble.BaseWatcher,
        settings: cobble.BuildSettings,
    ): Promise<cobble.ResetPluginWatchedFilesFn> {
        const srcs = settings.srcs.filter(src => src.protocol == this.name());
        const outputDir = settings.outDir;

        const cleanupFns = srcs.map(src => {
            const rel = settings.basePath.relative(src.path);
            const dst = outputDir.join(rel);

            return watcher.add(src.path, async event => {
                await cobble.mkdir(dst.dirname());
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
