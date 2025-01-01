import { appendFileSync, cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import * as init from "./init.js";
import { $ as _ } from "execa";

void (async () => {
	if(!init.SKIP_CREDENTIALS && !existsSync(init.SERVER_CREDENTIALS_DIR)) {
		init.die("SSL credentials not found in server folder. Please provide SSL credentials before proceeding.");
	}

	if(!init.SKIP_ENV_FILE && !existsSync(init.SERVER_ENV_FILE)) {
		init.die(".env file not found in server folder. Please provide an .env file before proceeding.");
	}

	try {
		const $ = _({ stdout: "inherit" });
		if(existsSync(init.DIST_ROOT_DIR)) { rmSync(init.DIST_ROOT_DIR, { recursive: true }); }

		console.log("Building workspaces..");
		await $`yarn workspaces foreach -pA run build`;

		cpSync(init.SERVER_DIST_DIR, init.DIST_ROOT_DIR, { recursive: true });

		if(!init.SKIP_CREDENTIALS) { cpSync(init.SERVER_CREDENTIALS_DIR, init.DIST_CREDENTIALS_DIR, { recursive: true }); }
		else { console.log("Skipped SSL credentials."); }

		if(!init.SKIP_ENV_FILE) { 
			cpSync(init.SERVER_ENV_FILE, init.DIST_ENV_FILE);
			appendFileSync(init.DIST_ENV_FILE, "\nENVIRONMENT=production", { encoding: "utf-8" });
		}
		else { console.log("Skipped .env file."); }

		cpSync(init.CLIENT_DIST_DIR, init.DIST_HTDOCS_DIR, { recursive: true });

		console.log("Installing build dependencies..");
		writeFileSync(init.DIST_YARNLOCK_FILE, "nodeLinker: node-modules", { encoding: "utf-8" });

		const buildDependencies = JSON.parse(readFileSync(init.SERVER_PKG_FILE, { encoding: "utf-8" })).dependencies;
		writeFileSync(init.DIST_PKG_FILE, JSON.stringify({ dependencies: buildDependencies }, null, 4));

		await $`yarn --cwd ${init.DIST_ROOT_DIR} install`;
	} catch(error) {
		init.die(error);
	}
})();