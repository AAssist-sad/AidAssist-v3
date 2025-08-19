# SERVICES.md – Documentation des services API

Ce document décrit tous les **services API** utilisés dans le projet **AidAssist**, leur rôle, les fonctions principales et les interactions avec la base de données ou Supabase.

---

## Table des matières

1. [Overview](#overview)
2. [appointmentService](#appointmentservice)
3. [documentService](#documentservice)
4. [procedureService](#procedureservice)
5. [userService](#userservice)
6. [notificationService](#notificationservice)
7. [authService](#authservice)
8. [Best Practices](#best-practices)

---

## Overview

Tous les services sont placés dans **`src/services/`**.  
Ils encapsulent les appels API et la logique métier pour centraliser la communication avec la base de données (Supabase).

---

## appointmentService

**Fichier :** `appointmentService.ts`

### Fonctions principales

| Fonction | Description |
|----------|-------------|
| `getAppointments(userId: string)` | Récupère la liste des rendez-vous pour un utilisateur. |
| `createAppointment(appointment: Appointment)` | Crée un nouveau rendez-vous. |
| `updateAppointment(id: string, updates: Partial<Appointment>)` | Met à jour un rendez-vous existant. |
| `deleteAppointment(id: string)` | Supprime un rendez-vous. |

---

## documentService

**Fichier :** `documentService.ts`

### Fonctions principales

| Fonction | Description |
|----------|-------------|
| `getDocuments(userId: string)` | Récupère tous les documents d’un utilisateur. |
| `uploadDocument(file: File, meta: DocumentMeta)` | Upload d’un document vers Supabase Storage. |
| `deleteDocument(documentId: string)` | Supprime un document. |

---

## procedureService

**Fichier :** `procedureService.ts`

### Fonctions principales

| Fonction | Description |
|----------|-------------|
| `getProcedures(userId: string)` | Récupère la liste des procédures pour un utilisateur. |
| `createProcedure(procedure: Procedure)` | Crée une nouvelle procédure. |
| `updateProcedure(id: string, updates: Partial<Procedure>)` | Met à jour une procédure existante. |
| `deleteProcedure(id: string)` | Supprime une procédure. |

---

## userService

**Fichier :** `userService.ts` *(à créer si nécessaire)*

### Fonctions principales

| Fonction | Description |
|----------|-------------|
| `getUserProfile(userId: string)` | Récupère le profil utilisateur. |
| `updateUserProfile(userId: string, updates: Partial<User>)` | Met à jour le profil utilisateur. |
| `inviteAidant(email: string)` | Envoie une invitation à un aidant. |

---

## notificationService

**Fichier :** `notificationService.ts` *(optionnel)*

### Fonctions principales

| Fonction | Description |
|----------|-------------|
| `sendNotification(userId: string, message: string)` | Envoie une notification push ou in-app. |
| `getNotifications(userId: string)` | Récupère l’historique des notifications. |
| `markAsRead(notificationId: string)` | Marque une notification comme lue. |

---

## authService

**Fichier :** `authService.ts`

### Fonctions principales

| Fonction | Description |
|----------|-------------|
| `register(email: string, password: string)` | Crée un compte utilisateur. |
| `login(email: string, password: string)` | Authentifie un utilisateur. |
| `logout()` | Déconnecte l’utilisateur. |
| `resetPassword(email: string)` | Envoie un email pour réinitialiser le mot de passe. |

---

## Best Practices

- Tous les services doivent être **asynchrones** et retourner des **Promesses**.
- La logique métier spécifique (validation, filtrage) doit rester dans le service et non dans les composants.
- Tous les appels à Supabase doivent gérer les **erreurs** avec `try/catch`.
- Chaque service doit avoir un **README.md minimal** expliquant son rôle si nécessaire pour les développeurs.  
