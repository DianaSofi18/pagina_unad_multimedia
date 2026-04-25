// Audio player
        const audioEl = document.getElementById('audioEl');
        const playBtn = document.getElementById('playBtn');
        const progressFill = document.getElementById('progressFill');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const volumeSlider = document.getElementById('volumeSlider');
        const muteIcon = document.getElementById('muteIcon');

        let previousVolume = 1;

        function toggleMute() {
            if (!audioEl) return;
            if (audioEl.muted) {
                audioEl.muted = false;
                muteIcon.textContent = '🔊';
                volumeSlider.value = previousVolume;
            } else {
                audioEl.muted = true;
                muteIcon.textContent = '🔇';
                previousVolume = volumeSlider.value;
                volumeSlider.value = 0;
            }
        }
        
        function submitFunName() {
            const input = document.getElementById('funNameInput');
            const greeting = document.getElementById('funGreeting');
            if (input && greeting && input.value.trim() !== '') {
                greeting.innerHTML = `¡Bienvenido, <strong style="color: var(--accent); font-size: 1.1rem;">${input.value.trim()}</strong>!`;
                input.value = '';
            }
        }

        function fmt(s) {
            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60);
            return `${m}:${sec.toString().padStart(2, '0')}`;
        }
        function toggleAudio() {
            if (!audioEl) return;
            if (audioEl.paused) { audioEl.play(); playBtn.textContent = '⏸'; }
            else { audioEl.pause(); playBtn.textContent = '▶'; }
        }
        function seekAudio(e) {
            if (!audioEl || !audioEl.duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            audioEl.currentTime = ratio * audioEl.duration;
        }
        if (audioEl) {
            audioEl.addEventListener('loadedmetadata', () => {
                durationEl.textContent = fmt(audioEl.duration);
            });
            audioEl.addEventListener('timeupdate', () => {
                if (!audioEl.duration) return;
                const pct = (audioEl.currentTime / audioEl.duration) * 100;
                progressFill.style.width = pct + '%';
                currentTimeEl.textContent = fmt(audioEl.currentTime);
            });
            audioEl.addEventListener('ended', () => { playBtn.textContent = '▶'; });
        }
        
        if (volumeSlider && audioEl) {
            volumeSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                audioEl.volume = val;
                if (val === 0) {
                    audioEl.muted = true;
                    muteIcon.textContent = '🔇';
                } else {
                    audioEl.muted = false;
                    muteIcon.textContent = '🔊';
                    previousVolume = val;
                }
            });
        }

        // Botón volver arriba
        const backTop = document.getElementById('back-top');
        window.addEventListener('scroll', () => {
            backTop.classList.toggle('visible', window.scrollY > 400);
        });

        // Scroll suave para navegadores que no lo soportan nativamente
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Resaltar enlace activo del navbar según sección visible
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(a => a.style.color = '');
                    const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                    if (active) active.style.color = 'var(--accent)';
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(s => observer.observe(s));
        // Timeline interactiva - fases de desarrollo
        document.querySelectorAll('.tl-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.tl-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Scroll reveal para elementos .reveal
        const revealEls = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => revealObserver.observe(el));

        // Delay escalonado en cards dentro de grids
        document.querySelectorAll('.que-es-grid .caracteristica-card, .tipos-grid .tipo-card').forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.07}s`;
        });