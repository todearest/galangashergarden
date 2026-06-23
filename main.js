document.addEventListener("DOMContentLoaded", () => {
    document.body.style.transition = 'opacity 0.4s ease';

    // ==========================================
    // 1. GLOBAL MUSIC PLAYER
    // ==========================================
    const audio = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicBars = document.getElementById('music-bars');
    const musicText = document.getElementById('music-text');
    
    if (audio && musicBtn) {
        audio.volume = 0.5;
        musicBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(e => console.warn("Auto-play blocked"));
                if(musicBars) musicBars.classList.add('playing');
                if(musicText) musicText.textContent = "PAUSE";
            } else {
                audio.pause();
                if(musicBars) musicBars.classList.remove('playing');
                if(musicText) musicText.textContent = "PLAY";
            }
        });
    }

    // ==========================================
    // 2. CORE PAGE LOGIC (Wrapped for Routing)
    // ==========================================
    const initPageLogic = () => {
        // A. SCROLL REVEAL
        const reveals = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { 
                    entry.target.classList.add('visible'); 
                    revealObserver.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 });
        reveals.forEach(el => revealObserver.observe(el));

        // B. LOVE GATE (Index Page Preloader)
        const loveGate = document.getElementById('love-gate');
        if (loveGate) {
            const barFill = document.getElementById('bar-fill');
            const percentage = document.getElementById('percentage');
            const mainContent = document.getElementById('main-content');
            let progress = 0;
            let isUnlocked = false;

            loveGate.addEventListener('click', () => {
                if (isUnlocked) return;
                progress += 15;
                if (progress > 100) progress = 100;
                barFill.style.width = `${progress}%`;
                percentage.textContent = `${progress}%`;

                if (progress === 100) {
                    isUnlocked = true;
                    setTimeout(() => {
                        loveGate.style.opacity = '0';
                        setTimeout(() => {
                            loveGate.style.display = 'none';
                            mainContent.style.opacity = '1';
                            if(audio && audio.paused) {
                                audio.play().then(() => {
                                    if(musicBars) musicBars.classList.add('playing');
                                    if(musicText) musicText.textContent = "PAUSE";
                                }).catch(e => console.log("Audio prevented:", e));
                            }
                        }, 1000);
                    }, 500);
                }
            });
        } else {
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.style.opacity = '1';
        }

        // C. SPOTIFY SLIDER
        const sliderContainer = document.getElementById('slider-container');
        const thumb = document.getElementById('slide-thumb');
        const unlockedContent = document.getElementById('unlocked-content');
        if (sliderContainer && thumb) {
            let isDragging = false;
            let startX = 0;
            let maxSlide = 0;
            let isSliderUnlocked = false;

            const startDrag = (clientX) => {
                if(isSliderUnlocked) return;
                isDragging = true;
                startX = clientX - thumb.offsetLeft;
                maxSlide = sliderContainer.offsetWidth - thumb.offsetWidth - 10;
            };

            const drag = (clientX) => {
                if (!isDragging || isSliderUnlocked) return;
                let x = clientX - startX;
                if (x < 5) x = 5;
                if (x > maxSlide) x = maxSlide;
                thumb.style.transform = `translateX(${x}px)`;
                if (x >= maxSlide - 10) {
                    isSliderUnlocked = true;
                    isDragging = false;
                    unlockedContent.classList.add('active');
                    sliderContainer.classList.add('unlocked');
                }
            };

            const endDrag = () => {
                if (!isDragging || isSliderUnlocked) return;
                isDragging = false;
                thumb.style.transform = `translateX(0px)`;
            };

            thumb.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), {passive: true});
            document.addEventListener('touchmove', (e) => drag(e.touches[0].clientX), {passive: true});
            document.addEventListener('touchend', endDrag);

            thumb.addEventListener('mousedown', (e) => startDrag(e.clientX));
            document.addEventListener('mousemove', (e) => drag(e.clientX));
            document.addEventListener('mouseup', endDrag);
        }

        // D. CAPTCHA LOGIC
        const captchaGrid = document.getElementById('captcha-grid');
        if (captchaGrid) {
            const items = document.querySelectorAll('.cap-item');
            const verifyBtn = document.getElementById('cap-verify');
            const modal = document.getElementById('success-modal');
            const closeModal = document.getElementById('close-modal');

            items.forEach(item => {
                item.addEventListener('click', () => item.classList.toggle('selected'));
            });

            verifyBtn.addEventListener('click', () => {
                const selectedCount = document.querySelectorAll('.cap-item.selected').length;
                if (selectedCount > 0) {
                    modal.classList.add('active');
                } else {
                    verifyBtn.textContent = "SELECT AT LEAST 1";
                    verifyBtn.style.color = "#ff5252";
                    verifyBtn.style.borderColor = "#ff5252";
                    setTimeout(() => {
                        verifyBtn.textContent = "VERIFY";
                        verifyBtn.style.color = "";
                        verifyBtn.style.borderColor = "";
                    }, 2000);
                }
            });
            closeModal.addEventListener('click', () => modal.classList.remove('active'));
        }

        // E. GARDEN LOGIC
        const waterBtn = document.getElementById('water-btn');
        if (waterBtn) {
            const plant = document.getElementById('plant-emoji');
            const msg = document.getElementById('garden-msg');
            const gardenBox = document.getElementById('garden-box');
            const stages = ['🌱', '🌿', '🪴', '🌸'];
            let clicks = 0;

            waterBtn.addEventListener('click', () => {
                clicks++;
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                bubble.style.width = bubble.style.height = `${Math.random() * 20 + 10}px`;
                bubble.style.left = `${Math.random() * 80 + 10}%`; 
                bubble.style.bottom = '20%';
                gardenBox.appendChild(bubble);
                setTimeout(() => bubble.remove(), 3000);

                plant.classList.add('watered');
                setTimeout(() => plant.classList.remove('watered'), 300);

                if (clicks === 3) plant.textContent = stages[1]; 
                if (clicks === 6) plant.textContent = stages[2]; 
                if (clicks === 9) {
                    plant.textContent = stages[3]; 
                    waterBtn.style.display = 'none'; 
                    msg.classList.add('active'); 
                    
                    for(let i = 0; i < 15; i++) {
                        setTimeout(() => {
                            const b = document.createElement('div');
                            b.classList.add('bubble');
                            b.style.width = b.style.height = `${Math.random() * 20 + 10}px`;
                            b.style.left = `${Math.random() * 100}%`;
                            b.style.bottom = '10%';
                            b.style.backgroundColor = 'rgba(255, 128, 171, 0.4)'; 
                            gardenBox.appendChild(b);
                            setTimeout(() => b.remove(), 3000);
                        }, i * 150); 
                    }
                }
            });
        }
    };

    initPageLogic();

    // ==========================================
    // 3. SEAMLESS SPA ROUTER
    // ==========================================
    const performRouting = async (url) => {
        document.body.style.opacity = '0';
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            setTimeout(() => {
                document.title = doc.title;
                document.body.className = doc.body.className;
                
                const audioEl = document.getElementById("bg-music");
                const btnEl = document.getElementById("music-btn");
                const keepElements = [audioEl, btnEl].filter(Boolean);
                
                Array.from(document.body.childNodes).forEach(node => {
                    if (!keepElements.includes(node) && node.nodeName !== 'SCRIPT') node.remove();
                });

                Array.from(doc.body.childNodes).forEach(node => {
                    if (node.id !== "bg-music" && node.id !== "music-btn" && node.nodeName !== 'SCRIPT') {
                        document.body.appendChild(node);
                    }
                });

                history.pushState(null, "", url);
                window.scrollTo({ top: 0, behavior: "smooth" });
                
                initPageLogic();
                document.body.style.opacity = '1';
            }, 400);
        } catch (err) {
            window.location.href = url;
        }
    };

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && link.getAttribute('href').endsWith('.html')) {
            // Ignore blank targets and external links (like Spotify)
            if (link.getAttribute('target') === '_blank' || link.href.startsWith('http')) return;
            e.preventDefault();
            performRouting(link.getAttribute('href'));
        }
    });

    window.addEventListener('popstate', () => performRouting(window.location.href));
    setTimeout(() => document.body.style.opacity = '1', 100);
});
