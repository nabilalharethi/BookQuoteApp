import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './books.html',
  styleUrls: ['./books.css']
})
export class Books implements OnInit, OnDestroy {
  private bookService = inject(BookService);
  private router = inject(Router);
  private routerEventsSubscription!: Subscription;

  protected readonly books$ = this.bookService.books$;

  loading = false;
  deletingId: number | null = null;

  ngOnInit(): void {

    // Listen for route changes to reload when returning to this page
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter(() => this.router.url === '/books')

    ).subscribe(() => {
      this.triggerReload();
 
    });
  }

    triggerReload(): void {
    this.loading = true;
    this.bookService.loadBooks(); 

    
    setTimeout(() => this.loading = false, 500);
  }




  deleteBook(id: number | undefined): void {
    if (!id || this.deletingId === id) return;
    
    
    if (!confirm('Are you sure you want to delete this book?')) return;
  
    this.deletingId = id;
    
    this.bookService.deleteBook(id).subscribe({
      error: (error) => {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
        this.deletingId = null;
      },

      complete: () => {
        this.deletingId = null;
      }


    });
  }

  isDeleting(id: number | undefined): boolean {
    return this.deletingId === id;
  }

  ngOnDestroy(): void {
 
      this.routerEventsSubscription.unsubscribe();
    }
  }
