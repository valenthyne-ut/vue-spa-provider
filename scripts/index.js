import { existsSync } from "fs";
import { $ as _ } from "execa";

const $ = _({ stdout: "inherit" });
void (async () => { if(!existsSync("./dist")) { await $`yarn build-scripts`; } })()