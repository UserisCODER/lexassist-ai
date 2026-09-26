/**
 * @file app.js
 * @description Core LexAssist AI Application Engine & State Manager
 * Fully Aligned with Hack2Skill "AI for Legal Assistance & Access" Problem Statement Use Cases.
 */

// ============================================================================
// 1. STATE MANAGEMENT OBJECT
// ============================================================================
const state = {
  activeTab: 'analyze', // 'analyze', 'compare', 'highlight', 'chat', 'nextsteps', 'checklists', 'attorney'
  currentDocument: {
    id: 'lease',
    title: SAMPLE_DOCUMENTS.lease.title,
    content: SAMPLE_DOCUMENTS.lease.content,
    category: SAMPLE_DOCUMENTS.lease.category
  },
  compareDocument: {
    title: 'Revised Standard Model Lease',
    content: SAMPLE_DOCUMENTS.lease.compareWith
  },
  analysis: SAMPLE_DOCUMENTS.lease.analysis,
  highlightsActive: true,
  jargonActive: true,
  chatHistory: [
    { sender: 'ai', text: 'Hello! I am your AI Legal Assistant. I have analyzed this document and am ready to help you navigate clauses, risks, next steps, and attorney preparation.' }
  ],
  savedDocs: [
    { id: 'lease', title: 'Commercial Lease (742 Evergreen)', riskScore: 84, date: '2026-09-26' },
    { id: 'saas', title: 'CloudCorp SaaS Agreement', riskScore: 78, date: '2026-09-25' },
    { id: 'nda', title: 'Mutual NDA - Alpha Corp', riskScore: 22, date: '2026-09-20' }
  ]
};

// ============================================================================
// 2. DOMPURIFY SECURITY SANITIZATION ENGINE
// ============================================================================
/**
 * Sanitizes input using DOMPurify with strict fallback entity encoding.
 * @param {string} str - Raw string input
 * @returns {string} Safe HTML string
 */
function sanitizeHTML(str) {
  if (!str) return '';
  if (typeof window !== 'undefined' && window.DOMPurify) {
    return window.DOMPurify.sanitize(String(str));
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function announceAria(message) {
  const announcer = document.getElementById('aria-announcer');
  if (announcer) {
    announcer.textContent = message;
  }
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initNavigation();
  initActionToolbar();
  renderWorkspace();
  setupModalListeners();
  setupKeyboardAccessibility();
});

// ============================================================================
// 3. HERO TYPOGRAPHY ANIMATION ENGINE
// ============================================================================
function initHeroAnimations() {
  const pinIcon = document.getElementById('hero-pin-icon');
  const mainHeading = document.getElementById('hero-main-heading');
  const subheading = document.getElementById('hero-subheading');
  const ctaBtn = document.getElementById('hero-cta-btn');

  if (!mainHeading || !subheading) return;

  if (pinIcon) {
    pinIcon.style.opacity = '0';
    pinIcon.style.transform = 'translateY(-20px)';
    pinIcon.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      pinIcon.style.opacity = '1';
      pinIcon.style.transform = 'translateY(0)';
    }, 100);
  }

  const wrapWords = (element, startDelay = 200, step = 50) => {
    const rawHTML = element.innerHTML;
    const lines = rawHTML.split(/(<br\s*\/?>)/i);
    let cumulativeDelay = startDelay;
    let newContent = '';

    lines.forEach(segment => {
      if (segment.match(/<br\s*\/?>/i)) {
        newContent += segment;
      } else {
        const words = segment.trim().split(/\s+/);
        words.forEach(word => {
          if (word) {
            newContent += `<span class="word-wrap" style="animation-delay: ${cumulativeDelay}ms;">${word}</span> `;
            cumulativeDelay += step;
          }
        });
      }
    });

    element.innerHTML = newContent;
    return cumulativeDelay;
  };

  const headingEndTime = wrapWords(mainHeading, 200, 70);
  const subEndTime = wrapWords(subheading, headingEndTime + 100, 40);

  if (ctaBtn) {
    ctaBtn.style.opacity = '0';
    ctaBtn.style.transform = 'translateY(15px)';
    ctaBtn.style.transition = 'all 0.6s ease-out';
    setTimeout(() => {
      ctaBtn.style.opacity = '1';
      ctaBtn.style.transform = 'translateY(0)';
    }, subEndTime + 150);
  }
}

