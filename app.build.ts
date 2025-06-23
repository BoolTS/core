(async () => {
    await Bun.build({
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
