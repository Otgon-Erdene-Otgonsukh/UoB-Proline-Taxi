# Deploying the project's Docker Container
### Changing the build type to Production
To deploy our project, you'll need to update the array in `next.config.ts` to contain:
```ts
{
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
}
```

The linting bypass (ignoreDuringBuilds) is to avoid linting errors, although in the future we need to ensure no linting errors are present in production.

### Building the Docker container
Firstly, ensure that the .env file is present with the DATABASE_URL set.
The build may succeed without first doing this, but you'll need the .env present to be able to run the project.

To build the container, navigate to the root directory of the project, then run:
`docker build --build-arg DATABASE_URL="$(grep -Po '(?<=^DATABASE_URL=).*' .env)" -t uob-transport .`

This may take a while.

If you get errors about package versions, or anything that says "This is an issue with npm", try adding the `--no-cache` flag onto the build command.
You can also force the cleaning of cache by adding `RUN npm cache clean --force` in the "deps" part of the Dockerfile.

### Running the container
Finally, you can run:
`docker run --env-file .env -p 3000:3000 uob-transport`
which will run our project which will be accessible at localhost:3000.