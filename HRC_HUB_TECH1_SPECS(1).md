# HRC-HUB Technical Specifications

**File:** `HRC_HUB_TECH1_SPECS.md`  
**Project:** HRC-HUB  
**Version:** Technical Specification Version 1  
**Based on:** HRC-HUB PRD Version 1  

---

## 1. Tech Stack

HRC-HUB is a B2B SaaS platform for HoReCa businesses and providers. The system needs role-based dashboards, marketplace discovery, enquiries, quotations, order/service workflow, notifications, reports, and admin approval. The following stack is recommended because it is beginner-friendly, scalable, and suitable for a student building a first real project.

### 1.1 Frontend

| Layer | Technology | Why This Is Recommended |
|---|---|---|
| App Framework | **React Native with Expo** | React Native allows one codebase for Android and iOS. Expo makes setup, routing, builds, push notification setup, and development easier for students. |
| Web Support | **React Native Web / Expo Web** | The PRD requires responsiveness across desktop, tablet, and mobile. React Native Web can reuse most screens for web access. |
| Navigation | **Expo Router** or **React Navigation** | Supports authentication routes, role-based navigation, nested dashboards, tabs, and stack navigation. |
| UI Components | **React Native Paper** or **NativeWind** | Speeds up UI development with reusable components, forms, buttons, cards, modals, and responsive layouts. |
| Forms | **React Hook Form + Zod** | Easy form validation for registration, login, profile, enquiries, quotations, and listing creation. |
| API Calls | **Axios** | Simple HTTP client for calling Express APIs with JWT token interceptors. |
| State Management | **Zustand** or **Redux Toolkit** | Zustand is simpler for a first project. Use it for auth state, user role, profile, filters, cart-like enquiry selections, and notifications. |
| Local Storage | **Expo SecureStore / AsyncStorage** | SecureStore stores access tokens on mobile. AsyncStorage can store non-sensitive UI preferences. |

> Important implementation note: The PRD lists native mobile applications as out of scope for Version 1. Since React Native is requested, the practical approach is to build the client in React Native/Expo and initially run it as a responsive web/mobile-ready app. Native Android/iOS deployment can be enabled later without rewriting the frontend.

### 1.2 Backend

| Layer | Technology | Why This Is Recommended |
|---|---|---|
| Runtime | **Node.js** | JavaScript can be used across frontend and backend. |
| API Framework | **Express.js** | Lightweight, beginner-friendly, and suitable for REST APIs. |
| Language | **JavaScript (ES6+)** | Simple, beginner-friendly, and directly matches Node.js and React Native development without extra type setup. |
| API Style | **REST API** | Easy to understand for student projects and works well with mobile/web clients. |
| Authentication | **JWT Access Token + Refresh Token** | Supports secure login, role-based access, and session refresh. |
| Password Security | **bcrypt** | Used to hash passwords before storing them in MySQL. |
| Validation |  **Joi** | Validates request payloads before saving data. |
| File Upload Handling | **Multer** | Temporarily handles images before uploading to Cloudinary. |
| Error Handling | **Centralized Express Error Middleware** | Keeps API responses consistent and easier to debug. |

### 1.3 Database

| Layer | Technology | Why This Is Recommended |
|---|---|---|
| Database | **MySQL 8** | Reliable relational database. Good for users, roles, organizations, enquiries, quotations, and orders. |
| ORM / Query Builder | **Prisma ORM** or **Sequelize** | Prisma is recommended because schema management, migrations, and clear database models are beginner-friendly. |
| Migrations | **Prisma Migrate** | Keeps database changes version-controlled. |
| Indexing | **MySQL Indexes** | Required for marketplace search, filters, enquiry status, provider category, and dashboard queries. |

### 1.4 Authentication and Authorization

| Component | Technology / Approach | Purpose |
|---|---|---|
| Login Session | JWT Access Token | Sent with every API request in `Authorization: Bearer <token>`. |
| Session Renewal | Refresh Token | Stored securely and used to issue new access tokens. |
| Password Hashing | bcrypt | Prevents storing plain-text passwords. |
| Role Enforcement | RBAC Middleware | Allows APIs only for permitted roles. |
| Account Status | `users.status` + `provider_profiles.approval_status` | Blocks inactive, rejected, or unapproved accounts. |

### 1.5 Third-Party Services and Infrastructure

| Service | Technology | Purpose |
|---|---|---|
| Image Storage | **Cloudinary** | Store business logos, provider images, product images, service images, marketing portfolio images, and documents. |
| Push Notifications | **Firebase Cloud Messaging (FCM)** | Send real-time notifications for new enquiries, new quotations, order status updates, service updates, and admin approval events. |
| Email Service | Nodemailer / SendGrid / Resend | Send forgot password emails, registration confirmation, and important alerts. |
| Environment Management | dotenv | Store secrets like JWT secret, database URL, Cloudinary keys, and FCM credentials. |
| API Testing | Postman / Thunder Client | Test all backend APIs. |
| Version Control | Git + GitHub | Track project changes and collaborate in a team. |
| Deployment | Render / Railway / VPS for backend, PlanetScale/Aiven/MySQL VPS for database, Expo/EAS for app | Beginner-friendly deployment options. |

### 1.6 Recommended Development Tools

| Tool | Use |
|---|---|
| VS Code | Main code editor. |
| ESLint + Prettier | Code formatting and linting. |
| GitHub Issues / Projects | Track tasks for frontend, backend, and database. |
| Draw.io / Excalidraw | Create flow diagrams and database diagrams. |
| MySQL Workbench / TablePlus | Inspect database tables. |

---

## 2. Folder Structure

Use a monorepo structure so the frontend, backend, shared constants, and documentation remain organized in one repository.

