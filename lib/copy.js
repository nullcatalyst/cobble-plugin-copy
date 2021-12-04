"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyPlugin = void 0;
const cobble = require("cobble");
const fs = require("fs");
class CopyPlugin extends cobble.BasePlugin {
    name() {
        return 'copy';
    }
    async process(watcher, settings) {
        const srcs = settings.srcs.filter(src => src.protocol == this.name());
        const outputDir = settings.outDir;
        const cleanupFns = srcs.map(src => {
            const rel = settings.basePath.relative(src.path);
            const dst = outputDir.join(rel);
            return watcher.add(src.path, async (event) => {
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
exports.CopyPlugin = CopyPlugin;
