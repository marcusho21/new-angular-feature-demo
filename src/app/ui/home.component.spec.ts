import { Component, Pipe } from '@angular/core';
import { HomeComponent } from './home.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoService } from '../data-access/todo.service';
import { PaginationService } from '../data-access/pagination.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(() => {
    TestBed.overrideModule(TranslateModule, {
      set: {
        declarations: [MockTranslatePipe],
        exports: [MockTranslatePipe],
      },
    });

    TestBed.overrideComponent(HomeComponent, {
      set: {
        imports: [
          MockTodoItemComponent,
          MockCreateTodoComponent,
          TranslateModule,
        ],
        providers: [
          {
            provide: TodoService,
            useValue: { todos$: of([]) },
          },
          {
            provide: PaginationService,
            useValue: {},
          },
          {
            provide: TranslateService,
            useValue: { setTranslation: () => {} },
          },
        ],
      },
    }).configureTestingModule({
      declarations: [], // non standalone components are declared here
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-todo-item',
  standalone: true,
  template: '',
})
class MockTodoItemComponent {}

@Component({
  selector: 'app-create-todo',
  standalone: true,
  template: '',
})
class MockCreateTodoComponent {}

@Pipe({
  name: 'translate',
})
class MockTranslatePipe {
  constructor() {
    console.log('mock translate pipe');
  }
}
