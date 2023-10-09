### MinIO Using in docker container

minio is using for s3 (software storage system) is high performance s3 solution for high performance data infrastructure for machine learning, analytics and application data workloads with MinIO.

## 1. Step
Volume Creation

```
docker volume create --driver local --name minio-data --opt type=none --opt device=$(pwd) --opt o=uid=root,gid=root --opt o=bind
```


## 2. Step
Running the docker image container
```
docker run --name minio -p 9000:9000 -p 9001:9001 --env MINIO_ROOT_USER="admin_user" --env MINIO_ROOT_PASSWORD="password" --volume minio-data:/data bitnami/minio:latest
```

check at (http://localhost:9001)[http://localhost:9001] with your username and password

create your bucket and policy or leave it by default. go to access key and create a new access key of your bucket. copy and past at your .evn (Enviroment variable field) at
MINIO_ACCESS_KEY and MINIO_ACCESS_SECRET and save it. 


# Note here is a glitch with this deployment you can't run minio in daemon mode. after closing your console your container get close and created bucket and access keys are removed.