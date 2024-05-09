-- phpMyAdmin SQL Dump
-- version 5.2.1-1.el9
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 09, 2024 at 05:42 PM
-- Server version: 10.5.22-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `allergens`
--

CREATE TABLE `allergens` (
  `ID` int(11) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `acronym` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `allergens`
--

INSERT INTO `allergens` (`ID`, `name`, `acronym`) VALUES
(23, 'Laktoosi', 'L'),
(24, 'Gluteeni', 'G'),
(25, 'Maito', 'M'),
(26, 'Pähkinät', 'P'),
(27, 'Kananmuna', 'K'),
(28, 'Soijapavut', 'N'),
(29, 'Äyriäiset', 'S'),
(30, 'Kalat', 'R'),
(31, 'Maapähkinät', 'D'),
(32, 'Seesami', 'E'),
(33, 'Ohra', 'O'),
(34, 'Vehnä', 'V'),
(35, 'Manteli', 'A'),
(36, 'Hasselpähkinä', 'H'),
(37, 'Cashew', 'J'),
(38, 'Sinappi', 'U'),
(39, 'Selleri', 'Y'),
(40, 'Lupiini', 'T');

-- --------------------------------------------------------

--
-- Table structure for table `burgers`
--

CREATE TABLE `burgers` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Price` double(10,2) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `burgers`
--

INSERT INTO `burgers` (`ID`, `Name`, `Description`, `Price`, `filename`) VALUES
(34, 'Classic burger', 'Very tasty classic burger', 9.55, 'add-burger-upload-name-1715153760204-479143918.png'),
(36, 'Bacon burger', 'Delicious burger with some crisp bacon', 11.50, 'add-burger-upload-name-1715153896684-139768144.png'),
(37, 'Crispy chicken burger', 'Fresh burger with grilled chicken', 9.95, 'add-burger-upload-name-1715153999990-825832431.png'),
(38, 'Super Stacker', 'Huge classic burger with extra beef', 15.00, 'add-burger-upload-name-1715154064159-291907993.png'),
(39, 'Peanut Special', 'A burger with peanuts?', 7.77, 'add-burger-upload-name-1715154151401-350385517.png'),
(40, 'Veggie Burger', 'A fresh bite of veggies', 6.50, 'add-burger-upload-name-1715154258320-17625581.png'),
(41, 'Double cheese burger', 'Classic burger with extra cheese', 10.00, 'add-burger-upload-name-1715154378879-928586565.png');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_info` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `name`, `contact_info`) VALUES
(1, 'Jimi', 'awds@gmail.com'),
(2, 'Jimi', 'asdda@gmail.com'),
(3, 'Mikael', 'mikael@gmail.com'),
(4, 'Mikael', 'aads@gmail.com'),
(5, 'petteri', 'sadas@gmail.com'),
(6, 'Ile', 'jokinen@gmail.com'),
(7, 'Juha', 'asdas@gmail.com'),
(8, 'Jimbo', 'adsads@gmail.com'),
(9, 'pekka', 'asdss@gmail.com'),
(10, 'Jorma', 'asds@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`ID`, `Name`) VALUES
(1, 'Juusto'),
(2, 'Naudanliha'),
(3, 'Majoneesi'),
(4, 'Salaatti'),
(5, 'Tomaatti'),
(6, 'Ketsuppi'),
(7, 'Chili'),
(8, 'Lohi'),
(9, 'Sämpylä'),
(10, 'Sipuli'),
(11, 'Cashewpähkinä'),
(12, 'Maapähkinä'),
(13, 'Manteli'),
(14, 'Kana'),
(15, 'Paprika'),
(16, 'jee'),
(17, 'jaa'),
(18, 'juu'),
(19, 'Ahven'),
(21, 'pihvi'),
(22, 'Sianliha'),
(23, 'Broileri'),
(24, 'Pähkinät'),
(25, 'Tofu'),
(26, 'adsdas'),
(27, 'dasda'),
(28, 'en'),
(29, 'kä');

-- --------------------------------------------------------

--
-- Table structure for table `join_allergens`
--

CREATE TABLE `join_allergens` (
  `allergens_id` int(11) NOT NULL,
  `burger_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `join_allergens`
--

INSERT INTO `join_allergens` (`allergens_id`, `burger_id`) VALUES
(23, 34),
(23, 36),
(23, 37),
(23, 38),
(23, 39),
(23, 40),
(23, 41),
(24, 34),
(24, 36),
(24, 37),
(24, 38),
(24, 39),
(24, 40),
(24, 41),
(25, 39),
(26, 39),
(27, 37),
(31, 38),
(31, 39),
(33, 41),
(34, 34),
(34, 36),
(34, 39),
(34, 40),
(34, 41),
(35, 39),
(36, 39),
(37, 39),
(38, 34),
(38, 36),
(38, 37),
(38, 38),
(38, 39),
(38, 40),
(38, 41);

-- --------------------------------------------------------

--
-- Table structure for table `join_ingredients`
--

CREATE TABLE `join_ingredients` (
  `ingredient_id` int(11) NOT NULL,
  `burger_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `join_ingredients`
--

INSERT INTO `join_ingredients` (`ingredient_id`, `burger_id`) VALUES
(1, 34),
(1, 36),
(1, 38),
(1, 39),
(1, 41),
(2, 34),
(2, 36),
(2, 38),
(2, 39),
(2, 41),
(3, 34),
(3, 36),
(3, 38),
(3, 39),
(3, 41),
(4, 34),
(4, 37),
(4, 38),
(4, 39),
(4, 40),
(4, 41),
(5, 36),
(5, 37),
(5, 40),
(6, 34),
(6, 38),
(6, 39),
(6, 41),
(9, 34),
(9, 37),
(9, 38),
(9, 39),
(9, 40),
(9, 41),
(10, 34),
(10, 36),
(10, 37),
(10, 38),
(10, 39),
(10, 40),
(10, 41),
(22, 36),
(23, 37),
(24, 39),
(25, 40);

-- --------------------------------------------------------

--
-- Table structure for table `join_orders`
--

CREATE TABLE `join_orders` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `burger_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `join_orders`
--

INSERT INTO `join_orders` (`id`, `order_id`, `burger_id`, `quantity`) VALUES
(19, 17, 34, 1),
(20, 18, 37, 1),
(21, 18, 34, 1);

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `burger_id` int(11) NOT NULL,
  `date` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`burger_id`, `date`) VALUES
(34, '06.05.2024'),
(34, '08.05.2024'),
(34, '10.05.2024'),
(36, '08.05.2024'),
(36, '11.05.2024'),
(37, '08.05.2024'),
(37, '09.05.2024'),
(37, '10.05.2024'),
(38, '09.05.2024'),
(38, '10.05.2024'),
(38, '12.05.2024'),
(39, '06.05.2024'),
(39, '11.05.2024'),
(40, '07.05.2024'),
(40, '12.05.2024'),
(41, '07.05.2024'),
(41, '09.05.2024');

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

CREATE TABLE `order_history` (
  `Order_id` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL,
  `Date` varchar(20) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`Order_id`, `User_id`, `Date`, `Status`) VALUES
(1, 13, '22.04.2024', 'Done'),
(2, 13, '21.04.2024', 'Done'),
(3, 13, '20.04.2024', 'Doing'),
(4, 2, '22.04.2024', 'Not started'),
(5, 2, '22.04.2024', 'Not started'),
(7, 13, '22.04.2024', 'Doing'),
(8, 5, '03.05.2024', 'Not started'),
(9, 24, '04.05.2024', 'Not started'),
(10, 13, '04.05.2024', 'Not started'),
(11, 13, '04.05.2024', 'Not started'),
(12, 13, '04.05.2024', 'Done'),
(13, 13, '04.05.2024', 'Done'),
(14, 13, '06.05.2024', 'Doing'),
(17, 13, '08.05.2024', 'Done'),
(18, 5, '09.05.2024', 'Doing');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `number_of_guests` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Confirmed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `table_id`, `customer_id`, `number_of_guests`, `start_time`, `end_time`, `status`) VALUES
(4, 1, 4, 5, '2024-05-03 13:00:00', '2024-05-03 14:00:00', 'Confirmed'),
(6, 1, 6, 10, '2024-05-10 09:00:00', '2024-05-10 10:00:00', 'Confirmed'),
(7, 2, 7, 8, '2024-05-10 13:00:00', '2024-05-10 14:00:00', 'Confirmed'),
(8, 3, 8, 5, '2024-05-10 11:00:00', '2024-05-10 12:00:00', 'Confirmed'),
(10, 2, 10, 10, '2024-05-09 09:00:00', '2024-05-09 10:00:00', 'Confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `special_offers`
--

CREATE TABLE `special_offers` (
  `offer_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `offer_name` varchar(255) NOT NULL,
  `burger_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `special_offers`
--

INSERT INTO `special_offers` (`offer_id`, `start_date`, `end_date`, `offer_name`, `burger_id`, `description`, `price`, `filename`) VALUES
(7, '2024-05-06', '2024-05-12', 'Weekly special', 34, 'Great deal on the great classic!', 8.00, 'special-offer-upload-name-1715155516329-883151298.png'),
(8, '2024-05-10', '2024-05-10', 'Friday special', 38, 'You won\'t be hungry after this one!', 11.00, 'special-offer-upload-name-1715155582261-192863017.png'),
(9, '2024-05-10', '2024-05-12', 'Weekend deal', 36, 'Delicious bacon burger for half the price!', 5.75, 'special-offer-upload-name-1715155709412-341273131.png');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `table_id` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`table_id`, `capacity`, `location`) VALUES
(1, 10, 'By the window'),
(2, 15, 'Middle of the hall'),
(3, 10, 'By the window');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `Firstname` varchar(50) DEFAULT NULL,
  `Lastname` varchar(50) DEFAULT NULL,
  `Address` varchar(100) DEFAULT NULL,
  `Role` varchar(20) DEFAULT NULL,
  `Username` varchar(30) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Cardnumber` int(11) DEFAULT NULL,
  `Filename` varchar(255) DEFAULT NULL,
  `phone_number` bigint(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `Firstname`, `Lastname`, `Address`, `Role`, `Username`, `Password`, `Cardnumber`, `Filename`, `phone_number`, `email`) VALUES
(1, 'Admin', 'Admin', 'Admin', 'Admin', 'Admin', 'Admin', 1, 'Admin.jpg', NULL, NULL),
(2, 'Pekka', 'Pouta', 'Pasilantie 1', 'User', 'PPonParas', 'p3kk4p0u74', 12341234, 'pilvi.jpg', NULL, NULL),
(5, 'Jimi', 'Pettilä', 'Takametsä', 'Guest', 'Jimbo', '$2b$05$XwILb8fstttThrm7jM2HhuxyUoQOfztr1//YTRrXQivj4o1BiSQym', 53058683, 'hero_portrait_khaimera-file-1715245258500-413985805.jpg', 451234567, NULL),
(13, 'root', 'root', 'Osoite 1B 35', 'Admin', 'root', '$2b$05$QVBq11hJsaobKF11JqJd9uxd/SfzlIEp8Mj7YbUizoSGNe2B5A7fS', 2233, '1628647961195-file-1715273155202-715513414.jpg', 123456, '12345@gmail.com'),
(23, 'Jimi', 'Pettilä', 'Leppälinnunrinne 5 E 34', 'Guest', 'jorma', '$2b$05$Iw6gAWQHeA/rlb68w/XN9O2MXI5zUmZ.Ix6I1MdFqiPYNCw.Iml/G', 1234124125, 'kitty-file-1714656670797-491055696.png', 452652707, NULL),
(24, 'Kridelius', 'Liuslius', 'Taikatie 5', 'Guest', 'krrride', '$2b$05$CEgFspdbXl5pY.uFpQSQD.te7H.mGTnQFGSTpDRgpTA0gvrhxQgUy', 54464634, 'kitty-file-1714817445696-926761883.png', 3223535223, NULL),
(25, 'Testiseppo', 'seppo', 'Testitie 7', 'Guest', 'testi', '$2b$05$ULbTHX/OGW8ldoV/KYxCeeXHNiopsOpEl3RkqRVu.2VjLBY0r9To.', 34643346, 'kitty-file-1714821006958-552319857.png', 32535326, NULL),
(26, 'emailfix', 'emailfix', 'emailfix 1B 33', 'Guest', 'emailfix', '$2b$05$y6aa7HhK5ZG6Dx3fgewcTuShIFJ1Z.x3G2uqlZrZ/qHRyVzSzM6B.', 12345567, '1628647961195-file-1714990606405-606883672.jpg', 2, 'emailfix@email.com'),
(34, 'jee', 'jaa', '1', 'Guest', 'juu', '$2b$05$5ZsMIsxYRLaYMLaTYr/e6uDmXPU/Wz8VgKYITk/GHebgFWYoKxMIW', 1, '1628647961195-file-1715100933708-92973646.jpg', 1, 'juu@gmail.com'),
(35, 'guest', 'guest', 'Jee 1B Jee', 'Admin', 'guest', '$2b$05$.VC/JrTDsobA0b/JJhE7S.mUl7v6HlHMH.amlvBr0jm1kHoIN941O', 123456789, '1616784257127-file-1715274842739-289252947.jpg', 50555127, 'guest@email.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `allergens`
--
ALTER TABLE `allergens`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `burgers`
--
ALTER TABLE `burgers`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `join_allergens`
--
ALTER TABLE `join_allergens`
  ADD PRIMARY KEY (`allergens_id`,`burger_id`),
  ADD KEY `burger_id` (`burger_id`);

--
-- Indexes for table `join_ingredients`
--
ALTER TABLE `join_ingredients`
  ADD PRIMARY KEY (`ingredient_id`,`burger_id`),
  ADD KEY `burger_id` (`burger_id`);

--
-- Indexes for table `join_orders`
--
ALTER TABLE `join_orders`
  ADD PRIMARY KEY (`id`,`order_id`,`burger_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `burger_id` (`burger_id`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`burger_id`,`date`);

--
-- Indexes for table `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`Order_id`),
  ADD KEY `User_id` (`User_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `fk_table_id` (`table_id`),
  ADD KEY `fk_customer_id` (`customer_id`);

--
-- Indexes for table `special_offers`
--
ALTER TABLE `special_offers`
  ADD PRIMARY KEY (`offer_id`),
  ADD KEY `special_offers_ibfk_1` (`burger_id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`table_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `allergens`
--
ALTER TABLE `allergens`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `burgers`
--
ALTER TABLE `burgers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `join_orders`
--
ALTER TABLE `join_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `order_history`
--
ALTER TABLE `order_history`
  MODIFY `Order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `special_offers`
--
ALTER TABLE `special_offers`
  MODIFY `offer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `join_allergens`
--
ALTER TABLE `join_allergens`
  ADD CONSTRAINT `join_allergens_ibfk_1` FOREIGN KEY (`allergens_id`) REFERENCES `allergens` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `join_allergens_ibfk_2` FOREIGN KEY (`burger_id`) REFERENCES `burgers` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `join_ingredients`
--
ALTER TABLE `join_ingredients`
  ADD CONSTRAINT `join_ingredients_ibfk_1` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `join_ingredients_ibfk_2` FOREIGN KEY (`burger_id`) REFERENCES `burgers` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `join_orders`
--
ALTER TABLE `join_orders`
  ADD CONSTRAINT `join_orders_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_history` (`Order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `join_orders_ibfk_2` FOREIGN KEY (`burger_id`) REFERENCES `burgers` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`burger_id`) REFERENCES `burgers` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `order_history`
--
ALTER TABLE `order_history`
  ADD CONSTRAINT `order_history_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `users` (`ID`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_customers_reservations` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_tables_reservations` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`) ON DELETE CASCADE;

--
-- Constraints for table `special_offers`
--
ALTER TABLE `special_offers`
  ADD CONSTRAINT `special_offers_ibfk_1` FOREIGN KEY (`burger_id`) REFERENCES `burgers` (`ID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
