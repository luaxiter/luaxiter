document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Glitch Effect
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        setInterval(() => {
            const r1 = Math.random() * 10;
            const r2 = Math.random() * 10;
            glitchText.style.setProperty('--r1', `${r1}px`);
            glitchText.style.setProperty('--r2', `${r2}px`);
        }, 2000);
    }

    // Matrix-style Hacker Background - Purple/Blue Theme
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let columns = [];
        let drops = [];

        // Characters to use - mix of code symbols, binary, and special chars
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン{}[]()<>+-*/=!@#$%^&*';
        const charArray = chars.split('');

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            // Calculate number of columns
            const fontSize = 14;
            columns = Math.floor(width / fontSize);

            // Reset drops array
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100; // Start at random heights
            }
        }

        window.addEventListener('resize', resize);
        resize();

        let lastTime = 0;
        const fps = 30; // Limit FPS to reduce flashing speed
        const interval = 1000 / fps;

        function draw(currentTime) {
            requestAnimationFrame(draw);

            const deltaTime = currentTime - lastTime;
            if (deltaTime < interval) return;

            lastTime = currentTime - (deltaTime % interval);

            // Darker background with lower opacity for longer trails (smoother look)
            ctx.fillStyle = 'rgba(5, 5, 16, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = '14px monospace';

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const char = charArray[Math.floor(Math.random() * charArray.length)];

                // Purple-focused color scheme
                const brightness = Math.random();
                if (brightness > 0.95) {
                    ctx.fillStyle = '#bf00ff'; // Brightest purple
                } else if (brightness > 0.8) {
                    ctx.fillStyle = '#9d00d9';
                } else if (brightness > 0.6) {
                    ctx.fillStyle = '#7b00b3';
                } else if (brightness > 0.4) {
                    ctx.fillStyle = '#5a0080';
                } else {
                    ctx.fillStyle = '#3d0059'; // Darkest
                }

                // Subtle glow effect
                if (brightness > 0.9) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#bf00ff';
                } else {
                    ctx.shadowBlur = 0;
                }

                // Draw character
                const x = i * 14;
                const y = drops[i] * 14;
                ctx.fillText(char, x, y);

                // Reset drop to top randomly
                if (y > height && Math.random() > 0.98) {
                    drops[i] = 0;
                }

                // Move drop down
                drops[i]++;
            }
        }

        // Start animation loop
        requestAnimationFrame(draw);
    }

    // Image Viewer Functionality - Click on gallery items to view full size
    const imageViewer = document.getElementById('imageViewer');
    const imageViewerClose = document.getElementById('imageViewerClose');
    const viewerImage = document.getElementById('viewerImage');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (imageViewer && imageViewerClose && viewerImage) {
        // Add click event to each gallery item
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Only trigger if clicking directly on the gallery item or its image
                // This prevents clicks on empty space from opening the viewer
                if (e.target === item || e.target.parentElement === item) {
                    const imageSrc = item.getAttribute('data-image');
                    if (imageSrc) {
                        viewerImage.src = imageSrc;
                        imageViewer.classList.add('active');
                    }
                }
            });
        });

        // Close image viewer
        imageViewerClose.addEventListener('click', () => {
            imageViewer.classList.remove('active');
            viewerImage.src = '';
        });

        // Close when clicking outside the image
        imageViewer.addEventListener('click', (e) => {
            if (e.target === imageViewer) {
                imageViewer.classList.remove('active');
                viewerImage.src = '';
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageViewer.classList.contains('active')) {
                imageViewer.classList.remove('active');
                viewerImage.src = '';
            }
        });
    }
});
