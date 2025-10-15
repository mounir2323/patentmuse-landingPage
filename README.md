Projet Flare — exécution avec Vite
=================================

But
----
Transformer ce template statique (HTML/CSS/JS) pour pouvoir le lancer rapidement en mode développement et construire un build de production avec Vite.

Ce que j'ai ajouté
------------------
- `package.json` avec des scripts npm : `dev`, `build`, `preview`.

Prérequis
---------
- Node.js >= 16 (recommandé). Vérifiez avec `node -v`.
- npm (fourni avec Node.js).

Instructions (Windows PowerShell)
---------------------------------
1. Ouvrez PowerShell dans le dossier du projet (ex: `c:\Users\User\Desktop\patentMuse\flare-1.0.0`).
2. Installer les dépendances :

```powershell
npm install
```

3. Lancer le serveur de dev (ouvre un serveur local avec hot-reload) :

```powershell
npm run dev
```

4. Construire la version de production :

```powershell
npm run build
```

5. Prévisualiser le build de production (optionnel) :

```powershell
npm run preview
```

Notes et recommandations
-------------------------
- Le template est un site statique classique (HTML, CSS, jQuery, plugins). Vite sert ici comme simple serveur de développement et bundler statique.
- Actuellement, les fichiers sont référencés avec des chemins relatifs (par ex. `<link href="css/styles.css">`, `<script src="js/jquery-3.2.1.min.js">`). Vite sert le dossier racine comme racine publique, donc ces chemins fonctionneront en dev sans modification.
- Pour tirer parti des imports ES modernes (ex: importer `main.js` comme module), il faudrait modifier `index.html` et convertir certains scripts en modules (ex : remplacer les dépendances globales par npm packages ou imports). Je peux faire ces adaptations si vous voulez :
  - convertir jQuery/plugins en packages npm et importer via ES modules
  - remplacer `js/plugins.js` et `js/main.js` par un point d'entrée `src/main.js` consommant les modules
- Si vous prévoyez d'héberger sur un sous-chemin (ex: GitHub Pages), ajoutez la propriété `base` dans `vite.config.js` (je peux ajouter ce fichier si nécessaire).

Prochaines étapes possibles (je peux les effectuer) :
- Ajouter `vite.config.js` pour config spéciale (base, assetsDir, etc.).
- Convertir les scripts en modules et installer dépendances via npm (jQuery, slick, photoswipe, aos, lity, etc.).
- Nettoyer `index.html` et utiliser l'injection d'assets de Vite (ou garder les liens relatifs).

Si vous voulez que je convertisse le projet automatiquement pour utiliser des imports ES et packager les dépendances via npm, dites-moi et je ferai les changements (je pourrai aussi exécuter `npm install` si vous voulez que je teste localement — notez que le réseau est requis pour récupérer les packages).

---
Fait : initialisation de Vite (package.json) et instructions d'usage.
