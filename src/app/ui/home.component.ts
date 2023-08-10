import { CommonModule, NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateTodoComponent } from './create-todo.component';
import { TodoItemComponent } from './todo-item.component';
import { TodoService } from '../data-access/todo.service';
import { PaginationService } from '../data-access/pagination.service';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    // CommonModule,
    NgIf,
    NgFor,
    NgClass,
    SlicePipe,
    TodoItemComponent,
    CreateTodoComponent,
    // TranslatePipe,
    TranslateModule,
  ],
  providers: [PaginationService],
  styles: [
    `
      :host {
        display: block;
        max-width: 768px;
      }

      section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        ul {
          width: 100%;
          list-style-type: circle;
        }
      }

      .button.yo-fam {
        background: hsl(0, 100, 50);
        color: hsl(141.2, 99.1%, 58.6%);
        padding: 1.5rem 3rem;
        font-size: 2rem;
      }

      .title {
        font-size: 3rem;
        color: hsl(141.2, 99.1%, 58.6%);
        background-color: hsl(16.24, 100%, 50%);
      }
    `,
  ],
  template: `
    <button class="button yo-fam" (click)="switchTranslation()">
      Translate
    </button>

    <h1 class="title">{{ 'HELLO' | translate }}</h1>
    <h2>Number of todos: {{ numberOfTodos() }}</h2>
    <h2>Number of completed todos: {{ numberOfCompletedTodos() }}</h2>

    <button (click)="todoService.refreshTodos()">Refresh</button>

    <section>
      <app-create-todo></app-create-todo>
      <ng-container *ngIf="todos(); else noTodos">
        <ul>
          <app-todo-item
            *ngFor="
              let todo of todos() | slice : 0 : paginationService.currentPage()
            "
            [todo]="todo"
          >
          </app-todo-item>
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
export class HomeComponent {
  todoService = inject(TodoService);
  paginationService = inject(PaginationService);
  translate = inject(TranslateService);

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

    this.translate.setTranslation('en', {
      HELLO: 'Hello World',
    });

    this.translate.setTranslation('to-man', {
      HELLO: 'Yo Fam',
    });
  }

  switchTranslation() {
    const currentLang = this.translate.currentLang;
    if (currentLang === 'to-man') {
      return this.translate.use('en');
    }
    return this.translate.use('to-man');
  }
}
