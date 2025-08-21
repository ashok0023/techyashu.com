// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.querySelector('.search-btn');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        const sectionElement = section;
        
        if (searchTerm === '' || text.includes(searchTerm)) {
            sectionElement.style.display = 'block';
            sectionElement.classList.remove('search-hidden');
        } else {
            sectionElement.style.display = 'none';
            sectionElement.classList.add('search-hidden');
        }
    });
    
    // Show no results message if needed
    const visibleSections = document.querySelectorAll('.section:not(.search-hidden)');
    const noResultsMsg = document.getElementById('no-results');
    
    if (visibleSections.length === 0 && searchTerm !== '') {
        if (!noResultsMsg) {
            const msg = document.createElement('div');
            msg.id = 'no-results';
            msg.className = 'no-results';
            msg.innerHTML = `
                <h3>No results found for "${searchTerm}"</h3>
                <p>Try searching for different keywords or check your spelling.</p>
            `;
            document.querySelector('.hero').appendChild(msg);
        }
    } else if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Gallery Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease-in';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Goal Checkbox Functionality
const goalCheckboxes = document.querySelectorAll('.goal-item input[type="checkbox"]');

goalCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const label = checkbox.nextElementSibling;
        const goalText = label.textContent;
        
        if (checkbox.checked) {
            showNotification(`✅ Completed: ${goalText}`, 'success');
            saveGoalState(checkbox.id, true);
        } else {
            showNotification(`📋 Reopened: ${goalText}`, 'info');
            saveGoalState(checkbox.id, false);
        }
        
        updateProgressBars();
    });
});

// Save goal states to localStorage
function saveGoalState(goalId, isChecked) {
    const savedGoals = JSON.parse(localStorage.getItem('studentGoals')) || {};
    savedGoals[goalId] = isChecked;
    localStorage.setItem('studentGoals', JSON.stringify(savedGoals));
}

// Load saved goal states
function loadGoalStates() {
    const savedGoals = JSON.parse(localStorage.getItem('studentGoals')) || {};
    
    goalCheckboxes.forEach(checkbox => {
        if (savedGoals[checkbox.id] !== undefined) {
            checkbox.checked = savedGoals[checkbox.id];
        }
    });
    
    updateProgressBars();
}

// Update progress bars based on completed goals
function updateProgressBars() {
    const dreamCards = document.querySelectorAll('.dream-card');
    
    dreamCards.forEach((card, index) => {
        const progressBar = card.querySelector('.progress');
        const progressText = card.querySelector('.progress-text');
        
        // Calculate progress based on related goals
        const relatedGoals = getRelatedGoals(index);
        const completedGoals = relatedGoals.filter(goal => goal.checked).length;
        const progress = Math.round((completedGoals / relatedGoals.length) * 100);
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Complete`;
    });
}

function getRelatedGoals(dreamIndex) {
    // Map dreams to related goals
    const goalMappings = {
        0: ['goal1', 'goal2', 'goal3'], // Tech Entrepreneur
        1: ['skill1', 'skill2', 'skill3'], // Advanced Studies
        2: ['personal1', 'personal2', 'personal3'] // Global Impact
    };
    
    const relatedIds = goalMappings[dreamIndex] || [];
    return relatedIds.map(id => document.getElementById(id)).filter(Boolean);
}

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Add CSS animations
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
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Dashboard Data Updates
function updateDashboard() {
    // Simulate real-time updates
    const deadlines = document.querySelectorAll('.deadline-item');
    const scheduleItems = document.querySelectorAll('.schedule-item');
    
    // Update countdown timers
    deadlines.forEach(item => {
        const dateText = item.querySelector('.deadline-date').textContent;
        if (dateText.includes('days')) {
            const days = parseInt(dateText.match(/\d+/)[0]);
            if (days > 0) {
                item.querySelector('.deadline-date').textContent = `Due: ${days - 1} days`;
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadGoalStates();
    
    // Update dashboard every minute
    setInterval(updateDashboard, 60000);
    
    // Add loading states
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        el.style.display = 'none';
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.dream-card, .dashboard-card, .bio-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Form handling (if any forms are added)
function handleFormSubmit(formId, endpoint) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    showNotification('Form submitted successfully!', 'success');
                    form.reset();
                } else {
                    showNotification('Error submitting form. Please try again.', 'error');
                }
            } catch (error) {
                showNotification('Network error. Please check your connection.', 'error');
            }
        });
    }
}

// Export functions for global use
window.StudentHub = {
    showNotification,
    updateProgressBars,
    performSearch,
    updateDashboard
};
