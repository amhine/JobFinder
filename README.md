
# 📌 JobFinder – Application de Recherche d’Emploi

## 📖 Présentation du projet

**JobFinder** est une application web de recherche d’emplois développée en **Angular** sous forme de **Single Page Application (SPA)**.
Elle permet aux chercheurs d’emploi de consulter des offres issues d’**APIs publiques internationales**, de gérer leurs favoris et de suivre l’évolution de leurs candidatures.

Le projet est réalisé **sans backend personnalisé**. La persistance des données est assurée par **JSON Server**, qui simule une API REST pour les utilisateurs, les favoris et les candidatures.

Ce projet est réalisé dans le cadre de la **Soutenance Croisée 2 – Année 2025/2026**.

---

## 🎯 Objectifs de l’application

* Rechercher des offres d’emploi via des APIs publiques
* Mettre en place une authentification côté frontend
* Sauvegarder et gérer des offres favorites
* Suivre l’état des candidatures envoyées
* Appliquer une architecture Angular claire et maintenable
* Utiliser **NgRx** pour la gestion d’état

---

## 🛠️ Technologies utilisées

* Angular 17+
* TypeScript
* RxJS et Observables
* NgRx (Store, Actions, Reducers, Selectors, Effects)
* JSON Server (Fake REST API)
* Bootstrap ou Tailwind CSS
* Reactive Forms
* Angular Router
* Redux DevTools

---

## 🧱 Architecture de l’application

L’application est structurée autour des concepts suivants :

* Composants Angular organisés en parent / enfant
* Services dédiés à la logique métier et aux appels HTTP
* Guards pour la protection des routes
* Lazy Loading pour optimiser le chargement
* Intercepteurs HTTP pour la gestion centralisée des erreurs (optionnel)
* Gestion d’état centralisée avec NgRx pour la partie favoris

Chaque page de l’application est composée d’au minimum **deux composants** afin de respecter la composition des composants.

---

## 🔐 Authentification (Fake Authentication)

L’authentification est simulée côté frontend.

### Fonctionnement :

* Les comptes utilisateurs sont stockés via JSON Server
* Lors de la connexion, l’email et le mot de passe sont vérifiés
* En cas de succès :

  * Les informations de l’utilisateur (sans le mot de passe) sont stockées dans le `sessionStorage` ou le `localStorage`
  * Un **AuthGuard** contrôle l’accès aux routes protégées

📌 Le choix entre `sessionStorage` et `localStorage` est justifié lors de la soutenance.

---

## 🔍 Recherche d’offres d’emploi

La recherche d’offres est accessible **même sans être authentifié**.

### Critères obligatoires :

* Mot-clé correspondant au **titre du poste**
* Localisation (ville, pays ou région)

### Règles métier :

* Le mot-clé doit apparaître uniquement dans le titre de l’offre
* Les résultats sont triés par date de publication (du plus récent au plus ancien)
* Un indicateur de chargement est affiché pendant la recherche
* Les résultats sont paginés (10 offres par page)

### Informations affichées :

* Titre du poste
* Nom de l’entreprise
* Localisation
* Date de publication
* Description courte
* Salaire (si disponible)
* Lien vers l’offre complète
* Boutons d’actions visibles uniquement pour les utilisateurs authentifiés :

  * Ajouter aux favoris
  * Suivre cette candidature

---

## ❤️ Gestion des Favoris (NgRx)

L’accès aux favoris est réservé aux utilisateurs authentifiés.

### Fonctionnalités :

* Ajouter une offre aux favoris
* Consulter la liste des offres favorites
* Supprimer une offre des favoris
* Affichage visuel indiquant si une offre est déjà ajoutée

### Contraintes métier :

* Une même offre ne peut être ajoutée qu’une seule fois par utilisateur
* Les favoris sont associés à l’utilisateur connecté

La gestion des favoris est principalement assurée par **NgRx** afin de centraliser l’état de l’application.

---

## 📂 Suivi des Candidatures

L’accès au suivi des candidatures nécessite une authentification.

### Fonctionnalités :

* Ajouter une candidature depuis une offre
* Consulter l’ensemble des candidatures suivies
* Modifier manuellement le statut d’une candidature
* Ajouter des notes personnelles
* Supprimer une candidature

### Statuts disponibles :

* En attente (statut par défaut)
* Accepté
* Refusé

Chaque candidature est liée à un utilisateur et à une offre précise, avec persistance des données via JSON Server.

---

## 🌐 APIs utilisées

L’application utilise au minimum **une API gratuite** parmi celles proposées dans la ressource officielle :
👉 [https://job-finder-api-nine.vercel.app/](https://job-finder-api-nine.vercel.app/)

Plusieurs APIs peuvent être utilisées simultanément afin d’agréger les résultats.

---

## ⚙️ Installation et exécution du projet

### Étapes principales :

* Cloner le dépôt GitHub
* Installer les dépendances avec npm
* Lancer JSON Server pour simuler l’API REST
* Démarrer l’application Angular

L’application est accessible en local sur le port par défaut d’Angular.

---

## ✅ Fonctionnalités validées

* Authentification avec protection des routes
* Recherche d’offres conforme aux règles métier
* Gestion des favoris avec NgRx
* Suivi complet des candidatures
* Persistance des données via JSON Server
* Interface responsive et ergonomique
* Gestion des erreurs et validations des formulaires
* Code structuré et maintenable

---