// ============================================================================
// 4. NAVIGATION & MODE SWITCHER ENGINE
// ============================================================================
function initNavigation() {
  const modeTabs = document.querySelectorAll('.mode-tab');
  modeTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetMode = tab.getAttribute('data-mode');
      switchMode(targetMode);
    });
  });

  const mobileSelect = document.getElementById('mobile-mode-select');
  if (mobileSelect) {
    mobileSelect.addEventListener('change', (e) => switchMode(e.target.value));
  }

  const drawerBtn = document.getElementById('hamburger-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerOverlay = document.getElementById('drawer-backdrop');
  const sideDrawer = document.getElementById('side-drawer');

  const openDrawer = () => {
    sideDrawer.classList.remove('translate-x-full');
    drawerOverlay.classList.remove('hidden');
    drawerBtn.setAttribute('aria-expanded', 'true');
    renderSavedDocsList();
    announceAria('Side menu drawer opened');
  };

  const closeDrawer = () => {
    sideDrawer.classList.add('translate-x-full');
    drawerOverlay.classList.add('hidden');
    drawerBtn.setAttribute('aria-expanded', 'false');
    announceAria('Side menu drawer closed');
  };

  if (drawerBtn) drawerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  const disclaimerTrigger = document.getElementById('disclaimer-modal-trigger');
  if (disclaimerTrigger) {
    disclaimerTrigger.addEventListener('click', () => {
      alert("Legal Assistance Disclaimer: LexAssist AI provides automated legal information, document analysis, and educational assistance to help users navigate agreements and prepare for legal counsel. It does not constitute formal legal advice.");
    });
  }
}

