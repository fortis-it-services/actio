import { Component, Input } from '@angular/core';
import { GithubWorkflowRunModel } from '../git-hub.service';
import { WorkflowRunStatus } from './workflow-run-status.enum';
import { WorkflowRunConclusion } from './workflow-run-conclusion.enum';

@Component({
  selector: 'actio-workflow-run',
  templateUrl: './workflow-run.component.html',
  styleUrls: ['./workflow-run.component.scss'],
})
export class WorkflowRunComponent {

  status = WorkflowRunStatus
  conclusion = WorkflowRunConclusion

  @Input() run: GithubWorkflowRunModel;

  constructor() {
  }

}
