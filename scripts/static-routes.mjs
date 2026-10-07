import { mkdir, copyFile, writeFile } from "node:fs/promises";
for (const route of ["works", "works/two-worlds", "about"]) { await mkdir("dist/"+route,{recursive:true}); await copyFile("dist/index.html","dist/"+route+"/index.html"); }
await copyFile("dist/index.html","dist/404.html");
await writeFile("dist/.nojekyll","");
