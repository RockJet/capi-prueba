import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  contacts = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  constructor(public dialog: MatDialog) {}

  viewDetails(contact: any) {
    this.dialog.open(AddContactComponent, {
      data: { action: 'view', contact: contact },
      height: 'auto',
      width: '600px',
    });
  }
  editContact(contact: any) {
    this.dialog.open(AddContactComponent, {
      data: { action: 'edit', contact: contact },
      height: 'auto',
      width: '600px',
    });
  }
  openAddContactModal() {
    this.dialog.open(AddContactComponent, {
      data: { action: 'add', contact: undefined },
      height: 'auto',
      width: '600px',
    });
  }
}
