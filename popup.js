// Chrome Extension: Em Dash Remover (Minimal UI)

class EmDashRemover {
  constructor() {
    this.clipboardText = '';
    this.init();
  }

  init() {
    this.elements = {
      btnOptimize: document.getElementById('btnOptimize'),
      togglePreview: document.getElementById('togglePreview'),
      previewPanel: document.getElementById('previewPanel'),
      preview: document.getElementById('preview'),
      status: document.getElementById('status'),
      optComma: document.getElementById('optComma'),
      optEnDash: document.getElementById('optEnDash'),
      optSemicolon: document.getElementById('optSemicolon'),
    };

    this.bindEvents();
    this.loadClipboard();
  }

  bindEvents() {
    this.elements.btnOptimize.addEventListener('click', () => this.optimize());

    this.elements.togglePreview.addEventListener('change', () => {
      const isOn = this.elements.togglePreview.checked;
      this.elements.previewPanel.classList.toggle('hidden', !isOn);
      if (isOn) {
        this.loadClipboard();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      if (key === 'o') {
        event.preventDefault();
        this.elements.btnOptimize.click();
      }
      if (key === 'p') {
        event.preventDefault();
        this.elements.togglePreview.checked = !this.elements.togglePreview.checked;
        this.elements.togglePreview.dispatchEvent(new Event('change'));
      }
    });
  }

  async loadClipboard() {
    try {
      this.showStatus('Reading clipboard…', 'info');
      const text = await navigator.clipboard.readText();
      this.clipboardText = text || '';

      if (!text) {
        this.showStatus('Clipboard is empty', 'info');
        this.elements.preview.value = '';
        return;
      }

      const emDashCount = this.countEmDashes(text);
      if (this.elements.togglePreview.checked) this.updatePreview();
      if (emDashCount > 0) {
        this.showStatus(`Found ${emDashCount} em dash${emDashCount > 1 ? 'es' : ''}`);
      } else {
        this.showStatus('No em dashes found', 'info');
      }
    } catch (error) {
      console.error('Error reading clipboard:', error);
      this.showStatus('Clipboard read blocked. Click and try again.', 'error');
    }
  }

  updatePreview() {
    if (!this.clipboardText) {
      this.elements.preview.value = '';
      return;
    }
    this.elements.preview.value = this.clipboardText;
  }

  getSelectedReplacement() {
    const selected = document.querySelector('input[name="replacement"]:checked');
    return selected ? selected.value : '–';
  }

  async optimize() {
    if (!this.clipboardText) {
      await this.loadClipboard();
      if (!this.clipboardText) {
        this.showStatus('No text in clipboard', 'error');
        return;
      }
    }

    try {
      const optimized = this.applyOptimizationRules(this.clipboardText);
      await navigator.clipboard.writeText(optimized);
      this.clipboardText = optimized;
      if (this.elements.togglePreview.checked) this.updatePreview();
      this.showStatus('Optimized. Ready to paste.', 'success');
    } catch (error) {
      console.error('Error optimizing:', error);
      this.showStatus('Could not write to clipboard', 'error');
    }
  }

  countEmDashes(text) {
    return (text.match(/—/g) || []).length;
  }

  showStatus(message, type = 'info') {
    this.elements.status.textContent = message;
    this.elements.status.className = `status ${type}`;
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        if (this.elements.status.textContent === message) {
          this.elements.status.textContent = '';
          this.elements.status.className = 'status';
        }
      }, 4000);
    }
  }

  // Normalize spacing for removals and replacements
  removeEmDashAndFixSpacing(text) {
    if (!text) return '';
    let t = String(text);
    // First, remove em dashes with surrounding spaces collapsed to one space
    t = t.replace(/\s*—\s*/g, ' ');
    // No space before closing punctuation
    t = t.replace(/\s+([,.;:!?\)\]\}])/g, '$1');
    // No space right after opening punctuation
    t = t.replace(/([\(\[\{])\s+/g, '$1');
    // Collapse multiple spaces
    t = t.replace(/\s{2,}/g, ' ');
    return t.trim();
  }

  replaceEmDashAndFixSpacing(text, replacement) {
    if (!text) return '';
    let t = String(text);
    if (replacement === '–') {
      // Spaced en dash
      t = t.replace(/\s*—\s*/g, ' – ');
      // Normalize any odd spacing around existing en dashes
      t = t.replace(/\s*–\s*/g, ' – ');
      // Clean general spacing issues
      t = t.replace(/\s+([,.;:!?\)\]\}])/g, '$1');
      t = t.replace(/([\(\[\{])\s+/g, '$1');
      t = t.replace(/\s{2,}/g, ' ');
      return t.trim();
    }

    if (replacement === ',' || replacement === ';' || replacement === ':') {
      // Insert punctuation directly
      t = t.replace(/\s*—\s*/g, replacement);
      // No space before punctuation
      t = t.replace(/\s+([,;:])/g, '$1');
      // Exactly one space after punctuation when followed by non-space
      t = t.replace(/([,;:])(\S)/g, '$1 $2');
      // Cleanup
      t = t.replace(/\s{2,}/g, ' ');
      return t.trim();
    }

    // Fallback: plain replacement, then cleanup
    t = t.replace(/\s*—\s*/g, replacement);
    t = t.replace(/\s{2,}/g, ' ');
    return t.trim();
  }

  // Optimization logic per rules, preserving original whitespace/newlines
  applyOptimizationRules(text) {
    if (!text) return '';
    const input = String(text);
    let result = '';
    let index = 0;

    // Regex captures a sentence-like chunk plus its trailing whitespace
    const chunkRe = /([\s\S]*?)([.!?])(\s+|$)/g;
    let match;
    while ((match = chunkRe.exec(input)) !== null) {
      const [full, body, punct, space] = match;
      const chunk = body + punct;
      const optimized = this.optimizeSentence(chunk, true);
      result += optimized + space;
      index = match.index + full.length;
    }
    // Remainder (e.g., titles or lines without terminal punctuation)
    if (index < input.length) {
      const tail = input.slice(index);
      result += this.optimizeSentence(tail, false);
    }

    return result;
  }

  optimizeSentence(sentence, hasTerminalPunctuation) {
    // If no em dash, return as-is
    if (!/—/.test(sentence)) return sentence;

    const emDashMatches = sentence.match(/—/g) || [];
    const emDashCount = emDashMatches.length;

    // Compute text after first em dash for comma detection
    const firstEmIndex = sentence.indexOf('—');
    const afterFirst = sentence.slice(firstEmIndex + 1);
    const afterHasComma = /,/.test(afterFirst);

    // Portion inside em dashes if there are two
    let insideHasComma = false;
    if (emDashCount >= 2) {
      const secondEmIndex = sentence.indexOf('—', firstEmIndex + 1);
      if (secondEmIndex !== -1) {
        const inside = sentence.slice(firstEmIndex + 1, secondEmIndex);
        insideHasComma = /,/.test(inside);
      }
    }

    let transformed = sentence;

    // Heuristic: titles/headers (no terminal punctuation) keep an en dash for single em dash
    if (!hasTerminalPunctuation && emDashCount === 1) {
      transformed = transformed.replace(/\s*—\s*/g, ' – ');
    } else if (emDashCount >= 2) {
      // Replace paired em-dash spans based on commas inside the span
      transformed = transformed.replace(/\s*—\s*([\s\S]*?)\s*—\s*/g, (match, inner) => {
        const content = inner.trim();
        const hasCommaInside = /,/.test(content);
        return hasCommaInside ? ` – ${content} – ` : `, ${content}, `;
      });
    } else if (!afterHasComma) {
      // Single em dash and no comma after -> comma
      transformed = transformed.replace(/\s*—\s*/g, ',');
      transformed = transformed.replace(/ +([,])/g, '$1').replace(/([,])(\S)/g, '$1 $2');
    } else {
      // Single em dash and comma exists after -> semicolon
      transformed = transformed.replace(/\s*—\s*/g, ';');
      transformed = transformed.replace(/ +([;])/g, '$1').replace(/([;])(\S)/g, '$1 $2');
    }

    // Final cleanup
    transformed = transformed.replace(/ +([,.;:!?\)\]\}])/g, '$1');
    transformed = transformed.replace(/([\(\[\{]) +/g, '$1');
    transformed = transformed.replace(/ {2,}/g, ' ');

    // Lowercase coordinating conjunctions if they follow inserted punctuation mid-sentence
    transformed = this.lowercaseCoordinatorAfterPunctuation(transformed);
    return transformed;
  }

  lowercaseCoordinatorAfterPunctuation(text) {
    return text.replace(/([,;:]\s+)(And|But|Or|Nor|For|So|Yet)\b/g, (m, p1, p2) => p1 + p2.toLowerCase());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new EmDashRemover();
});