```txt
hrc-hub/
├── README.md
├── HRC_HUB_TECH1_SPECS.md
├── .gitignore
├── package.json
├── docs/
│   ├── api-endpoints.md
│   ├── database-notes.md
│   └── deployment-notes.md
│
├── apps/
│   ├── mobile/
│   │   ├── app.json
│   │   ├── package.json
│   │   ├── jsconfig.json
│   │   ├── .env.example
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── _layout.jsx
│   │   │   │   ├── index.jsx
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login.jsx
│   │   │   │   │   ├── register.jsx
│   │   │   │   │   └── forgot-password.jsx
│   │   │   │   ├── business/
│   │   │   │   │   ├── dashboard.jsx
│   │   │   │   │   ├── marketplace.jsx
│   │   │   │   │   ├── provider-details.jsx
│   │   │   │   │   ├── enquiries.jsx
│   │   │   │   │   ├── quotations.jsx
│   │   │   │   │   ├── orders.jsx
│   │   │   │   │   └── reports.jsx
│   │   │   │   ├── provider/
│   │   │   │   │   ├── dashboard.jsx
│   │   │   │   │   ├── listings.jsx
│   │   │   │   │   ├── enquiries.jsx
│   │   │   │   │   ├── quotations.jsx
│   │   │   │   │   ├── orders.jsx
│   │   │   │   │   └── availability.jsx
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard.jsx
│   │   │   │   │   ├── users.jsx
│   │   │   │   │   ├── approvals.jsx
│   │   │   │   │   ├── categories.jsx
│   │   │   │   │   ├── complaints.jsx
│   │   │   │   │   └── settings.jsx
│   │   │   │   └── shared/
│   │   │   │       ├── notifications.jsx
│   │   │   │       ├── profile.jsx
│   │   │   │       └── edit-profile.jsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── AppButton.jsx
│   │   │   │   │   ├── AppInput.jsx
│   │   │   │   │   ├── AppCard.jsx
│   │   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   │   └── EmptyState.jsx
│   │   │   │   ├── marketplace/
│   │   │   │   │   ├── ProviderCard.jsx
│   │   │   │   │   ├── FilterPanel.jsx
│   │   │   │   │   └── CompareProviderCard.jsx
│   │   │   │   ├── enquiry/
│   │   │   │   │   ├── EnquiryForm.jsx
│   │   │   │   │   ├── EnquiryStatusBadge.jsx
│   │   │   │   │   └── QuotationCard.jsx
│   │   │   │   └── dashboard/
│   │   │   │       ├── StatsCard.jsx
│   │   │   │       └── RecentActivityList.jsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── api.js
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── marketplace.service.js
│   │   │   │   ├── enquiry.service.js
│   │   │   │   ├── quotation.service.js
│   │   │   │   ├── order.service.js
│   │   │   │   ├── notification.service.js
│   │   │   │   └── upload.service.js
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── auth.store.js
│   │   │   │   ├── user.store.js
│   │   │   │   ├── marketplace.store.js
│   │   │   │   └── notification.store.js
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js
│   │   │   │   ├── useRoleRedirect.js
│   │   │   │   └── useFCMToken.js
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── roles.js
│   │   │   │   ├── statuses.js
│   │   │   │   └── apiRoutes.js
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── formatDate.js
│   │   │   │   ├── formatCurrency.js
│   │   │   │   └── validators.js
│   │   │   │
│   │   │   └── models/
│   │   │       ├── auth.model.js
│   │   │       ├── user.model.js
│   │   │       ├── marketplace.model.js
│   │   │       ├── enquiry.model.js
│   │   │       └── order.model.js
│   │   │
│   │   └── assets/
│   │       ├── images/
│   │       └── icons/
│   │
│   └── api/
│       ├── package.json
│       ├── jsconfig.json
│       ├── .env.example
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       │
│       └── src/
│           ├── server.js
│           ├── app.js
│           ├── config/
│           │   ├── database.js
│           │   ├── env.js
│           │   ├── cloudinary.js
│           │   └── firebase.js
│           │
│           ├── routes/
│           │   ├── index.js
│           │   ├── auth.routes.js
│           │   ├── user.routes.js
│           │   ├── organization.routes.js
│           │   ├── marketplace.routes.js
│           │   ├── provider.routes.js
│           │   ├── enquiry.routes.js
│           │   ├── quotation.routes.js
│           │   ├── order.routes.js
│           │   ├── notification.routes.js
│           │   ├── report.routes.js
│           │   ├── complaint.routes.js
│           │   └── admin.routes.js
│           │
│           ├── controllers/
│           │   ├── auth.controller.js
│           │   ├── user.controller.js
│           │   ├── organization.controller.js
│           │   ├── marketplace.controller.js
│           │   ├── provider.controller.js
│           │   ├── enquiry.controller.js
│           │   ├── quotation.controller.js
│           │   ├── order.controller.js
│           │   ├── notification.controller.js
│           │   ├── report.controller.js
│           │   ├── complaint.controller.js
│           │   └── admin.controller.js
│           │
│           ├── services/
│           │   ├── auth.service.js
│           │   ├── jwt.service.js
│           │   ├── password.service.js
│           │   ├── user.service.js
│           │   ├── organization.service.js
│           │   ├── marketplace.service.js
│           │   ├── provider.service.js
│           │   ├── enquiry.service.js
│           │   ├── quotation.service.js
│           │   ├── order.service.js
│           │   ├── notification.service.js
│           │   ├── fcm.service.js
│           │   ├── cloudinary.service.js
│           │   ├── report.service.js
│           │   └── audit.service.js
│           │
│           ├── middlewares/
│           │   ├── auth.middleware.js
│           │   ├── role.middleware.js
│           │   ├── approval.middleware.js
│           │   ├── validation.middleware.js
│           │   ├── upload.middleware.js
│           │   ├── error.middleware.js
│           │   └── rateLimit.middleware.js
│           │
│           ├── validators/
│           │   ├── auth.validator.js
│           │   ├── organization.validator.js
│           │   ├── listing.validator.js
│           │   ├── enquiry.validator.js
│           │   ├── quotation.validator.js
│           │   └── order.validator.js
│           │
│           ├── constants/
│           │   ├── roles.js
│           │   ├── statuses.js
│           │   ├── permissions.js
│           │   └── notificationTypes.js
│           │
│           ├── utils/
│           │   ├── apiResponse.js
│           │   ├── asyncHandler.js
│           │   ├── pagination.js
│           │   ├── search.js
│           │   └── logger.js
│           │
│           └── models/
│               ├── auth.model.js
│               ├── role.model.js
│               ├── user-context.model.js
│               └── common.model.js
│
└── packages/
    └── shared/
        ├── package.json
        └── src/
            ├── roles.js
            ├── statuses.js
            ├── api-contracts.js
            └── constants.js
```

### 2.1 Backend Layering Rules

| Layer | Responsibility |
|---|---|
| Routes | Define API endpoints and attach middleware. |
| Controllers | Read request data, call services, return response. No business logic here. |
| Services | Core business logic such as registration, approvals, enquiries, quotations, orders, notifications, and reports. |
| Middleware | Authentication, authorization, validation, upload handling, error handling. |
| Validators | Request validation schemas. |
| Prisma Models | Database schema and relationships. |
| Utils | Common helper functions. |

### 2.2 API Route Naming Pattern

Use versioned APIs:

```txt
/api/v1/auth
/api/v1/users
/api/v1/organizations
/api/v1/marketplace
/api/v1/providers
/api/v1/enquiries
/api/v1/quotations
/api/v1/orders
/api/v1/notifications
/api/v1/reports
/api/v1/admin
```

---

## 3. Database Schema

The database is designed for MySQL. Use `BIGINT UNSIGNED AUTO_INCREMENT` as the primary key type for most tables. Use `created_at` and `updated_at` in all important tables. Soft delete can be handled with `deleted_at` where needed.

### 3.1 Main Entity Relationship Summary

```txt
users
  └── belongs to roles
  └── belongs to organizations
  └── has many refresh_tokens
  └── has many device_tokens
  └── has many notifications
  └── has many audit_logs

organizations
  └── has many users
  └── has many branches
  └── has one business_profile
  └── has one provider_profile
  └── has many media_files

provider_profiles
  └── belongs to organizations
  └── belongs to provider_categories
  └── has many product_listings
  └── has many service_listings
  └── has many manpower_services
  └── has many marketing_packages

business_profile
  └── belongs to organizations
  └── has many enquiries
  └── has many orders

provider_categories
  └── has many provider_profiles
  └── has many listing_categories

listing_categories
  └── belongs to provider_categories
  └── has many product_listings/service_listings/manpower_services/marketing_packages

enquiries
  └── belongs to business organization
  └── has many enquiry_providers
  └── has many quotations

quotations
  └── belongs to enquiry
  └── belongs to provider organization
  └── may become one order

orders
  └── belongs to business organization
  └── belongs to provider organization
  └── belongs to quotation
  └── has many order_status_history
```

### 3.2 Tables

#### 3.2.1 `roles`

Stores system roles.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TINYINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Role ID. |
| `name` | VARCHAR(50) | UNIQUE, NOT NULL | Role name. |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Role code used in backend. |
| `description` | VARCHAR(255) | NULL | Role description. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Initial role values:

| code | name |
|---|---|
| `ADMIN` | Admin |
| `BUSINESS_OWNER` | Business Owner |
| `SUPPLIER` | Raw Material Supplier |
| `SERVICE_PROVIDER` | Service Provider |
| `MANPOWER_PROVIDER` | Manpower Provider |
| `MARKETING_AGENCY` | Marketing Agency |

Relationships:

- `roles.id` → `users.role_id`

#### 3.2.2 `users`

