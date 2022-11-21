import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {selectWorkflowRunsSortedAndFiltered} from '../state/workflow/workflow.selectors';
import {GithubWorkflowRunModel} from '../git-hub.service';
import {WorkflowRunStatus} from '../workflow-run-status.enum';
import {WorkflowRunConclusion} from '../workflow-run-conclusion.enum';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'actio-workflow-run-table',
  templateUrl: './workflow-run-table.component.html',
  styleUrls: ['./workflow-run-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('1000ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class WorkflowRunTableComponent {

  workflowRuns$: Observable<GithubWorkflowRunModel[]>;
  status = WorkflowRunStatus;
  conclusion = WorkflowRunConclusion;
  expandedWorkflowRun: GithubWorkflowRunModel | null;

  columnsToDisplay: Array<string> = [
    'status',
    'repository',
    'head-branch',
    'name',
    'event',
    'run-started-at',
    'run-number',
    'html-url',
    'expander',
  ];

  isExpandedWorkflowRun(workflowRun: GithubWorkflowRunModel) {
    return this.expandedWorkflowRun?.id === workflowRun.id;
  }

  toggleExpandedWorkflowRun(workflowRun: GithubWorkflowRunModel) {
    this.expandedWorkflowRun = this.isExpandedWorkflowRun(workflowRun) ? null : workflowRun;
  }

  constructor(private store: Store) {
    this.workflowRuns$ = store.select(selectWorkflowRunsSortedAndFiltered);
  }
}
