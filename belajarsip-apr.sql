-- MySQL dump 10.13  Distrib 8.0.23, for Linux (x86_64)
--
-- Host: localhost    Database: belajarsip
-- ------------------------------------------------------
-- Server version	8.0.23-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Software','2021-03-25 04:54:45'),(2,'JavaScript','2021-03-29 15:23:06');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category_id` int NOT NULL,
  `level_id` int NOT NULL,
  `price` bigint NOT NULL DEFAULT '0',
  `session_start` time NOT NULL,
  `duration` int unsigned NOT NULL,
  `start_date` date NOT NULL,
  `day_id` int NOT NULL,
  `description` longtext,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courses_FK` (`category_id`),
  KEY `courses_FK_1` (`level_id`),
  KEY `courses_FK_2` (`day_id`),
  CONSTRAINT `courses_FK` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `courses_FK_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`),
  CONSTRAINT `courses_FK_2` FOREIGN KEY (`day_id`) REFERENCES `days` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Javascript for Cat',1,1,0,'08:00:00',5400000,'2021-03-26',1,'A long description',NULL),(2,'Java Script for Human',2,3,10,'09:00:00',5400000,'2021-03-27',1,NULL,NULL),(3,'Java Script for Alien',1,2,15,'09:00:00',5400000,'2021-03-27',2,NULL,NULL),(4,'HTML CSS Fundamentals',1,1,4,'08:00:00',5400000,'2021-03-29',1,'This Description',NULL),(6,'New Advanced Javascript Course ',2,2,50,'09:14:00',9000000,'2021-04-19',1,'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ',NULL),(7,'New Advanced Javascript Course ',2,2,50,'09:14:00',9000000,'2021-04-19',1,'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ',NULL),(8,'New Advanced Javascript Course ',2,2,50,'09:14:00',9000000,'2021-04-19',1,'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ',NULL),(9,'New Advanced Javascript Course ',2,2,50,'09:14:00',9000000,'2021-04-19',1,'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ',NULL);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `days`
--

DROP TABLE IF EXISTS `days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `days` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `days`
--