Stores login accounts.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | User ID. |
| `organization_id` | BIGINT UNSIGNED | NULL, FK | Organization linked with user. Admin may be NULL. |
| `role_id` | TINYINT UNSIGNED | NOT NULL, FK | User role. |
| `full_name` | VARCHAR(150) | NOT NULL | User full name. |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Login email. |
| `phone` | VARCHAR(20) | UNIQUE, NULL | Contact number. |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt password hash. |
| `status` | ENUM('PENDING','ACTIVE','INACTIVE','REJECTED','SUSPENDED') | DEFAULT 'PENDING' | Account status. |
| `email_verified_at` | DATETIME | NULL | Email verification time. |
| `last_login_at` | DATETIME | NULL | Last successful login. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |
| `deleted_at` | DATETIME | NULL | Soft delete timestamp. |

Relationships:

- `users.role_id` → `roles.id`
- `users.organization_id` → `organizations.id`
- `users.id` → `refresh_tokens.user_id`
- `users.id` → `password_reset_tokens.user_id`
- `users.id` → `notifications.user_id`
- `users.id` → `device_tokens.user_id`
- `users.id` → `audit_logs.user_id`

Indexes:

- `idx_users_email` on `email`
- `idx_users_phone` on `phone`
- `idx_users_role_status` on `role_id, status`

#### 3.2.3 `organizations`

Stores business or provider company details.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Organization ID. |
| `organization_type` | ENUM('BUSINESS','PROVIDER','ADMIN') | NOT NULL | Type of organization. |
| `company_name` | VARCHAR(200) | NOT NULL | Business/provider name. |
| `legal_name` | VARCHAR(200) | NULL | Registered legal name. |
| `gst_number` | VARCHAR(30) | NULL | GST number. |
| `email` | VARCHAR(150) | NULL | Company email. |
| `phone` | VARCHAR(20) | NULL | Company phone. |
| `website` | VARCHAR(255) | NULL | Website URL. |
| `logo_media_id` | BIGINT UNSIGNED | NULL, FK | Cloudinary logo reference. |
| `address_line1` | VARCHAR(255) | NULL | Address line 1. |
| `address_line2` | VARCHAR(255) | NULL | Address line 2. |
| `city` | VARCHAR(100) | NULL | City. |
| `state` | VARCHAR(100) | NULL | State. |
| `pincode` | VARCHAR(10) | NULL | Pincode. |
| `country` | VARCHAR(100) | DEFAULT 'India' | Country. |
| `status` | ENUM('DRAFT','PENDING_APPROVAL','ACTIVE','REJECTED','SUSPENDED') | DEFAULT 'DRAFT' | Organization status. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |
| `deleted_at` | DATETIME | NULL | Soft delete timestamp. |

Relationships:

- `organizations.id` → `users.organization_id`
- `organizations.logo_media_id` → `media_files.id`
- `organizations.id` → `branches.organization_id`
- `organizations.id` → `business_profiles.organization_id`
- `organizations.id` → `provider_profiles.organization_id`

Indexes:

- `idx_org_type_status` on `organization_type, status`
- `idx_org_city_state` on `city, state`
- `idx_org_gst` on `gst_number`

#### 3.2.4 `business_profiles`

Stores extra details for hotels, restaurants, cafés, and catering businesses.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Business profile ID. |
| `organization_id` | BIGINT UNSIGNED | UNIQUE, NOT NULL, FK | Linked business organization. |
| `business_category` | ENUM('HOTEL','RESTAURANT','CAFE','CATERING','BAKERY','SWEET_SHOP','FAST_FOOD','OTHER') | NOT NULL | Business category. |
| `description` | TEXT | NULL | Business description. |
| `opening_time` | TIME | NULL | Business opening time. |
| `closing_time` | TIME | NULL | Business closing time. |
| `average_monthly_purchase` | DECIMAL(12,2) | NULL | Optional estimate for reports. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `business_profiles.organization_id` → `organizations.id`
- `business_profiles.organization_id` → `enquiries.business_organization_id`
- `business_profiles.organization_id` → `orders.business_organization_id`

#### 3.2.5 `provider_categories`

Stores the four main provider categories from the PRD.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SMALLINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Provider category ID. |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Category display name. |
| `code` | VARCHAR(50) | UNIQUE, NOT NULL | Category code. |
| `description` | TEXT | NULL | Category description. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Whether category is visible. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Initial values:

| code | name |
|---|---|
| `RAW_MATERIAL_SUPPLIER` | Raw Material Supplier |
| `SERVICE_PROVIDER` | Service Provider |
| `MANPOWER_PROVIDER` | Manpower Provider |
| `MARKETING_AGENCY` | Marketing Agency |

Relationships:

- `provider_categories.id` → `provider_profiles.provider_category_id`
- `provider_categories.id` → `listing_categories.provider_category_id`

#### 3.2.6 `provider_profiles`

Stores provider-specific profile information and admin approval status.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Provider profile ID. |
| `organization_id` | BIGINT UNSIGNED | UNIQUE, NOT NULL, FK | Linked provider organization. |
| `provider_category_id` | SMALLINT UNSIGNED | NOT NULL, FK | Provider category. |
| `description` | TEXT | NULL | Provider description. |
| `service_area` | VARCHAR(255) | NULL | City/area served. |
| `availability_status` | ENUM('AVAILABLE','LIMITED','UNAVAILABLE') | DEFAULT 'AVAILABLE' | Provider availability. |
| `approval_status` | ENUM('PENDING','APPROVED','REJECTED') | DEFAULT 'PENDING' | Admin approval status. |
| `approved_by_user_id` | BIGINT UNSIGNED | NULL, FK | Admin who approved/rejected. |
| `approved_at` | DATETIME | NULL | Approval timestamp. |
| `rejection_reason` | TEXT | NULL | Reason if rejected. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `provider_profiles.organization_id` → `organizations.id`
- `provider_profiles.provider_category_id` → `provider_categories.id`
- `provider_profiles.approved_by_user_id` → `users.id`
- `provider_profiles.organization_id` → listing and quotation provider references

Indexes:

- `idx_provider_category_approval` on `provider_category_id, approval_status`
- `idx_provider_availability` on `availability_status`

#### 3.2.7 `branches`

Stores branch information for businesses and providers.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Branch ID. |
| `organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Linked organization. |
| `branch_name` | VARCHAR(150) | NOT NULL | Branch name. |
| `contact_person` | VARCHAR(150) | NULL | Branch contact person. |
| `phone` | VARCHAR(20) | NULL | Branch phone. |
| `email` | VARCHAR(150) | NULL | Branch email. |
| `address_line1` | VARCHAR(255) | NULL | Address line 1. |
| `address_line2` | VARCHAR(255) | NULL | Address line 2. |
| `city` | VARCHAR(100) | NULL | City. |
| `state` | VARCHAR(100) | NULL | State. |
| `pincode` | VARCHAR(10) | NULL | Pincode. |
| `is_primary` | BOOLEAN | DEFAULT FALSE | Primary branch flag. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `branches.organization_id` → `organizations.id`

#### 3.2.8 `listing_categories`

Stores categories for products and services.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Listing category ID. |
| `provider_category_id` | SMALLINT UNSIGNED | NOT NULL, FK | Parent provider category. |
| `name` | VARCHAR(100) | NOT NULL | Listing category name. |
| `code` | VARCHAR(50) | NOT NULL | Listing category code. |
| `description` | TEXT | NULL | Category description. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active flag. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `listing_categories.provider_category_id` → `provider_categories.id`
- `listing_categories.id` → `product_listings.listing_category_id`
- `listing_categories.id` → `service_listings.listing_category_id`
- `listing_categories.id` → `manpower_services.listing_category_id`
- `listing_categories.id` → `marketing_packages.listing_category_id`

Unique constraint:

- `UNIQUE(provider_category_id, code)`

#### 3.2.9 `product_listings`

Stores raw material supplier products.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Product listing ID. |
| `provider_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Supplier organization. |
| `listing_category_id` | BIGINT UNSIGNED | NOT NULL, FK | Product category. |
| `name` | VARCHAR(150) | NOT NULL | Product name. |
| `description` | TEXT | NULL | Product description. |
| `unit` | VARCHAR(50) | NOT NULL | Example: kg, litre, packet, box. |
| `price_per_unit` | DECIMAL(12,2) | NOT NULL | Product pricing. |
| `minimum_order_quantity` | DECIMAL(12,2) | DEFAULT 1.00 | Minimum order quantity. |
| `inventory_status` | ENUM('IN_STOCK','LOW_STOCK','OUT_OF_STOCK') | DEFAULT 'IN_STOCK' | Inventory status. |
| `image_media_id` | BIGINT UNSIGNED | NULL, FK | Product image in Cloudinary. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Listing visibility. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `product_listings.provider_organization_id` → `organizations.id`
- `product_listings.listing_category_id` → `listing_categories.id`
- `product_listings.image_media_id` → `media_files.id`

