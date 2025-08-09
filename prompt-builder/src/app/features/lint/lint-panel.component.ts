import { Component, computed, inject } from '@angular/core';
import { TemplatesStore } from '../../core/store/templates.store';

/**
 * Minimal lint panel: required sections and basic checks.
 */
@Component({
  selector: 'app-lint-panel',
  standalone: true,
  template: `
    <div class="card mb-3">
      <div class="card-header">Lint</div>
      <ul
        class="list-group list-group-flush"
        *ngIf="issues().length; else clean"
      >
        <li class="list-group-item" *ngFor="let i of issues()">{{ i }}</li>
      </ul>
      <ng-template #clean>
        <div class="card-body text-muted">No issues detected.</div>
      </ng-template>
    </div>
  `,
})
export class LintPanelComponent {
  private readonly store = inject(TemplatesStore);

  readonly issues = computed(() => {
    const tpl = this.store.currentTemplate();
    if (!tpl) return [] as string[];
    const map = new Map(tpl.sections.map((s) => [s.key, s]));
    const problems: string[] = [];
    const goal = map.get('goal');
    if (!goal?.enabled || !goal.value || goal.value.trim().length < 10) {
      problems.push('Goal is required and should be at least 10 characters.');
    }
    const output = map.get('outputFormat');
    if (!output?.enabled || !output.value || output.value.trim().length === 0) {
      problems.push('Output format is required.');
    }
    return problems;
  });
}
