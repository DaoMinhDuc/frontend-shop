// Performance test utility for search components
// This can be run in the browser console to monitor search performance

class SearchPerformanceMonitor {
  constructor() {
    this.apiCallCount = 0;
    this.keyPressCount = 0;
    this.renderCount = 0;
    this.lastKeyPressTime = null;
    this.responseTimes = [];
    this.startTime = null;
    this.originalFetch = window.fetch;
    this.originalXHR = window.XMLHttpRequest.prototype.open;

    // Initialize monitoring
    this.init();
  }

  init() {
    // Track network requests
    this.monitorFetch();
    this.monitorXHR();
    
    // Add UI for results
    this.createUI();
  }

  monitorFetch() {
    const self = this;
    window.fetch = function(...args) {
      const url = args[0];
      
      // Only count API calls that are search-related
      if (typeof url === 'string' && (
          url.includes('search') || 
          url.includes('query') || 
          url.includes('filter')
      )) {
        self.apiCallCount++;
        self.updateUI();
      }
      
      return self.originalFetch.apply(this, args);
    };
  }

  monitorXHR() {
    const self = this;
    window.XMLHttpRequest.prototype.open = function(...args) {
      const url = args[1];
      
      // Only count API calls that are search-related
      if (typeof url === 'string' && (
          url.includes('search') || 
          url.includes('query') || 
          url.includes('filter')
      )) {
        self.apiCallCount++;
        self.updateUI();
      }
      
      return self.originalXHR.apply(this, args);
    };
  }

  startMonitoring(inputSelector) {
    const inputElement = document.querySelector(inputSelector);
    if (!inputElement) {
      console.error('Search input not found with selector:', inputSelector);
      return;
    }

    this.reset();
    this.startTime = performance.now();
    
    // Monitor keypress events
    inputElement.addEventListener('keydown', () => {
      this.keyPressCount++;
      this.lastKeyPressTime = performance.now();
      this.updateUI();
    });

    // Print status message
    console.log(`Monitoring started for ${inputSelector}`);
    alert(`Search performance monitoring active for ${inputSelector}. Check the floating panel for results.`);
  }

  recordResponse(responseTime) {
    this.responseTimes.push(responseTime);
    this.updateUI();
  }

  reset() {
    this.apiCallCount = 0;
    this.keyPressCount = 0;
    this.renderCount = 0;
    this.lastKeyPressTime = null;
    this.responseTimes = [];
    this.startTime = performance.now();
    this.updateUI();
  }

  getStats() {
    const now = performance.now();
    const elapsedTime = (now - this.startTime) / 1000; // in seconds
    
    return {
      keyPressCount: this.keyPressCount,
      apiCallCount: this.apiCallCount,
      apiCallRatio: this.keyPressCount ? (this.apiCallCount / this.keyPressCount).toFixed(2) : 0,
      elapsedTime: elapsedTime.toFixed(2),
      apiCallsPerSecond: elapsedTime ? (this.apiCallCount / elapsedTime).toFixed(2) : 0,
      lastKeypressTime: this.lastKeyPressTime ? ((now - this.lastKeyPressTime) / 1000).toFixed(2) : 'N/A',
    };
  }

  createUI() {
    const panel = document.createElement('div');
    panel.id = 'search-perf-monitor';
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 5px;
      font-family: monospace;
      z-index: 10000;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;

    const title = document.createElement('h3');
    title.textContent = 'Search Performance Monitor';
    title.style.margin = '0 0 10px 0';
    
    const statsDisplay = document.createElement('div');
    statsDisplay.id = 'search-perf-stats';
    
    const controls = document.createElement('div');
    controls.style.marginTop = '10px';
    controls.style.display = 'flex';
    controls.style.justifyContent = 'space-between';
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.onclick = () => this.reset();
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => document.body.removeChild(panel);
    
    controls.appendChild(resetButton);
    controls.appendChild(closeButton);
    
    panel.appendChild(title);
    panel.appendChild(statsDisplay);
    panel.appendChild(controls);
    
    document.body.appendChild(panel);
    
    this.updateUI();
  }

  updateUI() {
    const statsElement = document.getElementById('search-perf-stats');
    if (!statsElement) return;
    
    const stats = this.getStats();
    
    statsElement.innerHTML = `
      <div>Keystrokes: ${stats.keyPressCount}</div>
      <div>API Calls: ${stats.apiCallCount}</div>
      <div>API Call Ratio: ${stats.apiCallRatio}</div>
      <div>Elapsed Time: ${stats.elapsedTime}s</div>
      <div>API Calls/Second: ${stats.apiCallsPerSecond}</div>
      <div>Last Keypress: ${stats.lastKeypressTime}s ago</div>
    `;
  }
}

// Instructions for use
console.log(`
-------------------------------------
SEARCH PERFORMANCE MONITOR
-------------------------------------

To start monitoring a search input, run:
const monitor = new SearchPerformanceMonitor();
monitor.startMonitoring('CSS-SELECTOR');

Replace CSS-SELECTOR with a valid selector for your search input, like:
- Admin users search: '.admin-user-search input'
- Admin products search: '.admin-product-search input'
- Customer search bar: '.customer-search-bar input'

A floating panel will appear showing performance metrics.
`);

// Export the monitor for global use
window.SearchPerformanceMonitor = SearchPerformanceMonitor;
