-- HRC-HUB Foundation Schema

CREATE TABLE IF NOT EXISTS roles (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organizations (
  id BIGSERIAL PRIMARY KEY,
  organization_type VARCHAR(20) CHECK (organization_type IN ('BUSINESS','PROVIDER','ADMIN')) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  legal_name VARCHAR(200) NULL,
  gst_number VARCHAR(30) NULL,
  email VARCHAR(150) NULL,
  phone VARCHAR(20) NULL,
  website VARCHAR(255) NULL,
  logo_media_id BIGINT NULL,
  address_line1 VARCHAR(255) NULL,
  address_line2 VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  pincode VARCHAR(10) NULL,
  country VARCHAR(100) DEFAULT 'India',
  status VARCHAR(20) CHECK (status IN ('DRAFT','PENDING_APPROVAL','ACTIVE','REJECTED','SUSPENDED')) DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NULL,
  role_id SMALLINT NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('PENDING','ACTIVE','INACTIVE','REJECTED','SUSPENDED')) DEFAULT 'PENDING',
  email_verified_at TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS business_profiles (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT UNIQUE NOT NULL,
  business_category VARCHAR(30) CHECK (business_category IN ('HOTEL','RESTAURANT','CAFE','CATERING','BAKERY','SWEET_SHOP','FAST_FOOD','OTHER')) NOT NULL,
  description TEXT NULL,
  opening_time TIME NULL,
  closing_time TIME NULL,
  average_monthly_purchase DECIMAL(12,2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS provider_categories (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS provider_profiles (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT UNIQUE NOT NULL,
  provider_category_id SMALLINT NOT NULL,
  description TEXT NULL,
  service_area VARCHAR(255) NULL,
  availability_status VARCHAR(20) CHECK (availability_status IN ('AVAILABLE','LIMITED','UNAVAILABLE')) DEFAULT 'AVAILABLE',
  approval_status VARCHAR(20) CHECK (approval_status IN ('PENDING','APPROVED','REJECTED')) DEFAULT 'PENDING',
  approved_by_user_id BIGINT NULL,
  approved_at TIMESTAMP NULL,
  rejection_reason TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (provider_category_id) REFERENCES provider_categories(id),
  FOREIGN KEY (approved_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS branches (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL,
  branch_name VARCHAR(150) NOT NULL,
  contact_person VARCHAR(150) NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(150) NULL,
  address_line1 VARCHAR(255) NULL,
  address_line2 VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  state VARCHAR(100) NULL,
  pincode VARCHAR(10) NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS listing_categories (
  id BIGSERIAL PRIMARY KEY,
  provider_category_id SMALLINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_category_id) REFERENCES provider_categories(id),
  UNIQUE (provider_category_id, code)
);

CREATE TABLE IF NOT EXISTS product_listings (
  id BIGSERIAL PRIMARY KEY,
  provider_organization_id BIGINT NOT NULL,
  listing_category_id BIGINT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  unit VARCHAR(50) NOT NULL,
  price_per_unit DECIMAL(12,2) NOT NULL,
  minimum_order_quantity DECIMAL(12,2) DEFAULT 1.00,
  inventory_status VARCHAR(20) CHECK (inventory_status IN ('IN_STOCK','LOW_STOCK','OUT_OF_STOCK')) DEFAULT 'IN_STOCK',
  image_media_id BIGINT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_organization_id) REFERENCES organizations(id),
  FOREIGN KEY (listing_category_id) REFERENCES listing_categories(id)
);

CREATE TABLE IF NOT EXISTS service_listings (
  id BIGSERIAL PRIMARY KEY,
  provider_organization_id BIGINT NOT NULL,
  listing_category_id BIGINT NOT NULL,
  service_name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  service_area VARCHAR(255) NULL,
  base_price DECIMAL(12,2) NULL,
  pricing_type VARCHAR(20) CHECK (pricing_type IN ('FIXED','HOURLY','VISIT_BASED','CUSTOM')) DEFAULT 'CUSTOM',
  availability_status VARCHAR(20) CHECK (availability_status IN ('AVAILABLE','LIMITED','UNAVAILABLE')) DEFAULT 'AVAILABLE',
  image_media_id BIGINT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_organization_id) REFERENCES organizations(id),
  FOREIGN KEY (listing_category_id) REFERENCES listing_categories(id)
);

CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  business_organization_id BIGINT NOT NULL,
  created_by_user_id BIGINT NOT NULL,
  provider_category_id SMALLINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  required_by_date DATE NULL,
  delivery_address TEXT NULL,
  status VARCHAR(20) CHECK (status IN ('DRAFT','SENT','QUOTED','CONFIRMED','CANCELLED','CLOSED')) DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_organization_id) REFERENCES organizations(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  FOREIGN KEY (provider_category_id) REFERENCES provider_categories(id)
);

CREATE TABLE IF NOT EXISTS quotations (
  id BIGSERIAL PRIMARY KEY,
  quotation_number VARCHAR(50) UNIQUE NOT NULL,
  enquiry_id BIGINT NOT NULL,
  provider_organization_id BIGINT NOT NULL,
  created_by_user_id BIGINT NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  tax_amount DECIMAL(12,2) DEFAULT 0.00,
  discount_amount DECIMAL(12,2) DEFAULT 0.00,
  final_amount DECIMAL(12,2) NOT NULL,
  valid_until DATE NULL,
  terms_and_conditions TEXT NULL,
  status VARCHAR(20) CHECK (status IN ('SENT','VIEWED','ACCEPTED','REJECTED','EXPIRED','CANCELLED')) DEFAULT 'SENT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enquiry_id) REFERENCES enquiries(id),
  FOREIGN KEY (provider_organization_id) REFERENCES organizations(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  enquiry_id BIGINT NOT NULL,
  quotation_id BIGINT UNIQUE NOT NULL,
  business_organization_id BIGINT NOT NULL,
  provider_organization_id BIGINT NOT NULL,
  order_type VARCHAR(30) CHECK (order_type IN ('RAW_MATERIAL','SERVICE','MANPOWER','MARKETING')) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(30) CHECK (status IN ('CONFIRMED','PROCESSING','DELIVERY_OR_SERVICE','COMPLETED','CANCELLED')) DEFAULT 'CONFIRMED',
  expected_completion_date DATE NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enquiry_id) REFERENCES enquiries(id),
  FOREIGN KEY (quotation_id) REFERENCES quotations(id),
  FOREIGN KEY (business_organization_id) REFERENCES organizations(id),
  FOREIGN KEY (provider_organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  organization_id BIGINT NULL,
  type VARCHAR(50) CHECK (type IN ('NEW_ENQUIRY','NEW_QUOTATION','ORDER_STATUS_UPDATE','SERVICE_UPDATE','REGISTRATION_APPROVED','REGISTRATION_REJECTED','COMPLAINT_UPDATE')) NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  reference_type VARCHAR(50) NULL,
  reference_id BIGINT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  fcm_sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS complaints (
  id BIGSERIAL PRIMARY KEY,
  created_by_user_id BIGINT NOT NULL,
  organization_id BIGINT NOT NULL,
  against_organization_id BIGINT NULL,
  order_id BIGINT NULL,
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('OPEN','IN_REVIEW','RESOLVED','REJECTED','CLOSED')) DEFAULT 'OPEN',
  admin_response TEXT NULL,
  resolved_by_user_id BIGINT NULL,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (against_organization_id) REFERENCES organizations(id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (resolved_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NULL,
  organization_id BIGINT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NULL,
  entity_id BIGINT NULL,
  old_value JSON NULL,
  new_value JSON NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);
