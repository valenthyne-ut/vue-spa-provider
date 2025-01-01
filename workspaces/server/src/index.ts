import express from "express";
import helmet from "helmet";
import { createServer, ServerOptions } from "https";
import { useCORS } from "./middleware/CORS";
import { readFileSync } from "fs";
import { join } from "path";

void (() => {
	try {
		const app = express();

		app.use(helmet());
		useCORS(app, 8443, "localhost", "development");
		
		app.get("/", (req, res) => {
			res.status(200).send("<p>Hello world!</p>");
		});

		const serverOptions: ServerOptions = {};
		// Change any server options below here.

		const credentialsPath = join(process.cwd(), "/ssl");

		serverOptions.key = readFileSync(join(credentialsPath, "key.pem"), { encoding: "utf8" });
		serverOptions.cert = readFileSync(join(credentialsPath, "cert.pem"), { encoding: "utf8" });

		const httpsServer = createServer(serverOptions, app).listen(8443);
		httpsServer.on("listening", () => {
			console.log("SPA provider started successfully.");
		});

	} catch(error) {
		console.log("An error occurred while starting up the SPA provider.");
		console.log(error);
	}
})();