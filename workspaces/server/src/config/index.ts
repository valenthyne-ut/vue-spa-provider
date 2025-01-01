import "dotenv/config";
import { Environment } from "@/types/Environment";
import { unrollError } from "@/util/Errors";
import { readFileSync } from "fs";
import { ServerOptions } from "https";
import { join } from "path";

function die(reason: string): never {
	console.log(reason);
	process.exit(1);
}

const environment: Environment = (() => {
	const environment = process.env["ENVIRONMENT"];

	switch(environment && environment.toLowerCase()) {
	case "development": case "dev": { return "development"; }
	case "production": case "prod": { return "production"; }
	default: { die("Environment either not specified or invalid. (must be either 'development' or 'production'.)"); }
	}
})();

function getKeyValue(key: string): string | undefined {
	key = key.toUpperCase();
	const preferredKey = `${environment.toUpperCase()}_${key}`;
	
	let keyValue = undefined;

	if(process.env[preferredKey]) { keyValue = process.env[preferredKey]; }
	else if(process.env[key]) { keyValue = process.env[key]; }

	return keyValue;
}

function getServerPort(): number {
	const port = getKeyValue("port");
	
	if(port) {
		const parsedPort = parseInt(port);
		if(!isNaN(parsedPort)) { return parsedPort; }
	}

	die("Server port not specified.");
}

function getServerAddress(): string {
	return getKeyValue("address") || "localhost";
}

function getServerCredentials(): ServerOptions {
	const credentials: ServerOptions = {};

	try {
		const credentialsPath = join(process.cwd(), "/ssl");

		credentials.key = readFileSync(join(credentialsPath, "key.pem"), { encoding: "utf8" });
		credentials.cert = readFileSync(join(credentialsPath, "cert.pem"), { encoding: "utf8" });

		return credentials;
	} catch(error) {
		console.log("Couldn't read SSL credentials.");
		die(unrollError(error, true));
	}

	return credentials;
}

function getAlwaysDisplayServerAddress(): boolean {
	const value = getKeyValue("always_display_server_address");
	return (value !== undefined && value.toLowerCase() === "true");
}

export default {
	ENVIRONMENT: environment,
	PORT: getServerPort(),
	ADDRESS: getServerAddress(),
	SSL_CREDENTIALS: getServerCredentials(),
	ALWAYS_DISPLAY_SERVER_ADDRESS: getAlwaysDisplayServerAddress()
};