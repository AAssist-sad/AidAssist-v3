# AidAssist

## Vue d’ensemble du projet

**AidAssist** est une application SaaS destinée aux aidants familiaux et professionnels, facilitant la gestion quotidienne des personnes aidées.  
Elle permet de centraliser les rendez-vous médicaux, documents, procédures administratives et de coordonner plusieurs aidants.

---

## Fonctionnalités principales

- Gestion des **rendez-vous médicaux** avec rappels automatiques.
- Centralisation des **documents** (PDF, formulaires, justificatifs…).
- Suivi des **procédures administratives** (CAF, AMELI, retraite…).
- Coordination entre plusieurs **aidants** pour un même aidé.
- **Notifications et alertes** pour les tâches importantes.
- Interface **multilingue** (FR/EN) et responsive.
- Gestion des **profils aidés** et des comptes utilisateurs.

---

## Stack technique

- **Frontend** : React, TypeScript, Tailwind CSS, Vite
- **Backend / BDD** : Supabase (PostgreSQL + Auth + Realtime)
- **Gestion des états** : Context API + Hooks personnalisés
- **Routing** : React Router + Route Guards
- **Internationalisation** : i18next

---

## Structure du projet

AidAssist/
├── src
│ ├── components - Composants React réutilisables
│ │ ├── Appointments
│ │ │ └── Calendar.tsx - Composant calendrier rendez-vous
│ │ ├── Auth
│ │ │ ├── AuthLayout.tsx - Layout pages auth
│ │ │ ├── LoginForm.tsx - Formulaire connexion
│ │ │ ├── RegisterForm.tsx - Formulaire inscription
│ │ │ └── ResetPasswordForm.tsx - Réinitialisation mot de passe
│ │ ├── Dashboard
│ │ │ ├── ActivityFeed.tsx - Flux d’activités
│ │ │ ├── AppointmentCard.tsx - Carte rendez-vous
│ │ │ ├── CalendarManagement.tsx - Gestion calendrier
│ │ │ ├── InviteHelperModal.tsx - Modal invitation aidant
│ │ │ ├── NewAppointmentModal.tsx - Modal nouveau rendez-vous
│ │ │ ├── NewDocumentModal.tsx - Modal ajout document
│ │ │ ├── NewProcedureModal.tsx - Modal ajout procédure
│ │ │ ├── NotificationCenter.tsx - Centre de notifications
│ │ │ ├── PersonalizeDashboardModal.tsx - Personnalisation dashboard
│ │ │ ├── ProcedureProgress.tsx - Suivi des procédures
│ │ │ ├── QuickActions.tsx - Actions rapides
│ │ │ ├── QuickMessageModal.tsx - Modal messages rapides
│ │ │ ├── RecentDocuments.tsx - Documents récents
│ │ │ ├── StatCard.tsx - Carte statistiques
│ │ │ └── WeatherWidget.tsx - Widget météo
│ │ ├── Layout
│ │ │ ├── Footer.tsx - Pied de page
│ │ │ ├── Header.tsx - En-tête
│ │ │ └── Sidebar.tsx - Barre latérale
│ │ ├── Navigation
│ │ │ └── Breadcrumbs.tsx - Fil d’ariane
│ │ ├── Procedures
│ │ │ └── ProcedureCard.tsx - Carte procédure
│ │ ├── Profiles
│ │ │ ├── EditProfileModal.tsx - Modification profil
│ │ │ ├── InviteAidantModal.tsx - Invitation aidant
│ │ │ ├── NewProfileModal.tsx - Création profil
│ │ │ └── ProfileDetailModal.tsx - Détails profil
│ │ ├── Router
│ │ │ ├── LanguageDetector.tsx - Détection langue
│ │ │ ├── LocalizedLink.tsx - Lien multilingue
│ │ │ ├── LocalizedRouter.tsx - Router multilingue
│ │ │ └── RouteGuard.tsx - Protection routes
│ │ ├── Search
│ │ │ └── GlobalSearchModal.tsx - Recherche globale
│ │ ├── Security
│ │ │ └── PermissionGuard.tsx - Permissions utilisateurs
│ │ ├── SEO
│ │ │ └── SEOHead.tsx - SEO meta/titre
│ │ ├── Settings
│ │ │ ├── AccountManagement.tsx - Gestion compte
│ │ │ └── AidantsManagement.tsx - Gestion aidants
│ │ ├── Storage
│ │ │ └── FileUpload.tsx - Upload fichiers
│ │ └── LanguageSwitcher.tsx - Commutateur langue
│ ├── config
│ │ └── routes.ts - Définition routes
│ ├── contexts
│ │ ├── AuthContext.tsx - Contexte auth
│ │ └── LanguageContext.tsx - Contexte langue
│ ├── hooks
│ │ ├── useAidedPersons.ts - Hook personnes aidées
│ │ ├── useAppointments.ts - Hook rendez-vous
│ │ ├── useAuth.ts - Hook authentification
│ │ ├── useDocuments.ts - Hook documents
│ │ ├── useNotifications.ts - Hook notifications
│ │ ├── useProcedures.ts - Hook procédures
│ │ ├── useRouter.ts - Hook navigation
│ │ └── useStorage.ts - Hook stockage fichiers
│ ├── i18n
│ │ ├── config.ts - Config i18n
│ │ └── locales
│ │ ├── en/common.json - Traductions anglais
│ │ └── fr/common.json - Traductions français
│ ├── lib
│ │ ├── database.types.ts - Types base de données
│ │ └── supabase.ts - Connexion Supabase
│ ├── pages
│ │ ├── Appointments.tsx - Page rendez-vous
│ │ ├── Auth.tsx - Page auth
│ │ ├── Dashboard.tsx - Page dashboard
│ │ ├── Documents.tsx - Page documents
│ │ ├── index.js - Entrée application
│ │ ├── NotFound.tsx - Page 404
│ │ ├── Procedures.tsx - Page procédures
│ │ ├── Profiles.tsx - Page profils
│ │ └── Settings.tsx - Page paramètres
│ ├── services
│ │ ├── appointmentService.ts - API rendez-vous
│ │ ├── documentService.ts - API documents
│ │ └── procedureService.ts - API procédures
│ ├── types
│ │ ├── auth.ts - Types auth
│ │ └── index.ts - Types globaux
│ ├── utils
│ │ ├── common/ErrorBoundary.tsx - Gestion erreurs React
│ │ ├── realtime.ts - Fonctions temps réel
│ │ ├── seo.ts - Fonctions SEO
│ │ └── validation.ts - Fonctions validation
│ ├── App.tsx - Composant racine
│ ├── main.tsx - Point d’entrée React
│ ├── index.css - Styles globaux
│ └── vite-env.d.ts - Types Vite
├── supabase - Scripts/fonctions Supabase
├── .env - Variables d’environnement
├── package.json - Dépendances et scripts
├── tailwind.config.js - Config Tailwind CSS
├── tsconfig.json - Config TypeScript
└── README.md - Documentation projet



## Installation

```bash
# Cloner le projet
git clone https://github.com/ton-utilisateur/aidassist.git
cd aidassist

# Installer les dépendances
npm install

#  Lancer le projet en développement
npm run dev

```
**Déploiement**

1.    Le projet est optimisé pour un déploiement sur Vercel. 
2.    Assurez-vous que les variables .env sont correctement configurées pour Supabase et les clés API.

**Contribution**

1. Fork le projet
2. Crée une branche pour ta feature (git checkout -b feature/ma-feature)
3. Commit tes changements (git commit -m "Ajout d'une feature")
4. Push la branche (git push origin feature/ma-feature)
5. Ouvre une Pull