import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionsListComponent } from './features/sections/sections-list.component';
import { PreviewPaneComponent } from './features/preview/preview-pane.component';
import { StatsPanelComponent } from './features/preview/stats-panel.component';
import { LintPanelComponent } from './features/lint/lint-panel.component';

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
}
