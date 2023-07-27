import { CommonModule, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginationService } from './pagination.service';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, CommonModule],
  providers: [PaginationService],
  styles: [
    `
      :host {
        display: block;
        max-width: 768px;
      }

      button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        padding: 0;
        text-align: left;

        &:hover {
          background-color: lightblue;
        }
      }

      section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .todo {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid lightgray;

        li {
          list-style: circle;

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
  template: `
    <h1>{{ title() }}</h1>
    <h2>Number of todos: {{ numberOfTodos() }}</h2>
    <h2>Number of completed todos: {{ numberOfCompletedTodos() }}</h2>

    <button (click)="todoService.refreshTodos()">Refresh</button>

    <section>
      <ng-container *ngIf="todos(); else noTodos">
        <ul>
          <div
            *ngFor="
              let todo of todos() | slice : 0 : paginationService.currentPage()
            "
            class="todo"
          >
            <li [ngClass]="{ completed: todo.completed }">
              <button (click)="todoService.toggleTodoCompleted(todo)">
                {{ todo.title }}
              </button>
            </li>

            <button
              *ngIf="!todo.completed"
              class="button update"
              (click)="todoService.updateTodosTitle(todo)"
            >
              update
            </button>
          </div>
        </ul>
      </ng-container>

      <button
        *ngIf="paginationService.hasMoreItems()"
        (click)="paginationService.nextPage()"
      >
        Load More
      </button>
    </section>

    <ng-template #noTodos> no todos </ng-template>
  `,
})
export class AppComponent {
  todoService = inject(TodoService);
  paginationService = inject(PaginationService);

  title = signal('Signal Demo');

  todos = this.todoService.todos;
  numberOfTodos = computed(() => {
    return this.todos()?.length ?? 0;
  });
  numberOfCompletedTodos = computed(
    () => this.todos()?.filter((td) => td.completed).length ?? 0
  );

  constructor() {
    this.todoService.todos$.pipe(takeUntilDestroyed()).subscribe((todos) => {
      this.paginationService.setTotalNumberOfItems(todos.length);
    });

    effect(() => {
      console.log('pagination updated', this.paginationService.currentPage());
    });
  }
}
