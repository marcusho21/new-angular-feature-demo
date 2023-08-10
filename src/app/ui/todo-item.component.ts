import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { Todo, TodoService } from '../data-access/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  template: `
    <li class="todo">
      <div class="todo-content" [ngClass]="{ completed: todo?.completed }">
        <button (click)="todo && todoService.toggleTodoCompleted(todo)">
          {{ todo?.title }}
        </button>

        <button
          *ngIf="!todo?.completed"
          class="button update"
          (click)="todo && todoService.updateTodosTitle(todo)"
        >
          update
        </button>
      </div>
    </li>
  `,
  styles: [
    `
      .todo {
        padding: 0.5rem 0;
        border-bottom: 1px solid lightgray;
        list-style-type: circle;

        .todo-content {
          display: flex;
          justify-content: space-between;

          &.completed {
            button {
              text-decoration: line-through;
            }

            &::after {
              content: '🧃';
            }
          }
        }

        .button.update {
          background-color: lightgreen;
          justify-self: flex-end;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  @Input({ required: true }) todo?: Todo;

  todoService = inject(TodoService);
}
