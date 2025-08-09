import { Injectable } from '@angular/core';
import { PromptSection, PromptTemplate } from '../models/prompt.models';

/**
 * Builds a markdown preview from a prompt template.
 */
@Injectable({ providedIn: 'root' })
export class SynthesisService {
  /**
   * Assemble markdown with section headings and contents.
   * Includes only sections that are enabled and non-empty.
   */
  synthesizeMarkdown(template: PromptTemplate | null): string {
    if (!template) return '';
    const ordered: PromptSection[] = [...template.sections].sort(
      (a, b) => a.order - b.order,
    );
    const blocks: string[] = [];
    for (const section of ordered) {
      const value = (section.value ?? '').trim();
      if (!section.enabled || value.length === 0) continue;
      blocks.push(`## ${section.title}\n${value}`);
    }
    const body = blocks.join('\n\n');
    if (template.fences) {
      return '```\n' + body + '\n```';
    }
    return body;
  }
}
