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

    // 3D Purple/Blue Particle System
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Mouse state
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        resize();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 2 + 1; // Depth factor (1 to 3)
                this.baseSize = Math.random() * 3; // Base size
                this.size = this.baseSize;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                // Purple/Blue colors
                const colors = [
                    `rgba(191, 0, 255, ${Math.random() * 0.6 + 0.2})`, // Purple
                    `rgba(138, 43, 226, ${Math.random() * 0.6 + 0.2})`, // BlueViolet
                    `rgba(0, 255, 255, ${Math.random() * 0.4 + 0.1})`   // Cyan accent
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.pulseSpeed = Math.random() * 0.05 + 0.01;
                this.pulseAngle = Math.random() * Math.PI * 2;
            }

            update() {
                // Base movement
                this.x += this.vx * this.z;
                this.y += this.vy * this.z;

                // Pulse effect
                this.pulseAngle += this.pulseSpeed;
                this.size = this.baseSize + Math.sin(this.pulseAngle) * 0.5;

                // Mouse Repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200; // Interaction radius

                if (distance < maxDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (maxDistance - distance) / maxDistance;
                    const repulsionStrength = 5 * this.z;

                    this.vx += forceDirectionX * force * repulsionStrength * 0.05;
                    this.vy += forceDirectionY * force * repulsionStrength * 0.05;
                }

                // Friction to stabilize speed
                this.vx *= 0.96;
                this.vy *= 0.96;

                // Screen wrapping
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                const apparentSize = Math.max(0, this.size * this.z * 0.5);
                ctx.arc(this.x, this.y, apparentSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = 300;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }
});
