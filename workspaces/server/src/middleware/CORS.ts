import { Express } from "express";
import { Environment } from "@/types/Environment";
import cors from "cors";

export function useCORS(app: Express, port: number, address: string, environment: Environment) {
	const configs = {
		"development": [
			`https://localhost:${port}`,
			`https://127.0.0.1:${port}`
		],
		"production": [
			`https://${address}:${port}`
		]
	};

	app.use(cors(({
		origin: configs[environment]
	})));
}