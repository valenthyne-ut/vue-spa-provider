import express from "express";
import helmet from "helmet";
import { createServer, ServerOptions } from "https";
import { useCORS } from "./middleware/CORS";
import config from "./config";
import { listNetworkInterfaceAddresses } from "./util/Networking";

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
			console.log("SPA provider started successfully.\n");
			console.log(`Local: https://localhost:${config.PORT}`);

			for(const address of listNetworkInterfaceAddresses()) {
				console.log(`Network: https://${address}:${config.PORT}`);
			}

			if(config.ALWAYS_DISPLAY_SERVER_ADDRESS || 
			(config.ENVIRONMENT == "production" && config.ADDRESS != "localhost")) {
				console.log(`Public: https://${config.ADDRESS}:${config.PORT}`);
			}
		});

	} catch(error) {
		console.log("An error occurred while starting up the SPA provider.");
		console.log(error);
	}
})();