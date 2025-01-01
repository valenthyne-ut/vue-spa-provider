import express, { Express } from "express";
import { existsSync } from "fs";
import { join } from "path";
import { renderFile } from "pug";

export function useViewEngine(app: Express) {
	const htdocsPath = join(process.cwd(), "/htdocs");

	if(!existsSync(htdocsPath)) { throw new Error("htdocs folder does not exist."); }

	const assetsPath = join(htdocsPath, "/assets");
	const faviconPath = join(htdocsPath, "/favicon.ico");

	app.use("/assets", express.static(assetsPath));
	app.use("/favicon.ico", express.static(faviconPath));

	app.engine("html", renderFile);
	app.set("view engine", "html");
	app.set("views", htdocsPath);

	app
		.get(["/"], (request, response) => {
			return response.render("index.html");
		})
		.get("*", (request, response) => {
			return response.redirect("/");
		});
}