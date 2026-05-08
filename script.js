// INTERACTIVE PARALLAX STARS
(function() {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = 0;
    let mouseY = 0;
    const stars = [];
    const STAR_COUNT = 200;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // Initialize stars with depth and parallax factor
    function initStars() {
        stars.length = 0;
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8 + 0.2,
                baseAlpha: Math.random() * 0.7 + 0.3,
                alpha: 0,
                speed: Math.random() * 0.015 + 0.005,
                direction: Math.random() > 0.5 ? 1 : -1,
                depth: Math.random() * 0.8 + 0.2, // 0.2 (far) to 1.0 (close)
                hue: Math.random() > 0.7 ? Math.random() * 60 + 200 : 0 // Some blue-ish stars
            });
        }
    }

    resize();
    initStars();
    window.addEventListener('resize', () => {
        resize();
        initStars();
    });

    // Track mouse position for parallax
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / width - 0.5) * 2; // -1 to 1
        mouseY = (e.clientY / height - 0.5) * 2; // -1 to 1
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            // Twinkling alpha
            star.alpha += star.speed * star.direction;
            if (star.alpha >= star.baseAlpha) {
                star.alpha = star.baseAlpha;
                star.direction = -1;
            } else if (star.alpha <= 0.1) {
                star.alpha = 0.1;
                star.direction = 1;
            }

            // Parallax offset based on depth
            const parallaxX = mouseX * star.depth * 30;
            const parallaxY = mouseY * star.depth * 30;

            const drawX = star.x + parallaxX;
            const drawY = star.y + parallaxY;

            // Wrap around screen edges
            const wrappedX = ((drawX % width) + width) % width;
            const wrappedY = ((drawY % height) + height) % height;

            // Glow effect for closer stars
            if (star.depth > 0.7) {
                ctx.shadowColor = star.hue ? `hsla(${star.hue}, 70%, 70%, ${star.alpha * 0.8})` : `rgba(255, 255, 255, ${star.alpha * 0.6})`;
                ctx.shadowBlur = star.radius * 3;
            } else {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }

            ctx.beginPath();
            ctx.arc(wrappedX, wrappedY, star.radius, 0, Math.PI * 2);

            if (star.hue) {
                ctx.fillStyle = `hsla(${star.hue}, 70%, 80%, ${star.alpha})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            }
            ctx.fill();

            // Reset shadow for performance
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        });

        // Draw subtle connecting lines between nearby stars
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100 && stars[i].depth > 0.6 && stars[j].depth > 0.6) {
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x + mouseX * stars[i].depth * 30, stars[i].y + mouseY * stars[i].depth * 30);
                    ctx.lineTo(stars[j].x + mouseX * stars[j].depth * 30, stars[j].y + mouseY * stars[j].depth * 30);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
})();

// CUSTOM CURSOR
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
});

(function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
})();

// THEME TOGGLE
const tb = document.getElementById('themeBtn');
tb.addEventListener('click', () => {
    document.body.classList.toggle('light');
    tb.textContent = document.body.classList.contains('light') ? '☾' : '☀';
});

// SCROLL REVEAL
const obs = new IntersectionObserver(e => e.forEach(n => {
    if (n.isIntersecting) n.target.classList.add('visible');
}), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
