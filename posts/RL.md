Le Reinforcement Learning (RL) est une approche de l'intelligence artificielle où un agent apprend à prendre des décisions en interagissant avec un environnement. L'objectif est de maximiser une récompense cumulative à long terme. Ce document couvre les bases mathématiques du RL et une implémentation simple en Luau pour Roblox.

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

## III. Implémentation en Luau sur Roblox

Implémentons un agent Q-Learning dans un environnement simple de type "Gridworld" sur Roblox.

### Environnement Roblox : Gridworld

*   **Agent** : Un `Part` qui se déplace.
*   **Cible (Goal)** : Un `Part` à atteindre (récompense positive).
*   **Obstacles (Traps)** : Des `Part` à éviter (pénalité négative).
*   **Grille Implicite** : Les états sont des positions discrètes (coordonnées `(x, z)` arrondies) sur une grille. Les actions sont des déplacements `Vector3` (UP, DOWN, LEFT, RIGHT).

### Code Luau pour l'Agent Q-Learning

Le script suivant est attaché à l'objet `Agent` dans Roblox Studio.

```lua
--!strict

local Agent = script.Parent :: Part
local Workspace = game:GetService("Workspace")

local GoalPart = Workspace:WaitForChild("Goal") :: Part
local ObstacleParts = Workspace:WaitForChild("Obstacles"):GetChildren() :: {Part}

-- Paramètres du Q-Learning
local ALPHA = 0.1 
local GAMMA = 0.9 
local EPSILON_START = 1.0 
local EPSILON_END = 0.01 
local EPSILON_DECAY_RATE = 0.001 
local NUM_EPISODES = 5000 
local MAX_STEPS_PER_EPISODE = 100 

-- Actions possibles
local ACTIONS = {
    Vector3.new(0, 0, -1), -- Forward
    Vector3.new(0, 0, 1),  -- Backward
    Vector3.new(-1, 0, 0), -- Left
    Vector3.new(1, 0, 0)   -- Right
}
local ACTION_NAMES = {"Forward", "Backward", "Left", "Right"}

-- Configuration de la grille et de la carte
local GRID_SIZE = 2 
local MAP_X_MIN, MAP_X_MAX = -20, 20
local MAP_Z_MIN, MAP_Z_MAX = -20, 20

-- Q-Table: {[state_key]: {[action_index]: q_value}}
local QTable: {[string]: {[number]: number}} = {}

-- Convertit une position 3D en clé d'état discrète
local function getState(position: Vector3): string
    local x = math.floor(position.X / GRID_SIZE) * GRID_SIZE
    local z = math.floor(position.Z / GRID_SIZE) * GRID_SIZE
    return string.format("%d,%d", x, z)
end

-- Calcule la récompense et détermine si l'épisode est terminé
local function getRewardAndDone(newPosition: Vector3): (number, boolean)
    local reward = -0.1 
    local done = false

    if (newPosition - GoalPart.Position).Magnitude < GRID_SIZE then
        reward = 100 
        done = true
    end

    for _, obstacle in ObstacleParts do
        if (newPosition - obstacle.Position).Magnitude < GRID_SIZE then
            reward = -50 
            done = true
            break
        end
    end

    if newPosition.X < MAP_X_MIN or newPosition.X > MAP_X_MAX or
       newPosition.Z < MAP_Z_MIN or newPosition.Z > MAP_Z_MAX then
        reward = -20 
        done = true
    end

    return reward, done
end

-- Choisit une action selon la stratégie epsilon-greedy
local function chooseAction(stateKey: string, currentEpsilon: number): number
    if QTable[stateKey] == nil then
        QTable[stateKey] = {}
        for i = 0, #ACTIONS - 1 do
            QTable[stateKey][i] = 0
        end
    end

    if math.random() < currentEpsilon then
        return math.random(0, #ACTIONS - 1)
    else
        local bestAction = 0
        local maxQ = -math.huge
        for actionIndex, qValue in pairs(QTable[stateKey]) do
            if qValue > maxQ then
                maxQ = qValue
                bestAction = actionIndex
            end
        end
        return bestAction
    end
end

-- Met à jour la Q-Table
local function updateQTable(stateKey: string, actionIndex: number, reward: number, nextStateKey: string)
    if QTable[nextStateKey] == nil then
        QTable[nextStateKey] = {}
        for i = 0, #ACTIONS - 1 do
            QTable[nextStateKey][i] = 0
        end
    end

    local oldQ = QTable[stateKey][actionIndex]
    local maxNextQ = -math.huge
    for _, qValue in pairs(QTable[nextStateKey]) do
        maxNextQ = math.max(maxNextQ, qValue)
    end

    local newQ = oldQ + ALPHA * (reward + GAMMA * maxNextQ - oldQ)
    QTable[stateKey][actionIndex] = newQ
end

-- Fonction d'entraînement de l'agent
local function trainAgent()
    local currentEpsilon = EPSILON_START
    local originalAgentPosition = Agent.Position

    for episode = 1, NUM_EPISODES do
        Agent.Position = originalAgentPosition
        local currentState = Agent.Position
        local currentStateKey = getState(currentState)
        local done = false
        local totalReward = 0

        for step = 1, MAX_STEPS_PER_EPISODE do
            local actionIndex = chooseAction(currentStateKey, currentEpsilon)
            local actionVector = ACTIONS[actionIndex + 1]

            local nextPosition = currentState + actionVector * GRID_SIZE
            Agent.Position = nextPosition

            local reward, isDone = getRewardAndDone(nextPosition)
            local nextStateKey = getState(nextPosition)

            updateQTable(currentStateKey, actionIndex, reward, nextStateKey)

            currentState = nextPosition
            currentStateKey = nextStateKey
            totalReward += reward
            done = isDone

            if done then
                break
            end
        end

        currentEpsilon = math.max(EPSILON_END, currentEpsilon - EPSILON_DECAY_RATE)

        if episode % 100 == 0 then
            print(string.format("Episode %d: Total Reward = %.2f, Epsilon = %.2f", episode, totalReward, currentEpsilon))
        end
    end
    print("Entraînement terminé.")
end

-- Exécute la politique optimale apprise
local function runOptimalPolicy()
    print("Exécution de la politique optimale...")
    Agent.Position = script.Parent.Position
    local currentState = Agent.Position
    local currentStateKey = getState(currentState)
    local done = false
    local steps = 0

    while not done and steps < MAX_STEPS_PER_EPISODE * 2 do 
        local actionIndex = chooseAction(currentStateKey, 0) 
        local actionVector = ACTIONS[actionIndex + 1]

        local nextPosition = currentState + actionVector * GRID_SIZE
        Agent.Position = nextPosition
        currentState = nextPosition
        currentStateKey = getState(currentState)

        local _, isDone = getRewardAndDone(nextPosition)
        done = isDone
        steps += 1

        task.wait(0.1)
    end
    print("Exécution terminée.")
end

-- Lancement
trainAgent()
runOptimalPolicy()

-- Sauvegarde optionnelle de la Q-table
-- game:GetService("DataStoreService"):GetDataStore("QTableStore"):SetAsync("AgentQTable", QTable)
```