Indexes:

- `idx_products_provider` on `provider_organization_id`
- `idx_products_category_status` on `listing_category_id, inventory_status, is_active`
- `idx_products_name` on `name`

#### 3.2.10 `service_listings`

Stores service provider listings such as electrician, plumber, repair, maintenance, and similar services.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Service listing ID. |
| `provider_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Service provider organization. |
| `listing_category_id` | BIGINT UNSIGNED | NOT NULL, FK | Service category. |
| `service_name` | VARCHAR(150) | NOT NULL | Service name. |
| `description` | TEXT | NULL | Service description. |
| `service_area` | VARCHAR(255) | NULL | Area where service is available. |
| `base_price` | DECIMAL(12,2) | NULL | Starting price. |
| `pricing_type` | ENUM('FIXED','HOURLY','VISIT_BASED','CUSTOM') | DEFAULT 'CUSTOM' | Pricing model. |
| `availability_status` | ENUM('AVAILABLE','LIMITED','UNAVAILABLE') | DEFAULT 'AVAILABLE' | Service availability. |
| `image_media_id` | BIGINT UNSIGNED | NULL, FK | Service image in Cloudinary. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Listing visibility. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `service_listings.provider_organization_id` → `organizations.id`
- `service_listings.listing_category_id` → `listing_categories.id`
- `service_listings.image_media_id` → `media_files.id`

#### 3.2.11 `manpower_services`

Stores manpower provider services.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Manpower service ID. |
| `provider_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Manpower provider organization. |
| `listing_category_id` | BIGINT UNSIGNED | NOT NULL, FK | Staff category. |
| `staff_category` | VARCHAR(100) | NOT NULL | Example: Chef, Waiter, Cleaner, Manager. |
| `description` | TEXT | NULL | Hiring service details. |
| `available_count` | INT UNSIGNED | DEFAULT 0 | Number of staff available. |
| `experience_level` | ENUM('FRESHER','JUNIOR','MID','SENIOR','ANY') | DEFAULT 'ANY' | Experience level. |
| `pricing_type` | ENUM('DAILY','MONTHLY','CONTRACT','CUSTOM') | DEFAULT 'CUSTOM' | Hiring pricing model. |
| `price_amount` | DECIMAL(12,2) | NULL | Price amount. |
| `availability_status` | ENUM('AVAILABLE','LIMITED','UNAVAILABLE') | DEFAULT 'AVAILABLE' | Availability. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Listing visibility. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `manpower_services.provider_organization_id` → `organizations.id`
- `manpower_services.listing_category_id` → `listing_categories.id`

#### 3.2.12 `marketing_packages`

Stores marketing agency services and packages.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Marketing package ID. |
| `provider_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Marketing agency organization. |
| `listing_category_id` | BIGINT UNSIGNED | NOT NULL, FK | Marketing service category. |
| `package_name` | VARCHAR(150) | NOT NULL | Package name. |
| `description` | TEXT | NULL | Package description. |
| `deliverables` | TEXT | NULL | Work included in package. |
| `duration_days` | INT UNSIGNED | NULL | Package duration. |
| `price_amount` | DECIMAL(12,2) | NULL | Package price. |
| `portfolio_media_id` | BIGINT UNSIGNED | NULL, FK | Portfolio image/file in Cloudinary. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Listing visibility. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `marketing_packages.provider_organization_id` → `organizations.id`
- `marketing_packages.listing_category_id` → `listing_categories.id`
- `marketing_packages.portfolio_media_id` → `media_files.id`

#### 3.2.13 `media_files`

Stores Cloudinary file references.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Media file ID. |
| `organization_id` | BIGINT UNSIGNED | NULL, FK | Owner organization. |
| `uploaded_by_user_id` | BIGINT UNSIGNED | NULL, FK | User who uploaded file. |
| `cloudinary_public_id` | VARCHAR(255) | NOT NULL | Cloudinary public ID. |
| `file_url` | VARCHAR(500) | NOT NULL | Secure Cloudinary URL. |
| `file_type` | ENUM('IMAGE','PDF','DOCUMENT','OTHER') | DEFAULT 'IMAGE' | File type. |
| `folder` | VARCHAR(150) | NULL | Cloudinary folder path. |
| `original_filename` | VARCHAR(255) | NULL | Original uploaded file name. |
| `mime_type` | VARCHAR(100) | NULL | MIME type. |
| `size_bytes` | BIGINT UNSIGNED | NULL | File size. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |

Relationships:

- `media_files.organization_id` → `organizations.id`
- `media_files.uploaded_by_user_id` → `users.id`
- Referenced by organization logo, products, services, and portfolios.

#### 3.2.14 `enquiries`

Stores enquiries created by business owners.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Enquiry ID. |
| `business_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Business sending enquiry. |
| `created_by_user_id` | BIGINT UNSIGNED | NOT NULL, FK | User who created enquiry. |
| `provider_category_id` | SMALLINT UNSIGNED | NOT NULL, FK | Category of providers targeted. |
| `title` | VARCHAR(200) | NOT NULL | Enquiry title. |
| `description` | TEXT | NOT NULL | Requirement details. |
| `required_by_date` | DATE | NULL | Expected date. |
| `delivery_address` | TEXT | NULL | Delivery/service location. |
| `status` | ENUM('DRAFT','SENT','QUOTED','CONFIRMED','CANCELLED','CLOSED') | DEFAULT 'DRAFT' | Enquiry status. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `enquiries.business_organization_id` → `organizations.id`
- `enquiries.created_by_user_id` → `users.id`
- `enquiries.provider_category_id` → `provider_categories.id`
- `enquiries.id` → `enquiry_items.enquiry_id`
- `enquiries.id` → `enquiry_providers.enquiry_id`
- `enquiries.id` → `quotations.enquiry_id`

Indexes:

- `idx_enquiries_business_status` on `business_organization_id, status`
- `idx_enquiries_category_status` on `provider_category_id, status`

#### 3.2.15 `enquiry_items`

Stores item-level details for enquiries.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Enquiry item ID. |
| `enquiry_id` | BIGINT UNSIGNED | NOT NULL, FK | Parent enquiry. |
| `item_name` | VARCHAR(150) | NOT NULL | Required item/service/staff/package. |
| `quantity` | DECIMAL(12,2) | NULL | Required quantity. |
| `unit` | VARCHAR(50) | NULL | Unit such as kg, litre, person, visit. |
| `notes` | TEXT | NULL | Extra details. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |

Relationships:

- `enquiry_items.enquiry_id` → `enquiries.id`

#### 3.2.16 `enquiry_providers`

