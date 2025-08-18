// Em Dash Optimizer - Content Script
// This script runs on all web pages and can interact with page content

(function() {
    'use strict';

    // Initialize the extension
    function init() {
        // Add right-click context menu functionality (future feature)
        // For now, this is minimal since main functionality is in popup
        
        // Listen for messages from popup if needed
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getSelectedText') {
                const selectedText = window.getSelection().toString();
                sendResponse({ text: selectedText });
            }
        });
    }

    // Initialize when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();