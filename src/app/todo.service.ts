import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';
import { delay, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos$ = this.http
    .get<Todo[]>(environment.endpoint)
    .pipe(map((todos) => todos.slice(0, 50)));
  todos = signal<Todo[]>([]);

  constructor(private http: HttpClient) {
    this.todos$.subscribe(this.todos.set);
  }

  toggleTodoCompleted(todo: Todo) {
    this.todos.mutate((todos) => {
      const index = todos.indexOf(todo);
      todos[index].completed = !todos[index].completed;
    });
  }

  refreshTodos() {
    this.todos$.subscribe(this.todos.set);
  }

  updateTodosTitle(todo: Todo) {
    this.todos.update((todos) => {
      return todos.map((t) => {
        if (t.id === todo.id) {
          return { ...t, title: 'updated to new title' };
        }
        return t;
      });
    });
  }
}
