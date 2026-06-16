document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. Light/Dark Theme Switcher
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // Set theme from localStorage or system preference
  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.src = 'pc-config-assets-separate/ui/theme-sun.svg';
  } else {
    document.body.classList.remove('dark-theme');
    themeIcon.src = 'pc-config-assets-separate/ui/theme-moon.svg';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
      themeIcon.src = 'pc-config-assets-separate/ui/theme-sun.svg';
    } else {
      localStorage.setItem('theme', 'light');
      themeIcon.src = 'pc-config-assets-separate/ui/theme-moon.svg';
    }
  });

  /* ==========================================================================
     2. Mobile Menu Toggle
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================================================
     3. Scroll Animations (Intersection Observer)
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add a slight stagger effect if multiple elements appear at the same time
        entry.target.classList.add('element-visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px' // triggers slightly before entering the screen
  });

  animatedElements.forEach((el, index) => {
    // Add dynamic inline transitions for grid items to stagger them
    if (el.parentElement.classList.contains('categories-grid') || 
        el.parentElement.classList.contains('why-us-grid') || 
        el.parentElement.classList.contains('benefits-grid')) {
      const delay = (index % 5) * 0.08;
      el.style.transitionDelay = `${delay}s`;
    }
    scrollObserver.observe(el);
  });

  /* ==========================================================================
     4. Mini-Configurator & Modal System
     ========================================================================== */
  const modal = document.getElementById('configurator-modal');
  const openConfigBtns = document.querySelectorAll('.open-config-btn');
  const openBuildBtns = document.querySelectorAll('.open-build-btn');
  const modalCloseBtn = document.getElementById('modal-close');
  
  // Select components inside Modal (All 10 categories)
  const cpuSelect = document.getElementById('cpu-select');
  const coolingSelect = document.getElementById('cooling-select');
  const mbSelect = document.getElementById('mb-select');
  const ramSelect = document.getElementById('ram-select');
  const gpuSelect = document.getElementById('gpu-select');
  const ssdSelect = document.getElementById('ssd-select');
  const caseSelect = document.getElementById('case-select');
  const psuSelect = document.getElementById('psu-select');
  const monitorSelect = document.getElementById('monitor-select');
  const peripheralsSelect = document.getElementById('peripherals-select');
  
  // Summary UI elements
  const componentsPriceEl = document.getElementById('summary-components-price');
  const totalPriceEl = document.getElementById('summary-total-price');
  const previewImgEl = document.getElementById('preview-pc-img');
  
  // Compatibility elements
  const compatSocketEl = document.getElementById('compat-socket');
  const compatPowerEl = document.getElementById('compat-power');
  const modalOrderBtn = document.getElementById('modal-order-btn');
  const successToast = document.getElementById('success-toast');

  // Pre-configured builds mapping (Including all 10 component choices)
  const buildsMapping = {
    'gaming-start': {
      cpu: 'i5-12400f',
      cooling: 'ag400',
      mb: 'b760',
      ram: '16gb-5200',
      gpu: 'rtx-4060',
      ssd: '1tb-m2',
      case: 'mistral',
      psu: '600w',
      monitor: 'none',
      peripherals: 'none'
    },
    'optimal-game': {
      cpu: 'r5-7600',
      cooling: 'ag400',
      mb: 'b650',
      ram: '32gb-6000',
      gpu: 'rtx-4070',
      ssd: '1tb-m2',
      case: 'cc560',
      psu: '750w',
      monitor: 'none',
      peripherals: 'none'
    },
    'enthusiast-pro': {
      cpu: 'i7-14700kf',
      cooling: 'lt720',
      mb: 'z790',
      ram: '32gb-6000',
      gpu: 'rtx-4080-super',
      ssd: '2tb-m2',
      case: 'nzxt-h9',
      psu: '850w',
      monitor: 'none',
      peripherals: 'none'
    },
    'esports-ultra': {
      cpu: 'i5-13600kf',
      cooling: 'ag400',
      mb: 'b760',
      ram: '32gb-6000',
      gpu: 'rtx-4060ti',
      ssd: '1tb-m2',
      case: 'cc560',
      psu: '750w',
      monitor: 'none',
      peripherals: 'none'
    },
    'white-stream': {
      cpu: 'r7-7800x3d',
      cooling: 'lt720',
      mb: 'b650',
      ram: '32gb-6000',
      gpu: 'rtx-4070super',
      ssd: '2tb-m2',
      case: 'lancool',
      psu: '750w',
      monitor: 'none',
      peripherals: 'none'
    },
    'powerful-workstation': {
      cpu: 'i9-14900kf',
      cooling: 'lt720',
      mb: 'z790',
      ram: '64gb-6000',
      gpu: 'rtx-4080-super',
      ssd: '4tb-m2',
      case: 'o11-dynamic',
      psu: '1000w',
      monitor: 'none',
      peripherals: 'none'
    },
    'budget-gaming': {
      cpu: 'i3-12100f',
      cooling: 'ag400',
      mb: 'b760',
      ram: '16gb-5200',
      gpu: 'gtx-1650',
      ssd: '512gb-nvme',
      case: 'mistral',
      psu: '500w',
      monitor: 'none',
      peripherals: 'none'
    },
    'maximum-evo': {
      cpu: 'i9-14900kf',
      cooling: 'ryujin',
      mb: 'z790',
      ram: '128gb-5600',
      gpu: 'rtx-4090',
      ssd: '4tb-m2',
      case: 'o11-dynamic',
      psu: '1200w',
      monitor: 'none',
      peripherals: 'none'
    },
    'balanced-rx': {
      cpu: 'r5-7600',
      cooling: 'ag400',
      mb: 'b650',
      ram: '32gb-6000',
      gpu: 'rx-7800xt',
      ssd: '1tb-m2',
      case: 'cc560',
      psu: '750w',
      monitor: 'none',
      peripherals: 'none'
    },
    'ultimate-amd': {
      cpu: 'r7-7800x3d',
      cooling: 'lt720',
      mb: 'x670',
      ram: '32gb-6000',
      gpu: 'rx-7900xtx',
      ssd: '2tb-m2',
      case: 'nzxt-h9',
      psu: '850w',
      monitor: 'none',
      peripherals: 'none'
    }
  };

  // Open Modal function
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
    calculateBuild();
  }

  // Close Modal function
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind Standard Config Buttons
  openConfigBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Reset all selects to "none" (not selected)
      cpuSelect.value = 'none';
      coolingSelect.value = 'none';
      mbSelect.value = 'none';
      ramSelect.value = 'none';
      gpuSelect.value = 'none';
      ssdSelect.value = 'none';
      caseSelect.value = 'none';
      psuSelect.value = 'none';
      monitorSelect.value = 'none';
      peripheralsSelect.value = 'none';
      
      openModal();
    });
  });

  // Bind Build-specific Config Buttons
  openBuildBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const buildId = btn.getAttribute('data-build');
      const buildPreset = buildsMapping[buildId];
      
      if (buildPreset) {
        // Load preset into selects
        cpuSelect.value = buildPreset.cpu;
        coolingSelect.value = buildPreset.cooling;
        mbSelect.value = buildPreset.mb;
        ramSelect.value = buildPreset.ram;
        gpuSelect.value = buildPreset.gpu;
        ssdSelect.value = buildPreset.ssd;
        caseSelect.value = buildPreset.case;
        psuSelect.value = buildPreset.psu;
        monitorSelect.value = buildPreset.monitor;
        peripheralsSelect.value = buildPreset.peripherals;
      }
      
      openModal();
    });
  });

  // Close Modal events
  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Bind changes on configurator dropdowns (All 10 select dropdowns)
  [
    cpuSelect, coolingSelect, mbSelect, ramSelect, 
    gpuSelect, ssdSelect, caseSelect, psuSelect, 
    monitorSelect, peripheralsSelect
  ].forEach(select => {
    select.addEventListener('change', calculateBuild);
  });

  // Main Calculation and Compatibility Verification
  function calculateBuild() {
    // 1. Get Selected Options
    const cpuOpt = cpuSelect.options[cpuSelect.selectedIndex];
    const coolingOpt = coolingSelect.options[coolingSelect.selectedIndex];
    const mbOpt = mbSelect.options[mbSelect.selectedIndex];
    const ramOpt = ramSelect.options[ramSelect.selectedIndex];
    const gpuOpt = gpuSelect.options[gpuSelect.selectedIndex];
    const ssdOpt = ssdSelect.options[ssdSelect.selectedIndex];
    const caseOpt = caseSelect.options[caseSelect.selectedIndex];
    const psuOpt = psuSelect.options[psuSelect.selectedIndex];
    const monitorOpt = monitorSelect.options[monitorSelect.selectedIndex];
    const peripheralsOpt = peripheralsSelect.options[peripheralsSelect.selectedIndex];

    // 2. Sum prices
    const cpuPrice = parseInt(cpuOpt.getAttribute('data-price')) || 0;
    const coolingPrice = parseInt(coolingOpt.getAttribute('data-price')) || 0;
    const mbPrice = parseInt(mbOpt.getAttribute('data-price')) || 0;
    const ramPrice = parseInt(ramOpt.getAttribute('data-price')) || 0;
    const gpuPrice = parseInt(gpuOpt.getAttribute('data-price')) || 0;
    const ssdPrice = parseInt(ssdOpt.getAttribute('data-price')) || 0;
    const casePrice = parseInt(caseOpt.getAttribute('data-price')) || 0;
    const psuPrice = parseInt(psuOpt.getAttribute('data-price')) || 0;
    const monitorPrice = parseInt(monitorOpt.getAttribute('data-price')) || 0;
    const peripheralsPrice = parseInt(peripheralsOpt.getAttribute('data-price')) || 0;

    const totalPrice = cpuPrice + coolingPrice + mbPrice + ramPrice + gpuPrice + ssdPrice + casePrice + psuPrice + monitorPrice + peripheralsPrice;
    
    // Format and output price
    const formattedPrice = totalPrice.toLocaleString('ru-RU') + ' ₽';
    componentsPriceEl.textContent = formattedPrice;
    totalPriceEl.textContent = formattedPrice;

    // 3. Compatibility Checks
    let compatibilityPassed = true;

    // A. Socket compatibility (CPU and Motherboard socket must match)
    const cpuSocket = cpuOpt.getAttribute('data-socket');
    const mbSocket = mbOpt.getAttribute('data-socket');
    const socketIndicator = compatSocketEl.querySelector('.status-indicator');
    const socketText = compatSocketEl.querySelector('.status-text');

    if (cpuOpt.value === 'none' || mbOpt.value === 'none') {
      socketIndicator.className = 'status-indicator neutral';
      socketText.textContent = 'Выберите процессор и материнскую плату';
    } else if (cpuSocket === mbSocket) {
      socketIndicator.className = 'status-indicator pass';
      socketText.textContent = `Совместимость сокета и платы (Socket ${cpuSocket})`;
    } else {
      socketIndicator.className = 'status-indicator fail';
      socketText.textContent = `Несовместимость! CPU требует ${cpuSocket}, плата — ${mbSocket}`;
      compatibilityPassed = false;
    }

    // B. PSU Wattage verification
    const cpuPower = parseInt(cpuOpt.getAttribute('data-power')) || 0;
    const gpuPower = parseInt(gpuOpt.getAttribute('data-power')) || 0;
    const psuWattage = parseInt(psuOpt.getAttribute('data-wattage')) || 0;
    const powerIndicator = compatPowerEl.querySelector('.status-indicator');
    const powerText = compatPowerEl.querySelector('.status-text');

    if (cpuOpt.value === 'none' || gpuOpt.value === 'none' || psuOpt.value === 'none') {
      powerIndicator.className = 'status-indicator neutral';
      powerText.textContent = 'Выберите CPU, GPU и БП';
    } else {
      const requiredPower = Math.ceil((cpuPower + gpuPower) * 1.4);
      if (psuWattage >= requiredPower) {
        powerIndicator.className = 'status-indicator pass';
        powerText.textContent = `Мощности БП достаточно (нужно ~${requiredPower}W, выбрано ${psuWattage}W)`;
      } else {
        powerIndicator.className = 'status-indicator fail';
        powerText.textContent = `Недостаточно мощности! Выбрано ${psuWattage}W, рекомендуется ≥ ${requiredPower}W`;
        compatibilityPassed = false;
      }
    }

    // C. Enable or disable order button based on compatibility & essential selections
    // Essential parts: CPU, Cooling, Motherboard, RAM, GPU, SSD, Case, PSU
    const essentialSelected = (
      cpuOpt.value !== 'none' &&
      coolingOpt.value !== 'none' &&
      mbOpt.value !== 'none' &&
      ramOpt.value !== 'none' &&
      gpuOpt.value !== 'none' &&
      ssdOpt.value !== 'none' &&
      caseOpt.value !== 'none' &&
      psuOpt.value !== 'none'
    );

    if (compatibilityPassed && essentialSelected) {
      modalOrderBtn.disabled = false;
      modalOrderBtn.style.opacity = '1';
      modalOrderBtn.style.cursor = 'pointer';
    } else {
      modalOrderBtn.disabled = true;
      modalOrderBtn.style.opacity = '0.5';
      modalOrderBtn.style.cursor = 'not-allowed';
    }

    // 4. Update PC Visual Preview depending on Selected Parts
    // Swapping renders dynamically depending on choices to make the UI feel responsive
    if (cpuOpt.value === 'none' || gpuOpt.value === 'none') {
      previewImgEl.src = 'pc-config-assets-separate/hero/hero-pc-white-rgb.png';
    } else if (gpuOpt.value === 'rtx-4080-super' || gpuOpt.value === 'rtx-4090' || cpuOpt.value === 'i9-14900kf' || caseOpt.value === 'nzxt-h9' || caseOpt.value === 'o11-dynamic') {
      previewImgEl.src = 'pc-config-assets-separate/builds/enthusiast-pro-build.png';
    } else if (gpuOpt.value === 'rtx-4070' || gpuOpt.value === 'rtx-4070super' || cpuOpt.value === 'r5-7600' || cpuOpt.value === 'r7-7800x3d') {
      previewImgEl.src = 'pc-config-assets-separate/builds/optimal-game-build.png';
    } else {
      previewImgEl.src = 'pc-config-assets-separate/builds/gaming-start-build.png';
    }
  }

  // Handle Order button click
  modalOrderBtn.addEventListener('click', () => {
    // Close modal
    closeModal();

    // Show Toast
    successToast.classList.add('active');

    // Hide Toast after 4 seconds
    setTimeout(() => {
      successToast.classList.remove('active');
    }, 4000);
  });

  // Handle Category click events (opens modal and presets parts accordingly!)
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-category');
      openModal();
      
      // Focus or highlight the select field inside the modal depending on category clicked
      let selectToFocus;
      if (category === 'cpu') selectToFocus = cpuSelect;
      if (category === 'cooling') selectToFocus = coolingSelect;
      if (category === 'motherboard') selectToFocus = mbSelect;
      if (category === 'ram') selectToFocus = ramSelect;
      if (category === 'gpu') selectToFocus = gpuSelect;
      if (category === 'ssd') selectToFocus = ssdSelect;
      if (category === 'case') selectToFocus = caseSelect;
      if (category === 'psu') selectToFocus = psuSelect;
      if (category === 'monitor') selectToFocus = monitorSelect;
      if (category === 'peripherals') selectToFocus = peripheralsSelect;
      
      if (selectToFocus) {
        setTimeout(() => {
          selectToFocus.focus();
          selectToFocus.style.outline = '2px solid var(--primary-blue)';
          
          // Remove custom outline on blur/interaction
          selectToFocus.addEventListener('blur', () => {
            selectToFocus.style.outline = '';
          }, { once: true });
        }, 100);
      }
    });
  });

  // Handle "Смотреть все" (View all builds) click toggle
  const toggleBuildsBtn = document.getElementById('toggle-builds-btn');
  const buildsGrid = document.querySelector('.builds-grid');
  
  if (toggleBuildsBtn && buildsGrid) {
    toggleBuildsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      buildsGrid.classList.toggle('show-all');
      
      if (buildsGrid.classList.contains('show-all')) {
        toggleBuildsBtn.textContent = 'Скрыть';
        
        // Re-run scroll observer on extra builds to animate them in smoothly
        const extraBuilds = document.querySelectorAll('.extra-build');
        extraBuilds.forEach((el, index) => {
          const delay = (index % 3) * 0.08;
          el.style.transitionDelay = `${delay}s`;
          el.classList.add('element-visible');
        });
      } else {
        toggleBuildsBtn.textContent = 'Смотреть все';
        document.getElementById('builds').scrollIntoView({ behavior: 'smooth' });
        
        const extraBuilds = document.querySelectorAll('.extra-build');
        extraBuilds.forEach(el => {
          el.classList.remove('element-visible');
          el.style.transitionDelay = '';
        });
      }
    });
  }

  // Login button click trigger (simple visual alert)
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      alert('Данная функция авторизации будет доступна в личном кабинете. Спасибо за тестирование!');
    });
  }

  // Video explanation click trigger (simple alert or youtube/modal popup placeholder)
  const howItWorksBtn = document.getElementById('how-it-works-btn');
  if (howItWorksBtn) {
    howItWorksBtn.addEventListener('click', () => {
      alert('Видео-инструкция: "Как работает наш автоматический конфигуратор ПК" в разработке.');
    });
  }
  
});
