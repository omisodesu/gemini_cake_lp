document.addEventListener('DOMContentLoaded', function() {

  // Smooth scrolling for internal links
  const scrollLinks = document.querySelectorAll('.scroll-link');
  scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              window.scrollTo({
                  top: targetElement.offsetTop - 70, // Adjust for fixed header if any
                  behavior: 'smooth'
              });
          }
      });
  });

  // Simple fade-in animation on scroll
  const fadeElements = document.querySelectorAll('.problem-item, .benefit-item, .result-item, .feature-item, .casestudy-item, .process-step, .pricing-plan, .faq-item');

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

  // Add more "cool" JavaScript interactions as needed:
  // - Parallax scrolling for hero image
  // - Counter animation for result numbers
  // - More sophisticated hover effects
  // - Navigation bar behavior (sticky, hide on scroll down)

  // Example: Log to console to confirm script is loaded
  console.log('ITSUDEMO CAKE LP Script Loaded!');

});

// Add class to body when scrolling to enable sticky header or other effects
window.addEventListener('scroll', function() {
  if (window.scrollY > 100) { // Adjust scroll distance as needed
      document.body.classList.add('scrolled');
  } else {
      document.body.classList.remove('scrolled');
  }
});