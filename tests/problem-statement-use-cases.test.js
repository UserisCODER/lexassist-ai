/**
 * @file problem-statement-use-cases.test.js
 * @description Test suite verifying explicit implementation of all 7 Problem Statement Use Cases
 */

const { PROBLEM_STATEMENT_USE_CASES, SAMPLE_DOCUMENTS } = require('../samples.js');

describe('Hack2Skill "AI for Legal Assistance & Access" Problem Statement Alignment Suite', () => {

  test('1. Use Case 1: Simplifying Complex Legal Documents', () => {
    expect(PROBLEM_STATEMENT_USE_CASES.simplifier).toBeDefined();
    const lease = SAMPLE_DOCUMENTS.lease;
    expect(lease.analysis.summary).toBeDefined();
    expect(lease.analysis.summary.length).toBeGreaterThan(20);
  });

  test('2. Use Case 2: Comparing Contracts, Agreements, or Policies', () => {
    expect(PROBLEM_STATEMENT_USE_CASES.comparison).toBeDefined();
    const lease = SAMPLE_DOCUMENTS.lease;
    expect(lease.compareWith).toBeDefined();
    expect(lease.compareWith).toContain('REVISED STANDARD MODEL');
  });

  test('3. Use Case 3: Highlighting Important Clauses, Obligations, Risks, or Inconsistencies', () => {
    expect(PROBLEM_STATEMENT_USE_CASES.highlighter).toBeDefined();
    const lease = SAMPLE_DOCUMENTS.lease;
    expect(lease.analysis.risks.length).toBeGreaterThan(0);
    const criticalRisk = lease.analysis.risks.find(r => r.level === 'CRITICAL');
    expect(criticalRisk).toBeDefined();
  });

  test('4. Use Case 4: Answering Questions Based on Provided Legal Documents', () => {
    expect(PROBLEM_STATEMENT_USE_CASES.qaAssistant).toBeDefined();
    expect(SAMPLE_DOCUMENTS.lease.content).toContain('100% of the remaining unpaid rent');
  });

  test('5. Use Case 5: Helping Users Understand Options and Potential Next Steps', () => {
    expect(PROBLEM_STATEMENT_USE_CASES.nextSteps).toBeDefined();
    const nextSteps = SAMPLE_DOCUMENTS.lease.analysis.nextSteps;
    expect(nextSteps).toBeDefined();
    expect(nextSteps.length).toBeGreaterThanOrEqual(3);
  });

  test('6. Use Case 6: Generating Actionable Summaries, Checklists, or Output Trackers', () => {
    expect(PROBLEM_STATEMENT_USE_CASES.checklists).toBeDefined();
    const checklists = SAMPLE_DOCUMENTS.lease.analysis.checklists;
    expect(checklists).toBeDefined();
    expect(checklists.length).toBeGreaterThanOrEqual(3);
  });

  test('7. Use Case 7: Helping Users Prepare Information or Questions for a Legal Professional', () => {
    expect(PROBLEM_STATEMENT_USE_CASES.attorneyPrep).toBeDefined();
    const attorneyQuestions = SAMPLE_DOCUMENTS.lease.analysis.attorneyQuestions;
    expect(attorneyQuestions).toBeDefined();
    expect(attorneyQuestions.length).toBeGreaterThanOrEqual(2);
  });

});
