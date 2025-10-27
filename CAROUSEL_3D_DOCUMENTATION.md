# Carrousel 3D - Section "Our Team"

## Vue d'ensemble

Le carrousel 3D affiche les 6 membres de l'équipe PatentMuse dans un effet de rotation 3D immersif. Les cartes sont disposées en cercle et tournent autour de l'axe Y, avec la carte active mise en avant au centre.

## Fonctionnalités

### ✨ Interactions

1. **Scroll de la souris** - Faites défiler avec la molette pour faire tourner le carrousel
2. **Flèches de navigation** - Cliquez sur les boutons gauche/droite
3. **Indicateurs** - Cliquez sur les points en bas pour aller directement à une carte
4. **Clavier** - Utilisez les flèches ← et → du clavier
5. **Touch/Swipe** - Sur mobile, glissez horizontalement pour naviguer
6. **Clic sur carte** - Cliquez sur n'importe quelle carte pour la centrer

### 🎯 Effet d'inertie

Le carrousel continue légèrement à tourner après un scroll, créant un mouvement naturel et fluide. L'inertie s'amortit progressivement pour un effet réaliste.

### 🎨 Effets visuels

- **Carte active** : Plus grande, plus lumineuse, bordure dorée/terracotta
- **Cartes secondaires** : Réduites, légèrement floutées, assombries
- **Glassmorphisme** : Effet de verre dépoli avec backdrop-filter
- **Animations fluides** : Transitions de 800ms avec courbe cubic-bezier
- **Ombres douces** : Box-shadow multicouche pour la profondeur
- **Hover effects** : Sur les icônes sociales et boutons de navigation

## Structure des fichiers

### HTML (index.html)

```html
<section id="team" class="s-team">
  <div class="carousel-3d-container">
    <div class="carousel-3d-scene">
      <!-- 6 cartes de membres -->
      <div class="carousel-card" data-index="0">
        <div class="team-card">
          <div class="team-card__photo">
            <img src="images/team/member-1.jpg" alt="...">
          </div>
          <h3 class="team-card__name">...</h3>
          <p class="team-card__role">...</p>
          <p class="team-card__bio">...</p>
          <div class="team-card__social">
            <a href="..."><i class="fab fa-linkedin"></i></a>
            <a href="..."><i class="fas fa-envelope"></i></a>
          </div>
        </div>
      </div>
    </div>
    <!-- Navigation + Indicateurs -->
  </div>
</section>
```

### CSS (custom-fixes.css)

**Variables clés** :
- `.carousel-3d-container` : Perspective 3D (2000px), hauteur 650px
- `.carousel-card` : Dimensions 380x520px, transitions 800ms
- `.team-card` : Glassmorphisme avec backdrop-filter blur(20px)
- `.active` : Brightness 1.2, aucun flou, échelle 1.0
- `.inactive` : Brightness 0.6, blur 2px, échelle 0.85

**Responsive** :
- 1200px : Réduit à 340x480px
- 900px : Réduit à 300x440px, perspective 1500px
- 600px : Réduit à 280x420px, perspective 1000px

### JavaScript (carousel-3d.js)

**Configuration** :
```javascript
const CONFIG = {
  totalCards: 6,
  radius: 600,           // Rayon du cercle 3D
  angleStep: 60,         // 360 / 6 = 60°
  transitionDuration: 800,
  inertiaFactor: 0.95,   // Amortissement
  scrollThreshold: 50,   // Seuil de déclenchement
};
```

**Fonctions principales** :
- `positionCards()` : Calcule la position 3D de chaque carte sur le cercle
- `rotateTo(index)` : Rotation vers un index spécifique
- `rotateBy(delta)` : Rotation relative (±1)
- `handleWheel(e)` : Gestion du scroll avec accumulation
- `startInertiaLoop()` : Boucle d'animation d'inertie
- `updateActiveCard()` : Met à jour les classes CSS

**API publique** (pour debugging) :
```javascript
window.Carousel3D.goTo(3);           // Aller à la carte 3
window.Carousel3D.next();            // Carte suivante
window.Carousel3D.prev();            // Carte précédente
window.Carousel3D.getState();        // État actuel
window.Carousel3D.startAutoRotation(5000); // Auto-rotation
```

## Personnalisation

### Modifier le nombre de cartes

1. Changer `CONFIG.totalCards` dans `carousel-3d.js`
2. Ajuster `CONFIG.angleStep = 360 / totalCards`
3. Ajouter/supprimer les `<div class="carousel-card">` dans le HTML
4. Ajouter/supprimer les `<span class="indicator">` correspondants

### Modifier le rayon du cercle

```javascript
CONFIG.radius = 800; // Plus grand = cartes plus espacées
```

### Modifier la vitesse d'animation

```javascript
CONFIG.transitionDuration = 1200; // Plus lent (en ms)
```

### Modifier l'effet d'inertie

```javascript
CONFIG.inertiaFactor = 0.9;  // Inertie plus rapide (0.8-0.99)
CONFIG.scrollThreshold = 30; // Plus sensible au scroll
```

