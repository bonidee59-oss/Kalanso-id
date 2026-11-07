/* Pont Android : dans l'APK, les téléchargements « blob: » / « data: » (PDF, PNG, ZIP)
   ne fonctionnent pas dans la WebView. On les redirige vers le menu « Partager /
   Enregistrer » d'Android. Sans effet dans un navigateur normal. */
(function () {
  var cap = window.Capacitor;
  var native = cap && ((cap.isNativePlatform && cap.isNativePlatform()) ||
                       (cap.getPlatform && cap.getPlatform() === 'android'));
  if (!native) return;

  function toBase64(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onloadend = function () { resolve(String(r.result).split(',')[1] || ''); };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  function saveAndShare(name, blob) {
    var P = cap.Plugins || {};
    if (!P.Filesystem || !P.Share) throw new Error('plugins Filesystem/Share absents');
    var safe = String(name || 'fichier').replace(/[\\\/:*?"<>|]+/g, '_');
    return toBase64(blob).then(function (b64) {
      return P.Filesystem.writeFile({ path: safe, data: b64, directory: 'CACHE' });
    }).then(function (res) {
      return P.Share.share({ title: safe, url: res.uri, dialogTitle: 'Enregistrer ou partager' });
    });
  }

  var originalClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    var a = this, href = a.href || '';
    if (a.hasAttribute('download') && (href.indexOf('blob:') === 0 || href.indexOf('data:') === 0)) {
      fetch(href).then(function (r) { return r.blob(); })
        .then(function (b) { return saveAndShare(a.getAttribute('download'), b); })
        .catch(function (e) {
          if (e && /cancel|dismiss/i.test(String(e.message || e))) return;
          alert('Export impossible : ' + (e && e.message ? e.message : e));
        });
      return;
    }
    return originalClick.apply(this, arguments);
  };
})();
