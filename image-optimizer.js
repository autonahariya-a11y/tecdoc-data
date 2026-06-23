/*!
 * Auto Nahariya - Image Optimizer (Phase 2)
 * Converts large PNG images on the page to WebP via images.weserv.nl (free CDN, ~91% savings on PNG)
 */
(function() {
  'use strict';
  
  // Hero LCP images - DO NOT optimize (already preloaded with high priority)
  var EXCLUDE_PATTERNS = [
    '9462979827.jpg',
    '4458042398.jpg'
  ];
  
  // Konimbo CDN domains where images are hosted
  var KONIMBO_DOMAINS = [
    'konimbo-hybrid-files-production.s3-eu-west-1.amazonaws.com',
    'd3m9l0v76dty0.cloudfront.net'
  ];
  
  function shouldOptimize(img) {
    if (!img || !img.src) return false;
    var src = img.src;
    
    // Already optimized via weserv?
    if (src.indexOf('images.weserv.nl') !== -1) return false;
    
    // Only PNG files (best savings)
    if (src.toLowerCase().indexOf('.png') === -1) return false;
    
    // Only Konimbo CDN images
    var isKonimbo = false;
    for (var i = 0; i < KONIMBO_DOMAINS.length; i++) {
      if (src.indexOf(KONIMBO_DOMAINS[i]) !== -1) { isKonimbo = true; break; }
    }
    if (!isKonimbo) return false;
    
    // Skip excluded
    for (var j = 0; j < EXCLUDE_PATTERNS.length; j++) {
      if (src.indexOf(EXCLUDE_PATTERNS[j]) !== -1) return false;
    }
    
    return true;
  }
  
  function optimizeImage(img) {
    if (!shouldOptimize(img)) return;
    
    var originalSrc = img.src;
    var width = img.naturalWidth || img.width || img.getAttribute('width') || 800;
    if (width > 1200) width = 1200;
    
    var newSrc = 'https://images.weserv.nl/?url=' + encodeURIComponent(originalSrc) + '&output=webp&q=82&w=' + width;
    img.src = newSrc;
    
    // Also optimize srcset if present
    if (img.srcset) {
      img.srcset = '';
    }
  }
  
  function optimizeAllImages() {
    var images = document.querySelectorAll('img');
    for (var i = 0; i < images.length; i++) {
      optimizeImage(images[i]);
    }
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeAllImages);
  } else {
    optimizeAllImages();
  }
  
  // Run on full load (for lazy-loaded images)
  window.addEventListener('load', optimizeAllImages);
  
  // Watch for dynamically added images
  if (window.MutationObserver) {
    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (node.nodeType !== 1) continue;
          if (node.tagName === 'IMG') {
            optimizeImage(node);
          } else if (node.querySelectorAll) {
            var imgs = node.querySelectorAll('img');
            for (var k = 0; k < imgs.length; k++) {
              optimizeImage(imgs[k]);
            }
          }
        }
      }
    });
    
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  }
  
  // Fallback - run every second for first 5 seconds (catches slider images, etc.)
  var fallbackCount = 0;
  var fallbackInterval = setInterval(function() {
    optimizeAllImages();
    fallbackCount++;
    if (fallbackCount >= 5) clearInterval(fallbackInterval);
  }, 1000);
  
})();
