-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2026 at 10:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `product_count` int(11) DEFAULT 0,
  `parent_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `product_count`, `parent_id`, `created_at`) VALUES
('1', 'Guitars', 'guitars', 'Electric, acoustic, and bass guitars from top brands', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80', 156, NULL, '2026-03-25 19:02:49'),
('2', 'Keyboards & Pianos', 'keyboards', 'Digital pianos, synthesizers, and MIDI controllers', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80', 89, NULL, '2026-03-25 19:02:49'),
('3', 'Drums & Percussion', 'drums', 'Acoustic and electronic drum kits, cymbals, and percussion', 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80', 124, NULL, '2026-03-25 19:02:49'),
('4', 'Microphones', 'microphones', 'Studio and live microphones for vocals and instruments', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80', 78, NULL, '2026-03-25 19:02:49'),
('5', 'Bass Guitars', 'bass', '4-string, 5-string, and 6-string bass guitars', 'https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800&q=80', 67, NULL, '2026-03-25 19:02:49'),
('6', 'Synthesizers', 'synthesizers', 'Analog and digital synthesizers for music production', 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80', 45, NULL, '2026-03-25 19:02:49'),
('7', 'Percussion', 'percussion', 'Cymbals, hand drums, and percussion accessories', 'https://images.unsplash.com/photo-1519683384663-4d2c6e864e04?w=800&q=80', 92, NULL, '2026-03-25 19:02:49'),
('8', 'Amplifiers', 'amplifiers', 'Guitar, bass, and keyboard amplifiers', 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80', 73, NULL, '2026-03-25 19:02:49');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping` decimal(10,2) DEFAULT 0.00,
  `tax` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `shipping_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`shipping_address`)),
  `payment_method` varchar(255) DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `subtotal`, `shipping`, `tax`, `total`, `status`, `shipping_address`, `payment_method`, `tracking_number`, `created_at`, `updated_at`) VALUES
('order-1', 'user2', 1799.99, 0.00, 144.00, 1943.99, 'delivered', '{\"fullName\": \"John Doe\", \"street\": \"123 Music Street\", \"city\": \"Los Angeles\", \"state\": \"CA\", \"zipCode\": \"90001\", \"country\": \"USA\", \"phone\": \"+1 555-0123\"}', 'Credit Card ending in 4242', 'TRK123456789', '2026-03-25 19:02:50', '2026-03-25 19:02:50'),
('order-2', 'user2', 199.98, 15.00, 17.20, 232.18, 'processing', '{\"fullName\": \"John Doe\", \"street\": \"123 Music Street\", \"city\": \"Los Angeles\", \"state\": \"CA\", \"zipCode\": \"90001\", \"country\": \"USA\", \"phone\": \"+1 555-0123\"}', 'PayPal', NULL, '2026-03-25 19:02:50', '2026-03-25 19:02:50');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` varchar(50) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
('item-1', 'order-1', '1', 1, 1799.99),
('item-2', 'order-2', '5', 2, 99.99);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount` decimal(5,2) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `rating` decimal(3,2) DEFAULT 0.00,
  `review_count` int(11) DEFAULT 0,
  `in_stock` tinyint(1) DEFAULT 1,
  `stock` int(11) DEFAULT 0,
  `is_best_seller` tinyint(1) DEFAULT 0,
  `is_new_arrival` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `original_price`, `discount`, `category`, `brand`, `images`, `rating`, `review_count`, `in_stock`, `stock`, `is_best_seller`, `is_new_arrival`, `is_featured`, `specifications`, `tags`, `created_at`, `updated_at`) VALUES
('1', 'Fender American Professional II Stratocaster', 'The American Professional II Stratocaster draws from more than sixty years of innovation, inspiration and evolution to meet the demands of today\'s working player.', 1799.99, 1999.99, 10.00, 'guitars', 'Fender', '[\"https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80\", \"https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&q=80\"]', 4.80, 245, 1, 12, 1, 0, 1, '{\"Body Material\": \"Alder\", \"Neck Material\": \"Maple\", \"Fretboard\": \"Rosewood\", \"Pickups\": \"V-Mod II Single-Coil\", \"Bridge\": \"Synchronized Tremolo\"}', '[\"electric\", \"professional\", \"vintage\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('10', 'Fender Precision Bass', 'The Fender Precision Bass is the original electric bass as we know it today. A timeless classic with legendary tone.', 1499.99, 1699.99, 12.00, 'bass', 'Fender', '[\"https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800&q=80\", \"https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80\"]', 4.80, 178, 1, 9, 0, 1, 0, '{\"Body Material\": \"Alder\", \"Neck\": \"Maple\", \"Fretboard\": \"Maple\", \"Pickups\": \"Split Single-Coil\"}', '[\"electric-bass\", \"professional\", \"vintage\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('11', 'Zildjian A Custom Cymbal Set', 'A Custom cymbals are made from Zildjian\'s proprietary alloy which produces a bright, shimmering sound.', 799.99, NULL, NULL, 'percussion', 'Zildjian', '[\"https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80\", \"https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&q=80\"]', 4.70, 98, 1, 14, 0, 0, 0, '{\"Material\": \"B20 Bronze\", \"Finish\": \"Brilliant\", \"Includes\": \"14\\\" Hi-Hats, 16\\\" Crash, 20\\\" Ride\"}', '[\"cymbals\", \"professional\", \"bright-sound\"]', '2026-03-25 19:02:49', '2026-03-30 08:27:56'),
('12', 'Korg Volca Sample 2 Digital Sampler', 'The volca sample2 combines the best features of the original volca sample with new motion sequence recording.', 149.99, NULL, NULL, 'synthesizers', 'Korg', '[\"https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&q=80\", \"https://images.unsplash.com/photo-1611115583389-0c3f0c43958c?w=800&q=80\"]', 4.50, 67, 1, 22, 0, 1, 0, '{\"Type\": \"Digital Sampler\", \"Sample Memory\": \"4MB\", \"Sequencer\": \"16-step\", \"Battery\": \"Included\"}', '[\"portable\", \"sampler\", \"electronic-music\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('2', 'Gibson Les Paul Standard', 'The Gibson Les Paul Standard returns to the classic design that made it relevant, played and loved -- shaping sound across generations and genres of music.', 2499.99, NULL, NULL, 'guitars', 'Gibson', '[\"https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800&q=80\", \"https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80\"]', 4.90, 189, 1, 8, 1, 0, 1, '{\"Body Material\": \"Mahogany\", \"Top\": \"Maple\", \"Neck Material\": \"Mahogany\", \"Fretboard\": \"Rosewood\", \"Pickups\": \"BurstBucker Pro Humbuckers\"}', '[\"electric\", \"professional\", \"rock\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('3', 'Yamaha P-125 Digital Piano', 'The P-125 digital piano provides authentic acoustic piano touch and tone in an affordable, portable design.', 649.99, NULL, NULL, 'keyboards', 'Yamaha', '[\"https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80\", \"https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80\"]', 4.70, 312, 1, 15, 0, 1, 0, '{\"Keys\": \"88 weighted keys\", \"Polyphony\": \"192-note\", \"Voices\": \"24\", \"Effects\": \"Reverb, Damper Resonance\"}', '[\"digital\", \"portable\", \"beginner-friendly\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('4', 'Pearl Export Series Drum Set', 'The Pearl Export Series has been the choice of new drummers for decades. This complete 5-piece drum kit includes everything you need to start playing.', 899.99, 1099.99, 18.00, 'drums', 'Pearl', '[\"https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80\", \"https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&q=80\"]', 4.60, 156, 1, 5, 1, 0, 0, '{\"Configuration\": \"5-piece\", \"Shell Material\": \"Poplar/Asian Mahogany\", \"Hardware\": \"Chrome\", \"Cymbals\": \"Included\"}', '[\"acoustic\", \"complete-set\", \"beginner\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('5', 'Shure SM58-LC Vocal Microphone', 'The legendary Shure SM58 vocal microphone is designed for professional vocal use in live performance, sound reinforcement, and studio recording.', 99.99, NULL, NULL, 'microphones', 'Shure', '[\"https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80\", \"https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80\"]', 4.90, 892, 1, 45, 1, 0, 0, '{\"Type\": \"Dynamic\", \"Pattern\": \"Cardioid\", \"Frequency Response\": \"50 to 15,000 Hz\", \"Impedance\": \"150 ohms\"}', '[\"dynamic\", \"professional\", \"live-sound\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('6', 'Roland TD-17KVX V-Drums Electronic Drum Kit', 'The TD-17KVX provides authentic playing experience with larger 12-inch snare pad and expanded 10-inch tom pads for improved playability.', 1799.99, NULL, NULL, 'drums', 'Roland', '[\"https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80\", \"https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&q=80\"]', 4.80, 134, 1, 7, 0, 1, 1, '{\"Drum Module\": \"TD-17\", \"Snare Pad\": \"12-inch mesh\", \"Tom Pads\": \"10-inch mesh\", \"Kick Pad\": \"KD-10 w/ Beaterless Bass Drum Pedal\"}', '[\"electronic\", \"mesh-heads\", \"silent-practice\"]', '2026-03-25 19:02:49', '2026-03-30 07:46:55'),
('7', 'Taylor 214ce Grand Auditorium Acoustic-Electric', 'The 214ce pairs layered rosewood back and sides with a solid Sitka spruce top to produce a well-balanced tone.', 999.99, NULL, NULL, 'guitars', 'Taylor', '[\"https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=80\", \"https://images.unsplash.com/photo-1556449895-a33c9dba33dd?w=800&q=80\"]', 4.70, 203, 1, 11, 1, 0, 0, '{\"Top\": \"Solid Sitka Spruce\", \"Back & Sides\": \"Layered Rosewood\", \"Electronics\": \"ES2\", \"Cutaway\": \"Venetian\"}', '[\"acoustic\", \"electric-acoustic\", \"professional\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('8', 'Nord Stage 3 88 Keyboard', 'The ultimate instrument for the performing musician. Featuring our latest award-winning technologies including dual piano engines.', 4999.99, NULL, NULL, 'keyboards', 'Nord', '[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80\", \"https://images.unsplash.com/photo-1612225348845-4e5c1c6a3a74?w=800&q=80\"]', 4.90, 87, 1, 3, 0, 1, 0, '{\"Keys\": \"88 weighted hammer action\", \"Sound Engines\": \"Piano, Synth, Organ\", \"Effects\": \"Built-in\", \"Memory\": \"2GB\"}', '[\"professional\", \"stage\", \"synthesizer\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49'),
('9', 'Neumann U87 Ai Studio Microphone', 'The U 87 Ai is probably the best-known and most widely-used studio microphone the world over.', 3599.99, NULL, NULL, 'microphones', 'Neumann', '[\"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80\", \"https://images.unsplash.com/photo-1590602846989-e99596d2a6ee?w=800&q=80\"]', 5.00, 156, 1, 6, 0, 1, 0, '{\"Type\": \"Condenser\", \"Patterns\": \"Omnidirectional, Cardioid, Figure-8\", \"Frequency Response\": \"20 Hz to 20 kHz\", \"Max SPL\": \"117 dB\"}', '[\"condenser\", \"professional\", \"studio\"]', '2026-03-25 19:02:49', '2026-03-25 19:02:49');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_avatar` varchar(500) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `title` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `date` date NOT NULL,
  `helpful` int(11) DEFAULT 0,
  `verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `user_name`, `user_avatar`, `rating`, `title`, `comment`, `date`, `helpful`, `verified`, `created_at`) VALUES
('1', '1', 'user1', 'John Smith', 'https://i.pravatar.cc/150?img=12', 5, 'Absolutely incredible guitar!', 'This Stratocaster is everything I hoped for and more. The tone is pristine, the playability is unmatched, and it looks stunning. Worth every penny!', '2024-03-15', 0, 1, '2026-03-25 19:02:49'),
('2', '1', 'user2', 'Sarah Johnson', 'https://i.pravatar.cc/150?img=25', 4, 'Great guitar, minor setup needed', 'Fantastic guitar overall. Needed a slight setup adjustment out of the box, but after that it plays like a dream. The V-Mod pickups sound amazing.', '2024-03-10', 0, 1, '2026-03-25 19:02:49'),
('3', '2', 'user1', 'Mike Wilson', 'https://i.pravatar.cc/150?img=33', 5, 'The Les Paul standard!', 'This is THE Les Paul. Rich, warm tones, sustain for days, and that classic look. Gibson nailed it with this model.', '2024-03-12', 0, 1, '2026-03-25 19:02:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `avatar`, `role`, `created_at`) VALUES
('', '', NULL, '', 'real', 'user', '2026-03-28 17:18:05'),
('05ab1a29-2c01-11f1-b9e0-0068eb7b84d4', 'nancy@gmail.com', '$2b$10$5rAN3MkFy1J7u7vDsDEqqOjONUXC4oKZs.HdxL0SjFjgy4rL6z.Ia', 'nancy', NULL, 'user', '2026-03-30 06:23:52'),
('137eb028-2c12-11f1-b9e0-0068eb7b84d4', 'nancy6@gmail.com', '$2b$10$R1W4.4urbGO.0Q2r0.KH6eIqoOhd5aUZ6ntAiVyeu4iSMSnWrq4Y2', 'nancy', NULL, 'admin', '2026-03-30 08:25:57'),
('29693fd3-2aaf-11f1-b0cf-902b3423dd5d', 'mahmoud@gmail.com', '$2b$10$KriLzwnK6xgj5ukrj3Kg7OUTLUmqA81qkDaEkmZ4rCLbSlUZl5cUm', 'mahmoud', NULL, 'user', '2026-03-28 14:05:22'),
('3a0f313b-2c0c-11f1-b9e0-0068eb7b84d4', 'nancy5@gmail.com', '$2b$10$8Gi4d5Y/XFIJlvTSm5upZeSijdvxYsALw5IWuQNqWlBDNwpz/ZQlu', 'nancy', NULL, 'admin', '2026-03-30 07:44:05'),
('3dd59a79-2c14-11f1-b9e0-0068eb7b84d4', 'marwa45@gmail.com', '$2b$10$28r/8.Y8fpOb1uv/5aqan.ac1nCW0R1/G3NCWjkaCC01nXMA75meW', 'marwa', NULL, 'user', '2026-03-30 08:41:27'),
('420e2480-2ac5-11f1-b0cf-902b3423dd5d', 'mmkh@gmail.com', '$2b$10$26AshFX0gQKbGJybOzul8OCFAmzsWNSXvHhdISo/8CXkzi6Daa9Te', 'marwa mahmoud', NULL, 'user', '2026-03-28 16:43:33'),
('52f8ea5d-2acb-11f1-b0cf-902b3423dd5d', 'mahmoudd@gmail.com', '$2b$10$LQ2wuEfWpBIkCMY.qBamMuJzGII.0XvYqauCij7iTZUUhf.jtcNWq', 'mahmoud hassan ', NULL, 'admin', '2026-03-28 17:26:58'),
('7d407ff5-2aa3-11f1-b0cf-902b3423dd5d', 'marwamahmoudd97@gmail.com', '$2b$10$f6BMGl3FdW/7uhJAVpEPGuAutS4e4uOEYaMWryJoJWTrdLgHXlb6O', 'Marwa Mahmoud', NULL, 'user', '2026-03-28 12:41:49'),
('7f292105-2c14-11f1-b9e0-0068eb7b84d4', 'doina@gmail.com', '$2b$10$HR4pmJKk6zN7Wj.J6aajB.wpmWeliinmOfjdu3ABxl1N2yiK0t/IW', 'doina', NULL, 'admin', '2026-03-30 08:43:16'),
('9', 'marwaa@gmail.com', '123456', 'marwaa', 'real', 'admin', '2026-03-28 17:18:05'),
('9c0b6402-2aa3-11f1-b0cf-902b3423dd5d', 'marwamahmou97@gmail.com', '$2b$10$tSsLiR8Yg80jPIWbFHPPfe1NoWDA/cWvOgM.CJezFBjTPmCAzoT7.', 'Marwa ', NULL, 'user', '2026-03-28 12:42:41'),
('c073beee-2aa3-11f1-b0cf-902b3423dd5d', 'marwa@gmail.com', '$2b$10$fCewoKjPZVzyKzaRUfrmmu9itbxSkgElWGj4PC2iM2Z90.u/KmmBe', 'marwa', NULL, 'user', '2026-03-28 12:43:42'),
('c78ba6a9-2ab3-11f1-b0cf-902b3423dd5d', 'malak@gmail.com', '$2b$10$iFXQ.I/usTquZgMmsQrAk./CHYxfMFR2Dz4QOwpjSi3xPmu9nvz9W', 'malak', NULL, 'user', '2026-03-28 14:38:26'),
('e1720581-2ac7-11f1-b0cf-902b3423dd5d', 'admin@gmail.com', '$2b$10$FdNVaAyUfVWuybrEu4MJyOVZKpHT/3XNJD4bDpXED7C2f4Cor56qO', 'user', NULL, 'user', '2026-03-28 17:02:19'),
('user1', 'admin@example.com', '$2a$10$hashedpassword', 'Admin User', 'https://i.pravatar.cc/150?img=1', 'admin', '2026-03-25 19:02:49'),
('user2', 'john@example.com', '$2a$10$hashedpassword', 'John Doe', 'https://i.pravatar.cc/150?img=12', 'user', '2026-03-25 19:02:49');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `product_id`, `created_at`) VALUES
('4a790430-2c14-11f1-b9e0-0068eb7b84d4', '3dd59a79-2c14-11f1-b9e0-0068eb7b84d4', '4', '2026-03-30 08:41:48'),
('91950523-2ac5-11f1-b0cf-902b3423dd5d', '420e2480-2ac5-11f1-b0cf-902b3423dd5d', '3', '2026-03-28 16:45:46'),
('a8f1b501-2c13-11f1-b9e0-0068eb7b84d4', '137eb028-2c12-11f1-b9e0-0068eb7b84d4', '2', '2026-03-30 08:37:17'),
('b35c0994-2c13-11f1-b9e0-0068eb7b84d4', '137eb028-2c12-11f1-b9e0-0068eb7b84d4', '6', '2026-03-30 08:37:35'),
('ca62cd26-2c13-11f1-b9e0-0068eb7b84d4', '137eb028-2c12-11f1-b9e0-0068eb7b84d4', '1', '2026-03-30 08:38:13'),
('daef7011-2aee-11f1-afd2-902b3423dd5d', '52f8ea5d-2acb-11f1-b0cf-902b3423dd5d', '1', '2026-03-28 21:41:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_wishlist` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
