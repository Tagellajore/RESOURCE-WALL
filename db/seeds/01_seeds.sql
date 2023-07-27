INSERT INTO users (name, email, password)
VALUES
('Sarah Johnson', 'sa@gmail.com', '123'),
('Michael Rodriguez', 'mi@gmail.com', '456'),
('Emily Lee', 'em@gmail.com', '789');

INSERT INTO categories (category)
VALUES
('Dogs'),
('Cats'),
('Horses');

INSERT INTO resources (title, url, description, url_cover_photo, user_id , category_id)
VALUES
-- dogs
('Save Our Scruff', 'https://www.saveourscruff.org/', 'Save Our Scruff is a non-profit dog rescue and rehome charity located in Toronto and Southern Ontario', 'https://images.squarespace-cdn.com/content/v1/5538679ce4b07179e5b8a295/1675326874278-2BNDO82OTLMHBNJBZVC7/mexico2022-20220831-A51A6855.jpg?format=2500w', 1, 1),
('Second Chance!', 'https://www.scarscare.ca/animals/?wpv-animal_type=dogs', 'Our mission is to make a positive impact on animals and people by engaging with others to rescue and care for animals in need, share knowledge, and provide access to services and resources.', 'https://www.scarscare.ca/wp-content/uploads/2022/07/Event-Portal-Dog-800x541.jpg', 2, 1),
('Infinite Woofs', 'https://infinitewoofs.com/', 'Infinite Woofs Animal Rescue Society is a non-shelter based located in Edmonton, Alberta that started up in March 2013.',  'https://infinitewoofs.com/wp-content/uploads/2017/11/our-dogs.jpg', 2, 1), 
-- cats
('VOKRA', 'https://www.vokra.ca/', 'VOKRA is a no-kill, registered non-profit cat rescue organization', 'https://images.squarespace-cdn.com/content/v1/5bbba72a2727be42cf12b47a/a42eb64b-6b5a-4740-9336-88e70711b9e7/home+banner.jpg?format=2500w', 2, 2),
('Second Chance!', 'https://www.scarscare.ca/animals/?wpv-animal_type=cats', 'Our mission is to make a positive impact on animals and people by engaging with others to rescue and care for animals in need, share knowledge, and provide access to services and resources.', 'https://www.scarscare.ca/wp-content/uploads/2023/06/river-2-240x300.jpeg', 1, 2),
('Little Cats Lost', 'https://www.littlecatslosttnr.org/', 'Little Cats Lost (Trap-Neuter-Return) Society is made up of a small group of compassionate, intelligent, volunteers that believe in the humane treatment of cats, owned or un-owned.', 'https://static.wixstatic.com/media/84770f_75ea49113e38f576e28b18b3adaa1946.jpg/v1/fill/w_496,h_453,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/84770f_75ea49113e38f576e28b18b3adaa1946.jpg', 1, 2),
-- horses
('Horse Heroes Alberta', 'https://horseheroesalberta.com/', 'homHorse Heroes Alberta Rescue Association is not your typical horse rescue', 'https://img1.wsimg.com/isteam/ip/c2f96be2-3201-4a50-97c7-e8eeafe72c2f/20230515_090747.jpg/:/cr=t:0%25,l:0.12%25,w:99.77%25,h:100%25/rs=w:2480,h:1240,cg:true', 1, 3),
('Last Chance Horse Rescue', 'https://lastchancehorserescue.com/home', 'We are a family owned/operated Rescue and Rehabilitation center, currently we can not provide tax receipts but are working towards being able to provide these for people in the future.', 'https://d10j3mvrs1suex.cloudfront.net/s:bzglfiles/u/64034/7f729f7629885507fc15b3ad19496294c4a828be/original/4652208-orig.jpg/!!/b%3AW1sic2l6ZSIsInBob3RvIl1d/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg', 2, 3 ),
('Rhinestone Horse Rescue Ranch', 'https://rhinestonehorserescueranch.ca/', 'Founded by Laura and Kevin Watson, our mission is to rescue, rehabilitate, and rehome horses in need, offering them a second chance at a bright and happy future.', 'https://rhinestonehorserescueranch.ca/wp-content/uploads/2023/03/IMG_2013-600x800.jpg', 3, 3);

INSERT INTO feedbacks (comment, rating, user_id, resource_id)
VALUES
('Very thorough adoption process. Highly recommended', 5, 1, 1),
('Amazing organization that saves so many sweet lives', 4, 1, 1),
('Amazing place to adopt horses', 4, 1, 1);

INSERT INTO likes (user_id, resource_id)
VALUES
(1,3),
(1,1),
(1,2);
