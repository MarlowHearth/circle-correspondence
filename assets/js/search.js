// The Circle - Search functionality using Lunr.js
(function() {
  // Search index will be populated from search-data.json
  let searchIndex = null;
  let searchData = null;

  // Initialize search when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    // Get base URL - handle both defined and undefined cases
    const baseurl = window.baseurl || '';

    // Load search data
    fetch(baseurl + '/search-data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load search data');
        }
        return response.json();
      })
      .then(data => {
        // Filter out any null or invalid entries
        searchData = data.filter(d => d && d.title && d.url);

        searchIndex = lunr(function() {
          this.ref('url');
          this.field('title', { boost: 10 });
          this.field('content');

          searchData.forEach(doc => {
            this.add(doc);
          });
        });

        // Clear any loading message
        searchResults.innerHTML = '<p class="search-ready">Type to search the archive...</p>';
      })
      .catch(err => {
        console.error('Error loading search data:', err);
        searchResults.innerHTML = '<p>Search is currently unavailable. Please try refreshing the page.</p>';
      });

    // Handle search input
    searchInput.addEventListener('input', function() {
      const query = this.value.trim();

      if (query.length < 2) {
        searchResults.innerHTML = '<p class="search-ready">Type to search the archive...</p>';
        return;
      }

      if (!searchIndex) {
        searchResults.innerHTML = '<p>Loading search index...</p>';
        return;
      }

      try {
        const results = searchIndex.search(query + '*');
        displayResults(results, searchResults, baseurl);
      } catch (e) {
        // Try without wildcard if query has special characters
        try {
          const results = searchIndex.search(query);
          displayResults(results, searchResults, baseurl);
        } catch (e2) {
          searchResults.innerHTML = '<p>No results found.</p>';
        }
      }
    });
  });

  function displayResults(results, container, baseurl) {
    if (results.length === 0) {
      container.innerHTML = '<p>No results found.</p>';
      return;
    }

    const html = results.slice(0, 20).map(result => {
      const doc = searchData.find(d => d.url === result.ref);
      if (!doc) return '';

      return `
        <div class="search-result">
          <h3><a href="${baseurl}${doc.url}">${doc.title}</a></h3>
          <p>${doc.excerpt || ''}</p>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  }
})();
