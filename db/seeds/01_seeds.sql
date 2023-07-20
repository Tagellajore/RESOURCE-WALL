INSERT INTO users (name, email, password) 
VALUES
('Sarah Johnson', 'sa@gmail.com', '123'),
('Michael Rodriguez', 'mi@gmail.com', '456'),
('Emily Lee', 'em@gmail.com', '789');

INSERT INTO categories (category) 
VALUES 
('IT');

INSERT INTO resources (title, url, description, user_id, category_id)
VALUES
('LHL page - 1', 'https://www.lighthouselabs.ca/en/web-development', 'Full Stack Development', 1, 1),
('LHL page - 2', 'https://www.lighthouselabs.ca/en/data-science', 'Data Science', 1, 1),
('LHL page - 3', 'https://www.lighthouselabs.ca/en/cyber-security', 'Cyber-security', 1, 1);

INSERT INTO feedbacks (comment, rating, user_id, resource_id)
VALUES
('Life changing coding bootcamp', 5, 1, 1),
('Career-focused tech training', 4, 1, 1),
('Industry-experienced instructors', 4, 1, 1);

INSERT INTO likes (user_id, resource_id)
VALUES 
(1,1),
(1,1),
(1,1);