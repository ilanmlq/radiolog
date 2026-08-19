# RadioLog - Atelier logiciel

Application de gestion de communications radio pour organisations et équipes.

Frontend: https://radiolog.tech
Backend: https://api.radiolog.tech

Dépôt: https://puun.ch/atelier-git

## Contenu de cours

https://puun.ch/atelier

## Rôles et responsabilités

https://puun.ch/atelier-roles

## Structure du projet

Le projet est organisé en plusieurs composants distincts :

- **`backend/`** - API REST en TypeScript avec Express, MongoDB v8
- **`frontend/`** - Interface utilisateur en React avec Vite, Radix UI et TanStack Table
- **`docker/`** - Configuration Docker Compose pour l'orchestration des services
- **`database/`** - Scripts et dumps SQL pour la base de données
- **`recorder/`** - Service Python pour l'enregistrement audio et upload vers un bucket Swift
- **`auth/`** - scripts pour importer les utilisateurs et les rôles dans Auth0

## Prérequis

1. **Docker et Docker Compose** - Installation requise pour exécuter le projet
2. **Fichiers .env** - Configurer les variables d'environnement nécessaires (https://puun.ch/atelier-env) :
   - `backend/.env` pour la configuration du serveur API
   - `frontend/.env` pour la configuration de l'application React
   - `recorder/.env` pour la configuration du service d'enregistrement
3. **Fichier CONTRIBUTE.md** - Lire les conventions de contribution avant de commencer

## Démarrage avec Docker

### Lancer le projet

Construire les images et démarrer les conteneurs en mode watch (rechargement automatique) :

```bash
docker-compose up --watch --build
```

### Arrêter les conteneurs

```bash
docker-compose stop
```

### Redémarrer complètement

```bash
docker-compose down && docker-compose up --watch --build
```

### Nettoyer l'espace disque

Supprimer les images, conteneurs et volumes inutilisés :

```bash
docker system prune -a --volumes -f
```

> **Note** : Si vous avez déjà installé les dépendances localement, supprimez les dossiers `node_modules` dans `backend/` et `frontend/` avant le premier lancement avec Docker.

## Accès aux services

| Service   | URL                       | Description           |
| --------- |---------------------------|-----------------------|
| Frontend  | http://localhost:3001/    | Interface utilisateur |
| Backend   | http://localhost:3000/    | API REST              |
| Database  | mongodb://localhost:27017 | MongoDB v8            |

## Backend

**Technologies** : Node.js, TypeScript, Express, Zod (validation), MongoDB v8

### Routes API principales

L'API expose les endpoints suivants sous le préfixe `/api` :

- **`/organisations`** - Gestion des organisations
- **`/teams`** - Gestion des équipes
- **`/members`** - Gestion des membres d'équipes
- **`/events`** - Gestion des événements
- **`/canals`** - Gestion des canaux de communication
- **`/records`** - Gestion des enregistrements audio
- **`/conversations`** - Gestion des conversations
- **`/places`** - Gestion des lieux
- **`/radios`** - Gestion des équipements radio
- **`/healthcheck`** - Vérification de l'état du service

### Middlewares

- **Authentification** : OAuth2 JWT avec Auth0
- **Gestion d'erreurs** : Handler centralisé
- **Validation** : Schémas Zod pour les requêtes
- **Permissions** : Contrôle d'accès par rôle

## Frontend

**Technologies** : React, TypeScript, Vite, Radix UI, React Router, Axios, TanStack Table

L'interface utilise Radix UI pour les composants accessibles et une architecture modulaire avec :
- Composants réutilisables dans `components/`
- Hooks personnalisés (auth, API, responsive)
- Layouts pour la structure des pages
- Modules métier organisés par fonctionnalité
- Pages pour les différentes vues de l'application

Documentation Radix UI : https://www.radix-ui.com/

## Recorder

Service Python pour l'enregistrement et l'archivage audio :

- **Stockage** : Upload des fichiers audio vers un bucket Swift (OpenStack Object Storage)
- **Notification** : Appel automatique de l'API backend via `POST /api/records`
- **Dépendances** : python-swiftclient, python-dotenv

## Database

MongoDB v8 avec driver Node.js v6. Les scripts d'initialisation et les dumps de données sont disponibles dans le dossier `database/`.

## Déploiement

Le déploiement est effectué automatiquement par CI/CD avec Dokploy sur un VPS: http://195.15.214.143:3000