// Customer
const dropCustomerTableSQL = 'DROP TABLE IF EXISTS customer'
const createCustomerTableSQL = `CREATE TABLE customer (
  customer_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (customer_id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone_number VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_create_id VARCHAR(12) NOT NULL,
  customer_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  customer_create_ip VARCHAR(15) NOT NULL,
  customer_update_id VARCHAR(12) DEFAULT NULL,
  customer_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  customer_update_ip VARCHAR(15) DEFAULT NULL,
  customer_note TEXT DEFAULT NULL,
  customer_status BOOLEAN NOT NULL
)`
const initialCustomerSQL = `INSERT INTO customer (customer_id, customer_name, customer_phone_number, customer_email, customer_address, customer_create_id, customer_create_date, customer_create_ip, customer_update_id, customer_update_date, customer_update_ip, customer_note, customer_status) VALUES
('C3107220001', 'Christian Zamorano Setiawan', '081235250435', 'zamoranochristian7@gmail.com', 'Rungkut Mapan Tengah III CC/11a', 'CC3107220001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1)`

// DTrans
const dropDTransTableSQL = 'DROP TABLE IF EXISTS d_trans'
const createDTransTableSQL = `CREATE TABLE d_trans (
  d_trans_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (d_trans_id),
  d_trans_create_id VARCHAR(12) NOT NULL,
  d_trans_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  d_trans_create_ip VARCHAR(15) NOT NULL,
  d_trans_update_id VARCHAR(12) DEFAULT NULL,
  d_trans_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  d_trans_update_ip VARCHAR(15) DEFAULT NULL,
  d_trans_note TEXT DEFAULT NULL,
  d_trans_done BOOLEAN NOT NULL,
  d_trans_quantity INT NOT NULL,
  d_trans_subtotal BIGINT(20) NOT NULL,
  d_trans_status BOOLEAN NOT NULL,
  FK_h_product_id VARCHAR(11) NOT NULL,
  FK_user_id VARCHAR(11) DEFAULT NULL,
  FK_h_trans_id VARCHAR(11) NOT NULL
)`
const insertDTransSQL = `INSERT INTO d_trans (d_trans_id, d_trans_main_photo, d_trans_main_note, d_trans_top_photo, d_trans_top_note, d_trans_left_photo, d_trans_left_note, d_trans_right_photo, d_trans_right_note, d_trans_below_photo, d_trans_below_note, d_trans_create_id, d_trans_create_date, d_trans_create_ip, d_trans_update_id, d_trans_update_date, d_trans_update_ip, d_trans_note, d_trans_done, d_trans_quantity, d_trans_subtotal, d_trans_status, FK_h_product_id, FK_user_id, FK_h_trans_id) VALUES ?`
const initialDTransSQL = `INSERT INTO d_trans (d_trans_id, d_trans_main_photo, d_trans_main_note, d_trans_top_photo, d_trans_top_note, d_trans_left_photo, d_trans_left_note, d_trans_right_photo, d_trans_right_note, d_trans_below_photo, d_trans_below_note, d_trans_create_id, d_trans_create_date, d_trans_create_ip, d_trans_update_id, d_trans_update_date, d_trans_update_ip, d_trans_note, d_trans_done, d_trans_quantity, d_trans_subtotal, d_trans_status, FK_h_product_id, FK_user_id, FK_h_trans_id) VALUES 
('DT100922001', 'DTC100922001', '2022-09-10', '::1', NULL, '2022-09-10', NULL, 'data dummy', 0, 1, 1, 15000 'HP3107220001', NULL, 'T1009220001'),
('DT310722001', 'DTC310722001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 0, 1, 1, 15000  'HP3107220001', NULL, 'T3107220001'),
('DT310722002', 'DTC310722002', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 0, 1, 1, 15000  'HP3107220002', NULL, 'T3107220001')`

