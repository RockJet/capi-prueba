import * as moment from "moment"
import 'moment/locale/es';

export class Contact {
  id: string
  name: string

  phones: string[]
  emails: string[]
  addresses: string[]

  createdAt: string
  updatedAt: string

  constructor(data: any) {
    this.id = data.id
    this.name = data.name

    this.phones = data.phones
    this.emails = data.emails
    this.addresses = data.addresses

    this.createdAt = moment(data.createdAt).format('MMMM D, YYYY - h:mm A')
    this.updatedAt = moment(data.updatedAt).format('MMMM D, YYYY - h:mm A')
  }
}
