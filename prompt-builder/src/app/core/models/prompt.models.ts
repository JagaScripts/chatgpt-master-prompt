/**
 * Prompt Builder core data models.
 * @remarks Part of Prompt Builder MVP.
 */

/**
 * Union of section keys that compose a prompt.
 * @public
 */
export type PromptSectionKey =
  | 'context'
  | 'role'
  | 'goal'
  | 'audience'
  | 'input'
  | 'outputFormat'
  | 'constraints'
  | 'process'
  | 'validation'
  | 'styleTone'
  | 'toolsApis'
  | 'tokenBudget'
  | 'language'
  | 'determinism'
  | 'dosDonts'
  | 'followUp'
  | 'metadata';

/**
 * Section within a prompt template.
 * @public
 */
export interface PromptSection {
  /** Unique section key. */
  key: PromptSectionKey;
  /** Display title of the section. */
  title: string;
  /** Whether the section is enabled and should be included. */
  enabled: boolean;
  /** Freeform string value for the section content. */
  value: string;
  /** Whether the section is required. */
  required?: boolean;
  /** Ordering index for presentation and synthesis. */
  order: number;
}

/**
 * A user-editable prompt template composed of sections.
 * @public
 */
export interface PromptTemplate {
  /** Unique identifier (e.g., UUID). */
  id: string;
  /** Human-readable template name. */
  name: string;
  /** Ordered list of sections composing the prompt. */
  sections: PromptSection[];
  /** ISO timestamp of the last update. */
  updatedAt: string;
  /** Optional tags for organization and filtering. */
  tags: string[];
  /** UI locale code. */
  locale: 'en' | 'es';
  /** Preferred verbosity mode for synthesis. */
  mode: 'concise' | 'verbose';
  /** Whether to copy/export with code fences by default. */
  fences: boolean;
}
