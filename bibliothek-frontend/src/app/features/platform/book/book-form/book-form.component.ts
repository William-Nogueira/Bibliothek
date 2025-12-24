import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from 'src/app/core/services/book.service';
import { Book } from 'src/app/core/models/book';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
})
export class BookFormComponent implements OnInit {
  @Input() bookToEdit?: Book;

  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();

  bookForm: FormGroup;
  message = '';
  messageSuccess = false;
  messageError = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly bookService: BookService
  ) {
    this.bookForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      genre: ['', Validators.required],
      author: ['', Validators.required],
      publisher: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      coverImage: [
        '',
        [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      ],
      description: ['', Validators.required],
      featured: [false],
    });
  }
  ngOnInit(): void {
    if (this.bookToEdit) {
      this.bookForm.patchValue(this.bookToEdit);
    }
  }

  get isEditMode(): boolean {
    return !!this.bookToEdit;
  }

  submitForm(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      this.showMessage('COMMON.FORM_INVALID_ERROR', true);
      return;
    }

    this.message = '';
    const formValue: Book = this.bookForm.value;

    if (this.isEditMode) {
      this.handleUpdate(formValue);
    } else {
      this.handleCreate(formValue);
    }
  }

  private handleCreate(book: Book): void {
    book.availableStock = book.stock;
    this.bookService
      .create(book)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.clearForm();
          this.showMessage('NEW_BOOK.MESSAGES.SUCCESS', false);
        },
        error: (err) => {
          console.error(err);
          this.showMessage('NEW_BOOK.MESSAGES.ERROR', true);
        },
      });
  }

  private handleUpdate(book: Book): void {
    this.bookService
      .update(book)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.saveEvent.emit();
        },
        error: (err) => {
          console.error(err);
          this.showMessage('BOOK_DETAILS.MESSAGES.EDIT_ERROR', true);
        },
      });
  }

  cancel(): void {
    if (this.isEditMode) {
      this.cancelEvent.emit();
    } else {
      this.clearForm();
    }
  }

  clearForm(): void {
    this.bookForm.reset({
      stock: 0,
      featured: false,
    });
    this.message = '';
  }

  private showMessage(key: string, isError: boolean): void {
    this.message = key;
    this.messageSuccess = !isError;
    this.messageError = isError;
    setTimeout(() => (this.message = ''), 5000);
  }
}
