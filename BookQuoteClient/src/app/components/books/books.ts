import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class Books implements OnInit {
  private bookService = inject(BookService);

  books: Book[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadBooks();
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