// HTrans
const dropHTransTableSQL = 'DROP TABLE IF EXISTS h_trans'
const createHTransTableSQL = `CREATE TABLE h_trans (
  h_trans_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (h_trans_id),
  h_trans_main_photo VARCHAR(255) DEFAULT NULL,
  h_trans_main_note TEXT DEFAULT NULL,
  h_trans_top_photo VARCHAR(255) DEFAULT NULL,
  h_trans_top_note TEXT DEFAULT NULL,
  h_trans_left_photo VARCHAR(255) DEFAULT NULL,
  h_trans_left_note TEXT DEFAULT NULL,
  h_trans_right_photo VARCHAR(255) DEFAULT NULL,
  h_trans_right_note TEXT DEFAULT NULL,
  h_trans_below_photo VARCHAR(255) DEFAULT NULL,
  h_trans_below_note TEXT DEFAULT NULL,
  h_trans_total BIGINT(20) NOT NULL,
  h_trans_create_id VARCHAR(12) NOT NULL,
  h_trans_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_trans_create_ip VARCHAR(15) NOT NULL,
  h_trans_update_id VARCHAR(12) DEFAULT NULL,
  h_trans_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_trans_update_ip VARCHAR(15) DEFAULT NULL,
  h_trans_note TEXT DEFAULT NULL,
  h_trans_progress TINYINT(1) DEFAULT 0,
  h_trans_status BOOLEAN NOT NULL,
  FK_customer_id VARCHAR(11) NOT NULL
)`
const insertHTransSQL = `INSERT INTO h_trans (h_trans_id, h_trans_total, h_trans_create_id, h_trans_create_date, h_trans_create_ip, h_trans_update_id, h_trans_update_date, h_trans_update_ip, h_trans_note, h_trans_status, FK_customer_id) VALUES ?`
const initialHTransSQL = `INSERT INTO h_trans (h_trans_id, h_trans_total, h_trans_create_id, h_trans_create_date, h_trans_create_ip, h_trans_update_id, h_trans_update_date, h_trans_update_ip, h_trans_note, h_trans_status, FK_customer_id) VALUES 
('T3107220001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 100000, 'TC3107220001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'C3107220001'),
('T1009220001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 250000, 'TC1009220001', '2022-09-10', '::1', NULL, '2022-09-10', NULL, 'data dummy coba api', 1, 'C3107220001')`

// HProduct
const dropHProductTableSQL = 'DROP TABLE IF EXISTS h_product'
const createHProductTableSQL = `CREATE TABLE h_product (
  h_product_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (h_product_id),
  h_product_price BIGINT(20) NOT NULL,
  h_product_create_id VARCHAR(12) NOT NULL,
  h_product_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_product_create_ip VARCHAR(15) NOT NULL,
  h_product_update_id VARCHAR(12) DEFAULT NULL,
  h_product_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_product_update_ip VARCHAR(15) DEFAULT NULL,
  h_product_note TEXT DEFAULT NULL,
  h_product_status BOOLEAN NOT NULL,
  FK_product_id VARCHAR(11) NOT NULL
)`
const insertHProductSQL = `INSERT INTO h_product (h_product_id, h_product_price, h_product_create_id, h_product_create_date, h_product_create_ip, h_product_update_id, h_product_update_date, h_product_update_ip, h_product_note, h_product_status, FK_product_id) VALUES ?`
const initialHProductSQL = `INSERT INTO h_product (h_product_id, h_product_price, h_product_create_id, h_product_create_date, h_product_create_ip, h_product_update_id, h_product_update_date, h_product_update_ip, h_product_note, h_product_status, FK_product_id) VALUES 
('HP310722001', 25000, 'HPC310722001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'P3107220001'),
('HP310722002', 75000, 'HPC310722002', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1, 'P3107220002')`

