# CartesID BF — APK Android via GitHub

Chaque fois que des fichiers sont envoyés sur la branche `main`, GitHub construit
automatiquement l'APK (onglet **Actions**, ~5-8 min) et le publie dans **Releases**.

## Depuis un iPhone (Safari, github.com)
1. Créer un dépôt **privé** (Private) — il contiendra la clé de signature de l'APK.
2. **Add file → Upload files** : envoyer tous les fichiers de ce dossier (sauf `.github`, invisible sur iPhone).
3. **Add file → Create new file**, nom : `.github/workflows/build-apk.yml`
   (taper les `/` crée les dossiers), coller le contenu de `build-apk.yml`, puis **Commit**.
4. Onglet **Actions** → « Construire l'APK » → attendre la coche verte
   (au besoin : **Run workflow**).
5. Onglet **Releases** (page d'accueil du dépôt) → télécharger `CartesID-BF.apk`.

## Installer sur Android
Ouvrir l'APK → autoriser « sources inconnues » → Installer.
Les mises à jour s'installent par-dessus (même clé de signature, conservée dans `debug.keystore`).

## Remarques
- Les données restent sur le téléphone (stockage local de l'application).
- Les exports PDF/PNG/ZIP ouvrent le menu Android « Partager / Enregistrer »
  (voir `android-bridge.js`).
- Certaines fonctions (Word/Excel/OCR) chargent des modules depuis Internet à la demande.
- Ne rendez pas le dépôt public : `debug.keystore` permettrait à n'importe qui de signer de faux APK.
