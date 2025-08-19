# API AidAssist

Ce document décrit les endpoints principaux utilisés dans l'application AidAssist pour gérer les rendez-vous, documents, procédures et profils.

---

## Base URL

https://api.aidassist.com/v1


---

## Authentification

### POST `/auth/login`
Connexion d'un utilisateur.
- **Body :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response :**
```json

{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "role": "aidant"
  }
}


```

### POST `/auth/register`
Inscription d'un nouvel utilisateur.
- **Body :**
```json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}



```
- **Response :** Même format que /auth/login

### POST `/auth/reset-password`
Réinitialisation du mot de passe.
- **Body :**
```json

{
  "email": "user@example.com"
}

```


## Rendez-vous
### GET `/appointments`
Récupérer tous les rendez-vous pour un utilisateur ou une personne aidée.
- **Headers :**
```json
 Authorization: Bearer <token>
```
- **Response :**
```json

[
  {
    "id": "appointment_id",
    "title": "Rendez-vous médecin",
    "date": "2025-08-20T10:00:00Z",
    "aidedPersonId": "person_id"
  }
]
```

### POST `/appointments`
Créer un nouveau rendez-vous.

- **Body :**
```json

{
  "title": "Rendez-vous kiné",
  "date": "2025-08-22T14:00:00Z",
  "aidedPersonId": "person_id"
}

```
- **Response :** Objet du rendez-vous créé

### PUT `/appointments/{id}`
Modifier un rendez-vous existant.

### DELETE `/appointments/{id}`
Supprimer un rendez-vous.



## Documents

### GET  `/documents`
Récupérer tous les documents liés aux personnes aidées.

### POST `/documents`
Uploader un document.
- **Body :** FormData avec fichier et métadonnées

### DELETE `/documents/{id}`
Supprimer un document.



## Procédures

### GET  `/procedures`
Récupérer toutes les procédures.

### POST `/procedures`
Créer une nouvelle procédure.

### PUT `/procedures/{id}`
Mettre à jour une procédure.

### DELETE `/procedures/{id}`
Supprimer une procédure.


## Profils

### GET  `/profiles`
Récupérer les profils des personnes aidées.
### POST `/profiles`
Créer un profil.
### PUT `/profiles/{id}`
Modifier un profil existant.
### DELETE `/profiles/{id}`
Supprimer un profil.



## Notifications

### GET  `/notifications`
Récupérer toutes les notifications pour un utilisateur.
### POST `/notifications`
Créer une notification.
### PUT `/notifications/{id}`
Marquer une notification comme lue.




### Tous les endpoints nécessitent un header Authorization: Bearer <token> sauf pour l’authentification.