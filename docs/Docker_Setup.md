# Deploying the project's Docker Container
> [!IMPORTANT]
> Ensure that the .env file is present with the DATABASE_URL set, in uob_transport_app.
> The build may succeed without first doing this, but you'll need the .env present to be able to run the project.

To build the container, navigate to the root directory of the project, then run:
```sh
cd uob_transport_app
docker compose up
```

This may take a while.

> [!TIP]
> If you get an error saying compose is not a module of docker, try installing docker-compose-v2 from your package manager.


### Accessing the container
The project should be accessible at localhost:3000 when the container comes online.