
/*Table structure for table `quests` */


CREATE TABLE `quests` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


/*Table structure for table `stages` */


CREATE TABLE `stages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `quest_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stages_quest_id` (`quest_id`),
  CONSTRAINT `stages_quest_id` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;


/*Table structure for table `users` */


CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `added` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  `telegram_id` int(10) unsigned DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  `current_quest` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_quest` (`current_quest`),
  CONSTRAINT `user_quest` FOREIGN KEY (`current_quest`) REFERENCES `quests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


/*Table structure for table `items` */

CREATE TABLE `items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quest_id` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `item_quest_id` (`quest_id`),
  CONSTRAINT `item_quest_id` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


/*Table structure for table `stage2stage` */


CREATE TABLE `stage2stage` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `from_stage` int(10) unsigned NOT NULL,
  `to_stage` int(10) unsigned NOT NULL,
  `choice` int(10) unsigned NOT NULL,
  `quest_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stage2stage_from_stage` (`from_stage`),
  KEY `stage2stage_to_stage` (`to_stage`),
  KEY `quest` (`quest_id`),
  CONSTRAINT `stage2stage_quest_id` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`),
  CONSTRAINT `stage2stage_from_stage` FOREIGN KEY (`from_stage`) REFERENCES `stages` (`id`),
  CONSTRAINT `stage2stage_to_stage` FOREIGN KEY (`to_stage`) REFERENCES `stages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

/*Table structure for table `stage_actions` */


CREATE TABLE `stage_actions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quest_id` int(11) unsigned NOT NULL,
  `stage_id` int(11) unsigned NOT NULL,
  `value` varchar(255) NOT NULL,
  `module` varchar(255) DEFAULT NULL,
  `extra_id` int(10) unsigned DEFAULT NULL COMMENT 'item or smth',
  `checker` varchar(255) DEFAULT NULL,
  `checker_extra_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_actions_quest_id` (`quest_id`),
  KEY `stage_actions_stage_id` (`stage_id`),
  CONSTRAINT `stage_actions_quest_id` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`),
  CONSTRAINT `stage_actions_stage_id` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

/*Table structure for table `stage_image` */


CREATE TABLE `stage_image` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quest_id` int(10) unsigned NOT NULL,
  `stage_id` int(10) unsigned NOT NULL,
  `placement` enum('before','after') NOT NULL,
  `image` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stage_image_quest_id` (`quest_id`),
  KEY `stage_image_stage_id` (`stage_id`),
  CONSTRAINT `stage_image_quest_id` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`),
  CONSTRAINT `stage_image_stage_id` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


/*Table structure for table `user_item` */


CREATE TABLE `user_item` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `quest_id` int(10) unsigned NOT NULL,
  `item_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_item_item_id` (`item_id`),
  KEY `user_item_user_id` (`user_id`),
  KEY `user_item_quest_id` (`quest_id`),
  CONSTRAINT `user_item_item_id` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  CONSTRAINT `user_item_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_item_quest_id` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

/*Table structure for table `user_quest` */


CREATE TABLE `user_quest` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `quest_id` int(10) unsigned NOT NULL,
  `stage_id` int(10) unsigned NOT NULL,
  `completed` int(10) unsigned NOT NULL COMMENT 'can be completed with different results',
  PRIMARY KEY (`id`),
  KEY `user_quest_user_id` (`user_id`),
  KEY `user_quest_stage_id` (`stage_id`),
  KEY `user_quest_quest_id` (`quest_id`),
  CONSTRAINT `user_quest_quest_id` FOREIGN KEY (`quest_id`) REFERENCES `quests` (`id`),
  CONSTRAINT `user_quest_stage_id` FOREIGN KEY (`stage_id`) REFERENCES `stages` (`id`),
  CONSTRAINT `user_quest_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
