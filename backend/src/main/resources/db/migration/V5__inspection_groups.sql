-- Nhom cua tung diem kiem tra truoc day nam cung trong frontend (CHECK_GROUPS).
-- Dua xuong database de trang chi tiet va form quan tri dung chung mot nguon.

ALTER TABLE inspection_checks ADD COLUMN group_name VARCHAR(60);

UPDATE inspection_checks SET group_name = CASE
    WHEN code IN ('NECK_RELIEF','TRUSS_ROD','NECK_JOINT','NECK_TWIST','ACTION_1','ACTION_12',
                  'NUT_SLOT','FRET_LEVEL','FRET_ENDS','FRET_WEAR','FRETBOARD')
         THEN 'Cần & mặt phím'
    WHEN code IN ('PICKUP_HEIGHT','PICKUP_OUTPUT','SWITCH','POT_VOLUME','POT_TONE','JACK',
                  'SOLDER','SHIELDING','GROUND_HUM')
         THEN 'Điện & tiếng'
    WHEN code IN ('TUNER_HOLD','TUNER_SMOOTH','STRING_TREE','BRIDGE_SEAT','SADDLE','TREMOLO',
                  'SPRING_CLAW','HARDWARE')
         THEN 'Phần cứng'
    ELSE 'Thân đàn & bàn giao'
END;

ALTER TABLE inspection_checks ALTER COLUMN group_name SET NOT NULL;

CREATE INDEX inspection_checks_inspection_idx ON inspection_checks (inspection_id, sort_order);
