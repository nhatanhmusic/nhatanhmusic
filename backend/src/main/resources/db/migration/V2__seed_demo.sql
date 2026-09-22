-- Du lieu mau de chay local. Anh la placeholder — thay bang anh that (muc 15).

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

INSERT INTO product_models (id, category_id, brand_id, name, slug, description, specs, is_unique) VALUES
 (1,1,1,'Fender Player Stratocaster MIM','fender-player-stratocaster-mim',
  'Cây strat quốc dân. Mạch 5 cần, 3 pickup single Alnico V, cần maple bản Modern C — dễ chơi cho cả người mới lẫn người đi show.',
  '{"Thân": "Alder", "Cần": "Maple, Modern C", "Mặt phím": "Pau Ferro", "Số phím": "22", "Pickup": "3x Player Series Alnico V single-coil", "Cữ dây": "25.5 inch"}'::jsonb, true),
 (2,1,1,'Fender Player Telecaster MIM','fender-player-telecaster-mim',
  'Tiếng tele đặc trưng, sáng và cắt. Hợp country, indie, funk.',
  '{"Thân": "Alder", "Cần": "Maple, Modern C", "Mặt phím": "Maple", "Số phím": "22", "Pickup": "2x Player Series Alnico V single-coil", "Cữ dây": "25.5 inch"}'::jsonb, true),
 (3,1,3,'Squier Classic Vibe 60s Stratocaster','squier-classic-vibe-60s-stratocaster',
  'Dòng Classic Vibe được đánh giá cao hơn hẳn tầm giá. Lựa chọn tốt cho cây đàn điện đầu tiên.',
  '{"Thân": "Nato", "Cần": "Maple, dáng C", "Mặt phím": "Indian Laurel", "Số phím": "21", "Pickup": "3x Fender Designed Alnico single-coil", "Cữ dây": "25.5 inch"}'::jsonb, true),
 (4,1,2,'Gibson Les Paul Studio','gibson-les-paul-studio',
  'Les Paul thật, bỏ phần trang trí để giữ giá. Vẫn thân mahogany, mặt maple, đôi humbucker 490R/498T.',
  '{"Thân": "Mahogany, mặt maple", "Cần": "Mahogany, SlimTaper", "Mặt phím": "Rosewood", "Số phím": "22", "Pickup": "490R / 498T humbucker", "Cữ dây": "24.75 inch"}'::jsonb, true),
 (5,1,4,'Epiphone Les Paul Standard 50s','epiphone-les-paul-standard-50s',
  'Bản Epiphone đời mới đã dùng pickup ProBucker và phần cứng CTS — khác hẳn Epiphone mười năm trước.',
  '{"Thân": "Mahogany, mặt maple", "Cần": "Mahogany, 50s rounded", "Mặt phím": "Indian Laurel", "Số phím": "22", "Pickup": "ProBucker-2 / ProBucker-3", "Cữ dây": "24.75 inch"}'::jsonb, true),
 (6,1,5,'Yamaha Pacifica 112V','yamaha-pacifica-112v',
  'Cây đàn được khuyên nhiều nhất cho người mới. Hoàn thiện chắc chắn, cần đàn dễ chịu, cấu hình HSS linh hoạt.',
  '{"Thân": "Alder", "Cần": "Maple", "Mặt phím": "Rosewood", "Số phím": "22", "Pickup": "HSS, humbucker chẻ cuộn", "Cữ dây": "25.5 inch"}'::jsonb, true),
 (7,2,6,'Taylor 114ce','taylor-114ce',
  'Dáng Grand Auditorium, cần Taylor mảnh và thấp — cây acoustic dễ chơi nhất tầm này. Có EQ ES2 cắm thẳng ra loa.',
  '{"Mặt": "Sitka Spruce", "Hông lưng": "Walnut lớp ép", "Cần": "Sapele", "Mặt phím": "Ebony", "Điện": "Expression System 2", "Cữ dây": "25.5 inch"}'::jsonb, true),
 (8,2,5,'Yamaha FG830','yamaha-fg830',
  'Mặt thông đặc, hông lưng rosewood. Tiếng dày và ấm, bền bỉ với khí hậu Việt Nam.',
  '{"Mặt": "Thông đặc (Solid Sitka Spruce)", "Hông lưng": "Rosewood lớp ép", "Cần": "Nato", "Mặt phím": "Rosewood", "Cữ dây": "25 inch"}'::jsonb, true),
 (9,2,7,'Cort AD810','cort-ad810',
  'Đàn tập phổ thông, giá thấp nhất mà vẫn giữ được cữ phím đều.',
  '{"Mặt": "Spruce lớp ép", "Hông lưng": "Mahogany lớp ép", "Cần": "Mahogany", "Mặt phím": "Merbau", "Cữ dây": "25.5 inch"}'::jsonb, true),
 (10,3,1,'Fender Player Jazz Bass MIM','fender-player-jazz-bass-mim',
  'Cần J-Bass thon, hai pickup single — dải tiếng rộng, đánh được mọi thể loại.',
  '{"Thân": "Alder", "Cần": "Maple, Modern C", "Mặt phím": "Pau Ferro", "Số phím": "20", "Pickup": "2x Player Series Alnico V single-coil", "Cữ dây": "34 inch"}'::jsonb, true);

