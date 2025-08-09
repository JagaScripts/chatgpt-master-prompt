import { Injectable, signal, computed } from '@angular/core';
import {
  PromptSection,
  PromptSectionKey,
  PromptTemplate,
} from '../models/prompt.models';

/**
 * Lightweight signal-based store for templates.
 */
@Injectable({ providedIn: 'root' })
export class TemplatesStore {
  private readonly templatesSignal = signal<PromptTemplate[]>([]);
  private readonly currentTemplateIdSignal = signal<string | null>(null);

  /** All templates. */
  readonly templates = computed(() => this.templatesSignal());

  /** Currently active template. */
  readonly currentTemplate = computed<PromptTemplate | null>(() => {
    const id = this.currentTemplateIdSignal();
    return this.templatesSignal().find((t) => t.id === id) ?? null;
  });

  /** Initialize the store with a default template when empty. */
  initializeDefaultTemplate(): void {
    if (this.templatesSignal().length > 0) return;
    const now = new Date().toISOString();
    const sections: PromptSection[] = this.createDefaultSections();
    const template: PromptTemplate = {
      id: crypto.randomUUID(),
      name: 'Untitled',
      sections,
      updatedAt: now,
      tags: [],
      locale: 'en',
      mode: 'concise',
      fences: false,
    };
    this.templatesSignal.update((arr) => [template, ...arr]);
    this.currentTemplateIdSignal.set(template.id);
  }

  /** Update a section's enabled flag. */
  setSectionEnabled(key: PromptSectionKey, enabled: boolean): void {
    this.updateCurrent((tpl) => {
      tpl.sections = tpl.sections.map((s) =>
        s.key === key ? { ...s, enabled } : s,
      );
      return tpl;
    });
  }

  /** Update a section's value. */
  setSectionValue(key: PromptSectionKey, value: string): void {
    this.updateCurrent((tpl) => {
      tpl.sections = tpl.sections.map((s) =>
        s.key === key ? { ...s, value } : s,
      );
      return tpl;
    });
  }

  private updateCurrent(
    mutator: (tpl: PromptTemplate) => PromptTemplate,
  ): void {
    const id = this.currentTemplateIdSignal();
    if (!id) return;
    this.templatesSignal.update((arr) =>
      arr.map((t) =>
        t.id === id
          ? {
              ...mutator({ ...t, sections: [...t.sections] }),
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  }

  private createDefaultSections(): PromptSection[] {
    const orderKeys: PromptSectionKey[] = [
      'context',
      'role',
      'goal',
      'audience',
      'input',
      'outputFormat',
      'constraints',
      'process',
      'validation',
      'styleTone',
      'toolsApis',
      'tokenBudget',
      'language',
      'determinism',
      'dosDonts',
      'followUp',
      'metadata',
    ];
    return orderKeys.map<PromptSection>((key, idx) => ({
      key,
      title: this.titleForKey(key),
      enabled: key === 'goal' || key === 'outputFormat' ? true : false,
      value: '',
      required: key === 'goal' || key === 'outputFormat',
      order: idx,
    }));
  }

  private titleForKey(key: PromptSectionKey): string {
    const map: Record<PromptSectionKey, string> = {
      context: 'Context',
      role: 'Role',
      goal: 'Goal',
      audience: 'Audience',
      input: 'Input',
      outputFormat: 'Output Format',
      constraints: 'Constraints',
      process: 'Process',
      validation: 'Validation',
      styleTone: 'Style & Tone',
      toolsApis: 'Tools & APIs',
      tokenBudget: 'Token Budget',
      language: 'Language',
      determinism: 'Determinism',
      dosDonts: "Do / Don't",
      followUp: 'Follow-up',
      metadata: 'Metadata',
    };
    return map[key];
  }
}
