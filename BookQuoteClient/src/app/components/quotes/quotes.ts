import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteService, Quote } from '../../services/quote.service';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotes.html',
  styleUrls: ['./quotes.css']
})
export class Quotes implements OnInit {
  private quoteService = inject(QuoteService);

  quotes: Quote[] = [];
  loading = false;
  showForm = false;
  editingQuote: Quote | null = null;
  
  newQuote: Quote = { 
    text: '', 
    author: '' 
  };

   ngOnInit(): void {
   
    this.quoteService.quotes$.subscribe({
      next: (quotes: Quote[]) => this.quotes = quotes.slice(0, 5), // show only 5
      error: (err: any) => console.error('Error loading quotes:', err)
    });
  }



  showAddForm(): void {
    this.showForm = true;
    this.editingQuote = null;
    this.newQuote = { text: '', author: '' };
  }

  showEditForm(quote: Quote): void {
    this.showForm = true;
    this.editingQuote = quote;
    this.newQuote = { ...quote };
  }

  onSubmit(): void {
    if (this.editingQuote && this.editingQuote.id) {
      this.quoteService.updateQuote(
        this.editingQuote.id, 
        this.newQuote
      ).subscribe({
        next: () => {
          
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error updating quote:', error);
          alert('Failed to update quote');
        }
      });
    } else {
      this.quoteService.createQuote(this.newQuote).subscribe({
        next: () => {
          
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error creating quote:', error);
          alert('Failed to create quote');
        }
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingQuote = null;
    this.newQuote = { text: '', author: '' };
  }

  deleteQuote(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this quote?')) {
      return;
    }

    this.quoteService.deleteQuote(id).subscribe({
      next: () => {
        
      },
      error: (error) => {
        console.error('Error deleting quote:', error);
        alert('Failed to delete quote');
      }
    });
  }
}