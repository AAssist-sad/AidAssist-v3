# TESTING.md – Guide des tests

Ce document décrit les pratiques et outils pour tester **AidAssist**, afin d’assurer la qualité et la stabilité du projet.

---

## Table des matières

1. [Types de tests](#types-de-tests)
2. [Configuration des outils](#configuration-des-outils)
3. [Écriture des tests](#écriture-des-tests)
4. [Exécution des tests](#exécution-des-tests)
5. [Bonnes pratiques](#bonnes-pratiques)

---

## Types de tests

1. **Tests unitaires**
    - Vérifient le fonctionnement isolé des fonctions, hooks et composants.
    - Outils : **Jest** pour logique, **React Testing Library** pour composants.

2. **Tests d’intégration**
    - Vérifient que plusieurs composants/services fonctionnent ensemble.
    - Exemple : création d’un rendez-vous et mise à jour du calendrier.

3. **Tests end-to-end (E2E)**
    - Vérifient le parcours utilisateur complet.
    - Outils possibles : **Cypress** ou **Playwright**.

---

## Configuration des outils

- Installer les dépendances :
```bash

npm install --save-dev jest @testing-library/react @testing-library/jest-dom
````

- Ajouter la configuration Jest dans package.json:

```bash

"jest": {
"preset": "ts-jest",
"testEnvironment": "jsdom",
"setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"]
}
````

- Créer src/setupTests.ts pour configurer React Testing Library :
```bash

import '@testing-library/jest-dom';

````

## Écriture des tests

- Tests unitaires de fonctions:
```bash

import { sum } from '../utils/math';

test('addition simple', () => {
  expect(sum(2, 3)).toBe(5);
});

````

- Tests de composants React:
```bash

import { render, screen } from '@testing-library/react';
import Calendar from '../components/Appointments/Calendar';

test('affiche le calendrier', () => {
  render(<Calendar />);
  expect(screen.getByText(/Rendez-vous/i)).toBeInTheDocument();
});

````

- Nommer les fichiers avec le suffixe .test.ts ou .test.tsx.
```bash

npm test


````

Lancer un test unique en mode watch :
```bash

npm test -- Calendar.test.tsx


````

Vérifier la couverture du code :
```bash

npm test -- --coverage


````

## Bonnes pratiques

- Chaque nouvelle fonctionnalité doit être accompagnée de tests.

- Tester les cas limites et erreurs possibles.

- Mettre à jour les tests lors des changements dans la logique.

- Les tests doivent être rapides, isolés et reproductibles.