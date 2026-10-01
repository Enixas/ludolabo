/* =========================================================
   CONFIGURATION GÉNÉRALE DU SITE
   C'est ici qu'on change les liens, l'email et les textes clés.
   ========================================================= */
window.LUDOLABO_CONFIG = {
  nom: "LudoLabo",
  slogan: "Tant de choses à tester avec des jeux de société.",

  // Réseaux sociaux (laisser "" pour masquer un réseau)
  reseaux: {
    youtube: "https://www.youtube.com/@LudoLabo",
    tiktok: "https://www.tiktok.com/@ludolabo_",
    instagram: "https://www.instagram.com/ludolabo_/",
  },

  // Pseudos affichés sous les icônes
  pseudos: {
    youtube: "@LudoLabo",
    tiktok: "@ludolabo_",
    instagram: "@ludolabo_",
  },

  // Adresse email de contact — À REMPLACER
  email: "contact@ludolabo.fr",

  // (Optionnel) Adresse d'envoi du formulaire, ex. Formspree : "https://formspree.io/f/xxxxxxx"
  // Si vide, le formulaire ouvre la messagerie du visiteur (mailto).
  formEndpoint: "",

  // (Optionnel) Chemin vers une photo de LudoLabo pour la page "Le Labo", ex. "assets/photo.jpg"
  photo: "",
};

/* Catégories de jeux = éléments du « tableau périodique du jeu ».
   Utilise le symbole (ex. "St") dans les fichiers videos.js et rapports.js. */
window.LUDOLABO_CATEGORIES = [
  { s: "St", nom: "Stratégie",   z: 1, couleur: "#2c6bd8" },
  { s: "Fa", nom: "Familial",    z: 2, couleur: "#e8a01e" },
  { s: "Co", nom: "Coopératif",  z: 3, couleur: "#13a37f" },
  { s: "Am", nom: "Ambiance",    z: 4, couleur: "#e0533d" },
  { s: "Du", nom: "Duel",        z: 5, couleur: "#1597a8" },
  { s: "Ex", nom: "Expert",      z: 6, couleur: "#7b52d3" },
  { s: "En", nom: "Enquête",     z: 7, couleur: "#4a5361" },
  { s: "As", nom: "Astuces",     z: 8, couleur: "#e8792b" },
];
