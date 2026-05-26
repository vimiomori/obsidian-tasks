import { MenuItem, Notice } from 'obsidian';
import { Task } from '../../Task/Task';
import { Priority } from '../../Task/Priority';
import { PriorityTools } from '../../lib/PriorityTools';
import { allPriorityInstructions } from '../EditInstructions/PriorityInstructions';
import { TaskEditingMenu, type TaskSaver, defaultTaskSaver } from './TaskEditingMenu';

/**
 * A Menu of options for editing the status of a Task object.
 *
 * @example
 *     editTaskPencil.addEventListener('contextmenu', (ev: MouseEvent) => {
 *         showMenu(ev, new PriorityMenu(task));
 *     });
 *     editTaskPencil.setAttribute('title', 'Right-click for options');
 */
export class PriorityMenu extends TaskEditingMenu {
    /**
     * Constructor, which sets up the menu items.
     * @param task - the Task to be edited.
     * @param taskSaver - an optional {@link TaskSaver} function. For details, see {@link TaskEditingMenu}.
     */
    constructor(button: HTMLAnchorElement, task: Task, taskSaver: TaskSaver = defaultTaskSaver) {
        super(taskSaver);

        const priorityIncDecCallback = (button: HTMLAnchorElement, item: MenuItem, amount: number) => {
            if (amount > 0) {
                item.setTitle('Increase priority');
            } else {
                item.setTitle('Decrease priority');
            }

            item.onClick(() => PriorityMenu.priorityOnClickCallback(button, task, amount, taskSaver));
        };

        if (task.priority !== Priority.Highest) {
            this.addItem((item) => priorityIncDecCallback(button, item, 1)); // increase
        }
        if (task.priority !== Priority.Lowest) {
            this.addItem((item) => priorityIncDecCallback(button, item, -1)); // decrease
        }
        this.addSeparator();
        this.addItemsForInstructions(allPriorityInstructions(), task);
    }

    public static async priorityOnClickCallback(
        button: HTMLAnchorElement,
        task: Task,
        incDec: number = 1,
        taskSaver: TaskSaver = defaultTaskSaver,
    ) {
        if (incDec >= 1 && task.priority === Priority.Highest) {
            const errorMessage = '⚠️ Priority already at the highest';
            return new Notice(errorMessage, 10000);
        }

        const updatedTask = priorityUpFunction(task, incDec);

        await taskSaver(task, updatedTask);
        PriorityMenu.postponeSuccessCallback(button, updatedTask.priority);
    }

    // public static async setPriorityCallback(
    //     button: HTMLAnchorElement,
    //     task: Task,
    //     priority: Priority,
    //     taskSaver: TaskSaver = defaultTaskSaver,
    // ) {
    //     const updatedTask = new Task({
    //         ...task,
    //         priority: priority,
    //     });
    //
    //     await taskSaver(task, updatedTask);
    //     PriorityMenu.postponeSuccessCallback(button, updatedTask.priority);
    // }

    private static postponeSuccessCallback(button: HTMLAnchorElement, updatedPriority: Priority) {
        // Disable the button to prevent update error due to the task not being reloaded yet.
        button.style.pointerEvents = 'none';

        const successMessage = priorityUpSuccessMessage(updatedPriority);
        new Notice(successMessage, 2000);
    }
}

const priorityUpFunction = (task: Task, incDec: number): Task => {
    const newPriority = String(Number(task.priority) - incDec) as Priority;
    console.log(newPriority);
    // let newPriority = task.priority;
    // switch (task.priority) {
    //     case Priority.Lowest:
    //         newPriority = Priority.Low;
    //         break;
    //     case Priority.Low:
    //         newPriority = Priority.None;
    //         break;
    //     case Priority.None:
    //         newPriority = Priority.Medium;
    //         break;
    //     case Priority.Medium:
    //         newPriority = Priority.High;
    //         break;
    //     case Priority.High:
    //         newPriority = Priority.Highest;
    //         break;
    //     default:
    //         break;
    // }
    return new Task({
        ...task,
        priority: newPriority,
    });
};

export function priorityUpSuccessMessage(newPriority: Priority) {
    return `Task's priority changed to ${PriorityTools.priorityNameUsingNormal(newPriority).toLocaleLowerCase()}`;
}
