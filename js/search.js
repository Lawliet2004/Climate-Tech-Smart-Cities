/**
 * Client-side Search Functionality using a pre-indexed JSON
 */

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});

function initSearch() {
    const searchIcon = document.getElementById('search-icon');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const closeBtn = document.getElementById('close-search-btn');
    
    if (!searchIcon || !searchModal || !searchInput || !searchResults) return;

    let indexData = null;

    // Open Modal
    searchIcon.addEventListener('click', () => {
        searchModal.style.display = 'flex';
        searchInput.focus();
        if (!indexData) {
            fetchSearchIndex();
        }
    });

    // Close Modal
    const closeModal = () => {
        searchModal.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    
    // Close on outside click or Esc key
    window.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.style.display === 'flex') {
            closeModal();
        }
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query || !indexData) {
            searchResults.innerHTML = '';
            return;
        }

        const results = indexData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.content.toLowerCase().includes(query)
        );

        renderResults(results, query);
    });

    function renderResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No results found for "' + htmlEscape(query) + '".</p>';
            return;
        }

        const html = results.slice(0, 10).map(item => {
            // Find snippet around match
            const contentLower = item.content.toLowerCase();
            const matchIndex = contentLower.indexOf(query);
            let snippet = '';
            
            if (matchIndex !== -1) {
                const start = Math.max(0, matchIndex - 40);
                const end = Math.min(item.content.length, matchIndex + query.length + 40);
                snippet = (start > 0 ? '...' : '') + 
                          item.content.substring(start, end) + 
                          (end < item.content.length ? '...' : '');
                
                // Highlight matcher
                const highlightRegex = new RegExp(`(${query})`, 'gi');
                snippet = snippet.replace(highlightRegex, '<mark>$1</mark>');
            } else {
                snippet = item.content.substring(0, 80) + '...';
            }

            return `
                <a href="${item.url}" class="search-result-item">
                    <h5>${htmlEscape(item.title)} <span class="badge">${htmlEscape(item.chapter)}</span></h5>
                    <p>${snippet}</p>
                </a>
            `;
        }).join('');

        searchResults.innerHTML = html;
        
        // Add styling logic for search results
        const items = searchResults.querySelectorAll('.search-result-item');
        items.forEach(item => {
            item.style.display = 'block';
            item.style.padding = '1rem';
            item.style.borderBottom = '1px solid var(--color-border)';
            item.style.textDecoration = 'none';
            item.style.color = 'var(--color-text-main)';
        });
    }

    // Fetch the JSON index file
    async function fetchSearchIndex() {
        try {
            // Adjust path depending on if we're in /chapters/ or root
            const basePath = window.location.pathname.includes('/chapters/') ? '../' : './';
            const response = await fetch(`${basePath}search-index.json`);
            if (response.ok) {
                indexData = await response.json();
            } else {
                console.error("Failed to load search index");
            }
        } catch (e) {
            console.error(e);
        }
    }
    
    function htmlEscape(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }
}