Maps one enquiry to multiple providers.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Enquiry-provider mapping ID. |
| `enquiry_id` | BIGINT UNSIGNED | NOT NULL, FK | Enquiry. |
| `provider_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Provider receiving enquiry. |
| `status` | ENUM('SENT','VIEWED','QUOTED','DECLINED','EXPIRED') | DEFAULT 'SENT' | Provider-specific enquiry status. |
| `viewed_at` | DATETIME | NULL | When provider viewed enquiry. |
| `responded_at` | DATETIME | NULL | When provider responded. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |

Relationships:

- `enquiry_providers.enquiry_id` → `enquiries.id`
- `enquiry_providers.provider_organization_id` → `organizations.id`

Unique constraint:

- `UNIQUE(enquiry_id, provider_organization_id)`

#### 3.2.17 `quotations`

Stores provider quotations for enquiries.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Quotation ID. |
| `quotation_number` | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable quotation number. |
| `enquiry_id` | BIGINT UNSIGNED | NOT NULL, FK | Related enquiry. |
| `provider_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Provider sending quotation. |
| `created_by_user_id` | BIGINT UNSIGNED | NOT NULL, FK | Provider user who created quotation. |
| `total_amount` | DECIMAL(12,2) | NOT NULL | Total quoted amount. |
| `tax_amount` | DECIMAL(12,2) | DEFAULT 0.00 | Tax amount. |
| `discount_amount` | DECIMAL(12,2) | DEFAULT 0.00 | Discount amount. |
| `final_amount` | DECIMAL(12,2) | NOT NULL | Final payable amount. |
| `valid_until` | DATE | NULL | Quotation validity date. |
| `terms_and_conditions` | TEXT | NULL | Terms. |
| `status` | ENUM('SENT','VIEWED','ACCEPTED','REJECTED','EXPIRED','CANCELLED') | DEFAULT 'SENT' | Quotation status. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `quotations.enquiry_id` → `enquiries.id`
- `quotations.provider_organization_id` → `organizations.id`
- `quotations.created_by_user_id` → `users.id`
- `quotations.id` → `quotation_items.quotation_id`
- `quotations.id` → `orders.quotation_id`

Indexes:

- `idx_quotations_enquiry_status` on `enquiry_id, status`
- `idx_quotations_provider_status` on `provider_organization_id, status`

#### 3.2.18 `quotation_items`

Stores line items for quotations.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Quotation item ID. |
| `quotation_id` | BIGINT UNSIGNED | NOT NULL, FK | Parent quotation. |
| `item_name` | VARCHAR(150) | NOT NULL | Quoted item/service. |
| `description` | TEXT | NULL | Item description. |
| `quantity` | DECIMAL(12,2) | NOT NULL | Quantity. |
| `unit` | VARCHAR(50) | NULL | Unit. |
| `unit_price` | DECIMAL(12,2) | NOT NULL | Unit price. |
| `line_total` | DECIMAL(12,2) | NOT NULL | quantity × unit_price. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |

Relationships:

- `quotation_items.quotation_id` → `quotations.id`

#### 3.2.19 `orders`

Stores confirmed orders or service requests.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Order ID. |
| `order_number` | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable order number. |
| `enquiry_id` | BIGINT UNSIGNED | NOT NULL, FK | Source enquiry. |
| `quotation_id` | BIGINT UNSIGNED | UNIQUE, NOT NULL, FK | Accepted quotation. |
| `business_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Business placing order. |
| `provider_organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Provider fulfilling order. |
| `order_type` | ENUM('RAW_MATERIAL','SERVICE','MANPOWER','MARKETING') | NOT NULL | Order/service type. |
| `total_amount` | DECIMAL(12,2) | NOT NULL | Final amount from quotation. |
| `status` | ENUM('CONFIRMED','PROCESSING','DELIVERY_OR_SERVICE','COMPLETED','CANCELLED') | DEFAULT 'CONFIRMED' | Order lifecycle status. |
| `expected_completion_date` | DATE | NULL | Expected delivery/service date. |
| `completed_at` | DATETIME | NULL | Completion timestamp. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `orders.enquiry_id` → `enquiries.id`
- `orders.quotation_id` → `quotations.id`
- `orders.business_organization_id` → `organizations.id`
- `orders.provider_organization_id` → `organizations.id`
- `orders.id` → `order_status_history.order_id`

Indexes:

- `idx_orders_business_status` on `business_organization_id, status`
- `idx_orders_provider_status` on `provider_organization_id, status`
- `idx_orders_type_status` on `order_type, status`

#### 3.2.20 `order_status_history`

Stores order lifecycle history.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | History ID. |
| `order_id` | BIGINT UNSIGNED | NOT NULL, FK | Order ID. |
| `old_status` | VARCHAR(50) | NULL | Previous status. |
| `new_status` | VARCHAR(50) | NOT NULL | New status. |
| `changed_by_user_id` | BIGINT UNSIGNED | NOT NULL, FK | User who changed status. |
| `notes` | TEXT | NULL | Status change notes. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Change timestamp. |

Relationships:

- `order_status_history.order_id` → `orders.id`
- `order_status_history.changed_by_user_id` → `users.id`

#### 3.2.21 `notifications`

Stores in-app notifications and FCM delivery status.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Notification ID. |
| `user_id` | BIGINT UNSIGNED | NOT NULL, FK | Notification receiver. |
| `organization_id` | BIGINT UNSIGNED | NULL, FK | Related organization. |
| `type` | ENUM('NEW_ENQUIRY','NEW_QUOTATION','ORDER_STATUS_UPDATE','SERVICE_UPDATE','REGISTRATION_APPROVED','REGISTRATION_REJECTED','COMPLAINT_UPDATE') | NOT NULL | Notification type. |
| `title` | VARCHAR(150) | NOT NULL | Notification title. |
| `message` | TEXT | NOT NULL | Notification body. |
| `reference_type` | VARCHAR(50) | NULL | Example: enquiry, quotation, order. |
| `reference_id` | BIGINT UNSIGNED | NULL | Related record ID. |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read flag. |
| `fcm_sent_at` | DATETIME | NULL | FCM push sent timestamp. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |

Relationships:

- `notifications.user_id` → `users.id`
- `notifications.organization_id` → `organizations.id`

Indexes:

- `idx_notifications_user_read` on `user_id, is_read`
- `idx_notifications_type` on `type`

#### 3.2.22 `device_tokens`

Stores FCM device tokens.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Device token ID. |
| `user_id` | BIGINT UNSIGNED | NOT NULL, FK | User ID. |
| `fcm_token` | VARCHAR(500) | UNIQUE, NOT NULL | Firebase device token. |
| `device_type` | ENUM('ANDROID','IOS','WEB') | NOT NULL | Device type. |
| `device_name` | VARCHAR(150) | NULL | Device name. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active token flag. |
| `last_used_at` | DATETIME | NULL | Last usage timestamp. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `device_tokens.user_id` → `users.id`

#### 3.2.23 `complaints`

Stores complaints managed by Admin.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Complaint ID. |
| `created_by_user_id` | BIGINT UNSIGNED | NOT NULL, FK | User who created complaint. |
| `organization_id` | BIGINT UNSIGNED | NOT NULL, FK | Complaint creator organization. |
| `against_organization_id` | BIGINT UNSIGNED | NULL, FK | Organization complaint is against. |
| `order_id` | BIGINT UNSIGNED | NULL, FK | Related order if any. |
| `subject` | VARCHAR(200) | NOT NULL | Complaint subject. |
| `description` | TEXT | NOT NULL | Complaint details. |
| `status` | ENUM('OPEN','IN_REVIEW','RESOLVED','REJECTED','CLOSED') | DEFAULT 'OPEN' | Complaint status. |
| `admin_response` | TEXT | NULL | Admin response. |
| `resolved_by_user_id` | BIGINT UNSIGNED | NULL, FK | Admin who resolved. |
| `resolved_at` | DATETIME | NULL | Resolution timestamp. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `complaints.created_by_user_id` → `users.id`
- `complaints.organization_id` → `organizations.id`
- `complaints.against_organization_id` → `organizations.id`
- `complaints.order_id` → `orders.id`
- `complaints.resolved_by_user_id` → `users.id`

#### 3.2.24 `platform_settings`

