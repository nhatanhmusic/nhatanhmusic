-- Bo sung danh muc guitar classic (day nylon) va hang Cordoba.
-- Hai cay mau nam o db/demo/demo_catalog.sql, chi nap o profile local.

INSERT INTO categories (id, name, slug, parent_id, sort_order) VALUES
 (6,'Guitar classic','guitar-classic',NULL,3);
SELECT setval('categories_id_seq', 6);

-- Day acoustic/bass lui xuong de thu tu menu doc xuoi:
-- dien -> acoustic -> classic -> bass
UPDATE categories SET sort_order = 4 WHERE slug = 'guitar-bass';

INSERT INTO brands (id, name, slug) VALUES (10,'Cordoba','cordoba');
SELECT setval('brands_id_seq', 10);
