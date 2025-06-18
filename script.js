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
  
  // Debug function to analyze section content and styling
  function debugSectionState(sectionIndex) {
    const section = sections[sectionIndex];
    if (!section) {
      console.error(`DEBUG: Section ${sectionIndex} not found!`);
      return;
    }
    
    const computedStyle = window.getComputedStyle(section);
    const rect = section.getBoundingClientRect();
    const container = section.querySelector('.container');
    const containerRect = container ? container.getBoundingClientRect() : null;
    
    console.group(`🔍 SECTION ${sectionIndex} DEBUG ANALYSIS`);
    
    // Basic section info
    console.log('📋 Section Info:', {
      id: section.id,
      className: section.className,
      tagName: section.tagName,
      hasContent: section.innerHTML.length > 0,
      childElementCount: section.childElementCount
    });
    
    // Positioning and dimensions
    console.log('📏 Dimensions & Position:', {
      width: computedStyle.width,
      height: computedStyle.height,
      actualHeight: section.offsetHeight + 'px',
      actualWidth: section.offsetWidth + 'px',
      scrollHeight: section.scrollHeight + 'px',
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      inViewport: rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
    });
    
    // Styling details
    console.log('🎨 Styling:', {
      backgroundColor: computedStyle.backgroundColor,
      background: computedStyle.background,
      color: computedStyle.color,
      display: computedStyle.display,
      opacity: computedStyle.opacity,
      visibility: computedStyle.visibility,
      zIndex: computedStyle.zIndex,
      position: computedStyle.position,
      overflow: computedStyle.overflow,
      overflowX: computedStyle.overflowX,
      overflowY: computedStyle.overflowY
    });
    
    // Padding and margins
    console.log('📦 Spacing:', {
      padding: computedStyle.padding,
      paddingTop: computedStyle.paddingTop,
      paddingBottom: computedStyle.paddingBottom,
      margin: computedStyle.margin,
      boxSizing: computedStyle.boxSizing
    });
    
    // Container analysis
    if (container) {
      const containerStyle = window.getComputedStyle(container);
      console.log('📦 Container Info:', {
        hasContainer: true,
        containerRect: containerRect,
        containerDisplay: containerStyle.display,
        containerFlex: containerStyle.flex,
        containerFlexDirection: containerStyle.flexDirection,
        containerChildCount: container.childElementCount,
        containerHeight: containerStyle.height,
        containerActualHeight: container.offsetHeight + 'px'
      });
    } else {
      console.log('❌ No .container element found in section');
    }
    
    // Content analysis
    const textContent = section.textContent.trim();
    const hasVisibleText = textContent.length > 0;
    const hasImages = section.querySelectorAll('img').length;
    const hasButtons = section.querySelectorAll('.btn').length;
    
    console.log('📝 Content Analysis:', {
      hasVisibleText,
      textLength: textContent.length,
      firstTextPreview: textContent.substring(0, 100) + (textContent.length > 100 ? '...' : ''),
      hasImages,
      imageCount: hasImages,
      hasButtons,
      buttonCount: hasButtons,
      allTextNodes: Array.from(section.querySelectorAll('*')).filter(el => el.textContent.trim()).length
    });
    
    // Check for specific classes that might affect display
    const hasGradientClass = section.classList.contains('section-padding-gradient');
    const hasMobileSectionClass = section.classList.contains('mobile-section');
    console.log('🏷️ Important Classes:', {
      hasMobileSectionClass,
      hasGradientClass,
      allClasses: Array.from(section.classList)
    });
    
    // Check if content is being hidden by CSS
    const allElements = section.querySelectorAll('*');
    let hiddenElements = 0;
    let visibleElements = 0;
    
    allElements.forEach(el => {
      const elStyle = window.getComputedStyle(el);
      if (elStyle.display === 'none' || elStyle.visibility === 'hidden' || elStyle.opacity === '0') {
        hiddenElements++;
      } else {
        visibleElements++;
      }
    });
    
    console.log('👁️ Element Visibility:', {
      totalElements: allElements.length,
      visibleElements,
      hiddenElements,
      visibilityRatio: (visibleElements / allElements.length * 100).toFixed(1) + '%'
    });
    
    console.groupEnd();
  }

  // Go to specific section
  function goToSection(sectionIndex) {
    if (!isMobile || !swipeContainer) {
      console.log('goToSection: Not mobile or no swipe container');
      return;
    }
    
    console.log(`🔄 SWIPE: Moving to section ${sectionIndex} of ${sections.length}`);
    
    // Run comprehensive debug analysis
    debugSectionState(sectionIndex);
    
    currentSection = Math.max(0, Math.min(sectionIndex, sections.length - 1));
    const translateX = -currentSection * 100;
    console.log(`🔄 SWIPE: translateX = ${translateX}vw`);
    swipeContainer.style.transform = `translateX(${translateX}vw)`;
    
    // Update navigation dots
    const dots = document.querySelectorAll('.mobile-nav-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSection);
    });
    
    // Debug: Log current transform and section visibility
    console.log(`🔄 SWIPE: Container transform applied:`, swipeContainer.style.transform);
    
    // Hide swipe hint after first interaction
    if (swipeHint && currentSection > 0) {
      swipeHint.style.display = 'none';
    }
    
    // 🔧 DIAGNOSTIC AND FIX CODE - As requested
    setTimeout(() => {
      const targetSection = sections[currentSection];
      if (!targetSection) {
        console.error(`❌ Target section ${currentSection} not found!`);
        return;
      }
      
      console.group(`🔧 DIAGNOSTIC FIXES - Section ${currentSection}`);
      
      // 1. CRITICAL FIX: Reset scroll position to top
      console.log('📍 Before scroll reset:', {
        scrollTop: targetSection.scrollTop,
        scrollHeight: targetSection.scrollHeight,
        clientHeight: targetSection.clientHeight
      });
      
      targetSection.scrollTop = 0;
      console.log('✅ Scroll position reset to top');
      
      // 2. CRITICAL FIX: Force background color application with test
      const sectionId = targetSection.id;
      const gradientSections = ['solution', 'features', 'pricing', 'contact'];
      const isGradientSection = gradientSections.includes(sectionId) || targetSection.classList.contains('section-padding-gradient');
      
      console.log('🎨 Background diagnosis:', {
        sectionId,
        isGradientSection,
        currentBackground: window.getComputedStyle(targetSection).backgroundColor,
        hasGradientClass: targetSection.classList.contains('section-padding-gradient')
      });
      
      if (isGradientSection) {
        // Force apply gradient background
        targetSection.style.background = 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)';
        targetSection.style.color = '#ffffff';
        console.log('🎨 Applied gradient background to section', currentSection);
        
        // Test with temporary background for 2 seconds to verify visibility
        if (currentSection === 1) { // Test on section 1 specifically
          const originalBg = targetSection.style.background;
          targetSection.style.backgroundColor = 'lightblue';
          targetSection.style.border = '3px solid red';
          console.log('🎨 Test: Applied lightblue background and red border to section 1');
          setTimeout(() => {
            targetSection.style.background = originalBg;
            targetSection.style.backgroundColor = '';
            targetSection.style.border = '';
            console.log('🎨 Test: Restored original background');
          }, 2000);
        }
      } else {
        // Force white background for non-gradient sections
        targetSection.style.backgroundColor = '#ffffff';
        targetSection.style.color = '#1f2937';
        console.log('🎨 Applied white background to section', currentSection);
      }
      
      // 3. DIAGNOSTIC: getBoundingClientRect positioning check
      const rect = targetSection.getBoundingClientRect();
      console.log('📐 getBoundingClientRect analysis:', {
        position: {
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right
        },
        dimensions: {
          width: rect.width,
          height: rect.height
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        isInViewport: rect.left >= -10 && rect.left <= 10 && rect.top >= -50,
        isFullyVisible: rect.left >= -10 && rect.left <= 10 && rect.top >= 0 && rect.bottom <= window.innerHeight
      });
      
      // 4. DIAGNOSTIC: Content height vs display area analysis
      const container = targetSection.querySelector('.container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        console.log('📦 Container positioning analysis:', {
          containerTop: containerRect.top,
          containerHeight: containerRect.height,
          sectionHeight: rect.height,
          contentOverflow: containerRect.height > rect.height,
          contentVisibleInViewport: containerRect.top >= 0 && containerRect.bottom <= window.innerHeight
        });
        
        // Check if content is positioned outside viewport
        if (containerRect.top > window.innerHeight || containerRect.bottom < 0) {
          console.warn('⚠️ Container is positioned outside viewport!');
          // Fix container positioning
          container.style.transform = 'translateY(0)';
          container.style.position = 'relative';
          container.style.top = '0';
          console.log('✅ Reset container positioning');
        }
      }
      
      // 5. DIAGNOSTIC: Overflow settings diagnosis
      const computedStyle = window.getComputedStyle(targetSection);
      console.log('📋 Overflow diagnosis:', {
        overflow: computedStyle.overflow,
        overflowX: computedStyle.overflowX,
        overflowY: computedStyle.overflowY,
        position: computedStyle.position,
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity
      });
      
      // Fix overflow issues if detected
      if (computedStyle.overflowY === 'hidden') {
        targetSection.style.overflowY = 'auto';
        console.log('✅ Fixed overflowY from hidden to auto');
      }
      
      // 6. VISUAL DEBUG INDICATORS (temporary)
      // Add temporary border to make section boundaries visible
      targetSection.style.border = '2px dashed rgba(255, 0, 0, 0.5)';
      targetSection.style.boxSizing = 'border-box';
      console.log('🔍 Added debug border to section', currentSection);
      
      // Add section number indicator
      let debugIndicator = targetSection.querySelector('.debug-section-indicator');
      if (!debugIndicator) {
        debugIndicator = document.createElement('div');
        debugIndicator.className = 'debug-section-indicator';
        debugIndicator.style.cssText = `
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          z-index: 9999;
          pointer-events: none;
        `;
        debugIndicator.textContent = `Section ${currentSection + 1}: ${sectionId || 'unnamed'}`;
        targetSection.appendChild(debugIndicator);
        console.log('🔍 Added debug section indicator');
      }
      
      // Remove debug indicators after 5 seconds
      setTimeout(() => {
        targetSection.style.border = '';
        if (debugIndicator) {
          debugIndicator.remove();
        }
        console.log('🧹 Cleaned up debug indicators');
      }, 5000);
      
      // 7. FADE-IN ANIMATION FIX: Ensure all content is immediately visible
      const fadeElements = targetSection.querySelectorAll('.fade-in, .hero-content, .problem-item, .benefit-item, .result-item, .feature-item, .casestudy-item, .process-step, .pricing-plan, .faq-item');
      fadeElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'none';
      });
      if (fadeElements.length > 0) {
        console.log(`✅ Fixed visibility for ${fadeElements.length} fade-in elements`);
      }
      
      console.groupEnd();
    }, 100);
    
    // Extended debug check after transform is applied
    setTimeout(() => {
      const currentSectionElement = sections[currentSection];
      if (currentSectionElement) {
        console.group(`🔍 POST-SWIPE ANALYSIS - Section ${currentSection}`);
        
        const rect = currentSectionElement.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(currentSectionElement);
        
        console.log('📍 Final Position Check:', {
          sectionVisible: rect.left === 0 && rect.top >= 0,
          boundingRect: rect,
          isInViewport: rect.left >= -10 && rect.left <= 10, // Allow small margin for floating point errors
          transform: swipeContainer.style.transform,
          expectedPosition: -currentSection * window.innerWidth
        });
        
        console.log('🎨 Final Styling Check:', {
          backgroundColor: computedStyle.backgroundColor,
          backgroundImage: computedStyle.backgroundImage,
          color: computedStyle.color,
          display: computedStyle.display,
          opacity: computedStyle.opacity,
          visibility: computedStyle.visibility
        });
        
        // Check if any content elements are positioned outside the viewport
        const contentElements = currentSectionElement.querySelectorAll('h2, h3, p, .btn, .container');
        let elementsOutsideViewport = 0;
        let elementsInViewport = 0;
        
        contentElements.forEach(el => {
          const elRect = el.getBoundingClientRect();
          if (elRect.bottom < 0 || elRect.top > window.innerHeight) {
            elementsOutsideViewport++;
            console.log('⚠️ Element outside viewport:', {
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              rect: elRect,
              textContent: el.textContent.substring(0, 50) + '...'
            });
          } else {
            elementsInViewport++;
          }
        });
        
        console.log('📊 Content Position Summary:', {
          totalContentElements: contentElements.length,
          elementsInViewport,
          elementsOutsideViewport,
          potentialIssue: elementsOutsideViewport > elementsInViewport
        });
        
        console.groupEnd();
      }
    }, 150);
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
  
  // Debug all sections function
  function debugAllSections() {
    console.group('🔍 COMPREHENSIVE SECTION ANALYSIS - INITIALIZATION');
    console.log(`📱 Mobile Mode: ${isMobile}, Viewport: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`📦 Container:`, {
      exists: !!swipeContainer,
      width: swipeContainer?.clientWidth,
      height: swipeContainer?.clientHeight,
      children: swipeContainer?.children.length
    });
    
    sections.forEach((section, index) => {
      debugSectionState(index);
    });
    console.groupEnd();
  }

  // Initialize mobile swipe if on mobile device
  if (isMobile && swipeContainer) {
    console.log('🚀 Initializing mobile swipe functionality...');
    console.log('📱 Viewport:', window.innerWidth + 'x' + window.innerHeight);
    console.log('📦 Found', sections.length, 'mobile sections');
    
    // Run comprehensive analysis of all sections
    debugAllSections();
    
    initMobileNavigation();
    
    // Set initial position
    swipeContainer.style.transform = 'translateX(0vw)';
    console.log('🎯 Initial transform set to translateX(0vw)');
    
    // Debug: Check container setup
    console.log('📦 Swipe container setup:', {
      width: swipeContainer.clientWidth,
      height: swipeContainer.clientHeight,
      childrenCount: swipeContainer.children.length,
      transform: swipeContainer.style.transform,
      computedTransform: window.getComputedStyle(swipeContainer).transform
    });
    
    // Add touch event listeners
    swipeContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    swipeContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    swipeContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    console.log('👆 Touch event listeners added');
    
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
    
    // Initial section analysis
    console.log('🎯 Running initial section 0 analysis...');
    debugSectionState(0);
    
    console.log('✅ Mobile swipe initialization complete');
  } else {
    console.log('❌ Mobile swipe not initialized:', { isMobile, hasSwipeContainer: !!swipeContainer });
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
  
  // DEBUGGING COMMENT: 問題の原因と修正内容の説明
  // Issue Analysis: Mobile swipe pages 2+ appearing blank
  // 
  // ROOT CAUSES IDENTIFIED:
  // 1. CSS height/padding conflict: .mobile-section had height: 100vh but also padding: 40px 0 120px 0
  //    This pushed content outside the viewport on smaller screens
  // 
  // 2. Background gradient not applying: .section-padding-gradient class wasn't properly targeting mobile sections
  //    The CSS selectors weren't specific enough for the mobile layout structure
  // 
  // 3. Fade-in animations hiding content: Mobile sections had fade-in animations that weren't completing
  //    Content remained with opacity: 0 and translateY transforms
  // 
  // 4. Container overflow issues: .container elements could overflow outside the mobile section bounds
  // 
  // FIXES IMPLEMENTED:
  // 1. Reduced mobile section padding from 40px 0 120px 0 to 20px 0 60px 0
  // 2. Added specific CSS selectors for gradient sections (#solution, #features, #pricing, #contact)
  // 3. Disabled fade-in animations on mobile with !important overrides
  // 4. Improved container positioning and overflow handling
  // 5. Added comprehensive debugging logs to track section states
  // 
  // The debugging output will now show detailed information about:
  // - Section dimensions and positioning
  // - Background colors and styling
  // - Content visibility and element counts
  // - Viewport positioning of elements
  // - Potential overflow issues
  console.log('🔧 Mobile swipe debugging and fixes loaded!');

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