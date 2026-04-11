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

  await client.query(`
    CREATE TABLE IF NOT EXISTS prediction_history (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      disease TEXT NOT NULL,
      input_payload JSONB NOT NULL,
      result_payload JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS prediction_history_user_created_at_idx
    ON prediction_history (user_id, created_at DESC);
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

async function findUserByGoogleId(googleId) {
  const client = getPool();
  if (!client || !googleId) {
    return null;
  }

  const { rows } = await client.query(
    `SELECT id, google_id, email, name, picture, email_verified, created_at, updated_at
     FROM users
     WHERE google_id = $1
     LIMIT 1`,
    [googleId]
  );

  return rows[0] || null;
}

async function savePredictionHistory({ googleId, disease, inputPayload, resultPayload }) {
  const client = getPool();
  if (!client || !googleId) {
    return null;
  }

  const user = await findUserByGoogleId(googleId);
  if (!user) {
    return null;
  }

  const { rows } = await client.query(
    `INSERT INTO prediction_history (user_id, disease, input_payload, result_payload)
     VALUES ($1, $2, $3::jsonb, $4::jsonb)
     RETURNING id, user_id, disease, input_payload, result_payload, created_at`,
    [
      user.id,
      disease,
      JSON.stringify(inputPayload || {}),
      JSON.stringify(resultPayload || {}),
    ]
  );

  return rows[0] || null;
}

async function listPredictionHistoryByGoogleId(googleId, limit = 20) {
  const client = getPool();
  if (!client || !googleId) {
    return [];
  }

  const user = await findUserByGoogleId(googleId);
  if (!user) {
    return [];
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const { rows } = await client.query(
    `SELECT id, disease, input_payload, result_payload, created_at
     FROM prediction_history
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [user.id, safeLimit]
  );

  return rows;
}

async function getPredictionHistoryDetail(googleId, historyId) {
  const client = getPool();
  if (!client || !googleId || !historyId) {
    return null;
  }

  const user = await findUserByGoogleId(googleId);
  if (!user) {
    return null;
  }

  const { rows } = await client.query(
    `SELECT id, disease, input_payload, result_payload, created_at
     FROM prediction_history
     WHERE user_id = $1 AND id = $2
     LIMIT 1`,
    [user.id, historyId]
  );

  return rows[0] || null;
}

async function deletePredictionHistory(googleId, historyId) {
  const client = getPool();
  if (!client || !googleId || !historyId) {
    return false;
  }

  const user = await findUserByGoogleId(googleId);
  if (!user) {
    return false;
  }

  const { rowCount } = await client.query(
    `DELETE FROM prediction_history
     WHERE user_id = $1 AND id = $2`,
    [user.id, historyId]
  );

  return rowCount > 0;
}

module.exports = {
  deletePredictionHistory,
  findUserByGoogleId,
  getDatabaseStatus,
  getPredictionHistoryDetail,
  initDatabase,
  isDatabaseConfigured,
  listPredictionHistoryByGoogleId,
  savePredictionHistory,
  upsertUser,
};
