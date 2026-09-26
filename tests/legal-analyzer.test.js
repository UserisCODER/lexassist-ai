/**
 * @file legal-analyzer.test.js
 * @description Automated Unit Test Suite for LexAssist AI Legal Analysis Engine
 * @suite Testing & Code Quality Verification
 */

const { SAMPLE_DOCUMENTS, CLAUSE_TEMPLATES } = require('../samples.js');

describe('LexAssist AI Legal Analysis Engine Suite', () => {

  test('1. Verify Commercial Lease Analysis Risk Calculation', () => {
    const lease = SAMPLE_DOCUMENTS.lease;
    expect(lease).toBeDefined();
    expect(lease.analysis.riskScore).toBeGreaterThanOrEqual(75);
    expect(lease.analysis.riskLevel).toBe('CRITICAL');
    expect(lease.analysis.risks.length).toBeGreaterThan(0);
  });

  test('2. Verify SaaS Master Services Agreement Risk Flags', () => {
    const saas = SAMPLE_DOCUMENTS.saas;
    expect(saas).toBeDefined();
    expect(saas.analysis.riskScore).toBe(78);
    expect(saas.analysis.riskLevel).toBe('HIGH');
    
    // Check for liability cap risk detection
    const liabilityRisk = saas.analysis.risks.find(r => r.id === 'r2');
    expect(liabilityRisk).toBeDefined();
    expect(liabilityRisk.text).toContain('$100.00');
  });

  test('3. Verify Mutual NDA Low-Risk Score Benchmark', () => {
    const nda = SAMPLE_DOCUMENTS.nda;
    expect(nda).toBeDefined();
    expect(nda.analysis.riskScore).toBeLessThan(30);
    expect(nda.analysis.riskLevel).toBe('LOW');
  });

  test('4. Verify Dynamic Clause Template Generator Engine', () => {
    const ndaTemplate = CLAUSE_TEMPLATES.find(t => t.id === 'nda_mutual');
    expect(ndaTemplate).toBeDefined();
    
    const output = ndaTemplate.generate({
      partyA: 'Acme Corp',
      partyB: 'Beta LLC',
      durationYears: '5',
      jurisdiction: 'New York'
    });

    expect(output).toContain('Acme Corp');
    expect(output).toContain('Beta LLC');
    expect(output).toContain('5 years');
    expect(output).toContain('State of New York');
  });

});
