# Database

MongoDB v8 avec driver Node.js v6

## Initialisation

Le fichier `mongo-init.js` contient le script d'initialisation qui sera exécuté automatiquement lors du premier démarrage du conteneur MongoDB.

**Important** : Les IDs sont générés automatiquement par MongoDB sous forme d'ObjectId. Dans l'application, ils sont convertis en strings pour faciliter leur utilisation.

## Ré-initialiser la base de données en production

Il est nécessaire d'avoir `mongosh` installé localement pour exécuter ce script.

Déplacez-vous dans le dossier `database/` et exécutez le script d'initialisation :

```bash
mongosh "mongodb://admin:password@195.15.214.143:27017/?authSource=admin&directConnection=true" < mongo-init.js
```

Remplacez `password` par le mot de passe réel de l'utilisateur `admin` pour la base de données MongoDB en production.
Demandez à un assistant de vous fournir ce mot de passe si vous ne l'avez pas.

**Attention — ce script supprime toutes les données de la base radiolog avant de la re-seeder.**

## Accès à la base de données dans le conteneur

Pour accéder au shell MongoDB dans le conteneur :

```bash
docker exec -it radiolog-mongodb mongosh -u admin -p radiolog2026 --authenticationDatabase admin
```

## Collections

- **organisations** - Organisation unique utilisant RadioLog (un seul document)
- **users** - Utilisateurs de l'application
- **events** - Événements organisés
- **canals** - Canaux radio
- **places** - Lieux/emplacements dans l'événement
- **teams** - Équipes de travail
- **members** - Membres des équipes
- **radios** - Équipements radio
- **conversations** - Conversations enregistrées
- **messages** - Messages des conversations
- **records** - Enregistrements audio
