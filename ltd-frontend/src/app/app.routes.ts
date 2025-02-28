import { Routes } from '@angular/router';
import { FirstPageComponent } from './first-page/first-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: 'first-page',
        component: FirstPageComponent,
    },
    {
        path: '',
        redirectTo: '/first-page',
        pathMatch: 'full',
    },
    {
        path: '**',
        component: PageNotFoundComponent,
    }
];
