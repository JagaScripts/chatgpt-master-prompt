import { Injectable, signal, computed, effect } from '@angular/core';
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
  private readonly lastEditedSectionKeySignal = signal<PromptSectionKey | null>(
    null,
  );

  /** All templates. */
  readonly templates = computed(() => this.templatesSignal());

  /** Currently active template. */
  readonly currentTemplate = computed<PromptTemplate | null>(() => {
    const id = this.currentTemplateIdSignal();
    return this.templatesSignal().find((t) => t.id === id) ?? null;
  });

  /** Last edited section key (for announcements / reordering context). */
  readonly lastEditedKey = computed<PromptSectionKey | null>(() =>
    this.lastEditedSectionKeySignal(),
  );

  constructor() {
    // Autosave current template to LocalStorage when it changes
    effect(() => {
      const tpl = this.currentTemplate();
      if (!tpl) return;
      try {
        globalThis.localStorage?.setItem(
          'pb_current_template',
          JSON.stringify(tpl),
        );
      } catch {
        // ignore storage errors (quota/unsupported)
      }
    });

    // Persist templates array whenever it changes
    effect(() => {
      const arr = this.templatesSignal();
      try {
        globalThis.localStorage?.setItem('pb_templates', JSON.stringify(arr));
      } catch {
        // ignore storage errors
      }
    });
  }

  /** Initialize the store with a default template when empty. */
  initializeDefaultTemplate(): void {
    if (this.templatesSignal().length > 0) return;
    // Attempt to restore full templates array first
    const restoredList = this.loadTemplatesArray();
    const restoredCurrent = this.loadFromLocalStorage();
    if (restoredList && restoredList.length > 0) {
      this.templatesSignal.set(restoredList);
      const id = restoredCurrent?.id ?? restoredList[0].id;
      this.currentTemplateIdSignal.set(id);
      return;
    }
    // Fallback legacy: only current template stored
    if (restoredCurrent) {
      this.templatesSignal.set([restoredCurrent]);
      this.currentTemplateIdSignal.set(restoredCurrent.id);
      return;
    }
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

  /** Replace current template with the provided one (e.g., after Load). */
  loadTemplate(template: PromptTemplate): void {
    if (!template || !template.id || !Array.isArray(template.sections)) return;
    this.templatesSignal.set([template]);
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
    this.markEdited(key);
  }

  /** Mark a section key as last edited (for keyboard reordering context). */
  markEdited(key: PromptSectionKey): void {
    this.lastEditedSectionKeySignal.set(key);
  }

  /** Toggle the fences flag (copy/export with code fences). */
  toggleFences(): void {
    this.updateCurrent((tpl) => ({ ...tpl, fences: !tpl.fences }));
  }

  /** Clear values of all sections in the current template. */
  clearAllValues(): void {
    this.updateCurrent((tpl) => ({
      ...tpl,
      sections: tpl.sections.map((s) => ({ ...s, value: '' })),
    }));
  }

  /** Move last-edited section (or provided key) one position up. */
  moveSectionUp(key?: PromptSectionKey): void {
    this.moveSection(key ?? this.lastEditedSectionKeySignal(), -1);
  }

  /** Move last-edited section (or provided key) one position down. */
  moveSectionDown(key?: PromptSectionKey): void {
    this.moveSection(key ?? this.lastEditedSectionKeySignal(), +1);
  }

  private moveSection(key: PromptSectionKey | null, delta: -1 | 1): void {
    if (!key) return;
    this.updateCurrent((tpl) => {
      const sections = [...tpl.sections].sort((a, b) => a.order - b.order);
      const index = sections.findIndex((s) => s.key === key);
      if (index < 0) return tpl;
      const target = index + delta;
      if (target < 0 || target >= sections.length) return tpl;
      const a = sections[index];
      const b = sections[target];
      const tmp = a.order;
      a.order = b.order;
      b.order = tmp;
      return { ...tpl, sections };
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

  /** Public helper to map a section key to its display title. */
  getSectionTitle(key: PromptSectionKey): string {
    return this.titleForKey(key);
  }

  /** Create a copy of current template with a new name and id, and select it. */
  saveAs(name: string): void {
    const src = this.currentTemplate();
    if (!src) return;
    const copy: PromptTemplate = {
      ...src,
      id: crypto.randomUUID(),
      name: name?.trim() || 'Untitled',
      updatedAt: new Date().toISOString(),
    };
    this.templatesSignal.update((arr) => [copy, ...arr]);
    this.currentTemplateIdSignal.set(copy.id);
  }

  /** Switch current template by id. */
  switchTo(id: string): void {
    if (!id) return;
    const exists = this.templatesSignal().some((t) => t.id === id);
    if (!exists) return;
    this.currentTemplateIdSignal.set(id);
  }

  /** Delete template by id; if current, switch to the first available or create default. */
  deleteTemplate(id: string): void {
    const currentId = this.currentTemplateIdSignal();
    this.templatesSignal.update((arr) => arr.filter((t) => t.id !== id));
    if (currentId === id) {
      const next = this.templatesSignal()[0];
      if (next) this.currentTemplateIdSignal.set(next.id);
      else this.initializeDefaultTemplate();
    }
  }

  private loadFromLocalStorage(): PromptTemplate | null {
    try {
      const raw = globalThis.localStorage?.getItem('pb_current_template');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PromptTemplate;
      if (!parsed || !parsed.id || !Array.isArray(parsed.sections)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private loadTemplatesArray(): PromptTemplate[] | null {
    try {
      const raw = globalThis.localStorage?.getItem('pb_templates');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PromptTemplate[];
      if (!Array.isArray(parsed)) return null;
      return parsed.filter((t) => t && t.id && Array.isArray(t.sections));
    } catch {
      return null;
    }
  }
}
