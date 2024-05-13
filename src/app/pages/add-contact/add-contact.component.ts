import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phones: this.fb.array([]),
      emails: this.fb.array([]),
      addresses: this.fb.array([])
    });

    if (this.data?.contacto) {
      this.contactForm.patchValue({ name: this.data.contacto.name });
      if (this.data.contacto.phones) {
        const phoneArray = this.phones;
        this.data.contacto.phones.forEach((phone: string) => {
          phoneArray.push(this.fb.control(phone));
        });
      }

      if (this.data.contacto.emails) {
        const phoneArray = this.phones;
        this.data.contacto.phones.forEach((phone: string) => {
          phoneArray.push(this.fb.control(phone));
        });
      }

      if (this.data.contacto.addresses) {
        const addressArray = this.addresses;
        this.data.contacto.addresses.forEach((address: string) => {
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
    if (this.contactForm.valid) {
      console.log('Form:', this.contactForm.value);
    }
  }
}
