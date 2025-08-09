import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Sections list editor component placeholder.
 * @remarks Part of Prompt Builder MVP.
 */
@Component({
  selector: 'app-sections-list',
  standalone: true,
  template: `
    <div class="card mb-3">
      <div class="card-header">Sections</div>
      <div class="card-body">
        <p class="mb-0 text-muted">Sections editor coming soon…</p>
      </div>
    </div>
  `,
})
export class SectionsListComponent {
  /** Optional title for the sections panel. */
  @Input() panelTitle = 'Sections';

  /** Emits when a section is selected (future). */
  @Output() sectionSelected = new EventEmitter<string>();
}
