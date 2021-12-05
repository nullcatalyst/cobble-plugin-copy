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
        const srcs = this.filterSrcs(settings);
        if (srcs.length == 0) {
            return () => {};
        }

        const outputDir = settings.outDir;
        const cleanupFns = srcs.map(src => {
            let dst: cobble.ResolvedPath;
            if (src.path.toString().startsWith(settings.basePath.toString())) {
                // The src exists under the base path, copy the file along with its relative path
                const rel = settings.basePath.relative(src.path);
                dst = outputDir.join(rel);
            } else {
                // The src is outside the base path, copy only the file to the output directory
                dst = outputDir.join(src.path.basename);
            }

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
