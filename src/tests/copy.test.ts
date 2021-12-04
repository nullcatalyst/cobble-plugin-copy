import * as assert from 'assert';
import * as cobble from 'cobble';
import * as path from 'path';
import { CopyPlugin } from '../copy';

describe('copy plugin', () => {
    it('should clean up after itself', async () => {
        const basePath = cobble.ResolvedPath.absolute('/fake/path/that/does/not/exist', path.posix);

        const watcher = new cobble.FakeWatcher();
        const plugin = new CopyPlugin({ 'tmp': basePath, 'verbose': 0 });
        const settings = await cobble.BuildSettings.from(
            {
                'name': 'test',
                'srcs': [`${plugin.name()}:a.txt`, `${plugin.name()}:b.png`, `${plugin.name()}:subdir/c.cpp`],
            },
            {
                'basePath': basePath,
            },
        );

        const cleanup = await plugin.process(watcher, settings);
        assert.strictEqual(watcher.callbacks.size, 3);
        cleanup();
        assert.strictEqual(watcher.callbacks.size, 0);
    });
});
