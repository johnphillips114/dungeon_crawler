# Dungeon Crawler — Project Plan

A browser-based, turn-based, procedurally generated dungeon crawler with an ASCII/text grid renderer.

---

## Tech Stack

| Layer              | Technology          |
|--------------------|---------------------|
| Frontend framework | React               |
| Build tooling      | Vite + Bun          |
| Language           | TypeScript          |
| Backend runtime    | Bun                 |
| Backend framework  | Hono                |
| Database           | SQLite              |
| ORM                | Drizzle             |

---

## Project Structure

```
dungeon_crawler/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── game/            # Core game logic (pure TS, no React)
│   │   │   ├── map/         # Dungeon generation
│   │   │   ├── entities/    # Player, enemies, items
│   │   │   ├── combat/      # Turn-based combat system
│   │   │   └── engine/      # Game loop, turn manager, state
│   │   ├── hooks/           # React hooks wrapping game engine
│   │   └── styles/          # CSS
│   └── index.html
├── server/                  # Bun + Hono backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── db/              # Drizzle schema + migrations
│   │   └── index.ts         # Hono app entry point
│   └── drizzle.config.ts
└── PROJECT_PLAN.md
```

---

## Milestones

### Milestone 1 — Project Setup ✅
- [x] Initialise monorepo with client/ and server/ directories
- [x] Set up Vite + React + TypeScript in client/
- [x] Set up Bun + Hono + TypeScript in server/
- [x] Set up Drizzle + SQLite in server/
- [x] Configure client proxy to server for local dev
- [x] Confirm dev servers run with `bun dev`

---

### Milestone 2 — Map Generation
- [ ] Define core data types: `Tile`, `Room`, `DungeonMap`, `Position`
- [ ] Implement BSP (Binary Space Partitioning) dungeon generator
  - Recursively split space into sections
  - Place a room in each section
  - Connect rooms with corridors
- [ ] Render the generated map as an ASCII grid in the browser
  - Floor: `.`
  - Wall: `#`
  - Corridor: `·`
- [ ] Verify maps are traversable (all rooms reachable)

---

### Milestone 3 — Player & Movement
- [ ] Define `Player` entity type (position, HP, stats)
- [ ] Place player in starting room
- [ ] Handle keyboard input (arrow keys / WASD)
- [ ] Move player through walkable tiles only
- [ ] Implement fog of war — only reveal explored tiles
- [ ] Place exit staircase (`>`) in a room far from the start

---

### Milestone 4 — Enemies
- [ ] Define `Enemy` entity type (position, HP, stats, type)
- [ ] Define a small set of enemy types (e.g. Rat, Goblin, Troll)
- [ ] Scatter enemies across the map on generation
- [ ] Implement simple enemy AI: move toward player if in range
- [ ] Enemies act after player each turn (turn manager)

---

### Milestone 5 — Combat
- [ ] Trigger combat when player walks into an enemy tile
- [ ] Implement turn-based attack resolution
  - Damage = attacker.attack - defender.defense (min 1)
- [ ] Display combat log (last N messages shown on screen)
- [ ] Enemy dies when HP reaches 0; tile becomes walkable
- [ ] Player dies when HP reaches 0 — game over screen
- [ ] Award XP on kill; implement level-up with stat increase

---

### Milestone 6 — Items & Inventory
- [ ] Define `Item` type (weapon, armour, potion, scroll)
- [ ] Scatter items on the map (floors and chests)
- [ ] Player can pick up items by walking over them
- [ ] Simple inventory UI (list of held items)
- [ ] Use/equip items from inventory
  - Potions: restore HP
  - Weapons: increase attack stat
  - Armour: increase defense stat

---

### Milestone 7 — Floor Progression
- [ ] Descending staircase advances to next floor
- [ ] Each new floor regenerates the map with increased difficulty
  - More/tougher enemies
  - Better loot
- [ ] Track and display current floor number

---

### Milestone 8 — Backend & Persistence
- [ ] Design DB schema:
  - `runs` — id, player_name, score, floors_reached, killed_by, created_at
- [ ] POST /api/runs — save a completed (or failed) run
- [ ] GET /api/leaderboard — top 10 runs by score
- [ ] Display leaderboard on game over / main menu screen

---

### Milestone 9 — Polish
- [ ] Main menu screen (New Game, Leaderboard)
- [ ] Sidebar HUD: HP, level, XP, floor, inventory
- [ ] Colour coding in the ASCII grid (enemies red, items yellow, player white)
- [ ] Animate combat log messages
- [ ] Sound effects (optional — Web Audio API beeps/blips)
- [ ] Mobile-friendly virtual D-pad (optional)

---

## Core Design Rules

- **Game logic is pure TypeScript** — no React, no DOM inside `game/`. The engine is a plain state machine.
- **React is the view layer only** — hooks read game state and dispatch actions; components render output.
- **Permadeath** — no save/load of in-progress runs. Only completed runs are persisted.
- **Turn-based** — nothing moves until the player acts.

---

## Scoring

Score is calculated at run end:

```
score = (floors_reached * 100) + (enemies_killed * 10) + gold_collected
```

---

## Future Ideas (Post-V1)

- Status effects (poison, stun, blindness)
- Ranged combat (bows, wands)
- Scrolls with random/unknown effects
- Multiple dungeon themes (cave, castle, crypt)
- Minimap
- Multiple character classes (warrior, rogue, mage)
