import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

/**
 * This Class will do;
 * capitalized words --> "john doe" ➝ "John Doe"
 */
@Injectable()
export class CapitalizeNamePipe implements PipeTransform {
    //transform or validate incoming data before it reaches your route handler
  transform(value: any, metadata: ArgumentMetadata) {
    // Only use the string value - Check and control
    if (typeof value !== 'string') {
      return value;
    }

    // Split the name according to space character.
    return value
      .split(' ')
      .map(word => {
        // Control the empty string
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}
