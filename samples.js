// LexAssist AI - Problem Statement Aligned Legal Datasets & Use Case Models

const PROBLEM_STATEMENT_USE_CASES = {
  simplifier: "Simplifying complex legal documents into plain, 6th-grade English summaries.",
  comparison: "Comparing contracts, agreements, or policies side-by-side with inconsistency detection.",
  highlighter: "Highlighting important clauses, obligations, financial risks, or contract inconsistencies.",
  qaAssistant: "Answering natural language questions based strictly on provided legal document context.",
  nextSteps: "Helping users understand their legal options, remedies, and potential next steps.",
  checklists: "Generating actionable summaries, negotiation checklists, and key deadline trackers.",
  attorneyPrep: "Helping users prepare structured summaries and questions for a legal professional."
};

const SAMPLE_DOCUMENTS = {
  lease: {
    title: "Commercial Property Lease Agreement",
    category: "Real Estate & Commercial Leases",
    content: `COMMERCIAL PROPERTY LEASE AGREEMENT

This Commercial Lease Agreement ("Lease") is entered into as of January 15, 2026, by and between Apex Property Holdings LLC ("Landlord"), and Retail Concepts Inc. ("Tenant").

1. PREMISES & TERM
Landlord hereby leases to Tenant the premises located at 742 Evergreen Terrace, Suite 100 ("Premises"). The term of this Lease shall be for five (5) years, commencing on February 1, 2026 and expiring on January 31, 2031.

2. RENT & AUTOMATIC ESCALATION
Tenant agrees to pay Landlord base rent of $8,500.00 per month, payable in advance on the first day of each calendar month. Base rent shall automatically escalate by 8% compounded annually on each anniversary of the Commencement Date without prior notice.

3. MAINTENANCE, REPAIRS & TRIPLE NET (NNN) OBLIGATIONS
Tenant shall be solely responsible for all maintenance, repairs, operating expenses, real estate taxes, building insurance, and structural repairs of the Premises. Tenant shall indemnify and hold Landlord harmless against any structural defects, roof leaks, or HVAC system failures during the Lease term.

4. EARLY TERMINATION & LIQUIDATED DAMAGES
Tenant has no right to terminate this Lease prior to the expiration date. In the event Tenant vacates or defaults prior to January 31, 2031, Tenant shall immediately owe Landlord liquidated damages equal to 100% of the remaining unpaid rent for the full unexpired term of the Lease ($510,000 maximum balance), plus attorney fees.

5. RESTRICTIVE COVENANT & NON-COMPETE
Tenant agrees not to operate any competing retail business within a twenty-five (25) mile radius of the Premises during the Lease Term and for a period of three (3) years following termination or expiration of this Lease.

6. DISPUTE RESOLUTION & GOVERNING LAW
This Lease shall be governed by the laws of the State of Delaware. Any legal action must be brought exclusively in the courts of Wilmington, Delaware. Tenant hereby waives all rights to a jury trial and agrees to reimburse Landlord for all legal costs regardless of outcome.`,
    analysis: {
      riskScore: 84,
      riskLevel: "CRITICAL",
      summary: "This Commercial Lease Agreement strongly favors the Landlord and contains several high-risk clauses including mandatory 8% annual rent escalations, full structural NNN liabilities, harsh early termination penalties (100% remaining rent acceleration), and a severe 25-mile 3-year non-compete clause.",
      risks: [
        {
          id: "r1",
          clause: "Section 2: 8% Compounded Annual Escalation",
          level: "HIGH",
          text: "Base rent shall automatically escalate by 8% compounded annually",
          explanation: "8% compounding exceeds typical market inflation rates (usually 3-5%). By Year 5, your monthly rent will rise from $8,500 to over $11,564/month.",
          suggestion: "Negotiate a fixed dollar increase or tie escalation to CPI capped at 3-4%."
        },
        {
          id: "r2",
          clause: "Section 3: Structural Maintenance & HVAC Liability",
          level: "CRITICAL",
          text: "Tenant shall be solely responsible for all maintenance... and structural repairs... roof leaks, or HVAC system failures",
          explanation: "Commercial tenants typically maintain interior spaces, while landlords maintain structural foundation, roof, and exterior. Replacing an HVAC or roof could cost $20,000–$80,000 unexpectedly.",
          suggestion: "Carve out structural elements, foundation, roof, and major HVAC replacements from tenant obligations."
        },
        {
          id: "r3",
          clause: "Section 4: 100% Accelerated Unpaid Rent Penalty",
          level: "CRITICAL",
          text: "Tenant shall immediately owe Landlord liquidated damages equal to 100% of the remaining unpaid rent",
          explanation: "If your business needs to move or shut down in Year 2, you remain liable for the entire remaining rent balance without landlord obligation to mitigate damages by re-leasing.",
          suggestion: "Add a 3 to 6-month rent penalty early-exit break clause with 90 days prior written notice."
        },
        {
          id: "r4",
          clause: "Section 5: 25-Mile 3-Year Non-Compete Radius",
          level: "HIGH",
          text: "not to operate any competing retail business within a twenty-five (25) mile radius... for a period of three (3) years",
          explanation: "Extremely restrictive geographic and duration scope that could prevent you from earning a living or opening nearby stores after moving.",
          suggestion: "Reduce geographic radius to 2-5 miles and duration to 6-12 months post-lease."
        }
      ],
      nextSteps: [
        "Step 1: Request an amendment removing tenant liability for structural foundation, roof leaks, and primary HVAC replacement.",
        "Step 2: Propose an early termination break-clause (90 days notice + 3 months base rent penalty).",
        "Step 3: Counter-propose a 3% CPI rent escalation cap in place of the rigid 8% compounding rate.",
        "Step 4: Reduce the non-compete geographic radius from 25 miles to 3 miles."
      ],
      checklists: [
        "Verify base rent schedule ($8,500/mo) vs projected Year 5 rate ($11,564/mo).",
        "Inspect HVAC equipment condition and request Landlord warranty prior to signing.",
        "Confirm Delaware governing law venue requirements with local legal counsel.",
        "Document existing premises conditions with timestamped photographs before move-in."
      ],
      attorneyQuestions: [
        "Is the 100% accelerated rent liquidated damages clause enforceable under Delaware commercial landlord-tenant law?",
        "Can we insert a mandatory landlord duty to mitigate damages upon early tenant departure?",
        "How can we legally structure the HVAC carve-out to limit tenant repair exposure to $1,500/year?"
      ]
    },
    compareWith: `COMMERCIAL PROPERTY LEASE AGREEMENT (REVISED STANDARD MODEL)

1. PREMISES & TERM
Landlord hereby leases Premises at 742 Evergreen Terrace. Term: 5 years (Feb 1, 2026 to Jan 31, 2031).

2. RENT & ESCALATION
Base rent of $8,500/month, with annual escalation capped at 3.5% tied to Consumer Price Index (CPI).

3. MAINTENANCE & STRUCTURAL OBLIGATIONS
Tenant maintains interior premises. Landlord remains responsible for all structural repairs, foundation, exterior walls, roof, and primary HVAC replacement.

4. EARLY TERMINATION
Tenant may terminate after Month 24 by giving 90 days written notice and paying a break fee equal to 3 months base rent. Landlord must make reasonable efforts to re-lease premises.

5. NON-COMPETE
Tenant agrees not to open a directly competing location within a 3-mile radius during the Lease Term only.`
  },

  saas: {
    title: "Enterprise SaaS Master Services Agreement",
    category: "Technology & Software Contracts",
    content: `MASTER SERVICES AGREEMENT (SaaS)

This Master Services Agreement ("Agreement") is between CloudCorp Systems Inc. ("Provider") and Customer.

1. LICENSE & DATA RIGHTS
Provider grants Customer a non-exclusive, non-transferable subscription. Customer retains ownership of customer data, but grants Provider an irrevocable, perpetual, royalty-free global license to use, aggregate, modify, and train proprietary AI models on all Customer Data uploaded to the Platform.

2. SERVICE LEVEL AGREEMENT & LIABILITY CAP
Provider targets 99.5% uptime. Customer's sole and exclusive remedy for downtime is service credits capped at 5% of monthly fees. In no event shall Provider's total aggregate liability exceed $100.00, regardless of cause of action, including data breaches or loss of confidential data.

3. AUTOMATIC RENEWAL & PRICE INCREASES
Subscriptions automatically renew for consecutive 12-month periods unless canceled 90 days prior to renewal. Provider reserves the right to increase annual fees by up to 25% upon renewal without prior advance notice.

4. INDEMNIFICATION
Customer shall defend, indemnify, and hold harmless Provider against all third-party claims, losses, liabilities, and damages arising out of Customer's data, use of the platform, or alleged breach of agreement.`,
    analysis: {
      riskScore: 78,
      riskLevel: "HIGH",
      summary: "This SaaS Agreement grants the Provider perpetual rights to train AI models on your private customer data and caps the Provider's maximum liability for data breaches at just $100.",
      risks: [
        {
          id: "r1",
          clause: "Section 1: AI Model Training on Proprietary Data",
          level: "HIGH",
          text: "grants Provider an irrevocable, perpetual, royalty-free global license to... train proprietary AI models on all Customer Data",
          explanation: "Your confidential customer lists, intellectual property, or financial documents uploaded could be ingested into Provider's AI models permanently.",
          suggestion: "Request an explicit AI opt-out clause ensuring Customer Data is excluded from model training."
        },
        {
          id: "r2",
          clause: "Section 2: $100 Liability Cap for Data Breaches",
          level: "CRITICAL",
          text: "In no event shall Provider's total aggregate liability exceed $100.00, regardless of cause",
          explanation: "If Provider suffers a security failure exposing sensitive data, your recovery is limited to $100, leaving you exposed to massive liability.",
          suggestion: "Set liability cap to 12 months of fees paid, with a carve-out for confidentiality breaches."
        }
      ],
      nextSteps: [
        "Step 1: Require an explicit Data Processing Addendum (DPA) barring AI model training on customer data.",
        "Step 2: Increase liability cap to 12x monthly recurring revenue (MRR) or $1,000,000 for data privacy breaches."
      ],
      checklists: [
        "Calendar the 90-day auto-renewal cancellation deadline.",
        "Verify SOC2 Type II compliance reports from Provider."
      ],
      attorneyQuestions: [
        "Does the perpetual AI training license breach our existing customer confidentiality obligations?"
      ]
    },
    compareWith: `MASTER SERVICES AGREEMENT (FAIR CUSTOMER MODEL)

1. DATA PRIVACY & NO AI TRAINING
Customer retains exclusive ownership. Provider shall NOT train AI models on Customer Data.

2. LIABILITY CAP
Provider liability capped at 12 months of subscription fees ($1,000,000 cap for data breach).`
  },

  nda: {
    title: "Mutual Non-Disclosure Agreement (NDA)",
    category: "Corporate & Confidentiality",
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is dated February 1, 2026, between Alpha Corp and Beta Solutions Inc.

1. CONFIDENTIAL INFORMATION
Confidential Information includes technical data, trade secrets, financial records, customer lists, and business strategies disclosed by either party.

2. EXCLUSIONS FROM CONFIDENTIALITY
Confidential Information does not include information that is publicly known, already in recipient's possession without restriction, or independently developed without reference to disclosed data.

3. OBLIGATIONS & DURATION
Each party agrees to hold Confidential Information in strict confidence for a period of two (2) years from the date of disclosure, using the same degree of care used for its own confidential assets.

4. RETURN OR DESTRUCTION OF MATERIALS
Upon written request, the receiving party shall promptly return or certify destruction of all physical and digital copies of disclosed Confidential Information within thirty (30) days.`,
    analysis: {
      riskScore: 22,
      riskLevel: "LOW",
      summary: "Balanced Standard NDA with standard 2-year confidentiality period, mutual protection obligations, standard exclusions, and clean return/destruction terms.",
      risks: [
        {
          id: "r1",
          clause: "Section 3: 2-Year Term Duration",
          level: "LOW",
          text: "for a period of two (2) years from the date of disclosure",
          explanation: "2 years is standard for general commercial discussions, though trade secrets often warrant perpetual protection.",
          suggestion: "If sharing highly sensitive source code or trade secrets, stipulate perpetual protection for trade secrets."
        }
      ],
      nextSteps: [
        "Step 1: Execute standard agreement.",
        "Step 2: Add trade secret exception for perpetual confidentiality if disclosing proprietary source code."
      ],
      checklists: [
        "Ensure disclosures are marked 'Confidential' in writing within 30 days of verbal disclosure."
      ],
      attorneyQuestions: [
        "Should we add a non-solicitation of employees clause to this mutual NDA?"
      ]
    },
    compareWith: `UNILATERAL NDA (STRICT VERSION)
1. CONFIDENTIAL INFORMATION: Applies only to disclosures by Discloser.
2. DURATION: Indefinite survival for trade secrets.`
  }
};

const CLAUSE_TEMPLATES = [
  {
    id: "nda_mutual",
    title: "Mutual Non-Disclosure Clause",
    category: "Confidentiality",
    description: "Standard mutual confidentiality clause protecting sensitive commercial discussions.",
    fields: [
      { id: "partyA", label: "Party A Name", default: "Acme Corp" },
      { id: "partyB", label: "Party B Name", default: "Global Innovations Inc." },
      { id: "durationYears", label: "Duration (Years)", default: "3" },
      { id: "jurisdiction", label: "State / Jurisdiction", default: "California" }
    ],
    generate: (f) => `MUTUAL CONFIDENTIALITY CLAUSE
1. Protection Obligations. Each party ("${f.partyA}" and "${f.partyB}") agrees to protect all confidential technical, financial, and proprietary information disclosed by the other party with the highest degree of care.
2. Term. The confidentiality obligations under this clause shall remain in effect for a period of ${f.durationYears} years following disclosure.
3. Governing Law. This obligation shall be governed by and construed in accordance with the laws of the State of ${f.jurisdiction}.`
  },
  {
    id: "ip_assignment",
    title: "Independent Contractor IP Assignment Clause",
    category: "Intellectual Property",
    description: "Ensures all work product created by a contractor belongs exclusively to the hiring company.",
    fields: [
      { id: "companyName", label: "Company Name", default: "TechVentures LLC" },
      { id: "contractorName", label: "Contractor Name", default: "John Doe" },
      { id: "workScope", label: "Scope of Work", default: "Software & UI Development" }
    ],
    generate: (f) => `INTELLECTUAL PROPERTY ASSIGNMENT CLAUSE
1. Work Made for Hire. All code, designs, artwork, and deliverables created by ${f.contractorName} for ${f.companyName} relating to ${f.workScope} shall be deemed a "work made for hire" owned exclusively by ${f.companyName}.
2. Assignment of Rights. To the extent any work product does not qualify as a work made for hire, ${f.contractorName} hereby irrevocably assigns and transfers to ${f.companyName} all worldwide right, title, patent, trademark, and copyright interests.`
  },
  {
    id: "limitation_liability",
    title: "Limitation of Liability & Cap Clause",
    category: "Risk Mitigation",
    description: "Limits maximum legal monetary exposure in contract disputes.",
    fields: [
      { id: "capAmount", label: "Liability Cap ($)", default: "50,000" },
      { id: "capMonths", label: "Or Fee Period (Months)", default: "12" },
      { id: "excludedRisks", label: "Uncapped Exceptions", default: "Gross negligence, intentional misconduct, and breach of confidentiality" }
    ],
    generate: (f) => `LIMITATION OF LIABILITY CLAUSE
1. Monetary Cap. Except for ${f.excludedRisks}, neither party's total aggregate liability arising out of or related to this Agreement shall exceed the total amount paid by Customer in the ${f.capMonths} months preceding the claim, or $${f.capAmount}, whichever is less.
2. Consequential Damages Waiver. In no event shall either party be liable for indirect, incidental, punitive, or consequential damages.`
  },
  {
    id: "termination_convenience",
    title: "Termination for Convenience Clause",
    category: "Contracts",
    description: "Allows flexible contract exit with required advance notice period.",
    fields: [
      { id: "noticeDays", label: "Notice Period (Days)", default: "30" },
      { id: "terminatingParty", label: "Who Can Terminate", default: "Either Party" }
    ],
    generate: (f) => `TERMINATION FOR CONVENIENCE CLAUSE
1. Right to Terminate. ${f.terminatingParty} may terminate this Agreement at any time, with or without cause, by providing at least ${f.noticeDays} days prior written notice to the other party.
2. Final Accounting. Upon termination, Customer shall pay for all services satisfactorily performed prior to the effective date of termination, and Provider shall refund any unearned prepaid fees.`
  }
];

if (typeof module !== 'undefined') {
  module.exports = { PROBLEM_STATEMENT_USE_CASES, SAMPLE_DOCUMENTS, CLAUSE_TEMPLATES };
}
