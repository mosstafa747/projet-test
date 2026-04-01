# Use Case Diagram

This diagram illustrates the primary actors and their interactions with the furniture e-commerce system based on the project requirements and recent development history.

```mermaid
useCaseDiagram
    actor "Customer" as C
    actor "Admin" as A
    actor "Driver" as D
    actor "Support" as S

    package "Product Management" {
        usecase "Search Products" as UC1
        usecase "View Product Details" as UC2
        usecase "Manage Wishlist" as UC3
        usecase "Compare Products" as UC4
        usecase "Review Products" as UC5
        usecase "Manage Products (CRUD/Import)" as UC6
    }

    package "Order & Checkout" {
        usecase "Add to Cart" as UC7
        usecase "Process Checkout" as UC8
        usecase "Track Order" as UC9
        usecase "Manage Orders" as UC10
        usecase "Apply Coupons" as UC11
    }

    package "Logistics & Delivery" {
        usecase "View Assigned Deliveries" as UC12
        usecase "Update Delivery Status" as UC13
        usecase "Settle Cash" as UC14
        usecase "Open Location in Maps" as UC15
    }

    package "User & System Control" {
        usecase "Manage Profile" as UC16
        usecase "Manage Roles (RBAC)" as UC17
        usecase "View Analytics" as UC18
        usecase "Maintenance Mode" as UC19
    }

    %% Customer Transitions
    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC4
    C --> UC5
    C --> UC7
    C --> UC8
    C --> UC9
    C --> UC11
    C --> UC16

    %% Admin Transitions
    A --> UC6
    A --> UC10
    A --> UC14
    A --> UC17
    A --> UC18
    A --> UC19
    A --> UC5 : "Moderate Reviews"

    %% Driver Transitions
    D --> UC12
    D --> UC13
    D --> UC14
    D --> UC15

    %% Support Transitions
    S --> UC10 : "View Orders"
    S --> UC5 : "View Reviews"
```

## Actor Descriptions

| Actor | Description |
| :--- | :--- |
| **Customer** | End-user browsing the catalog, making purchases, and managing their personal account. |
| **Admin** | System administrator with full access to product management, order processing, and system settings. |
| **Driver** | Logistics personnel responsible for physical delivery of furniture items and cash collection (COD). |
| **Support** | Staff members focused on customer service, order inquiries, and review moderation. |
