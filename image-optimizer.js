/*!
 * Auto Nahariya - Performance Optimizer v3
 * 1. Image Optimizer (PNG → WebP via weserv.nl)
 * 2. Lazy Loading for below-the-fold images
 * 3. Async decoding for images
 * 4. Native lazy loading for iframes
 * 5. Reduce TBT - throttle layout-heavy operations
 */
(function() {
  'use strict';

  // ============ IMAGE OPTIMIZER (PNG → WebP) ============
  var EXCLUDE_PATTERNS = ['9462979827.jpg', '4458042398.jpg'];
  var KONIMBO_DOMAINS = [
    'konimbo-hybrid-files-production.s3-eu-west-1.amazonaws.com',
    'd3m9l0v76dty0.cloudfront.net'
  ];

  function shouldOptimize(img) {
    if (!img || !img.src) return false;
    var src = img.src;
    if (src.indexOf('images.weserv.nl') !== -1) return false;
    if (src.toLowerCase().indexOf('.png') === -1) return false;
    var isKonimbo = false;
    for (var i = 0; i < KONIMBO_DOMAINS.length; i++) {
      if (src.indexOf(KONIMBO_DOMAINS[i]) !== -1) { isKonimbo = true; break; }
    }
    if (!isKonimbo) return false;
    for (var j = 0; j < EXCLUDE_PATTERNS.length; j++) {
      if (src.indexOf(EXCLUDE_PATTERNS[j]) !== -1) return false;
    }
    return true;
  }

  function isAboveFold(el) {
    try {
      var rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight + 100;
    } catch(e) { return false; }
  }

  function optimizeImage(img) {
    if (img && img.tagName === 'IMG') {
      // async decoding
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      // lazy loading for below-the-fold (skip slider hero images)
      if (!img.hasAttribute('loading') && !img.classList.contains('slide_img') && !isAboveFold(img)) {
        img.setAttribute('loading', 'lazy');
      }
    }
    // PNG → WebP optimization
    if (!shouldOptimize(img)) return;
    var originalSrc = img.src;
    var width = img.naturalWidth || img.width || img.getAttribute('width') || 800;
    if (width > 1200) width = 1200;
    var newSrc = 'https://images.weserv.nl/?url=' + encodeURIComponent(originalSrc) + '&output=webp&q=82&w=' + width;
    img.src = newSrc;
    if (img.srcset) img.srcset = '';
  }

  function optimizeAllImages() {
    var images = document.querySelectorAll('img');
    for (var i = 0; i < images.length; i++) optimizeImage(images[i]);
    var iframes = document.querySelectorAll('iframe:not([loading])');
    for (var k = 0; k < iframes.length; k++) iframes[k].setAttribute('loading', 'lazy');
  }

  // ============ DELAY HEAVY 3RD PARTY SCRIPTS ============
  // Only mark scripts as defer if they aren't already
  var DEFER_TARGETS = ['flashyapp.com', 'googletagmanager.com/gtag', 'google-analytics.com'];

  function deferScripts() {
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      var src = s.getAttribute('src') || '';
      for (var j = 0; j < DEFER_TARGETS.length; j++) {
        if (src.indexOf(DEFER_TARGETS[j]) !== -1 && !s.hasAttribute('async') && !s.hasAttribute('defer')) {
          s.setAttribute('defer', '');
          break;
        }
      }
    }
  }

  // ============ RUN OPTIMIZATIONS ============
  function runOptimizations() {
    optimizeAllImages();
    deferScripts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOptimizations);
  } else {
    runOptimizations();
  }
  window.addEventListener('load', optimizeAllImages);

  // MutationObserver for dynamic content (throttled)
  var mutationTimer = null;
  if (window.MutationObserver) {
    var observer = new MutationObserver(function(mutations) {
      // Throttle to avoid main-thread blocking
      if (mutationTimer) return;
      mutationTimer = setTimeout(function() {
        mutationTimer = null;
        for (var i = 0; i < mutations.length; i++) {
          var nodes = mutations[i].addedNodes;
          for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            if (node.nodeType !== 1) continue;
            if (node.tagName === 'IMG') {
              optimizeImage(node);
            } else if (node.tagName === 'IFRAME' && !node.hasAttribute('loading')) {
              node.setAttribute('loading', 'lazy');
            } else if (node.querySelectorAll) {
              var imgs = node.querySelectorAll('img');
              for (var k = 0; k < imgs.length; k++) optimizeImage(imgs[k]);
              var ifrs = node.querySelectorAll('iframe:not([loading])');
              for (var m = 0; m < ifrs.length; m++) ifrs[m].setAttribute('loading', 'lazy');
            }
          }
        }
      }, 250);
    });
    var startObserver = function() {
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    };
    if (document.body) startObserver();
    else document.addEventListener('DOMContentLoaded', startObserver);
  }

  // Final sweep when idle
  window.addEventListener('load', function() {
    var sweep = function() { optimizeAllImages(); };
    if (window.requestIdleCallback) {
      requestIdleCallback(sweep, { timeout: 3000 });
    } else {
      setTimeout(sweep, 1500);
    }
  });

})();
