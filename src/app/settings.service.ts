import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  constructor() { }

  private supportedLanguages = [
    'de',
    'en',
    'fr',
  ];

  public userLanguage(): string {
    if (!navigator.languages) {
      return 'en';
    }

    const preferredSupportedLanguage = navigator.languages
      .map(it => it.split('-')[0])
      .filter(it => this.supportedLanguages.includes(it))[0];

    return preferredSupportedLanguage ? preferredSupportedLanguage : 'en';
  }
}
