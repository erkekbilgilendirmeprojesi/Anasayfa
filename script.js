// Common JavaScript functionality for all pages

// Track scroll position to show/hide navbar
let lastScrollTop = 0;

// Initialize variables for scroll buttons
let scrollButtons, scrollToTopBtn, scrollToBottomBtn, isScrollingUp = false, scrollTimer;

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll buttons if they exist
    scrollButtons = document.querySelector('.scroll-buttons');
    scrollToTopBtn = document.getElementById('scroll-to-top');
    scrollToBottomBtn = document.getElementById('scroll-to-bottom');
    
    // Reset scroll position and navbar state
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.remove('navbar-hidden');
        lastScrollTop = 0;
    }
    
    // Set up event listeners
    setupNavbarToggle();
    setupMobileMenu();
    setupScrollButtons();
    checkUrlHash();
    setupEmailSubscription();
});

// Update the navbar toggle function to be more consistent
function setupNavbarToggle() {
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // If scrolling down and past 100px from top, hide navbar
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.classList.add('navbar-hidden');
        }
        // If scrolling up, show navbar
        else {
            navbar.classList.remove('navbar-hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (!menuToggle) return;

    menuToggle.addEventListener('click', function () {
        document.querySelector('.nav-menu').classList.toggle('active');

        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a menu item
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function () {
            document.querySelector('.nav-menu').classList.remove('active');
            document.querySelector('.menu-toggle i').classList.remove('fa-times');
            document.querySelector('.menu-toggle i').classList.add('fa-bars');
        });
    });
}

// Scroll buttons functionality
function setupScrollButtons() {
    if (!scrollButtons || !scrollToTopBtn || !scrollToBottomBtn) return;

    // Show/hide scroll buttons based on scroll direction
    window.addEventListener('scroll', function () {
        clearTimeout(scrollTimer);

        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Determine scroll direction
        if (currentScrollTop < lastScrollTop) {
            isScrollingUp = true;
            scrollButtons.classList.add('visible');
        } else {
            isScrollingUp = false;
        }

        // Hide buttons after 2 seconds of no scrolling
        scrollTimer = setTimeout(() => {
            if (!isScrollingUp) {
                scrollButtons.classList.remove('visible');
            }
        }, 2000);

        // Always show buttons if scrolled down enough (300px)
        if (currentScrollTop > 300) {
            scrollButtons.classList.add('visible');
        } else if (currentScrollTop < 100) {
            scrollButtons.classList.remove('visible');
        }
    });

    // Scroll to top when the up button is clicked
    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll to bottom when the down button is clicked
    scrollToBottomBtn.addEventListener('click', function () {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
}

// SPA navigation functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        // Scroll to top when changing pages
        window.scrollTo(0, 0);

        // Track page view in Google Analytics
        if (typeof gtag === 'function') {
            gtag('config', 'G-84EJT9W4BQ', {
                'page_title': targetPage.querySelector('h1').innerText,
                'page_path': '#' + pageId
            });
        }
    }
}

// Function to show a page and scroll to a specific section
function showPageAndScrollToSection(pageId, sectionName) {
    // First show the correct page
    showPage(pageId);

    // Then find the section heading containing the text
    setTimeout(() => {
        const headings = document.querySelectorAll('#' + pageId + ' h2');
        for (let heading of headings) {
            if (heading.textContent.includes(sectionName)) {
                heading.scrollIntoView({ behavior: 'smooth' });
                break;
            }
        }
    }, 100); // Small delay to ensure the page is visible
}

// Function to check URL hash and show appropriate section on page load
function checkUrlHash() {
    // Get the hash from URL (remove the # symbol)
    const hash = window.location.hash.substring(1);

    // If hash exists and corresponds to a valid section, show that section
    if (hash && document.getElementById(hash)) {
        try {
            // Display the correct page based on hash
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(hash).classList.add('active');

            // Update navigation highlighting
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });

            // Find the nav link with matching href
            const navLink = document.querySelector(`.nav-menu a[href="#${hash}"]`);
            if (navLink) {
                navLink.classList.add('active');
            }

            // Track page view in Google Analytics
            if (typeof gtag === 'function') {
                gtag('config', 'G-84EJT9W4BQ', {
                    'page_title': document.getElementById(hash).querySelector('h1').innerText,
                    'page_path': '#' + hash
                });
            }

            console.log('Successfully switched to section:', hash);
        } catch (error) {
            console.error('Error switching to section:', hash, error);
        }
    }
}

