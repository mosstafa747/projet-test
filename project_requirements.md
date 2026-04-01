# Project Requirements

## 14. Search System
The platform must include a fast and user-friendly product search feature.
- **Search Features:**
  - Search by product name
  - Search by category
  - Search by materials
  - Search suggestions (autocomplete)
  - Display recent searches
- **Search Performance:**
  - Support partial keyword matching
  - Fast response (<300ms)
- **Recommended implementation:** MongoDB text indexes or Elasticsearch (optional for scaling)

## 15. Product Categories
Example categories for the furniture store:
- Living Room
- Dining Room
- Bedroom
- Office
- Outdoor
- Decor
- Lighting

Each category contains: `Name`, `Slug`, `Description`, `Category image`
Example category model: `id`, `name`, `slug`, `description`, `image`, `createdAt`

## 16. Inventory Management
Products must support stock tracking.
- **Fields:** `stock`, `inStock` (boolean), `lowStockThreshold`
- **Behavior:**
  - If stock = 0 → show Out of Stock
  - If stock < threshold → show Low Stock Warning
  - Admin can update stock from dashboard.

## 17. Order Status System
Orders must support multiple statuses.
- **Order lifecycle:** Pending, Confirmed, Processing, Shipped, Delivered, Cancelled
- Customers can track order progress. Example timeline: Order placed -> Processing -> Shipped -> Delivered

## 18. Email Notifications
System must send transactional emails using services such as SendGrid, Resend, or Nodemailer (SMTP).
- **Order Confirmation:** Sent after checkout. Contains order number, product list, total price, delivery address.
- **Shipping Notification:** Sent when order status changes to Shipped. Includes tracking number, estimated delivery.
- **Custom Request Confirmation:** Sent after custom furniture request submission.

## 19. Image Management
Furniture websites rely heavily on images.
- **Requirements:** Each product must include a cover image and gallery images (3–6 images).
- **Optimization:** WebP format preferred, responsive image sizes, lazy loading.
- **Recommended storage:** Cloudinary, AWS S3.

## 20. Internationalization (Optional but Recommended)
Support multiple languages (e.g., English, French, Arabic).
- **Implementation:** Use libraries such as `i18next`, `react-i18next`. Language switcher in navbar.

## 21. Analytics
Track user behavior and sales performance using Google Analytics, Google Search Console.
- **Metrics to track:** Page views, Conversion rate, Cart abandonment, Best-selling products, Traffic sources.

## 22. Performance Optimization
- **Goals:** First Contentful Paint < 1.5 seconds, Page Load < 2 seconds
- **Techniques:** Image compression, lazy loading, code splitting, CDN usage. Use Lighthouse, WebPageTest for testing.

## 23. Accessibility
Follow WCAG accessibility standards.
- **Requirements:** Semantic HTML, Keyboard navigation, ARIA labels, High contrast text, Alt text for images.

## 24. Error Handling
- **404 Page:** "Page not found" message, link to homepage, product search bar.
- **Server Error Page:** "Something went wrong. Please try again later."

## 25. Deployment Architecture
Recommended hosting architecture:
- **Frontend deployment:** Vercel or Netlify
- **Backend hosting:** Render or Railway
- **Database hosting:** MongoDB Atlas

## 26. Testing Strategy
- **Unit Testing:** Jest, React Testing Library
- **Integration Testing:** Test API endpoints and database interactions.
- **End-to-End Testing:** Cypress, Playwright (e.g., User registers, adds product to cart, completes checkout)

## 27. Folder Structure (Recommended)
Example project structure:
```
/client
  /components, /pages, /hooks, /context, /utils, /assets
/server
  /controllers, /routes, /models, /middleware, /services
/config, /public
```

## 29. Payment System
The platform must support secure online payments.
- **Recommended provider:** Stripe.
- **Additional options:** Cash on Delivery, PayPal.
- **Flow:** Cart → Checkout → Payment → Confirmation.
- **Payment statuses:** Pending, Paid, Failed, Refunded.
- **Fields:** `paymentId`, `paymentMethod`, `paymentStatus`, `transactionId`, `amount`, `currency`, `createdAt`.

## 30. Shipping System
Shipping should be configurable by admin.
- **Methods:** Standard, Express, International.
- **Pricing:** Flat rate, Location-based, or Weight-based.
- **Tracking:** `trackingNumber`, `carrier`, `estimatedDelivery`.

## 31. Discount & Coupon System
Support promotional codes (e.g., BELDI10).
- **Types:** Percentage, Fixed, Free shipping.
- **Fields:** `code`, `discountType`, `discountValue`, `expiryDate`, `limit`, `minOrderValue`.

## 32. Wishlist System
Users can save products to wishlist.
- **Features:** Add/Remove, View wishlist page.
- **Model:** `userId`, `productIds[]`.

## 33. Review & Rating System
Users can review purchased products.
- **Details:** Rating (1-5), Title, Text.
- **Moderation:** Admin can Approve, Reject, or Delete reviews.
- **Logic:** Average rating calculated automatically.

## 34. Product Recommendation System
Improve product discovery.
- **Types:** Related products (same category), Frequently bought together, Recently viewed, Best sellers.

## 35. Logging & Monitoring
Track errors and performance using Sentry or LogRocket.
- **Logs:** Server errors, Payment failures, Auth errors, API errors.

## 36. Security Architecture
- **Auth:** JWT/Sanctum with Refresh tokens.
- **Hashing:** bcrypt.
- **Middleware:** Helmet, express-rate-limit (or Laravel equivalent), CORS.
- **Protection:** Secure cookies, HTTPS, Input validation.

