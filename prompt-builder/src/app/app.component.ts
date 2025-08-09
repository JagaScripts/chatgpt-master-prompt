import { Component, HostListener, inject } from '@angular/core';
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

  private readonly store = inject(TemplatesStore);
  private readonly clipboard = inject(ClipboardService);
  private readonly synth = inject(SynthesisService);

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
      this.status = ok ? 'Copied' : 'Copy failed';
      return;
    }
    // Ctrl+Shift+P: toggle fences
    if (ctrl && shift && (event.key === 'P' || event.key === 'p')) {
      event.preventDefault();
      this.store.toggleFences();
      this.status = 'Fences toggled';
      return;
    }
    // Ctrl+Alt+Up/Down: reorder last-edited section
    if (ctrl && alt && event.key === 'ArrowUp') {
      event.preventDefault();
      this.store.moveSectionUp();
      return;
    }
    if (ctrl && alt && event.key === 'ArrowDown') {
      event.preventDefault();
      this.store.moveSectionDown();
      return;
    }
  }

  async onCopy(): Promise<void> {
    const text = this.synth.synthesizeMarkdown(this.store.currentTemplate());
    const ok = await this.clipboard.copy(text);
    this.status = ok ? 'Copied' : 'Copy failed';
  }

  onToggleFences(): void {
    this.store.toggleFences();
    this.status = 'Fences toggled';
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
    this.status = 'Exported';
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
        this.status = 'Imported';
      } catch {
        this.status = 'Import failed';
      }
    };
    reader.readAsText(file);
    input.value = '';
  }
}
