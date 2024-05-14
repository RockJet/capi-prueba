import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { Observable, filter, map, of, take, tap } from 'rxjs';
import { Contact } from 'src/models/contact';
import { ContactsResponse, ContactsService } from 'src/app/services/contacts.service';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  contactsResponse$: Observable<ContactsResponse> | undefined = undefined
  currentPage: number = 0
  totalElements: number = 0
  searchControl = new FormControl('');


  constructor(public dialog: MatDialog, private contactsService: ContactsService) {
    this.fetchContacts(this.currentPage, this.searchControl.value!);
  }

  ngOnInit() {
    this.searchControl.valueChanges.subscribe(value => {
      this.currentPage = 0
      this.fetchContacts(this.currentPage, value!);
    });
  }

  private fetchContacts(page: number, search: string) {
    this.contactsResponse$ = this.contactsService.getContacts(page, search).pipe(
      take(1),
      filter((data: any) => data),
      tap((data: any) => {
        this.totalElements = data.total
        return data
      })
    )
  }

  viewDetails(contact: Contact) {
    this.dialog.open(AddContactComponent, {
      data: { action: 'view', contact: contact },
      height: 'auto',
      width: '600px',
    });
  }

  editContact(contact: Contact) {
    const dialogRef = this.dialog.open(AddContactComponent, {
      data: { action: 'edit', contact: contact },
      height: 'auto',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.fetchContacts(this.currentPage, this.searchControl.value!)
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
          this.fetchContacts(this.currentPage, this.searchControl.value!);
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
        this.fetchContacts(this.currentPage, this.searchControl.value!);
      }
    });
  }

  pageEvent(event: any) {
    this.currentPage = event.pageIndex
    this.fetchContacts(this.currentPage, this.searchControl.value!)
  }
}
