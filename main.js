document.addEventListener("DOMContentLoaded", () => {
  // Global Music Controller
  const audio = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
  const musicBars = document.getElementById("music-bars");
  const musicText = document.getElementById("music-text");

  if (audio && musicBtn) {
    audio.volume = 0.5;
    // Check session storage to persist play state across pages if needed, but simple toggle for now
    musicBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        musicBars.classList.add("playing");
        musicText.textContent = "PAUSE";
      } else {
        audio.pause();
        musicBars.classList.remove("playing");
        musicText.textContent = "PLAY";
      }
    });
  }

  // Scroll Reveal Logic
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  // PAGE 1: INDEX.HTML LOGIC
  const loveGate = document.getElementById("love-gate");
  if (loveGate) {
    const barFill = document.getElementById("bar-fill");
    const percentage = document.getElementById("percentage");
    const mainContent = document.getElementById("main-content");

    let progress = 0;
    let isUnlocked = false;

    loveGate.addEventListener("click", () => {
      if (isUnlocked) return;
      progress += 15;
      if (progress > 100) progress = 100;

      barFill.style.width = `${progress}%`;
      percentage.textContent = `${progress}%`;

      if (progress === 100) {
        isUnlocked = true;
        setTimeout(() => {
          loveGate.style.opacity = "0";
          setTimeout(() => {
            loveGate.style.display = "none";
            mainContent.style.opacity = "1";
            if (audio) {
              audio
                .play()
                .then(() => {
                  musicBars.classList.add("playing");
                  musicText.textContent = "PAUSE";
                })
                .catch((e) => console.log("Audio play prevented:", e));
            }
          }, 1000);
        }, 500);
      }
    });

    // Spotify Slider Logic
    const sliderContainer = document.getElementById("slider-container");
    const thumb = document.getElementById("slide-thumb");
    const unlockedContent = document.getElementById("unlocked-content");

    if (sliderContainer && thumb) {
      let isDragging = false;
      let startX = 0;
      let maxSlide = 0;
      let isSliderUnlocked = false;

      const startDrag = (clientX) => {
        if (isSliderUnlocked) return;
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
          unlockedContent.classList.add("active");
          sliderContainer.classList.add("unlocked"); // <-- TAMBAHKAN BARIS INI
        }
      };

      const endDrag = () => {
        if (!isDragging || isSliderUnlocked) return;
        isDragging = false;
        thumb.style.transform = `translateX(0px)`;
      };

      thumb.addEventListener(
        "touchstart",
        (e) => startDrag(e.touches[0].clientX),
        { passive: true },
      );
      document.addEventListener(
        "touchmove",
        (e) => drag(e.touches[0].clientX),
        { passive: true },
      );
      document.addEventListener("touchend", endDrag);

      thumb.addEventListener("mousedown", (e) => startDrag(e.clientX));
      document.addEventListener("mousemove", (e) => drag(e.clientX));
      document.addEventListener("mouseup", endDrag);
    }
  }

  // PAGE 2: CAPTCHA LOGIC
  const captchaGrid = document.getElementById("captcha-grid");
  if (captchaGrid) {
    const items = document.querySelectorAll(".cap-item");
    const verifyBtn = document.getElementById("cap-verify");
    const modal = document.getElementById("success-modal");
    const closeModal = document.getElementById("close-modal");

    items.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("selected");
      });
    });

    verifyBtn.addEventListener("click", () => {
      const selectedCount =
        document.querySelectorAll(".cap-item.selected").length;
      // Any selection is valid because he is in all pictures!
      if (selectedCount > 0) {
        modal.classList.add("active");
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

    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  // PAGE 3: DIGITAL GARDEN LOGIC
  const waterBtn = document.getElementById("water-btn");
  if (waterBtn) {
    const plant = document.getElementById("plant-emoji");
    const msg = document.getElementById("garden-msg");
    const gardenBox = document.getElementById("garden-box");

    // The evolution of the plant
    const stages = ["🌱", "🌿", "🪴", "🌸"];
    let clicks = 0;

    waterBtn.addEventListener("click", () => {
      clicks++;

      // 1. Create a floating water/bubble effect on click
      const bubble = document.createElement("div");
      bubble.classList.add("bubble");
      bubble.style.width = bubble.style.height = `${Math.random() * 20 + 10}px`;
      bubble.style.left = `${Math.random() * 80 + 10}%`; // Random horizontal position
      bubble.style.bottom = "20%";
      gardenBox.appendChild(bubble);
      setTimeout(() => bubble.remove(), 3000);

      // 2. Play a bounce animation on the plant
      plant.classList.add("watered");
      setTimeout(() => plant.classList.remove("watered"), 300);

      // 3. Grow the plant based on clicks!
      if (clicks === 3) plant.textContent = stages[1]; // Becomes a herb
      if (clicks === 6) plant.textContent = stages[2]; // Becomes a potted plant

      // The final bloom!
      if (clicks === 9) {
        plant.textContent = stages[3]; // Blooms into a flower!
        waterBtn.style.display = "none"; // Hide the water button
        msg.classList.add("active"); // Show the sweet message

        // Spawn a burst of pink bubbles/confetti
        for (let i = 0; i < 15; i++) {
          setTimeout(() => {
            const b = document.createElement("div");
            b.classList.add("bubble");
            b.style.width = b.style.height = `${Math.random() * 20 + 10}px`;
            b.style.left = `${Math.random() * 100}%`;
            b.style.bottom = "10%";
            b.style.backgroundColor = "rgba(255, 128, 171, 0.4)"; // Pink bubbles
            gardenBox.appendChild(b);
            setTimeout(() => b.remove(), 3000);
          }, i * 150); // Stagger the spawn
        }
      }
    });
  }
});
