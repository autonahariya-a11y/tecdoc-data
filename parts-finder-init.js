/**
 * Vehicle Parts Finder — Homepage Dropdown Initializer
 * Reads window.vehicleData and wires up the 4-step selector panel.
 * Requires: vehicleData already set globally (from pako-decompressed blob).
 */
(function () {
  'use strict';

  /* ── wait until DOM + vehicleData are ready ─────────────────── */
  function boot() {
    if (!window.vehicleData) return;
    var panel = document.querySelector('.an-parts-finder__panel');
    if (!panel) return;
    init(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });
  } else {
    setTimeout(boot, 100);
  }

  /* ── main init ────────────────────────────────────────────────── */
  function init(panel) {
    var data = window.vehicleData;         // {AUDI:{he,models:{...}}, ...}
    var steps = {};                         // keyed by step name
    var selected = {};                      // current selections

    ['manufacturer', 'model', 'year', 'engine'].forEach(function (name) {
      var el = panel.querySelector('[data-step="' + name + '"]');
      if (!el) return;
      steps[name] = {
        el: el,
        trigger: el.querySelector('.an-parts-finder__step-trigger'),
        dropdown: el.querySelector('.an-parts-finder__dropdown'),
        labelValue: el.querySelector('.an-parts-finder__step-label-value')
      };
    });

    var searchBtn = panel.querySelector('.an-parts-finder__search-btn');
    var loading = document.getElementById('anLoading');
    if (loading) loading.style.display = 'none';         // hide "loading..." text

    /* ── helpers ───────────────────────────────────────── */
    function closeAll() {
      ['manufacturer', 'model', 'year', 'engine'].forEach(function (name) {
        var s = steps[name];
        if (!s) return;
        s.dropdown.classList.remove('an-parts-finder__dropdown--open');
        s.trigger.classList.remove('an-parts-finder__step-trigger--active');
        s.trigger.setAttribute('aria-expanded', 'false');
      });
    }

    function resetStep(name) {
      var s = steps[name];
      if (!s) return;
      selected[name] = null;
      s.dropdown.innerHTML = '';
      s.dropdown.classList.remove('an-parts-finder__dropdown--open');
      s.trigger.classList.remove('an-parts-finder__step-trigger--active');
      s.trigger.classList.remove('an-parts-finder__step-trigger--selected');
      s.trigger.classList.add('an-parts-finder__step-trigger--disabled');
      s.trigger.setAttribute('tabindex', '-1');
      s.trigger.setAttribute('aria-expanded', 'false');
      var lv = s.labelValue;
      if (lv) lv.textContent = lv.getAttribute('data-placeholder') || '';
    }

    function enableStep(name) {
      var s = steps[name];
      if (!s) return;
      s.trigger.classList.remove('an-parts-finder__step-trigger--disabled');
      s.trigger.setAttribute('tabindex', '0');
    }

    function selectStep(name, value, label) {
      var s = steps[name];
      if (!s) return;
      selected[name] = value;
      s.labelValue.textContent = label;
      s.trigger.classList.add('an-parts-finder__step-trigger--selected');
      s.trigger.classList.remove('an-parts-finder__step-trigger--active');
      s.trigger.setAttribute('aria-expanded', 'false');
      s.dropdown.classList.remove('an-parts-finder__dropdown--open');
    }

    function populateDropdown(name, items) {
      var s = steps[name];
      if (!s) return;
      var html = '';
      // search input
      html += '<input class="an-parts-finder__search-input" type="text" placeholder="חיפוש..." autocomplete="off">';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += '<div class="an-parts-finder__dropdown-item" data-value="' + escHTML(item.value) + '">' + escHTML(item.label) + '</div>';
      }
      if (items.length === 0) {
        html += '<div class="an-parts-finder__dropdown-empty">לא נמצאו תוצאות</div>';
      }
      s.dropdown.innerHTML = html;

      // search filter
      var searchInput = s.dropdown.querySelector('.an-parts-finder__search-input');
      if (searchInput) {
        searchInput.addEventListener('input', function () {
          var q = this.value.trim().toLowerCase();
          var els = s.dropdown.querySelectorAll('.an-parts-finder__dropdown-item');
          var hasVisible = false;
          for (var j = 0; j < els.length; j++) {
            var match = !q || els[j].textContent.toLowerCase().indexOf(q) !== -1;
            els[j].style.display = match ? '' : 'none';
            if (match) hasVisible = true;
          }
          var empty = s.dropdown.querySelector('.an-parts-finder__dropdown-empty');
          if (!hasVisible) {
            if (!empty) {
              var d = document.createElement('div');
              d.className = 'an-parts-finder__dropdown-empty';
              d.textContent = 'לא נמצאו תוצאות';
              s.dropdown.appendChild(d);
            } else {
              empty.style.display = '';
            }
          } else if (empty) {
            empty.style.display = 'none';
          }
        });
      }

      // item click
      var dropdownItems = s.dropdown.querySelectorAll('.an-parts-finder__dropdown-item');
      for (var k = 0; k < dropdownItems.length; k++) {
        dropdownItems[k].addEventListener('click', (function (stepName) {
          return function (e) {
            e.stopPropagation();
            var val = this.getAttribute('data-value');
            var lbl = this.textContent;
            selectStep(stepName, val, lbl);
            onStepSelected(stepName, val);
          };
        })(name));
      }
    }

    function toggleDropdown(name) {
      var s = steps[name];
      if (!s) return;
      if (s.trigger.classList.contains('an-parts-finder__step-trigger--disabled')) return;
      var isOpen = s.dropdown.classList.contains('an-parts-finder__dropdown--open');
      closeAll();
      if (!isOpen) {
        s.dropdown.classList.add('an-parts-finder__dropdown--open');
        s.trigger.classList.add('an-parts-finder__step-trigger--active');
        s.trigger.setAttribute('aria-expanded', 'true');
        var input = s.dropdown.querySelector('.an-parts-finder__search-input');
        if (input) { input.value = ''; input.dispatchEvent(new Event('input')); setTimeout(function(){ input.focus(); }, 50); }
      }
    }

    function escHTML(str) {
      var d = document.createElement('div');
      d.appendChild(document.createTextNode(str));
      return d.innerHTML;
    }

    /* ── step triggers ──────────────────────────────────── */
    ['manufacturer', 'model', 'year', 'engine'].forEach(function (name) {
      var s = steps[name];
      if (!s) return;
      s.trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown(name);
      });
    });

    // close on outside click
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target)) closeAll();
    });

    /* ── step selection logic ───────────────────────────── */
    function onStepSelected(name, value) {
      if (name === 'manufacturer') {
        resetStep('model');
        resetStep('year');
        resetStep('engine');
        updateSearchBtn();
        // populate models
        var mfr = data[value];
        if (!mfr || !mfr.models) return;
        var models = Object.keys(mfr.models).sort();
        var items = models.map(function (m) {
          var he = mfr.models[m].he || m;
          return { value: m, label: he };
        });
        populateDropdown('model', items);
        enableStep('model');
        toggleDropdown('model');
      }
      else if (name === 'model') {
        resetStep('year');
        resetStep('engine');
        updateSearchBtn();
        var mfrKey = selected['manufacturer'];
        var mfr2 = data[mfrKey];
        if (!mfr2 || !mfr2.models || !mfr2.models[value]) return;
        var modelData = mfr2.models[value];
        var startY = modelData.start || 2000;
        var endY = modelData.end || new Date().getFullYear();
        var years = [];
        for (var y = endY; y >= startY; y--) {
          years.push({ value: String(y), label: String(y) });
        }
        populateDropdown('year', years);
        enableStep('year');
        toggleDropdown('year');
      }
      else if (name === 'year') {
        resetStep('engine');
        updateSearchBtn();
        var mfrKey2 = selected['manufacturer'];
        var modelKey = selected['model'];
        var mfr3 = data[mfrKey2];
        if (!mfr3 || !mfr3.models || !mfr3.models[modelKey]) return;
        var modelData2 = mfr3.models[modelKey];
        var engines = modelData2.engines || [];
        if (engines.length === 0) {
          // no engines defined — go straight to search
          enableSearchBtn();
          return;
        }
        var items2 = engines.map(function (eng) {
          return { value: eng.label || (eng.cc + ' ' + eng.fuel), label: eng.label || (eng.cc + ' ' + eng.fuel) };
        });
        populateDropdown('engine', items2);
        enableStep('engine');
        toggleDropdown('engine');
      }
      else if (name === 'engine') {
        updateSearchBtn();
      }
      updateSearchBtn();
    }

    /* ── search button ───────────────────────────────────── */
    function updateSearchBtn() {
      // enabled when at least manufacturer + model + year selected
      var ready = selected['manufacturer'] && selected['model'] && selected['year'];
      if (searchBtn) searchBtn.disabled = !ready;
    }
    function enableSearchBtn() {
      if (searchBtn) searchBtn.disabled = false;
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var mfrKey = selected['manufacturer'];
        var modelKey = selected['model'];
        var year = selected['year'];
        var engine = selected['engine'];
        if (!mfrKey || !modelKey || !year) return;
        var mfr = data[mfrKey];
        var mfrHe = mfr ? mfr.he : mfrKey;
        var modelHe = (mfr && mfr.models && mfr.models[modelKey]) ? mfr.models[modelKey].he : modelKey;
        var params = [];
        params.push('brand_he=' + encodeURIComponent(mfrHe));
        params.push('model_he=' + encodeURIComponent(modelHe || modelKey));
        params.push('mfr=' + encodeURIComponent(mfrKey));
        params.push('model=' + encodeURIComponent(modelKey));
        params.push('year=' + encodeURIComponent(year));
        if (engine) params.push('engine=' + encodeURIComponent(engine));
        window.location.href = '/?' + params.join('&');
      });
    }

    /* ── populate manufacturers on load ───────────────────── */
    var mfrKeys = Object.keys(data).sort(function (a, b) {
      var aHe = data[a].he || a;
      var bHe = data[b].he || b;
      return aHe.localeCompare(bHe, 'he');
    });
    var mfrItems = mfrKeys.map(function (key) {
      return { value: key, label: data[key].he || key };
    });
    populateDropdown('manufacturer', mfrItems);
    // manufacturer step is already enabled (not disabled in HTML)
    steps['manufacturer'].trigger.classList.remove('an-parts-finder__step-trigger--disabled');
    steps['manufacturer'].trigger.setAttribute('tabindex', '0');

    /* ── move Konimbo slider into banner slot ───────────────── */
    var banner = document.getElementById('anBannerSlot');
    if (banner) {
      var slider = document.querySelector('.slider_module, .swiper-container, [class*="slider"]');
      if (slider && !banner.contains(slider)) {
        // Try to find the main homepage slider
        var hpGroup1 = document.getElementById('homepage_group1');
        if (hpGroup1) {
          var sliderInGroup = hpGroup1.querySelector('.slider_module, .swiper-container');
          if (sliderInGroup) {
            banner.appendChild(sliderInGroup);
          }
        }
      }
    }
  }
})();