-- Phu kien: is_unique = false nen phai co san so luong ton ngay luc chen
-- (rang buoc product_models_stock_ck o V1).
INSERT INTO product_models (id, category_id, brand_id, name, slug, description, specs,
                            is_unique, stock_quantity, list_price_vnd) VALUES
 (11,5,9,'Dây Elixir Nanoweb 10-46 (guitar điện)','day-elixir-nanoweb-10-46',
  'Dây phủ Nanoweb, bền gấp nhiều lần dây thường trong khí hậu ẩm.',
  '{"Cỡ dây": "10-46", "Lớp phủ": "Nanoweb"}'::jsonb, false, 24, 320000),
 (12,5,NULL,'Capo guitar kẹp lò xo','capo-guitar-kep-lo-xo',
  'Capo nhôm, đệm cao su, dùng được cho cả đàn điện và acoustic.',
  '{"Chất liệu": "Nhôm"}'::jsonb, false, 40, 95000);
SELECT setval('product_models_id_seq', 12);

INSERT INTO items (id, product_model_id, sku, serial_no, slug, title, summary,
                   condition_grade, weight_grams, year_made, made_in,
                   price_vnd, compare_at_price_vnd, status, source, accepts_offers, published_at) VALUES
 (1,1,'NA-EG-0231','MX19045512','fender-player-stratocaster-mim-sunburst-na-eg-0231',
  'Fender Player Stratocaster MIM — 3-Color Sunburst',
  'Cây này về từ một khách đổi lên Player Plus. Điện nguyên bản, phím còn khoảng 85%, cần thẳng, action đã set 1.8mm ở phím 12.',
  'EXCELLENT',3520,2019,'Mexico',18900000,21500000,'AVAILABLE','PURCHASED',true, now() - interval '6 day'),
 (2,2,'NA-EG-0244','MX20112097','fender-player-telecaster-mim-butterscotch-na-eg-0244',
  'Fender Player Telecaster MIM — Butterscotch Blonde',
  'Đàn ký gửi của một anh chơi phòng thu ở Biên Hòa. Có vài vết xước dùng bình thường, tiếng còn rất ngọt.',
  'VERY_GOOD',3410,2020,'Mexico',17500000,NULL,'AVAILABLE','CONSIGNMENT',true, now() - interval '9 day'),
 (3,3,'NA-EG-0250',NULL,'squier-classic-vibe-60s-stratocaster-3ts-na-eg-0250',
  'Squier Classic Vibe 60s Stratocaster — 3-Tone Sunburst',
  'Đàn tập đã qua kiểm tra 32 điểm, thay dây mới, chỉnh cần và action trước khi lên kệ.',
  'GOOD',3600,2021,'Indonesia',7900000,9200000,'AVAILABLE','PURCHASED',true, now() - interval '3 day'),
 (4,4,'NA-EG-0202','180060412','gibson-les-paul-studio-ebony-na-eg-0202',
  'Gibson Les Paul Studio — Ebony',
  'Gibson USA đời 2018, còn hộp cứng nguyên bản. Đã thay pot volume cần (bản gốc kèm theo trong hộp).',
  'EXCELLENT',4100,2018,'Mỹ',34500000,39000000,'AVAILABLE','PURCHASED',false, now() - interval '14 day'),
 (5,5,'NA-EG-0261',NULL,'epiphone-les-paul-standard-50s-heritage-cherry-na-eg-0261',
  'Epiphone Les Paul Standard 50s — Heritage Cherry Sunburst',
  'Cần dáng 50s dày, hợp người có bàn tay lớn. Phím gần như chưa mòn.',
  'VERY_GOOD',4250,2021,'Trung Quốc',12900000,NULL,'AVAILABLE','PURCHASED',true, now() - interval '2 day'),
 (6,6,'NA-EG-0268',NULL,'yamaha-pacifica-112v-black-na-eg-0268',
  'Yamaha Pacifica 112V — Black',
  'Cây đàn đầu tiên đáng tiền nhất. Đã kiểm tra đủ 32 điểm, chỉ cần cắm là chơi.',
  'GOOD',3550,2019,'Indonesia',6200000,7400000,'AVAILABLE','PURCHASED',true, now() - interval '1 day'),
 (7,7,'NA-AC-0117',NULL,'taylor-114ce-grand-auditorium-na-ac-0117',
  'Taylor 114ce — Grand Auditorium',
  'Gần như chưa dùng, còn bao mềm Taylor. Cần rất mảnh, người tay nhỏ chơi rất nhẹ.',
  'MINT',2050,2022,'Mexico',21900000,25000000,'AVAILABLE','CONSIGNMENT',false, now() - interval '4 day'),
 (8,8,'NA-AC-0121',NULL,'yamaha-fg830-natural-na-ac-0121',
  'Yamaha FG830 — Natural',
  'Mặt thông đặc nên tiếng sẽ càng mở ra theo thời gian chơi. Đã set lại action xuống 2.4mm.',
  'VERY_GOOD',1980,2020,'Indonesia',6500000,NULL,'AVAILABLE','PURCHASED',true, now() - interval '11 day'),
 (9,9,'NA-AC-0125',NULL,'cort-ad810-natural-na-ac-0125',
  'Cort AD810 — Natural (cần sửa)',
  'Bán đúng tình trạng: cần hơi cong, action cao, có nứt nhỏ ở hông. Shop báo giá sửa trọn gói 850.000₫ nếu khách muốn làm luôn.',
  'FAIR',1900,2018,'Indonesia',2400000,NULL,'AVAILABLE','PURCHASED',true, now() - interval '5 day'),
 (10,10,'NA-BS-0044','MX20338871','fender-player-jazz-bass-mim-tidepool-na-bs-0044',
  'Fender Player Jazz Bass MIM — Tidepool',
  'Bass 4 dây, cần thon dễ chạy ngón. Đã thay dây Elixir mới.',
  'EXCELLENT',4300,2020,'Mexico',22500000,NULL,'RESERVED','PURCHASED',false, now() - interval '8 day'),
 (11,1,'NA-EG-0180','MX18009923','fender-player-stratocaster-mim-polar-white-na-eg-0180',
  'Fender Player Stratocaster MIM — Polar White',
  'Đã bán — giữ trang này để khách xem lại được cây mình đã mua.',
  'VERY_GOOD',3480,2018,'Mexico',17900000,NULL,'SOLD','PURCHASED',false, now() - interval '40 day'),
 (12,6,'NA-EG-0272',NULL,'yamaha-pacifica-112v-sonic-blue-na-eg-0272',
  'Yamaha Pacifica 112V — Sonic Blue',
  'Đang chờ chụp ảnh và kiểm tra, chưa lên kệ.',
  'GOOD',3540,2020,'Indonesia',6400000,NULL,'DRAFT','PURCHASED',false, NULL);
