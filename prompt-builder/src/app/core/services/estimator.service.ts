import { Injectable } from '@angular/core';

/**
 * Provides simple text length statistics and token estimation.
 * @remarks Token estimate is approximate: ceil(characters / 4).
 */
@Injectable({ providedIn: 'root' })
export class EstimatorService {
  /** Returns number of characters in the provided text. */
  countCharacters(text: string): number {
    return text?.length ?? 0;
  }

  /** Returns number of words in the provided text (basic split by whitespace). */
  countWords(text: string): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  /** Returns an approximate token count using ceil(characters / 4). */
  estimateTokens(text: string): number {
    const chars = this.countCharacters(text);
    return Math.ceil(chars / 4);
  }
}
