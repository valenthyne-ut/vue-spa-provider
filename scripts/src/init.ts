import { isAbsolute, join } from "path";

const args = process.argv.slice(2);

function preparePath(path: string) {
	if(isAbsolute(path)) { return path; }
	else { return join(process.cwd(), path); }
}

function getArgument(filter: string): string | undefined {
	return args.find(value => value.startsWith(`--${filter}=`));
}

function getArgumentValue(argument: string) {
	return argument.split("=")[1];
}

export function die(...data: unknown[]): never {
	console.error(data);
	process.exit(1);
}

export function isRequiredArgumentUndefined(argument: unknown): argument is undefined {
	return typeof argument === "undefined";
}

const serverDirectoryArg = getArgument("server-directory");
if(isRequiredArgumentUndefined(serverDirectoryArg)) { die("server-directory argument must be set."); }

const clientDirectoryArg = getArgument("client-directory");
if(isRequiredArgumentUndefined(clientDirectoryArg)) { die("client-directory argument must be set."); }

const outDirectoryArg = getArgument("build-directory");

export const SKIP_CREDENTIALS = getArgument("--skipCredentials") !== undefined;
export const SKIP_ENV_FILE = getArgument("--skipEnv") !== undefined;

export const CLIENT_ROOT_DIR = getArgumentValue(clientDirectoryArg);
export const CLIENT_DIST_DIR = join(CLIENT_ROOT_DIR, "/dist");

export const SERVER_ROOT_DIR = getArgumentValue(serverDirectoryArg);
export const SERVER_DIST_DIR = join(SERVER_ROOT_DIR, "/dist");
export const SERVER_CREDENTIALS_DIR = join(SERVER_ROOT_DIR, "/ssl");

export const SERVER_ENV_FILE = join(SERVER_ROOT_DIR, "/.env");
export const SERVER_PKG_FILE = join(SERVER_ROOT_DIR, "/package.json");

export const DIST_ROOT_DIR = typeof outDirectoryArg !== "undefined" ?
	getArgumentValue(outDirectoryArg) :
	preparePath("dist");

export const DIST_CREDENTIALS_DIR = join(DIST_ROOT_DIR, "/ssl");
export const DIST_HTDOCS_DIR 	  = join(DIST_ROOT_DIR, "/htdocs");
export const DIST_YARNLOCK_FILE   = join(DIST_ROOT_DIR, "/yarn.lock");
export const DIST_YARNRC_FILE 	  = join(DIST_ROOT_DIR, "/yarnrc.yml");
export const DIST_ENV_FILE 		  = join(DIST_ROOT_DIR, "/.env");
export const DIST_PKG_FILE 		  = join(DIST_ROOT_DIR, "/package.json");