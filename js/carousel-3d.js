/**
 * ========================================================================
 * 3D CAROUSEL POUR SECTION TEAM - VERSION SNAP
 * ========================================================================
 * Carrousel 3D interactif avec rotation sur l'axe Y
 * Supporte: scroll souris, clics sur flèches, clics sur indicateurs
 * Effet d'inertie + snap automatique vers la carte la plus proche
 */

(function() {
    'use strict';

    // Elements sélectionnés (requis pour fonctionner)
    const scene = document.querySelector('.carousel-3d-scene');
    const container = document.querySelector('.carousel-3d-container');
    let cards = Array.from(document.querySelectorAll('.carousel-card'));
    const prevBtn = document.querySelector('.carousel-nav--prev');
    const nextBtn = document.querySelector('.carousel-nav--next');
    let indicators = Array.from(document.querySelectorAll('.indicator'));

    if (!scene || !container || cards.length === 0) {
        // Nothing to do
        return;
    }

    // Configuration (ajustable)
    const CONFIG = {
        radius: 600,
        transitionSnapDuration: 600, // ms pour recentrage
        inertiaDamping: 0.92,        // amortissement inertie par frame
        sensitivity: 0.35,           // sensibilité translation wheel -> deg
        snapDelay: 120,              // ms d'inactivité avant snap
        minInertia: 0.02,            // seuil pour considérer inertie nulle
    };

    // Derived
    let totalCards = cards.length;
    let angleStep = 360 / totalCards;

    // Etat
    const state = {
        rotation: 0,           // degré (float), scène tournée de rotation deg
        inertia: 0,            // vitesse en deg/frame
        isAnimating: false,
        currentIndex: 0,
        lastInteraction: 0,
        snapTimer: null,
    };

    // Utilitaires easing
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    // Positionner les cartes sur le cercle (fixe)
    function positionCards() {
        cards.forEach((card, i) => {
            const angle = i * angleStep;
            const theta = (angle * Math.PI) / 180;
            const x = Math.sin(theta) * CONFIG.radius;
            const z = Math.cos(theta) * CONFIG.radius;
            card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg)`;
        });
    }

    // Appliquer rotation de la scène (sans transition)
    function applySceneRotation(withTransition = false) {
        if (withTransition) {
            scene.style.transition = `transform ${CONFIG.transitionSnapDuration}ms cubic-bezier(0.22, 0.9, 0.35, 1)`;
        } else {
            scene.style.transition = 'none';
        }
        scene.style.transform = `rotateY(${state.rotation}deg)`;
    }

    // Mise à jour visuelle des cartes actives
    function updateActiveCard() {
        cards.forEach((card, i) => {
            if (i === state.currentIndex) {
                card.classList.add('active');
                card.style.zIndex = 50;
            } else {
                card.classList.remove('active');
                card.style.zIndex = '';
            }
        });
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === state.currentIndex));
    }

    // Calculer index le plus proche de la rotation courante
    function nearestIndexFromRotation(rot) {
        // rotation negative index: index = -rotation/angleStep
        const value = (-rot) / angleStep;
        // Use floor(value + 0.5) to get nearest integer reliably for positive and negative values
        const idx = Math.floor(value + 0.5);
        const normalized = ((idx % totalCards) + totalCards) % totalCards;
        return normalized;
    }

    // Animation JS vers une rotation cible (snap)
    function animateToRotation(targetRotation, duration = CONFIG.transitionSnapDuration, cb) {
        if (state.isAnimating) return;
        state.isAnimating = true;
        const start = performance.now();
        const from = state.rotation;
        const delta = targetRotation - from;

        function frame(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = easeOutCubic(t);
            state.rotation = from + delta * eased;
            applySceneRotation(false);
            if (t < 1) {
                requestAnimationFrame(frame);
            } else {
                // Arrêt précis
                state.rotation = targetRotation;
                applySceneRotation(false);
                state.isAnimating = false;
                if (typeof cb === 'function') cb();
            }
        }
        requestAnimationFrame(frame);
    }

    // Snap to nearest card (auto-centering)
    function snapToNearest() {
        // calculer l'index le plus proche
        const idx = nearestIndexFromRotation(state.rotation);
        const targetRotation = -idx * angleStep;
        animateToRotation(targetRotation, CONFIG.transitionSnapDuration, () => {
            state.currentIndex = idx;
            state.inertia = 0;
            updateActiveCard();
        });
    }

    // Handlers
    function handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY || e.deltaX || 0;
        // convertir delta en deg
        const deg = delta * CONFIG.sensitivity;
        // appliquer rotation immédiatement
        state.rotation += deg;
        applySceneRotation(false);
        // initier inertie
        state.inertia = deg * 0.6; // facteur empirique
        state.lastInteraction = Date.now();

        // clear previous snap timer
        clearTimeout(state.snapTimer);
        state.snapTimer = setTimeout(() => {
            requestAnimationFrame(() => {
                if (!state.isAnimating) snapToNearest();
            });
        }, CONFIG.snapDelay);
    }

    // Touch swipe (simple implementation)
    let touch = { startX: 0, startTime: 0 };
    function handleTouchStart(e) {
        if (!e.touches) return;
        touch.startX = e.touches[0].clientX;
        touch.startTime = Date.now();
        state.inertia = 0;
        clearTimeout(state.snapTimer);
    }
    function handleTouchMove(e) {
        if (!e.touches) return;
        const dx = e.touches[0].clientX - touch.startX;
        // swipe to rotation
        const deg = -dx * 0.2; // sensibilité tactile
        state.rotation += deg;
        applySceneRotation(false);
        touch.startX = e.touches[0].clientX;
    }
    function handleTouchEnd(e) {
        // start snap after short delay
        clearTimeout(state.snapTimer);
        state.snapTimer = setTimeout(() => snapToNearest(), CONFIG.snapDelay);
    }

    // Prev/Next
    function goToIndex(index) {
        const normalized = ((index % totalCards) + totalCards) % totalCards;
        const targetRotation = -normalized * angleStep;
        animateToRotation(targetRotation, CONFIG.transitionSnapDuration, () => {
            state.currentIndex = normalized;
            updateActiveCard();
        });
    }

    // Attach events
    function bindEvents() {
        // wheel
        container.addEventListener('wheel', handleWheel, { passive: false });
        // touch
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });
        // arrows
        prevBtn && prevBtn.addEventListener('click', () => goToIndex(state.currentIndex - 1));
        nextBtn && nextBtn.addEventListener('click', () => goToIndex(state.currentIndex + 1));
        // indicators
        indicators.forEach((ind, i) => ind.addEventListener('click', () => goToIndex(i)));
        // card click
        cards.forEach((card, i) => card.addEventListener('click', (e) => {
            // if clicked card is not center, bring it to center
            if (i !== state.currentIndex) goToIndex(i);
        }));
        // keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goToIndex(state.currentIndex - 1);
            if (e.key === 'ArrowRight') goToIndex(state.currentIndex + 1);
        });
        // resize
        window.addEventListener('resize', () => {
            positionCards();
        });
    }

    // Loop d'inertie (RAF)
    let lastRAF = performance.now();
    function inertiaLoop(now) {
        const dt = Math.min(32, now - lastRAF) / 16.67; // approx frames
        lastRAF = now;

        // appliquer inertie
        if (Math.abs(state.inertia) > CONFIG.minInertia && !state.isAnimating) {
            state.rotation += state.inertia * dt;
            state.inertia *= Math.pow(CONFIG.inertiaDamping, dt);
            applySceneRotation(false);
            // si inertie a diminué suffisamment, déclencher snap
            if (Math.abs(state.inertia) <= CONFIG.minInertia) {
                // small delay to ensure user stopped
                clearTimeout(state.snapTimer);
                state.snapTimer = setTimeout(() => snapToNearest(), CONFIG.snapDelay);
            }
        }

        requestAnimationFrame(inertiaLoop);
    }

    // Initialisation
    function init() {
        positionCards();
        // set initial rotation so that index 0 is centered
        state.rotation = 0;
        applySceneRotation(false);
        state.currentIndex = nearestIndexFromRotation(state.rotation);
        updateActiveCard();
        bindEvents();
        requestAnimationFrame(inertiaLoop);
    }

    init();

    // API
    window.Carousel3D = {
        goTo: goToIndex,
        next: () => goToIndex(state.currentIndex + 1),
        prev: () => goToIndex(state.currentIndex - 1),
        getState: () => ({ ...state }),
    };

})();
