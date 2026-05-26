import { type App, setIcon } from 'obsidian';
import { Modal } from 'obsidian';

import EditTask from '../ui/EditTask.svelte';
import type { Task } from '../Task/Task';
export class TaskModal extends Modal {
    public readonly task: Task;
    public readonly onSubmit: (updatedTasks: Task[], updatedTask?: Task) => void | Promise<void>;
    public readonly allTasks: Task[];

    constructor({
        app,
        task,
        onSubmit,
        allTasks,
    }: {
        app: App;
        task: Task;
        onSubmit: (updatedTasks: Task[], updatedTask?: Task) => void | Promise<void>;
        allTasks: Task[];
    }) {
        super(app);

        this.task = task;
        this.allTasks = allTasks;
        this.onSubmit = (updatedTasks: Task[], updatedTask?: Task) => {
            updatedTasks.length && onSubmit(updatedTasks, updatedTask);
            this.close();
        };
    }

    public onOpen(): void {
        this.titleEl.setText('Create or edit Task');
        this.modalEl.style.paddingBottom = '0';

        const optionsButton = document.createElement('button');
        // Add same classes as the default Obsidian modal close button.
        optionsButton.addClasses(['modal-close-button', 'mod-raised', 'clickable-icon']);
        // But overload the 'inset-inline-end' property for a correct position.
        optionsButton.addClass('modal-option-button');
        setIcon(optionsButton, 'settings');
        optionsButton.onclick = () => {
            const optionsModal = new OptionsModal({
                app: this.app,
                onSave: () => {
                    this.onSaveSettings();
                },
            });
            optionsModal.open();
        };
        this.modalEl.appendChild(optionsButton);

        const { contentEl } = this;
        this.contentEl.style.paddingBottom = '0';

        // const statusOptions = this.getKnownStatusesAndCurrentTaskStatusIfNotKnown();

        new EditTask({
            target: contentEl,
            props: {
                task: this.task,
                // statusOptions: statusOptions,
                onSubmit: this.onSubmit,
                allTasks: this.allTasks,
            },
        });
    }

    /**
     * If the task being edited has an unknown status, make sure it is added
     * to the dropdown list.
     * This allows the user to switch to a different status and then change their
     * mind and return to the initial status.
     */
    // private getKnownStatusesAndCurrentTaskStatusIfNotKnown() {
    //     const statusOptions: Status[] = StatusRegistry.getInstance().registeredStatuses;
    //     if (StatusRegistry.getInstance().bySymbol(this.task.status.symbol) === Status.EMPTY) {
    //         statusOptions.push(this.task.status);
    //     }
    //     return statusOptions;
    // }

    public onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}
