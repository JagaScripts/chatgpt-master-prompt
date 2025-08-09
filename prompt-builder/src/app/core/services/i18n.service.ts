import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Lightweight wrapper for ngx-translate service.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  constructor(private readonly translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();
    this.use(browserLang?.match(/en|es/) ? browserLang : 'en');
  }

  /** Switch active language. */
  use(lang: 'en' | 'es'): void {
    this.translate.use(lang);
  }
}