LOCK TABLES `days` WRITE;
/*!40000 ALTER TABLE `days` DISABLE KEYS */;
INSERT INTO `days` VALUES (0,'Sunday'),(1,'Monday'),(2,'Tuesday'),(3,'Wednesday'),(4,'Thursday'),(5,'Friday'),(6,'Saturday');
/*!40000 ALTER TABLE `days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (1,'Beginner','2021-03-25 04:55:40'),(2,'Intermediete','2021-03-29 08:31:44'),(3,'Expert','2021-03-29 08:31:44');
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'instructor'),(2,'student');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcourses`
--

DROP TABLE IF EXISTS `subcourses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcourses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `course_id` int NOT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_sections_FK` (`course_id`),
  CONSTRAINT `course_sections_FK` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcourses`
--

LOCK TABLES `subcourses` WRITE;
/*!40000 ALTER TABLE `subcourses` DISABLE KEYS */;
INSERT INTO `subcourses` VALUES (4,'Java Script Beginner',1,'2021-03-29'),(6,'ES 6 ',1,'2021-03-29'),(7,'Java Script Expert',1,'2021-04-01'),(8,'React JS Beginner',2,'2021-03-29'),(9,'Html for Expert',1,'2021-04-07'),(10,'CSS Introduction',2,'2021-04-07'),(11,'CSS Introduction Advanced',1,'2021-03-29');
/*!40000 ALTER TABLE `subcourses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_course`
--

DROP TABLE IF EXISTS `user_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_course` (
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `user_course_FK_1` (`course_id`),
  KEY `user_course_FK` (`user_id`),
  CONSTRAINT `user_course_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_course_FK_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_course`
--

LOCK TABLES `user_course` WRITE;
/*!40000 ALTER TABLE `user_course` DISABLE KEYS */;
INSERT INTO `user_course` VALUES (1,1,'2021-03-25 04:57:02'),(13,1,'2021-03-25 05:00:26'),(7,1,'2021-03-28 07:55:16'),(3,1,'2021-03-29 10:35:22'),(18,1,'2021-04-01 07:19:23'),(18,4,'2021-04-03 06:35:39'),(1,2,'2021-04-07 15:04:30'),(1,3,'2021-04-07 15:04:47'),(1,4,'2021-04-07 15:08:26'),(18,6,'2021-04-09 02:46:48'),(18,7,'2021-04-09 02:47:16'),(18,8,'2021-04-09 02:48:42'),(18,9,'2021-04-09 02:48:49');
/*!40000 ALTER TABLE `user_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subcourse`
--

DROP TABLE IF EXISTS `user_subcourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_subcourse` (
  `user_id` int NOT NULL,
  `subcourse_id` int NOT NULL,
  `score` int NOT NULL DEFAULT '0',
  KEY `user_score_FK` (`user_id`),
  KEY `user_score_FK_1` (`subcourse_id`),
  CONSTRAINT `user_score_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_score_FK_1` FOREIGN KEY (`subcourse_id`) REFERENCES `subcourses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subcourse`
--

LOCK TABLES `user_subcourse` WRITE;
/*!40000 ALTER TABLE `user_subcourse` DISABLE KEYS */;
INSERT INTO `user_subcourse` VALUES (1,6,70),(1,7,90),(1,8,70);
/*!40000 ALTER TABLE `user_subcourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT 'User Belajarsip',
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role_id` int DEFAULT '2',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expired` bigint DEFAULT NULL,
  `otp` varchar(4) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_UN` (`username`,`email`),
  KEY `users_FK` (`role_id`),
  CONSTRAINT `users_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Burhan Updatea','asd','ragil@sipamungkas.com','$2b$10$12/niiDE49KdTVasZ26rtu53O5u0xbEHEXmRwQZYDR2dxUY0joWpS',2,'c38cdeeef5e5c44c170c043bcd9d2cdc480ea472',1617081311338,'193','08222123123123','avatars/avatar-1-1617855038211.png','2021-03-25 04:50:45'),(3,'ragail','ragil','ragil@mail.com','$2b$10$/S6sDZK5v7d3/SQ8IUYv1uapl6stCoVMzM7.2dMEigJ9UP1sPDlZy',2,NULL,NULL,NULL,'082220488119',NULL,'2021-03-26 03:37:52'),(7,'ragail','ragail2','ragail@mail.com','$2b$10$/S6sDZK5v7d3/SQ8IUYv1uapl6stCoVMzM7.2dMEigJ9UP1sPDlZy',2,NULL,NULL,NULL,NULL,NULL,'2021-03-27 04:18:49'),(13,'ragail','ragaasil2asd','ragail@mail.com','$2b$10$/S6sDZK5v7d3/SQ8IUYv1uapl6stCoVMzM7.2dMEigJ9UP1sPDlZy',2,NULL,NULL,NULL,NULL,NULL,'2021-03-27 04:21:13'),(18,'Burhan','burhan','burhan@mail.com','$2b$10$/S6sDZK5v7d3/SQ8IUYv1uapl6stCoVMzM7.2dMEigJ9UP1sPDlZy',1,NULL,NULL,NULL,'08222123123','avatars/avatar-18-1617841017228.png','2021-03-31 16:18:52'),(19,'user','tes_register','tes@mail.com','$2b$10$VNZSa3vkOYjQoyUxFK6Bk.AvWMk51HxzELpkfuv22rJ2cbQjGjPXG',2,NULL,NULL,NULL,NULL,NULL,'2021-04-05 03:17:29'),(20,'Burhanaa','burhana','burhana@mail.com','$2b$10$DR3UDstDUUM9/NLhoRIXgOsEBK58X8jcaTlbbdnsI2Zp/Zx7xzBmS',2,NULL,NULL,NULL,NULL,NULL,'2021-04-05 06:50:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-10 15:27:59
