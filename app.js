/**
 * @file app.js
 * @description Core LexAssist AI Application Engine & State Manager
 * @author LexAssist AI Engineering Team
 * @license MIT
 */

// ============================================================================
// 1. APPLICATION STATE MANAGEMENT OBJECT
// ============================================================================
const state = {
  activeTab: 'analyze', // 'analyze', 'compare', 'chat', 'clauses'
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
    { sender: 'ai', text: 'Hello! I have analyzed this document. You can ask me any question regarding risk exposure, termination periods, payment escalations, or liability obligations.' }
  ],
  savedDocs: [
    { id: 'lease', title: 'Commercial Lease (742 Evergreen)', riskScore: 84, date: '2026-09-26' },
    { id: 'saas', title: 'CloudCorp SaaS Agreement', riskScore: 78, date: '2026-09-25' },
    { id: 'nda', title: 'Mutual NDA - Alpha Corp', riskScore: 22, date: '2026-09-20' }
  ],
  userCredits: 250,
  geminiApiKey: ''
};

// ============================================================================
// 2. SECURITY & INPUT SANITIZATION ENGINE (XSS DEFENSE)
// ============================================================================
/**
 * Sanitizes user-provided text input against cross-site scripting (XSS) attacks.
 * @param {string} str - Raw input string
 * @returns {string} Sanitized string safe for DOM injection
 */
function sanitizeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/javascript:/gi, '')
    .replace(/onerror/gi, 'no-error');
}

/**
 * Announces dynamic UI updates to screen readers via ARIA live region.
 * @param {string} message - Accessibility message
 */
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

  announceAria(`Switched workspace mode to ${mode}`);
  renderWorkspace();
}

// ============================================================================
// 5. WORKSPACE VIEWS RENDERER
// ============================================================================
function renderWorkspace() {
  const container = document.getElementById('workspace-container');
  if (!container) return;

  if (state.activeTab === 'analyze') {
    container.innerHTML = getAnalyzeWorkspaceHTML();
    attachAnalyzeViewListeners();
    renderDocumentText();
  } else if (state.activeTab === 'compare') {
    container.innerHTML = getCompareWorkspaceHTML();
    attachCompareListeners();
  } else if (state.activeTab === 'chat') {
    container.innerHTML = getChatWorkspaceHTML();
    renderChatMessages();
    attachChatListeners();
  } else if (state.activeTab === 'clauses') {
    container.innerHTML = getClauseWorkspaceHTML();
    attachClauseListeners();
  }
}

