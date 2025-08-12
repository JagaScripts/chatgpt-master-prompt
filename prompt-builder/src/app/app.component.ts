import { Component, HostListener, inject } from '@angular/core';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { SectionsListComponent } from './features/sections/sections-list.component';
import { PreviewPaneComponent } from './features/preview/preview-pane.component';
import { StatsPanelComponent } from './features/preview/stats-panel.component';
import { LintPanelComponent } from './features/lint/lint-panel.component';
import { TemplatesStore } from './core/store/templates.store';
import { ClipboardService } from './core/services/clipboard.service';
import { SynthesisService } from './core/services/synthesis.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgStyle,
    TranslateModule,
    RouterOutlet,
    SectionsListComponent,
    PreviewPaneComponent,
    StatsPanelComponent,
    LintPanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'prompt-builder';
  status = '';
  showHelp = false;
  reorderAnnouncement = '';

  readonly store = inject(TemplatesStore);
  private readonly clipboard = inject(ClipboardService);
  private readonly synth = inject(SynthesisService);
  private readonly translate = inject(TranslateService);

  @HostListener('document:keydown', ['$event'])
  async onKeydown(event: KeyboardEvent): Promise<void> {
    const ctrl = event.ctrlKey || event.metaKey;
    const alt = event.altKey;
    const shift = event.shiftKey;

    // Ctrl+Shift+C: copy preview
    if (ctrl && shift && (event.key === 'C' || event.key === 'c')) {
      event.preventDefault();
      const text = this.synth.synthesizeMarkdown(this.store.currentTemplate());
      const ok = await this.clipboard.copy(text);
      this.status = ok
        ? this.translate.instant('status.copied')
        : this.translate.instant('status.copyFailed');
      return;
    }
    // Ctrl+Shift+P: toggle fences
    if (ctrl && shift && (event.key === 'P' || event.key === 'p')) {
      event.preventDefault();
      this.store.toggleFences();
      this.status = this.translate.instant('status.fencesToggled');
      return;
    }
    // Ctrl+Alt+Up/Down: reorder last-edited section
    if (ctrl && alt && event.key === 'ArrowUp') {
      event.preventDefault();
      this.store.moveSectionUp();
      this.announceReorder(-1);
      return;
    }
    if (ctrl && alt && event.key === 'ArrowDown') {
      event.preventDefault();
      this.store.moveSectionDown();
      this.announceReorder(+1);
      return;
    }
    // ? to toggle help overlay
    if (event.key === '?') {
      event.preventDefault();
      this.toggleHelp();
      return;
    }
  }

  async onCopy(): Promise<void> {
    const text = this.synth.synthesizeMarkdown(this.store.currentTemplate());
    const ok = await this.clipboard.copy(text);
    this.status = ok
      ? this.translate.instant('status.copied')
      : this.translate.instant('status.copyFailed');
  }

  onToggleFences(): void {
    this.store.toggleFences();
    this.status = this.translate.instant('status.fencesToggled');
  }

  onClearAll(): void {
    this.store.clearAllValues();
    this.status = this.translate.instant('status.cleared');
  }

  onExport(): void {
    const tpl = this.store.currentTemplate();
    if (!tpl) return;
    const blob = new Blob([JSON.stringify(tpl, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tpl.name || 'template'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.status = this.translate.instant('status.exported');
  }

  onImport(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        this.store.loadTemplate(parsed);
        this.status = this.translate.instant('status.imported');
      } catch {
        this.status = this.translate.instant('status.importFailed');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  toggleHelp(): void {
    this.showHelp = !this.showHelp;
  }

  private announceReorder(delta: -1 | 1): void {
    const key = this.store.lastEditedKey();
    if (!key) return;
    const title = this.store.getSectionTitle(key);
    this.reorderAnnouncement = `${title} moved ${delta < 0 ? 'up' : 'down'}`;
    setTimeout(() => (this.reorderAnnouncement = ''), 1000);
  }

  onSwitchTemplate(evt: Event): void {
    const select = evt.target as HTMLSelectElement;
    this.store.switchTo(select.value);
    this.status = this.translate.instant('status.switched');
  }

  onSaveAs(name: string): void {
    if (!name?.trim()) return;
    this.store.saveAs(name.trim());
    this.status = this.translate.instant('status.saved');
  }

  onDeleteCurrent(): void {
    const id = this.store.currentTemplate()?.id;
    if (!id) return;
    const msg = this.translate.instant('confirmDelete');
    if (!window.confirm(msg || 'Delete current template?')) return;
    this.store.deleteTemplate(id);
    this.status = this.translate.instant('status.deleted');
  }
}
