import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectWorkflowRunsSortedAndFiltered} from '../state/workflow/workflow.selectors';
import {GithubWorkflowRunModel} from '../git-hub.service';
import {WorkflowRunStatus} from '../workflow-run-status.enum';
import {WorkflowRunConclusion} from '../workflow-run-conclusion.enum';

@Component({
  selector: 'actio-workflow-run-table',
  templateUrl: './workflow-run-table.component.html',
  styleUrls: ['./workflow-run-table.component.scss'],
})
export class WorkflowRunTableComponent {

  workflowRuns$: Observable<GithubWorkflowRunModel[]>;
  status = WorkflowRunStatus;
  conclusion = WorkflowRunConclusion;

  columnsToDisplay: Array<string> = [
    'status',
    'repository',
    'head-branch',
    'name',
    'event',
    'run-started-at',
    'run-number',
    'html-url',
  ];

  constructor(private store: Store) {
    this.workflowRuns$ = store.select(selectWorkflowRunsSortedAndFiltered);
  }
}
