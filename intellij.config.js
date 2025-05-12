/*
 * This is a workaround for aliased paths in .mdx files. IntelliJ's MDX plugin does not seem to pick up on the `paths`
 * segment in the tsconfig. However, the IDE can apparently see this particular file (regardless of its name) and
 * recognize the `System` object...
 */
System.config({
    paths: {
        '@site/*': './*'
    }
});
