document.addEventListener('DOMContentLoaded', function() {

  // Mobile Swipe Functionality
  let currentSection = 0;
  const sections = document.querySelectorAll('.mobile-section');
  const swipeContainer = document.getElementById('mobile-swipe-container');
  const mobileNavigation = document.getElementById('mobile-navigation');
  const swipeHint = document.getElementById('mobile-swipe-hint');
  let isMobile = window.innerWidth <= 768;
  
  // Initialize mobile navigation dots
  function initMobileNavigation() {
    if (!isMobile || !mobileNavigation) {
      console.log('Mobile navigation init skipped:', {isMobile, mobileNavigation});
      return;
    }
    
    console.log('Initializing mobile navigation with', sections.length, 'sections');
    mobileNavigation.innerHTML = '';
    sections.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'mobile-nav-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSection(index));
      mobileNavigation.appendChild(dot);
    });
  }
  
  // Go to specific section
  function goToSection(sectionIndex) {
    if (!isMobile || !swipeContainer) {
      console.log('goToSection: Not mobile or no swipe container');
      return;
    }
    
    console.log(`goToSection: Moving to section ${sectionIndex}`);
    currentSection = Math.max(0, Math.min(sectionIndex, sections.length - 1));
    const translateX = -currentSection * 100;
    console.log(`goToSection: translateX = ${translateX}vw`);
    swipeContainer.style.transform = `translateX(${translateX}vw)`;
    
    // Update navigation dots
    const dots = document.querySelectorAll('.mobile-nav-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSection);
    });
    
    // Hide swipe hint after first interaction
    if (swipeHint && currentSection > 0) {
      swipeHint.style.display = 'none';
    }
  }
  
  // Touch event handling for swipe
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let hasMoved = false;
  
  function handleTouchStart(e) {
    if (!isMobile) return;
    console.log('Touch start detected');
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    hasMoved = false;
  }
  
  function handleTouchMove(e) {
    if (!isMobile || !isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = startX - currentX;
    const deltaY = startY - currentY;
    
    // Check if horizontal swipe is more prominent than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault(); // Prevent default scrolling
      hasMoved = true;
      console.log('Horizontal swipe detected, deltaX:', deltaX);
    }
  }
  
  function handleTouchEnd(e) {
    if (!isMobile || !isDragging) {
      isDragging = false;
      return;
    }
    
    const endX = e.changedTouches[0].clientX;
    const deltaX = startX - endX;
    const swipeThreshold = 50;
    
    console.log('Touch end, deltaX:', deltaX, 'hasMoved:', hasMoved);
    
    if (hasMoved && Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0 && currentSection < sections.length - 1) {
        // Swipe left (next section)
        console.log('Swiping to next section');
        goToSection(currentSection + 1);
      } else if (deltaX < 0 && currentSection > 0) {
        // Swipe right (previous section)
        console.log('Swiping to previous section');
        goToSection(currentSection - 1);
      }
    }
    
    isDragging = false;
    hasMoved = false;
  }
  
  // Keyboard navigation
  function handleKeyDown(e) {
    if (!isMobile) return;
    
    if (e.key === 'ArrowLeft' && currentSection > 0) {
      goToSection(currentSection - 1);
    } else if (e.key === 'ArrowRight' && currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    }
  }
  
  // Initialize mobile swipe if on mobile device
  if (isMobile && swipeContainer) {
    console.log('Initializing mobile swipe functionality...');
    initMobileNavigation();
    
    // Set initial position
    swipeContainer.style.transform = 'translateX(0vw)';
    
    // Add touch event listeners
    swipeContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    swipeContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    swipeContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Hide swipe hint after 5 seconds
    setTimeout(() => {
      if (swipeHint && currentSection === 0) {
        swipeHint.style.opacity = '0';
        setTimeout(() => {
          if (swipeHint) swipeHint.style.display = 'none';
        }, 500);
      }
    }, 5000);
  }

  // Smooth scrolling for internal links (modified for mobile swipe)
  const scrollLinks = document.querySelectorAll('.scroll-link');
  scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          
          if (isMobile) {
            // For mobile, find the section index and use swipe navigation
            const sectionMapping = {
              '#problem': 1,
              '#solution': 2, 
              '#results': 3,
              '#features': 4,
              '#casestudies': 5,
              '#process': 6,
              '#pricing': 7,
              '#faq': 8,
              '#stock-search': 9,
              '#contact': 10
            };
            
            const sectionIndex = sectionMapping[targetId];
            if (sectionIndex !== undefined) {
              goToSection(sectionIndex);
            }
          } else {
            // Desktop behavior
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header if any
                    behavior: 'smooth'
                });
            }
          }
      });
  });

  // Simple fade-in animation on scroll
  const fadeElements = document.querySelectorAll('.hero-content, .problem-item, .benefit-item, .result-item, .feature-item, .casestudy-item, .process-step, .pricing-plan, .faq-item');

  const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
  };

  const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              // Optional: Unobserve after animation to save resources
              // observer.unobserve(entry.target);
          } else {
              // Optional: Remove class if you want animation to re-trigger on scroll up
              // entry.target.classList.remove('visible');
          }
      });
  };

  const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

  fadeElements.forEach(el => {
      el.classList.add('fade-in'); // Add initial state class
      scrollObserver.observe(el);
  });


  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      summary.addEventListener('click', (event) => {
          // Basic accordion: close others when one opens
          // if (!item.hasAttribute('open')) {
          //     faqItems.forEach(otherItem => {
          //         if (otherItem !== item) {
          //             otherItem.removeAttribute('open');
          //         }
          //     });
          // }
      });
  });

  const hero = document.querySelector('.hero');
  const counters = document.querySelectorAll('.count');
  const animateCount = (counter) => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / target));
    let count = 0;
    const timer = setInterval(() => {
      count += 1;
      counter.textContent = count;
      if (count >= target) clearInterval(timer);
    }, stepTime);
  };

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => countObserver.observe(counter));
  
  // Stock Search Functionality
  const stockInput = document.getElementById('stock-symbol');
  const searchButton = document.getElementById('search-stock');
  const stockResult = document.getElementById('stock-result');
  const stockError = document.getElementById('stock-error');
  const loading = document.getElementById('loading');
  const symbolButtons = document.querySelectorAll('.symbol-btn');

  // Function to show loading state
  function showLoading() {
    loading.style.display = 'block';
    stockResult.style.display = 'none';
    stockError.style.display = 'none';
  }

  // Function to hide loading state
  function hideLoading() {
    loading.style.display = 'none';
  }

  // Function to show error
  function showError() {
    stockError.style.display = 'block';
    stockResult.style.display = 'none';
    hideLoading();
  }

  // Function to format currency
  function formatCurrency(value, currency = 'USD') {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(value);
  }

  // Function to format percentage
  function formatPercentage(value) {
    if (value === null || value === undefined) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  // Function to update stock display
  function updateStockDisplay(data) {
    // Clear previous classes
    const changeValue = document.getElementById('price-change');
    const changePercent = document.getElementById('price-change-percent');
    
    changeValue.classList.remove('positive', 'negative');
    changePercent.classList.remove('positive', 'negative');

    // Update stock information
    document.getElementById('stock-name').textContent = data.name || data.symbol;
    document.getElementById('stock-symbol-display').textContent = data.symbol;
    document.getElementById('current-price').textContent = formatCurrency(data.currentPrice);
    
    // Calculate change
    const change = data.currentPrice - data.previousClose;
    const changePercent_value = ((change / data.previousClose) * 100);
    
    document.getElementById('price-change').textContent = `${change >= 0 ? '+' : ''}${formatCurrency(Math.abs(change))}`;
    document.getElementById('price-change-percent').textContent = formatPercentage(changePercent_value);
    
    // Add positive/negative classes
    if (change >= 0) {
      changeValue.classList.add('positive');
      changePercent.classList.add('positive');
    } else {
      changeValue.classList.add('negative');
      changePercent.classList.add('negative');
    }

    // Update details
    document.getElementById('day-high').textContent = formatCurrency(data.dayHigh);
    document.getElementById('day-low').textContent = formatCurrency(data.dayLow);
    document.getElementById('day-open').textContent = formatCurrency(data.dayOpen);
    document.getElementById('prev-close').textContent = formatCurrency(data.previousClose);
    
    // Update timestamp
    const now = new Date();
    document.getElementById('last-updated').textContent = `最終更新: ${now.toLocaleString('ja-JP')}`;

    // Show result
    stockResult.style.display = 'block';
    stockError.style.display = 'none';
    hideLoading();
  }

  // Function to search stock using Yahoo Finance alternative API
  async function searchStock(symbol) {
    if (!symbol) {
      showError();
      return;
    }

    showLoading();
    
    try {
      // Using Alpha Vantage free API (requires registration for API key)
      // For demo purposes, we'll simulate with dummy data
      // In production, you would replace this with a real API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate realistic dummy data for demo
      const basePrice = 100 + Math.random() * 400; // Random price between 100-500
      const changePercent = (Math.random() - 0.5) * 10; // Random change between -5% to +5%
      const previousClose = basePrice * (1 - changePercent / 100);
      const dayOpen = previousClose * (0.95 + Math.random() * 0.1); // Open within 5% of previous close
      const dayHigh = basePrice * (1 + Math.random() * 0.05); // High up to 5% above current
      const dayLow = basePrice * (0.95 - Math.random() * 0.05); // Low down to 5% below current

      const dummyData = {
        symbol: symbol.toUpperCase(),
        name: getCompanyName(symbol.toUpperCase()),
        currentPrice: basePrice,
        previousClose: previousClose,
        dayOpen: dayOpen,
        dayHigh: dayHigh,
        dayLow: dayLow
      };

      updateStockDisplay(dummyData);
      
    } catch (error) {
      console.error('Error fetching stock data:', error);
      showError();
    }
  }

  // Function to get company name (dummy data for demo)
  function getCompanyName(symbol) {
    const companies = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'META': 'Meta Platforms Inc.',
      'NVDA': 'NVIDIA Corporation',
      'JPM': 'JPMorgan Chase & Co.',
      'V': 'Visa Inc.',
      'JNJ': 'Johnson & Johnson'
    };
    return companies[symbol] || `${symbol} Corporation`;
  }

  // Event listeners
  searchButton.addEventListener('click', () => {
    const symbol = stockInput.value.trim();
    if (symbol) {
      searchStock(symbol);
    }
  });

  stockInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const symbol = stockInput.value.trim();
      if (symbol) {
        searchStock(symbol);
      }
    }
  });

  // Symbol button event listeners
  symbolButtons.forEach(button => {
    button.addEventListener('click', () => {
      const symbol = button.getAttribute('data-symbol');
      stockInput.value = symbol;
      searchStock(symbol);
    });
  });

  console.log('ITSUDEMO CAKE LP Script Loaded with Stock Search!');

});

// Add class to body when scrolling to enable sticky header or other effects (desktop only)
window.addEventListener('scroll', function() {
  if (window.innerWidth > 768) { // Only on desktop
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
    if (hero) {
      hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
    }
  }
});

// Handle window resize to toggle mobile/desktop behavior
window.addEventListener('resize', function() {
  const newIsMobile = window.innerWidth <= 768;
  
  if (newIsMobile !== isMobile) {
    isMobile = newIsMobile;
    // Refresh page to properly reinitialize
    window.location.reload();
  }
});