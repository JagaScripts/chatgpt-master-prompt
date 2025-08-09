import { Injectable } from '@angular/core';
import { PromptTemplate } from '../../core/models/prompt.models';

/**
 * Manages prompt templates (in-memory placeholder; future IndexedDB via idb).
 */
@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private templates: PromptTemplate[] = [];

  /** Returns all templates. */
  getAll(): PromptTemplate[] {
    return [...this.templates];
  }

  /** Saves or updates a template by id. */
  upsert(template: PromptTemplate): void {
    const idx = this.templates.findIndex((t) => t.id === template.id);
    if (idx >= 0) this.templates[idx] = template;
    else this.templates.unshift(template);
  }
}
