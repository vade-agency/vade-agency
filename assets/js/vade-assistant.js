// Assistante « Vade » : bulle de discussion présente sur toutes les pages.
// Elle répond aux questions fréquentes à partir des réponses ci-dessous, puis passe le relais sur WhatsApp.
// Pour changer le visage : remplacer assets/brand/vade-avatar.svg, ou régler window.VADE.avatar dans config.js.
(function () {
  const root = (document.currentScript && document.currentScript.src.replace(/assets\/js\/vade-assistant\.js.*$/, "")) || "";
  const avatar = root + ((window.VADE && window.VADE.avatar) || "assets/brand/vade-avatar.svg");
  const L = p => root + p;

  // Réponses : mots-clés recherchés dans la question, réponse, liens proposés.
  const R = [
    { k: ["bonjour", "salut", "bonsoir", "hello", "mbote"], a: "Bonjour ! Je suis Vade. Je peux vous présenter nos projets, la gestion locative ou Vade Clean Up. Que cherchez-vous ?" },
    { k: ["king", "tower", "gombe", "fleuve"], a: "The King Tower est à Gombe, au bord du fleuve. Les appartements sont proposés dès 449 000 $, avec deux formules : 20 % à la réservation puis 30 mois, ou un acompte dès 90 000 $ puis 36 mois.", l: [["Voir The King Tower", "projets/king-tower/index.html"]] },
    { k: ["modern", "park", "mcc", "limete", "meubl"], a: "Modern Park est à Limete : trois tours, appartements livrés meublés, dès 114 900 $.", l: [["Voir Modern Park", "projets/modern-park/index.html"]] },
    { k: ["cité", "cite", "jardin", "villa"], a: "La Cité-Jardin de Kinshasa propose des villas et des appartements. Vous pouvez la visiter en ligne, pièce par pièce, depuis votre téléphone.", l: [["Commencer la visite", "projets/cite-jardin/index.html"]] },
    { k: ["offre", "projet", "acheter", "achat", "appartement", "maison", "prix", "investir"], a: "Nous avons trois projets en ce moment : The King Tower (Gombe, dès 449 000 $), Modern Park (Limete, meublé, dès 114 900 $) et la Cité-Jardin (villas et appartements).", l: [["Toutes nos offres", "offres.html"]] },
    { k: ["paiement", "échelon", "echelon", "crédit", "credit", "tranche", "mensualit"], a: "Le paiement échelonné est possible selon le projet : par exemple 30 à 36 mois pour The King Tower. Nous acceptons M-Pesa, Orange Money, Airtel Money, les espèces et le virement." },
    { k: ["diaspora", "étranger", "etranger", "distance", "europe", "france", "belgique"], a: "Beaucoup de nos clients vivent à l'étranger. Nous faisons tout à distance : visite en ligne, échanges sur WhatsApp, documents envoyés, suivi du paiement." },
    { k: ["nettoy", "clean", "ménage", "menage", "chantier", "propre"], a: "Vade Clean Up nettoie les logements et bureaux : fin de chantier, remise des clés, entretien régulier. Le tarif va de 1 à 3 $ le m² selon le quartier, le type de construction et l'état du logement. Le devis est gratuit.", l: [["Demander un devis", "clean-up.html#devis"]] },
    { k: ["panne", "fuite", "quittance", "préavis", "preavis", "je suis locataire", "mon loyer", "réparation", "reparation"], a: "Vous êtes locataire d'un logement géré par Vade ? Dans l'Espace locataire, vous pouvez déclarer votre paiement, signaler une panne, demander une quittance ou donner votre préavis.", l: [["Espace locataire", "espace-locataire.html"]] },
    { k: ["gestion", "locati", "loyer", "locataire", "propriétaire", "proprietaire", "louer mon", "confier"], a: "Avec la gestion locative, nous trouvons le locataire, encaissons les loyers, organisons l'entretien et vous envoyons un rapport chaque mois.", l: [["La gestion locative", "gestion-locative.html"]] },
    { k: ["vendre", "estimation", "estimer"], a: "Vous voulez vendre ou louer votre bien ? Nous faisons une estimation gratuite et nous le présentons à nos clients.", l: [["Confier mon bien", "index.html#proprietaires"]] },
    { k: ["séjour", "sejour", "nuit", "airbnb", "court"], a: "Nous préparons une offre de séjours courts à Kinshasa. Écrivez-nous sur WhatsApp avec vos dates et nous vous proposerons un logement." },
    { k: ["rendez", "rdv", "adresse", "situé", "trouvez", "bureau", "rencontr", "horaire", "ouvert"], a: "Nous vous recevons sur rendez-vous au CTC Mall, à Gombe, du lundi au samedi. Le plus simple est de nous écrire sur WhatsApp pour fixer l'heure." },
    { k: ["contact", "téléphone", "telephone", "numéro", "numero", "whatsapp", "appeler", "mail"], a: "Vous pouvez nous joindre sur WhatsApp au +243 813 281 077, ou par e-mail à vadeagencys9@gmail.com." },
    { k: ["qui êtes", "qui est vade", "propos", "vade agency", "agence"], a: "Vade Agency est une agence immobilière de Kinshasa créée en 2024, une marque de VADE SARL. Nous accompagnons les familles, les investisseurs et la diaspora.", l: [["À propos de nous", "a-propos.html"]] },
    { k: ["merci"], a: "Avec plaisir ! N'hésitez pas si vous avez une autre question." },
  ];
  const CHIPS = ["Nos projets", "Paiement échelonné", "Vade Clean Up", "Gestion locative", "Prendre rendez-vous"];
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const answer = q => {
    const n = norm(q); let best = null, score = 0;
    for (const r of R) { const s = r.k.filter(k => new RegExp("(^|[^a-z])" + norm(k)).test(n)).length; if (s > score) { score = s; best = r; } }
    return best || { a: "Je n'ai pas la réponse à cette question, mais un conseiller peut vous répondre tout de suite sur WhatsApp.", wa: true };
  };

  const css = `
.vade-fab{position:fixed;right:16px;bottom:16px;z-index:60;display:flex;align-items:center;gap:10px;border:0;background:#0f2347;color:#fff;border-radius:999px;padding:6px 16px 6px 6px;box-shadow:0 6px 20px rgba(10,20,40,.3);font:600 15px/1 "Montserrat",system-ui,sans-serif;cursor:pointer}
.vade-fab img{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #d6b25e}
.vade-fab[hidden]{display:none}
.vade-box{position:fixed;right:16px;bottom:16px;z-index:61;width:min(380px,calc(100vw - 32px));height:min(560px,calc(100dvh - 32px));display:flex;flex-direction:column;background:var(--surface,#fff);color:var(--ink,#0f1f3d);border:1px solid var(--line,#e3ddcf);border-radius:16px;box-shadow:0 12px 40px rgba(10,20,40,.35);overflow:hidden;font-family:var(--body,system-ui,sans-serif)}
.vade-box[hidden]{display:none}
.vade-head{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0f2347;color:#fff;border-bottom:3px solid #b8892d}
.vade-head img{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid #d6b25e}
.vade-head b{display:block;font:600 16px/1.2 "Montserrat",system-ui,sans-serif}
.vade-head span{font-size:13px;color:#d6dbe8}
.vade-head .sp{flex:1}
.vade-head button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;width:36px;height:36px;border-radius:8px}
.vade-head button[aria-pressed="true"]{background:rgba(214,178,94,.25)}
.vade-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.vade-m{max-width:85%;padding:9px 12px;border-radius:14px;font-size:15px;line-height:1.45;white-space:pre-line}
.vade-m.b{align-self:flex-start;background:var(--accent-soft,#f3ecdc);border-bottom-left-radius:4px}
.vade-m.u{align-self:flex-end;background:#0f2347;color:#fff;border-bottom-right-radius:4px}
.vade-m a{display:inline-block;margin-top:6px;margin-right:8px;font-weight:600;color:var(--gold,#b8892d)}
.vade-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}
.vade-chips button{border:1px solid var(--gold,#b8892d);background:transparent;color:var(--ink,#0f1f3d);border-radius:999px;padding:6px 10px;font:600 13px/1 "Montserrat",system-ui,sans-serif;cursor:pointer}
.vade-in{display:flex;gap:6px;padding:10px;border-top:1px solid var(--line,#e3ddcf)}
.vade-in input{flex:1;min-width:0;font:16px/1.3 inherit;padding:10px 12px;border:1px solid var(--line,#e3ddcf);border-radius:10px;background:var(--bg,#f7f6f2);color:inherit}
.vade-in button{border:0;background:#b8892d;color:#0a1428;border-radius:10px;padding:0 14px;font:600 14px/1 "Montserrat",system-ui,sans-serif;cursor:pointer}
.vade-wa{display:block;text-align:center;padding:9px;font:600 14px/1.2 "Montserrat",system-ui,sans-serif;background:#1f8f4e;color:#fff;text-decoration:none}
@media print{.vade-fab,.vade-box{display:none}}`;

  function init() {
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    const fab = document.createElement("button");
    fab.className = "vade-fab"; fab.type = "button"; fab.setAttribute("aria-label", "Discuter avec Vade, l'assistante");
    fab.innerHTML = `<img src="${avatar}" alt="">Une question ?`;
    const box = document.createElement("section");
    box.className = "vade-box"; box.hidden = true; box.setAttribute("aria-label", "Discussion avec Vade");
    box.innerHTML = `<div class="vade-head"><img src="${avatar}" alt=""><div><b>Vade</b><span>Déborah · CEO Vade Agency</span></div><div class="sp"></div>
      <button type="button" class="vade-voice" aria-pressed="false" title="Lire les réponses à voix haute" aria-label="Lire les réponses à voix haute">🔈</button>
      <button type="button" class="vade-x" aria-label="Fermer">✕</button></div>
      <div class="vade-log" aria-live="polite"></div><div class="vade-chips"></div>
      <form class="vade-in"><input aria-label="Votre question" placeholder="Posez votre question…" autocomplete="off"><button type="submit">Envoyer</button></form>
      <a class="vade-wa" target="_blank" rel="noopener">Continuer avec un conseiller sur WhatsApp</a>`;
    document.body.append(fab, box);
    const log = box.querySelector(".vade-log"), input = box.querySelector("input"), wa = box.querySelector(".vade-wa"), vbtn = box.querySelector(".vade-voice");
    const history = [];
    let voice = false;
    try { voice = localStorage.getItem("vade-voice") === "1"; } catch (e) {}
    const canSpeak = "speechSynthesis" in window;
    if (!canSpeak) vbtn.hidden = true;
    const setVoice = v => { voice = v; vbtn.setAttribute("aria-pressed", v); vbtn.textContent = v ? "🔊" : "🔈"; try { localStorage.setItem("vade-voice", v ? "1" : "0"); } catch (e) {} if (!v && canSpeak) speechSynthesis.cancel(); };
    setVoice(voice);
    const speak = t => {
      if (!voice || !canSpeak) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t.replace(/\$/g, " dollars").replace(/m²/g, " mètre carré"));
      u.lang = "fr-FR"; u.rate = 1;
      const fr = speechSynthesis.getVoices().filter(v => v.lang.startsWith("fr"));
      u.voice = fr.find(v => /female|femme|amélie|amelie|audrey|marie|julie|google français/i.test(v.name)) || fr[0] || null;
      speechSynthesis.speak(u);
    };
    const updateWa = () => {
      const num = (window.VADE && window.VADE.whatsapp) || "243813281077";
      const q = history.filter(h => h.u).map(h => "• " + h.t).slice(-3).join("\n");
      wa.href = "https://wa.me/" + num + "?text=" + encodeURIComponent("Bonjour Vade Agency" + (q ? ", j'ai une question :\n" + q : ", j'ai une question."));
    };
    const add = (t, u, links) => {
      const m = document.createElement("div"); m.className = "vade-m " + (u ? "u" : "b"); m.textContent = t;
      (links || []).forEach(([txt, href]) => { const a = document.createElement("a"); a.href = L(href); a.textContent = txt + " →"; m.append(document.createElement("br"), a); });
      log.appendChild(m); log.scrollTop = log.scrollHeight; history.push({ t, u }); updateWa();
    };
    const ask = q => {
      q = q.trim(); if (!q) return; add(q, true);
      const r = answer(q);
      setTimeout(() => { add(r.a, false, r.l); speak(r.a); }, 350);
    };
    const chips = box.querySelector(".vade-chips");
    CHIPS.forEach(c => { const b = document.createElement("button"); b.type = "button"; b.textContent = c; b.onclick = () => ask(c); chips.appendChild(b); });
    let started = false;
    fab.onclick = () => {
      fab.hidden = true; box.hidden = false; input.focus({ preventScroll: true });
      if (!started) { started = true; const g = "Bonjour, je suis Vade, l'assistante de Vade Agency. Je réponds à vos questions sur nos projets, la gestion locative et Vade Clean Up."; add(g); speak(g); }
    };
    box.querySelector(".vade-x").onclick = () => { box.hidden = true; fab.hidden = false; if (canSpeak) speechSynthesis.cancel(); };
    vbtn.onclick = () => setVoice(!voice);
    box.querySelector("form").onsubmit = e => { e.preventDefault(); ask(input.value); input.value = ""; };
    updateWa();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
