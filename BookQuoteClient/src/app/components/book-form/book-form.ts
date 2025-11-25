import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  book: Book = { 
    title: '', 
    author: '', 
    publicationDate: '' 
  };
  
  isEditMode = false;
  bookId: number | null = null;
  errorMessage = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId = +id;
      this.loadBook(this.bookId);
    }
  }

  loadBook(id: number): void {
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        if (this.book.publicationDate) {
          const date = new Date(this.book.publicationDate);
          this.book.publicationDate = date.toISOString().split('T')[0];
        }
      },
      error: (error) => {
        console.error('Error loading book:', error);
        this.errorMessage = 'Failed to load book';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, this.book).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Error updating book:', error);
          this.errorMessage = 'Failed to update book';
        }
      });
    } else {
      this.bookService.createBook(this.book).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (error) => {
          console.error('Error creating book:', error);
          this.errorMessage = 'Failed to create book';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/books']);
  }
}