# LudoLabo — site web

Site statique (HTML/CSS/JS, aucune dépendance, aucun build). Il fonctionne même en double-cliquant sur `index.html`.

## Structure

```
index.html      Accueil
videos.html     Toutes les vidéos + recherche et filtres
rapports.html   Liste des rapports d'expérience
rapport.html    Une fiche (rapport.html?id=azul)
labo.html       À propos
contact.html    Contact / partenariats
data/
  config.js     ← liens réseaux, email, photo
  youtube.js    ← rempli AUTOMATIQUEMENT (ne pas toucher)
  videos.js     ← ajouts manuels (TikTok/Insta, corrections)
  rapports.js   ← LES FICHES DE JEUX
scripts/sync-youtube.mjs        Robot de synchro YouTube
.github/workflows/sync-youtube.yml   Planification (toutes les 3 h)
css/style.css   Design
js/main.js      Fonctionnement
assets/         Logo, image de partage
```

**Les vidéos YouTube se mettent à jour toutes seules.** À la main, on ne touche qu'à `data/videos.js` (rarement), `data/rapports.js` et `data/config.js`.

## Les vidéos : 100 % automatique pour YouTube

**Les vidéos YouTube (longues et Shorts) arrivent toutes seules sur le site.**
Toutes les 3 heures, un robot gratuit (GitHub Actions) va voir la chaîne @LudoLabo et met à jour `data/youtube.js`. Le site se redéploie ensuite tout seul.

Le robot fait tout seul :
- le tri entre vidéo longue et Short ;
- la miniature, la date et la durée ;
- les catégories, devinées à partir du titre, de la description et des hashtags (`#coop`, `#2joueurs`, `#astuce`…) ;
- le lien vers la fiche quand le nom d'un jeu présent dans `rapports.js` apparaît dans le titre (« Azul : mon avis » → fiche Azul).

Les vidéos d'exemple disparaissent dès que la première vraie vidéo est récupérée.

### TikTok / Instagram / corrections → `data/videos.js`
Si ses TikTok et reels sont aussi publiés en Shorts YouTube, **il n'y a rien à faire** : ils sont déjà sur le site.
Pour un contenu publié uniquement sur TikTok ou Instagram, il suffit d'**une ligne** contenant le lien collé tel quel :

```js
{ lien: "https://www.tiktok.com/@ludolabo_/video/7412345678901234567", titre: "Mon TikTok" },
{ lien: "https://www.instagram.com/reel/C1a2B3c4D5e/", titre: "Mon reel" },
```
La plateforme, le format et la date sont déduits directement du lien.

Corriger ou masquer une vidéo YouTube récupérée automatiquement :
```js
{ lien: "https://www.youtube.com/watch?v=XXXXXXXXXXX", categories: ["Co"], rapport: "the-crew" },
{ lien: "https://www.youtube.com/watch?v=XXXXXXXXXXX", cache: true },
```

### Option : récupérer TOUT l'historique de la chaîne
Sans réglage, le robot lit le flux public de YouTube, qui ne contient que les **15 dernières vidéos** (elles s'accumulent ensuite au fil du temps).
Pour importer d'un coup toutes les anciennes vidéos, avec leur durée :
1. Sur https://console.cloud.google.com : créer un projet, activer **YouTube Data API v3**, puis *Identifiants → Créer une clé API* (gratuit).
2. Sur GitHub, dans le dépôt : *Settings → Secrets and variables → Actions → New repository secret*. Nom : `YT_API_KEY`, valeur : la clé.
3. *Actions → Synchro YouTube → Run workflow* pour lancer la première synchro tout de suite.

On peut aussi lancer la synchro à la main sur un ordinateur : `node scripts/sync-youtube.mjs`.

## Ajouter un rapport

Copier un bloc dans `data/rapports.js`. Le champ `id` (sans espace ni accent) donne l'adresse de la fiche : `rapport.html?id=mon-jeu`.
Verdicts possibles : `valide`, `coup-de-coeur`, `a-retester`, `rejete`.

## Formulaire de contact

Par défaut, il ouvre la messagerie du visiteur vers l'email de `config.js`.
Pour recevoir les messages directement : créer un formulaire gratuit sur https://formspree.io, puis coller l'adresse obtenue dans `formEndpoint` de `config.js`.

## Mise en ligne (gratuit) + nom de domaine

La synchro automatique a besoin que le site soit sur **GitHub**. Le duo recommandé est **GitHub + Netlify**.

1. **GitHub** : créer un dépôt vide `ludolabo` sur https://github.com/new (sans README), puis envoyer le dossier :
   ```bash
   cd ~/Developer/Project/Web/ludolabo
   git init -b main && git add . && git commit -m "Site LudoLabo"
   git remote add origin https://github.com/<ton-pseudo>/ludolabo.git
   git push -u origin main
   ```
   Ensuite, sur GitHub :
   - *Add file → Create new file*, nommé `.github/workflows/sync-youtube.yml`, coller le contenu de `scripts/workflow-github.yml`, puis *Commit*. Faire ensuite `git pull` sur le Mac.
   - *Settings → Actions → General → Workflow permissions* : cocher **Read and write permissions**.
   - *Actions → Synchro YouTube → Run workflow* pour lancer la première synchro.
   > Le robot fait ses propres commits : **toujours faire `git pull` avant de modifier le site**.
2. **Netlify** : sur https://app.netlify.com, choisir *Add new site → Import from Git → GitHub*, puis le dépôt. Pas de commande de build, dossier de publication : `/`. À chaque nouvelle vidéo récupérée par le robot, Netlify remet le site à jour tout seul.
3. **Nom de domaine** : dans Netlify, *Domain management → Add a domain* (par ex. `ludolabo.fr`). Chez le registrar (OVH, Gandi, Namecheap…), ajouter les enregistrements DNS indiqués par Netlify. Le HTTPS est automatique.

> ℹ️ GitHub met en pause les tâches planifiées d'un dépôt resté 60 jours sans aucune modification. Tant que LudoLabo publie, le robot fait lui-même des modifications et reste actif. Sinon, il suffit de cliquer sur *Enable workflow* dans l'onglet Actions.

## Personnaliser
- Couleurs : début de `css/style.css` (variables `--lab`, `--red`, `--yellow`…). Le mode sombre suit automatiquement le réglage de l'appareil.
- Catégories : `LUDOLABO_CATEGORIES` dans `data/config.js`.
- Textes de la page À propos : `labo.html`.
- Logo : remplacer `assets/logo.svg`.