SELECT setval('items_id_seq', 12);
UPDATE items SET sold_at = now() - interval '26 day' WHERE id = 11;

-- Anh: dat ten theo quy uoc muc 5.
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
    ('BRIDGE',3,'cầu đàn'),
    ('FRETBOARD',4,'mặt phím')
) AS k(kind, ord, vi);

INSERT INTO item_flaws (item_id, title, description, sort_order) VALUES
 (1,'Xước nhẹ mặt lưng, cạnh dưới','Ba vết xước dài chừng 2cm do khóa dây quần áo, chỉ ở lớp sơn bóng, chưa tới gỗ.',0),
 (1,'Mòn nhẹ phím 1–5','Vết lõm rất nông ở dây 3 và 4, chưa ảnh hưởng tiếng, chưa cần dũa phím.',1),
 (2,'Vết đập nhỏ ở góc dưới thân','Đường kính chừng 4mm, đã chạm tới gỗ, không lan.',0),
 (2,'Núm volume hơi rơ','Xoay còn ăn, nhưng lỏng hơn núm tone. Shop có sẵn núm thay 60.000₫.',1),
 (3,'Ố nhẹ phần mạ ở cầu đàn','Do mồ hôi tay, đã đánh sạch, còn vết mờ nhìn nghiêng mới thấy.',0),
 (4,'Ám vàng lớp sơn ở mặt cần','Bình thường với Gibson dùng lâu, không phải hư hại.',0),
 (5,'Xước dăm ở mặt sau cần, gần phím 3','Cảm nhận được khi rê tay nhưng không vướng.',0),
 (6,'Sờn cạnh pickguard','Vết dùng bình thường của đàn tập.',0),
 (8,'Xước quét hình quạt dưới lỗ thoát âm','Do gảy pick không dùng miếng chắn.',0),
 (9,'Cần cong nhẹ hướng lên','Đo được 0.6mm ở phím 8. Chỉnh ty là hết, đã trừ vào giá.',0),
 (9,'Nứt tóc 3cm ở hông dưới','Nứt kín, không hở, không lan. Có ảnh cận kèm theo.',1),
 (9,'Action cao 3.6mm ở phím 12','Bấm nặng tay. Mài lược và xương ngựa là về chuẩn.',2),
 (10,'Xước nhỏ mặt sau thân','Hai vết ngắn, chỉ ở lớp sơn.',0);

