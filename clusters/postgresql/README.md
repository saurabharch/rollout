
```sh
docker run --name postgres -p 5432:5432 -v ${pwd}/postgresql_data:/var/lib/postgresql/data -v postgresql:/var/lib/postgresql -e POSTGRES_USER=postgresUser POSTGRES_PASSWORD=postgresPassword POSTGRES_DB=postgresDB -e DOCKER_HOST=tcp://docker:2376 --network=bridge --restart=on-failure postgres:latest

```


Bash Command Interface

<br></br>
```sh

docker exec -it container-id databasename

```
##### example

```powershell
docker exec -it postgresql postgresDB
```

```sh

docker exec -it container-id psql -U postgresUsername databasename

```


More Reference [click](https://stackoverflow.com/questions/30848670/how-to-customize-the-configuration-file-of-the-official-postgresql-docker-image)