### Activer la rotation automatique

Ajouter à la fin de `carousel-3d.js` :
```javascript
window.Carousel3D.startAutoRotation(4000); // Toutes les 4 secondes
```

## Couleurs et style

Le carrousel utilise les couleurs de la charte PatentMuse :

- **Background des cartes** : Glassmorphisme transparent
- **Bordures** : `rgba(138, 79, 52, 0.6)` (terracotta)
- **Carte active** : `var(--color-2)` (#8A4F34)
- **Texte principal** : `var(--color-1)` (#F3F3F2 - beige)
- **Rôle/titre** : `var(--color-2)` (terracotta)
- **Bio** : `rgba(243, 243, 242, 0.8)` (beige transparent)

### Modifier les couleurs

Dans `custom-fixes.css` :
```css
.team-card__photo {
  border: 4px solid rgba(138, 79, 52, 0.6); /* Bordure photo */
}

.carousel-card.active .team-card__photo {
  border-color: var(--color-2); /* Bordure active */
}

.carousel-nav {
  background: rgba(138, 79, 52, 0.8); /* Boutons navigation */
}
```

## Performance

### Optimisations appliquées

1. **Hardware acceleration** : `transform: translate3d()` et `rotateY()`
2. **will-change** : Implicite via `transform-style: preserve-3d`
3. **Throttling** : Accumulation du scroll avant rotation
4. **RequestAnimationFrame** : Pour la boucle d'inertie
5. **Passive listeners** : Sur touch events
6. **Debouncing** : Sur resize (250ms)

### Sur mobile

- Les animations sont préservées (pas de réduction de durée)
- Perspective réduite pour meilleure visibilité
- Taille des cartes adaptée
- Touch events optimisés avec passive: true

## Accessibilité

- **ARIA labels** : Sur tous les boutons et liens
- **Focus visible** : Outline sur tous les éléments interactifs
- **Keyboard navigation** : Flèches gauche/droite
- **Alt text** : Sur toutes les images
- **Indicateurs** : Navigation alternative claire

## Browser Support

- **Chrome/Edge** : ✅ Full support
- **Firefox** : ✅ Full support
- **Safari** : ✅ Full support (avec préfixe -webkit-)
- **Mobile browsers** : ✅ Full support avec touch events

**Note** : Le `backdrop-filter` nécessite Safari 9+ ou Chrome 76+.

## Dépannage

### Le carrousel ne s'affiche pas

1. Vérifier que `carousel-3d.js` est chargé après le DOM
2. Ouvrir la console : un message "Carousel 3D initialized" doit apparaître
3. Vérifier que les 6 cartes ont un `data-index` de 0 à 5

### Les cartes ne tournent pas

1. Vérifier que `.carousel-3d-scene` a `transform-style: preserve-3d`
2. Vérifier qu'aucun CSS externe n'override les transformations
3. Tester dans la console : `window.Carousel3D.next()`

### L'effet d'inertie est trop fort/faible

Ajuster dans `carousel-3d.js` :
```javascript
CONFIG.inertiaFactor = 0.92;  // Valeur entre 0.8 et 0.99
CONFIG.scrollThreshold = 40;   // Valeur entre 20 et 100
```

### Les images ne s'affichent pas

1. Placer les fichiers `member-1.jpg` à `member-6.jpg` dans `/images/team/`
2. Vérifier les chemins dans le HTML
3. Les images ont un `onerror` qui masque l'image si elle manque

## Améliorations futures

### Idées d'extensions

1. **Mode grid** : Basculer entre carrousel 3D et grille
2. **Filtres** : Filtrer par rôle/département
3. **Modal détaillé** : Clic sur carte = popup avec plus d'infos
4. **Animations de transition** : Effet parallaxe lors de la rotation
5. **Lazy loading** : Charger les images au besoin
6. **Video background** : Remplacer la photo par une courte vidéo

### Performance avancée

- Utiliser Intersection Observer pour ne charger que les cartes visibles
- Preload des images critiques
- WebP avec fallback JPEG
- Compression d'images optimisée

## Maintenance

Pour ajouter un nouveau membre :

1. Ajouter une nouvelle `<div class="carousel-card" data-index="6">` dans le HTML
2. Ajouter `<span class="indicator" data-slide="6"></span>`
3. Mettre `CONFIG.totalCards = 7` et `CONFIG.angleStep = 51.43` (360/7)
4. Ajouter l'image `member-7.jpg` dans `/images/team/`

Pour modifier un membre existant :

1. Modifier le contenu de la carte correspondante dans `index.html`
2. Remplacer l'image dans `/images/team/`
3. Mettre à jour les liens LinkedIn/email

## Crédits

- **Design** : Inspiré par Apple Card Carousel et Dribbble trends 2025
- **Effet glassmorphism** : CSS backdrop-filter
- **Animations** : CSS transforms 3D + vanilla JavaScript
- **Icons** : Font Awesome 5

---

**Version** : 1.0.0  
**Date** : 27 octobre 2025  
**Auteur** : GitHub Copilot pour PatentMuse
