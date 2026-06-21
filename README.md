# 🐟 FishCam ERP — Frontend (Angular 20)

> Interface utilisateur moderne, réactive et performante pour le système de gestion des poissonneries FishCam ERP au Cameroun.

![Angular](https://img.shields.io/badge/Angular-20.3.23-DD0031?style=for-the-badge&logo=angular)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)

---

## 📋 Table des matières

- [Description](#description)
- [Architecture & Bonnes Pratiques](#architecture--bonnes-pratiques)
- [Fonctionnalités Principales](#fonctionnalités-principales)
- [Prérequis](#prérequis)
- [Installation & Lancement](#installation--lancement)
- [Structure du Projet](#structure-du-projet)
- [Déploiement (Docker)](#déploiement-docker)

---

## 💡 Description

Le frontend de **FishCam ERP** est une Single Page Application (SPA) développée avec la dernière version d'Angular (v20). Il offre une interface intuitive pour la gestion quotidienne des poissonneries : gestion des stocks, facturation, suivi des dettes clients (comptes courants), gestion des épargnes, et génération de rapports financiers.

L'interface s'adapte dynamiquement selon le rôle de l'utilisateur connecté (`SUPER_ADMIN`, `PATRON`, `CAISSIERE`, `ENREGISTREUR`).

---

## 🏗️ Architecture & Bonnes Pratiques

Ce projet respecte les standards les plus modernes d'Angular :
- **100% Standalone Components** : Aucun `NgModules`, architecture allégée.
- **ChangeDetectionStrategy.OnPush** : Optimisation maximale des performances de rendu.
- **Signals API** : Utilisation intensive de `signal()`, `computed()`, et `effect()` pour une réactivité fine sans RxJS complexe.
- **State Management Local (Stores)** : Utilisation de services injectables (`AuthStore`, `ClientStore`, etc.) pour séparer la logique d'état des composants visuels.
- **Tailwind CSS v4** : Design system utilitaire pour une interface propre et responsive.
- **Lucide Icons** : Bibliothèque d'icônes SVG légères et modernes.

---

##  Fonctionnalités Principales

- 🔐 **Authentification JWT** : Connexion sécurisée par numéro de téléphone.
- 📊 **Tableaux de bord personnalisés** : KPIs adaptés au rôle de l'utilisateur.
- 👥 **Gestion des Clients** : Suivi des soldes de comptes courants et d'épargne en temps réel.
- 🛒 **Facturation (Achats)** : Saisie des achats fournisseurs avec calcul automatique des marges et prévisions de vente.
- 💸 **Transactions Financières** : Dépôts, retraits, emprunts et remboursements avec historique complet.
- 📈 **Statistiques & Bilans** : Graphiques de revenus (Chart.js) et bilans mensuels.
- 📄 **Export PDF** : Génération côté client/serveur de fiches d'épargne et de récapitulatifs.
- 🔔 **Système de Notifications** : Alertes en temps réel (dépassement de seuil, clôture de caisse).

---

## ⚙️ Prérequis

- [Node.js](https://nodejs.org/) (v20 ou supérieur recommandé)
- [Angular CLI](https://angular.dev/tools/cli) (v20.3.23)
- Le backend Spring Boot de FishCam en cours d'exécution.

---

##  Installation & Lancement

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/ton-repo/fishcam-frontend.git
   cd fishcam-frontend


2. **Installer les dépendances :**
    ```bash
    npm install
    ```
3. **Configurer l'environnement :**
 Vérifiez le fichier src/environments/environment.ts pour vous assurer que l'URL de l'API pointe bien vers votre backend local (par défaut http://localhost:8080/api/v1).

4. **Lancer le serveur de développement :**
  ```bash
  ng serve
  L'application sera accessible sur http://localhost:4200/.
  ```
# 📁 Structure du Projet

``` text
src/
├── app/
│   ├── core/               # Services singletons, Guards, Interceptors, Models
│   ├── features/           # Modules métiers (Auth, Clients, Factures, Dashboard...)
│   │   └── [feature]/
│   │       ├── components/ # Dumb components (UI)
│   │       ├── pages/      # Smart components (Routables)
│   │       ├── services/   # Appels HTTP API
│   │       └── stores/     # State management (Signals)
│   ├── layouts/            # Structure globale (Sidebar, Topbar, AppShell)
│   └── shared/             # Composants réutilisables (Modals, Toasts, Skeletons...)
├── assets/                 # Images, logos, icônes
└── environments/           # Configurations de build (dev/prod)
```

# 🐳 Déploiement (Docker)
L'application est configurée pour être déployée via un Multi-stage build Docker avec Nginx.

```bash
# Construction de l'image
docker build -t fishcam-frontend .

# Lancement du conteneur
docker run -d -p 80:80 fishcam-frontend
(Note : En production, le routage SPA est géré par un fichier nginx.conf personnalisé).
```
