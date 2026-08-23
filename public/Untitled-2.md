Tu es un **Senior Product Designer et Senior Frontend Engineer spécialisé en SaaS modernes**.

Je veux que tu génères **UNIQUEMENT le dashboard authentifié de mon SaaS et son menu latéral**, sans créer de landing page, pricing page complète, settings page complète ou autres pages.

## 1. CONTEXTE DU PRODUIT

Mon SaaS permet aux utilisateurs de générer automatiquement du contenu pour les réseaux sociaux grâce à l'IA.

L'utilisateur peut renseigner :

* son activité
* sa marque
* sa plateforme cible
* le type de contenu
* le ton de communication
* ses objectifs marketing

L'IA génère ensuite du contenu adapté.

Le dashboard doit donner immédiatement l'impression d'utiliser un **véritable produit SaaS premium**, moderne et professionnel.

Le dashboard doit être centré sur une idée :

> **L'utilisateur arrive et comprend immédiatement ce qu'il peut faire, ce qu'il a déjà généré et comment commencer une nouvelle création.**

---

# 2. STACK TECHNIQUE OBLIGATOIRE

Utilise :

* **Next.js**
* **App Router**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React** pour toutes les icônes
* **Framer Motion** uniquement lorsque cela améliore réellement l'expérience utilisateur

Le code doit être propre, modulaire et prêt pour une application SaaS réelle.

N'utilise pas d'autres bibliothèques UI inutiles.

---

# 3. DIRECTION VISUELLE

Le résultat doit être :

* premium
* minimaliste
* moderne
* élégant
* légèrement futuriste
* professionnel
* très lisible
* orienté produit SaaS

Évite complètement :

* les interfaces trop chargées
* les gradients excessifs
* les effets neon inutiles
* les énormes titres
* les cartes avec trop d'informations

Le dashboard doit privilégier la **clarté et la hiérarchie visuelle**.

---

# 4. STRUCTURE GÉNÉRALE

Crée une interface avec :

```text
┌───────────────────────────────────────────────────────┐
│ Sidebar             │ Topbar                          │
│                     │                                 │
│ Logo                │ Greeting / Search / User       │
│                     │                                 │
│ Dashboard           │ Dashboard Content              │
│ Generate            │                                 │
│ History             │                                 │
│ Pricing             │                                 │
│ Settings            │                                 │
│                     │                                 │
│                     │                                 │
│ User profile        │                                 │
└───────────────────────────────────────────────────────┘
```

La sidebar doit rester visible sur desktop.

Sur mobile, elle devient un menu **off-canvas / drawer** accessible via un bouton hamburger.

---

# 5. SIDEBAR

Crée une sidebar élégante d'environ **250 à 280px** sur desktop.

Elle doit contenir :

### Logo

En haut :

**[Nom du SaaS]**

Prévois une petite icône ou un symbole graphique simple à côté du nom.

Le logo doit être fictif et facilement remplaçable.

---

## MENU PRINCIPAL

Les éléments doivent être exactement :

### Dashboard

Icône : `LayoutDashboard`

Route :

```text
/dashboard
```

### Generate

Icône : `Sparkles`

Route :

```text
/dashboard/generate
```

### History

Icône : `History`

Route :

```text
/dashboard/history
```

### Pricing

Icône : `CreditCard`

Route :

```text
/dashboard/pricing
```

### Settings

Icône : `Settings`

Route :

```text
/dashboard/settings
```

Utilise **Lucide React** pour toutes ces icônes.

---

# 6. ÉTAT ACTIF DU MENU

L'élément actuellement sélectionné doit avoir un état actif très clair mais élégant.

Par exemple :

* fond légèrement mauve
* bord subtil
* icône Indigo
* texte clair

Ne rends pas l'état actif trop agressif.

Le hover doit avoir une animation légère.

Utilise une transition rapide et élégante.

---

# 7. SIDEBAR FOOTER

En bas de la sidebar, ajoute un petit bloc utilisateur.

Exemple :

```text
┌──────────────────────────┐
│ ● John Doe               │
│   Free Plan              │
│                          │
│                         >│
└──────────────────────────┘
```

Utilise un avatar circulaire.

Ajoute éventuellement un petit badge :

**Free**

Le bloc utilisateur doit être visuellement discret.

---

# 8. TOPBAR

Le dashboard doit avoir une topbar moderne.

Elle doit contenir :

### À gauche

Une petite indication du contexte actuel :

```text
Dashboard
```

ou un breadcrumb discret.

### À droite

Prévoir :

* recherche
* notifications
* avatar utilisateur

La recherche peut être représentée par un champ compact :

```text
Search...
```

avec l'icône `Search`.

Les notifications utilisent l'icône `Bell`.

---

# 9. CONTENU DU DASHBOARD

Crée un dashboard très utile immédiatement après connexion.

En haut :

```text
Good morning, Alex 👋
Create content that keeps your brand active.
```

Utilise un texte plus professionnel si nécessaire.

