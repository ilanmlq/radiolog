# Guide de contribution

## 1. Architecture de référence

Tous les nouveaux développements, que ce soit sur le **back-end** ou le **front-end**, doivent utiliser le **module Canal** comme référence principale.
Ce module sert de standard pour :
- La structure des dossiers et fichiers
- Les patterns d'implémentation
- La logique métier et technique

**Le module Canal est la référence à suivre pour tous les autres modules.**

## 2. Responsabilités d'équipe

### Propriété du code
Chaque équipe est entièrement responsable du développement et de la maintenance de son module assigné.

### Qualité collective
Au-delà des modules individuels, tous les contributeurs sont collectivement responsables de :
- Maintenir une haute qualité de code
- Améliorer continuellement les modules partagés/communs
- Veiller à la cohérence globale du projet

## 3. Workflow Git

### Branches
- **Pas de push direct sur `main`**
- Préfixer vos branches avec le nom du module (exemple : `radio/feature-name`, `conversation/fix-bug`, `member/update-logic`)

### Pull Requests
- Fusionner uniquement via pull-request sur Githepia
- **Demander systématiquement une review** avant de merger
- S'assurer que les tests passent et que le code respecte les standards

## 4. Bonnes pratiques

### Code Review
- Participer activement aux revues de code
- Vérifier l'alignement avec l'architecture de référence (module Canal)
- Donner des retours constructifs et détaillés

### Documentation
- Maintenir à jour la documentation spécifique à votre module
- Documenter les décisions techniques importantes
- Mettre à jour le README si nécessaire

### Communication
- Coordonner avec les autres équipes lors de modifications de composants communs
- Prévenir les régressions en communiquant les changements impactants
- Utiliser les pull requests pour discuter des choix d'implémentation
