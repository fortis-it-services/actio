describe('Given a team, some repos and workflow runs', () => {

  beforeEach('setup mocks, login and select team', () => {
    cy.intercept('OPTIONS', '*', {
      statusCode: 204,
      headers: {
        'access-control-max-age': '-1',
        'access-control-allow-credentials': 'true',
        'access-control-allow-origin': 'http://localhost:4200',
        'access-control-allow-methods': 'GET',
        'access-control-allow-headers': 'authorization,user-agent',
      },
    })
      .as('options')

    cy.intercept('GET', '/rate_limit', {fixture: 'rateLimit.json'})
      .as('getRateLimit')

    cy.intercept('GET', '/user', {fixture: 'user.json'})
      .as('getUserLogin');

    cy.intercept('GET', '/user/teams', {fixture: 'teams.json'})
      .as('getUserTeams');

    cy.intercept('GET', '/orgs/fortis-it-services/teams/teamA/repos', {fixture: 'repos.json'})
      .as('getRepos')

    cy.intercept('GET', '/repos/fortis-it-services/repoA/actions/runs*', {fixture: 'runs.json'})
      .as('getRuns')

    cy.visit('/')
  });

  it('should display workflow run contents in chronological order', () => {
    cy.get('button').contains('Enter GitHub Token').click();

    let mockToken = '98a9d8fa89sdf9sa9f8as9ef'
    cy.get('input[type=password]').type(mockToken);
    cy.wait('@getUserLogin');
    cy.wait('@getUserTeams');

    // wait for state changes
    cy.wait(100);

    cy.get('mat-select[ng-reflect-name=teamsSelectionControl]').click();
    cy.get('mat-option').contains('teamA').click();

    // wait for overlay to appear
    cy.wait(100);

    cy.get('.cdk-overlay-backdrop').click();
    cy.get('.mat-icon').contains('close').click();

    cy.get('.workflow-run-row').should('have.length', 4);

    let expectedFirstWorkflowRun =
      ['teamA/repoA', 'stage/dirk', 'WorkflowA', 'push', '125'];
    expectedFirstWorkflowRun.forEach(x => cy.get('.workflow-run-row').eq(0).contains(x));

    let expectedSecondWorkflowRun =
      ['teamA/repoA', 'main', 'WorkflowA', 'workflow_dispatch', '124'];
    expectedSecondWorkflowRun.forEach(x => cy.get('.workflow-run-row').eq(1).contains(x));

    let expectedThirdWorkflowRun =
      ['teamA/repoA', 'stage/max', 'WorkflowA', 'push', '123'];
    expectedThirdWorkflowRun.forEach(x => cy.get('.workflow-run-row').eq(2).contains(x));

    let expectedFourthWorkflowRun =
      ['teamA/repoA', 'stage/max', 'WorkflowB', 'workflow_dispatch', '2'];
    expectedFourthWorkflowRun.forEach(x => cy.get('.workflow-run-row').eq(3).contains(x));
  });

  it('should filter workflow runs by status', () => {
    cy.get('button').contains('Enter GitHub Token').click();

    let mockToken = '98a9d8fa89sdf9sa9f8as9ef'
    cy.get('input[type=password]').type(mockToken);
    cy.wait('@getUserLogin');
    cy.wait('@getUserTeams');

    // wait for state changes
    cy.wait(100);

    cy.get('mat-select[ng-reflect-name=teamsSelectionControl]').click();
    cy.get('mat-option').contains('teamA').click();

    // wait for overlay to appear
    cy.wait(100);

    cy.get('.cdk-overlay-backdrop').click();

    cy.get('mat-select[ng-reflect-name=statusSelectionControl]').click();
    cy.get('mat-option').contains('queued').click();
    cy.get('mat-option').contains('completed').click();

    // wait for overlay to appear
    cy.wait(100)

    cy.get('.cdk-overlay-backdrop').click();
    cy.get('.mat-icon').contains('close').click();

    cy.get('.workflow-run-row').should('have.length', 1);

    let expectedWorkflowRun =
      ['teamA/repoA', 'stage/dirk', 'WorkflowA', 'push', '125'];
    expectedWorkflowRun.forEach(x => cy.get('.workflow-run-row').contains(x));
  });

  it('should filter workflow runs by conclusion', () => {
    cy.get('button').contains('Enter GitHub Token').click();

    let mockToken = '98a9d8fa89sdf9sa9f8as9ef'
    cy.get('input[type=password]').type(mockToken);
    cy.wait('@getUserLogin');
    cy.wait('@getUserTeams');

    // wait for state changes
    cy.wait(100);

    cy.get('mat-select[ng-reflect-name=teamsSelectionControl]').click();
    cy.get('mat-option').contains('teamA').click();

    // wait for overlay to appear
    cy.wait(100);

    cy.get('.cdk-overlay-backdrop').click();

    cy.get('mat-select[ng-reflect-name=conclusionSelectionControl]').click();
    cy.get('mat-option').contains('action_required').click();
    cy.get('mat-option').contains('cancelled').click();
    cy.get('mat-option').contains('failure').click();
    cy.get('mat-option').contains('neutral').click();
    cy.get('mat-option').contains('skipped').click();
    cy.get('mat-option').contains('stale').click();
    cy.get('mat-option').contains('timed_out').click();

    // wait for overlay to appear
    cy.wait(100)

    cy.get('.cdk-overlay-backdrop').click();
    cy.get('.mat-icon').contains('close').click();

    cy.get('.workflow-run-row').should('have.length', 1);

    let expectedWorkflowRun =
      ['teamA/repoA', 'main', 'WorkflowA', 'workflow_dispatch', '124'];
    expectedWorkflowRun.forEach(x => cy.get('.workflow-run-row').contains(x));
  });

  it('should filter workflow runs by workflow name', () => {
    cy.get('button').contains('Enter GitHub Token').click();

    let mockToken = '98a9d8fa89sdf9sa9f8as9ef'
    cy.get('input[type=password]').type(mockToken);
    cy.wait('@getUserLogin');
    cy.wait('@getUserTeams');

    // wait for state changes
    cy.wait(100);

    cy.get('mat-select[ng-reflect-name=teamsSelectionControl]').click();
    cy.get('mat-option').contains('teamA').click();

    // wait for overlay to appear
    cy.wait(100);

    cy.get('.cdk-overlay-backdrop').click();

    let workflowNameToFilter = 'WorkflowB';
    cy.get('mat-chip-list[ng-reflect-name=workflowNameSelectionControl]').type(workflowNameToFilter)
      .type('{enter}');

    // wait for state changes
    cy.wait(100);

    cy.get('.mat-icon').contains('close').click();

    cy.get('.workflow-run-row').should('have.length', 1);

    let expectedWorkflowRun =
      ['teamA/repoA', 'stage/max', 'WorkflowB', 'workflow_dispatch', '2'];
    expectedWorkflowRun.forEach(x => cy.get('.workflow-run-row').contains(x));
  });
})