Sous le titre, ajoute un CTA principal :

**Generate Content**

avec l'icône `Sparkles`.

Ce bouton doit être l'action principale de la page.

---

# 10. STATISTIQUES

Ajoute une petite rangée de statistiques.

Par exemple :

### Content Generated

```text
128
+24 this month
```

### Published

```text
86
+12 this month
```

### Remaining Credits

```text
42
of 100
```

### Engagement

```text
+18.4%
```

Les chiffres peuvent être fictifs.

Ils servent uniquement à construire l'interface.

Les statistiques doivent être visuellement sobres.

---

# 11. SECTION PRINCIPALE

Crée ensuite une grande section montrant une **vue d'ensemble de l'activité récente**.

Elle peut contenir :

### Recent Content

Une liste de contenus récemment générés.

Chaque ligne doit afficher :

* plateforme
* titre ou aperçu
* date
* statut
* action

Exemple :

```text
Instagram
5 Tips to grow your audience
Today
Generated

LinkedIn
How AI is changing content creation
Yesterday
Published
```

Utilise de petites icônes / badges pour distinguer les plateformes.

---

# 12. QUICK GENERATION CARD

Ajoute une grande carte particulièrement visible :

```text
Create your next post

Tell us about your idea and let AI handle the rest.

[ Generate Content → ]
```

Cette carte doit être l'élément principal du dashboard.

Elle doit donner envie de cliquer immédiatement sur Generate.

---

# 13. PLATEFORMES

Ajoute une petite section :

```text
Create for
```

avec plusieurs plateformes :

* Instagram
* Facebook
* LinkedIn
* X
* TikTok

Utilise des icônes appropriées ou des placeholders propres.

Les cartes doivent rester simples.

---

# 14. ACTIVITÉ RÉCENTE

Ajoute éventuellement une petite visualisation de l'activité de génération.

Par exemple :

```text
Content activity

Mon  Tue  Wed  Thu  Fri  Sat  Sun
▂    ▅    ▃    ▇    ▆    ▄    ▇
```

Utilise la couleur **Indigo** pour les charts conformément au design system.

Ne transforme pas le dashboard en dashboard analytique complexe.

---

# 15. HIÉRARCHIE

La hiérarchie visuelle doit être :

```text
1. Generate Content CTA
2. Welcome / contexte
3. Statistiques
4. Recent Content
5. Activity
6. Platforms
```

L'utilisateur doit comprendre l'action principale en quelques secondes.

---

# 16. RESPONSIVE

Desktop :

```text
Sidebar fixe
+
Topbar
+
Dashboard content
```

Tablet :

Réduis la sidebar ou utilise un mode compact.

Mobile :

La sidebar doit devenir un **drawer**.

La navbar mobile doit contenir :

* logo
* hamburger
* avatar

Les cartes statistiques passent en colonne ou en grille 2 colonnes selon la largeur.

Le contenu doit rester parfaitement lisible.

---

# 17. SHADCN/UI

Utilise les composants shadcn/ui lorsque pertinents :

* Button
* Card
* Badge
* Avatar
* Input
* Tooltip
* Dropdown Menu
* Separator
* Sheet
* Progress

Les composants doivent être personnalisés pour respecter le design visuel du SaaS.

---

# 18. ANIMATIONS

Ajoute des micro-interactions :

* hover sidebar
* transition des boutons
* apparition progressive des cards
* animation légère des statistiques
* drawer mobile
* transitions entre états

Utilise **Framer Motion** avec modération.

Le produit doit paraître rapide et premium, pas animé comme une démonstration.

---

# 19. CODE

Organise le code de manière modulaire.

Par exemple :

```text
app/
└── dashboard/
    └── page.tsx

components/
└── dashboard/
    ├── sidebar.tsx
    ├── topbar.tsx
    ├── stats-cards.tsx
    ├── quick-generate.tsx
    ├── recent-content.tsx
    ├── platform-list.tsx
    └── activity-chart.tsx
```

La sidebar doit être un composant réutilisable.

Le menu doit utiliser une configuration de données plutôt que de répéter manuellement chaque élément.

Exemple conceptuel :

```ts
const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Generate",
    href: "/dashboard/generate",
    icon: Sparkles,
  },
  ...
]
```

---

# 20. IMPORTANT

Ne crée **aucune landing page**.

Ne crée pas :

* Hero marketing
* Testimonials
* FAQ marketing
* Pricing landing page
* Footer marketing
* Section de présentation du produit

Je veux uniquement :

**Dashboard authentifié + Sidebar + Topbar + contenu du dashboard.**

Le résultat doit ressembler à une **véritable application SaaS prête à être utilisée**, et non à une simple maquette.

Priorité absolue :

**UX → clarté → hiérarchie → conversion → esthétique.**

Le dashboard doit immédiatement pousser l'utilisateur vers l'action :

**Generate Content.**

Génère ensuite le code complet en **Next.js + TypeScript + Tailwind CSS + shadcn/ui + Lucide React**.
