# Database Schema

This document describes the persistent data model for Chadscendence.

## Entity-Relationship Diagram

```mermaid
erDiagram
    %% Relationships
    users }|--|| roles : "has role"
    users }|--o| ranks : "has rank"
    users ||--o{ messages : "sends"
    users ||--o{ messages : "receives"
    users ||--o{ friendships : "requests"
    users ||--o{ friendships : "addresses"

    %% Many-to-Many Relationship via Junction Table
    roles ||--o{ role_permissions : "defines"
    permissions ||--o{ role_permissions : "assigned to"

    %% Entities
    users {
        uuid id PK
        string username "unique"
        string email "unique"
        string password_hash "nullable"
        string avatar_url
        text bio "nullable"
        enum status "online, offline"
        uuid role_id FK
        enum account_status "active, banned"
        int rating
        uuid rank_id FK "nullable"
        string intra_id "unique, nullable"
        string github_id "unique, nullable"
        timestamp created_at
        timestamp updated_at
    }

    roles {
        uuid id PK
        string name "unique"
        timestamp created_at
        timestamp updated_at
    }

    permissions {
        uuid id PK
        enum action "unique"
    }

    ranks {
        uuid id PK
        string name "unique"
        int rating_min
        string icon
    }

    messages {
        uuid id PK
        uuid sender_id FK
        uuid receiver_id FK
        text content
        boolean is_read
        timestamp created_at
    }

    friendships {
        uuid id PK
        uuid requester_id FK
        uuid addressee_id FK
        enum status "pending, accepted, blocked"
        timestamp created_at
        timestamp updated_at
    }

    role_permissions {
        uuid role_id FK
        uuid permission_id FK
    }
```

## Transient Data (Non-DB)

The following models exist in the application but are **not** persisted in the primary PostgreSQL database:

- **Rooms:** Managed in-memory within the `RoomsService`.
- **Active Games:** Managed in Redis for real-time performance.
