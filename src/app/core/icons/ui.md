# ╔══════════════════════════════════════════════════════════════════╗
# ║   FISHCAM ERP — COMPLETE UI SPECIFICATION                       ║
# ║   All Pages · All Modals · All Slide-Overs · All Messages       ║
# ║   Source: All Backend Controllers (validated)                   ║
# ╚══════════════════════════════════════════════════════════════════╝

---

## ANSWER — Création Compte Courant

The `POST /comptes-courants/client/{clientId}` endpoint exists.
This means the backend does NOT auto-create a compte courant.

**UI Rule :**
```
On Client Detail page:
  @if client has no compte courant yet:
    → Show "Ouvrir un compte courant" button
    → Calls POST /comptes-courants/client/{clientId}
    → On success: refreshes client detail

  @if client has no épargne yet:
    → Show "Ouvrir un compte épargne" button
    → Calls POST /epargnes  { clientId }
    → On success: refreshes client detail
```

---

## SIDEBAR — PER ROLE (updated from all controllers)

```
┌──────────────────────────────────┬────────────────┬──────────────────────────────┐
│ NAV ITEM                         │ ICON           │ VISIBLE FOR                  │
├──────────────────────────────────┼────────────────┼──────────────────────────────┤
│ Tableau de bord                  │ LayoutDashboard│ All                          │
│ Clients                          │ Users          │ All                          │
│ Factures                         │ FileText       │ All                          │
│ Transactions                     │ ArrowLeftRight │ All                          │
│ Livreurs                         │ Truck          │ All                          │
│ Produits                         │ Package        │ All                          │
│ Fournisseurs                     │ Store          │ All                          │
│ Notifications                    │ Bell + badge   │ All                          │
│ ──────────────────────────────── │                │                              │
│ Comptes en dette                 │ AlertTriangle  │ PATRON + SUPER_ADMIN         │
│ Clôture journalière              │ CalendarCheck  │ PATRON + SUPER_ADMIN         │
│ Bilans                           │ BarChart2      │ PATRON + SUPER_ADMIN         │
│ Statistiques                     │ TrendingUp     │ PATRON + SUPER_ADMIN         │
│ Récapitulatifs                   │ ClipboardList  │ PATRON + SUPER_ADMIN         │
│ ──────────────────────────────── │                │                              │
│ Poissonneries                    │ Building2      │ SUPER_ADMIN only             │
│ Équipe                           │ UserCog        │ PATRON + SUPER_ADMIN         │
│ Audit logs                       │ ScrollText     │ PATRON + SUPER_ADMIN         │
│ Sauvegarde                       │ Database       │ All                          │
└──────────────────────────────────┴────────────────┴──────────────────────────────┘
```

**Sidebar Bottom — User Footer :**
```
┌─────────────────────────────────────────┐
│  [MK]  Marie Kamga                      │
│        CAISSIÈRE                        │
│  Poissonnerie La Référence · [logout→]  │
└─────────────────────────────────────────┘
```
- Avatar: initials circle bg-fc-green
- Role chip: PATRON(yellow) / SUPER_ADMIN(red) / CAISSIERE(green) / ENREGISTREUR(gray)

---

## MESSAGE SYSTEM — TOASTS & ALERTS

### Toast Notification (global)

Appears top-right corner, auto-dismiss after 4 seconds.
Animation: slide in from right → fade out.

```
SUCCESS                          ERROR
┌──────────────────────────┐     ┌──────────────────────────┐
│ ✅ Client créé avec       │     │ ❌ Erreur serveur (500)   │
│    succès                 │     │    Réessayez plus tard   │
│ ──────────────────────── │     │ ──────────────────────── │
│  [×]          4s ████░░  │     │  [×]          4s ████░░  │
└──────────────────────────┘     └──────────────────────────┘
  bg-fc-green-light                bg-fc-red-light
  border-fc-green                  border-fc-red
  text-fc-green                    text-fc-red

WARNING                          INFO
┌──────────────────────────┐     ┌──────────────────────────┐
│ ⚠️ Montant dépasse la    │     │ ℹ️ Données simulées      │
│    limite autorisée       │     │   (mode hors-ligne)      │
└──────────────────────────┘     └──────────────────────────┘
  bg-fc-yellow-light               bg-blue-50
  border-fc-yellow                 border-blue-200
```

**Toast triggers (from each endpoint) :**
```
POST /clients              → ✅ "Client créé avec succès"
PUT  /clients/{id}         → ✅ "Client modifié avec succès"
POST /comptes-courants/emprunts      → ✅ "Emprunt enregistré"
POST /comptes-courants/remboursements→ ✅ "Remboursement enregistré"
POST /epargnes/depot       → ✅ "Dépôt effectué avec succès"
POST /epargnes/retrait     → ✅ "Retrait effectué avec succès"
POST /factures             → ✅ "Facture créée avec succès"
PUT  /factures/{id}/cloturer→ ✅ "Facture clôturée"
POST /clotures             → ✅ "Journée clôturée avec succès"
401 error                  → ❌ "Session expirée, reconnectez-vous"
403 error                  → ❌ "Accès refusé"
500 error                  → ❌ "Erreur serveur. Réessayez."
network error              → ❌ "Connexion impossible"
```

### Inline Form Errors (under each field)

```
┌──────────────────────────────────────┐
│ Prénom *                             │
│ ┌────────────────────────────────┐   │
│ │                                │   │  ← red border
│ └────────────────────────────────┘   │
│ ⚠ Prénom requis (minimum 2 car.)    │  ← text-fc-red text-xs
└──────────────────────────────────────┘
```

