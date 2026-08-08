/*!
 * Auto Nahariya - Performance Optimizer v6
 * v6 FIX: product images were squashed/stretched.
 *   Cause: forced 1:1 aspect-ratio (CSS + inline style) with default
 *   object-fit:fill -> non-square images were distorted to a square box.
 *   Fix: never force inline 1:1; inject a stylesheet that pairs any
 *   reserved box with object-fit:contain and restores natural ratios.
 * Focus: FIX CLS regression from Konimbo's splide/modules_general updates
 * 1. Image dimensions (prevent CLS)
 * 2. Iframe lazy loading (fix Google Maps CLS)
 * 3. Image Optimizer (PNG → WebP)
 * 4. Lazy Loading + async decoding
 */
(function() {
  'use strict';


  // ============ v6 ASPECT-RATIO FIX (stylesheet) ============
  // Neutralises the blanket `img:not([width]):not([height]){aspect-ratio:1/1}`
  // rule that squashes every non-square product photo.
  var FIX_CSS = [
    /* 1. Any image still forced into a reserved box must letterbox, not stretch. */
    'img[style*="aspect-ratio"]{object-fit:contain !important;object-position:center !important;}',
    /* 2. Konimbo native product grid / lists / carousels: restore natural ratio. */
    '.list_item_image img,',
    'table.imgWrapperT img,',
    '.store_list_items img,',
    '.element_items_list_items img,',
    '.layout_list_item img,',
    '.item_image img,',
    '.product_image img,',
    '.mega-product img,',
    '.splide img,',
    '.owl-item .img_wrapper img,',
    'body:not(.articles) .img_wrapper img{',
    'object-fit:contain !important;object-position:center !important;',
    'aspect-ratio:auto !important;',
    '}',
    /* 3. Main product page gallery. */
    '#item_image img,.main_image img,.gallery_main img,.zoom_image img{',
    'object-fit:contain !important;aspect-ratio:auto !important;',
    '}',
    /* 4. Keep CLS protection where a box height already exists, without crop. */
    '.list_item_image,.img_wrapper{background:#fff;}'
  ].join('');

  function injectFixCss() {
    if (document.getElementById('an-img-ratio-fix')) return;
    var head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;
    var st = document.createElement('style');
    st.id = 'an-img-ratio-fix';
    st.appendChild(document.createTextNode(FIX_CSS));
    head.appendChild(st);
  }
  injectFixCss();

  // Strip stale inline 1:1 ratios left by earlier versions of this script.
  function clearForcedRatio(img) {
    if (!img || img.tagName !== 'IMG') return;
    var ar = img.style && img.style.aspectRatio;
    if ((ar === '1 / 1' || ar === '1/1') && img.naturalWidth > 0 &&
        img.naturalWidth !== img.naturalHeight) {
      img.style.aspectRatio = '';
    }
  }

  // ============ CLS FIX: iframe lazy loading (Google Maps etc) ============
  function fixIframes() {
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
      var ifr = iframes[i];
      if (!ifr.hasAttribute('loading')) ifr.setAttribute('loading', 'lazy');
      // Fix maps iframe specifically - add width/height styles to prevent CLS
      var src = ifr.getAttribute('src') || '';
      if (src.indexOf('google.com/maps') !== -1 || src.indexOf('googletagmanager') !== -1) {
        var w = ifr.getAttribute('width') || 400;
        var h = ifr.getAttribute('height') || 300;
        if (!ifr.style.width) ifr.style.width = w + 'px';
        if (!ifr.style.height) ifr.style.height = h + 'px';
      }
    }
  }

  // ============ CLS FIX: Set image dimensions ============
  function setImageDimensions(img) {
    if (!img || img.tagName !== 'IMG') return;
    if (img.hasAttribute('width') && img.hasAttribute('height')) return;
    if (img.classList.contains('slide_img')) return;

    if (img.complete && img.naturalWidth > 0) {
      if (!img.hasAttribute('width')) img.setAttribute('width', img.naturalWidth);
      if (!img.hasAttribute('height')) img.setAttribute('height', img.naturalHeight);
      return;
    }

    var parent = img.parentElement;
    var inProductCard = false;
    while (parent && parent !== document.body) {
      var cls = parent.className || '';
      if (typeof cls === 'string' && (cls.indexOf('product') !== -1 || cls.indexOf('item') !== -1 ||
          cls.indexOf('category') !== -1 || cls.indexOf('grid') !== -1 || cls.indexOf('splide') !== -1)) {
        inProductCard = true;
        break;
      }
      parent = parent.parentElement;
    }

    if (inProductCard) {
      // v6: reserve space WITHOUT distorting. A square box is fine only when
      // the image is told to letterbox inside it (object-fit: contain).
      img.style.aspectRatio = '1 / 1';
      img.style.objectFit = 'contain';
    }

    img.addEventListener('load', function() {
      if (this.naturalWidth > 0) {
        if (!this.hasAttribute('width')) this.setAttribute('width', this.naturalWidth);
        if (!this.hasAttribute('height')) this.setAttribute('height', this.naturalHeight);
        // v6: real ratio is known now, release the 1:1 placeholder ratio.
        if (this.style.aspectRatio === '1 / 1' || this.style.aspectRatio === '1/1') {
          this.style.aspectRatio = '';
        }
      }
    }, { once: true });
  }

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

  function processImage(img) {
    if (!img || img.tagName !== 'IMG') return;
    setImageDimensions(img);
    clearForcedRatio(img);
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    if (!img.hasAttribute('loading') && !img.classList.contains('slide_img') && !isAboveFold(img)) {
      img.setAttribute('loading', 'lazy');
    }
    if (shouldOptimize(img)) {
      var originalSrc = img.src;
      var width = img.naturalWidth || img.width || img.getAttribute('width') || 800;
      if (width > 1200) width = 1200;
      var newSrc = 'https://images.weserv.nl/?url=' + encodeURIComponent(originalSrc) + '&output=webp&q=82&w=' + width;
      img.src = newSrc;
      if (img.srcset) img.srcset = '';
    }
  }

  function processAllImages() {
    var images = document.querySelectorAll('img');
    for (var i = 0; i < images.length; i++) processImage(images[i]);
    fixIframes();
  }

  // ============ DELAY 3RD PARTY SCRIPTS ============
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

  function init() {
    injectFixCss();
    processAllImages();
    deferScripts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    var earlyCount = 0;
    var earlyInterval = setInterval(function() {
      processAllImages();
      earlyCount++;
      if (earlyCount >= 8 || document.readyState !== 'loading') clearInterval(earlyInterval);
    }, 100);
  } else {
    init();
  }
  window.addEventListener('load', processAllImages);

  // MutationObserver
  var mutationTimer = null;
  var pendingMutations = [];
  if (window.MutationObserver) {
    var observer = new MutationObserver(function(mutations) {
      pendingMutations.push.apply(pendingMutations, mutations);
      if (mutationTimer) return;
      mutationTimer = setTimeout(function() {
        var batch = pendingMutations;
        pendingMutations = [];
        mutationTimer = null;
        for (var i = 0; i < batch.length; i++) {
          var nodes = batch[i].addedNodes;
          for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            if (node.nodeType !== 1) continue;
            if (node.tagName === 'IMG') {
              processImage(node);
            } else if (node.tagName === 'IFRAME' && !node.hasAttribute('loading')) {
              node.setAttribute('loading', 'lazy');
            } else if (node.querySelectorAll) {
              var imgs = node.querySelectorAll('img');
              for (var k = 0; k < imgs.length; k++) processImage(imgs[k]);
              var ifrs = node.querySelectorAll('iframe:not([loading])');
              for (var m = 0; m < ifrs.length; m++) ifrs[m].setAttribute('loading', 'lazy');
            }
          }
        }
      }, 200);
    });
    var startObserver = function() {
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    };
    if (document.body) startObserver();
    else document.addEventListener('DOMContentLoaded', startObserver);
  }

  window.addEventListener('load', function() {
    var sweep = function() { processAllImages(); };
    if (window.requestIdleCallback) {
      requestIdleCallback(sweep, { timeout: 3000 });
    } else {
      setTimeout(sweep, 1500);
    }
  });
})();
