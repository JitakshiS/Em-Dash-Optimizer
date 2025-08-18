// Em Dash Optimizer - Popup Logic
class EmDashOptimizer {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.optimizeBtn = document.getElementById('optimizeBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.outputSection = document.getElementById('outputSection');
        this.beforeText = document.getElementById('beforeText');
        this.afterText = document.getElementById('afterText');
        this.status = document.getElementById('status');

        this.init();
    }

    init() {
        this.optimizeBtn.addEventListener('click', () => this.optimizeText());
        this.copyBtn.addEventListener('click', () => this.copyOptimizedText());
        
        // Auto-paste clipboard content if available
        this.autoPasteClipboard();
        
        // Handle Enter key in textarea
        this.inputText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.optimizeText();
            }
        });
    }

    async autoPasteClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.includes('—')) {
                this.inputText.value = text;
                this.inputText.focus();
            }
        } catch (err) {
            // Clipboard access denied, ignore silently
        }
    }

    optimizeText() {
        const originalText = this.inputText.value.trim();
        
        if (!originalText) {
            this.showStatus('Please enter some text to optimize.', 'error');
            return;
        }

        if (!originalText.includes('—')) {
            this.showStatus('No em dashes found in the text.', 'error');
            return;
        }

        const optimizedText = this.processEmDashes(originalText);
        this.displayResults(originalText, optimizedText);
        this.showStatus('Text optimized successfully! 🎉', 'success');
    }

    processEmDashes(text) {
        // Main processing logic for em dashes
        let processed = text;

        // Pattern 1: word—word → word, word (comma separation)
        processed = processed.replace(/(\w+)—(\w+)/g, '$1, $2');

        // Pattern 2: word—phrase—word → word, phrase, word (parenthetical commas)
        processed = processed.replace(/(\w+)—([^—]+)—(\w+)/g, '$1, $2, $3');

        // Pattern 3: sentence—new sentence → sentence; new sentence (semicolon for independent clauses)
        processed = processed.replace(/([.!?])\s*—\s*([A-Z])/g, '$1 $2');
        processed = processed.replace(/(\w+)—([A-Z][^,]*)/g, '$1; $2');

        // Pattern 4: list item—another item → list item; another item
        processed = processed.replace(/(\w+)—(and|or|but)\s+(\w+)/g, '$1; $2 $3');

        // Clean up any multiple spaces
        processed = processed.replace(/\s+/g, ' ');

        // Clean up any double punctuation
        processed = processed.replace(/,,/g, ',');
        processed = processed.replace(/;;/g, ';');

        return processed.trim();
    }

    displayResults(original, optimized) {
        this.beforeText.innerHTML = this.highlightEmDashes(original);
        this.afterText.innerHTML = this.highlightChanges(optimized);
        
        this.outputSection.style.display = 'block';
        this.copyBtn.dataset.optimizedText = optimized;
        
        // Scroll to results
        this.outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    highlightEmDashes(text) {
        return text.replace(/—/g, '<span class="highlight-dash">—</span>');
    }

    highlightChanges(text) {
        // Highlight commas and semicolons that replaced em dashes
        let highlighted = text;
        highlighted = highlighted.replace(/,/g, '<span class="highlight-comma">,</span>');
        highlighted = highlighted.replace(/;/g, '<span class="highlight-comma">;</span>');
        return highlighted;
    }

    async copyOptimizedText() {
        const optimizedText = this.copyBtn.dataset.optimizedText;
        
        if (!optimizedText) {
            this.showStatus('No optimized text to copy.', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(optimizedText);
            this.showStatus('Optimized text copied to clipboard! 📋', 'success');
            
            // Change button text temporarily
            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '<span class="btn-icon">✅</span>Copied!';
            
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
            }, 2000);
            
        } catch (err) {
            this.showStatus('Failed to copy text. Please copy manually.', 'error');
        }
    }

    showStatus(message, type) {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        
        // Clear status after 3 seconds
        setTimeout(() => {
            this.status.textContent = '';
            this.status.className = 'status';
        }, 3000);
    }
}

// Initialize the extension when popup opens
document.addEventListener('DOMContentLoaded', () => {
    new EmDashOptimizer();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('inputText').focus();
    }
});