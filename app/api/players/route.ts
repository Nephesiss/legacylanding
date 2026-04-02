import { NextResponse } from "next/server";

const DEFAULT_SERVER = "play.legacymc.hu";
const STATUS_BASE_URL = "https://api.mcstatus.io/v2/status/java";
const CACHE_SECONDS = 60;
const DEFAULT_TOTAL_REGISTRATIONS = Number(process.env.TOTAL_REGISTRATIONS || "5000");

type McStatusResponse = {
	online?: boolean;
	players?: {
		online?: number;
		max?: number;
	};
	latency?: number;
};

export async function GET() {
	const serverAddress = process.env.MINECRAFT_SERVER_ADDRESS || DEFAULT_SERVER;
	const statusUrl = `${STATUS_BASE_URL}/${serverAddress}`;

	try {
		const response = await fetch(statusUrl, {
			next: { revalidate: CACHE_SECONDS },
			headers: {
				"User-Agent": "LegacyMC-Status/1.0",
			},
		});

		if (!response.ok) {
			throw new Error(`Upstream responded with ${response.status}`);
		}

		const data = (await response.json()) as McStatusResponse;

		return NextResponse.json({
			server: serverAddress,
			onlinePlayers: data.players?.online ?? 0,
			maxPlayers: data.players?.max ?? 0,
			totalRegistrations: DEFAULT_TOTAL_REGISTRATIONS,
			online: Boolean(data.online),
			latency: data.latency ?? null,
			fetchedAt: new Date().toISOString(),
			cacheSeconds: CACHE_SECONDS,
		});
	} catch (error) {
		console.error("Failed to load MC status", error);

		return NextResponse.json(
			{
				server: serverAddress,
				onlinePlayers: 0,
				maxPlayers: 0,
				totalRegistrations: DEFAULT_TOTAL_REGISTRATIONS,
				online: false,
				latency: null,
				fetchedAt: new Date().toISOString(),
				cacheSeconds: CACHE_SECONDS,
				error: "STATUS_UNAVAILABLE",
			},
			{ status: 200 }
		);
	}
}
