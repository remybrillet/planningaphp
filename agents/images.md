# Agent Images — PlanningAPHP

## Rôle
Rechercher et intégrer des images professionnelles via l'API Unsplash. JAMAIS de hotlinking, TOUJOURS héberger localement.

## Inputs attendus
- Sections de l'application nécessitant des images
- Contexte : milieu hospitalier néonatal, équipe médicale

## Tâches dans l'ordre

1. **Identification des besoins** :
   - Page de connexion : image d'ambiance médicale/hospitalière
   - Dashboard : illustrations ou backgrounds subtils
   - Erreur 404 : illustration adaptée

2. **Recherche via API Unsplash** :
   - Endpoint : `https://api.unsplash.com/search/photos`
   - Header : `Authorization: Client-ID ope2rlcRXj01S6DWG6yVIm_ZIeAr2xXqBDLBSqYMQRY`
   - Mots-clés en ANGLAIS : "neonatal care", "hospital team", "medical professional", "nurse", "healthcare"
   - Sélectionner des images professionnelles et respectueuses

3. **Téléchargement et conversion** :
   - Télécharger les images en haute qualité
   - Convertir en WebP (qualité 85%)
   - Stocker dans `/public/images/`
   - Convention de nommage : `[section]-[description].webp`
   - Exemples : `login-hospital.webp`, `hero-medical-team.webp`

4. **Attributions** :
   - Créer/mettre à jour `/public/images/README.md`
   - Format : `Nom de l'image | Photographe | Lien Unsplash`
   - Mention dans les mentions légales

5. **Intégration** :
   - Utiliser next/image sur TOUTES les images
   - Alt text descriptif sur chaque image
   - Lazy loading sauf images above the fold
   - Dimensions responsive (sizes prop)

## Outputs
- Images WebP dans `/public/images/`
- Fichier d'attributions `/public/images/README.md`
- Images intégrées via next/image dans les composants

## Règles absolues
- JAMAIS de hotlinking (pas de lien direct vers Unsplash)
- TOUJOURS héberger dans /public/images/
- Convention : [section]-[description].webp
- TOUJOURS next/image (jamais <img>)
- Alt text obligatoire sur CHAQUE image
- Attributions photographes obligatoires
- Images respectueuses et professionnelles (pas de patients, pas de bébés identifiables)
- Variable : UNSPLASH_ACCESS_KEY=ope2rlcRXj01S6DWG6yVIm_ZIeAr2xXqBDLBSqYMQRY

## Exemple d'appel
```
Exécute @agents/images.md pour trouver et intégrer les images de la page de connexion.
Mots-clés suggérés : "modern hospital", "medical workspace", "healthcare professional"
```
