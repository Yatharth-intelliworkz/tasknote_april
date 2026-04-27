import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNotificationMessage',
  standalone: true
})
export class FormatNotificationMessagePipe implements PipeTransform {
  private readonly priorityMap: { [key: string]: string } = {
    '0': 'Low',
    '1': 'High',
    '2': 'Medium'
  };

  private mapPriority(value: string): string {
    return this.priorityMap[value] || value;
  }

  transform(message: any): string {
    if (!message) {
      return '';
    }

    let result = String(message);

    // Replace common priority numeric formats with labels.
    result = result.replace(/\bchanged\s+priority\s+to\s+([0-2])\b/gi, (_m, p) => {
      return `changed priority to ${this.mapPriority(p)}`;
    });

    result = result.replace(/\bpriority\s+from\s+([0-2])\s+to\s+([0-2])\b/gi, (_m, fromP, toP) => {
      return `priority from ${this.mapPriority(fromP)} to ${this.mapPriority(toP)}`;
    });

    result = result.replace(/\bpriority\s*(?:is|to|:)?\s*([0-2])\b/gi, (_m, p) => {
      return `priority to ${this.mapPriority(p)}`;
    });

    // Replace boolean string values
    result = result.replace(/\btrue\b/gi, 'Yes');
    result = result.replace(/\bfalse\b/gi, 'No');

    // Remove trailing boolean values
    result = result.replace(/\s+(Yes|No)\s*$/i, '');

    // Clean up double spaces
    result = result.replace(/\s+/g, ' ').trim();

    return result;
  }
}