function getAnalyzeWorkspaceHTML() {
  const risk = state.analysis || { riskScore: 50, riskLevel: 'MEDIUM', summary: 'Analysis pending', risks: [] };
  const badgeColor = risk.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                     risk.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                     'bg-green-500/20 text-green-400 border-green-500/40';

  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      <!-- Document Editor View -->
      <div class="lg:col-span-7 glass-panel rounded-2xl p-5 flex flex-col h-[750px]">
        <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
          <div class="flex items-center space-x-3">
            <span class="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </span>
            <div>
              <h3 id="doc-view-title" class="font-semibold text-white">${sanitizeHTML(state.currentDocument.title)}</h3>
              <p class="text-xs text-gray-400">${sanitizeHTML(state.currentDocument.category || 'Uploaded Legal Text')}</p>
            </div>
          </div>
          
          <button id="preset-selector-btn" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-lg border border-slate-700 transition">
            Load Benchmark Contract ▼
          </button>
        </div>

        <div id="document-text-container" tabindex="0" role="region" aria-label="Legal Document Content Text Editor" class="flex-1 overflow-y-auto pr-3 font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap select-text focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg">
        </div>

        <div class="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
            <span>Legal Context Bound & Sanitized</span>
          </div>
          <span class="text-indigo-400">GenAI Extraction Active</span>
        </div>
      </div>

      <!-- Risk Insights Panel -->
      <div class="lg:col-span-5 glass-panel rounded-2xl p-5 flex flex-col h-[750px] overflow-y-auto">
        <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 mb-5 flex items-center justify-between">
          <div>
            <div class="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Overall Contract Risk Score</div>
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
            Plain-English Summary
          </h4>
          <p class="text-xs leading-relaxed text-gray-300 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            ${sanitizeHTML(risk.summary)}
          </p>
        </div>

        <div class="flex-1">
          <h4 class="text-sm font-semibold text-white mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Flagged Risk Clauses (${risk.risks ? risk.risks.length : 0})
          </h4>

          <div class="space-y-3">
            ${risk.risks ? risk.risks.map(r => `
              <div class="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs font-semibold text-gray-200">${sanitizeHTML(r.clause)}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded font-bold ${r.level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}">
                    ${r.level}
                  </span>
                </div>
                <p class="text-xs text-red-300/90 font-mono bg-red-950/20 p-2 rounded mb-2 border border-red-900/30">"${sanitizeHTML(r.text)}"</p>
                <p class="text-xs text-gray-300 mb-2"><strong class="text-gray-100">Why it matters:</strong> ${sanitizeHTML(r.explanation)}</p>
                <div class="text-[11px] text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                  <strong class="font-bold">💡 Fix:</strong> ${sanitizeHTML(r.suggestion)}
                </div>
              </div>
            `).join('') : '<p class="text-xs text-gray-400">No risks flagged.</p>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDocumentText() {
  const container = document.getElementById('document-text-container');
  if (!container) return;

  let text = sanitizeHTML(state.currentDocument.content);

  if (state.highlightsActive && state.analysis && state.analysis.risks) {
    state.analysis.risks.forEach(r => {
      if (r.text) {
        const markClass = r.level === 'CRITICAL' ? 'risk-critical' : 'risk-high';
        const escaped = sanitizeHTML(r.text).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const reg = new RegExp(`(${escaped})`, 'gi');
        text = text.replace(reg, `<mark class="${markClass}" title="${sanitizeHTML(r.clause)}">$1</mark>`);
      }
    });
  }

  container.innerHTML = text;
}

function attachAnalyzeViewListeners() {
  const presetBtn = document.getElementById('preset-selector-btn');
  if (presetBtn) {
    presetBtn.addEventListener('click', showPresetSelectorModal);
  }
}

// ============================================================================
// 6. COMPARISON WORKSPACE
// ============================================================================
function getCompareWorkspaceHTML() {
  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
        <div>
          <h3 class="text-lg font-semibold text-white flex items-center">
            <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            Side-by-Side Contract Comparison Matrix
          </h3>
          <p class="text-xs text-gray-400">Spot aggressive changes, added liabilities, and missing tenant protections instantly.</p>
        </div>
        <button id="run-compare-ai-btn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl btn-glow transition flex items-center">
          Run AI Diff Analysis
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
        <div class="flex flex-col h-full bg-slate-900/60 rounded-xl border border-slate-800 p-4">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span class="text-xs font-bold text-indigo-400 uppercase">Document A (Original / Proposed)</span>
            <span class="text-[11px] text-gray-400">${sanitizeHTML(state.currentDocument.title)}</span>
          </div>
          <div class="flex-1 overflow-y-auto font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed pr-2">
            ${sanitizeHTML(state.currentDocument.content)}
          </div>
        </div>

        <div class="flex flex-col h-full bg-slate-900/60 rounded-xl border border-slate-800 p-4">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span class="text-xs font-bold text-emerald-400 uppercase">Document B (Standard / Counter-Offer)</span>
            <span class="text-[11px] text-gray-400">${sanitizeHTML(state.compareDocument.title)}</span>
          </div>
          <div class="flex-1 overflow-y-auto font-mono text-xs text-gray-300 whitespace-pre-wrap leading-relaxed pr-2">
            ${sanitizeHTML(state.compareDocument.content)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachCompareListeners() {
  const runBtn = document.getElementById('run-compare-ai-btn');
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      alert("AI Comparison Matrix Completed:\n\n1. Rent Escalation: Document A specifies 8% compounding vs Document B's 3.5% CPI cap.\n2. Structural Repairs: Document A assigns roof/HVAC liability to tenant; Document B assigns to Landlord.\n3. Termination: Document A requires 100% rent penalty; Document B permits 90-day exit with 3-month fee cap.");
    });
  }
}

