---
title: "Reinforcement Learning (RL) — Fondamentaux et implémentation Python"
date: 2026-04-14
tags: [AI, reinforcement-learning, python]
excerpt: "Bases mathématiques du RL, principaux types d'algorithmes, et exemple pratique de Q-Learning en Python."
---

Le Reinforcement Learning (RL) est une approche de l'intelligence artificielle où un agent apprend à prendre des décisions en interagissant avec un environnement. L'objectif est de maximiser une récompense cumulative à long terme. Ce document couvre les bases mathématiques du RL et une implémentation simple en Python.

## I. Fondamentaux Mathématiques

Le cadre théorique du RL est le **Markov Decision Process (MDP)**. Un MDP est défini par un quintuplet $(\mathcal{S}, \mathcal{A}, P, R, \gamma)$ :

*   **États (States, $\mathcal{S}$)** : Ensemble de toutes les situations possibles de l'environnement. Un état $s \in \mathcal{S}$ est une description complète de la situation actuelle. L'**hypothèse de Markov** stipule que l'état futur ne dépend que de l'état et de l'action actuels : $P(S_{t+1}=s' | S_t=s, A_t=a, S_{t-1}, A_{t-1}, \dots) = P(S_{t+1}=s' | S_t=s, A_t=a)$.

*   **Actions (Actions, $\mathcal{A}$)** : Ensemble des actions que l'agent peut effectuer. Pour un état $s$, l'agent choisit une action $a \in \mathcal{A}(s)$.

*   **Probabilités de Transition (Transition Probabilities, $P$)** : Fonction $P(s'|s,a)$ qui donne la probabilité de passer à l'état $s'$ après avoir pris l'action $a$ dans l'état $s$.

*   **Récompenses (Rewards, $R$)** : Feedback numérique $R(s,a,s')$ reçu par l'agent après avoir effectué l'action $a$ dans l'état $s$ et transité vers $s'$. L'agent cherche à maximiser la somme des récompenses.

*   **Facteur d'Actualisation (Discount Factor, $\gamma$)** : Scalaire $0 \le \gamma \le 1$ qui pondère l'importance des récompenses futures par rapport aux récompenses immédiates.

### Politiques (Policies)

Une **policy** $\pi$ est la stratégie de l'agent, définissant comment il choisit une action dans un état donné.

*   **Deterministic Policy** : Pour chaque état $s$, $\pi(s)$ spécifie une unique action $a$.
*   **Stochastic Policy** : Pour chaque état $s$, $\pi(a|s)$ donne une distribution de probabilité sur les actions possibles.

L'objectif du RL est de trouver l'**optimal policy ($\pi^*$)** qui maximise la récompense cumulative future.

### Fonctions de Valeur (Value Functions)

Les **value functions** estiment la récompense cumulative future qu'un agent peut attendre.

*   **Fonction de Valeur d'État (State-Value Function, $V^\pi(s)$)** : Valeur attendue d'un état $s$ sous une policy $\pi$.
    $$V^\pi(s) = \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \mid S_t = s \right]$$
    L'**Équation de Bellman pour $V^\pi(s)$** :
    $$V^\pi(s) = \sum_{a \in \mathcal{A}(s)} \pi(a|s) \sum_{s' \in \mathcal{S}} P(s'|s,a) \left[ R(s,a,s') + \gamma V^\pi(s') \right]$$

*   **Fonction de Valeur d'Action (Action-Value Function, $Q^\pi(s, a)$)** : Valeur attendue de prendre l'action $a$ dans l'état $s$, puis de suivre la policy $\pi$.
    $$Q^\pi(s, a) = \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \mid S_t = s, A_t = a \right]$$
    L'**Équation de Bellman pour $Q^\pi(s, a)$** :
    $$Q^\pi(s, a) = \sum_{s' \in \mathcal{S}} P(s'|s,a) \left[ R(s,a,s') + \gamma V^\pi(s') \right]$$

### Équations d'Optimalité de Bellman

Les **Bellman Optimality Equations** décrivent les value functions des optimal policies, $V^*(s)$ et $Q^*(s, a)$.

*   **Optimal State-Value Function ($V^*(s)$)** :
    $$V^*(s) = \max_{a \in \mathcal{A}(s)} \sum_{s' \in \mathcal{S}} P(s'|s,a) \left[ R(s,a,s') + \gamma V^*(s') \right]$$

*   **Optimal Action-Value Function ($Q^*(s, a)$)** :
    $$Q^*(s, a) = \sum_{s' \in \mathcal{S}} P(s'|s,a) \left[ R(s,a,s') + \gamma \max_{a' \in \mathcal{A}(s')} Q^*(s',a') \right]$$

L'optimal policy $\pi^*$ est obtenue en choisissant l'action qui maximise $Q^*(s, a)$ pour chaque état $s$ : $\pi^*(s) = \arg\max_{a \in \mathcal{A}(s)} Q^*(s, a)$.

## II. Algorithmes de Reinforcement Learning

Les algorithmes de RL permettent d'apprendre les optimal policies et value functions.

### Types d'Algorithmes

*   **Dynamic Programming (DP)** : Utilisé lorsque le modèle complet du MDP est connu. Résout itérativement les Bellman Optimality Equations (ex: Value Iteration, Policy Iteration).

*   **Monte Carlo (MC) Methods** : Apprend de l'expérience sans modèle. L'agent effectue des épisodes complets et met à jour les estimations de value functions à partir des récompenses observées.

*   **Temporal-Difference (TD) Learning** : Apprend de l'expérience sans modèle, comme MC, mais met à jour les connaissances à chaque pas de temps en utilisant des estimations de valeurs futures (bootstrapping). Le Q-Learning est un algorithme TD.

### Autres grandes familles de RL

Au-delà des méthodes orientées valeur (Q-Learning/SARSA), on retrouve aussi :

*   **Policy Gradient** : optimise directement la policy (ex: REINFORCE).
*   **Actor-Critic** : combine un acteur (policy) et un critique (value function), base de méthodes modernes (A2C, PPO).
*   **Model-Based RL** : apprend/utilise un modèle de l'environnement pour planifier.
*   **Deep RL** : utilise des réseaux de neurones pour gérer des espaces d'états/actions plus complexes.

### Q-Learning

Le Q-Learning est un algorithme **model-free** et **off-policy** qui estime l'optimal action-value function $Q^*(s, a)$.

*   **Q-Table** : Une table stockant les estimations de $Q(s, a)$ pour chaque paire (état, action).

*   **Équation de Mise à Jour** : Après une transition $(s, a) \rightarrow s'$ avec récompense $R$ :
    $$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ R + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]$$
    *   $\alpha$ (**learning rate**) : Taux d'apprentissage (0 à 1).
    *   $R$ (**reward**) : Récompense immédiate.
    *   $\gamma$ (**discount factor**) : Importance des récompenses futures.
    *   $\max_{a'} Q(s', a')$ : Meilleure Q-value possible dans l'état suivant $s'$. Ce terme rend l'algorithme off-policy.
    *   Le terme entre crochets est l'**TD Error**.

*   **Exploration vs. Exploitation** : L'agent équilibre l'exploration (essayer de nouvelles actions) et l'exploitation (utiliser les actions connues comme bonnes). La **ε-greedy policy** est courante : avec probabilité $\epsilon$, l'agent choisit une action aléatoire ; avec probabilité $1 - \epsilon$, il choisit l'action avec la plus haute Q-value. $\epsilon$ diminue généralement au fil du temps.

*   **Convergence** : Sous certaines conditions, le Q-Learning converge vers $Q^*(s, a)$.

### SARSA (pour information)

**SARSA** (State-Action-Reward-State-Action) est un algorithme TD **on-policy**. Sa règle de mise à jour utilise la Q-value de l'action $a'$ *réellement choisie* dans l'état $s'$ (selon la policy d'exploration actuelle) :
$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ R + \gamma Q(s', a') - Q(s, a) \right]$$
SARSA apprend la valeur de la policy suivie, tandis que Q-Learning apprend la valeur de l'optimal policy.

## III. Implémentation en Python (Q-Learning)

Implémentons un agent Q-Learning sur un environnement discret simple (`FrozenLake-v1`) avec `gymnasium`.

### Installation

```bash
pip install gymnasium numpy
```

### Code Python

```python
import numpy as np
import gymnasium as gym

env = gym.make("FrozenLake-v1", is_slippery=True)

n_states = env.observation_space.n
n_actions = env.action_space.n
q_table = np.zeros((n_states, n_actions), dtype=np.float32)

alpha = 0.1
gamma = 0.99
epsilon = 1.0
epsilon_min = 0.05
# Décroissance douce: epsilon atteint ~0.05 après plusieurs milliers d'épisodes.
epsilon_decay = 0.9995
episodes = 10_000
max_steps = 200

for episode in range(episodes):
    state, _ = env.reset()
    done = False

    for _ in range(max_steps):
        if np.random.rand() < epsilon:
            action = env.action_space.sample()
        else:
            action = int(np.argmax(q_table[state]))

        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated

        best_next = np.max(q_table[next_state])
        discount_mask = 0.0 if done else 1.0
        td_target = reward + gamma * best_next * discount_mask
        q_table[state, action] += alpha * (td_target - q_table[state, action])

        state = next_state
        if done:
            break

    epsilon = max(epsilon_min, epsilon * epsilon_decay)

print("Entraînement terminé.")
print("Q-table apprise :")
print(q_table)
```

### Limitations et améliorations

*   **Table Q limitée** : sur de grands espaces d'états, la Q-table devient impraticable.
*   **Récompenses rares** : certains environnements apprennent lentement sans reward shaping.
*   **Passage au Deep RL** : DQN, PPO ou SAC sont généralement préférables pour des tâches complexes.

## Références

*   [1] Sutton, R. S., & Barto, A. G. (2018). Reinforcement Learning: An Introduction. MIT Press. [Lien](http://incompleteideas.net/book/the-book-2nd.html)
*   [2] Gymnasium Documentation. *API Reference*. [Lien](https://gymnasium.farama.org/)
*   [3] FreeCodeCamp. *Q-Learning Explained*. [Lien](https://www.freecodecamp.org/news/an-introduction-to-q-learning-reinforcement-learning-1811b4c17977/)
