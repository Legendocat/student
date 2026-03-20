DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  tags JSON,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  user_id INT NOT NULL,
  UNIQUE KEY unique_like (item_id, user_id),
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  item_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email, password) VALUES
('demo_user', 'demo@example.com', '$2a$10$0mfxmkk6x3T2C4e6G9FFPuXP4bW64KbjDgq09uXBJgp7wa9u0JPFK');

INSERT INTO items (title, content, tags, user_id) VALUES
('Первая запись', 'Тестовая запись для проверки интерфейса и API.', JSON_ARRAY('тест','demo'), 1),
('Вторая запись', 'Материал для проверки поиска, лайков и комментариев.', JSON_ARRAY('поиск','пример'), 1);

INSERT INTO comments (content, item_id, user_id) VALUES
('Первый тестовый комментарий', 1, 1),
('Второй тестовый комментарий', 2, 1);

INSERT INTO likes (item_id, user_id) VALUES
(1, 1),
(2, 1);
