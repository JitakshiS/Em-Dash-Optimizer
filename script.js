// Em Dash Optimizer - Interactive Landing Page Script

// ===== PARTICLE ANIMATION =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.init();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsla(${220 + Math.random() * 60}, 70%, 60%, ${Math.random() * 0.3 + 0.1})`
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Draw connections
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `hsla(240, 70%, 60%, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        this.createParticles();
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor() {
        this.element = document.getElementById('typingText');
        this.words = [
            'Smart Typography',
            'Perfect Punctuation', 
            'Clean Text',
            'Better Writing',
            'AI Text Cleanup'
        ];
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.currentIndex];
        
        if (this.isDeleting) {
            this.currentText = currentWord.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = currentWord.substring(0, this.currentText.length + 1);
        }
        
        this.element.textContent = this.currentText;
        
        let timeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.currentText === currentWord) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.words.length;
            timeout = 500;
        }
        
        setTimeout(() => this.type(), timeout);
    }
}

// ===== DEMO FUNCTIONALITY =====
class DemoProcessor {
    constructor() {
        this.input = document.getElementById('demoInput');
        this.output = document.getElementById('demoOutput');
        this.option = document.getElementById('replacementOption');
        
        if (this.input && this.output) {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        // Auto-process when typing stops
        let timeout;
        this.input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.processText(), 500);
        });
        
        this.option.addEventListener('change', () => this.processText());
    }
    
    processText() {
        const text = this.input.value;
        const option = this.option.value;
        let result = text;
        
        switch (option) {
            case 'smart':
                result = this.smartReplace(text);
                break;
            case 'comma':
                result = text.replace(/—/g, ', ');
                break;
            case 'semicolon':
                result = text.replace(/—/g, '; ');
                break;
            case 'remove':
                result = text.replace(/—/g, ' ').replace(/\s+/g, ' ');
                break;
        }
        
        this.output.textContent = result;
    }
    
    smartReplace(text) {
        // Smart replacement logic
        return text.replace(/—/g, (match, offset, string) => {
            const before = string.charAt(offset - 1);
            const after = string.charAt(offset + 1);
            
            // If it's between two words with spaces, use comma
            if (before === ' ' && after !== ' ') return ', ';
            if (before !== ' ' && after === ' ') return ', ';
            
            // If it's at the end or connecting clauses, use semicolon
            if (/[.!?]/.test(string.substring(Math.max(0, offset - 20), offset))) {
                return '; ';
            }
            
            // Default to comma
            return ', ';
        });
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.setupNavigation();
    }
    
    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.setupObserver();
    }
    
    setupObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);
        
        // Observe all sections and cards
        document.querySelectorAll('section, .feature-card, .step').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }
}

// ===== NAVBAR SCROLL EFFECT =====
class NavbarController {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollY = window.scrollY;
        
        this.setupScrollListener();
    }
    
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove backdrop blur based on scroll
            if (currentScrollY > 50) {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            }
            
            this.lastScrollY = currentScrollY;
        });
    }
}

// ===== COPY TO CLIPBOARD =====
function copyResult() {
    const output = document.getElementById('demoOutput');
    const text = output.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback();
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyFeedback();
    }
}

function showCopyFeedback() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    
    copyBtn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
    copyBtn.style.background = '#10b981';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '';
    }, 2000);
}

// ===== DEMO OPTIMIZE FUNCTION =====
function optimizeDemo() {
    const demo = new DemoProcessor();
    demo.processText();
    
    // Add visual feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span class="btn-icon">⚡</span> Optimizing...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = '<span class="btn-icon">✨</span> Optimized!';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1000);
    }, 500);
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        
        this.monitor();
    }
    
    monitor() {
        const now = performance.now();
        this.frameCount++;
        
        if (now - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.frameCount = 0;
            this.lastTime = now;
            
            // Reduce particle count if FPS is too low
            if (this.fps < 30 && window.particleSystem) {
                window.particleSystem.particles = window.particleSystem.particles.slice(0, -5);
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    window.particleSystem = new ParticleSystem();
    new TypingAnimation();
    new DemoProcessor();
    new SmoothScroll();
    new ScrollAnimations();
    new NavbarController();
    new PerformanceMonitor();
    
    // Add loading animation completion
    document.body.classList.add('loaded');
    
    console.log('🚀 Em Dash Optimizer landing page loaded successfully!');
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Landing page error:', e.error);
});

// ===== EXPORT FOR POTENTIAL MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        TypingAnimation,
        DemoProcessor,
        SmoothScroll,
        ScrollAnimations,
        NavbarController
    };
}