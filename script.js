document.addEventListener('DOMContentLoaded', function() {
    // Swipe Navigation System
    let currentPage = 0;
    const totalPages = 10;
    const swipeContainer = document.getElementById('swipeContainer');
    const pageDots = document.querySelectorAll('.page-dot');
    
    // Touch and mouse interaction variables
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let isScrolling = false;
    let startTime = 0;
    
    // Threshold for swipe detection
    const swipeThreshold = 80; // Minimum distance for swipe (increased for better control)
    const scrollThreshold = 20; // Vertical scroll threshold (decreased for better vertical scroll)
    const velocityThreshold = 0.3; // Minimum velocity for swipe detection
    
    // Initialize the page position
    function updatePagePosition() {
        const translateX = -currentPage * 100;
        swipeContainer.style.transform = `translateX(${translateX}vw)`;
        
        // Update page indicators
        pageDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
        
        // Hide swipe hint after first swipe
        if (currentPage > 0) {
            const swipeHint = document.querySelector('.swipe-hint');
            if (swipeHint) {
                swipeHint.style.opacity = '0';
                swipeHint.style.pointerEvents = 'none';
            }
        }
    }
    
    // Navigate to specific page
    function goToPage(pageIndex) {
        if (pageIndex >= 0 && pageIndex < totalPages) {
            currentPage = pageIndex;
            updatePagePosition();
        }
    }
    
    // Make goToPage globally accessible
    window.goToPage = goToPage;
    
    // Next page navigation
    function nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePagePosition();
        }
    }
    
    // Previous page navigation
    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
            updatePagePosition();
        }
    }
    
    // Touch event handlers
    function handleStart(e) {
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        currentX = startX;
        currentY = startY;
        isDragging = false;
        isScrolling = false;
        startTime = Date.now();
        
        // Add transition temporarily for smooth start
        swipeContainer.style.transition = 'transform 0.1s ease-out';
    }
    
    function handleMove(e) {
        if (!startX || !startY) return;
        
        const touch = e.touches ? e.touches[0] : e;
        currentX = touch.clientX;
        currentY = touch.clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        // Determine if this is a horizontal swipe or vertical scroll
        if (!isDragging && !isScrolling) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal movement - prevent default and start dragging
                isDragging = true;
                e.preventDefault();
            } else if (Math.abs(deltaY) > scrollThreshold) {
                // Vertical movement - allow scrolling within page
                isScrolling = true;
                return;
            }
        }
        
        if (isDragging) {
            e.preventDefault();
            
            // Calculate the new position with drag effect
            const currentTranslate = -currentPage * 100;
            const dragPercent = (deltaX / window.innerWidth) * 100;
            const newTranslate = currentTranslate + dragPercent;
            
            // Apply some resistance at the boundaries
            let finalTranslate = newTranslate;
            if (newTranslate > 0) {
                finalTranslate = newTranslate * 0.3; // Resistance when trying to go before first page
            } else if (newTranslate < -(totalPages - 1) * 100) {
                const overflow = newTranslate + (totalPages - 1) * 100;
                finalTranslate = -(totalPages - 1) * 100 + overflow * 0.3; // Resistance when trying to go past last page
            }
            
            swipeContainer.style.transform = `translateX(${finalTranslate}vw)`;
        }
    }
    
    function handleEnd() {
        if (!startX || !startY) return;
        
        const deltaX = currentX - startX;
        const deltaTime = Date.now() - startTime;
        const velocity = Math.abs(deltaX) / deltaTime; // pixels per millisecond
        
        // Reset transition
        swipeContainer.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        if (isDragging) {
            // Determine if swipe was significant enough (either distance or velocity)
            const isSignificantSwipe = Math.abs(deltaX) > swipeThreshold || velocity > velocityThreshold;
            
            if (isSignificantSwipe) {
                if (deltaX > 0) {
                    prevPage(); // Swipe right - go to previous page
                } else {
                    nextPage(); // Swipe left - go to next page
                }
            } else {
                // Snap back to current page
                updatePagePosition();
            }
        }
        
        // Reset variables
        startX = 0;
        startY = 0;
        currentX = 0;
        currentY = 0;
        isDragging = false;
        isScrolling = false;
        startTime = 0;
    }
    
    // Add touch event listeners
    swipeContainer.addEventListener('touchstart', handleStart, { passive: false });
    swipeContainer.addEventListener('touchmove', handleMove, { passive: false });
    swipeContainer.addEventListener('touchend', handleEnd);
    
    // Add mouse event listeners for desktop testing
    swipeContainer.addEventListener('mousedown', handleStart);
    swipeContainer.addEventListener('mousemove', handleMove);
    swipeContainer.addEventListener('mouseup', handleEnd);
    swipeContainer.addEventListener('mouseleave', handleEnd);
    
    // Prevent text selection during drag
    swipeContainer.addEventListener('selectstart', e => e.preventDefault());
    
    // Page dot navigation
    pageDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToPage(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                prevPage();
                break;
            case 'ArrowRight':
                nextPage();
                break;
            case 'Home':
                goToPage(0);
                break;
            case 'End':
                goToPage(totalPages - 1);
                break;
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updatePagePosition();
    });
    
    // Smooth scrolling for FAQ items (within page scrolling)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        summary.addEventListener('click', () => {
            // Allow FAQ accordion to work normally
            setTimeout(() => {
                // Scroll the FAQ item into view if needed
                const pageElement = item.closest('.page');
                const itemRect = item.getBoundingClientRect();
                const pageRect = pageElement.getBoundingClientRect();
                
                if (itemRect.bottom > pageRect.bottom) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            }, 300); // Wait for accordion animation
        });
    });
    
    // Add fade-in animation for page elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };
    
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe elements for fade-in animation
    const fadeElements = document.querySelectorAll('.problem-item, .benefit-item, .result-item, .feature-item, .casestudy-item, .process-step, .pricing-plan, .faq-item');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        scrollObserver.observe(el);
    });
    
    // Auto-hide swipe hint after 5 seconds
    setTimeout(() => {
        const swipeHint = document.querySelector('.swipe-hint');
        if (swipeHint && currentPage === 0) {
            swipeHint.style.opacity = '0.3';
        }
    }, 5000);
    
    // Initialize page position
    updatePagePosition();
    
    // Add scroll behavior for pages with overflow content
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        // Prevent horizontal scrolling within pages
        page.addEventListener('scroll', () => {
            if (page.scrollLeft !== 0) {
                page.scrollLeft = 0;
            }
        });
    });
    
    // Debug log
    console.log('Mobile Swipe LP initialized! Total pages:', totalPages);
    console.log('Use arrow keys, touch gestures, or page dots to navigate');
});