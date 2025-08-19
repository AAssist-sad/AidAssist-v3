# Structure du projet

# Diagramme des composants AidAssist

```text
src
├── components                   - Composants React réutilisables
│   ├── Appointments
│   │   └── Calendar.tsx         - Composant du calendrier pour les rendez-vous
│   ├── Auth
│   │   ├── AuthLayout.tsx       - Layout pour pages d’authentification
│   │   ├── LoginForm.tsx        - Formulaire de connexion
│   │   ├── RegisterForm.tsx     - Formulaire d’inscription
│   │   └── ResetPasswordForm.tsx - Formulaire de réinitialisation de mot de passe
│   ├── Dashboard
│   │   ├── ActivityFeed.tsx     - Flux d’activités récentes
│   │   ├── AppointmentCard.tsx - Carte affichant un rendez-vous
│   │   ├── CalendarManagement.tsx - Gestion et affichage du calendrier
│   │   ├── InviteHelperModal.tsx  - Modal pour inviter un aidant
│   │   ├── NewAppointmentModal.tsx - Modal création de rendez-vous
│   │   ├── NewDocumentModal.tsx - Modal ajout de document
│   │   ├── NewProcedureModal.tsx - Modal ajout de procédure
│   │   ├── NotificationCenter.tsx - Centre de notifications
│   │   ├── PersonalizeDashboardModal.tsx - Modal personnalisation dashboard
│   │   ├── ProcedureProgress.tsx - Progression des procédures
│   │   ├── QuickActions.tsx     - Boutons/actions rapides
│   │   ├── QuickMessageModal.tsx - Modal pour messages rapides
│   │   ├── RecentDocuments.tsx - Liste documents récents
│   │   ├── StatCard.tsx        - Carte de statistiques
│   │   └── WeatherWidget.tsx   - Widget météo
│   ├── Layout
│   │   ├── Footer.tsx          - Pied de page
│   │   ├── Header.tsx          - En-tête
│   │   └── Sidebar.tsx         - Barre latérale
│   ├── Navigation
│   │   └── Breadcrumbs.tsx     - Fil d’ariane
│   ├── Procedures
│   │   └── ProcedureCard.tsx   - Carte affichant une procédure
│   ├── Profiles
│   │   ├── EditProfileModal.tsx - Modal modification profil
│   │   ├── InviteAidantModal.tsx - Modal pour inviter un aidant
│   │   ├── NewProfileModal.tsx - Modal création profil
│   │   └── ProfileDetailModal.tsx - Modal détails profil
│   ├── Router
│   │   ├── LanguageDetector.tsx - Détection langue utilisateur
│   │   ├── LocalizedLink.tsx    - Lien multilingue
│   │   ├── LocalizedRouter.tsx  - Router multilingue
│   │   └── RouteGuard.tsx       - Protection des routes
│   ├── Search
│   │   └── GlobalSearchModal.tsx - Modal recherche globale
│   ├── Security
│   │   └── PermissionGuard.tsx - Gestion permissions utilisateurs
│   ├── SEO
│   │   └── SEOHead.tsx         - Gestion SEO (meta, title)
│   ├── Settings
│   │   ├── AccountManagement.tsx - Gestion compte utilisateur
│   │   └── AidantsManagement.tsx - Gestion aidants
│   ├── Storage
│   │   └── FileUpload.tsx      - Upload de fichiers
│   └── LanguageSwitcher.tsx    - Composant pour changer langue

├── config
│   └── routes.ts               - Définition des routes de l’application

├── contexts
│   ├── AuthContext.tsx         - Contexte pour gestion authentification
│   └── LanguageContext.tsx     - Contexte pour gestion multilingue

├── hooks
│   ├── useAidedPersons.ts      - Hook pour gestion des personnes aidées
│   ├── useAppointments.ts      - Hook pour gestion des rendez-vous
│   ├── useAuth.ts              - Hook pour authentification
│   ├── useDocuments.ts         - Hook pour documents
│   ├── useNotifications.ts     - Hook pour notifications
│   ├── useProcedures.ts        - Hook pour procédures
│   ├── useRouter.ts            - Hook pour navigation
│   └── useStorage.ts           - Hook pour stockage fichiers

├── i18n
│   ├── config.ts               - Configuration i18n
│   └── locales
│       ├── en
│       │   └── common.json     - Traductions en anglais
│       └── fr
│           └── common.json     - Traductions en français

├── lib
│   ├── database.types.ts       - Types pour la base de données
│   └── supabase.ts             - Connexion et fonctions Supabase

├── pages
│   ├── Appointments.tsx        - Page rendez-vous
│   ├── Auth.tsx                - Page connexion/inscription
│   ├── Dashboard.tsx           - Page dashboard
│   ├── Documents.tsx           - Page documents
│   ├── index.js                - Entrée principale de l’application
│   ├── NotFound.tsx            - Page 404
│   ├── Procedures.tsx          - Page procédures
│   ├── Profiles.tsx            - Page profils
│   └── Settings.tsx            - Page paramètres

├── services
│   ├── appointmentService.ts   - Services API rendez-vous
│   ├── documentService.ts      - Services API documents
│   └── procedureService.ts     - Services API procédures

├── types
│   ├── auth.ts                 - Types pour authentification
│   └── index.ts                - Types globaux

├── utils
│   ├── common
│   │   └── ErrorBoundary.tsx   - Gestion erreurs React
│   ├── realtime.ts             - Fonctions temps réel
│   ├── seo.ts                  - Fonctions SEO
│   └── validation.ts           - Fonctions de validation

├── App.tsx                     - Composant racine React
├── main.tsx                    - Point d’entrée React
├── index.css                    - Styles globaux
└── vite-env.d.ts               - Types spécifiques à Vite

```
# Interactions principales
AuthContext ──> Auth components (LoginForm, RegisterForm, ResetPasswordForm)
LanguageContext ──> LanguageSwitcher + LocalizedRouter + LocalizedLink
Dashboard components ──> useAppointments, useDocuments, useProcedures, useNotifications
Pages ──> Components (ex: Dashboard.tsx utilise Dashboard/*)
Services ──> Hooks (ex: appointmentService.ts utilisé par useAppointments)
FileUpload ──> Storage + Dashboard/NewDocumentModal

## ✅ Explications rapides :

Les flèches ──> indiquent les dépendances ou flux de données.
Chaque composant majeur du Dashboard est lié à des hooks ou services correspondants.
Les contexts (Auth, Language) sont utilisés globalement par plusieurs composants.

# Structure du projet
- **src/** - Code source de l’application
    - **components/** - Composants React réutilisables
        - **Appointments/**
            - `Calendar.tsx` - Composant du calendrier pour les rendez-vous
        - **Auth/**
            - `AuthLayout.tsx` - Layout pour pages d’authentification
            - `LoginForm.tsx` - Formulaire de connexion
            - `RegisterForm.tsx` - Formulaire d’inscription
            - `ResetPasswordForm.tsx` - Formulaire de réinitialisation de mot de passe
        - **Dashboard/**
            - `ActivityFeed.tsx` - Flux d’activités récentes
            - `AppointmentCard.tsx` - Carte affichant un rendez-vous
            - `CalendarManagement.tsx` - Gestion et affichage du calendrier
            - `InviteHelperModal.tsx` - Modal pour inviter un aidant
            - `NewAppointmentModal.tsx` - Modal création de rendez-vous
            - `NewDocumentModal.tsx` - Modal ajout de document
            - `NewProcedureModal.tsx` - Modal ajout de procédure
            - `NotificationCenter.tsx` - Centre de notifications
            - `PersonalizeDashboardModal.tsx` - Modal personnalisation dashboard
            - `ProcedureProgress.tsx` - Progression des procédures
            - `QuickActions.tsx` - Boutons/actions rapides
            - `QuickMessageModal.tsx` - Modal pour messages rapides
            - `RecentDocuments.tsx` - Liste documents récents
            - `StatCard.tsx` - Carte de statistiques
            - `WeatherWidget.tsx` - Widget météo
        - **Layout/**
            - `Footer.tsx` - Pied de page
            - `Header.tsx` - En-tête
            - `Sidebar.tsx` - Barre latérale
        - **Navigation/**
            - `Breadcrumbs.tsx` - Fil d’ariane
        - **Procedures/**
            - `ProcedureCard.tsx` - Carte affichant une procédure
        - **Profiles/**
            - `EditProfileModal.tsx` - Modal modification profil
            - `InviteAidantModal.tsx` - Modal pour inviter un aidant
            - `NewProfileModal.tsx` - Modal création profil
            - `ProfileDetailModal.tsx` - Modal détails profil
        - **Router/**
            - `LanguageDetector.tsx` - Détection langue utilisateur
            - `LocalizedLink.tsx` - Lien multilingue
            - `LocalizedRouter.tsx` - Router multilingue
            - `RouteGuard.tsx` - Protection des routes
        - **Search/**
            - `GlobalSearchModal.tsx` - Modal recherche globale
        - **Security/**
            - `PermissionGuard.tsx` - Gestion permissions utilisateurs
        - **SEO/**
            - `SEOHead.tsx` - Gestion SEO (meta, title)
        - **Settings/**
            - `AccountManagement.tsx` - Gestion compte utilisateur
            - `AidantsManagement.tsx` - Gestion aidants
        - **Storage/**
            - `FileUpload.tsx` - Upload de fichiers
        - `LanguageSwitcher.tsx` - Composant pour changer langue
    - **config/**
        - `routes.ts` - Définition des routes
    - **contexts/**
        - `AuthContext.tsx` - Contexte pour gestion authentification
        - `LanguageContext.tsx` - Contexte pour gestion multilingue
    - **hooks/** - Hooks React personnalisés
        - `useAidedPersons.ts` - Gestion des personnes aidées
        - `useAppointments.ts` - Gestion des rendez-vous
        - `useAuth.ts` - Authentification
        - `useDocuments.ts` - Gestion documents
        - `useNotifications.ts` - Notifications
        - `useProcedures.ts` - Gestion procédures
        - `useRouter.ts` - Navigation
        - `useStorage.ts` - Gestion stockage fichiers
    - **i18n/** - Internationalisation
        - `config.ts` - Configuration i18n
        - **locales/**
            - **en/**
                - `common.json` - Traductions en anglais
            - **fr/**
                - `common.json` - Traductions en français
    - **lib/**
        - `database.types.ts` - Types pour la base de données
        - `supabase.ts` - Connexion et fonctions Supabase
    - **pages/**
        - `Appointments.tsx` - Page rendez-vous
        - `Auth.tsx` - Page connexion/inscription
        - `Dashboard.tsx` - Page dashboard
        - `Documents.tsx` - Page documents
        - `index.js` - Entrée principale
        - `NotFound.tsx` - Page 404
        - `Procedures.tsx` - Page procédures
        - `Profiles.tsx` - Page profils
        - `Settings.tsx` - Page paramètres
    - **services/** - Services API
        - `appointmentService.ts` - API rendez-vous
        - `documentService.ts` - API documents
        - `procedureService.ts` - API procédures
    - **types/**
        - `auth.ts` - Types pour authentification
        - `index.ts` - Types globaux
    - **utils/** - Fonctions utilitaires
        - **common/**
            - `ErrorBoundary.tsx` - Gestion erreurs React
        - `realtime.ts` - Fonctions temps réel
        - `seo.ts` - Fonctions SEO
        - `validation.ts` - Fonctions validation
    - `App.tsx` - Composant racine React
    - `main.tsx` - Point d’entrée React
    - `index.css` - Styles globaux
    - `vite-env.d.ts` - Types Vite
