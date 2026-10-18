# Site Vade Agency

Site statique (HTML, CSS, JavaScript, sans outil de build), prêt pour GitHub Pages ou tout hébergeur de fichiers.

## Pages
- `index.html` : accueil, services, projet à la une, parcours diaspora, contact WhatsApp.
- `projets/cite-jardin/` : visite guidée de la Cité-Jardin de Kinshasa (8 étapes, plan interactif, demande de visite).
- `clean-up.html` : Vade Clean Up, demande de devis.

## À régler
- Numéro WhatsApp : `assets/js/config.js`, champ `whatsapp` (chiffres seulement, ex. `243810000000`). Tant qu'il est vide, les formulaires affichent le message au lieu d'ouvrir WhatsApp.
- Droits sur les rendus 3D de la Cité-Jardin (logo du promoteur « Ideas » visible) à confirmer avant mise en ligne publique.

## Ajouter un projet
Copier `projets/cite-jardin/`, remplacer les médias dans `assets/` et le tableau `STEPS` (étapes) et `ROOMS` (pièces du plan, coordonnées en pixels de l'image du plan).

## Tester en local
`python3 -m http.server` dans ce dossier, puis ouvrir http://localhost:8000.
