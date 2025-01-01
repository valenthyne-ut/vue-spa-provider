import express from "express";
import helmet from "helmet";
import { createServer, ServerOptions } from "https";
import { useCORS } from "./middleware/CORS";
import config from "./config";

void (() => {
	try {
		const app = express();

		app.use(helmet());
		useCORS(app, config.PORT, config.ADDRESS, config.ENVIRONMENT);
		
		app.get("/", (req, res) => {
			res.status(200).send("<p>Hello world!</p>");
		});

		const serverOptions: ServerOptions = config.SSL_CREDENTIALS;
		// Change any server options below here.

		const httpsServer = createServer(serverOptions, app).listen(8443);
		httpsServer.on("listening", () => {
			console.log("SPA provider started successfully.");
		});

	} catch(error) {
		console.log("An error occurred while starting up the SPA provider.");
		console.log(error);
	}
})();