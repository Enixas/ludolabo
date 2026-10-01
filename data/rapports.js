/* =========================================================
   RAPPORTS D'EXPÉRIENCE (une fiche par jeu testé)
   ---------------------------------------------------------
   Champs :
     id          : identifiant court, sans espace ni accent (sert dans l'URL)
     numero      : numéro du rapport
     jeu         : nom du jeu
     editeur, annee, joueurs, duree, age
     categories  : symboles du tableau périodique, ex. ["Fa", "St"]
     note        : sur 10 (ex. 8.5) -> « taux de fun »
     verdict     : "valide" | "coup-de-coeur" | "a-retester" | "rejete"
     date        : "AAAA-MM-JJ"
     resume      : 1 à 2 phrases pour la carte
     hypothese, protocole, conclusion : texte
     observations, pour, contre : listes de phrases
   Les vidéos liées sont retrouvées automatiquement via le champ
   « rapport » dans videos.js.

   ⚠️ Contenus d'EXEMPLE : à remplacer par les vrais avis de LudoLabo.
   ========================================================= */
window.LUDOLABO_RAPPORTS = [
  {
    id: "azul", numero: 12, jeu: "Azul",
    editeur: "Plan B Games", annee: 2017, joueurs: "2–4", duree: "30–45 min", age: "8+",
    categories: ["Fa", "St"], note: 8.5, verdict: "coup-de-coeur", date: "2026-09-10",
    resume: "Des tuiles magnifiques, des règles en 5 minutes et une vraie tension autour de la table.",
    hypothese: "Un jeu abstrait peut-il plaire autant aux joueurs occasionnels qu'aux joueurs confirmés ?",
    protocole: "12 parties, de 2 à 4 joueurs, avec des testeurs débutants et habitués.",
    observations: [
      "Les règles sont assimilées dès le premier tour.",
      "À 2 joueurs, la partie devient très tactique.",
      "Le matériel provoque systématiquement un « waouh » à l'ouverture.",
    ],
    pour: ["Matériel superbe", "Accessible", "Parties rapides"],
    contre: ["Peut être punitif", "Interaction parfois frustrante"],
    conclusion: "Hypothèse validée : un incontournable pour toutes les ludothèques.",
  },
  {
    id: "cascadia", numero: 11, jeu: "Cascadia",
    editeur: "Lucky Duck Games", annee: 2021, joueurs: "1–4", duree: "30–45 min", age: "10+",
    categories: ["Fa", "St"], note: 8, verdict: "valide", date: "2026-08-12",
    resume: "Un puzzle naturaliste apaisant où chaque animal a ses propres exigences.",
    hypothese: "Un jeu « calme » peut-il rester captivant sur la durée ?",
    protocole: "8 parties dont 3 en solo, avec différentes cartes de score.",
    observations: [
      "Peu d'interaction, mais chacun reste concentré jusqu'au bout.",
      "Les cartes de score renouvellent beaucoup les parties.",
    ],
    pour: ["Très relaxant", "Grande rejouabilité", "Mode solo réussi"],
    contre: ["Interaction faible", "Décompte un peu long"],
    conclusion: "Validé : parfait pour une soirée tranquille.",
  },
  {
    id: "the-crew", numero: 10, jeu: "The Crew",
    editeur: "Kosmos", annee: 2019, joueurs: "2–5", duree: "20 min", age: "10+",
    categories: ["Co"], note: 9, verdict: "coup-de-coeur", date: "2026-08-27",
    resume: "Un jeu de plis coopératif où l'on communique… sans vraiment communiquer.",
    hypothese: "Peut-on coopérer efficacement avec une communication très limitée ?",
    protocole: "Campagne de 25 missions avec la même équipe de 4 testeurs.",
    observations: [
      "Les premières missions servent de tutoriel parfait.",
      "La progression de la campagne crée l'effet « encore une ! ».",
    ],
    pour: ["Campagne addictive", "Format compact", "Gros moments de tension"],
    contre: ["Moins drôle à 2", "Certaines missions frustrantes"],
    conclusion: "Coup de cœur : la preuve que la coopération n'a pas besoin de mots.",
  },
  {
    id: "dixit", numero: 9, jeu: "Dixit",
    editeur: "Libellud", annee: 2008, joueurs: "3–8", duree: "30 min", age: "8+",
    categories: ["Am", "Fa"], note: 7.5, verdict: "valide", date: "2026-07-15",
    resume: "Des illustrations oniriques et un jeu d'interprétation qui révèle vos amis.",
    hypothese: "L'imagination peut-elle se mesurer en points de victoire ?",
    protocole: "6 parties à 5 et 6 joueurs, avec des groupes qui se connaissent plus ou moins.",
    observations: [
      "Plus le groupe se connaît, plus les indices deviennent subtils.",
      "Les cartes s'usent à force d'être admirées.",
    ],
    pour: ["Illustrations sublimes", "Accessible à tous", "Idéal en famille"],
    contre: ["Dépend beaucoup du groupe", "Extensions presque indispensables"],
    conclusion: "Validé : un classique qui garde toute sa poésie.",
  },
  {
    id: "skyjo", numero: 8, jeu: "Skyjo",
    editeur: "Magilano", annee: 2015, joueurs: "2–8", duree: "30 min", age: "8+",
    categories: ["Am", "Fa"], note: 7, verdict: "valide", date: "2026-06-30",
    resume: "Le jeu de cartes qui finit dans tous les sacs de vacances.",
    hypothese: "Un jeu très simple peut-il tenir une soirée entière ?",
    protocole: "Soirée de 4 h avec 6 testeurs, aucune autre boîte autorisée.",
    observations: ["Personne n'a demandé à changer de jeu.", "Le hasard est bien présent mais accepté."],
    pour: ["Ultra simple", "Transportable", "Beaucoup de joueurs"],
    contre: ["Peu de profondeur", "Hasard élevé"],
    conclusion: "Validé : le roi des apéros ludiques.",
  },
  {
    id: "kingdomino", numero: 7, jeu: "Kingdomino",
    editeur: "Blue Orange", annee: 2016, joueurs: "2–4", duree: "15 min", age: "8+",
    categories: ["Fa"], note: 7.5, verdict: "a-retester", date: "2026-06-12",
    resume: "Des dominos, des royaumes et des choix plus malins qu'il n'y paraît.",
    hypothese: "Un jeu de 15 minutes peut-il offrir de vrais choix stratégiques ?",
    protocole: "10 parties rapides, à retester avec l'extension Age of Giants.",
    observations: ["L'ordre du tour est une mécanique brillante.", "Le décompte surprend les débutants."],
    pour: ["Très rapide", "Mécanique d'ordre du tour", "Idéal pour initier"],
    contre: ["Un peu léger pour les experts"],
    conclusion: "À retester avec l'extension pour confirmer la profondeur.",
  },
];
