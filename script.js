// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeRicePurityTest();
    initializeContactForm();
    initializeCopyFeatures();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
            trapFocus(navMenu);
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
            navToggle.focus();
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navToggle.focus();
        }
    });

    // Header shrink on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Focus trap for mobile navigation
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    firstElement.focus();
}

// Scroll reveal effects
function initializeScrollEffects() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Rice Purity Test functionality
function initializeRicePurityTest() {
    const calculateButton = document.getElementById('calculate-score');
    const resetButton = document.getElementById('reset-test');
    const testForm = document.getElementById('purity-test-form');
    const resultsSection = document.getElementById('test-results');

    if (!calculateButton || !testForm) return;

    calculateButton.addEventListener('click', calculatePurityScore);
    resetButton?.addEventListener('click', resetTest);

    function calculatePurityScore() {
        const checkboxes = testForm.querySelectorAll('input[type="checkbox"]:checked');
        let totalDeduction = 0;

        checkboxes.forEach(checkbox => {
            const weight = parseInt(checkbox.getAttribute('data-weight')) || 5;
            totalDeduction += weight;
        });

        const score = Math.max(0, 100 - totalDeduction);
        displayResults(score);
    }

    function displayResults(score) {
        const scoreNumber = document.getElementById('score-number');
        const progressFill = document.getElementById('progress-fill');
        const interpretationText = document.getElementById('interpretation-text');
        const shareText = document.getElementById('share-text');

        if (!scoreNumber) return;

        // Animate score counting up
        let currentScore = 0;
        const increment = score / 50;
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= score) {
                currentScore = score;
                clearInterval(timer);
            }
            scoreNumber.textContent = Math.round(currentScore);
        }, 20);

        // Animate progress bar
        setTimeout(() => {
            progressFill.style.width = `${score}%`;
        }, 500);

        // Set interpretation
        const interpretation = getScoreInterpretation(score);
        if (interpretationText) {
            interpretationText.textContent = interpretation;
        }

        // Update share text
        if (shareText) {
            shareText.value = `I scored ${score}/100 on the Rice Purity Test! It was interesting to reflect on my college experiences. Check it out on Student Bonding!`;
        }

        // Show results section
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function getScoreInterpretation(score) {
        if (score >= 80) {
            return "You have high purity! You've had fewer experiences in the areas the test covers, which often reflects focused priorities or being early in your exploration journey. There's no rush - everyone moves at their own pace.";
        } else if (score >= 50) {
            return "You have moderate experience! You've had a balanced mix of experiences, suggesting you're actively exploring life while maintaining some boundaries. This shows thoughtful decision-making.";
        } else if (score >= 20) {
            return "You have broad experience! You've had many varied experiences across different areas. This often indicates openness to new things and comfort with exploration. Remember that every experience is a learning opportunity.";
        } else {
            return "You have extensive experience! You've experienced a lot across many categories. This might reflect an adventurous spirit. Remember to balance adventure with self-care and reflection on what truly serves your well-being.";
        }
    }

    function resetTest() {
        const checkboxes = testForm.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        if (resultsSection) {
            resultsSection.style.display = 'none';
        }

        testForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const modal = document.getElementById('contact-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOk = document.getElementById('modal-ok');

    if (!contactForm) return;

    contactForm.addEventListener('submit', handleContactSubmit);

    function handleContactSubmit(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            showModal();
        }
    }

    function validateContactForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        let isValid = true;

        // Clear previous errors
        clearErrors();

        // Validate name
        if (!name.value.trim()) {
            showError('name-error', 'Name is required');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError('email-error', 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate subject
        if (!subject.value) {
            showError('subject-error', 'Please select a subject');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError('message-error', 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError('message-error', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function clearErrors() {
        const errorElements = contactForm.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.classList.remove('show');
        });
    }

    function showModal() {
        if (modal) {
            modal.style.display = 'block';
            modalOk.focus();
        }
    }

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOk) {
        modalOk.addEventListener('click', closeModal);
    }

    // Close modal on escape key or outside click
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            contactForm.reset();
        }
    }
}

// Copy to clipboard functionality
function initializeCopyFeatures() {
    const copyShareButton = document.getElementById('copy-share-text');
    const copyPactButton = document.getElementById('copy-pact');

    if (copyShareButton) {
        copyShareButton.addEventListener('click', () => {
            const shareText = document.getElementById('share-text');
            if (shareText) {
                copyToClipboard(shareText.value, 'Share text copied!');
            }
        });
    }

    if (copyPactButton) {
        copyPactButton.addEventListener('click', () => {
            const pactText = document.querySelector('.pact-text');
            if (pactText) {
                copyToClipboard(pactText.textContent, 'Conversation Pact copied!');
            }
        });
    }

    function copyToClipboard(text, message) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCopyFeedback(message);
            }).catch(() => {
                fallbackCopy(text, message);
            });
        } else {
            fallbackCopy(text, message);
        }
    }

    function fallbackCopy(text, message) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback(message);
        } catch (err) {
            console.error('Failed to copy text:', err);
            showCopyFeedback('Copy failed - please select and copy manually');
        }
        
        document.body.removeChild(textArea);
    }

    function showCopyFeedback(message) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 10000;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }
}

// Feature detection and progressive enhancement
function hasFeature(feature) {
    switch (feature) {
        case 'intersectionObserver':
            return 'IntersectionObserver' in window;
        case 'smoothScroll':
            return 'scrollBehavior' in document.documentElement.style;
        default:
            return false;
    }
}

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
    // Skip to main content with keyboard shortcut
    if (e.altKey && e.key === 'm') {
        const main = document.querySelector('.main');
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