// ============================================================================
// 7. LEGAL CHATBOT ASSISTANT
// ============================================================================
function getChatWorkspaceHTML() {
  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">
            AI
          </div>
          <div>
            <h3 class="text-base font-semibold text-white">Context-Aware Legal Assistant</h3>
            <p class="text-xs text-gray-400">Trained on currently loaded document: <strong class="text-indigo-300">${sanitizeHTML(state.currentDocument.title)}</strong></p>
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
        <input id="chat-input" type="text" placeholder="Ask any question about clauses, risks, or penalties in this document..." 
          class="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500" required />
        <button type="submit" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl btn-glow transition">
          Send Query
        </button>
      </form>
    </div>
  `;
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
      }, 500);
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

function generateAIAnswer(query) {
  const q = query.toLowerCase();
  if (q.includes('termination') || q.includes('break') || q.includes('exit')) {
    return "Based on **Section 4 (Early Termination)**: You have **no contractual right** to terminate early. If broken prior to expiration, you immediately owe **100% of remaining unpaid rent** ($510,000 maximum balance).";
  } else if (q.includes('hvac') || q.includes('repair') || q.includes('leak') || q.includes('maintenance')) {
    return "Based on **Section 3 (Maintenance & Triple Net)**: You as the Tenant are solely responsible for **all structural repairs, roof leaks, and HVAC failures**.";
  } else if (q.includes('increase') || q.includes('rent') || q.includes('escalat')) {
    return "Under **Section 2**: Rent starts at $8,500/month and automatically escalates by **8% compounded annually** without prior notice.";
  } else {
    return `According to the loaded document (${state.currentDocument.title}), the terms dictate Delaware governing law. Please check executed addendums for specific monetary exceptions.`;
  }
}

// ============================================================================
// 8. DYNAMIC CLAUSE GENERATOR STUDIO
// ============================================================================
function getClauseWorkspaceHTML() {
  return `
    <div class="glass-panel rounded-2xl p-6 h-[750px] flex flex-col">
      <div class="pb-4 mb-4 border-b border-gray-800">
        <h3 class="text-lg font-semibold text-white flex items-center">
          <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 012.828 0L20.586 7.586a2 2 0 010 2.828L11.828 19H8v-3.828l8.586-8.586z"></path></svg>
          Dynamic Legal Clause Generator
        </h3>
        <p class="text-xs text-gray-400">Generate customized legal clauses tailored with dynamic parameters.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        <div class="lg:col-span-5 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col overflow-y-auto">
          <label for="clause-template-select" class="text-xs font-semibold text-gray-300 mb-2">Select Clause Template:</label>
          <select id="clause-template-select" class="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white mb-4 focus:outline-none focus:border-indigo-500">
            ${CLAUSE_TEMPLATES.map(t => `<option value="${t.id}">${sanitizeHTML(t.title)} (${sanitizeHTML(t.category)})</option>`).join('')}
          </select>

          <div id="clause-form-fields" class="space-y-3 flex-1">
          </div>
        </div>

        <div class="lg:col-span-7 bg-slate-900/80 p-5 rounded-xl border border-slate-800 flex flex-col">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <span class="text-xs font-bold text-emerald-400 uppercase">Live Generated Output</span>
            <button id="copy-clause-btn" class="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition">
              Copy Clause Text
            </button>
          </div>
          <div id="clause-output-text" class="flex-1 overflow-y-auto font-mono text-xs text-gray-200 bg-black/40 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachClauseListeners() {
  const select = document.getElementById('clause-template-select');
  if (!select) return;

  const renderFields = (templateId) => {
    const tmpl = CLAUSE_TEMPLATES.find(t => t.id === templateId) || CLAUSE_TEMPLATES[0];
    const fieldsContainer = document.getElementById('clause-form-fields');
    fieldsContainer.innerHTML = tmpl.fields.map(f => `
      <div>
        <label for="field-${f.id}" class="block text-[11px] text-gray-400 mb-1">${sanitizeHTML(f.label)}</label>
        <input id="field-${f.id}" type="text" data-field="${f.id}" value="${sanitizeHTML(f.default)}" 
          class="clause-input-field w-full p-2 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-indigo-500" />
      </div>
    `).join('');

    updateClauseOutput(tmpl);

    document.querySelectorAll('.clause-input-field').forEach(input => {
      input.addEventListener('input', () => updateClauseOutput(tmpl));
    });
  };

  const updateClauseOutput = (tmpl) => {
    const fieldValues = {};
    document.querySelectorAll('.clause-input-field').forEach(input => {
      const fieldId = input.getAttribute('data-field');
      fieldValues[fieldId] = input.value;
    });
    const outputElem = document.getElementById('clause-output-text');
    if (outputElem) {
      outputElem.textContent = tmpl.generate(fieldValues);
    }
  };

  select.addEventListener('change', (e) => renderFields(e.target.value));
  renderFields(select.value);

  const copyBtn = document.getElementById('copy-clause-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('clause-output-text').textContent;
      navigator.clipboard.writeText(text);
      alert('Clause text copied to clipboard!');
    });
  }
}