## 37. Backup & Disaster Recovery
Daily automatic backups stored in cloud or secondary DB.

## 38. Scalability Strategy
- CDN for images, Horizontal scaling, DB Indexing.
- Future tools: Redis caching, Elasticsearch.

## 39. Marketing Features
- Newsletter subscription (Mailchimp), Promotional banners, Featured products.

## 40. Legal Pages
Standard e-commerce pages: Privacy Policy, Terms of Service, Refund Policy, Shipping Policy.

## 41. SEO Optimization (Advanced)
- Meta titles/descriptions, Open Graph tags.
- Structured data (Schema.org Product schema).

## 42. Sitemap Generation
Automatic generation of `sitemap.xml` for Products, Categories, and future Blog.

## 43. Robots.txt
Standard crawling rules and sitemap link.

## 44. Blog System (Optional)
Interior design tips, artisan stories. URL: `/blog/...`

## 45. Maintenance Mode
Admin can temporarily disable the store with a message.

## 46. Roadmap
- **Phase 1:** Catalog, Cart, Checkout, Admin (Core).
- **Phase 2:** Coupons, Analytics, Reviews (Advanced).
- **Phase 3:** AI Recommendations, Multi-language, International shipping (Growth).

## 86. Product Variants System
Some furniture products may have variations.
Examples: Color, Material, Size
Example variants:
Chair
 ├ Color: Brown / Black
 ├ Material: Leather / Fabric

Variant model:
variantId, productId, name, options[], priceModifier, stock

Example option:
Color: Brown, PriceModifier: +50 MAD

## 87. Bulk Product Import
Admin should be able to import products in bulk.
Supported formats: CSV, Excel
Fields example: name, description, price, category, stock, imageUrl
Import workflow: Upload file → Validate → Import → Report results
Validation must detect: Missing fields, Duplicate SKUs

## 88. SKU System
Each product must have a unique SKU (Stock Keeping Unit).
Example SKU format: BELDI-CHAIR-001, BELDI-TABLE-002
SKU fields: sku, productId, variantId
Purpose: Inventory tracking, Order management, Warehouse operations

## 89. Inventory Alerts
System should notify admin when stock is low.
Example threshold: lowStockThreshold = 5
Alert example: Product: Moroccan Coffee Table, Stock remaining: 4
Notification methods: Email, Admin dashboard alert

## 90. Supplier Management (Optional)
If the store scales, suppliers may be tracked.
Supplier model: supplierId, name, contactEmail, phone, address
Products may reference supplier: product.supplierId

## 91. Warehouse Management (Optional)
For scaling logistics.
Warehouse model: warehouseId, location, capacity, manager
Inventory stored per warehouse: warehouseId, productId, stock

## 92. Delivery Tracking Integration
Orders should support external tracking.
Example carriers: DHL, UPS, Local courier services
Tracking fields: trackingNumber, carrier, trackingUrl
Tracking page example: /order/:id/tracking

## 93. Product Comparison Feature
Customers may compare products.
Comparison attributes: Price, Dimensions, Material, Rating

## 94. Recently Viewed Products
System should store recently viewed items.
Storage: localStorage or user session
Displayed on: Product page, Homepage

## 95. Session Management
User sessions must expire securely.
Example session settings: accessTokenExpiration: 15 minutes, refreshTokenExpiration: 7 days
Session storage: HTTP-only cookies or Secure storage

## 96. Rate Limiting Strategy
Different limits for endpoints.
Examples: Login: 5 req/min, Search: 60 req/min, API general: 100 req/min
Purpose: Prevent brute-force attacks, Prevent API abuse

## 97. API Versioning
APIs should support versioning to prevent breaking existing integrations.
Example: /api/v1/products

## 98. Webhooks System
Webhooks notify external systems when events occur.
Example events: Order created, Payment completed, Refund issued
Webhook payload example: {"event": "order.created", "orderId": "12345"}

## 99. Third-Party Integrations
Platform may integrate with external services.
Examples: Payments (Stripe), Email (SendGrid), Media (Cloudinary), Analytics (Google Analytics)

## 100. Feature Roadmap (Long-Term)
Phase 4 features: AI product recommendations, Augmented reality furniture preview, Interior design simulator

## 101. Marketplace Expansion (Future)
Platform may evolve into multi-vendor marketplace.
Vendor model: vendorId, name, storeName, rating, createdAt
Admin controls: Vendor approval, Commission rates

## 102. Commission System (Marketplace)
If marketplace implemented.
Commission example: commissionRate = 10%

## 103. Data Governance
Data must be managed responsibly.
Policies: Data accuracy, Access control, Audit logs
Sensitive data must be restricted to authorized roles.

## 104. Role-Based Access Control (RBAC)
Different permissions for different roles.
Example permissions: Admin (Manage products, users, orders), Support (View orders, respond to tickets), Customer (View profile, place orders).
RBAC fields: role, permissions[]

## 105. Data Encryption
Sensitive data must be encrypted.
Examples: Passwords, Payment tokens
Encryption methods: bcrypt, AES encryption, TLS (HTTPS)

## 106. Compliance & Legal
E-commerce sites must comply with international standards.
Important regulation: GDPR (Data protection, User consent, Right to data deletion)

## 107. UML Diagrams
- [Use Case Diagram](file:///c:/Users/mosst/OneDrive/Desktop/projet_test/use_case_diagram.md)
