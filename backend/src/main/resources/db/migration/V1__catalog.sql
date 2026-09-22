-- Giai doan 1: danh muc & tung cay dan.
-- Quy uoc (muc 3.2): tien = BIGINT dong, thoi gian = TIMESTAMPTZ, xoa mem bang deleted_at.

CREATE TABLE brands (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    slug        VARCHAR(140) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    slug        VARCHAR(140) NOT NULL UNIQUE,
    parent_id   BIGINT REFERENCES categories (id),
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE product_models (
    id             BIGSERIAL PRIMARY KEY,
    category_id    BIGINT       NOT NULL REFERENCES categories (id),
    brand_id       BIGINT       REFERENCES brands (id),
    name           VARCHAR(200) NOT NULL,
    slug           VARCHAR(220) NOT NULL UNIQUE,
    description    TEXT,
    specs          JSONB        NOT NULL DEFAULT '{}'::jsonb,
    -- is_unique = true: moi cay mot dong trong `items` (dan).
    -- is_unique = false: chi can so luong ton (day, pick, cable).
    is_unique      BOOLEAN      NOT NULL DEFAULT true,
    stock_quantity INT,
    list_price_vnd BIGINT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted_at     TIMESTAMPTZ,
    CONSTRAINT product_models_stock_ck
        CHECK (is_unique OR (stock_quantity IS NOT NULL AND stock_quantity >= 0))
);

CREATE TABLE items (
    id                    BIGSERIAL PRIMARY KEY,
    product_model_id      BIGINT       NOT NULL REFERENCES product_models (id),
    sku                   VARCHAR(60)  NOT NULL UNIQUE,
    serial_no             VARCHAR(120) UNIQUE,
    slug                  VARCHAR(240) NOT NULL UNIQUE,
    title                 VARCHAR(240) NOT NULL,
    summary               TEXT,
    condition_grade       VARCHAR(20)  NOT NULL,
    weight_grams          INT,
    year_made             INT,
    made_in               VARCHAR(80),
    price_vnd             BIGINT       NOT NULL CHECK (price_vnd >= 0),
    compare_at_price_vnd  BIGINT       CHECK (compare_at_price_vnd IS NULL OR compare_at_price_vnd >= 0),
    status                VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    source                VARCHAR(20)  NOT NULL DEFAULT 'PURCHASED',
    accepts_offers        BOOLEAN      NOT NULL DEFAULT false,
    consignment_id        BIGINT,
    published_at          TIMESTAMPTZ,
    sold_at               TIMESTAMPTZ,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    deleted_at            TIMESTAMPTZ,
    CONSTRAINT items_condition_ck CHECK (condition_grade IN
        ('NEW','MINT','EXCELLENT','VERY_GOOD','GOOD','FAIR')),
    CONSTRAINT items_status_ck CHECK (status IN
        ('DRAFT','AVAILABLE','RESERVED','SOLD','RETURNED')),
    CONSTRAINT items_source_ck CHECK (source IN
        ('NEW_STOCK','PURCHASED','CONSIGNMENT'))
);

CREATE TABLE item_photos (
    id          BIGSERIAL PRIMARY KEY,
    item_id     BIGINT       NOT NULL REFERENCES items (id) ON DELETE CASCADE,
    r2_key      VARCHAR(400) NOT NULL,
    kind        VARCHAR(20)  NOT NULL DEFAULT 'OTHER',
    sort_order  INT          NOT NULL DEFAULT 0,
    alt_text    VARCHAR(300),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT item_photos_kind_ck CHECK (kind IN
        ('MAIN','BACK','HEADSTOCK','BRIDGE','FRETBOARD','FLAW','OTHER'))
);

-- Cam ket "thay vet khong co trong danh sach nay thi shop nhan lai" chi giu duoc
-- neu bang nay ghi du (muc 3.3).
CREATE TABLE item_flaws (
    id          BIGSERIAL PRIMARY KEY,
    item_id     BIGINT       NOT NULL REFERENCES items (id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    photo_id    BIGINT       REFERENCES item_photos (id) ON DELETE SET NULL,
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE inspections (
    id            BIGSERIAL PRIMARY KEY,
    item_id       BIGINT      NOT NULL REFERENCES items (id) ON DELETE CASCADE,
    technician_id BIGINT,
    checked_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    note          TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE inspection_checks (
    id            BIGSERIAL PRIMARY KEY,
    inspection_id BIGINT       NOT NULL REFERENCES inspections (id) ON DELETE CASCADE,
    code          VARCHAR(40)  NOT NULL,
    label         VARCHAR(200) NOT NULL,
    passed        BOOLEAN      NOT NULL,
    note          VARCHAR(300),
    sort_order    INT          NOT NULL DEFAULT 0
);

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(200) NOT NULL UNIQUE,
    phone         VARCHAR(30),
    password_hash VARCHAR(200) NOT NULL,
    full_name     VARCHAR(160) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT users_role_ck CHECK (role IN ('CUSTOMER','STAFF','ADMIN'))
);

-- Index can co ngay (muc 3.6.5)
CREATE INDEX items_status_published_idx ON items (status, published_at DESC);
CREATE INDEX items_model_idx            ON items (product_model_id);
CREATE INDEX item_photos_item_sort_idx  ON item_photos (item_id, sort_order);
CREATE INDEX item_flaws_item_idx        ON item_flaws (item_id, sort_order);
CREATE INDEX product_models_cat_idx     ON product_models (category_id);
