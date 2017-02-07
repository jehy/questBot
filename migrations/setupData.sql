/*
SQLyog Ultimate v12.14 (64 bit)
MySQL - 5.5.50-MariaDB : Database - quest
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`quest` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `quest`;

/*Data for the table `items` */

insert  into `items`(`id`,`quest_id`,`name`) values
(1,1,'кости'),
(2,1,'помада');

/*Data for the table `quests` */

insert  into `quests`(`id`,`name`) values
(1,'Тестовый квест');

/*Data for the table `stage2stage` */

insert  into `stage2stage`(`id`,`from_stage`,`to_stage`,`choice`,`quest_id`) values
(1,1,2,0,1),
(2,2,3,1,1),
(3,2,4,2,1),
(4,3,5,0,1),
(5,4,5,0,1),
(6,5,6,0,1),
(7,6,7,1,1),
(8,6,8,2,1),
(9,7,1,0,1),
(10,8,1,0,1),
(11,7,9,1,1),
(12,8,9,1,1),
(13,7,10,2,1),
(14,8,10,2,1),
(15,9,1,0,1),
(16,10,1,0,1);

/*Data for the table `stage_actions` */

insert  into `stage_actions`(`id`,`quest_id`,`stage_id`,`value`,`module`,`extra_id`,`checker`,`checker_extra_id`) values
(1,1,1,'Посмотреть в зеркало',NULL,NULL,NULL,NULL),
(2,1,2,'Мужчина','setGender',NULL,NULL,NULL),
(3,1,2,'Женщина','setGender',NULL,NULL,NULL),
(4,1,3,'Войти в портал',NULL,NULL,NULL,NULL),
(5,1,4,'Войти в портал',NULL,NULL,NULL,NULL),
(6,1,5,'Взять кости','takeItem',1,'itemNotExists',1),
(7,1,5,'Взять помаду','takeItem',2,'itemNotExists',2),
(8,1,5,'Рисовать',NULL,NULL,'itemExists',2),
(9,1,6,'Оросить пентаграмму кровью','checkGender',NULL,NULL,NULL),
(10,1,7,'Умереть жестокой противоестественной смертью','die',NULL,NULL,NULL),
(11,1,8,'Умереть жестокой противоестественной смертью','die',NULL,NULL,NULL),
(12,1,7,'Сыграть в кости','playDice',NULL,'itemExists',1),
(13,1,8,'Сыграть в кости','playDice',NULL,'itemExists',1),
(15,1,9,'Попробовать ещё раз','die',NULL,NULL,NULL),
(16,1,10,'Пройти снова!','finish',NULL,NULL,NULL);

/*Data for the table `stage_image` */

insert  into `stage_image`(`id`,`quest_id`,`stage_id`,`placement`,`image`,`caption`) values
(1,1,2,'after','unknown_gender.gif','Вы видите в зеркале'),
(2,1,3,'after','male.jpg','Это мужчина!'),
(3,1,4,'after','female.jpg','Это женщина!'),
(4,1,6,'after','pentagram.jpg','Да, вы это нарисовали!'),
(5,1,7,'after','demon_male.jpeg','Явилось ОНО!'),
(6,1,8,'after','demon_female.jpg','Явилось ОНО!');

/*Data for the table `stages` */

insert  into `stages`(`id`,`description`,`quest_id`) values
(1,'Вы оказываетесь в огромном, безграничном и бесплотном нигде.\r\nВокруг есть большое ростовое зеркало и несколько мерцающих дверей. Хочется назвать их \"порталами\".\r\nОдин из них мерцает красным заревом, остальные темны и затянуты паутиной.',1),
(2,'Изображение туманное и неясное, хоть как-то можно разглядеть, что там...',1),
(3,'Хорошо, вы хотя бы поняли, что вы мужчина. Больше здесь делать, видимо, ничего...',1),
(4,'Хорошо, вы хотя бы поняли, что вы женщина. Больше здесь делать, видимо, ничего...',1),
(5,'Вы оказываетесь в тесном чулане. Вокруг только паркетные доски, стены и пара игральных костей.\r\nХотя постойте... Ещё в углу лежит почти засохшая красная женская помада...',1),
(6,'Вы машинально начинаете водить помадой по полу, и через некоторое время с ужасом понимаете, что же нарисовали...',1),
(7,'В пентаграмме материализовывается огромный демон. \"И кто тут у нас тут такой противный?\"',1),
(8,'В пентаграмме материализовывается огромный демон с тентаклями по два метра. \"Привет, моя сладкая!\"',1),
(9,'Демон злобно вскрикивает, выходит из пентаграммы и вы умираете противоестестенной смертью.',1),
(10,'Довольный демон хохочет и  испаряется в клубах дыма, а на ваши глаза падает пелена и вас куда-то уносит... Поздравляю, вы прошли квест!',1);

/*Data for the table `user_item` */

/*Data for the table `user_quest` */

insert  into `user_quest`(`id`,`user_id`,`quest_id`,`stage_id`,`completed`) values
(1,1,1,4,1);

/*Data for the table `users` */

insert  into `users`(`id`,`added`,`modified`,`telegram_id`,`first_name`,`username`,`gender`,`current_quest`) values
(1,'2017-02-07 13:34:00','2017-02-07 13:34:00',5928056,'Jehy','Jehy_rus','F',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
