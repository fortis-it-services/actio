import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubWorkflowRunModel } from '../git-hub.service';
import { selectWorkflowRunsSortedAndFiltered } from '../state/workflow/workflow.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'actio-workflow-run-grid',
  templateUrl: './workflow-run-grid.component.html',
  styleUrls: ['./workflow-run-grid.component.scss'],
})
export class WorkflowRunGridComponent {

  workflowRuns$: Observable<GithubWorkflowRunModel[]>;

  constructor(private store: Store) {
    this.workflowRuns$ = store.select(selectWorkflowRunsSortedAndFiltered);
  }
}
