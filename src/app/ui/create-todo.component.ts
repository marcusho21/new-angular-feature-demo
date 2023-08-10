import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TodoService } from '../data-access/todo.service';

@Component({
  selector: 'app-create-todo',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="newTodo" (ngSubmit)="createTodo()">
      <input formControlName="title" placeholder="Title" />
      <button type="submit" class="button create">create</button>
    </form>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTodoComponent {
  fb = inject(NonNullableFormBuilder);
  todoService = inject(TodoService);

  newTodo = this.fb.group({
    title: ['', Validators.required],
  });

  get title() {
    return this.newTodo.get('title');
  }

  createTodo() {
    if (this.newTodo.valid && this.newTodo.value.title) {
      this.todoService.createTodo(this.newTodo.value.title);
      this.newTodo.reset();
    }
  }
}
