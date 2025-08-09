import { Component, Input, computed, inject } from '@angular/core';
import { TemplatesStore } from '../../core/store/templates.store';
import { SynthesisService } from '../../core/services/synthesis.service';

/**
 * Live markdown preview placeholder.
 * @remarks Part of Prompt Builder MVP.
 */
@Component({
  selector: 'app-preview-pane',
  standalone: true,
  template: `
    <div class="card mb-3">
      <div class="card-header">Preview</div>
      <div class="card-body">
        <pre class="mb-0">{{ markdown() || 'Nothing to preview yet.' }}</pre>
      </div>
    </div>
  `,
})
export class PreviewPaneComponent {
  private readonly store = inject(TemplatesStore);
  private readonly synth = inject(SynthesisService);

  /** Derived markdown preview. */
  readonly markdown = computed(() =>
    this.synth.synthesizeMarkdown(this.store.currentTemplate()),
  );
}