// Privilege
const dropPrivilegeTableSQL = 'DROP TABLE IF EXISTS privilege'
const createPrivilegeTableSQL = `CREATE TABLE privilege (
  privilege_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (privilege_id),
  privilege_name TEXT NOT NULL,
  privilege_create_id VARCHAR(12) NOT NULL,
  privilege_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  privilege_create_ip VARCHAR(15) NOT NULL,
  privilege_update_id VARCHAR(12) DEFAULT NULL,
  privilege_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  privilege_update_ip VARCHAR(15) DEFAULT NULL,
  privilege_note TEXT DEFAULT NULL,
  privilege_status BOOLEAN NOT NULL
)`
const initialPrivilegeSQL = `INSERT INTO privilege (privilege_id, privilege_name, privilege_create_id, privilege_create_date, privilege_create_ip, privilege_update_id, privilege_update_date, privilege_update_ip, privilege_note, privilege_status) VALUES 
('PR310722001', 'Administrator', 'PRC310722001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722002', 'View Customer', 'PRC310722002', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722003', 'Create Customer', 'PRC310722003', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722004', 'Update Customer', 'PRC310722004', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722005', 'Delete Customer', 'PRC310722005', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722006', 'View Produk', 'PRC310722006', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722007', 'Create Produk', 'PRC3107122007', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722008', 'Update Produk', 'PRC310722008', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722009', 'Delete Produk', 'PRC310722009', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722010', 'View Jasa', 'PRC310722010', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722011', 'Create Jasa', 'PRC310722011', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722012', 'Update Jasa', 'PRC310722012', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('PR310722013', 'Delete Jasa', 'PRC310722013', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1)`

// Product
const dropProductTableSQL = 'DROP TABLE IF EXISTS product'
const createProductTableSQL = `CREATE TABLE product (
  product_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (product_id),
  product_name VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_price BIGINT(20) NOT NULL,
  product_brand VARCHAR(255) DEFAULT NULL,
  product_stock int(11) NOT NULL,
  product_category TEXT NOT NULL,
  product_create_id VARCHAR(12) NOT NULL,
  product_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  product_create_ip VARCHAR(15) NOT NULL,
  product_update_id VARCHAR(12) DEFAULT NULL,
  product_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  product_update_ip VARCHAR(15) DEFAULT NULL,
  product_note TEXT DEFAULT NULL,
  product_status BOOLEAN NOT NULL
)`
const insertProductSQL = `INSERT INTO product (product_id, product_name, product_type, product_price, product_brand, product_stock, product_category, product_create_id, product_create_date, product_create_ip, product_update_id, product_update_date, product_update_ip, product_note, product_status) VALUES ?`
const initialProductSQL = `INSERT INTO product (product_id, product_name, product_type, product_price, product_brand, product_stock, product_category, product_create_id, product_create_date, product_create_ip, product_update_id, product_update_date, product_update_ip, product_note, product_status) VALUES
('P1209220001', 'Tali Sepatu', 'produk', 150000, 'nike', 50, 'aksesoris', 'PC120922001', '2022-09-12', '::1', NULL, '2022-09-12', NULL, 'data dummy', 1),
('P1209220002', 'Steam Dry', 'jasa', 60000, NULL, 5, 'drying', 'PC120922002', '2022-09-12', '::1', NULL, '2022-09-12', NULL, 'data dummy', 1),
('P3107220001', 'Wax', 'produk', 25000, 'kiwi', 50, 'habis pakai', 'PC310722001', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1),
('P3107220002', 'Deep Wash', 'jasa', 75000, NULL, 10, 'washing', 'PC310722002', '2022-07-31', '192.168.18.36', NULL, NULL, NULL, NULL, 1)`

// User
const dropUserTableSQL = 'DROP TABLE IF EXISTS user'
const createUserTableSQL = `CREATE TABLE user (
  user_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (user_id),
  user_name VARCHAR(255) NOT NULL,
  user_username VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_create_id VARCHAR(12) NOT NULL,
  user_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_create_ip VARCHAR(15) NOT NULL,
  user_update_id VARCHAR(12) DEFAULT NULL,
  user_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_update_ip VARCHAR(15) DEFAULT NULL,
  user_note TEXT DEFAULT NULL,
  user_status BOOLEAN NOT NULL
)`