// Copy content to clipboard
function copyToClipboard(pageId) {
    const content = document.getElementById(pageId).innerText;
    navigator.clipboard.writeText(content)
        .then(() => {
            showNotification('İçerik panoya kopyalandı!');
        })
        .catch(err => {
            console.error('Kopyalama hatası:', err);
            showNotification('Kopyalama başarısız.', true);
        });
}

// Copy current page URL to clipboard
function copyPageUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            showNotification('Sayfa bağlantısı panoya kopyalandı!');
        })
        .catch(err => {
            console.error('URL kopyalama hatası:', err);
            showNotification('URL kopyalama başarısız.', true);
        });
}

// Share functions
function shareOnTwitter(pageId) {
    let title, url, text;
    
    if (document.getElementById(pageId)) {
        title = document.getElementById(pageId).querySelector('h1').innerText;
    } else {
        title = document.title;
    }
    
    url = window.location.href;
    text = `${title} - Erkek Bilgilendirme Projesi`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

function shareOnWhatsApp(pageId) {
    let title, url, text;
    
    if (document.getElementById(pageId)) {
        title = document.getElementById(pageId).querySelector('h1').innerText;
    } else {
        title = document.title;
    }
    
    url = window.location.href;
    text = `${title} - Erkek Bilgilendirme Projesi: ${url}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

function shareOnTelegram(pageId) {
    let title, url, text;
    
    if (document.getElementById(pageId)) {
        title = document.getElementById(pageId).querySelector('h1').innerText;
    } else {
        title = document.title;
    }
    
    url = window.location.href;
    text = `${title} - Erkek Bilgilendirme Projesi`;

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
}

// Update active navigation link based on current page
function updateActiveNav(pageId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to the correct nav link
    document.querySelector(`.nav-menu a[href="#${pageId}"]`).classList.add('active');
}

// Custom notification system
function showNotification(message, isError = false) {
    // Remove existing notification if present
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: isError ? '#e74c3c' : '#2ecc71',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '5px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
        zIndex: '1000',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        opacity: '0',
        transform: 'translateY(20px)'
    });

    // Add to document
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';

        // Remove from DOM after animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Email subscription handling
function setupEmailSubscription() {
    const emailForm = document.getElementById('email-form');
    if (!emailForm) return;
    
    const subscriberEmail = document.getElementById('subscriber-email');
    const subscriptionMessage = document.getElementById('subscription-message');

    emailForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = subscriberEmail.value.trim();
        if (!email || !isValidEmail(email)) {
            showMessage('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }

        // Add timestamp to know when they subscribed
        const timestamp = new Date();

        // Check if Firebase is initialized
        if (typeof db !== 'undefined') {
            // Store email in Firestore
            db.collection('subscribers').doc(email).set({
                email: email,
                subscribedAt: timestamp,
                active: true
            })
            .then(() => {
                showMessage('Abone olduğunuz için teşekkürler!', 'success');
                subscriberEmail.value = '';
            })
            .catch((error) => {
                console.error("Error adding subscriber: ", error);
                showMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
            });
        } else {
            console.error("Firebase database not initialized");
            showMessage('Şu anda hizmet kullanılamıyor.', 'error');
        }
    });

    function showMessage(message, type) {
        subscriptionMessage.textContent = message;
        subscriptionMessage.className = 'subscription-message ' + type;

        // Clear message after 5 seconds
        setTimeout(() => {
            subscriptionMessage.textContent = '';
            subscriptionMessage.className = 'subscription-message';
        }, 5000);
    }
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}