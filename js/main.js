/* =========================================================
   LudoLabo — script principal (aucune dépendance)
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.LUDOLABO_CONFIG || {};
  const CATS = window.LUDOLABO_CATEGORIES || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const byDate = (a, b) => (b.date || "").localeCompare(a.date || "");

  const RAPPORTS = (window.LUDOLABO_RAPPORTS || []).slice().sort(byDate);
  const CAT = Object.fromEntries(CATS.map((c) => [c.s, c]));

  /* ---------- Lecture d'un lien collé tel quel ----------
     { lien: "https://www.tiktok.com/@ludolabo_/video/74123…", titre: "…" }
     -> plateforme, format, id et date sont déduits automatiquement. */
  const IG_ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const isoDay = (ms) => new Date(ms).toISOString().slice(0, 10);
  function parseLien(v) {
    if (!v.lien) return v;
    const u = String(v.lien).trim();
    const out = { ...v };
    let m;
    if ((m = u.match(/youtube\.com\/shorts\/([\w-]{11})/))) Object.assign(out, { plateforme: "youtube", format: "court", id: m[1] });
    else if ((m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|embed\/)|youtu\.be\/)([\w-]{11})/))) Object.assign(out, { plateforme: "youtube", format: "long", id: m[1] });
    else if ((m = u.match(/tiktok\.com\/.*\/(?:video|photo)\/(\d+)/))) {
      Object.assign(out, { plateforme: "tiktok", format: "court", id: m[1] });
      try { out.date = out.date || isoDay(Number(BigInt(m[1]) >> 32n) * 1000); } catch (e) {}
    } else if ((m = u.match(/instagram\.com\/(?:[\w.]+\/)?(?:reels?|p|tv)\/([\w-]+)/))) {
      Object.assign(out, { plateforme: "instagram", format: "court", id: m[1] });
      try {
        let n = 0n;
        for (const ch of m[1].slice(0, 11)) n = n * 64n + BigInt(IG_ALPHA.indexOf(ch));
        const ms = Number((n >> 23n) + 1314220021721n);
        if (ms > 1.3e12 && ms < Date.now() + 864e5) out.date = out.date || isoDay(ms);
      } catch (e) {}
    }
    if (v.format) out.format = v.format;
    return out;
  }

  /* ---------- Fusion : YouTube automatique + ajouts manuels ---------- */
  function buildVideos() {
    const auto = (window.LUDOLABO_YOUTUBE || []).map((v) => ({ ...v }));
    const manual = (window.LUDOLABO_VIDEOS || []).map(parseLien);
    const reals = manual.filter((v) => !v.exemple);
    const byId = new Map(auto.map((v) => [v.plateforme + ":" + v.id, v]));
    const list = auto.slice();
    for (const v of reals) {
      const k = v.plateforme + ":" + v.id;
      if (v.id && byId.has(k)) Object.assign(byId.get(k), v); // complète / corrige une vidéo YouTube auto
      else list.push({ ...v, titre: v.titre || `Vidéo ${({ youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram" })[v.plateforme] || ""}` });
    }
    const final = list.length ? list : manual; // tant qu'il n'y a rien de réel, on montre les exemples
    // lien automatique vers un rapport si le nom du jeu apparaît dans le titre
    const games = RAPPORTS.map((r) => ({ r, re: new RegExp("(^|[^a-z0-9])" + norm(r.jeu).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9]|$)") }));
    for (const v of final) {
      if (v.cache) continue;
      if (!v.rapport) { const g = games.find((g) => g.re.test(norm(v.titre))); if (g) v.rapport = g.r.id; }
      if ((!v.categories || !v.categories.length) && v.rapport) {
        const r = RAPPORTS.find((r) => r.id === v.rapport); if (r) v.categories = r.categories;
      }
    }
    return final.filter((v) => !v.cache).sort(byDate);
  }
  const VIDEOS = buildVideos();

  const fmtDate = (d) => {
    if (!d) return "";
    try { return new Date(d + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }); }
    catch (e) { return d; }
  };

  /* ---------- Icônes ---------- */
  const ICON = {
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2V2h-3.4v13.4a2.9 2.9 0 1 1-2-2.7V9.2a6.3 6.3 0 1 0 5.4 6.2V8.6a8.2 8.2 0 0 0 4.8 1.5V6.8l-1-.1z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4v16l13-8z"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  };
  const PLAT = {
    youtube: { nom: "YouTube", couleur: "#ff0033" },
    tiktok: { nom: "TikTok", couleur: "#18202b" },
    instagram: { nom: "Instagram", couleur: "#d62976" },
  };
  const VERDICT = {
    "valide": { txt: "Validé", cls: "stamp-valide" },
    "coup-de-coeur": { txt: "Coup de cœur", cls: "stamp-coup" },
    "a-retester": { txt: "À retester", cls: "stamp-retester" },
    "rejete": { txt: "Rejeté", cls: "stamp-rejete" },
  };

  /* ---------- URLs vidéos ---------- */
  function videoUrl(v) {
    if (v.url) return v.url;
    const h = CFG.pseudos || {};
    if (!v.id) return (CFG.reseaux || {})[v.plateforme] || "#";
    if (v.plateforme === "youtube") return v.format === "court" ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}`;
    if (v.plateforme === "tiktok") return `https://www.tiktok.com/${h.tiktok || "@ludolabo_"}/video/${v.id}`;
    if (v.plateforme === "instagram") return `https://www.instagram.com/reel/${v.id}/`;
    return "#";
  }
  function embedUrl(v) {
    if (!v.id) return "";
    if (v.plateforme === "youtube") return `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
    if (v.plateforme === "tiktok") return `https://www.tiktok.com/embed/v2/${v.id}`;
    if (v.plateforme === "instagram") return `https://www.instagram.com/reel/${v.id}/embed/`;
    return "";
  }

  /* ---------- Composants ---------- */
  function chip(s, link) {
    const c = CAT[s]; if (!c) return "";
    const inner = `<i style="background:${c.couleur}">${esc(c.s)}</i>${esc(c.nom)}`;
    return link ? `<a class="chip" href="videos.html?cat=${encodeURIComponent(s)}">${inner}</a>` : `<span class="chip">${inner}</span>`;
  }
  function genThumb(title, cats, n) {
    const c = CAT[(cats || [])[0]] || { s: "Lu", couleur: "#13a37f" };
    return `<div class="thumb-gen" style="background-color:${c.couleur}">
      <span class="n">Échantillon n°${String(n).padStart(3, "0")}</span>
      <span class="sym">${esc(c.s)}</span>
      <span class="t">${esc(title)}</span></div>`;
  }
  function thumbInner(v, i) {
    if (v.miniature) return `<img src="${esc(v.miniature)}" alt="" loading="lazy">`;
    if (v.plateforme === "youtube" && v.id) {
      return `<img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt="" loading="lazy">`;
    }
    return genThumb(v.titre, v.categories, VIDEOS.length - i);
  }
  function platBadge(v) {
    const p = PLAT[v.plateforme] || { nom: v.plateforme };
    return `<span class="badge badge-platform" style="color:${p.couleur}">${ICON[v.plateforme] || ""}<span style="color:#18202b">${esc(p.nom)}</span></span>`;
  }

  function videoCard(v) {
    const i = VIDEOS.indexOf(v);
    const short = v.format === "court";
    return `<button type="button" class="card ${short ? "card-short" : ""}" data-video="${i}" aria-label="Lire : ${esc(v.titre)}">
      <div class="thumb">${thumbInner(v, i)}${platBadge(v)}
        ${v.duree && !short ? `<span class="badge badge-duration">${esc(v.duree)}</span>` : ""}
        <span class="play">${ICON.play}</span></div>
      <div class="card-body">
        <h3>${esc(v.titre)}</h3>
        <div class="card-meta"><time datetime="${esc(v.date)}">${fmtDate(v.date)}</time>${short ? "" : (v.categories || []).map((c) => chip(c)).join("")}</div>
      </div></button>`;
  }

  function tube(note) {
    const pct = Math.max(0, Math.min(10, Number(note) || 0)) * 10;
    return `<span class="tube" title="Taux de fun : ${note}/10"><span class="tube-bar"><i style="--v:${pct}%"></i></span><b>${String(note).replace(".", ",")}</b></span>`;
  }
  function stamp(verdict) {
    const v = VERDICT[verdict] || VERDICT.valide;
    return `<span class="stamp ${v.cls}">${v.txt}</span>`;
  }
  function reportCard(r) {
    return `<a class="report-card" href="rapport.html?id=${encodeURIComponent(r.id)}">
      <span class="num">Rapport d'expérience n°${String(r.numero).padStart(3, "0")} · ${fmtDate(r.date)}</span>
      <h3>${esc(r.jeu)}</h3>
      <div class="specs"><span>👥 ${esc(r.joueurs)}</span><span>⏱ ${esc(r.duree)}</span><span>🎂 ${esc(r.age)}</span></div>
      <p>${esc(r.resume)}</p>
      <div class="card-meta">${(r.categories || []).map((c) => chip(c)).join("")}</div>
      <div class="foot">${tube(r.note)}${stamp(r.verdict)}</div></a>`;
  }

  function elementTile(c) {
    const count = VIDEOS.filter((v) => (v.categories || []).includes(c.s)).length;
    return `<a class="element" href="videos.html?cat=${encodeURIComponent(c.s)}" style="--c:${c.couleur}">
      <span class="z"><span>${c.z}</span><span>${count} vid.</span></span>
      <span class="s">${esc(c.s)}</span>
      <span><span class="nm">${esc(c.nom)}</span><br><span class="ct">Élément ludique</span></span></a>`;
  }

  function emptyState(title, txt) {
    return `<div class="empty"><b>${esc(title)}</b>${esc(txt)}</div>`;
  }

  /* ---------- Modale vidéo ---------- */
  let modal;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("dialog");
    modal.className = "modal";
    modal.innerHTML = `<div class="modal-inner">
      <div class="modal-head"><h3></h3><button class="modal-close" type="button" aria-label="Fermer">×</button></div>
      <div class="modal-frame"></div>
      <div class="modal-foot"></div></div>`;
    document.body.appendChild(modal);
    $(".modal-close", modal).addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });
    modal.addEventListener("close", () => { $(".modal-frame", modal).innerHTML = ""; });
    return modal;
  }
  function openVideo(v) {
    const m = ensureModal();
    m.classList.toggle("vertical", v.format === "court");
    $("h3", m).textContent = v.titre;
    const src = embedUrl(v);
    $(".modal-frame", m).innerHTML = src
      ? `<iframe src="${src}" title="${esc(v.titre)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`
      : `<div class="modal-ph"><div>🧪 Vidéo d'exemple<br><br>Les vraies vidéos apparaîtront ici<br>après la première synchro YouTube.<br><br><a href="${esc(videoUrl(v))}" target="_blank" rel="noopener">Voir la chaîne ${esc((PLAT[v.plateforme] || {}).nom || "")} →</a></div></div>`;
    const rap = v.rapport && RAPPORTS.find((r) => r.id === v.rapport);
    $(".modal-foot", m).innerHTML =
      `<a class="btn" href="${esc(videoUrl(v))}" target="_blank" rel="noopener">${ICON.ext} Ouvrir sur ${esc((PLAT[v.plateforme] || {}).nom || "la plateforme")}</a>` +
      (rap ? `<a class="btn btn-yellow" href="rapport.html?id=${encodeURIComponent(rap.id)}">🧪 Rapport : ${esc(rap.jeu)}</a>` : "") +
      `<span class="mono muted" style="margin-left:auto">${fmtDate(v.date)}</span>`;
    if (typeof m.showModal === "function") m.showModal(); else window.open(videoUrl(v), "_blank");
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-video]");
    if (!b) return;
    const v = VIDEOS[Number(b.dataset.video)];
    if (v) openVideo(v);
  });

  /* ---------- Réseaux (header / footer) ---------- */
  function renderSocials() {
    const r = CFG.reseaux || {};
    const html = Object.keys(PLAT).filter((k) => r[k]).map((k) =>
      `<a href="${esc(r[k])}" target="_blank" rel="noopener" aria-label="${PLAT[k].nom}">${ICON[k]}</a>`).join("");
    $$("[data-socials]").forEach((el) => (el.innerHTML = html));

    const big = Object.keys(PLAT).filter((k) => r[k]).map((k) =>
      `<a class="social-card" href="${esc(r[k])}" target="_blank" rel="noopener">
        <span class="ico" style="background:${PLAT[k].couleur};color:#fff">${ICON[k]}</span>
        <span><b>${PLAT[k].nom}</b><span>${esc((CFG.pseudos || {})[k] || "")}</span></span></a>`).join("");
    $$("[data-socials-big]").forEach((el) => (el.innerHTML = big));
    $$("[data-yt-link]").forEach((a) => { if (r.youtube) a.href = r.youtube; });
    $$("[data-email]").forEach((a) => { a.href = "mailto:" + CFG.email; a.textContent = CFG.email; });
  }

  /* ---------- Pages ---------- */
  const pages = {
    accueil() {
      const longs = VIDEOS.filter((v) => v.format === "long");
      const courts = VIDEOS.filter((v) => v.format === "court");
      $("#stat-videos").textContent = VIDEOS.length;
      $("#stat-jeux").textContent = RAPPORTS.length;
      $("#stat-courts").textContent = courts.length;
      $("#latest-long").innerHTML = longs.slice(0, 3).map(videoCard).join("") || emptyState("Aucune vidéo", "Ajoute des vidéos dans data/videos.js");
      $("#latest-short").innerHTML = courts.slice(0, 10).map(videoCard).join("") || emptyState("Aucun short", "");
      $("#periodic").innerHTML = CATS.map(elementTile).join("");
      $("#latest-reports").innerHTML = RAPPORTS.slice(0, 3).map(reportCard).join("");
      const tick = RAPPORTS.map((r) => `<span>Rapport n°${String(r.numero).padStart(3, "0")} · ${esc(r.jeu)} · ${VERDICT[r.verdict]?.txt || ""}</span>`).join("");
      $("#ticker").innerHTML = tick + tick;
    },

    videos() {
      const params = new URLSearchParams(location.search);
      const state = {
        q: params.get("q") || "",
        format: params.get("format") || "tous",
        plat: params.get("plateforme") || "toutes",
        cats: new Set((params.get("cat") || "").split(",").filter(Boolean)),
        tri: "recent",
      };
      const input = $("#q"); input.value = state.q;
      $("#cat-filter").innerHTML = CATS.map((c) =>
        `<button type="button" data-cat="${c.s}" style="--c:${c.couleur}" aria-pressed="${state.cats.has(c.s)}"><i>${c.s}</i>${esc(c.nom)}</button>`).join("");
      $$("#seg-format button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.format === state.format));
      $("#plat").value = state.plat;

      function sync() {
        const p = new URLSearchParams();
        if (state.q) p.set("q", state.q);
        if (state.format !== "tous") p.set("format", state.format);
        if (state.plat !== "toutes") p.set("plateforme", state.plat);
        if (state.cats.size) p.set("cat", [...state.cats].join(","));
        history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
      }
      function render() {
        const q = norm(state.q);
        let list = VIDEOS.filter((v) => {
          if (state.format !== "tous" && v.format !== state.format) return false;
          if (state.plat !== "toutes" && v.plateforme !== state.plat) return false;
          if (state.cats.size && !(v.categories || []).some((c) => state.cats.has(c))) return false;
          if (q) {
            const rap = RAPPORTS.find((r) => r.id === v.rapport);
            const hay = norm([v.titre, rap && rap.jeu, ...(v.categories || []).map((c) => CAT[c]?.nom)].join(" "));
            if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
          }
          return true;
        });
        if (state.tri === "ancien") list = list.slice().reverse();
        const longs = list.filter((v) => v.format === "long");
        const courts = list.filter((v) => v.format === "court");
        $("#count").textContent = `${list.length} résultat${list.length > 1 ? "s" : ""}`;
        $("#res-long-wrap").hidden = !longs.length;
        $("#res-short-wrap").hidden = !courts.length;
        $("#res-long").innerHTML = longs.map(videoCard).join("");
        $("#res-short").innerHTML = courts.map(videoCard).join("");
        $("#res-empty").innerHTML = list.length ? "" : emptyState("Expérience non concluante", "Aucune vidéo ne correspond à ces filtres. Essaie d'en retirer un.");
        sync();
      }
      input.addEventListener("input", () => { state.q = input.value.trim(); render(); });
      $("#seg-format").addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        state.format = b.dataset.format;
        $$("#seg-format button").forEach((x) => x.setAttribute("aria-pressed", x === b));
        render();
      });
      $("#plat").addEventListener("change", (e) => { state.plat = e.target.value; render(); });
      $("#tri").addEventListener("change", (e) => { state.tri = e.target.value; render(); });
      $("#cat-filter").addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        const s = b.dataset.cat;
        state.cats.has(s) ? state.cats.delete(s) : state.cats.add(s);
        b.setAttribute("aria-pressed", state.cats.has(s));
        render();
      });
      render();
    },

    rapports() {
      const grid = $("#reports");
      const sel = $("#verdict");
      const q = $("#rq");
      function render() {
        const t = norm(q.value);
        const list = RAPPORTS.filter((r) =>
          (sel.value === "tous" || r.verdict === sel.value) &&
          (!t || norm([r.jeu, r.editeur, r.resume, ...(r.categories || []).map((c) => CAT[c]?.nom)].join(" ")).includes(t)));
        grid.innerHTML = list.map(reportCard).join("") || emptyState("Aucun rapport", "Aucune fiche ne correspond.");
        $("#rcount").textContent = `${list.length} rapport${list.length > 1 ? "s" : ""}`;
      }
      sel.addEventListener("change", render);
      q.addEventListener("input", render);
      render();
    },

    rapport() {
      const id = new URLSearchParams(location.search).get("id");
      const r = RAPPORTS.find((x) => x.id === id) || RAPPORTS[0];
      const root = $("#report");
      if (!r) { root.innerHTML = emptyState("Rapport introuvable", ""); return; }
      document.title = `${r.jeu} — Rapport d'expérience · LudoLabo`;
      const vids = VIDEOS.filter((v) => v.rapport === r.id);
      const pct = Math.max(0, Math.min(10, r.note)) / 10;
      const list = (a) => (a || []).map((x) => `<li>${esc(x)}</li>`).join("");
      root.innerHTML = `
      <p style="margin-bottom:20px"><a class="link-arrow" href="rapports.html">← Tous les rapports</a></p>
      <article class="report-sheet">
        <header class="report-top">
          <div>
            <span class="label">Rapport d'expérience n°${String(r.numero).padStart(3, "0")} · ${fmtDate(r.date)}</span>
            <h1>${esc(r.jeu)}</h1>
            <div class="card-meta">${(r.categories || []).map((c) => chip(c, true)).join("")}</div>
          </div>
          ${stamp(r.verdict)}
        </header>
        <div class="report-body">
          <aside class="report-side">
            <div class="big-gauge">
              <svg viewBox="0 0 60 120" aria-hidden="true">
                <defs><clipPath id="tb"><rect x="17" y="8" width="26" height="100" rx="13"/></clipPath>
                <linearGradient id="lq" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#13a37f"/><stop offset="1" stop-color="#f0b23a"/></linearGradient></defs>
                <g clip-path="url(#tb)"><rect x="0" y="${8 + 100 * (1 - pct)}" width="60" height="120" fill="url(#lq)"/></g>
                <rect x="17" y="8" width="26" height="100" rx="13" fill="none" stroke="currentColor" stroke-width="3"/>
                <rect x="12" y="3" width="36" height="7" rx="3" fill="currentColor"/>
                ${[0.25, 0.5, 0.75].map((k) => `<line x1="43" x2="50" y1="${8 + 100 * k}" y2="${8 + 100 * k}" stroke="currentColor" stroke-width="2"/>`).join("")}
              </svg>
              <b>${String(r.note).replace(".", ",")}</b><small>/10</small><br><small>TAUX DE FUN</small>
            </div>
            <table class="spec-table"><tbody>
              <tr><th>Joueurs</th><td>${esc(r.joueurs)}</td></tr>
              <tr><th>Durée</th><td>${esc(r.duree)}</td></tr>
              <tr><th>Âge</th><td>${esc(r.age)}</td></tr>
              <tr><th>Éditeur</th><td>${esc(r.editeur)}</td></tr>
              <tr><th>Année</th><td>${esc(r.annee)}</td></tr>
            </tbody></table>
          </aside>
          <div class="report-main">
            <section><h2><span class="step">01</span>Hypothèse</h2><p>${esc(r.hypothese)}</p></section>
            <section><h2><span class="step">02</span>Protocole</h2><p>${esc(r.protocole)}</p></section>
            <section><h2><span class="step">03</span>Observations</h2><ul>${list(r.observations)}</ul></section>
            <section><h2><span class="step">04</span>Résultats</h2>
              <div class="proscons">
                <div class="pro"><h3>✅ Réactions positives</h3><ul>${list(r.pour)}</ul></div>
                <div class="con"><h3>⚠️ Effets secondaires</h3><ul>${list(r.contre)}</ul></div>
              </div></section>
            <section><h2><span class="step">05</span>Conclusion</h2><p class="conclusion">${esc(r.conclusion)}</p></section>
          </div>
        </div>
      </article>
      ${vids.length ? `<section class="section" style="padding-bottom:0"><h2 class="sub-title">Vidéos de l'expérience <span class="mono">${vids.length} enregistrement${vids.length > 1 ? "s" : ""}</span></h2>
        <div class="grid-videos">${vids.map(videoCard).join("")}</div></section>` : ""}`;
    },

    labo() {
      if (CFG.photo) $("#about-photo").innerHTML = `<img src="${esc(CFG.photo)}" alt="Portrait de ${esc(CFG.nom)}">`;
    },

    contact() {
      const form = $("#contact-form");
      const msg = $("#form-msg");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(form));
        if (d._gotcha) return; // anti-spam
        msg.className = "form-msg";
        if (CFG.formEndpoint) {
          try {
            const res = await fetch(CFG.formEndpoint, { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(d) });
            if (!res.ok) throw new Error();
            form.reset();
            msg.textContent = "Échantillon reçu ! Réponse sous quelques jours. 🧪";
            msg.className = "form-msg ok";
          } catch (err) {
            msg.textContent = "Oups, l'expérience a échoué. Écris directement à " + CFG.email;
            msg.className = "form-msg err";
          }
        } else {
          const body = `Nom : ${d.nom}\nEmail : ${d.email}\nSociété : ${d.societe || "-"}\nObjet : ${d.objet}\n\n${d.message}`;
          location.href = `mailto:${CFG.email}?subject=${encodeURIComponent("[LudoLabo] " + d.objet + " — " + d.nom)}&body=${encodeURIComponent(body)}`;
          msg.textContent = "Ta messagerie va s'ouvrir avec le message pré-rempli.";
          msg.className = "form-msg ok";
        }
      });
    },
  };

  /* ---------- Init ---------- */
  function init() {
    const toggle = $(".nav-toggle");
    const nav = $(".nav");
    if (toggle && nav) toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    renderSocials();
    const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();
    const page = document.body.dataset.page;
    if (pages[page]) pages[page]();

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.08 });
      $$(".reveal").forEach((el) => io.observe(el));
    } else $$(".reveal").forEach((el) => el.classList.add("in"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