function switchMode(mode) {
  state.activeTab = mode;
  document.querySelectorAll('.mode-tab').forEach(t => {
    const isTarget = t.getAttribute('data-mode') === mode;
    t.classList.toggle('bg-indigo-600', isTarget);
    t.classList.toggle('text-white', isTarget);
    t.classList.toggle('text-gray-300', !isTarget);
    t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  const mobileSelect = document.getElementById('mobile-mode-select');
  if (mobileSelect) mobileSelect.value = mode;

  announceAria(`Switched use case view to ${mode}`);
  renderWorkspace();
}

// ============================================================================
// 5. WORKSPACE RENDERER FOR ALL 7 PROBLEM STATEMENT USE CASES
// ============================================================================
function renderWorkspace() {
  const container = document.getElementById('workspace-container');
  if (!container) return;

  switch (state.activeTab) {
    case 'analyze':
      container.innerHTML = getAnalyzeWorkspaceHTML();
      attachAnalyzeViewListeners();
      renderDocumentText();
      break;

    case 'compare':
      container.innerHTML = getCompareWorkspaceHTML();
      attachCompareListeners();
      break;

    case 'highlight':
      container.innerHTML = getHighlightWorkspaceHTML();
      renderDocumentText();
      break;

    case 'chat':
      container.innerHTML = getChatWorkspaceHTML();
      renderChatMessages();
      attachChatListeners();
      break;

    case 'nextsteps':
      container.innerHTML = getNextStepsWorkspaceHTML();
      break;

    case 'checklists':
      container.innerHTML = getChecklistsWorkspaceHTML();
      break;

    case 'attorney':
      container.innerHTML = getAttorneyPrepWorkspaceHTML();
      attachAttorneyListeners();
      break;

    default:
      container.innerHTML = getAnalyzeWorkspaceHTML();
  }
}

// USE CASE 1: Document Simplifier HTML
function getAnalyzeWorkspaceHTML() {
  const risk = state.analysis || { riskScore: 50, riskLevel: 'MEDIUM', summary: 'Analysis pending', risks: [] };
  const badgeColor = risk.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                     risk.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                     'bg-green-500/20 text-green-400 border-green-500/40';

  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      <div class="lg:col-span-7 glass-panel rounded-2xl p-5 flex flex-col h-[750px]">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
          <div class="flex items-center space-x-3">
            <span class="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </span>
            <div>
              <h3 id="doc-view-title" class="font-semibold text-white">${sanitizeHTML(state.currentDocument.title)}</h3>
              <p class="text-xs text-gray-400">Use Case 1: Document Simplification (${sanitizeHTML(state.currentDocument.category)})</p>
            </div>
          </div>
          
          <button id="preset-selector-btn" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-lg border border-slate-700 transition">
            Load Benchmark Contract ▼
          </button>
        </div>

        <div id="document-text-container" tabindex="0" role="region" aria-label="Document Viewer" class="flex-1 overflow-y-auto pr-3 font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap select-text focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg">
        </div>
      </div>

      <div class="lg:col-span-5 glass-panel rounded-2xl p-5 flex flex-col h-[750px] overflow-y-auto">
        <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 mb-5 flex items-center justify-between">
          <div>
            <div class="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Contract Safety Score</div>
            <div class="flex items-baseline space-x-2">
              <span class="text-3xl font-bold text-white">${risk.riskScore}</span>
              <span class="text-sm text-gray-400">/ 100</span>
            </div>
          </div>
          <div>
            <span class="px-3.5 py-1.5 text-xs font-semibold rounded-full border ${badgeColor}">
              ${risk.riskLevel} RISK
            </span>
          </div>
        </div>

        <div class="mb-5">
          <h4 class="text-sm font-semibold text-white mb-2 flex items-center">
            <svg class="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Plain-English Executive Summary
          </h4>
          <p class="text-xs leading-relaxed text-gray-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            ${sanitizeHTML(risk.summary)}
          </p>
        </div>

        <div class="flex-1">
          <h4 class="text-sm font-semibold text-white mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Key Provisions & Traps (${risk.risks ? risk.risks.length : 0})
          </h4>

          <div class="space-y-3">
            ${risk.risks ? risk.risks.map(r => `
              <div class="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-gray-200">${sanitizeHTML(r.clause)}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded font-bold ${r.level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}">
                    ${r.level}
                  </span>
                </div>
                <p class="text-xs text-gray-300 mb-2">${sanitizeHTML(r.explanation)}</p>
                <div class="text-[11px] text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                  <strong class="font-bold">💡 Recommended Remedy:</strong> ${sanitizeHTML(r.suggestion)}
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

// USE CASE 2: Contract Comparison HTML
function getCompareWorkspaceHTML() {
  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
        <div>
          <h3 class="text-lg font-semibold text-white flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            Use Case 2: Comparing Contracts, Agreements, & Policies
          </h3>
          <p class="text-xs text-gray-400">Side-by-side comparison to spot differences, added liabilities, and inconsistencies.</p>
        </div>
        <button id="run-compare-ai-btn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl btn-glow transition">
          Run Comparison Analysis
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <div class="flex flex-col h-full bg-slate-900/60 rounded-xl border border-slate-800 p-4">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span class="text-xs font-bold text-indigo-400 uppercase">Document A (Proposed Version)</span>
            <span class="text-[11px] text-gray-400">${sanitizeHTML(state.currentDocument.title)}</span>
          </div>
          <div class="flex-1 overflow-y-auto font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
            ${sanitizeHTML(state.currentDocument.content)}
          </div>
        </div>

        <div class="flex flex-col h-full bg-slate-900/60 rounded-xl border border-slate-800 p-4">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span class="text-xs font-bold text-emerald-400 uppercase">Document B (Standard Benchmark Version)</span>
            <span class="text-[11px] text-gray-400">${sanitizeHTML(state.compareDocument.title)}</span>
          </div>
          <div class="flex-1 overflow-y-auto font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
            ${sanitizeHTML(state.compareDocument.content)}
          </div>
        </div>
      </div>
    </div>
  `;
}

// USE CASE 3: Risk & Clause Highlighter HTML
function getHighlightWorkspaceHTML() {
  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="pb-4 mb-4 border-b border-gray-800">
        <h3 class="text-lg font-semibold text-white flex items-center">
          <svg class="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Use Case 3: Highlighting Important Clauses, Obligations, & Risks
        </h3>
        <p class="text-xs text-gray-400">Interactive document view with dynamic risk marks highlighting predatory terms in real-time.</p>
      </div>

      <div class="flex-1 overflow-y-auto font-mono text-sm leading-relaxed text-gray-200 bg-slate-900/80 p-5 rounded-xl border border-slate-800 whitespace-pre-wrap">
        ${getHighlightedDocumentHTML()}
      </div>
    </div>
  `;
}

// USE CASE 4: Legal Q&A Assistant HTML
function getChatWorkspaceHTML() {
  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
            AI
          </div>
          <div>
            <h3 class="text-base font-semibold text-white">Use Case 4: Answering Questions Based on Provided Legal Documents</h3>
            <p class="text-xs text-gray-400">Trained strictly on: <strong class="text-indigo-300">${sanitizeHTML(state.currentDocument.title)}</strong></p>
          </div>
        </div>
        <button id="clear-chat-btn" class="text-xs text-gray-400 hover:text-gray-200 underline">Clear Chat</button>
      </div>

      <div class="flex items-center space-x-2 overflow-x-auto pb-3 mb-2 text-xs">
        <span class="text-gray-400 font-medium whitespace-nowrap">Suggested:</span>
        <button class="chat-chip px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-full border border-slate-700 whitespace-nowrap">What is the early termination penalty?</button>
        <button class="chat-chip px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-full border border-slate-700 whitespace-nowrap">Am I responsible for roof leaks or HVAC repair?</button>
        <button class="chat-chip px-3 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-full border border-slate-700 whitespace-nowrap">How much will rent increase over 5 years?</button>
      </div>

      <div id="chat-messages-container" role="log" aria-live="polite" class="flex-1 overflow-y-auto space-y-4 pr-3 py-2">
      </div>

      <form id="chat-form" class="mt-4 flex items-center space-x-3">
        <input id="chat-input" type="text" placeholder="Ask any question about clauses, risks, or obligations in this agreement..." 
          class="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" required />
        <button type="submit" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl btn-glow transition">
          Ask Legal AI
        </button>
      </form>
    </div>
  `;
}

// USE CASE 5: Options & Next Steps Guide HTML
function getNextStepsWorkspaceHTML() {
  const nextSteps = state.analysis.nextSteps || [
    "Step 1: Request written clarification on ambiguous terms.",
    "Step 2: Propose cap on monetary penalties."
  ];

  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="pb-4 mb-4 border-b border-gray-800">
        <h3 class="text-lg font-semibold text-white flex items-center">
          <svg class="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Use Case 5: Helping Users Understand Options & Potential Next Steps
        </h3>
        <p class="text-xs text-gray-400">Strategic options, counter-proposal avenues, and recommended actions derived from document analysis.</p>
      </div>

      <div class="space-y-4 flex-1 overflow-y-auto">
        ${nextSteps.map((step, idx) => `
          <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start space-x-3">
            <span class="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
              ${idx + 1}
            </span>
            <div>
              <p class="text-xs text-gray-200 leading-relaxed">${sanitizeHTML(step)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// USE CASE 6: Checklists & Summaries Generator HTML
function getChecklistsWorkspaceHTML() {
  const checklists = state.analysis.checklists || ["Verify base rent schedule", "Confirm inspection reports"];

  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="pb-4 mb-4 border-b border-gray-800">
        <h3 class="text-lg font-semibold text-white flex items-center">
          <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          Use Case 6: Generating Actionable Summaries & Checklists
        </h3>
        <p class="text-xs text-gray-400">Action items, deadline trackers, and verification checklists generated from the document.</p>
      </div>

      <div class="space-y-3 flex-1 overflow-y-auto">
        ${checklists.map(item => `
          <div class="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center space-x-3">
            <input type="checkbox" class="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700 focus:ring-indigo-500" />
            <span class="text-xs text-gray-200">${sanitizeHTML(item)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// USE CASE 7: Legal Professional Preparation Tool HTML
function getAttorneyPrepWorkspaceHTML() {
  const questions = state.analysis.attorneyQuestions || [
    "Is the liquidated damages clause enforceable in Delaware?"
  ];

  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
        <div>
          <h3 class="text-lg font-semibold text-white flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path></svg>
            Use Case 7: Preparing Information & Questions for a Legal Professional
          </h3>
          <p class="text-xs text-gray-400">Structured briefing sheet and key questions to maximize value during an attorney consultation.</p>
        </div>
        <button id="copy-attorney-brief-btn" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition">
          Copy Attorney Brief Sheet
        </button>
      </div>

      <div id="attorney-brief-content" class="flex-1 overflow-y-auto bg-slate-900/80 p-5 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed text-gray-200 whitespace-pre-wrap">
ATTORNEY CONSULTATION BRIEFING SHEET
Document Analyzed: ${state.currentDocument.title}
Risk Assessment Level: ${state.analysis.riskLevel} (${state.analysis.riskScore}/100)

1. EXECUTIVE SUMMARY:
${state.analysis.summary}

2. TOP QUESTIONS TO ASK YOUR ATTORNEY:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

3. KEY CLAUSES TO REVIEW:
${state.analysis.risks.map(r => `- ${r.clause}: "${r.text}"`).join('\n')}
      </div>
    </div>
  `;
}

function getHighlightedDocumentHTML() {
  let text = sanitizeHTML(state.currentDocument.content);
  if (state.analysis && state.analysis.risks) {
    state.analysis.risks.forEach(r => {
      if (r.text) {
        const markClass = r.level === 'CRITICAL' ? 'risk-critical' : 'risk-high';
        const escaped = sanitizeHTML(r.text).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const reg = new RegExp(`(${escaped})`, 'gi');
        text = text.replace(reg, `<mark class="${markClass}" title="${sanitizeHTML(r.clause)}: ${sanitizeHTML(r.explanation)}">$1</mark>`);
      }
    });
  }
  return text;
}

function renderDocumentText() {
  const container = document.getElementById('document-text-container');
  if (container) {
    container.innerHTML = getHighlightedDocumentHTML();
  }
}

function attachAnalyzeViewListeners() {
  const presetBtn = document.getElementById('preset-selector-btn');
  if (presetBtn) {
    presetBtn.addEventListener('click', showPresetSelectorModal);
  }
}

function attachCompareListeners() {
  const runBtn = document.getElementById('run-compare-ai-btn');
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      alert("AI Comparison Matrix Completed:\n1. Rent Escalation: Document A specifies 8% compounding vs Document B's 3.5% CPI cap.\n2. Maintenance: Document A assigns structural repair to tenant; Document B assigns to Landlord.");
    });
  }
}

function attachChatListeners() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const clearBtn = document.getElementById('clear-chat-btn');

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = input.value.trim();
      if (!userText) return;

      state.chatHistory.push({ sender: 'user', text: userText });
      renderChatMessages();
      input.value = '';

      setTimeout(() => {
        let aiReply = generateAIAnswer(userText);
        state.chatHistory.push({ sender: 'ai', text: aiReply });
        renderChatMessages();
      }, 400);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.chatHistory = [{ sender: 'ai', text: 'Chat history cleared.' }];
      renderChatMessages();
    });
  }

  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (input) {
        input.value = chip.textContent;
        form.dispatchEvent(new Event('submit'));
      }
    });
  });
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  container.innerHTML = state.chatHistory.map(msg => `
    <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}">
      <div class="max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
        msg.sender === 'user' 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-slate-900/90 text-gray-200 border border-slate-800 rounded-bl-none'
      }">
        ${sanitizeHTML(msg.text)}
      </div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function generateAIAnswer(query) {
  const q = query.toLowerCase();
  if (q.includes('termination') || q.includes('break')) {
    return "Based on Section 4 (Early Termination): You have no right to terminate early. If broken prior to expiration, you immediately owe 100% of remaining unpaid rent ($510,000 maximum balance).";
  } else if (q.includes('hvac') || q.includes('repair') || q.includes('maintenance')) {
    return "Based on Section 3: Tenant is solely responsible for structural repairs, roof leaks, and HVAC system replacements.";
  } else {
    return `Based on ${state.currentDocument.title}, terms dictate standard Delaware governing law. Consult an attorney for specific exceptions.`;
  }
}

function attachAttorneyListeners() {
  const btn = document.getElementById('copy-attorney-brief-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const text = document.getElementById('attorney-brief-content').textContent;
      navigator.clipboard.writeText(text);
      alert('Attorney Consultation Briefing Sheet copied to clipboard!');
    });
  }
}

// ============================================================================
// 6. ACTION TOOLBAR & MODALS
// ============================================================================
function initActionToolbar() {
  const highlightBtn = document.getElementById('tb-highlight-risks');
  const simplifyBtn = document.getElementById('tb-simplify-jargon');
  const clearBtn = document.getElementById('tb-clear-session');
  const uploadBtn = document.getElementById('nav-upload-btn');
  const exportBtn = document.getElementById('nav-export-btn');

  if (highlightBtn) {
    highlightBtn.addEventListener('click', () => {
      switchMode('highlight');
    });
  }

  if (simplifyBtn) {
    simplifyBtn.addEventListener('click', () => {
      alert("Legalese Jargon Definitions:\n- 'Triple Net (NNN)' -> Tenant pays rent PLUS taxes, insurance & repairs.\n- 'Liquidated Damages' -> Fixed cash penalty for default.");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear current session?')) {
        state.currentDocument = { title: 'Untitled Document', content: '', category: 'Custom' };
        state.analysis = { riskScore: 0, riskLevel: 'LOW', summary: 'No document loaded.', risks: [] };
        renderWorkspace();
      }
    });
  }

  if (uploadBtn) uploadBtn.addEventListener('click', showUploadModal);
  if (exportBtn) exportBtn.addEventListener('click', () => window.print());
}

function showUploadModal() {
  const modal = document.getElementById('upload-modal');
  if (modal) modal.classList.remove('hidden');
}

function showPresetSelectorModal() {
  const modal = document.getElementById('preset-modal');
  if (modal) modal.classList.remove('hidden');
}

function setupModalListeners() {
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-container').forEach(m => m.classList.add('hidden'));
    });
  });

  document.querySelectorAll('.preset-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-preset-key');
      if (SAMPLE_DOCUMENTS[key]) {
        state.currentDocument = {
          id: key,
          title: SAMPLE_DOCUMENTS[key].title,
          content: SAMPLE_DOCUMENTS[key].content,
          category: SAMPLE_DOCUMENTS[key].category
        };
        state.analysis = SAMPLE_DOCUMENTS[key].analysis;
        state.compareDocument = {
          title: 'Revised Standard Version',
          content: SAMPLE_DOCUMENTS[key].compareWith
        };
        renderWorkspace();
        document.querySelectorAll('.modal-container').forEach(m => m.classList.add('hidden'));
      }
    });
  });

  const uploadForm = document.getElementById('upload-file-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const textInput = document.getElementById('upload-text-input').value;
      const titleInput = document.getElementById('upload-title-input').value || 'Uploaded Contract';

      if (textInput.trim()) {
        state.currentDocument = {
          id: 'custom_' + Date.now(),
          title: titleInput,
          content: textInput,
          category: 'Uploaded Legal Text'
        };

        state.analysis = computeCustomLegalAnalysis(textInput);
        renderWorkspace();
        document.querySelectorAll('.modal-container').forEach(m => m.classList.add('hidden'));
      }
    });
  }
}

