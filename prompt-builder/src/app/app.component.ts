import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionsListComponent } from './features/sections/sections-list.component';
import { PreviewPaneComponent } from './features/preview/preview-pane.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SectionsListComponent, PreviewPaneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'prompt-builder';
}
