import { HttpClient } from '@angular/common/http';
import { Injectable, effect, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environments';

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

    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
    });
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

  createTodo(title: string) {
    this.todos.mutate((todos) => {
      todos.unshift({
        userId: 1,
        id: new Date().getTime(),
        title,
        completed: false,
      });
    });
  }
}