### Configuration dans Roblox Studio

1.  **Créer les `Part`** : Un `Part` nommé `Agent`, un `Part` nommé `Goal`, et un `Model` nommé `Obstacles` contenant plusieurs `Part` pour les obstacles. Assurez-vous que tous sont `Anchored`.
2.  **Attacher le script** : Créez un `Script` à l'intérieur de l'`Agent` Part et collez le code Luau ci-dessus.
3.  **Lancer** : Exécutez le jeu en mode `Run` ou `Play`. L'agent s'entraînera et exécutera sa politique apprise.

### Limitations et Améliorations

Cet exemple est basique. Pour des environnements plus complexes :

*   **Taille de la Q-Table** : Les grands espaces d'états/actions peuvent saturer la mémoire. Le Deep Reinforcement Learning (avec des réseaux de neurones) est nécessaire, mais difficile à implémenter directement en Luau.
*   **Vitesse d'Entraînement** : L'entraînement peut être lent. Pour des jeux complexes, l'entraînement hors ligne sur un serveur puissant est préférable, avec chargement du modèle appris dans Roblox.

Malgré cela, pour des problèmes de navigation simples ou des comportements d'NPCs réactifs, le Q-Learning en Luau est une solution viable. Des améliorations incluent des récompenses plus fines, des états plus riches (vitesse, direction), et des actions plus variées.

## Références

*   [1] Sutton, R. S., & Barto, A. G. (2018). Reinforcement Learning: An Introduction. MIT Press. [Lien](http://incompleteideas.net/book/the-book-2nd.html)
*   [2] Roblox Creator Documentation. *Luau Language Reference*. [Lien](https://create.roblox.com/docs/reference/luau)
*   [3] FreeCodeCamp. *Q-Learning Explained*. [Lien](https://www.freecodecamp.org/news/an-introduction-to-q-learning-reinforcement-learning-1811b4c17977/)