// User Login
const dropUserLoginTableSQL = 'DROP TABLE IF EXISTS user_login'
const createUserLoginTableSQL = `CREATE TABLE user_login (
  user_login_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (user_login_id),
  FK_user_id VARCHAR(11) NOT NULL,
  user_login_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_login_ip VARCHAR(15) NOT NULL,
  user_login_status BOOLEAN NOT NULL,
  user_login_create_id VARCHAR(12) NOT NULL,
  user_login_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_login_update_id VARCHAR(12) DEFAULT NULL,
  user_login_update_date DATETIME DEFAULT CURRENT_TIMESTAMP
)`
const insertUserLoginSQL = `INSERT INTO user_login(user_login_id, FK_user_id, user_login_date, user_login_ip, user_login_status, user_login_create_id, user_login_create_date, user_login_update_id, user_login_update_date) VALUES ?`
const initialUserLoginSQL = `INSERT INTO user_login(user_login_id, FK_user_id, user_login_date, user_login_ip, user_login_status, user_login_create_id, user_login_create_date, user_login_update_id, user_login_update_date) VALUES 
('L1209220001', 'U1209220001', '2022-09-12', '::1', 0, 'LC120922001', '2022-09-12', 'LU120922001', '2022-09-12'),
('L1209220002', 'U1209220001', '2022-09-12', '::1', 0, 'LC120922002', '2022-09-12', 'LU120922001', '2022-09-12')`

// User Privilege
const dropUserPrivilegeTableSQL = 'DROP TABLE IF EXISTS user_privilege'
const createUserPrivilegeTableSQL = `CREATE TABLE user_privilege (
  user_privilege_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (user_privilege_id),
  user_privilege_create_id VARCHAR(12) NOT NULL,
  user_privilege_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_privilege_create_ip VARCHAR(15) NOT NULL,
  user_privilege_update_id VARCHAR(12) DEFAULT NULL,
  user_privilege_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_privilege_update_ip VARCHAR(15) DEFAULT NULL,
  user_privilege_note TEXT DEFAULT NULL,
  user_privilege_status BOOLEAN NOT NULL,
  FK_user_id VARCHAR(11) NOT NULL,
  FK_privilege_id VARCHAR(11) NOT NULL
)`
const insertUserPrivilegeSQL = `INSERT INTO user_privilege (user_privilege_id, user_privilege_create_id, user_privilege_create_date, user_privilege_create_ip, user_privilege_update_id, user_privilege_update_date, user_privilege_update_ip, user_privilege_note, user_privilege_status, FK_user_id, FK_privilege_id) VALUES ?`
const initialUserPrivilegeSQL = `INSERT INTO user_privilege (user_privilege_id, user_privilege_create_id, user_privilege_create_date, user_privilege_create_ip, user_privilege_update_id, user_privilege_update_date, user_privilege_update_ip, user_privilege_note, user_privilege_status, FK_user_id, FK_privilege_id) VALUES 
('UP310722001', 'UPC310722001', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220001', 'PR310722001'),
('UP310722002', 'UPC310722002', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220002', 'PR310722002'),
('UP310722003', 'UPC310722003', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220002', 'PR310722003'),
('UP310722004', 'UPC310722004', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220002', 'PR310722004'),
('UP310722005', 'UPC310722005', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220002', 'PR310722005'),
('UP310722006', 'UPC310722006', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220002', 'PR310722006'),
('UP310722007', 'UPC310722007', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220002', 'PR310722007'),
('UP310722008', 'UPC310722008', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220002', 'PR310722008'),
('UP310722009', 'UPC310722009', '2022-09-12', '192.168.18.36', NULL, '2022-09-12', NULL, NULL, 1, 'U1209220002', 'PR310722009')`

export const dropTables = {
  dropCustomerTableSQL,
  dropDTransTableSQL,
  dropHProductTableSQL,
  dropHTransTableSQL,
  dropPrivilegeTableSQL,
  dropProductTableSQL,
  dropUserLoginTableSQL,
  dropUserPrivilegeTableSQL,
  dropUserTableSQL,
}

export const createTables = {
  createCustomerTableSQL,
  createDTransTableSQL,
  createHProductTableSQL,
  createHTransTableSQL,
  createPrivilegeTableSQL,
  createProductTableSQL,
  createUserLoginTableSQL,
  createUserPrivilegeTableSQL,
  createUserTableSQL,
}

export const insertSQL = {
  insertDTransSQL,
  insertHProductSQL,
  insertHTransSQL,
  insertProductSQL,
  insertUserLoginSQL,
  insertUserPrivilegeSQL,
}

export const initialRecords = {
  initialCustomerSQL,
  initialDTransSQL,
  initialHProductSQL,
  initialHTransSQL,
  initialPrivilegeSQL,
  initialProductSQL,
  initialUserLoginSQL,
  initialUserPrivilegeSQL,
}
