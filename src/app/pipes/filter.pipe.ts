import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => this.objectContainsSearchTerm(item, searchText));
  }

  private objectContainsSearchTerm(obj: any, searchText: string): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && this.isString(obj[key])) {
        if (obj[key].toLowerCase().includes(searchText)) {
          return true;
        }
      }
    }
    return false;
  }

  private isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }
}
