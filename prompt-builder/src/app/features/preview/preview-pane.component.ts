import { Component, Input } from '@angular/core';

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
        <pre class="mb-0">{{ content || 'Nothing to preview yet.' }}</pre>
      </div>
    </div>
  `,
})
export class PreviewPaneComponent {
  /** Markdown content to render. */
  @Input() content = '';
}