// ============================================================================
// 9. ACTION TOOLBAR & ACCESSIBLE MODALS
// ============================================================================
function initActionToolbar() {
  const highlightBtn = document.getElementById('tb-highlight-risks');
  const simplifyBtn = document.getElementById('tb-simplify-jargon');
  const clearBtn = document.getElementById('tb-clear-session');
  const uploadBtn = document.getElementById('nav-upload-btn');
  const exportBtn = document.getElementById('nav-export-btn');

  if (highlightBtn) {
    highlightBtn.addEventListener('click', () => {
      state.highlightsActive = !state.highlightsActive;
      highlightBtn.setAttribute('aria-pressed', state.highlightsActive ? 'true' : 'false');
      highlightBtn.classList.toggle('bg-red-500/30', state.highlightsActive);
      renderDocumentText();
    });
  }

  if (simplifyBtn) {
    simplifyBtn.addEventListener('click', () => {
      alert("Legalese Jargon Definitions Active:\n- 'Triple Net (NNN)' -> Tenant pays taxes & repair fees.\n- 'Liquidated Damages' -> Cash penalty for breaking lease early.");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear current document session?')) {
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

  let score = 30;
  if (hasTermination) score += 30;
  if (hasLiability) score += 25;

  return {
    riskScore: Math.min(score, 95),
    riskLevel: score > 70 ? 'CRITICAL' : score > 40 ? 'HIGH' : 'LOW',
    summary: "Custom legal text analyzed. Contains binding provisions regarding liability and termination.",
    risks: [
      {
        id: 'cr1',
        clause: 'Detected Indemnification / Liability Provision',
        level: hasLiability ? 'CRITICAL' : 'MEDIUM',
        text: text.slice(0, 100) + '...',
        explanation: 'Includes indemnity language requiring user to cover legal costs.',
        suggestion: 'Cap liability to direct damages.'
      }
    ]
  };
}

function renderSavedDocsList() {
  const container = document.getElementById('saved-docs-drawer-list');
  if (!container) return;

  container.innerHTML = state.savedDocs.map(d => `
    <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition flex items-center justify-between"
      onclick="loadSavedDoc('${d.id}')">
      <div>
        <div class="text-xs font-semibold text-white">${sanitizeHTML(d.title)}</div>
        <div class="text-[10px] text-gray-400">${d.date}</div>
      </div>
      <span class="text-xs font-bold px-2 py-0.5 rounded ${d.riskScore > 70 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}">
        ${d.riskScore}/100
      </span>
    </div>
  `).join('');
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
