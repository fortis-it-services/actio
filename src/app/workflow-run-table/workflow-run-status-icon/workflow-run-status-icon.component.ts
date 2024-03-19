import {Component, Input} from '@angular/core';
import {WorkflowRunStatus} from '../../workflow-run-status.enum';
import {WorkflowRunConclusion} from '../../workflow-run-conclusion.enum';
import {WorkflowRun} from '../../git-hub.service';

@Component({
  selector: 'actio-workflow-run-status-icon',
  templateUrl: './workflow-run-status-icon.component.html',
  styleUrls: ['./workflow-run-status-icon.component.css'],
})
export class WorkflowRunStatusIconComponent {

  status = WorkflowRunStatus;
  conclusion = WorkflowRunConclusion;
  @Input() workflowRun: WorkflowRun;

}
