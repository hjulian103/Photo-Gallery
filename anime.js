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
    // Repulse utility function
    function repulse(target, mouseX, mouseY, containerRect) {
        const imgRect = target.getBoundingClientRect();
        const imgCenterX = imgRect.left + imgRect.width / 2 - containerRect.left;
        const imgCenterY = imgRect.top + imgRect.height / 2 - containerRect.top;
        const dx = imgCenterX - mouseX;
        const dy = imgCenterY - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const repulseStrength = (0.7 + Math.random() * 0.3) * (120 / dist);
        anime({
            targets: target,
            translateX: dx * repulseStrength,
            translateY: dy * repulseStrength,
            duration: 320,
            easing: 'easeOutQuad'
        });
    }

    // Repulse for main gallery
    const gallery = document.querySelector('.gallery');
    if (gallery) {
        const images = gallery.querySelectorAll('.gallery-item');
        function handleMove(x, y) {
            const rect = gallery.getBoundingClientRect();
            const mouseX = x - rect.left;
            const mouseY = y - rect.top;
            images.forEach((img) => {
                repulse(img, mouseX, mouseY, rect);
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
    }
    // Repulse for portraits-gallery
    const portraitsGallery = document.querySelector('.portraits-gallery');
    if (portraitsGallery) {
        const images = portraitsGallery.querySelectorAll('.gallery-item');
        // Only target the .portraits-preview inside the same card as the gallery
        function getPreviewTarget() {
            // Look for closest .portraits-card ancestor, then find .portraits-preview inside
            let parent = portraitsGallery.parentElement;
            while (parent && !parent.classList.contains('portraits-card')) {
                parent = parent.parentElement;
            }
            if (parent) {
                // Only return the preview if it is visible (not display: none)
                const preview = parent.querySelector('.portraits-preview');
                if (preview && preview.offsetParent !== null) {
                    return preview;
                }
            }
            return null;
        }
        function handleMove(x, y) {
            const rect = portraitsGallery.getBoundingClientRect();
            const mouseX = x - rect.left;
            const mouseY = y - rect.top;
            images.forEach((img) => {
                repulse(img, mouseX, mouseY, rect);
            });
            // Repulse effect for preview image in the same card
            const preview = getPreviewTarget();
            if (preview) {
                repulse(preview, mouseX, mouseY, rect);
            }
        }
        function resetTransforms() {
            images.forEach(img => {
                anime({
                    targets: img,
                    translateX: 0,
                    translateY: 0,
                    duration: 320,
                    easing: 'easeOutQuad'
                });
            });
            const preview = getPreviewTarget();
            if (preview) {
                anime({
                    targets: preview,
                    translateX: 0,
                    translateY: 0,
                    duration: 320,
                    easing: 'easeOutQuad'
                });
            }
        }
        portraitsGallery.addEventListener('mousemove', function(e) {
            handleMove(e.clientX, e.clientY);
        });
        portraitsGallery.addEventListener('mouseleave', function() {
            resetTransforms();
        });
        portraitsGallery.addEventListener('touchstart', function(e) {
            if (e.touches && e.touches.length > 0) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
        portraitsGallery.addEventListener('touchend', function() {
            resetTransforms();
        }, { passive: false });
        portraitsGallery.addEventListener('touchmove', function(e) {
            if (e.touches && e.touches.length > 0) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
    }
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
// Toggle portraits folder open/close
document.addEventListener('DOMContentLoaded', function() {
    var folder = document.getElementById('portraitsFolder');
    var gallery = document.getElementById('portraitsGallery');
    var icon = document.getElementById('portraitsFolderIcon');
    var open = false;
    if (!folder || !gallery) return;
    folder.style.cursor = 'pointer';
    folder.onclick = function() {
        open = !open;
        gallery.style.display = open ? 'flex' : 'none';
        icon && (icon.textContent = open ? '\uD83D\uDCC1' : '\uD83D\uDCC1');
        folder.classList.toggle('open', open);
        if (open) {
            folder.classList.remove('open'); // restart animation
            void folder.offsetWidth;
            folder.classList.add('open');
        }
    };
});
document.addEventListener('DOMContentLoaded', function() {
        var folder = document.getElementById('portraitsFolder');
        var modal = document.getElementById('portraitsModal');
        var closeBtn = document.getElementById('portraitsModalClose');
        if (folder && modal && closeBtn) {
            folder.onclick = function() {
                modal.style.display = 'flex';
            };
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
            modal.onclick = function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            };
        }
    });