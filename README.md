# Portfolio 2026

Mon portfolio perso. Vanilla HTML/CSS/JS, zéro framework, zéro dépendance build.

Construit en une session avec exactement **un commit** avant de push. Oui.

## Stack

- HTML/CSS/JS pur — pas de React, pas de Next, pas de Tailwind, pas de npm install qui prend 45min
- SPA router maison avec transitions Web Animations API
- Markdown blog engine avec support Mermaid
- GitHub API pour les projets
- Design system crimson/dark avec glassmorphism

## Dev

```bash
# N'importe quel serveur statique
python -m http.server 8000
# ou
npx serve .
```

Ouvrir `http://localhost:8000`

---

<details>
<summary>🧠 Comment poster un article (pour le Louis du futur qui a oublié)</summary>

### 1. Créer le fichier

Créer un fichier `.md` dans le dossier `posts/`. Le nom c'est le slug (ce qui apparaît dans l'URL).

Exemple : `posts/mon-super-article.md`

### 2. Ajouter le frontmatter

Au début du fichier :

```yaml
---
title: "Mon Super Article"
date: 2026-04-04
tags: [AI, python, whatever]
excerpt: "Une phrase qui donne envie de cliquer."
---
```

Puis écrire le contenu en Markdown normal. Les blocs ` ```mermaid ` sont supportés pour les diagrammes.

### 3. L'ajouter à l'index

Ouvrir `posts/index.json` et ajouter le slug au tableau :

```json
["mon-super-article", "ai-for-sme", "building-with-yolo", "hello-world"]
```

L'ordre dans le JSON n'a pas d'importance, les posts sont triés par date automatiquement.

### 4. Push

```bash
git add posts/
git commit -m "post: mon super article"
git push
```

GitHub Pages se déploie tout seul. C'est tout. T'as pas besoin de toucher au JS, au CSS, ou à quoi que ce soit d'autre. Promis.

</details>