-- Kiem tra 32 diem
INSERT INTO inspections (id, item_id, checked_at, note) VALUES
 (1,1, now() - interval '7 day', 'Chỉnh ty, hạ action còn 1.8mm ở phím 12, làm sạch mạch, thay dây 09-42.'),
 (2,3, now() - interval '4 day', 'Thay dây, chỉnh intonation, siết chốt khóa.'),
 (3,6, now() - interval '2 day', 'Vệ sinh mặt phím, dầu rosewood, cân lại lò xo cần rung.'),
 (4,7, now() - interval '5 day', 'Đàn gần như mới, chỉ kiểm tra và thay dây.'),
 (5,9, now() - interval '6 day', 'Ghi nhận cần cong và vết nứt. Chưa sửa — bán đúng tình trạng.');
SELECT setval('inspections_id_seq', 5);

INSERT INTO inspection_checks (inspection_id, code, label, passed, sort_order)
SELECT ins.id, c.code, c.label,
       -- Cay id=9 (Cort AD810) truot dung nhung diem lien quan toi can va than dan
       CASE WHEN ins.item_id = 9
                 AND c.code IN ('NECK_RELIEF','ACTION_12','ACTION_1','NUT_SLOT','BODY_CRACK')
            THEN false ELSE true END,
       c.ord
FROM inspections ins
CROSS JOIN (VALUES
 ('NECK_RELIEF',   'Độ cong cần, đo bằng thước thẳng', 1),
 ('TRUSS_ROD',     'Ty chỉnh cần xoay được cả hai chiều', 2),
 ('NECK_JOINT',    'Mối nối cần vào thân chắc, không hở', 3),
 ('NECK_TWIST',    'Cần không xoắn', 4),
 ('ACTION_1',      'Độ cao dây ở phím 1', 5),
 ('ACTION_12',     'Độ cao dây ở phím 12', 6),
 ('NUT_SLOT',      'Rãnh lược đúng độ sâu, không kẹt dây', 7),
 ('FRET_LEVEL',    'Phím đều, không có phím cao', 8),
 ('FRET_ENDS',     'Đầu phím không cấn tay', 9),
 ('FRET_WEAR',     'Mức mòn phím', 10),
 ('FRETBOARD',     'Mặt phím không nứt, không khô', 11),
 ('INTONATION',    'Intonation chuẩn trên cả 6 dây', 12),
 ('TUNER_HOLD',    'Khóa dây giữ được cao độ', 13),
 ('TUNER_SMOOTH',  'Khóa dây xoay đều, không rơ', 14),
 ('STRING_TREE',   'Chốt dẫn dây bắt chắc', 15),
 ('BRIDGE_SEAT',   'Cầu đàn đặt chắc, đủ ốc', 16),
 ('SADDLE',        'Ngựa đàn không mòn lệch', 17),
 ('TREMOLO',       'Cần rung về đúng cao độ sau khi nhún', 18),
 ('SPRING_CLAW',   'Lò xo và móc lò xo cân', 19),
 ('BODY_CRACK',    'Thân đàn không nứt, không hở keo', 20),
 ('FINISH',        'Lớp sơn — ghi rõ mọi khuyết điểm', 21),
 ('BINDING',       'Nẹp viền không bong', 22),
 ('PICKUP_HEIGHT', 'Chiều cao pickup cân hai bên', 23),
 ('PICKUP_OUTPUT', 'Các pickup đều ra tiếng, cân nhau', 24),
 ('SWITCH',        'Cần gạt ăn đủ vị trí, không rẹt', 25),
 ('POT_VOLUME',    'Núm volume xoay êm, không rẹt', 26),
 ('POT_TONE',      'Núm tone ăn đủ dải', 27),
 ('JACK',          'Giắc cắm chắc, không đứt tiếng khi lắc', 28),
 ('SOLDER',        'Mối hàn trong khoang sạch và chắc', 29),
 ('SHIELDING',     'Khoang điện có chống nhiễu', 30),
 ('GROUND_HUM',    'Không ù quá mức khi rời tay khỏi dây', 31),
 ('HARDWARE',      'Toàn bộ ốc vít đủ và siết đúng lực', 32)
) AS c(code, label, ord);
