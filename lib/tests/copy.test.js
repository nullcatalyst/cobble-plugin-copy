"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const cobble = require("cobble");
const path = require("path");
const copy_1 = require("../copy");
describe('copy plugin', () => {
    it('should clean up after itself', async () => {
        const basePath = cobble.ResolvedPath.absolute('/fake/path/that/does/not/exist', path.posix);
        const watcher = new cobble.FakeWatcher();
        const plugin = new copy_1.CopyPlugin({ 'tmp': basePath, 'verbose': 0 });
        const settings = await cobble.BuildSettings.from({
            'name': 'test',
            'srcs': [`${plugin.name()}:a.txt`, `${plugin.name()}:b.png`, `${plugin.name()}:subdir/c.cpp`],
        }, {
            'basePath': basePath,
        });
        const cleanup = await plugin.process(watcher, settings);
        assert.strictEqual(watcher.callbacks.size, 3);
        cleanup();
        assert.strictEqual(watcher.callbacks.size, 0);
    });
});
