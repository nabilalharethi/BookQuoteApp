// src/app/services/book.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Book {
  id?: number;
  title: string;
  author: string;
  publicationDate: string | null; 
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/books`;

  
  private _booksListRefresh = new Subject<void>();
  public booksListRefresh$ = this._booksListRefresh.asObservable();

  
  private bookSubject = new BehaviorSubject<Book[]>([]);
  public books$ = this.bookSubject.asObservable();

  constructor() {
    this.loadBooks();
  }

  
  public triggerBooksListRefresh(): void {
    this._booksListRefresh.next();
  }

  
  loadBooks(): void {
    this.http.get<Book[]>(this.apiUrl).subscribe({
      next: (books) => this.bookSubject.next(books),
      error: (err) => console.error('Failed to load books:', err)
    });
  }

  
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }


  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book).pipe(
      tap(() => this.loadBooks()) 
    );
  }

  
  updateBook(id: number, book: Book): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, book).pipe(
      tap(() => this.loadBooks()) // 
    );
  }

  
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadBooks()) 
    );
  }
}