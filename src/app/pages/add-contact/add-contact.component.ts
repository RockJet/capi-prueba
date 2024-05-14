import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, finalize, map, of, take, tap, throwError } from 'rxjs';
import { ContactsService } from 'src/app/services/contacts.service';
import { Contact } from 'src/models/contact';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {
  contactForm: FormGroup;
  isLoading = false

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private contactsService: ContactsService, public dialogRef: MatDialogRef<AddContactComponent>) {
    this.contactForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      phones: this.fb.array([]),
      emails: this.fb.array([]),
      addresses: this.fb.array([])
    });

    if (this.data?.contact) {
      this.contactForm.patchValue({ id: this.data.contact.id, name: this.data.contact.name });
      if (this.data.contact.phones) {
        const phoneArray = this.phones;
        this.data.contact.phones.forEach((phone: string) => {
          phoneArray.push(this.fb.control(phone));
        });
      }

      if (this.data.contact.emails) {
        const phoneArray = this.emails;
        this.data.contact.emails.forEach((phone: string) => {
          phoneArray.push(this.fb.control(phone));
        });
      }

      if (this.data.contact.addresses) {
        const addressArray = this.addresses;
        this.data.contact.addresses.forEach((address: string) => {
          addressArray.push(this.fb.control(address));
        });
      }
    }
  }

  get phones(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }

  get emails(): FormArray {
    return this.contactForm.get('emails') as FormArray;
  }

  get addresses(): FormArray {
    return this.contactForm.get('addresses') as FormArray;
  }

  addPhone() {
    this.phones.push(new FormControl(''));
  }

  addEmail() {
    this.emails.push(new FormControl(''));
  }

  addAddress() {
    this.addresses.push(new FormControl(''));
  }

  removePhone(index: number) {
    this.phones.removeAt(index);
  }

  removeEmail(index: number) {
    this.emails.removeAt(index);
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  onSubmit() {
    if(this.data?.contact) {
      this.onEdit()
    } else {
      this.onSave()
    }
  }

  onSave() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      const contact = this.contactForm.value as Contact;
      return this.contactsService.createContact(contact).pipe(
        take(1),
        tap((res: any) => {
          this.dialogRef.close(res);
        }),
        catchError(err => {
          return throwError(() => new Error(err));
        })
      ).subscribe();
    } else {
      return throwError(() => new Error('Formulario no válido.'));
    }
  }

  onEdit() {
    if (this.contactForm.valid) {
      this.isLoading = true;
      const contact = this.contactForm.value as Contact;
      return this.contactsService.editContact(contact).pipe(
        take(1),
        tap((res: any) => {
          this.dialogRef.close(res);
        }),
        catchError(err => {
          return throwError(() => new Error(err));
        })
      ).subscribe();
    } else {
      return throwError(() => new Error('Formulario no válido.'));
    }
  }

}
