import type { App, TFile } from 'obsidian';
import { Status } from '../Status';
import { Priority } from '../Task';
import { TaskModal } from '../TaskModal';
import { Task } from '../Task';

// TEST COMMENT
export const createAtIndex = async (app: App) => {
    const path = 'Tasks/Inbox.md';
    const file = app.vault.getAbstractFileByPath(path) as TFile;
    console.log('file', file);
    if (!file) {
        return;
    }
    console.log('got file');

    let content = await app.vault.read(file);
    const contentArray = content.split('\n');

    const onSubmit = async (updatedTasks: Task[]): Promise<void> => {
        const serialized = updatedTasks.map((task: Task) => task.toFileLineString()).join('\n');
        contentArray.splice(0, 0, serialized);
        content = contentArray.join('\n');
        await app.vault.modify(file, content);
    };

    const task = new Task({
        status: Status.TODO,
        description: '',
        path,
        indentation: '',
        listMarker: '-',
        priority: Priority.None,
        startDate: null,
        scheduledDate: null,
        dueDate: null,
        doneDate: null,
        recurrence: null,
        // We don't need the following fields to edit here in the editor.
        sectionStart: 0,
        sectionIndex: 0,
        precedingHeader: null,
        blockLink: '',
        tags: [],
        originalMarkdown: '',
        scheduledDateIsInferred: false,
    });
    // Need to create a new instance every time, as cursor/task can change.
    const taskModal = new TaskModal({
        app,
        task,
        onSubmit,
    });
    taskModal.open();
};
