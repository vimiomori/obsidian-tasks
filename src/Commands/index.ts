import type { App, Editor, Plugin, View } from 'obsidian';
import { createOrEdit } from './CreateOrEdit';
import { createAtIndex } from './CreateOrEditAtIndex';

import { toggleDone } from './ToggleDone';

export class Commands {
    private readonly plugin: Plugin;

    private get app(): App {
        return this.plugin.app;
    }

    constructor({ plugin }: { plugin: Plugin }) {
        this.plugin = plugin;

        plugin.addCommand({
            id: 'edit-task-at-index',
            name: 'Create or edit task at index',
            icon: 'pencil',
            callback: () => createAtIndex(this.app),
        });

        plugin.addCommand({
            id: 'edit-task',
            name: 'Create or edit task',
            icon: 'pencil',
            editorCheckCallback: (checking: boolean, editor: Editor, view: View) => {
                return createOrEdit(checking, editor, view, this.app);
            },
        });

        plugin.addCommand({
            id: 'toggle-done',
            name: 'Toggle task done',
            icon: 'check-in-circle',
            editorCheckCallback: toggleDone,
        });
    }
}
