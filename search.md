---
layout: default
title: Search
---

# Search the Archive

<div class="search-container">
  <input type="text" id="search-input" placeholder="Search for tides, nooks, poems..." aria-label="Search">
</div>

<div id="search-results"></div>

<script src="https://unpkg.com/lunr/lunr.js"></script>
<script>window.baseurl = '{{ site.baseurl }}';</script>
<script src="{{ '/assets/js/search.js' | relative_url }}"></script>
