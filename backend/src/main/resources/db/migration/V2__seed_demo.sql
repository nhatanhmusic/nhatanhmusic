-- Du lieu tham chieu: hang va danh muc. Dan mau chi nap o profile local
-- (xem db/demo/demo_catalog.sql va DemoCatalogSeeder), KHONG len production.

INSERT INTO brands (id, name, slug) VALUES
 (1,'Fender','fender'), (2,'Gibson','gibson'), (3,'Squier','squier'),
 (4,'Epiphone','epiphone'), (5,'Yamaha','yamaha'), (6,'Taylor','taylor'),
 (7,'Cort','cort'), (8,'Ibanez','ibanez'), (9,'Elixir','elixir');
SELECT setval('brands_id_seq', 9);

INSERT INTO categories (id, name, slug, parent_id, sort_order) VALUES
 (1,'Guitar điện','guitar-dien',NULL,1),
 (2,'Guitar acoustic','guitar-acoustic',NULL,2),
 (3,'Guitar bass','guitar-bass',NULL,3),
 (4,'Ampli','ampli',NULL,4),
 (5,'Phụ kiện','phu-kien',NULL,5);
SELECT setval('categories_id_seq', 5);
