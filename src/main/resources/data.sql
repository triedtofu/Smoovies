CREATE EXTENSION pgcrypto;

-- genres
INSERT INTO genres (name)
VALUES
('action'),
('adventure'),
('animation'),
('biography'),
('comedy'),
('crime'),
('documentary'),
('drama'),
('family'),
('fantasy'),
('film noir'),
('history'),
('horror'),
('music'),
('musical'),
('mystery'),
('romance'),
('sci-fi'),
('short film'),
('sport'),
('superhero'),
('thriller'),
('war'),
('western');

-- admin
INSERT INTO users (email, is_admin, name, password)
VALUES
('admin@email.com', true, 'admin', crypt('Admin123', gen_salt('bf')));
