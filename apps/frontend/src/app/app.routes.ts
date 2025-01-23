import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'starter-page',
    loadComponent: () =>
      import('./starter-page/starter-page.component').then(
        (m) => m.StarterPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'starter-page',
  },
];
