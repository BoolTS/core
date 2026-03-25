import { build } from "bun";
import { rm } from "node:fs/promises";

(async () => {
    const currentDir = import.meta.dir;

    await rm(`${currentDir}/dist`, { recursive: true, force: true });

    await build({
        entrypoints: [`${import.meta.dir}/src/index.ts`],
        root: `${import.meta.dir}/src`,
        outdir: `${import.meta.dir}/dist`,
        publicPath: "./src/",
        sourcemap: "external",
        target: "bun",
        format: "esm",
        packages: "bundle",
        minify: true
    });
})();