Stores Admin-managed settings.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Setting ID. |
| `setting_key` | VARCHAR(100) | UNIQUE, NOT NULL | Setting key. |
| `setting_value` | TEXT | NULL | Setting value. |
| `setting_type` | ENUM('STRING','NUMBER','BOOLEAN','JSON') | DEFAULT 'STRING' | Value type. |
| `description` | VARCHAR(255) | NULL | Setting description. |
| `updated_by_user_id` | BIGINT UNSIGNED | NULL, FK | Admin who updated setting. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Update timestamp. |

Relationships:

- `platform_settings.updated_by_user_id` → `users.id`

#### 3.2.25 `refresh_tokens`

Stores refresh tokens for login sessions.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Token ID. |
| `user_id` | BIGINT UNSIGNED | NOT NULL, FK | User ID. |
| `token_hash` | VARCHAR(255) | NOT NULL | Hashed refresh token. |
| `expires_at` | DATETIME | NOT NULL | Expiry timestamp. |
| `revoked_at` | DATETIME | NULL | Revocation timestamp. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |

Relationships:

- `refresh_tokens.user_id` → `users.id`

#### 3.2.26 `password_reset_tokens`

Stores forgot password tokens.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Reset token ID. |
| `user_id` | BIGINT UNSIGNED | NOT NULL, FK | User ID. |
| `token_hash` | VARCHAR(255) | NOT NULL | Hashed reset token. |
| `expires_at` | DATETIME | NOT NULL | Expiry timestamp. |
| `used_at` | DATETIME | NULL | Used timestamp. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |

Relationships:

- `password_reset_tokens.user_id` → `users.id`

#### 3.2.27 `audit_logs`

Stores important actions for audit purposes.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | Audit log ID. |
| `user_id` | BIGINT UNSIGNED | NULL, FK | User who performed action. |
| `organization_id` | BIGINT UNSIGNED | NULL, FK | Related organization. |
| `action` | VARCHAR(100) | NOT NULL | Example: USER_LOGIN, ENQUIRY_CREATED. |
| `entity_type` | VARCHAR(100) | NULL | Table/entity affected. |
| `entity_id` | BIGINT UNSIGNED | NULL | Affected record ID. |
| `old_value` | JSON | NULL | Previous values. |
| `new_value` | JSON | NULL | New values. |
| `ip_address` | VARCHAR(45) | NULL | IPv4/IPv6 address. |
| `user_agent` | TEXT | NULL | Client user agent. |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp. |

Relationships:

- `audit_logs.user_id` → `users.id`
- `audit_logs.organization_id` → `organizations.id`

### 3.3 Status Lifecycle Rules

#### Enquiry Status

```txt
DRAFT → SENT → QUOTED → CONFIRMED → CLOSED
DRAFT → CANCELLED
SENT → CANCELLED
QUOTED → CANCELLED
```

#### Quotation Status

```txt
SENT → VIEWED → ACCEPTED
SENT → VIEWED → REJECTED
SENT → EXPIRED
SENT → CANCELLED
```

#### Order Status

```txt
CONFIRMED → PROCESSING → DELIVERY_OR_SERVICE → COMPLETED
CONFIRMED → CANCELLED
PROCESSING → CANCELLED
```

### 3.4 Marketplace Search Requirements

Marketplace APIs should support:

| Filter | Applies To |
|---|---|
| `keyword` | Provider name, product name, service name, description. |
| `provider_category_id` | Raw Material, Service, Manpower, Marketing. |
| `listing_category_id` | Product/service/staff/marketing category. |
| `city` | Provider city. |
| `availability_status` | Available, limited, unavailable. |
| `price_min` and `price_max` | Product/service/package pricing. |
| `inventory_status` | Product listings only. |

---

## 4. User Roles and Auth

### 4.1 User Roles

HRC-HUB uses role-based access control. Every account belongs to exactly one role.

| Role Code | Role Name | Main Purpose |
|---|---|---|
| `ADMIN` | Admin | Manage platform users, provider approvals, categories, complaints, and settings. |
| `BUSINESS_OWNER` | Business Owner | Search providers, send enquiries, request quotations, compare quotations, confirm orders, and view reports. |
| `SUPPLIER` | Raw Material Supplier | Manage products, pricing, inventory status, enquiries, quotations, and orders. |
| `SERVICE_PROVIDER` | Service Provider | Manage services, service areas, pricing, availability, enquiries, and service requests. |
| `MANPOWER_PROVIDER` | Manpower Provider | Publish manpower services, staff categories, availability, hiring requests, and quotations. |
| `MARKETING_AGENCY` | Marketing Agency | Publish marketing services, portfolio, service packages, proposal requests, and quotations. |

### 4.2 Authentication Flow

#### Registration

1. User submits registration form.
2. Backend validates email, phone, password, and selected role.
3. Password is hashed using bcrypt.
4. User record is created in `users`.
5. Organization record is created in `organizations`.
6. If role is `BUSINESS_OWNER`, create `business_profiles` record.
7. If role is a provider role, create `provider_profiles` record with `approval_status = 'PENDING'`.
8. Admin receives notification for provider approval.
9. User receives registration confirmation notification/email.

#### Login

1. User enters email and password.
2. Backend verifies email exists.
3. Backend compares password with `password_hash`.
4. Backend checks `users.status`.
5. For provider users, backend checks `provider_profiles.approval_status`.
6. Backend generates JWT access token and refresh token.
7. Refresh token hash is saved in `refresh_tokens`.
8. Response includes user profile, role, organization ID, and access token.
9. Frontend redirects user to role-based dashboard.

#### Forgot Password

1. User submits registered email.
2. Backend creates password reset token and stores hashed token in `password_reset_tokens`.
3. Email service sends reset link or OTP.
4. User submits new password.
5. Backend validates token and expiry.
6. New password is hashed and updated in `users.password_hash`.
7. Token is marked as used.

### 4.3 JWT Payload

Use a small JWT payload.

```json
{
  "sub": "user_id",
  "role": "BUSINESS_OWNER",
  "organizationId": "organization_id",
  "status": "ACTIVE"
}
```

### 4.4 Authorization Middleware

#### `authMiddleware`

Checks:

- Access token exists.
- Token signature is valid.
- User still exists.
- User status is `ACTIVE`.

#### `roleMiddleware(allowedRoles)`

Example:

```ts
roleMiddleware(['ADMIN'])
roleMiddleware(['BUSINESS_OWNER'])
roleMiddleware(['SUPPLIER', 'SERVICE_PROVIDER', 'MANPOWER_PROVIDER', 'MARKETING_AGENCY'])
```

Checks:

- Current user's role is included in allowed roles.
- If not allowed, return `403 Forbidden`.

#### `providerApprovalMiddleware`

For provider APIs, checks:

- Organization type is `PROVIDER`.
- Provider profile exists.
- `provider_profiles.approval_status = 'APPROVED'`.
- `organizations.status = 'ACTIVE'`.

#### `ownershipMiddleware`

Checks that a user can only edit information belonging to their own organization.

Examples:

- Business owner can edit only their own `business_profiles` and `branches`.
- Provider can edit only their own listings.
- Provider can respond only to enquiries sent to their organization.
- Business owner can view only their own enquiries, quotations, and orders.
- Admin can access all records.

### 4.5 Role Permission Matrix

