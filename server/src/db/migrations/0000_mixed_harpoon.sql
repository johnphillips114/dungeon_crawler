CREATE TABLE `runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_name` text NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`floors_reached` integer DEFAULT 1 NOT NULL,
	`enemies_killed` integer DEFAULT 0 NOT NULL,
	`killed_by` text,
	`created_at` integer NOT NULL
);
