# HOOKS.md – Documentation des Hooks personnalisés

Ce document décrit tous les **hooks React personnalisés** utilisés dans le projet **AidAssist**. Chaque hook centralise une logique spécifique pour faciliter la réutilisation et la maintenance.

---

## Table des matières

1. [useAidedPersons](#useaidedpersons)
2. [useAppointments](#useappointments)
3. [useAuth](#useauth)
4. [useDocuments](#usedocuments)
5. [useNotifications](#usenotifications)
6. [useProcedures](#useprocedures)
7. [useRouter](#userouter)
8. [useStorage](#usestorage)

---

## useAidedPersons

**Chemin :** `src/hooks/useAidedPersons.ts`

**Description :**  
Gère les données des personnes aidées. Permet de récupérer, ajouter, mettre à jour ou supprimer une personne aidée.

**Fonctions principales :**
- `getAidedPersons()` – Récupère la liste des personnes aidées.
- `addAidedPerson(data)` – Ajoute une nouvelle personne aidée.
- `updateAidedPerson(id, data)` – Met à jour les informations d’une personne aidée.
- `removeAidedPerson(id)` – Supprime une personne aidée.

**Exemple d’utilisation :**
```ts
const { aidedPersons, addAidedPerson } = useAidedPersons();

addAidedPerson({ name: "Jean Dupont", age: 78 });

```

## useAppointments

**Chemin :** `src/hooks/useAppointments.ts`

**Description :**  
Gestion des rendez-vous médicaux et notifications associées.

**Fonctions principales :**
- `getAppointments(userId)` Récupère tous les rendez-vous d’un utilisateur.
- `createAppointment(data)` – Crée un nouveau rendez-vous.
- `updateAppointment(id, data)` – Met à jour un rendez-vous existant.
- `deleteAppointment(id)` – Supprime un rendez-vous.


Fonctions principales :

getAppointments(userId) – Récupère tous les rendez-vous d’un utilisateur.

createAppointment(data) – Crée un nouveau rendez-vous.

updateAppointment(id, data) – Met à jour un rendez-vous existant.

deleteAppointment(id) – Supprime un rendez-vous.

**Exemple d’utilisation :**
```ts
const { appointments, createAppointment } = useAppointments();

createAppointment({ date: "2025-09-01", personId: 1, type: "Médecin" });


```


## useAuth

**Chemin :** `src/hooks/useAuth.ts`

**Description :**  
Gère l’authentification, l’état de connexion et les rôles utilisateur.
**Fonctions principales :**
- `login(credentials)` – Connexion utilisateur.
- `logout()` – Déconnexion
- `register(data)` – Inscription d’un nouvel utilisateur.
- `currentUser` – Objet contenant les informations de l’utilisateur connecté.

## useDocuments

**Chemin :** `src/hooks/useDocuments.ts`

**Description :**  
Gestion des documents liés aux personnes aidées (upload, consultation, suppression).
**Fonctions principales :**
- `getDocuments(personId)` – Récupère les documents d’une personne aidée.
- `uploadDocument(file, personId)` – Ajoute un document.
- `deleteDocument(id)` – Supprime un document.


## useNotifications

**Chemin :** `src/hooks/useNotifications.ts`

**Description :**  
Gestion des notifications (rendez-vous, rappels, alertes).
**Fonctions principales :**
- `getNotifications()` – Récupère toutes les notifications de l’utilisateur.
- `markAsRead(id)` – Marque une notification comme lue.
- `sendNotification(data)` – Envoie une notification.



## useProcedures

**Chemin :** `src/hooks/useProcedures.ts`

**Description :**  
Gestion des procédures administratives (CAF, retraite, AMELI, etc.) pour chaque personne aidée.

**Fonctions principales :**
- `getProcedures(personId)` – Récupère toutes les procédures d’une personne.
- `addProcedure(data)` – Ajoute une procédure.
- `supdateProcedure(id, data)` – Met à jour une procédure
- `deleteProcedure(id` – Supprime une procédure.


## useRouter

**Chemin :** `src/hooks/useRouter.ts`

**Description :**  
Hook pour faciliter la navigation et les routes localisées.

**Fonctions principales :**
- `navigate(path)` – Change de route.
- `getCurrentRoute()` – Retourne la route actuelle.
- `getLocalizedPath(path, lang)` – Retourne la version localisée d’une route.


## useStorage

**Chemin :** `src/hooks/useStorage.ts`

**Description :**  
Gestion du stockage de fichiers et intégration avec Supabase Storage

**Fonctions principales :**
- `uploadFile(file, path)` – Upload d’un fichier.
- `getFileUrl(path)` – Récupère l’URL d’accès à un fichier.
- `deleteFile(path)` – Supprime un fichier.


## Notes générales

- Tous les hooks utilisent le contexte React ou Supabase pour maintenir les données à jour en temps réel.
- Les hooks sont pensés pour être réutilisables et découplés des composants UI.
- Les erreurs et exceptions sont gérées via ErrorBoundary ou try/catch dans chaque hook.