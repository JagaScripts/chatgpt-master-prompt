import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TemplatesStore } from '../../core/store/templates.store';

/**
 * Sections list editor component placeholder.
 * @remarks Part of Prompt Builder MVP.
 */
@Component({
  selector: 'app-sections-list',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="card mb-3">
      <div class="card-header">{{ panelTitle }}</div>
      <div class="card-body" *ngIf="store.currentTemplate(); else loading">
        <div
          *ngFor="let s of store.currentTemplate()!.sections"
          class="mb-3"
        >
          <div class="d-flex align-items-center gap-2 mb-1">
            <input
              type="checkbox"
              class="form-check-input"
              [id]="'sec-' + s.key"
              [checked]="s.enabled"
              (change)="toggle(s.key, !!$any($event.target)?.checked)"
            />
            <label class="form-check-label" [for]="'sec-' + s.key">
              {{ s.title }}
              <span *ngIf="s.required" class="text-danger">*</span>
            </label>
            <div class="ms-auto btn-group btn-group-sm" role="group">
              <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="moveUp(s.key)"
                [attr.aria-label]="'Move ' + s.title + ' up'"
              >
                ↑
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="moveDown(s.key)"
                [attr.aria-label]="'Move ' + s.title + ' down'"
              >
                ↓
              </button>
            </div>
          </div>
          <textarea
            class="form-control"
            rows="3"
            [value]="s.value"
            (input)="onEdit(s.key, $any($event.target).value)"
          ></textarea>
        </div>
      </div>
      <ng-template #loading>
        <p class="mb-0 text-muted">Loading…</p>
      </ng-template>
    </div>
  `,
})
export class SectionsListComponent implements OnInit {
  /** Optional title for the sections panel. */
  @Input() panelTitle = 'Sections';

  /** Emits when a section is selected (future). */
  @Output() sectionSelected = new EventEmitter<string>();

  constructor(public readonly store: TemplatesStore) {}

  ngOnInit(): void {
    this.store.initializeDefaultTemplate();
  }

  toggle(key: string, enabled: boolean): void {
    this.store.setSectionEnabled(key as any, enabled);
  }

  onEdit(key: string, value: string): void {
    this.store.setSectionValue(key as any, value);
  }

  moveUp(key: string): void {
    this.store.moveSectionUp(key as any);
  }

  moveDown(key: string): void {
    this.store.moveSectionDown(key as any);
  }
}
