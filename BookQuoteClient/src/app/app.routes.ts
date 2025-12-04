import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Books } from './components/books/books';
import { Quotes } from './components/quotes/quotes';
import { Register } from './components/register/register';
import { BookForm } from './components/book-form/book-form';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'books', component: Books },
  { path: 'quotes', component: Quotes },
  { path: 'books/new', component: BookForm },
  { path: 'books/edit/:id', component: BookForm },
];
