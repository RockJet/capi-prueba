import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { Observable, map, of, take } from 'rxjs';
import { Contact } from 'src/models/contact';
import { ContactsService } from 'src/app/services/contacts.service';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  contacts$: Observable<Contact[]> | undefined = undefined

  constructor(public dialog: MatDialog, private contactsService: ContactsService) {
    this.fetchContacts();
  }

  private fetchContacts() {
    this.contacts$ = this.contactsService.getContacts();
  }
  viewDetails(contact: Contact) {
    this.dialog.open(AddContactComponent, {
      data: { action: 'view', contact: contact },
      height: 'auto',
      width: '600px',
    });
  }
  editContact(contact: Contact) {
    console.log(contact)
    const dialogRef = this.dialog.open(AddContactComponent, {
      data: { action: 'edit', contact: contact },
      height: 'auto',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.fetchContacts()
      }
    });
  }
  deleteContact(contact: Contact) {
    const dialogData = {
      title: 'Confirmar',
      message: 'Estas seguro que quieres eliminar este contacto?',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    };

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.contactsService.deleteContact(contact.id).pipe(take(1), map(() => {
          this.fetchContacts();
        })
        ).subscribe()
      }
    });
  }
  openAddContactModal() {
    const dialogRef = this.dialog.open(AddContactComponent, {
      data: { action: 'add', contact: undefined },
      height: 'auto',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchContacts();
      }
    });
  }
}
