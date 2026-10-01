#!/usr/bin/env node
/* =========================================================
   Synchro automatique de la chaîne YouTube -> data/youtube.js
   ---------------------------------------------------------
   Lancé tout seul par GitHub Actions (voir .github/workflows).
   Peut aussi se lancer à la main :  node scripts/sync-youtube.mjs

   Deux modes :
   • AVEC clé API (variable YT_API_KEY) : récupère TOUTES les vidéos
     de la chaîne + durées + détection précise des Shorts.
   • SANS clé : flux RSS public de YouTube (les 15 dernières vidéos),
     ajoutées à celles déjà connues. Zéro configuration.
   Aucune dépendance (Node 18+).
   ========================================================= */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "data", "youtube.js");
const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UC5zeXpUlF050S2T_WMSxAGw"; // @LudoLabo
const API_KEY = process.env.YT_API_KEY || "";
const RSS_FILE = process.env.YT_RSS_FILE || ""; // pour les tests hors-ligne

/* Catégories devinées à partir du titre / description / hashtags.
   (Les symboles correspondent à LUDOLABO_CATEGORIES dans data/config.js) */
const KEYWORDS = {
  Co: ["coop", "cooperatif", "cooperation", "ensemble contre"],
  Du: ["2 joueurs", "deux joueurs", "a deux", "duel", "1v1", "1 contre 1"],
  Am: ["ambiance", "apero", "party", "soiree", "fou rire", "rigolade"],
  St: ["strategie", "strategique", "tactique", "gestion"],
  Fa: ["famille", "familial", "enfant", "kids", "pour tous"],
  Ex: ["expert", "gros jeu", "jeu complexe", "kennerspiel"],
  En: ["enquete", "deduction", "escape", "mystere", "detective"],
  As: ["astuce", "conseil", "rangement", "sleeve", "tuto", "tutoriel", "insert", "regle", "comment jouer"],
};
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/#/g, " ");
function guessCategories(...texts) {
  const t = " " + norm(texts.join(" ")) + " ";
  return Object.entries(KEYWORDS).filter(([, words]) => words.some((w) => t.includes(w))).map(([s]) => s).slice(0, 3);
}

const decode = (s) => String(s || "")
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).trim();

function isoDuration(d) { // PT1H2M3S -> secondes
  const m = String(d || "").match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
}
function fmtDuration(sec) {
  if (!sec) return "";
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} sur ${url.replace(API_KEY, "***")}\n${await r.text()}`);
  return r.json();
}

/* Un Short répond 200 sur /shorts/ID, une vidéo classique redirige. */
async function isShort(id, seconds) {
  try {
    const r = await fetch(`https://www.youtube.com/shorts/${id}`, { method: "HEAD", redirect: "manual" });
    if (r.status === 200) return true;
    if (r.status >= 300 && r.status < 400) return false;
  } catch (e) { /* réseau : on retombe sur la durée */ }
  return seconds > 0 && seconds <= 180;
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

/* ---------- Mode API (toutes les vidéos) ---------- */
async function fromApi() {
  const uploads = "UU" + CHANNEL_ID.slice(2);
  const ids = [];
  let page = "";
  do {
    const j = await getJSON(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}&key=${API_KEY}${page ? "&pageToken=" + page : ""}`);
    j.items.forEach((it) => ids.push(it.contentDetails.videoId));
    page = j.nextPageToken || "";
  } while (page);

  const details = [];
  for (let i = 0; i < ids.length; i += 50) {
    const j = await getJSON(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${ids.slice(i, i + 50).join(",")}&key=${API_KEY}`);
    details.push(...j.items);
  }
  const visible = details.filter((v) =>
    v.status?.privacyStatus === "public" && !["upcoming", "live"].includes(v.snippet?.liveBroadcastContent));

  return pool(visible, 8, async (v) => {
    const sec = isoDuration(v.contentDetails.duration);
    const court = await isShort(v.id, sec);
    return {
      titre: v.snippet.title,
      plateforme: "youtube",
      format: court ? "court" : "long",
      id: v.id,
      date: v.snippet.publishedAt.slice(0, 10),
      ...(court ? {} : { duree: fmtDuration(sec) }),
      categories: guessCategories(v.snippet.title, v.snippet.description, (v.snippet.tags || []).join(" ")),
    };
  });
}

/* ---------- Mode RSS (sans clé) ---------- */
async function fromRss() {
  const xml = RSS_FILE
    ? await readFile(RSS_FILE, "utf8")
    : await (await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`)).text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
  if (!entries.length && !/<feed/.test(xml)) throw new Error("Flux RSS illisible");
  return entries.map((e) => {
    const get = (re) => decode((e.match(re) || [])[1]);
    const id = get(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const link = (e.match(/<link[^>]+href="([^"]+)"/) || [])[1] || "";
    const titre = get(/<title>([\s\S]*?)<\/title>/);
    const desc = get(/<media:description>([\s\S]*?)<\/media:description>/);
    return {
      titre,
      plateforme: "youtube",
      format: link.includes("/shorts/") ? "court" : "long",
      id,
      date: get(/<published>([^<]+)<\/published>/).slice(0, 10),
      categories: guessCategories(titre, desc),
    };
  }).filter((v) => v.id);
}

async function readExisting() {
  try {
    const s = await readFile(OUT, "utf8");
    const m = s.match(/=\s*(\[[\s\S]*\])\s*;/);
    return m ? JSON.parse(m[1]) : [];
  } catch (e) { return []; }
}

async function main() {
  const before = await readExisting();
  let list;
  if (API_KEY) {
    console.log("Mode API : récupération de toute la chaîne…");
    list = await fromApi();
  } else {
    console.log("Mode RSS (sans clé) : 15 dernières vidéos, fusionnées avec l'existant…");
    const fresh = await fromRss();
    const map = new Map(before.map((v) => [v.id, v]));
    for (const v of fresh) map.set(v.id, { ...map.get(v.id), ...v, duree: map.get(v.id)?.duree || v.duree });
    list = [...map.values()];
  }
  list.forEach((v) => { if (!v.duree) delete v.duree; });
  list.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));

  const content = `/* FICHIER GÉNÉRÉ AUTOMATIQUEMENT par scripts/sync-youtube.mjs
   Ne pas modifier à la main : il est réécrit à chaque synchro.
   Pour corriger une vidéo (catégories, rapport, masquer), utiliser data/videos.js */
window.LUDOLABO_YOUTUBE = ${JSON.stringify(list, null, 2)};
`;
  const old = await readFile(OUT, "utf8").catch(() => "");
  if (old === content) { console.log(`Aucun changement (${list.length} vidéos).`); return; }
  await writeFile(OUT, content);
  const added = list.filter((v) => !before.some((b) => b.id === v.id));
  console.log(`✔ ${list.length} vidéos (${list.filter((v) => v.format === "long").length} longues, ${list.filter((v) => v.format === "court").length} shorts). Nouvelles : ${added.length}`);
  added.forEach((v) => console.log(`  + [${v.format}] ${v.titre}`));
}

main().catch((e) => { console.error("✖ Échec de la synchro :", e.message); process.exit(1); });
