/**
 * PatternSelectorPopup
 *
 * Usage:
 *   const selector = new PatternSelectorPopup(load_pattern_names);
 *   const name = await selector.open();   // null if cancelled
 */
export class PatternSelectorPopup {
    constructor(loadNames) {
        this.loadNames = loadNames;
        this.selected = null;
        this.resolvePromise = null;
        this.overlay = this.buildOverlay();
        document.body.appendChild(this.overlay);
    }
    // ── Public ──────────────────────────────────────────────────────────────────
    open() {
        this.selected = null;
        this.listEl.innerHTML = '<li class="ps-loading">Loading…</li>';
        this.syncLoadBtn();
        this.overlay.classList.add('ps-visible');
        this.loadNames().then((names) => this.renderList(names));
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
    }
    // ── DOM construction ────────────────────────────────────────────────────────
    buildOverlay() {
        const overlay = el('div', 'ps-overlay');
        const popup = el('div', 'ps-popup');
        overlay.appendChild(popup);
        // Header
        const header = el('div', 'ps-header');
        header.appendChild(icon());
        const title = el('span', 'ps-title');
        title.textContent = 'Select Pattern';
        header.appendChild(title);
        popup.appendChild(header);
        // Divider
        popup.appendChild(el('div', 'ps-divider'));
        // List
        this.listEl = el('ul', 'ps-list');
        popup.appendChild(this.listEl);
        // Divider
        popup.appendChild(el('div', 'ps-divider'));
        // Footer
        const footer = el('div', 'ps-footer');
        const cancelBtn = el('button', 'ps-btn ps-btn-cancel');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => this.close(null));
        this.loadBtn = el('button', 'ps-btn ps-btn-load');
        this.loadBtn.textContent = 'Load';
        this.loadBtn.disabled = true;
        this.loadBtn.addEventListener('click', () => this.close(this.selected));
        footer.appendChild(cancelBtn);
        footer.appendChild(this.loadBtn);
        popup.appendChild(footer);
        injectStyles();
        return overlay;
    }
    renderList(names) {
        this.listEl.innerHTML = '';
        if (names.length === 0) {
            const empty = el('li', 'ps-empty');
            empty.textContent = 'No patterns found.';
            this.listEl.appendChild(empty);
            return;
        }
        for (const name of names) {
            const item = el('li', 'ps-item');
            item.textContent = name;
            item.addEventListener('click', () => this.selectItem(item, name));
            this.listEl.appendChild(item);
        }
    }
    selectItem(item, name) {
        this.listEl
            .querySelectorAll('.ps-item')
            .forEach((el) => el.classList.remove('ps-item--selected'));
        item.classList.add('ps-item--selected');
        this.selected = name;
        this.syncLoadBtn();
    }
    syncLoadBtn() {
        this.loadBtn.disabled = this.selected === null;
    }
    close(value) {
        var _a;
        this.overlay.classList.remove('ps-visible');
        (_a = this.resolvePromise) === null || _a === void 0 ? void 0 : _a.call(this, value);
        this.resolvePromise = null;
    }
}
// ── Helpers ──────────────────────────────────────────────────────────────────
function el(tag, className) {
    const e = document.createElement(tag);
    e.className = className;
    return e;
}
function icon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('class', 'ps-icon');
    svg.innerHTML = `
    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.764c.415 0 .813.165 1.107.458l.49.49A1.5 1.5 0 0 0 8.914 3.5H13.5A1.5 1.5 0 0 1 15 5v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z"/>
  `;
    return svg;
}
// ── Styles ───────────────────────────────────────────────────────────────────
function injectStyles() {
    if (document.getElementById('ps-styles'))
        return;
    const style = document.createElement('style');
    style.id = 'ps-styles';
    style.textContent = `
    /* Overlay */
    .ps-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 9999;
      align-items: flex-start;
      justify-content: center;
      padding-top: 64px;
    }
    .ps-overlay.ps-visible {
      display: flex;
    }

    /* Popup */
    .ps-popup {
      background: #292831;
      border: 1px solid #fbbbad;
      border-radius: 6px;
      width: 340px;
      max-height: 480px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(238,134,149,0.3);
      font-family: 'Consolas', 'Menlo', 'Monaco', monospace;
      overflow: hidden;
      animation: ps-drop 0.15s ease;
    }
    @keyframes ps-drop {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .ps-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #292831;
    }
    .ps-icon {
      width: 14px;
      height: 14px;
      fill: #fbbbad;
      flex-shrink: 0;
    }
    .ps-title {
      font-size: 12px;
      font-weight: 600;
      color: #ee8695;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    /* Divider */
    .ps-divider {
      height: 2px;
      background: #333f58;
    }

    /* List */
    .ps-list {
      list-style: none;
      margin: 0;
      padding: 4px 0;
      overflow-y: auto;
      flex: 1;
      scrollbar-width: thin;
      scrollbar-color: #4a4a4a #1e1e1e;
    }
    .ps-list::-webkit-scrollbar { width: 6px; }
    .ps-list::-webkit-scrollbar-track { background: #1e1e1e; }
    .ps-list::-webkit-scrollbar-thumb { background: #4a4a4a; border-radius: 3px; }

    .ps-item {
      padding: 6px 16px;
      font-size: 13px;
      color: #d4d4d4;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ps-item::before {
      content: '›';
      color: #555;
      font-size: 14px;
      flex-shrink: 0;
    }
    .ps-item:hover {
      background: #333f58;
      color: #ffffff;
    }
    .ps-item--selected {
      background: #fbbbad;
      color: #292831;
    }
    .ps-item--selected::before {
      color: #ee8695;
    }
    .ps-item--selected:hover {
      background: #fbbbad;
    }

    .ps-loading,
    .ps-empty {
      padding: 16px;
      font-size: 12px;
      color: #666;
      text-align: center;
      list-style: none;
    }

    /* Footer */
    .ps-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 10px 14px;
      background: #292831;
    }
    .ps-btn {
      font-family: inherit;
      font-size: 12px;
      padding: 5px 16px;
      border-radius: 3px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: background 0.1s, opacity 0.1s;
    }
    .ps-btn-cancel {
      background: transparent;
      border-color: #fbbbad;
      color: #cccccc;
    }
    .ps-btn-cancel:hover {
      background: #3a3a3a;
    }
    .ps-btn-load {
      background: #fbbbad;
      color: #ffffff;
      border-color: #ee8695;
    }
    .ps-btn-load:hover:not(:disabled) {
      background: #ee8695;
    }
    .ps-btn-load:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  `;
    document.head.appendChild(style);
}
