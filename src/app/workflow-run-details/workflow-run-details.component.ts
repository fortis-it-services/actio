import {Component, Input, OnInit} from '@angular/core';
import {GitHubService, GithubWorkflowJobModelWithLogs, GithubWorkflowRunModel} from '../git-hub.service';
import {Observable} from 'rxjs';
import {WorkflowRunStatus} from '../workflow-run-status.enum';
import {WorkflowRunConclusion} from '../workflow-run-conclusion.enum';

@Component({
  selector: 'actio-workflow-run-details',
  templateUrl: './workflow-run-details.component.html',
  styleUrls: ['./workflow-run-details.component.scss'],
})
export class WorkflowRunDetailsComponent implements OnInit {

  status = WorkflowRunStatus;
  conclusion = WorkflowRunConclusion;
  @Input()
  workflowRun: GithubWorkflowRunModel;
  workflowJobsWithLogs$: Observable<GithubWorkflowJobModelWithLogs[]>;

  constructor(private gitHubService: GitHubService) {
  }

  ngOnInit(): void {
    this.workflowJobsWithLogs$ = this.gitHubService.loadGithubWorkflowJobModelWithLogs(this.workflowRun)
  }
}
