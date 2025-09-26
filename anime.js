// Zoom on Hover and Lightbox Animation for Gallery Images with touch support

document.addEventListener('DOMContentLoaded', function() {
    // Zoom on hover (adds/removes a class for CSS transform)
    document.querySelectorAll('.gallery-item').forEach(function(img) {
        img.addEventListener('mouseenter', function() {
            img.classList.add('zoomed');
        });
        img.addEventListener('mouseleave', function() {
            img.classList.remove('zoomed');
        });
        // Touch support for zoom effect
        img.addEventListener('touchstart', function(e) {
            img.classList.add('zoomed');
            // Prevent default to avoid triggering click right away
            e.preventDefault();
        }, { passive: false });
        img.addEventListener('touchend', function() {
            img.classList.remove('zoomed');
        });
        img.addEventListener('touchcancel', function() {
            img.classList.remove('zoomed');
        });
    });

    // Lightbox popup (already present in HTML, just animate)
    var modal = document.getElementById('imgModal');
    var modalImg = document.getElementById('imgModalImg');
    var caption = document.getElementById('imgModalCaption');
    var closeBtn = document.getElementById('imgModalClose');

    document.querySelectorAll('.gallery-item').forEach(function(img) {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            caption.textContent = img.alt;
            // Animate modal image
            modalImg.classList.remove('pop-in');
            void modalImg.offsetWidth; // trigger reflow
            modalImg.classList.add('pop-in');
        });
        img.addEventListener('touchend', function(e) {
            // Prevent double-triggering on some devices
            if (e.cancelable) e.preventDefault();
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            caption.textContent = img.alt;
            modalImg.classList.remove('pop-in');
            void modalImg.offsetWidth; // trigger reflow
            modalImg.classList.add('pop-in');
        }, { passive: false });
    });
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
});

// Repulse function: push images away from the mouse or touch point on move

document.addEventListener('DOMContentLoaded', function() {
    if (typeof anime === 'undefined') return;
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    const images = document.querySelectorAll('.gallery-item');

    function handleMove(x, y) {
        const rect = gallery.getBoundingClientRect();
        const mouseX = x - rect.left;
        const mouseY = y - rect.top;
        images.forEach((img, i) => {
            // Push each image away from the pointer, with some random offset
            const imgRect = img.getBoundingClientRect();
            const imgCenterX = imgRect.left + imgRect.width / 2 - rect.left;
            const imgCenterY = imgRect.top + imgRect.height / 2 - rect.top;
            const dx = imgCenterX - mouseX;
            const dy = imgCenterY - mouseY;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            const repulseStrength = (0.7 + Math.random() * 0.3) * (120 / dist); // Stronger when closer
            anime({
                targets: img,
                translateX: dx * repulseStrength,
                translateY: dy * repulseStrength,
                duration: 320,
                easing: 'easeOutQuad'
            });
        });
    }

    gallery.addEventListener('mousemove', function(e) {
        handleMove(e.clientX, e.clientY);
    });
    gallery.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });
    gallery.addEventListener('touchmove', function(e) {
        if (e.touches && e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });
});

// Animate the 'Photo Gallery' header text on page load using anime.js
// Each letter does a full rotation and bounces when landing

document.addEventListener('DOMContentLoaded', function() {
    if (typeof anime === 'undefined') {
        console.warn('anime.js not loaded. Please include anime.min.js in your HTML.');
        return;
    }
    var header = document.querySelector('.layout.header h1');
    if (!header) return;
    // Split text into spans for each letter
    var text = header.textContent;
    header.innerHTML = text.split('').map(function(char) {
        if (char === ' ') return '<span class="letter">&nbsp;</span>';
        return '<span class="letter">' + char + '</span>';
    }).join('');
    var letters = header.querySelectorAll('.letter');
    function animateLetters() {
        anime({
            targets: letters,
            keyframes: [
                { translateY: '-2.75rem', rotate: '1turn', easing: 'easeOutExpo', duration: 600 },
                { translateY: 0, rotate: '0turn', easing: 'easeOutBounce', duration: 800 }
            ],
            delay: anime.stagger(50),
            complete: function() {
                setTimeout(animateLetters, 1000);
            }
        });
    }
    animateLetters();
});
