/**
 * Progress tracking, Scroll Spy, Reading Time, and Reading Progress bar.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initScrollSpy();
    initChapterTracking();
    calculateReadingTime();
});

/**
 * Reading Progress bar at the top of the page
 */
function initScrollProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

/**
 * Scroll Spy for Left Sidebar Outline highlighting
 */
function initScrollSpy() {
    // Select all sections that should be tracked in the TOC
    const sections = Array.from(document.querySelectorAll('main h2[id], main h3[id]'));
    const navLinks = Array.from(document.querySelectorAll('.toc-nav a'));
    
    if (sections.length === 0 || navLinks.length === 0) return;

    // Use IntersectionObserver to determine which section is currently active
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -80% 0px', // Trigger when section hits the upper 10-20% of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Find matching link
                const targetId = entry.target.id;
                const activeLink = document.querySelector(`.toc-nav a[href="#${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
}

/**
 * Chapter Completion Tracking using localStorage
 */
function initChapterTracking() {
    // Read current chapter ID from a meta tag
    const metaChapter = document.querySelector('meta[name="chapter"]');
    if (!metaChapter) return;
    
    const chapterIdStr = metaChapter.content;
    const completedChapters = JSON.parse(localStorage.getItem('completedChapters') || '[]');
    
    const completeBtn = document.getElementById('mark-complete-btn');
    if (completeBtn) {
        if (completedChapters.includes(chapterIdStr)) {
            setButtonCompleted(completeBtn);
        } else {
            completeBtn.addEventListener('click', () => {
                completedChapters.push(chapterIdStr);
                // remove duplicates just in case
                const uniqueCompleted = [...new Set(completedChapters)];
                localStorage.setItem('completedChapters', JSON.stringify(uniqueCompleted));
                
                setButtonCompleted(completeBtn);
                
                // Show a brief toast or animation
                completeBtn.textContent = '✓ Chapter Completed!';
            });
        }
    }
}

function setButtonCompleted(btn) {
    btn.textContent = 'Completed';
    btn.disabled = true;
    btn.classList.add('completed');
    btn.style.backgroundColor = 'var(--color-text-muted)';
    btn.style.cursor = 'default';
}

/**
 * Dynamic Reading Time calculation (assuming 200 words per minute)
 */
function calculateReadingTime() {
    const content = document.querySelector('main .content');
    const timeDisplay = document.getElementById('reading-time');
    
    if (!content || !timeDisplay) return;
    
    const text = content.innerText || content.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    
    // Calculate minutes based on 200 wpm
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    
    timeDisplay.textContent = `${readingTimeMinutes} min read`;
}
