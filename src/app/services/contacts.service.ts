import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable, catchError, map, mergeMap, of, throwError } from 'rxjs';
import { Contact } from '../../models/contact';
import { ErrorMessageComponent } from '../error-message/error-message.component';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private apiUrl: string = 'http://localhost:8000'

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  public getContacts(page: number, search: string): Observable<ContactsResponse> {
    return this.http.get<unknown[]>(`${this.apiUrl}?page=${page + 1}&search=${search}`).pipe(
      map((data: any) => {
        return {
          contacts: data.data,
          current_page: data.pagination.current_page,
          last_page: data.pagination.last_page,
          from: data.pagination.from,
          total: data.pagination.total
        } as ContactsResponse
      })).pipe(      catchError(error => {
        this.errorMessage(error.message);
        return of();
      }))
  }


  public createContact(req: ContactReq): Observable<any> {
    return this.http.post<unknown[]>(`${this.apiUrl}/contacts/create`, req).pipe(
      catchError(error => {
        this.errorMessage(error.message);
        return of([]);
      })
    );
  }

  public editContact(req: ContactReq): Observable<any> {
    return this.http.post<unknown[]>(`${this.apiUrl}/contacts/update/${req.id}`, req).pipe(
      catchError(error => {
        this.errorMessage(error.message);
        return of([]);
      })
    );
  }

  public deleteContact(id: string): Observable<any> {
    return this.http.get<unknown[]>(`${this.apiUrl}/contacts/delete/`+ id).pipe(
      catchError(error => {
        this.errorMessage(error.message);
        return of([]);
      })
    );
  }

  public getContact(id: string): Observable<any> {
    return this.http.get<unknown>(`${this.apiUrl}/contacts/`+ id).pipe(
      map((data: any) => new Contact(data))
    )
  }

  public errorMessage(text: string): void {
    const dialogData = {
      title: 'Error',
      message: text,
      confirmButtonText: 'OK'
    };

    this.dialog.open(ErrorMessageComponent, {
      data: dialogData
    });

  }
}

export interface ContactReq {
  id: string
  name: string
  phones: string[]
  emails: string[]
  addresses: string[]
}

export interface ContactsResponse {
  contacts: ContactReq[]
  current_page: number
  last_page: number
  from: number
  total: number
}
