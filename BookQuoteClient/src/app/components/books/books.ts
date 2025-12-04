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

  books: Book[] = [];
  loading = false;
  deletingId: number | null = null;

  ngOnInit(): void {
    // Initial load
    this.loadBooks();
    
    // Listen for route changes to reload when returning to this page
    this.routerEventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Only reload if we're on the books page and not already loading
      if (this.router.url === '/books' && !this.loading) {
        this.loadBooks();
      }
    });
  }

  loadBooks(): void {
    // Prevent multiple simultaneous calls
    if (this.loading) {
      return;
    }
    
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
        this.deletingId = null;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
        this.deletingId = null;
      }
    });
  }

  deleteBook(id: number | undefined): void {
    if (!id || this.deletingId === id) {
      return;
    }
    
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    this.deletingId = id;
    
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        
        this.loadBooks();
        
        
       
        
      },
      error: (error) => {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
        this.deletingId = null;
      }
    });
  }

  isDeleting(id: number | undefined): boolean {
    return this.deletingId === id;
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}