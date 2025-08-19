# CONTRIBUTING.md – Guide de contribution

Merci de votre intérêt pour contribuer à **AidAssist** ! Ce document explique les règles, bonnes pratiques et étapes pour participer au projet.

---

## Table des matières

1. [Code of Conduct](#code-of-conduct)
2. [Comment contribuer](#comment-contribuer)
3. [Workflow Git](#workflow-git)
4. [Normes de code](#normes-de-code)
5. [Tests](#tests)
6. [Documentation](#documentation)
7. [Communication](#communication)

---

## Code of Conduct

- Soyez respectueux et constructif dans toutes les discussions.
- Toute discrimination ou langage offensant est interdit.
- Les contributions doivent viser la qualité, la maintenabilité et la sécurité du code.

---

## Comment contribuer

1. **Signaler un bug**
    - Ouvrir un ticket dans **Issues** avec description détaillée et étapes pour reproduire le bug.

2. **Proposer une fonctionnalité**
    - Ouvrir un ticket **Feature Request** avec le cas d’usage et la valeur ajoutée.

3. **Soumettre une Pull Request (PR)**
    - Forker le projet et créer une branche dédiée (`feature/nom-feature` ou `fix/nom-bug`).
    - Commiter les modifications avec des messages clairs.
    - Vérifier que le code compile et que les tests passent.
    - Ouvrir une PR vers la branche `main` et décrire vos changements.

---

## Workflow Git

- Utilisation de **GitFlow simplifié** :
    - `main` → version stable en production
    - `develop` → version en cours de développement
    - `feature/*` → nouvelles fonctionnalités
    - `fix/*` → corrections de bugs

- Exemple :
```bash
git checkout -b feature/calendar-improvements
git commit -m "Amélioration du composant Calendar"
git push origin feature/calendar-improvements
````

## Normes de code

- TypeScript : types stricts et clairs

- React : hooks fonctionnels, composants réutilisables

- Styling : Tailwind CSS, classes lisibles et cohérentes

- Respecter le linting avec eslint et prettier

## Tests

- Ajouter ou mettre à jour des tests unitaires pour toutes nouvelles fonctionnalités.

- Vérifier que tous les tests passent avant de soumettre une PR.

- Tests recommandés : Jest pour hooks et utilitaires, React Testing Library pour composants.

## Documentation

- Mettre à jour README.md, SERVICES.md, COMPONENTS.md, etc., si nécessaire.

- Ajouter des commentaires clairs pour les fonctions complexes.

## Communication

- Utiliser Issues pour les discussions techniques.

- Les discussions urgentes peuvent passer par un canal Slack/Discord dédié.

- Respecter les décisions prises par le mainteneur principal pour le merge final.