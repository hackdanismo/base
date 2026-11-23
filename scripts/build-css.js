
/* Build CSS: Bundle all component stylesheets into one file */
const result = await Bun.build({

    // Entry Point: Master stylesheet containing all CSS imports
    entrypoints: ["./styles/styles.css"],

    // Output Directory: Location of the generated stylesheet
    outdir: "./dist",

    // Minification: Compress the resulting CSS file
    minify: true,

    // Target: Optimize for browser usage
    target: "browser",

    // Naming: Set the output filename
    naming: {
        entry: "styles.min.css"
    }

});

/* Build Validation: Check whether bundling succeeded */
if (!result.success) {

    // Errors: Display any build failures
    console.error("CSS build failed:", result.logs);

    // Exit: Stop execution with a failure status
    process.exit(1);

}

/* Success: Confirm that the stylesheet was generated */
console.log("CSS successfully bundled and minified.");
