import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Renders markdown into sanitized HTML safe for binding.
 */
@Injectable({ providedIn: 'root' })
export class MarkdownService {
  constructor(private readonly sanitizer: DomSanitizer) {}

  /** Convert markdown to safe HTML for [innerHTML] binding. */
  renderToSafeHtml(markdown: string): SafeHtml {
    const rawHtml = marked.parse(markdown ?? '');
    const clean = DOMPurify.sanitize(String(rawHtml));
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