| Feature / Action | Admin | Business Owner | Supplier | Service Provider | Manpower Provider | Marketing Agency |
|---|---:|---:|---:|---:|---:|---:|
| Register | Yes | Yes | Yes | Yes | Yes | Yes |
| Secure Login | Yes | Yes | Yes | Yes | Yes | Yes |
| Forgot Password | Yes | Yes | Yes | Yes | Yes | Yes |
| Manage Own Profile | Yes | Yes | Yes | Yes | Yes | Yes |
| Manage Branches | No | Yes | Optional | Optional | Optional | Optional |
| Browse Marketplace | Yes | Yes | Limited | Limited | Limited | Limited |
| Compare Providers | No | Yes | No | No | No | No |
| Send Enquiries | No | Yes | No | No | No | No |
| Receive Enquiries | No | No | Yes | Yes | Yes | Yes |
| Send Quotations | No | No | Yes | Yes | Yes | Yes |
| Compare Quotations | No | Yes | No | No | No | No |
| Confirm Order/Service | No | Yes | No | No | No | No |
| Manage Product Listings | No | No | Yes | No | No | No |
| Manage Service Listings | No | No | No | Yes | No | No |
| Manage Manpower Services | No | No | No | No | Yes | No |
| Manage Marketing Packages | No | No | No | No | No | Yes |
| Update Availability | No | No | Yes | Yes | Yes | Yes |
| Manage Orders | View all | View own | Provider own | Provider own | Provider own | Provider own |
| View Reports | Platform reports | Own reports | Own reports | Own reports | Own reports | Own reports |
| Approve Registrations | Yes | No | No | No | No | No |
| Manage Categories | Yes | No | No | No | No | No |
| Manage Complaints | Yes | Create/View own | Create/View own | Create/View own | Create/View own | Create/View own |
| Manage Platform Settings | Yes | No | No | No | No | No |

### 4.6 Security Rules

1. Never store plain-text passwords.
2. Access tokens should expire quickly, for example 15 minutes.
3. Refresh tokens should expire later, for example 7 to 30 days.
4. Store refresh tokens as hashes, not plain tokens.
5. Use HTTPS in production.
6. Validate all request bodies with Zod/Joi.
7. Use rate limiting on login, register, forgot password, and quotation APIs.
8. Use Cloudinary signed upload from backend, not direct unsigned upload from frontend.
9. Validate file type and file size before uploading to Cloudinary.
10. Log all important actions in `audit_logs`.
11. Admin approval is mandatory before providers become visible in marketplace.
12. Deleted or suspended users must not access protected APIs.

---

## 5. Module List

### 5.1 Authentication Module

Screens/pages:

- Login
- Register
- Forgot Password
- Reset Password
- Email Verification, optional for V1

Backend APIs:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/auth/me`

### 5.2 Profile and Organization Module

Screens/pages:

- Create Business Profile
- Edit Company Information
- GST Details
- Contact Information
- Business Category
- Branch Management
- Provider Profile

Backend APIs:

- `GET /api/v1/organizations/me`
- `PATCH /api/v1/organizations/me`
- `POST /api/v1/branches`
- `GET /api/v1/branches`
- `PATCH /api/v1/branches/:id`
- `DELETE /api/v1/branches/:id`
- `POST /api/v1/media/upload`

### 5.3 Provider Management Module

Screens/pages:

- Provider Registration
- Provider Dashboard
- Product Listings
- Service Listings
- Manpower Services
- Marketing Packages
- Pricing Management
- Availability Management
- Portfolio Management

Backend APIs:

- `GET /api/v1/providers/me`
- `PATCH /api/v1/providers/me`
- `POST /api/v1/providers/products`
- `GET /api/v1/providers/products`
- `PATCH /api/v1/providers/products/:id`
- `DELETE /api/v1/providers/products/:id`
- `POST /api/v1/providers/services`
- `GET /api/v1/providers/services`
- `PATCH /api/v1/providers/services/:id`
- `DELETE /api/v1/providers/services/:id`
- `POST /api/v1/providers/manpower-services`
- `GET /api/v1/providers/manpower-services`
- `PATCH /api/v1/providers/manpower-services/:id`
- `DELETE /api/v1/providers/manpower-services/:id`
- `POST /api/v1/providers/marketing-packages`
- `GET /api/v1/providers/marketing-packages`
- `PATCH /api/v1/providers/marketing-packages/:id`
- `DELETE /api/v1/providers/marketing-packages/:id`

### 5.4 Marketplace Module

Screens/pages:

- Browse Providers
- Search Providers
- Filter by Category
- Provider Profile Detail
- Product/Service Detail
- Compare Providers

Backend APIs:

- `GET /api/v1/marketplace/providers`
- `GET /api/v1/marketplace/providers/:id`
- `GET /api/v1/marketplace/products`
- `GET /api/v1/marketplace/services`
- `GET /api/v1/marketplace/manpower-services`
- `GET /api/v1/marketplace/marketing-packages`
- `POST /api/v1/marketplace/compare`

### 5.5 Enquiry Management Module

Screens/pages:

- Create Enquiry
- Select Providers
- Enquiry List
- Enquiry Detail
- Provider Enquiry Inbox
- Enquiry Status Management

Backend APIs:

- `POST /api/v1/enquiries`
- `GET /api/v1/enquiries`
- `GET /api/v1/enquiries/:id`
- `PATCH /api/v1/enquiries/:id`
- `POST /api/v1/enquiries/:id/send`
- `PATCH /api/v1/enquiries/:id/cancel`
- `GET /api/v1/enquiries/provider/inbox`
- `PATCH /api/v1/enquiries/:id/viewed`
- `PATCH /api/v1/enquiries/:id/decline`

### 5.6 Quotation Module

Screens/pages:

- Create Quotation
- Provider Quotation List
- Business Quotation List
- Quotation Detail
- Compare Quotations
- Accept/Reject Quotation

Backend APIs:

- `POST /api/v1/quotations`
- `GET /api/v1/quotations`
- `GET /api/v1/quotations/:id`
- `PATCH /api/v1/quotations/:id`
- `POST /api/v1/quotations/:id/accept`
- `POST /api/v1/quotations/:id/reject`
- `GET /api/v1/enquiries/:id/quotations`

### 5.7 Order and Service Flow Module

Screens/pages:

- Confirmed Orders
- Order Detail
- Provider Order Queue
- Update Order Status
- Service History
- Order History

Backend APIs:

- `POST /api/v1/orders/from-quotation/:quotationId`
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id/status`
- `GET /api/v1/orders/:id/status-history`
- `PATCH /api/v1/orders/:id/cancel`

### 5.8 Dashboard Module

Screens/pages:

- Business Dashboard
- Provider Dashboard
- Admin Dashboard

Business dashboard widgets:

- Total enquiries sent
- Pending quotations
- Confirmed orders
- Recent providers viewed
- Recent order history
- Latest notifications

Provider dashboard widgets:

- New enquiries
- Pending quotations
- Confirmed orders/services
- Active listings
- Availability status
- Latest notifications

Admin dashboard widgets:

- Total users
- Pending provider approvals
- Active providers by category
- Total enquiries
- Total orders/services
- Complaints summary

Backend APIs:

- `GET /api/v1/reports/dashboard/business`
- `GET /api/v1/reports/dashboard/provider`
- `GET /api/v1/reports/dashboard/admin`

### 5.9 Notifications Module

Screens/pages:

- Notification List
- Notification Detail
- Mark as Read

Events requiring notification:

- New enquiry received by provider
- New quotation received by business
- Order confirmed
- Order status updated
- Service update
- Provider registration approved
- Provider registration rejected
- Complaint status updated

Backend APIs:

- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/:id/read`
- `PATCH /api/v1/notifications/read-all`
- `POST /api/v1/notifications/device-token`
- `DELETE /api/v1/notifications/device-token/:id`

### 5.10 Reports Module

Screens/pages:

- Order History Report
- Service History Report
- Business Summary Report
- Provider Summary Report

Backend APIs:

- `GET /api/v1/reports/order-history`
- `GET /api/v1/reports/service-history`
- `GET /api/v1/reports/business-summary`
- `GET /api/v1/reports/provider-summary`

### 5.11 Admin Module

Screens/pages:

- Admin Dashboard
- Manage Users
- Approve Registrations
- Manage Provider Categories
- Manage Listing Categories
- Manage Complaints
- Manage Platform Settings
- Audit Logs

Backend APIs:

- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:id/status`
- `GET /api/v1/admin/provider-approvals`
- `POST /api/v1/admin/providers/:id/approve`
- `POST /api/v1/admin/providers/:id/reject`
- `GET /api/v1/admin/provider-categories`
- `POST /api/v1/admin/provider-categories`
- `PATCH /api/v1/admin/provider-categories/:id`
- `GET /api/v1/admin/listing-categories`
- `POST /api/v1/admin/listing-categories`
- `PATCH /api/v1/admin/listing-categories/:id`
- `GET /api/v1/admin/complaints`
- `PATCH /api/v1/admin/complaints/:id/status`
- `GET /api/v1/admin/settings`
- `PATCH /api/v1/admin/settings/:id`
- `GET /api/v1/admin/audit-logs`

