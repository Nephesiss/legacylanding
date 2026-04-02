import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const DEFAULT_SERVER = process.env.MINECRAFT_SERVER_ADDRESS || "play.legacymc.hu";
const STATUS_BASE_URL = "https://api.mcstatus.io/v2/status/java";
const CACHE_SECONDS = 60;

const DEFAULT_REGISTRATIONS_QUERY =
  "SELECT COUNT(*) AS total FROM users";

const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT || "3306");
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_REGISTRATIONS_QUERY =
  process.env.DB_REGISTRATIONS_QUERY || DEFAULT_REGISTRATIONS_QUERY;

const dbConfigured = Boolean(DB_HOST && DB_USER && DB_NAME);

declare global {
  var __legacyPool: mysql.Pool | undefined;
}

const pool = dbConfigured
  ? global.__legacyPool ||
    mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    })
  : null;

if (pool && !global.__legacyPool) {
  global.__legacyPool = pool;
}

type McStatusResponse = {
  online?: boolean;
  players?: {
    online?: number;
    max?: number;
  };
  latency?: number;
};

async function getRegistrationsCount() {
  if (!pool) return 0;

  const [rows] = await pool.query(DB_REGISTRATIONS_QUERY);
  const first = Array.isArray(rows) ? rows[0] : null;
  const total = Number((first as { total?: unknown } | null)?.total ?? 0);
  return Number.isFinite(total) ? total : 0;
}

async function getServerStatus(serverAddress: string) {
  const response = await fetch(`${STATUS_BASE_URL}/${serverAddress}`, {
    next: { revalidate: CACHE_SECONDS },
    headers: {
      "User-Agent": "LegacyMC-Stats/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream responded with ${response.status}`);
  }

  return (await response.json()) as McStatusResponse;
}

export async function GET() {
  const serverAddress = DEFAULT_SERVER;

  try {
    const [status, registrations] = await Promise.all([
      getServerStatus(serverAddress),
      getRegistrationsCount(),
    ]);

    return NextResponse.json({
      server: serverAddress,
      onlinePlayers: status.players?.online ?? 0,
      maxPlayers: status.players?.max ?? 0,
      online: Boolean(status.online),
      latency: status.latency ?? null,
      totalRegistrations: registrations,
      dbConfigured,
      fetchedAt: new Date().toISOString(),
      cacheSeconds: CACHE_SECONDS,
    });
  } catch (error) {
    console.error("Failed to load combined stats", error);

    return NextResponse.json(
      {
        server: serverAddress,
        onlinePlayers: 0,
        maxPlayers: 0,
        online: false,
        latency: null,
        totalRegistrations: 0,
        dbConfigured,
        fetchedAt: new Date().toISOString(),
        cacheSeconds: CACHE_SECONDS,
        error: "STATS_UNAVAILABLE",
      },
      { status: 200 }
    );
  }
}
