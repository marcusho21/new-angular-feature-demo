import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/ui/home.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./app/ui/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
      },
    ]),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
      })
    ),
  ],
}).catch(console.error);