---

## 6. Key Data Flows

### 6.1 Flow 1: Provider Registration and Admin Approval

This flow ensures that providers are verified before becoming visible in the marketplace.

#### Actors

- Provider user: Supplier, Service Provider, Manpower Provider, or Marketing Agency
- Admin
- System

#### Steps

1. Provider opens registration screen.
2. Provider selects role:
   - Raw Material Supplier
   - Service Provider
   - Manpower Provider
   - Marketing Agency
3. Provider enters user details:
   - Full name
   - Email
   - Phone
   - Password
4. Provider enters company details:
   - Company name
   - GST number
   - Contact information
   - Address
   - Service area
5. Provider uploads logo or portfolio images if needed.
6. Frontend sends data to `POST /api/v1/auth/register`.
7. Backend validates request payload.
8. Backend hashes password using bcrypt.
9. Backend creates record in `users` with `status = 'PENDING'` or `ACTIVE` depending on approval policy.
10. Backend creates record in `organizations` with `organization_type = 'PROVIDER'` and `status = 'PENDING_APPROVAL'`.
11. Backend creates record in `provider_profiles` with `approval_status = 'PENDING'`.
12. Backend uploads files to Cloudinary and stores references in `media_files`.
13. Backend creates Admin notification with type `REGISTRATION_PENDING`.
14. Admin opens approval dashboard.
15. Admin reviews provider information.
16. Admin approves or rejects registration.
17. If approved:
    - `provider_profiles.approval_status = 'APPROVED'`
    - `organizations.status = 'ACTIVE'`
    - `users.status = 'ACTIVE'`
    - Provider becomes visible in marketplace.
18. If rejected:
    - `provider_profiles.approval_status = 'REJECTED'`
    - `organizations.status = 'REJECTED'`
    - Rejection reason is stored.
19. System sends notification to provider using in-app notification and FCM.
20. System stores the action in `audit_logs`.

#### Main Tables Used

- `users`
- `organizations`
- `provider_profiles`
- `provider_categories`
- `media_files`
- `notifications`
- `device_tokens`
- `audit_logs`

#### Validation Rules

- Email must be unique.
- Phone should be unique if provided.
- Provider role must match one valid provider category.
- GST number should be unique if provided.
- Provider cannot create listings until approved.
- Only Admin can approve or reject registrations.

#### Output

- Approved providers are searchable in marketplace.
- Rejected providers remain hidden.
- Provider receives approval or rejection notification.

---

### 6.2 Flow 2: Business Discovery, Enquiry, Quotation, and Order Confirmation

This is the most important business flow in HRC-HUB.

#### Actors

- Business Owner
- Provider
- System

#### Steps

1. Business Owner logs in.
2. Frontend redirects to Business Dashboard.
3. Business Owner opens Marketplace.
4. Business Owner searches providers using keyword and filters:
   - Provider category
   - City
   - Product/service category
   - Availability
   - Price range
5. Backend returns only approved and active providers.
6. Business Owner views provider profile.
7. Business Owner selects one or multiple providers for enquiry.
8. Business Owner creates enquiry with:
   - Title
   - Description
   - Required items/services
   - Quantity
   - Unit
   - Required by date
   - Delivery/service address
9. Frontend sends request to `POST /api/v1/enquiries`.
10. Backend creates record in `enquiries`.
11. Backend creates item records in `enquiry_items`.
12. Backend creates provider mapping records in `enquiry_providers`.
13. Backend changes enquiry status from `DRAFT` to `SENT`.
14. Backend sends in-app and FCM notifications to selected providers.
15. Provider opens Enquiry Inbox.
16. Provider views enquiry details.
17. Provider creates quotation with line items, price, tax, discount, validity, and terms.
18. Backend creates record in `quotations` and `quotation_items`.
19. Backend updates provider-specific enquiry status to `QUOTED`.
20. Backend updates enquiry status to `QUOTED` if at least one quotation exists.
21. Backend sends notification to Business Owner.
22. Business Owner opens quotation comparison screen.
23. Business Owner compares provider quotations.
24. Business Owner accepts one quotation.
25. Backend updates selected quotation status to `ACCEPTED`.
26. Backend updates other quotations for same enquiry to `REJECTED` or leaves them as not selected, based on business rule.
27. Backend creates order in `orders` with `status = 'CONFIRMED'`.
28. Backend updates enquiry status to `CONFIRMED`.
29. Backend sends notification to selected provider.
30. Backend stores all important actions in `audit_logs`.

#### Main Tables Used

- `organizations`
- `provider_profiles`
- `product_listings`
- `service_listings`
- `manpower_services`
- `marketing_packages`
- `enquiries`
- `enquiry_items`
- `enquiry_providers`
- `quotations`
- `quotation_items`
- `orders`
- `notifications`
- `audit_logs`

#### Validation Rules

- Business Owner must have active account.
- Provider must be approved and active.
- Business can send enquiries to multiple providers.
- Provider can respond only to enquiries sent to their organization.
- Provider cannot quote for another provider's enquiry.
- Business can accept only quotations linked to its own enquiry.
- One quotation can create only one order.

#### Output

- Enquiry moves from `SENT` to `QUOTED` to `CONFIRMED`.
- One accepted quotation becomes a confirmed order or service request.
- Business and provider both receive notifications.

---

### 6.3 Flow 3: Order / Service Status Updates, Completion, Notifications, and Reports

This flow covers the order lifecycle after a quotation is accepted.

#### Actors

- Business Owner
- Provider
- Admin, view-only unless resolving complaints
- System

#### Steps

1. Order is created after Business Owner accepts a quotation.
2. Initial order status is `CONFIRMED`.
3. Provider opens Provider Order Queue.
4. Provider starts work and changes status to `PROCESSING`.
5. Backend validates that the provider owns the order.
6. Backend updates `orders.status`.
7. Backend creates record in `order_status_history`.
8. Backend sends notification to Business Owner.
9. Provider updates status to `DELIVERY_OR_SERVICE` when delivery or service starts.
10. Backend stores status update history.
11. Business Owner receives order/service update notification.
12. Provider marks order as `COMPLETED` after delivery/service is done.
13. Backend stores `orders.completed_at`.
14. Backend updates `order_status_history`.
15. System sends completion notification to Business Owner.
16. Business Owner can view completed order in Order History or Service History.
17. Reports module calculates:
    - Total enquiries
    - Total quotations
    - Confirmed orders
    - Completed orders/services
    - Pending orders/services
    - Provider-wise order summary
18. Admin can view platform-level dashboard and complaints if any problem is raised.
19. All status changes are recorded in `audit_logs`.

#### Main Tables Used

- `orders`
- `order_status_history`
- `notifications`
- `device_tokens`
- `audit_logs`
- `complaints`

#### Validation Rules

- Only assigned provider can update provider-side order status.
- Business Owner can view only their own orders.
- Admin can view all orders but should not modify normal lifecycle unless a complaint or admin policy requires it.
- Status changes must follow allowed lifecycle order.
- Completed orders cannot move back to processing.
- Cancelled orders cannot be updated further.

#### Output

- Order moves through lifecycle:

```txt
CONFIRMED → PROCESSING → DELIVERY_OR_SERVICE → COMPLETED
```

- Business Owner gets timely notifications.
- Provider dashboard and business dashboard show updated status.
- Reports show accurate order and service history.

---
