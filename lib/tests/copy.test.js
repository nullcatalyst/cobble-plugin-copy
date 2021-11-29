"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const settings_1 = require("cobble/lib/composer/settings");
const resolved_path_1 = require("cobble/lib/util/resolved_path");
const fake_1 = require("cobble/lib/watcher/fake");
const path = require("path");
const copy_1 = require("../copy");
describe('copy plugin', () => {
    it('should clean up after itself', async () => {
        const basePath = resolved_path_1.ResolvedPath.absolute('/fake/path/that/does/not/exist', path.posix);
        const watcher = new fake_1.FakeWatcher();
        const plugin = new copy_1.CopyPlugin();
        const settings = new settings_1.BuildSettings('linux');
        await settings.load({
            'name': 'test',
            'srcs': [`${plugin.name()}:a.txt`, `${plugin.name()}:b.png`, `${plugin.name()}:subdir/c.cpp`],
        }, basePath.join('build.json'));
        const cleanup = await plugin.process(watcher, settings);
        assert.strictEqual(watcher.callbacks.size, 3);
        cleanup();
        assert.strictEqual(watcher.callbacks.size, 0);
    });
});
