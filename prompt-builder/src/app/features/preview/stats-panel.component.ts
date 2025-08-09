import { Component, computed, inject } from '@angular/core';
import { EstimatorService } from '../../core/services/estimator.service';
import { TemplatesStore } from '../../core/store/templates.store';
import { SynthesisService } from '../../core/services/synthesis.service';

/**
 * Displays characters, words, and token estimates for the current template.
 */
@Component({
  selector: 'app-stats-panel',
  standalone: true,
  template: `
    <div class="card mb-3">
      <div class="card-header">Stats</div>
      <div class="card-body">
        <div class="row text-center">
          <div class="col-4"><strong>{{ chars() }}</strong><div class="text-muted small">chars</div></div>
          <div class="col-4"><strong>{{ words() }}</strong><div class="text-muted small">words</div></div>
          <div class="col-4"><strong>{{ tokens() }}</strong><div class="text-muted small">tokens (≈)</div></div>
        </div>
      </div>
    </div>
  `,
})
export class StatsPanelComponent {
  private readonly store = inject(TemplatesStore);
  private readonly synth = inject(SynthesisService);
  private readonly estimator = inject(EstimatorService);

  private readonly text = computed(() =>
    this.synth.synthesizeMarkdown(this.store.currentTemplate()),
  );

  readonly chars = computed(() => this.estimator.countCharacters(this.text()));
  readonly words = computed(() => this.estimator.countWords(this.text()));
  readonly tokens = computed(() => this.estimator.estimateTokens(this.text()));
}


