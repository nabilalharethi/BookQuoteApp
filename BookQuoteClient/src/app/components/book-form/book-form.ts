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
  styleUrls: ['./book-form.css']
})
export class BookForm implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  book: Book = { 
    title: '', 
    author: '', 
    publicationDate: null 
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

    private normalizeDate(dateString: string | null): string {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  loadBook(id: number): void {
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        this.book.publicationDate = this.normalizeDate(book.publicationDate);
  
      },
      error: (error) => {
        console.error('Error loading book:', error);
        this.errorMessage = 'Failed to load book';
      }
    });
  }

  /** Convert to UTC ISO before sending to backend */
  private convertToUtcIso(): void {
    if (this.book.publicationDate) {
      const date = new Date(this.book.publicationDate);
      this.book.publicationDate = date.toISOString(); 
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    this.convertToUtcIso();

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