### Confirm Dialog (before destructive actions)

Animation: fade in + scale up from center.
```
         ┌────────────────────────────────────┐
[overlay]│  ⚠️  Êtes-vous sûr ?               │
         │                                    │
         │  Désactiver Marie Kamga supprimera │
         │  son accès au système.             │
         │  Cette action peut être annulée.   │
         │                                    │
         │         [Annuler]  [Désactiver]    │
         │                   button: fc-red   │
         └────────────────────────────────────┘
```

---

## PAGE 1 — LOGIN

```
┌────────────────────┬────────────────────────────────────────┐
│   GAUCHE (5/12)    │   DROITE (7/12)  bg gradient vert      │
│   bg-white         │                                        │
│                    │                                        │
│  [logo Fish-Cam]   │         [logo Fish-Cam large]          │
│                    │                                        │
│  Accès au système  │    [fish1.svg illustration]            │
│  de gestion.       │                                        │
│                    │    Système de Gestion                  │
│  [error banner]    │    POISSONNERIE LA RÉFÉRENCE           │
│                    │                                        │
│  Téléphone *       │    ┌──────────┐┌──────────┐┌────────┐ │
│  [🇨🇲+237|✆|input]│    │Gestion   ││Suivi des ││Rapports│ │
│                    │    │stocks    ││ventes    ││        │ │
│  Mot de passe *    │    └──────────┘└──────────┘└────────┘ │
│  [🔒|input|👁]    │                                        │
│  [Oublié ?]        │                                        │
│                    │                                        │
│  [Accéder→]        │                                        │
│                    │                                        │
│  © 2026 Fish-Cam   │                                        │
└────────────────────┴────────────────────────────────────────┘
```

---

