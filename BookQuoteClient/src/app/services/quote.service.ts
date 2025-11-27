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

  // BehaviorSubject to hold quotes
  private quotesSubject = new BehaviorSubject<Quote[]>([]);
  quotes$ = this.quotesSubject.asObservable();

  // Load quotes from backend
  loadQuotes(): void {
    this.http.get<Quote[]>(this.apiUrl)
      .subscribe({
        next: (quotes) => this.quotesSubject.next(quotes),
        error: (err) => console.error('Failed to load quotes', err)
      });
  }

  getQuote(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.apiUrl}/${id}`);
  }

  createQuote(quote: Quote): Observable<Quote> {
    return this.http.post<Quote>(this.apiUrl, quote).pipe(
      tap((newQuote) => {
        // Add new quote to BehaviorSubject
        const current = this.quotesSubject.getValue();
        this.quotesSubject.next([...current, newQuote]);
      })
    );
  }

  updateQuote(id: number, quote: Quote): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, quote).pipe(
      tap(() => {
        const current = this.quotesSubject.getValue();
        const index = current.findIndex(q => q.id === id);
        if (index !== -1) {
          current[index] = { ...current[index], ...quote };
          this.quotesSubject.next([...current]);
        }
      })
    );
  }

  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.quotesSubject.getValue();
        this.quotesSubject.next(current.filter(q => q.id !== id));
      })
    );
  }
}
