const { Pool } = require("pg");

let pool = null;
let databaseStatus = {
  configured: false,
  connected: false,
  last_error: null,
};

function isDatabaseConfigured() {
  return Boolean((process.env.DATABASE_URL || "").trim());
}

function getPool() {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return pool;
}

function getDatabaseStatus() {
  return { ...databaseStatus };
}

async function ensureSchema() {
  const client = getPool();
  if (!client) {
    return;
  }

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      google_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      picture TEXT,
      email_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function initDatabase() {
  databaseStatus = {
    configured: isDatabaseConfigured(),
    connected: false,
    last_error: null,
  };

  if (!databaseStatus.configured) {
    return getDatabaseStatus();
  }

  try {
    const client = getPool();
    await client.query("SELECT 1");
    await ensureSchema();
    databaseStatus.connected = true;
    return getDatabaseStatus();
  } catch (error) {
    databaseStatus.connected = false;
    databaseStatus.last_error = error.message;
    throw error;
  }
}

async function upsertUser(user) {
  const client = getPool();
  if (!client) {
    return null;
  }

  const query = `
    INSERT INTO users (google_id, email, name, picture, email_verified)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (google_id)
    DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      picture = EXCLUDED.picture,
      email_verified = EXCLUDED.email_verified,
      updated_at = NOW()
    RETURNING id, google_id, email, name, picture, email_verified, created_at, updated_at;
  `;

  const values = [
    user.google_id,
    user.email,
    user.name,
    user.picture || null,
    Boolean(user.email_verified),
  ];

  const { rows } = await client.query(query, values);
  return rows[0] || null;
}

module.exports = {
  getDatabaseStatus,
  initDatabase,
  isDatabaseConfigured,
  upsertUser,
};
