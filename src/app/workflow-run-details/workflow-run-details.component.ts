import {Component, Input} from '@angular/core';
import {WorkflowRun} from '../git-hub.service';
import {WorkflowRunStatus} from '../workflow-run-status.enum';
import {WorkflowRunConclusion} from '../workflow-run-conclusion.enum';

@Component({
  selector: 'actio-workflow-run-details',
  templateUrl: './workflow-run-details.component.html',
  styleUrls: ['./workflow-run-details.component.scss'],
})
export class WorkflowRunDetailsComponent {

  status = WorkflowRunStatus;
  conclusion = WorkflowRunConclusion;
  @Input()
  workflowRun: WorkflowRun;

  constructor() {
  }
}