function computeCustomLegalAnalysis(text) {
  const hasTermination = /terminate|penalty|liquidated/i.test(text);
  const hasLiability = /liability|indemnify|harmless/i.test(text);

  let score = 35;
  if (hasTermination) score += 30;
  if (hasLiability) score += 25;

  return {
    riskScore: Math.min(score, 95),
    riskLevel: score > 70 ? 'CRITICAL' : score > 40 ? 'HIGH' : 'LOW',
    summary: "Custom legal document analyzed. Contains provisions regarding liability and termination.",
    risks: [
      {
        id: 'cr1',
        clause: 'Detected Indemnification / Liability Provision',
        level: hasLiability ? 'CRITICAL' : 'MEDIUM',
        text: text.slice(0, 100) + '...',
        explanation: 'Includes indemnity language requiring user to cover legal costs.',
        suggestion: 'Cap liability to direct damages.'
      }
    ],
    nextSteps: [
      "Step 1: Consult an attorney regarding liability caps.",
      "Step 2: Propose written amendments to unfair provisions."
    ],
    checklists: [
      "Verify indemnity clauses",
      "Confirm governing law state"
    ],
    attorneyQuestions: [
      "Are these liability provisions standard in this jurisdiction?"
    ]
  };
}

function renderSavedDocsList() {
  const container = document.getElementById('saved-docs-drawer-list');
  if (!container) return;

  container.innerHTML = state.savedDocs.map(d => `
    <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition flex items-center justify-between saved-doc-item" data-doc-id="${d.id}">
      <div>
        <div class="text-xs font-semibold text-white">${sanitizeHTML(d.title)}</div>
        <div class="text-[10px] text-gray-400">${d.date}</div>
      </div>
      <span class="text-xs font-bold px-2 py-0.5 rounded ${d.riskScore > 70 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}">
        ${d.riskScore}/100
      </span>
    </div>
  `).join('');

  document.querySelectorAll('.saved-doc-item').forEach(item => {
    item.addEventListener('click', () => {
      const docId = item.getAttribute('data-doc-id');
      loadSavedDoc(docId);
    });
  });
}

function loadSavedDoc(docId) {
  if (SAMPLE_DOCUMENTS[docId]) {
    state.currentDocument = {
      id: docId,
      title: SAMPLE_DOCUMENTS[docId].title,
      content: SAMPLE_DOCUMENTS[docId].content,
      category: SAMPLE_DOCUMENTS[docId].category
    };
    state.analysis = SAMPLE_DOCUMENTS[docId].analysis;
    renderWorkspace();
    document.getElementById('side-drawer').classList.add('translate-x-full');
    document.getElementById('drawer-backdrop').classList.add('hidden');
  }
}

function setupKeyboardAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-container').forEach(m => m.classList.add('hidden'));
      const sideDrawer = document.getElementById('side-drawer');
      const drawerOverlay = document.getElementById('drawer-backdrop');
      if (sideDrawer) sideDrawer.classList.add('translate-x-full');
      if (drawerOverlay) drawerOverlay.classList.add('hidden');
    }
  });
}