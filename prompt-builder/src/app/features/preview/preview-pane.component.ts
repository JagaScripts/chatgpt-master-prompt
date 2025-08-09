import { Component, Input, computed, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { TemplatesStore } from '../../core/store/templates.store';
import { SynthesisService } from '../../core/services/synthesis.service';
import { MarkdownService } from '../../core/services/markdown.service';

/**
 * Live markdown preview placeholder.
 * @remarks Part of Prompt Builder MVP.
 */
@Component({
  selector: 'app-preview-pane',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="card mb-3">
      <div class="card-header">Preview</div>
      <div class="card-body">
        <div *ngIf="markdown(); else empty" [innerHTML]="html()"></div>
        <ng-template #empty>
          <pre class="mb-0">Nothing to preview yet.</pre>
        </ng-template>
      </div>
    </div>
  `,
})
export class PreviewPaneComponent {
  private readonly store = inject(TemplatesStore);
  private readonly synth = inject(SynthesisService);
  private readonly md = inject(MarkdownService);

  /** Derived markdown preview. */
  readonly markdown = computed(() =>
    this.synth.synthesizeMarkdown(this.store.currentTemplate()),
  );

  readonly html = computed(() => this.md.renderToSafeHtml(this.markdown()));
}
