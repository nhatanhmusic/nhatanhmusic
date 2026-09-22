-- Bo sung danh muc guitar classic (day nylon) — shop nhac cu Viet Nam nao cung ban.
-- Kem hai cay mau de danh muc khong rong khi mo menu.

INSERT INTO categories (id, name, slug, parent_id, sort_order) VALUES
 (6,'Guitar classic','guitar-classic',NULL,3);
SELECT setval('categories_id_seq', 6);

-- Day acoustic/bass lui xuong de thu tu menu doc xuoi:
-- dien -> acoustic -> classic -> bass
UPDATE categories SET sort_order = 4 WHERE slug = 'guitar-bass';

INSERT INTO brands (id, name, slug) VALUES (10,'Cordoba','cordoba');
SELECT setval('brands_id_seq', 10);

INSERT INTO product_models (id, category_id, brand_id, name, slug, description, specs, is_unique) VALUES
 (13,6,5,'Yamaha C40','yamaha-c40',
  'Cây classic phổ thông nhất Việt Nam. Cần rộng, dây nylon nên bấm rất nhẹ tay — hợp người mới tập hoặc học nhạc viện năm đầu.',
  '{"Mặt": "Spruce lớp ép", "Hông lưng": "Meranti", "Cần": "Nato", "Mặt phím": "Rosewood", "Dây": "Nylon", "Cữ dây": "25.6 inch"}'::jsonb, true),
 (14,6,10,'Cordoba C5','cordoba-c5',
  'Mặt tuyết tùng đặc, tiếng ấm và dày hơn hẳn đàn tập. Bước lên khi đã chơi classic được vài năm.',
  '{"Mặt": "Tuyết tùng đặc (Solid Cedar)", "Hông lưng": "Mahogany lớp ép", "Cần": "Mahogany", "Mặt phím": "Rosewood", "Dây": "Nylon", "Cữ dây": "25.6 inch"}'::jsonb, true);
SELECT setval('product_models_id_seq', 14);

INSERT INTO items (id, product_model_id, sku, serial_no, slug, title, summary,
                   condition_grade, weight_grams, year_made, made_in,
                   price_vnd, compare_at_price_vnd, status, source, accepts_offers, published_at) VALUES
 (13,13,'NA-CL-0061',NULL,'yamaha-c40-natural-na-cl-0061',
  'Yamaha C40 — Natural',
  'Đàn của một bạn học viên lên đời. Đã lau sạch, thay bộ dây nylon mới và chỉnh lại xương ngựa cho nhẹ tay hơn.',
  'GOOD',1750,2021,'Indonesia',2100000,2600000,'AVAILABLE','PURCHASED',true, now() - interval '2 day'),
 (14,14,'NA-CL-0064',NULL,'cordoba-c5-natural-na-cl-0064',
  'Cordoba C5 — Natural',
  'Ký gửi của một anh dạy nhạc. Mặt tuyết tùng đã lên tiếng, càng chơi càng mở.',
  'EXCELLENT',1820,2020,'Trung Quốc',6900000,NULL,'AVAILABLE','CONSIGNMENT',false, now() - interval '7 day');
SELECT setval('items_id_seq', 14);

INSERT INTO item_photos (item_id, r2_key, kind, sort_order, alt_text)
SELECT i.id,
       'items/' || i.id || '/' || lower(k.kind) || '-1.webp',
       k.kind, k.ord,
       i.title || ' — ' || k.vi
FROM items i
CROSS JOIN (VALUES
    ('MAIN',0,'toàn thân mặt trước'),
    ('BACK',1,'lưng đàn'),
    ('HEADSTOCK',2,'đầu cần'),
    ('BRIDGE',3,'ngựa đàn'),
    ('FRETBOARD',4,'mặt phím')
) AS k(kind, ord, vi)
WHERE i.id IN (13, 14);

INSERT INTO item_flaws (item_id, title, description, sort_order) VALUES
 (13,'Xước nhẹ quanh lỗ thoát âm','Vết gảy móng tay của người tập, chỉ ở lớp sơn.',0),
 (13,'Ố nhẹ mặt phím','Do mồ hôi tay, đã lau và dưỡng lại.',1),
 (14,'Vết lõm nhỏ ở cạnh hông','Đường kính chừng 3mm, không ảnh hưởng tiếng.',0);