## PAGE 2 — DASHBOARD (PATRON / SUPER_ADMIN)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: Tableau de bord                    [🔔3] [MK] [▼]       │
├─────────────────────────────────────────────────────────────────┤
│  Bonjour Marie · Mercredi 25 Avril 2026 · Poissonnerie Akwa     │
├────────────┬────────────┬────────────┬────────────┬────────────┤
│ 📉 Total   │ 👥 Clients │ 🏦 Total   │ ⬆️ Emprunts│ ⬇️ Rembt  │
│   Dettes   │ en dette   │  Épargne   │  du jour   │  du jour  │
│ 485k FCFA  │ 12 clients │ 1.23M FCFA │ 75k FCFA   │ 42k FCFA  │
│ [RED card] │[ORANGE card│[GREEN card]│[YELLOW card│[GREEN card│
└────────────┴────────────┴────────────┴────────────┴────────────┘
│  ⚠️ Marie Kamga -47 500   Paul Biya -8 200   Awa Nguele -2 100  │
│  [Alert ribbon — horizontal scroll — debtors pills]             │
├────────────────────────────────────┬────────────────────────────┤
│  RAPPORT JOURNALIER (col 3/5)      │ NOTIFICATIONS (col 2/5)    │
│ ┌──────────────────────────────┐   │ Notifications récentes      │
│ │ bg-fc-green text-white       │   │ Voir tout →                │
│ │ 📊 Rapport du 24 Avril 2026  │   │                            │
│ ├──────────────────────────────┤   │ 🔴 Marie Kamga dépasse     │
│ │ Transactions :   18          │   │    le seuil · 14:30        │
│ │ Emprunts     : 120 000 FCFA  │   │                            │
│ │ Remboursements:  65 000 FCFA │   │ 📊 Rapport 24 Avril...     │
│ │ Dettes       :  10 clients   │   │    19:00                   │
│ │ ─────────────────────────── │   │                            │
│ │ Solde net : -55 000 FCFA 🔴  │   │ ✅ Paul Biya soldé         │
│ └──────────────────────────────┘   │    son compte · 11:00      │
└────────────────────────────────────┴────────────────────────────┘
```

---

## PAGE 3 — DASHBOARD (CAISSIERE)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: Tableau de bord                    [🔔2] [JD] [▼]       │
├─────────────────────────────────────────────────────────────────┤
│  Bonjour Jean · Mercredi 25 Avril 2026 · Poissonnerie Akwa      │
├──────────────────────┬──────────────────┬───────────────────────┤
│ 📋 Factures aujourd'│ 💳 Emprunts       │ ✅ Remboursements     │
│    hui               │    aujourd'hui    │    aujourd'hui        │
│    5 factures        │    47 500 FCFA   │    12 000 FCFA        │
│ [source: /factures   │ [source:notifs]  │ [source:notifs]      │
│  ?date=today]        │                  │                       │
└──────────────────────┴──────────────────┴───────────────────────┘
│  ⚠️ Alert ribbon — clients en dette (accessible to CAISSIERE)   │
├──────────────────────────────────────────────────────────────────┤
│  ACTIONS RAPIDES                                                 │
│  [💳 Enregistrer un emprunt]   [✅ Enregistrer remboursement]   │
│  → Opens search for client → then transaction modal             │
├──────────────────────────────────────────────────────────────────┤
│  Notifications récentes                                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## PAGE 4 — DASHBOARD (ENREGISTREUR)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: Tableau de bord                    [🔔1] [AB] [▼]       │
├─────────────────────────────────────────────────────────────────┤
│  Bonjour Albert · Mercredi 25 Avril 2026 · Poissonnerie Akwa    │
├─────────────────────────────────────────────────────────────────┤
│  ACTIONS RAPIDES                                                 │
│  [+ Nouvelle Facture]      [+ Nouveau client]                   │
├─────────────────────────────────────────────────────────────────┤
│  Factures du jour (source: GET /factures?poissonnerieId&date)   │
│ ┌──────────────┬───────────────┬───────────┬───────────────┐   │
│ │ Date         │ Fournisseur   │ Nb lignes │ Total achat   │   │
│ ├──────────────┼───────────────┼───────────┼───────────────┤   │
│ │ 25/04/2026   │ Jean Dupont   │ 5         │ 85 000 FCFA   │   │
│ │ 25/04/2026   │ Awa Commerce  │ 3         │ 42 000 FCFA   │   │
│ └──────────────┴───────────────┴───────────┴───────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  Notifications récentes                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 5 — CLIENTS LIST (/clients)

```
┌─────────────────────────────────────────────────────────────────┐
│ Clients (87 au total)                   [+ Nouveau client]      │
├─────────────────────────────────────────────────────────────────┤
│ [ 🔍 Rechercher par nom ou téléphone... ]   [Actifs ▼] [+filtre]│
├──────────────┬───────────┬───────────────┬──────────┬──────────┤
│ Nom          │ Téléphone │ Solde CC      │ Épargne  │ Actions  │
├──────────────┼───────────┼───────────────┼──────────┼──────────┤
│ Marie Kamga  │ 690 123.. │ -47 500 🔴    │ 12 000   │[👁][✏️][💬]│
│ Paul Biya Jr │ 677 456.. │ -2 100 🟠     │ 0        │[👁][✏️][💬]│
│ Awa Nguele   │ 655 789.. │ Soldé 🟢      │ 45 200   │[👁][✏️][💬]│
│ Jean Foko    │ 699 000.. │ -58 000 🔴💥  │ 0        │[👁][✏️][💬]│
│ Suzanne Moto │ 678 111.. │ Soldé 🟢      │ 8 500    │[👁][✏️][💬]│
└──────────────┴───────────┴───────────────┴──────────┴──────────┘
│ Affichage 1-20 de 87 clients        [< 1  2  3  4  5 >]        │
│                                                                  │
│ 🔴💥 = solde dépasse limiteCreditMax (animate-pulse)            │
└─────────────────────────────────────────────────────────────────┘
```

**Action buttons visibility by role :**
```
[👁 Voir]     → all roles
[✏️ Modifier] → SUPER_ADMIN, PATRON, CAISSIERE
[💬 Trans.]   → all roles (but modal will hide certain actions per role)
```

---

## PAGE 6 — CLIENT DETAIL (/clients/:id)

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Retour   Marie Kamga        [ACTIVE 🟢]                       │
│            📞 690 123 456 · Quartier Akwa · Rue des Cocotiers   │
│                                                                  │
│  All roles:     [💳 Emprunter]                                  │
│  CAISSIERE+:    [✅ Rembourser]  [💰 Dépôt]  [💸 Retrait]      │
│  PATRON+:       [✏️ Modifier limite crédit]                     │
│                                                                  │
│  ← If no compte courant: [Ouvrir un compte courant]             │
│  ← If no épargne:        [Ouvrir un compte épargne]             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [Compte Courant]      [Épargne]          ← active tab underline │
├─────────────────────────────────────────────────────────────────┤
│ TAB 1 — COMPTE COURANT                                          │
│                                                                  │
│  Solde : -47 500 FCFA 🔴        Limite : 50 000 FCFA            │
│  Statut : [EN_DETTE 🔴]                                          │
│                                                                  │
│ ┌────────────┬───────────────┬──────────────┬─────────────────┐ │
│ │ Date       │ Type          │ Montant      │ Description     │ │
│ ├────────────┼───────────────┼──────────────┼─────────────────┤ │
│ │ 25/04/2026 │ 🔴 DETTE      │ -25 000 FCFA │ Poisson frais  │ │
│ │ 20/04/2026 │ ✅ REMBT      │ +10 000 FCFA │ Versement      │ │
│ │ 15/04/2026 │ 🔴 DETTE      │ -32 500 FCFA │ Achat carpe    │ │
│ └────────────┴───────────────┴──────────────┴─────────────────┘ │
│  Page: 1 of 5  [< 1 2 3 4 5 >]                                 │
├─────────────────────────────────────────────────────────────────┤
│ TAB 2 — ÉPARGNE                                                 │
│                                                                  │
│  Solde épargne : 12 000 FCFA 🟢                                 │
│                                                                  │
│ ┌────────────┬──────────┬──────────────┐                        │
│ │ Date       │ Type     │ Montant      │                        │
│ ├────────────┼──────────┼──────────────┤                        │
│ │ 15/04/2026 │ 💰 DÉPÔT │ +5 000 FCFA  │                       │
│ │ 10/04/2026 │ 💸 RETRAIT│ -2 000 FCFA │                       │
│ │ 05/04/2026 │ 💰 DÉPÔT │ +9 000 FCFA  │                       │
│ └────────────┴──────────┴──────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 7 — FACTURES LIST (/factures)

```
┌─────────────────────────────────────────────────────────────────┐
│ Factures                                  [+ Nouvelle Facture]  │
├─────────────────────────────────────────────────────────────────┤
│ [📅 Date: 25/04/2026]  [Fournisseur ▼]  [Statut: Tous ▼]       │
├───────────┬───────────┬────────┬──────────┬──────────┬─────────┤
│ Date      │Fournisseur│Nb lig. │Total achat│Vente prév│ Actions │
├───────────┼───────────┼────────┼──────────┼──────────┼─────────┤
│ 25/04     │ Jean D.   │ 5      │ 85 500   │ 112 000  │[👁][📄][🔒]│
│ 25/04     │ Awa C.    │ 3      │ 42 000   │  55 000  │[👁][📄]   │
│ 24/04     │ Pierre M. │ 7      │ 120 000  │ 158 000  │[👁][📄]✓ │
└───────────┴───────────┴────────┴──────────┴──────────┴─────────┘
│  ✓ = déjà clôturée   [🔒] = clôturer (PATRON+ only)            │
│  [📄] = Télécharger PDF                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 8 — FACTURE CREATE (/factures/new) — SPLIT SCREEN

```
┌──────────────────────────┬─────────────────────────────────────┐
│   FORMULAIRE (40%)       │   APERÇU EN DIRECT (60%)            │
│                          │                                     │
│  Date *                  │  ┌───────────────────────────────┐  │
│  [25/04/2026   📅]       │  │  🐟 FISH-CAM                 │  │
│                          │  │  Poissonnerie La Référence    │  │
│  Fournisseur *           │  │  Nkongsamba · Cameroun        │  │
│  [Jean Dupont      ▼]    │  ├───────────────────────────────┤  │
│                          │  │  Facture d'achat              │  │
│  Livreur (optionnel)     │  │  Date : 25 Avril 2026         │  │
│  [Dernier: Ali M.  ▼]    │  │  Fournisseur : Jean Dupont    │  │
│                          │  │  Livreur : Ali Moussa         │  │
│  ─── PRODUITS ────────   │  ├─────────┬─────┬──────┬───────┤  │
│  [🔍 Chercher produit..] │  │ Produit │ Qté │ Prix │ Total │  │
│   └─ dropdown résultats  │  ├─────────┼─────┼──────┼───────┤  │
│                          │  │ Carpe   │  5  │12 000│60 000 │  │
│  ┌── Ligne 1 ──────────┐ │  │ Tilapia │  3  │ 8 500│25 500 │  │
│  │ Carpe        [×]    │ │  │ Silure  │  2  │15 000│30 000 │  │
│  │ Qté cartons: [  5 ] │ │  ├─────────┴─────┴──────┴───────┤  │
│  │ Prix/carton:[12 000]│ │  │ Total achats :  115 500 FCFA  │  │
│  │ Poids kg:   [ 30  ] │ │  │ Total vente  :  153 200 FCFA  │  │
│  │ Prix/kg:    [  500 ]│ │  │ Bénéfice prév:   37 700 FCFA 🟢│ │
│  │ = 60 000 FCFA [≡]  │ │  └───────────────────────────────┘  │
│  └────────────────────┘ │                                     │
│                          │                                     │
│  [+ Ajouter une ligne]   │                                     │
│                          │                                     │
│  [❌ Annuler] [💾 Sauver]│                                     │
└──────────────────────────┴─────────────────────────────────────┘
```

**Product autocomplete dropdown :**
```
  [🔍 car                              ]
  ┌─────────────────────────────────────┐
  │ 🐟 Carpe (Poisson)    → sélectionner│
  │ 📦 Carton vide        → sélectionner│
  │ 🐟 Carpe fumée        → sélectionner│
  └─────────────────────────────────────┘
  On click → GET /lignes/dernier-prix → auto-fill prix
```

---

## PAGE 9 — FACTURE DETAIL (/factures/:id)

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Retour   Facture #42 · 25 Avril 2026   [🟡 OUVERTE]          │
│            Jean Dupont · Livreur: Ali Moussa                    │
│                                      [📄 PDF]  [🔒 Clôturer]   │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┬─────────────┬───────┬────────┬────────┬───────────┐ │
│ │ Produit │ Qté cartons │ Prix  │ Montant│ Poids  │ Vente/kg  │ │
│ ├─────────┼─────────────┼───────┼────────┼────────┼───────────┤ │
│ │ Carpe   │      5      │12 000 │60 000  │  30 kg │    500    │ │
│ │ Tilapia │      3      │ 8 500 │25 500  │  18 kg │    600    │ │
│ └─────────┴─────────────┴───────┴────────┴────────┴───────────┘ │
├──────────────────────────────────┬──────────────────────────────┤
│ Total achats :     85 500 FCFA   │ Total vente prév: 112 000    │
│                                  │ Bénéfice prév :   26 500 🟢  │
└──────────────────────────────────┴──────────────────────────────┘
```

---

## PAGE 10 — TRANSACTIONS (/transactions)

```
┌─────────────────────────────────────────────────────────────────┐
│ Journal des Transactions                                        │
├─────────────────────────────────────────────────────────────────┤
│ [📅 25/04/2026]  [Type: Tous ▼]  [🔍 Client...]                │
├──────────────┬──────────────────┬──────────────┬───────────────┤
│ Date / Heure │ Client           │ Type         │ Montant       │
├──────────────┼──────────────────┼──────────────┼───────────────┤
│ 25/04 14:32  │ Marie Kamga      │ 🔴 DETTE     │ -25 000 FCFA  │
│ 25/04 11:15  │ Paul Biya Jr     │ ✅ REMBT     │ +10 000 FCFA  │
│ 25/04 09:40  │ Awa Nguele       │ 💰 DÉPÔT     │  +5 000 FCFA  │
│ 24/04 16:00  │ Suzanne Moto     │ 💸 RETRAIT   │  -2 000 FCFA  │
└──────────────┴──────────────────┴──────────────┴───────────────┘
│ 1-20 de 342 transactions             [< 1 2 3 ... 18 >]        │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 11 — DETTES (/dettes) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Comptes en Dépassement · 12 clients         [Tri: + endetté ▼] │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🔴 Marie Kamga          📞 690 123 456                     │ │
│  │    Dette : -47 500 FCFA  /  Limite : 50 000 FCFA          │ │
│  │    Progression : ████████████████████ 95%                  │ │
│  │    [✅ Remboursement rapide]    [👁 Voir compte complet]   │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🟠 Paul Biya Jr         📞 677 456 789                     │ │
│  │    Dette : -8 200 FCFA  /  Limite : 50 000 FCFA           │ │
│  │    Progression : ████░░░░░░░░░░░░░░░░░ 16%                 │ │
│  │    [✅ Remboursement rapide]    [👁 Voir compte complet]   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 12 — CLÔTURE JOURNALIÈRE (/cloture) — PATRON + SUPER_ADMIN

```
STEP 1 — Sélection
┌─────────────────────────────────────────────────────────────────┐
│ Clôture Journalière                                             │
├─────────────────────────────────────────────────────────────────┤
│  Poissonnerie : [La Référence - Akwa          ▼]               │
│  Date         : [25/04/2026                  📅]               │
│                                                                 │
│                          [Préparer →]                           │
└─────────────────────────────────────────────────────────────────┘

STEP 2 — Résumé + Formulaire (after GET /clotures/preparer)
┌─────────────────────────────────────────────────────────────────┐
│ Clôture du 25 Avril 2026 · La Référence                        │
├─────────────────────────────────────────────────────────────────┤
│  RÉSUMÉ JOURNÉE (lecture seule)                                 │
│  Emprunts du jour         :   120 000 FCFA                     │
│  Remboursements du jour   :    65 000 FCFA                     │
│  Total ventes prévisibles :   153 000 FCFA                     │
│  Nombre de factures       :   5                                 │
├─────────────────────────────────────────────────────────────────┤
│  SAISIE CAISSE                                                  │
│  Fonds de caisse initial  : [________________] FCFA            │
│  Argent en caisse réel    : [________________] FCFA            │
│  Dépense ration           : [________________] FCFA            │
│  Dépense transport        : [________________] FCFA            │
│  Autres dépenses          : [________________] FCFA            │
│  Description autres        : [________________________________] │
│                                                                 │
│  Écart de caisse (calculé): = Réel - Initial - Dépenses        │
│  ÉCART : -12 500 FCFA 🔴                                        │
│                                                                 │
│  [← Retour]                    [⚠️ Clôturer la journée]        │
│                                    → opens confirm-dialog       │
└─────────────────────────────────────────────────────────────────┘

HISTORIQUE (below, from GET /clotures/historique)
┌────────────┬──────────┬──────────┬───────────┬────────────────┐
│ Date       │ Fonds CC │ Réel CC  │ Écart     │ Actions        │
├────────────┼──────────┼──────────┼───────────┼────────────────┤
│ 24/04/2026 │ 50 000   │ 37 500   │ -12 500 🔴│ [👁 Voir]      │
│ 23/04/2026 │ 50 000   │ 52 000   │ +2 000 🟢 │ [👁 Voir]      │
└────────────┴──────────┴──────────┴───────────┴────────────────┘
```

---

## PAGE 13 — BILANS (/bilans) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Bilan Mensuel              [Poissonnerie: La Référence ▼]       │
│                            [Mois: Avril ▼] [Année: 2026 ▼]    │
├──────────────────┬──────────────────┬──────────────────────────┤
│ 💰 Total Achats  │ 💵 Total Ventes  │ 📈 Bénéfice Brut         │
│  1 840 000 FCFA  │  2 430 000 FCFA  │    590 000 FCFA 🟢       │
├──────────────────┼──────────────────┼──────────────────────────┤
│ 📉 Total Dettes  │ ✅ Remboursements│ 💸 Dépenses totales      │
│  485 000 FCFA    │  320 000 FCFA    │    142 000 FCFA          │
├──────────────────┴──────────────────┴──────────────────────────┤
│ BÉNÉFICE NET : 448 000 FCFA 🟢                                  │
├─────────────────────────────────────────────────────────────────┤
│ COMPARAISON DES BOUTIQUES (SUPER_ADMIN — GET /bilans/comparaison│
│  Boutique        │ Achats    │ Ventes   │ Bénéfice              │
│  La Référence    │ 1 840 000 │ 2 430 000│ 590 000 🟢            │
│  Bonamoussadi    │ 1 200 000 │ 1 580 000│ 380 000 🟢            │
│  Ndokoti         │   980 000 │ 1 150 000│ 170 000 🟡            │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 14 — STATISTIQUES (/statistiques) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Statistiques · La Référence                    [Global ▼]       │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ 👥 Clients   │ 💰 Épargne   │ 🏦 Moy.épar. │ 📉 En dette      │
│ 87 clients   │ 1.23M FCFA   │ 14 138 FCFA  │ 12 clients       │
└──────────────┴──────────────┴──────────────┴───────────────────┘
│  REVENUS MENSUELS (bar chart from revenueMensuel[])             │
│  Jan  Fév  Mar  Avr  Mai  Juin Juil Août Sep  Oct  Nov  Déc    │
│  ██   ██   ██   ████ ░░   ░░   ░░   ░░   ░░   ░░   ░░   ░░   │
├────────────────────────────────┬────────────────────────────────┤
│  TOP 5 DÉBITEURS               │  TOP 5 PRODUITS                │
│  Marie Kamga    -47 500 FCFA   │  Carpe      45 cartons         │
│  Paul Biya Jr    -8 200 FCFA   │  Tilapia    38 cartons         │
│  Awa Nguele      -2 100 FCFA   │  Silure     22 cartons         │
└────────────────────────────────┴────────────────────────────────┘
```

---

## PAGE 15 — NOTIFICATIONS (/notifications)

```
┌─────────────────────────────────────────────────────────────────┐
│ Notifications                     [✅ Tout marquer comme lu]    │
├─────────────────────────────────────────────────────────────────┤
│ [Tous (8)] [🔴 ALERTE (3)] [✅ SOLDE (2)] [📊 RAPPORT (1)] [ℹ️]│
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🔴│ COMPTE_COURANT_ALERTE          25/04/2026 14:30 🟢  │   │
│ │   │ Marie Kamga dépasse le seuil (-47 500 FCFA)          │   │
│ ├──────────────────────────────────────────────────────────┤   │
│ │ 📊│ RAPPORT_JOURNALIER             24/04/2026 19:00      │   │
│ │   │ 📊 Rapport du 24 Avril 2026                          │   │
│ │   │ Transactions : 18 · Emprunts : 120 000 FCFA...       │   │
│ ├──────────────────────────────────────────────────────────┤   │
│ │ ✅│ COMPTE_SOLDE                   23/04/2026 11:00      │   │
│ │   │ Paul Biya Jr a soldé son compte courant              │   │
│ └──────────────────────────────────────────────────────────┘   │
│ [< 1  2  3 >]                                                   │
│ 🟢 = non lu                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 16 — LIVREURS (/livreurs)

```
┌─────────────────────────────────────────────────────────────────┐
│ Livreurs                                     [+ Nouveau]        │
├──────────────┬──────────────┬────────────┬────────┬────────────┤
│ Nom          │ Téléphone    │ Véhicule   │ Statut │ Actions    │
├──────────────┼──────────────┼────────────┼────────┼────────────┤
│ Ali Moussa   │ 690 111 222  │ Moto Benin │ [● ACT]│[★ Eval][⏸]│
│ Jean Pierre  │ 677 333 444  │ Vélo       │ [○ INR]│[★ Eval][▶]│
└──────────────┴──────────────┴────────────┴────────┴────────────┘
│ [●] = actif (green toggle)   [○] = inactif (gray toggle)        │
│ [★ Eval] = opens evaluation modal                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 17 — PRODUITS (/produits)

```
┌─────────────────────────────────────────────────────────────────┐
│ Produits                    [🔍 Rechercher...]    [+ Nouveau]   │
├──────────────────┬────────────────┬──────────────┬─────────────┤
│ Nom              │ Catégorie      │ Poids/Carton │ Actions     │
├──────────────────┼────────────────┼──────────────┼─────────────┤
│ Carpe            │ Poisson frais  │ 20 kg        │[✏️][🗑️]    │
│ Tilapia          │ Poisson frais  │ 15 kg        │[✏️][🗑️]    │
│ Silure fumé      │ Poisson fumé   │ 10 kg        │[✏️][🗑️]    │
└──────────────────┴────────────────┴──────────────┴─────────────┘
```

---

## PAGE 18 — FOURNISSEURS (/fournisseurs)

```
┌─────────────────────────────────────────────────────────────────┐
│ Fournisseurs                                       [+ Nouveau]  │
├─────────────────────────┬────────────────┬────────┬────────────┤
│ Nom                     │ Téléphone      │ Ville  │ Actions    │
├─────────────────────────┼────────────────┼────────┼────────────┤
│ Jean Dupont Commerce    │ 690 555 777    │ Douala │[✏️][🗑️]   │
│ Awa Commerce Générale   │ 677 888 999    │ Yaoundé│[✏️][🗑️]   │
└─────────────────────────┴────────────────┴────────┴────────────┘
```

---

## PAGE 19 — POISSONNERIES (/poissonneries) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Poissonneries                                      [+ Nouveau]  │
├───────────────────┬──────────────┬────────────┬────────┬───────┤
│ Nom               │ Adresse      │ Téléphone  │ Active │Actions│
├───────────────────┼──────────────┼────────────┼────────┼───────┤
│ La Référence Akwa │ Rue Akwa     │ 233 42..   │ ● ACT  │[✏️][🗑️]│
│ Bonamoussadi      │ Carrefour... │ 233 43..   │ ● ACT  │[✏️][🗑️]│
│ Ndokoti Market    │ Marché...    │ 233 44..   │ ○ INA  │[✏️][▶]│
└───────────────────┴──────────────┴────────────┴────────┴───────┘
│ [🗑️] = SUPER_ADMIN only                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 20 — ÉQUIPE (/equipe) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Équipe                                         [+ Nouveau]      │
├──────────────┬───────────────┬────────────┬───────────┬────────┤
│ Prénom/Nom   │ Téléphone     │ Rôle       │ Boutique  │Actions │
├──────────────┼───────────────┼────────────┼───────────┼────────┤
│ Marie Kamga  │ 690 123 456   │ [CAISSIÈRE]│ La Réf.   │[✏️][🗑️]│
│ Jean Foko    │ 677 456 789   │[ENREGISTR.]│ La Réf.   │[✏️][🗑️]│
│ Pierre Ndo   │ 655 789 012   │ [PATRON]   │ Bonams.   │[✏️]    │
└──────────────┴───────────────┴────────────┴───────────┴────────┘
│ PATRON(yellow) CAISSIERE(green) ENREGISTREUR(gray)             │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 21 — AUDIT LOGS (/audit) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Journal d'Audit (lecture seule)                                 │
├──────────────┬───────────┬──────────┬────────────┬─────────────┤
│ Date         │ Action    │ Entité   │ Utilisateur│ Détails     │
├──────────────┼───────────┼──────────┼────────────┼─────────────┤
│ 25/04 14:32  │ CREATE    │ Client   │ M. Kamga   │ id=42       │
│ 25/04 14:30  │ EMPRUNT   │ CC       │ M. Kamga   │ 25000 FCFA  │
│ 25/04 11:15  │ UPDATE    │ Client   │ Admin      │ id=38       │
└──────────────┴───────────┴──────────┴────────────┴─────────────┘
│ [< 1 2 3 ... 48 >]                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 22 — SAUVEGARDE (/backup) — All roles

```
┌─────────────────────────────────────────────────────────────────┐
│ Sauvegardes de la Base de Données                              │
├────────────────────────────────┬────────────────────────────────┤
│  📱 TELEGRAM                   │  📧 EMAIL                      │
│  Dernière : 22/04/2026 02:00   │  Dernière : 01/04/2026 03:00   │
│  Statut : ✅ OK                │  Statut : ⚠️ Retard 24j        │
│                                │                                │
│  [📤 Envoyer maintenant]       │  [📤 Envoyer maintenant]       │
└────────────────────────────────┴────────────────────────────────┘
│  ⚠️ Banner if backup missed: "Sauvegarde manquée - Envoyez"    │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 23 — RÉCAPITULATIF (/recapitulatifs) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Récapitulatif des Ventes                                        │
├─────────────────────────────────────────────────────────────────┤
│ Poissonnerie : [La Référence ▼]                                │
│ Période      : Du [01/04/2026] Au [30/04/2026]                 │
│                                                                 │
│                   [Générer le récapitulatif]                    │
├─────────────────────────────────────────────────────────────────┤
│  (result after generation)                                      │
│  Total achats    : 7 840 000 FCFA                              │
│  Total ventes    : 10 430 000 FCFA                             │
│  Nb factures     : 42                                          │
│                                                                 │
│                         [📄 Télécharger PDF]                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ALL MODALS SUMMARY

```
┌─────────────────────────────────┬──────────────────────────────────────────────┐
│ MODAL                           │ TRIGGER + ENDPOINT                           │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Emprunt                         │ [Emprunter] on client detail                 │
│                                 │ → POST /comptes-courants/emprunts             │
│                                 │ Fields: montant*, description*               │
│                                 │ Roles: ALL                                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Remboursement                   │ [Rembourser] on client detail / dettes        │
│                                 │ → POST /comptes-courants/remboursements       │
│                                 │ Fields: montant* (max=|solde|)               │
│                                 │ Roles: SUPER_ADMIN, PATRON, CAISSIERE         │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Dépôt Épargne                   │ [Dépôt] on client detail                     │
│                                 │ → POST /epargnes/depot                        │
│                                 │ Fields: montant* (no max)                    │
│                                 │ Roles: SUPER_ADMIN, PATRON, CAISSIERE         │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Retrait Épargne                 │ [Retrait] on client detail                   │
│                                 │ → POST /epargnes/retrait                      │
│                                 │ Fields: montant* (max=currentBalance)        │
│                                 │ Roles: SUPER_ADMIN, PATRON, CAISSIERE         │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Transfert Épargne → CC          │ [Transférer épargne] on client detail        │
│                                 │ → POST /comptes-courants/transfert-epargne    │
│                                 │ Fields: montant* (max=epargne balance)       │
│                                 │ Roles: SUPER_ADMIN, PATRON, CAISSIERE         │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Modifier limite crédit          │ [✏️ Limite] on client detail                 │
│                                 │ → PUT /comptes-courants/{id}/limite-credit    │
│                                 │ Fields: nouvelleLimite*                      │
│                                 │ Roles: SUPER_ADMIN, PATRON                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Évaluation Livreur              │ [★ Eval] on livreurs list                    │
│                                 │ → POST /evaluations                           │
│                                 │ Fields: livreurId, achatId,                  │
│                                 │         noteRespectPoids(1-5),               │
│                                 │         noteQualite(1-5), commentaire        │
│                                 │ Roles: ALL                                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Clôturer Facture (confirm)      │ [🔒 Clôturer] on factures                   │
│                                 │ → PUT /factures/{id}/cloturer                 │
│                                 │ "Cette action est irréversible"              │
│                                 │ Roles: SUPER_ADMIN, PATRON                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Clôture Journée (confirm)       │ On clôture form submission                   │
│                                 │ → POST /clotures                              │
│                                 │ "IRRÉVERSIBLE - Confirmer?"                  │
│                                 │ Roles: SUPER_ADMIN, PATRON                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Désactiver Client (confirm)     │ [🗑️] on clients list                        │
│                                 │ → DELETE /clients/{id}                        │
│                                 │ Roles: SUPER_ADMIN, PATRON                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Changer mot de passe            │ Profile menu → "Changer MDP"                │
│                                 │ → PUT /auth/change-password                   │
│                                 │ Fields: ancienMdp*, nouveauMdp*,             │
│                                 │         confirmerMdp*                        │
│                                 │ Roles: ALL                                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Réinitialiser MDP (admin)       │ [✏️] on équipe → "Réinitialiser MDP"        │
│                                 │ → PUT /auth/reset-password                    │
│                                 │ Fields: userId, nouveauMdp*                  │
│                                 │ Roles: PATRON, SUPER_ADMIN                   │
└─────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## ALL SLIDE-OVERS SUMMARY

```
┌───────────────────────┬──────────────────────────────────────────┐
│ SLIDE-OVER            │ FIELDS + ENDPOINT                        │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ firstName*, lastName*, phone*, quartier*, │
│ Client                │ address (optional)                       │
│                       │ CREATE → POST /clients                   │
│                       │ EDIT   → PUT  /clients/{id}              │
│                       │ Roles: ALL (edit: SUPER_ADMIN,PATRON,CC) │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ nom*, telephone*, ville*                  │
│ Fournisseur           │ CREATE → POST /fournisseurs              │
│                       │ EDIT   → PUT  /fournisseurs/{id}         │
│                       │ Roles: ALL                               │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ nom*, telephone*, vehicule*               │
│ Livreur               │ CREATE → POST /livreurs                  │
│                       │ Roles: ALL                               │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ nom*, categorie*, poidsParCarton*,        │
│ Produit               │ alerteStock*                             │
│                       │ CREATE → POST /produits                  │
│                       │ EDIT   → PUT  /produits/{id}             │
│                       │ Roles: ALL                               │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ name*, address*, phone*,                  │
│ Poissonnerie          │ fondDeCaisseDefaut*, loyer*              │
│                       │ CREATE → POST /poissonneries             │
│                       │ EDIT   → PUT  /poissonneries/{id}        │
│                       │ Roles: SUPER_ADMIN, PATRON               │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ firstName*, lastName*, phone*,            │
│ Employé               │ role* (select), poissonnerieId*,         │
│                       │ password* (create only)                  │
│                       │ CREATE → POST /employes                  │
│                       │ EDIT   → PUT  /employes/{id}             │
│                       │ Roles: SUPER_ADMIN, PATRON               │
└───────────────────────┴──────────────────────────────────────────┘
```

---

## MODAL — ÉVALUATION LIVREUR

```
    ┌────────────────────────────────────────────────┐
    │  Évaluer Ali Moussa                       [×]  │
    ├────────────────────────────────────────────────┤
    │                                                │
    │  Facture associée                              │
    │  [Facture du 25/04 - Jean Dupont         ▼]   │
    │                                                │
    │  Respect du poids (1 à 5) *                   │
    │  ☆ ☆ ☆ ☆ ☆  ← star rating interactive        │
    │                                                │
    │  Qualité du poisson (1 à 5) *                 │
    │  ☆ ☆ ☆ ☆ ☆                                    │
    │                                                │
    │  Commentaire                                   │
    │  ┌──────────────────────────────────────────┐  │
    │  │ Poids conforme, poisson en bon état...   │  │
    │  └──────────────────────────────────────────┘  │
    │                                                │
    ├────────────────────────────────────────────────┤
    │       [Annuler]    [Soumettre l'évaluation]    │
    └────────────────────────────────────────────────┘
```

---

## MODAL — MODIFIER LIMITE DE CRÉDIT

```
    ┌────────────────────────────────────────────────┐
    │  Modifier la limite de crédit             [×]  │
    ├────────────────────────────────────────────────┤
    │                                                │
    │  ┌──────────────────────────────────────────┐  │
    │  │  Client : Marie Kamga                    │  │
    │  │  Limite actuelle : 50 000 FCFA           │  │
    │  └──────────────────────────────────────────┘  │
    │                                                │
    │  Nouvelle limite (FCFA) *                      │
    │  ┌──────────────────────────────────────────┐  │
    │  │ 75 000                                   │  │
    │  └──────────────────────────────────────────┘  │
    │                                                │
    ├────────────────────────────────────────────────┤
    │        [Annuler]    [Modifier la limite]       │
    │                      button: bg-fc-green       │
    └────────────────────────────────────────────────┘
```

---

## MODAL — CHANGER MOT DE PASSE

```
    ┌────────────────────────────────────────────────┐
    │  Changer mon mot de passe                 [×]  │
    ├────────────────────────────────────────────────┤
    │  Ancien mot de passe *                         │
    │  [••••••••                            👁]      │
    │                                                │
    │  Nouveau mot de passe *                        │
    │  [••••••••                            👁]      │
    │                                                │
    │  Confirmer le nouveau *                        │
    │  [••••••••                            👁]      │
    │  ← error if not matching                       │
    ├────────────────────────────────────────────────┤
    │      [Annuler]    [Modifier le mot de passe]   │
    └────────────────────────────────────────────────┘
```

---

## LOADING STATES (on every list/page)

```
SKELETON (while loading)              EMPTY STATE (no data)
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ ████████████ ░░░░ ████████   │      │                              │
│ ████████ ░░░░░░░░ ██████     │      │        [icon Users]          │
│ ██████████ ░░░░ ████████     │      │                              │
│ ████████ ░░░░░░░░ ██████     │      │   Aucun client trouvé        │
│ ██████████ ░░░░ ████████     │      │   pour cette boutique        │
└──────────────────────────────┘      │                              │
  animated shimmer gray bars           │   [+ Créer le premier]      │
                                       └──────────────────────────────┘

ERROR STATE
┌──────────────────────────────┐
│                              │
│      [icon AlertTriangle]    │
│                              │
│  Impossible de charger       │
│  les données.                │
│                              │
│      [↺ Réessayer]           │
└──────────────────────────────┘
```

---

## TOPBAR NOTIFICATION DROPDOWN

```
                          ┌──────────────────────────────────────┐
                          │ Notifications           [Voir tout]  │
                          ├──────────────────────────────────────┤
                          │ 🟢 Marie Kamga dépasse le seuil      │
                          │    25/04/2026 14:30                  │
                          ├──────────────────────────────────────┤
                          │    📊 Rapport du 24 Avril            │
                          │    24/04/2026 19:00                  │
                          ├──────────────────────────────────────┤
                          │ 🟢 Paul Biya Jr soldé son compte     │
                          │    23/04/2026 11:00                  │
                          ├──────────────────────────────────────┤
                          │  [Voir toutes les notifications]     │
                          └──────────────────────────────────────┘
  🟢 = unread dot   click notification → mark as read → close dropdown
```
