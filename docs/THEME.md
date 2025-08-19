# STYLES.md / THEME.md – Documentation des styles et thèmes

Ce document décrit les conventions de **style**, le **thème global** et les composants visuels utilisés dans **AidAssist**.

---

## Table des matières

1. [Palette de couleurs](#palette-de-couleurs)
2. [Typographie](#typographie)
3. [Breakpoints / Responsive](#breakpoints--responsive)
4. [Composants UI](#composants-ui)
5. [Thème global](#thème-global)
6. [Utilitaires CSS / Tailwind](#utilitaires-css--tailwind)

---

## Palette de couleurs

| Nom | Couleur | Usage |
|-----|---------|-------|
| Primary | #4F46E5 | Boutons principaux, liens |
| Secondary | #6366F1 | Survol boutons, highlights |
| Accent | #F59E0B | Notifications importantes |
| Success | #10B981 | Actions réussies |
| Warning | #FBBF24 | Alertes / avertissements |
| Error | #EF4444 | Messages d’erreur |
| Background | #F3F4F6 | Fond général |
| Surface | #FFFFFF | Cartes, modals, panels |
| TextPrimary | #111827 | Texte principal |
| TextSecondary | #6B7280 | Texte secondaire |

---

## Typographie

- **Font-family principale :** `Inter, sans-serif`
- **Font-weight :**
    - Light : 300
    - Regular : 400
    - Medium : 500
    - Bold : 700
- **Tailles principales :**
    - `xs`: 0.75rem
    - `sm`: 0.875rem
    - `base`: 1rem
    - `lg`: 1.125rem
    - `xl`: 1.25rem
    - `2xl`: 1.5rem
    - `3xl`: 1.875rem
    - `4xl`: 2.25rem

---

## Breakpoints / Responsive

| Nom | Tailwind | Largeur min |
|-----|----------|------------|
| sm | `sm:` | 640px |
| md | `md:` | 768px |
| lg | `lg:` | 1024px |
| xl | `xl:` | 1280px |
| 2xl | `2xl:` | 1536px |

---

## Composants UI

- **Boutons :**
    - `PrimaryButton` : couleur primaire, hover secondaire
    - `SecondaryButton` : contour secondaire, fond transparent
- **Cards :**
    - `StatCard`, `AppointmentCard`, `ProcedureCard`
    - Shadow léger, bordures arrondies `2xl`, padding standard `p-4`
- **Modals :**
    - Overlay semi-transparent `rgba(0,0,0,0.5)`
    - Border-radius `2xl`, max-width `600px`
- **Input / Form :**
    - Focus : border-color `Primary`
    - Error : border-color `Error`, message rouge
- **Notifications :**
    - Background selon type (Success, Warning, Error)
    - Icones adaptées à chaque type

---

## Thème global

- **Dark / Light mode :**
    - Dark : fond `#111827`, texte clair `#F3F4F6`
    - Light : fond `#F3F4F6`, texte sombre `#111827`
- **Border-radius :** standard `2xl`
- **Spacing :**
    - Gap : 2 / 4 / 6 / 8
    - Padding : `p-2` à `p-8`
- **Shadow :** `shadow-sm`, `shadow-md`, `shadow-lg` selon importance

---

## Utilitaires CSS / Tailwind

- **Flexbox :** `flex`, `justify-between`, `items-center`
- **Grid :** `grid`, `grid-cols-2/3/4`
- **Text :** `text-sm`, `text-lg`, `font-bold`, `text-center`
- **Spacing :** `m-2`, `p-4`, `space-x-4`, `space-y-2`
- **Borders :** `border`, `border-gray-300`, `rounded-2xl`
- **Background :** `bg-primary`, `bg-surface`, `bg-accent`
- **Hover / Focus :** `hover:bg-secondary`, `focus:outline-none`, `focus:ring-2 focus:ring-primary`

---

## Notes

- Tous les styles utilisent **Tailwind CSS** pour la cohérence et la rapidité de développement.
- Les composants doivent respecter le thème et ne pas surcharger la palette existante.
- Chaque nouveau composant doit documenter ses variantes et états (hover, active, disabled).  
