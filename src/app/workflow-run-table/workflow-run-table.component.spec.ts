import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowRunTableComponent } from './workflow-run-table.component';

describe('WorkflowRunTableComponent', () => {
  let component: WorkflowRunTableComponent;
  let fixture: ComponentFixture<WorkflowRunTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowRunTableComponent ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowRunTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
