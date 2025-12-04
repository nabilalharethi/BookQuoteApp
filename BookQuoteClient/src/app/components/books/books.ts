import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './books.html',
  styleUrls: ['./books.css']
})
export class Books implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);

  books: Book[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadBooks();
  }

    constructor() {
    // Listen for route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.router.url === '/books') {
        this.loadBooks();
      }
    });
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      }
    });
  }

  deleteBook(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this book?')) {
      return;
    }

    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.loadBooks();
      },
      error: (error) => {
        console.error('Error deleting book:', error);
        alert('Failed to delete book');
      }
    });
  }
}