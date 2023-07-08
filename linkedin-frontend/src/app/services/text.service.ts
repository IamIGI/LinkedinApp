import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  constructor() {}

  readMoreSplit(text: string) {
    const splitAfterNumberOfChars = 200;

    let opinionSplit = [];
    let trimmedString = text.substr(0, splitAfterNumberOfChars);

    //if there is just one word, return it
    if (trimmedString.lastIndexOf(' ') == -1) {
      opinionSplit.push(trimmedString);
      return opinionSplit;
    }
    //if the sentence have more than 200 chars trim after word
    if (text.length >= splitAfterNumberOfChars) {
      trimmedString = text.substr(0, trimmedString.lastIndexOf(' '));
    }
    opinionSplit.push(trimmedString);
    const additionalText = text.substr(trimmedString.length, 2000);
    if (additionalText !== '') opinionSplit.push(additionalText);

    return opinionSplit;
  }
}
