# HRC_HUB_PRDV1.md

# Product Requirements Document (PRD) – Version 1

## 1. Product Overview

HRC Hub is a B2B SaaS platform designed for the HoReCa (Hotels, Restaurants, Cafés) industry. It provides a single marketplace where businesses can discover and connect with Raw Material Suppliers, Service Providers, Manpower Providers, and Marketing Agencies. Version 1 focuses on enabling business discovery, enquiries, quotations, and basic operational management through role-based dashboards.

---

## 2. Target Users

### Primary Users
- Hotels
- Restaurants
- Cafés
- Raw Material Suppliers
- Manpower Providers
- Service Providers
- Marketing Agencies

### Business Partners
- Raw Material Suppliers
- Service Providers
- Manpower Providers
- Marketing Agencies

### Platform Administrator
- System Admin

---

## 3. Core Features for Version 1 (Must-Have)

### Authentication
- User Registration
- Secure Login
- Forgot Password
- Role-based Authentication

### Business Profile
- Create Business Profile
- Edit Company Information
- GST Details
- Contact Information
- Business Category
- Branch Information

### Provider Registration
- Register on the platform
- Create Business Profile
- Manage Products or Services
- Update Pricing
- Manage Availability

### Provider Categories
#### Raw Material Suppliers
- Product Listings
- Product Categories
- Pricing
- Inventory Status

#### Service Providers
- Service Listings
- Service Areas
- Pricing
- Availability

#### Manpower Providers
- Staff Categories
- Hiring Services
- Availability

#### Marketing Agencies
- Marketing Services
- Portfolio Information
- Service Packages

### Marketplace
- Browse Providers
- Search by Keyword
- Filter by Category
- View Provider Profile
- Compare Providers

### Enquiry Management
Businesses can send enquiries, request quotations and contact providers.
Providers can receive enquiries, respond with quotations and manage enquiry status.

### Order & Service Flow
1. Enquiry
2. Quotation
3. Confirmation
4. Processing
5. Delivery / Service
6. Completion

### Dashboard
- Business Dashboard
- Provider Dashboard
- Admin Dashboard

### Notifications
- New Enquiry
- New Quotation
- Order Status Updates
- Service Updates

### Reports
- Order History
- Service History
- Business Summary

### Administration
- Manage Users
- Approve Registrations
- Manage Categories
- Manage Complaints
- Manage Platform Settings

---

## 4. Out of Scope for Version 1 (Not Building Yet)
- Online Payment Gateway
- Wallet System
- Subscription Billing
- AI Recommendations
- Predictive Analytics
- Live Order Tracking
- GPS Tracking
- Mobile Applications
- Loyalty Programs
- Vendor Ratings & Reviews
- Multi-language Support
- ERP Integration
- POS Integration
- Inventory Synchronization
- Accounting Integration
- Chat Messaging
- Video Calling
- Auction/Bidding System
- Automated Procurement
- Advanced Marketing Campaign Management
- Advanced HR & Payroll Management
- Advanced Business Intelligence Dashboards

---

## 5. User Roles and Permissions

### Admin
Can manage users, registrations, provider categories, enquiries, complaints and platform settings.

### Business Owner
Can manage business profile, search providers, send enquiries, request quotations, compare quotations and manage branches.

### Supplier
Can manage products, pricing, enquiries and orders.

### Service Provider
Can manage services and respond to service requests.

### Manpower Provider
Can publish staffing services and respond to hiring requests.

### Marketing Agency
Can publish marketing services and respond to proposal requests.

---

## 6. Key Business Rules
1. Registration is mandatory.
2. One account has one role.
3. Provider registrations require Admin approval.
4. Businesses can send enquiries to multiple providers.
5. Providers respond only to their own enquiries.
6. Workflow: Enquiry → Quotation → Confirmation → Processing → Delivery/Service → Completion.
7. Only Admin manages categories and platform settings.
8. Audit logs are maintained.
9. Products and services require valid categories.
10. Search and filtering are available.
11. Users may edit only their own organization data.

---

## 7. Success Criteria
- Businesses register successfully.
- Providers from all four categories publish offerings.
- Admin approves registrations.
- Businesses discover providers using search and filters.
- End-to-end enquiry and quotation flow works.
- Workflow completes successfully.
- Notifications are delivered.
- Dashboards display relevant information.
- Reports generate correctly.
- Role-based permissions work correctly.
- Platform is responsive on desktop, tablet and mobile.
