CREATE TABLE `giftcards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`sellPrice` int NOT NULL DEFAULT 0,
	`sellDiscount` int NOT NULL DEFAULT 0,
	`buyPrice` int NOT NULL DEFAULT 0,
	`buyDiscount` int NOT NULL DEFAULT 0,
	`note` text,
	`available` int NOT NULL DEFAULT 1,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `giftcards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `priceHistories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`giftcardId` int NOT NULL,
	`sellPrice` int NOT NULL,
	`sellDiscount` int NOT NULL,
	`buyPrice` int NOT NULL,
	`buyDiscount` int NOT NULL,
	`changedBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `priceHistories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
