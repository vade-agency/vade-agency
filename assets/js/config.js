// Réglages à remplir par Vade Agency.
window.VADE = {
  // Numéro WhatsApp Business au format international, chiffres seulement (ex. "243810000000").
  whatsapp: "243813281077",
};

// Ouvre WhatsApp avec un message prérempli, ou affiche le message si le numéro n'est pas encore réglé.
window.vadeSend = function (message, outEl) {
  const num = (window.VADE.whatsapp || "").replace(/\D/g, "");
  if (num) {
    window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(message), "_blank", "noopener");
    if (outEl) { outEl.hidden = false; outEl.textContent = "WhatsApp s'ouvre avec votre demande. Envoyez le message pour la confirmer."; }
  } else if (outEl) {
    outEl.hidden = false;
    outEl.textContent = message + "\n\n(Le numéro WhatsApp de Vade n'est pas encore configuré.)";
  }
};

// Ferme le menu « Nos offres » quand on clique ailleurs.
document.addEventListener("click", e => {
  document.querySelectorAll("details.menu[open]").forEach(d => { if (!d.contains(e.target)) d.open = false; });
});

// Charge l'assistante « Vade » sur toutes les pages qui utilisent ce fichier.
(function () {
  const me = document.currentScript; if (!me) return;
  const s = document.createElement("script");
  s.src = me.src.replace(/config\.js(\?.*)?$/, "vade-assistant.js"); s.defer = true;
  document.head.appendChild(s);
})();
