"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyPlugin = void 0;
const base_1 = require("cobble/lib/plugins/base");
const mkdir_1 = require("cobble/lib/util/mkdir");
const fs = require("fs");
class CopyPlugin extends base_1.BasePlugin {
    constructor(opts) {
        super(opts);
    }
    name() {
        return 'copy';
    }
    async process(watcher, settings) {
        const srcs = settings.srcs.filter(src => src.protocol == this.name());
        const outputDir = settings.outputPath.dirname();
        const cleanupFns = srcs.map(src => {
            const rel = settings.basePath.relative(src.path);
            const dst = outputDir.join(rel);
            return watcher.add(src.path, async (event) => {
                await (0, mkdir_1.mkdir)(dst.dirname());
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
