/* =========================================================
   VIDÉOS AJOUTÉES À LA MAIN
   ---------------------------------------------------------
   ⚡ Les vidéos YouTube (longues ET shorts) arrivent TOUTES SEULES
      grâce à la synchro automatique (fichier data/youtube.js).
      Tu n'as rien à faire pour elles.

   Ici, uniquement pour :
     • les TikTok / Instagram qui ne sont pas aussi sur YouTube
     • corriger ou enrichir une vidéo YouTube (catégories, rapport)
     • masquer une vidéo

   Une ligne suffit : colle le lien + un titre.
   Plateforme, format, identifiant et date sont trouvés tout seuls.

   Champs optionnels : date "AAAA-MM-JJ", categories ["St","Fa"],
   rapport "azul", miniature "assets/image.jpg", cache true
   ========================================================= */
window.LUDOLABO_VIDEOS = [

  /* ===== TES AJOUTS ICI (exemples à décommenter) =====
  { lien: "https://www.tiktok.com/@ludolabo_/video/7412345678901234567", titre: "Mon TikTok" },
  { lien: "https://www.instagram.com/reel/C1a2B3c4D5e/", titre: "Mon reel" },

  // Compléter une vidéo YouTube déjà récupérée automatiquement :
  { lien: "https://www.youtube.com/watch?v=XXXXXXXXXXX", categories: ["Co"], rapport: "the-crew" },

  // Masquer une vidéo YouTube du site :
  { lien: "https://www.youtube.com/watch?v=XXXXXXXXXXX", cache: true },
  ===================================================== */

  // ----- Exemples de démo : ils disparaissent tout seuls dès qu'une vraie vidéo existe -----
  {
    exemple: true, titre: "On a testé 7 jeux à 2 joueurs : lequel survit au protocole ?",
    plateforme: "youtube", format: "long", id: "",
    date: "2026-09-24", duree: "18:42", categories: ["Du", "St"],
  },
  {
    exemple: true, titre: "Azul : le rapport d'expérience complet",
    plateforme: "youtube", format: "long", id: "",
    date: "2026-09-10", duree: "14:05", categories: ["Fa", "St"], rapport: "azul",
  },
  {
    exemple: true, titre: "Les jeux coopératifs qui réconcilient les familles",
    plateforme: "youtube", format: "long", id: "",
    date: "2026-08-27", duree: "21:30", categories: ["Co", "Fa"], rapport: "the-crew",
  },
  {
    exemple: true, titre: "Cascadia sous le microscope",
    plateforme: "youtube", format: "long", id: "",
    date: "2026-08-12", duree: "16:18", categories: ["Fa", "St"], rapport: "cascadia",
  },
  {
    exemple: true, titre: "5 astuces pour ranger ta ludothèque comme un pro",
    plateforme: "youtube", format: "long", id: "",
    date: "2026-07-29", duree: "11:47", categories: ["As"],
  },
  {
    exemple: true, titre: "Dixit : peut-on mesurer l'imagination ?",
    plateforme: "youtube", format: "long", id: "",
    date: "2026-07-15", duree: "13:22", categories: ["Am", "Fa"], rapport: "dixit",
  },

  {
    exemple: true, titre: "Ce jeu tient dans une poche (et il est génial)",
    plateforme: "tiktok", format: "court", id: "",
    date: "2026-09-27", categories: ["Am"], rapport: "skyjo",
  },
  {
    exemple: true, titre: "Expérience n°42 : mélanger les cartes en 3 secondes",
    plateforme: "instagram", format: "court", id: "",
    date: "2026-09-21", categories: ["As"],
  },
  {
    exemple: true, titre: "Le meilleur jeu pour 2 ? Verdict en 60 s",
    plateforme: "youtube", format: "court", id: "",
    date: "2026-09-18", categories: ["Du"],
  },
  {
    exemple: true, titre: "Kingdomino en 30 secondes chrono",
    plateforme: "tiktok", format: "court", id: "",
    date: "2026-09-12", categories: ["Fa"], rapport: "kingdomino",
  },
  {
    exemple: true, titre: "Pourquoi tout le monde triche à ce jeu",
    plateforme: "instagram", format: "court", id: "",
    date: "2026-09-05", categories: ["Am"],
  },
  {
    exemple: true, titre: "Le jeu d'enquête qui m'a retourné le cerveau",
    plateforme: "youtube", format: "court", id: "",
    date: "2026-08-30", categories: ["En", "Co"],
  },
  {
    exemple: true, titre: "3 sleeves à éviter absolument",
    plateforme: "tiktok", format: "court", id: "",
    date: "2026-08-22", categories: ["As"],
  },
];
