-- InstantDB schema reference for admin portal data

-- Contact submissions captured from the marketing site
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  fullName TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  createdAt TEXT NOT NULL
);

CREATE INDEX contacts_created_at_idx ON contacts (createdAt DESC);

-- Administrative users that can access the portal
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL, -- owner | admin | editor | viewer
  status TEXT NOT NULL, -- active | invited | disabled
  createdAt TEXT NOT NULL
);

CREATE INDEX users_created_at_idx ON users (createdAt DESC);

-- Content blocks prepare the system for future CMS editing
CREATE TABLE content_blocks (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  mediaRefs JSON,
  status TEXT NOT NULL, -- draft | published
  updatedAt TEXT NOT NULL
);

CREATE INDEX content_blocks_updated_at_idx ON content_blocks (updatedAt DESC);

-- NOTE: Paste these statements (or the equivalent Instant schema JSON)
-- into the InstantDB dashboard to provision the structures before running the admin portal.

