import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Quote {
  id?: number;
  text: string;
  author: string;
}

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/quotes`;

  
  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  public quotes$ = this.quotesSubject.asObservable();

  constructor() {
   
    this.loadQuotes();
  }

  
  loadQuotes(): void {
    this.http.get<Quote[]>(this.apiUrl).subscribe({
      next: (quotes) => this.quotesSubject.next(quotes),
      error: (err) => console.error('Failed to load quotes:', err)
    });
  }

 
  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`);
  }

  
  createQuote(quote: Quote): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, quote).pipe(
      tap(created => {
      const current = this.quotesSubject.value;
      this.quotesSubject.next([...current, created]);
    })
  );
 }

  updateQuote(id: number, quote: Quote): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quote).pipe(
      tap(() => this.loadQuotes()) 
    );
  }


  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadQuotes()) 
    );
  }
}