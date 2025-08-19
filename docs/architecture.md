# Architecture d'AidAssist

## 1. Vue d'ensemble

AidAssist est une application SaaS destinée aux aidants et familles pour gérer les rendez-vous médicaux, documents administratifs, et procédures de leurs proches.  
L’architecture est modulaire et scalable pour faciliter l’ajout de fonctionnalités futures.

**Technologies principales :**
- Frontend : React, Next.js, Tailwind CSS
- Backend : Supabase (PostgreSQL, Auth, Storage, Functions)
- Notifications : OneSignal
- Déploiement : Vercel

---

## 2. Diagramme d’architecture (ASCII)

```text
               +------------------+
               |      User        |
               +------------------+
                        |
        +---------------+---------------+
        |                               |
+---------------+               +---------------+
|   Profile     |               | Authentication|
+---------------+               +---------------+
        |
+---------------+--------+----------------+
| Appointments | Documents | Procedures   |
+---------------+--------+----------------+
        |
   +------------------+
   |   Notification   |
   +------------------+
        |
   +------------------+
   |    Dashboard     |
   +------------------+
```

---

## 3. Modules principaux

### 3.1 Authentification
- Gestion des utilisateurs : inscription, connexion, réinitialisation mot de passe
- Protection des routes via `RouteGuard`
- Intégration FranceConnect

### 3.2 Gestion des profils
- Création, modification, suppression des profils de personnes aidées
- Invitation d’aidants pour la collaboration
- Vue détaillée de chaque profil avec historique

### 3.3 Rendez-vous médicaux
- Calendrier collaboratif
- Création / modification / suppression de rendez-vous
- Notifications et rappels automatiques

### 3.4 Documents et procédures
- Upload et gestion de documents (PDF, images)
- Suivi des démarches administratives
- Génération automatique de lettres et formulaires

### 3.5 Dashboard
- Widget météo, statistiques et activités récentes
- Actions rapides et notifications
- Personnalisation par l’utilisateur

### 3.6 Notifications
- Notifications push via OneSignal
- Gestion des notifications dans l’interface
- Rappels automatisés selon le calendrier

---

## 4. Structure du projet (simplifiée)
```text
/src
├── components # Composants réutilisables
├── pages # Pages principales
├── hooks # Hooks personnalisés
├── services # Appels API
├── contexts # Contextes React
├── utils # Fonctions utilitaires
├── i18n # Traductions
├── config # Config routes, API
└── lib # Connexion Supabase et types
````

---
## 5. Flux principal

L'utilisateur se connecte.

Sélection ou création d’un profil.

Gestion des rendez-vous et documents liés au profil.

Notifications et rappels envoyés aux aidants.

Visualisation via le dashboard centralisé.
## 6. Flux des données

1. L’utilisateur interagit avec le **Frontend**
2. Les actions sont envoyées via **services API** à Supabase
3. La **base de données** stocke les informations
4. Les **Fonctions / RPC Supabase** gèrent les traitements spécifiques
5. Les **notifications** sont envoyées via OneSignal
6. Le **Frontend** reçoit les données mises à jour en temps réel

---

## 7. Déploiement

- Frontend déployé sur Vercel
- Backend (Supabase) avec Auth, Storage et fonctions serveur
- Variables d’environnement sécurisées pour API Keys et base de données
- Monitoring via Supabase Studio et Vercel Analytics

---

## 8. Sécurité

- Authentification sécurisée avec JWT
- Permissions basées sur les rôles : Admin / Aidant / Famille
- Stockage sécurisé des fichiers et documents sensibles
- Communication HTTPS et API sécurisée


## Notes

- Architecture modulaire pour faciliter l'ajout de fonctionnalités.
- Chaque module peut évoluer indépendamment (ex: module IA, générateur PDF).