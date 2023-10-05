# Redis 

## Docker 

Docker image over [here](https://hub.docker.com/_/redis)

## Running redis

```
docker network create redis
docker run -it --rm --name redis --net redis -p 6379:6379 redis:6.0-alpine
```

## Configuration

Redis configuration documentation [here](https://redis.io/topics/config)

Starting Redis with a custom config

```
cd .\rollout\clusters\redis\
docker run -it --rm --name redis --net redis -v ${PWD}/config:/etc/redis/ redis:6.0-alpine redis-server /etc/redis/redis.conf

```

## Security

Redis should not be exposed to public.
Always use a strong password in `redis.conf`

```
requirepass SuperSecretSecureStrongPass
```


## Persistence

Redis Persistence Documentation [here](https://redis.io/topics/persistence)

```
docker volume create redis
cd .\rollout\clusters\redis\
docker run -it --rm --name redis --net redis -v ${PWD}/config:/etc/redis/ -v redis:/data/  redis:6.0-alpine redis-server /etc/redis/redis.conf

```

# OR By Using Redis Stack

```
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 -p 10001:6379 -p 13333:8001 -v ${pwd}/cluster/config/redis.conf:/etc/redis -v ${pwd}/cluster/config/local-redis-stack.conf:/redis-stack.conf -v redis-volume:/data/  -e REDIS_ARGS="--requirepass redis-stack-password" -e REDIS_ARGS="--save 60 1000 --appendonly yes" -e REDISTIMESERIES_ARGS="RETENTION_POLICY=20" -e REDISEARCH_ARGS="MAXSEARCHRESULTS 10" redis/redis-stack:latest

```

### Environment variables
To pass in arbitrary configuration changes, you can set any of these environment variables:

- REDIS_ARGS: extra arguments for Redis

- REDISEARCH_ARGS: arguments for RediSearch

- REDISJSON_ARGS: arguments for RedisJSON

- REDISGRAPH_ARGS: arguments for RedisGraph

- REDISTIMESERIES_ARGS: arguments for RedisTimeSeries

- REDISBLOOM_ARGS: arguments for RedisBloom

For example, here's how to use the REDIS_ARGS environment variable to pass the requirepass directive to Redis:

``` 
docker run -e REDIS_ARGS="--requirepass redis-stack" redis/redis-stack-server:latest
```
Here's how to set a retention policy for RedisTimeSeries:

``` 
docker run -e REDISTIMESERIES_ARGS="RETENTION_POLICY=20" redis/redis-stack-server:latest
```

# How to Use SSL/TLS With Redis Enterprise

Redis databases using SSL (Secure Sockets Layer). In the production environment, it is always recommended to use SSL to protect the data that moves between various computers (client applications and Redis servers). Transport Level Security (TLS) guarantees that only allowed applications/computers are connected to the database, and also that data is not viewed or altered by a middle man process.

You can secure the connections between your client applications and Redis cluster using:

- One-Way SSL: the client (your application) get the certificate from the server (Redis cluster), validate it, and then all communications are encrypted
- Two-Way SSL: (aka mutual SSL) here both the client and the server authenticate each other and validate that both ends are trusted.
we will focus on the Two-Way SSL, and using Redis Enterprise.

## Prerequisites

### Step 1. Run a Redis server

redis-cli -p 12000 -a secretdb01 INFO SERVER

### Step 2. Get the Certificate from Redis Cluster

Assuming that you have an access to the Redis Enterprise Cluster, you need to access the nodes to retrieve the certificate (that is a self-generated one by default).

The cluster certificate is located at: /etc/opt/redislabs/proxy_cert.pem.

Next, copy the cluster certificate on each client machine; note that once it is done you can use this certificate to connect using "One-Way SSL", but this is not just the purpose of this article.

In this tutorial, we will be using Docker to copy the certificate.

```
docker cp redis-node1:/etc/opt/redislabs/proxy_cert.pem ./certificates
```
### Step 3. Generate a New Client Certificate

Using the Two-Way SSL, you need to have a certificate for the client that will be used by Redis database proxy to trust the client. In this tutorial, we will use a self-signed certificate using OpenSSL. We will be creating a certificate for an application named app_001. Please note that you can create as many certificates as you want, or reuse this one for all servers/applications.

Open a terminal and run the following commands:

``` 

openssl req \
  -nodes \
 -newkey rsa:2048 \
 -keyout client_key_app_001.pem \
 -x509 \
 -days 36500 \
 -out client_cert_app_001.pem
```
This command generates a new client key (client_key_001.pem) and certificate (client_cert_001.pem) with no passphrase

### Step 4. Configure the Redis Database

The next step is to take the certificate and add it to the database you want to protect.

Let's copy the certificate and paste it into the Redis Enterprise Web Console.

Copy the certificate in your clipboard:

Mac:

``` 
pbcopy < client_cert_app_001.pem
```

Linux:

``` 
 xclip -sel clip < client_cert_app_001.pem
```

Windows:

``` 
clip < client_cert_app_001.pem
```

Go to the Redis Enterprise Admin Web Console and enable TLS on your database:

1. Edit the database configuration
2. Check TLS
3. Select "Require TLS for All communications"
4. Check "Enforce client authentication"
5. Paste the certificate in the text area
6. Click the Save button to save the certificate
7. Click the Update button to save the configuration.

```
redis-cli -p 12000 -a secretdb01 INFO SERVER
(error) ERR unencrypted connection is prohibited
```

### Step 5. Connect to the Database using the Certificate
In all these examples, you will be using a "self-signed" certificate, so that you don't need to check the validity of the hostname. You should adapt the connections/TLS information based on your certificate configuration.

### Step 5.1 Using Redis-CLI
To connect to a SSL protected database using redis-cli you have to use stunnel.

Create a stunnel.conf file with the following content:

```
cert = /path_to/certificates/client_cert_app_001.pem
key = /path_to/certificates/client_key_app_001.pem
cafile = /path_to/certificates/proxy_cert.pem
client = yes

[redislabs]
accept = 127.0.0.1:6380
connect = 127.0.0.1:12000

Start stunnel using the command

stunnel ./stunnel.conf
```

This will start a process that listen to port 6380 and used as a proxy to the Redis Enterprise database on port 12000.

``` 
redis-cli -p 6380 -a secretdb01 INFO SERVER
```

### Step 5.2 Using Python
Using Python, you have to set the SSL connection parameters:

``` 
# !/usr/local/bin/python3

import redis
import pprint

try:
  r = redis.StrictRedis(
    password='secretdb01',
    decode_responses=True,
    host='localhost',
    port=12000,
    ssl=True,
    ssl_keyfile='./client_key_app_001.pem',
    ssl_certfile='./client_cert_app_001.pem',
    ssl_cert_reqs='required',
    ssl_ca_certs='./proxy_cert.pem',
    )

  info = r.info()
  pprint.pprint(info)

except Exception as err:
  print("Error connecting to Redis: {}".format(err))
```

More information in the documentation ["Using Redis with Python"](https://developer.redis.com/develop/python/).

### Step 5.3 Using Node.JS
For Node Redis, use the TLS library to configure the client connection:

``` 
var redis = require('redis');
var tls = require('tls');
var fs = require('fs');

var ssl = {
  key: fs.readFileSync(
    '../certificates/client_key_app_001.pem',
    {encoding: 'ascii'},
  ),
  cert: fs.readFileSync(
    '../certificates/client_cert_app_001.pem',
    {encoding: 'ascii'},
  ),
  ca: [fs.readFileSync('../certificates/proxy_cert.pem', {encoding: 'ascii'})],
  checkServerIdentity: () => {
    return null;
  },
};

var client = redis.createClient(12000, '127.0.0.1', {
  password: 'secretdb01',
  tls: ssl,
});

client.info('SERVER', function (err, reply) {
  console.log(reply);
});
```

More information in the documentation ["Using Redis with Node.js"](https://developer.redis.com/develop/node).

### Step 5.4 Using Java
In Java, to be able to connect using SSL, you have to install all the certificates in the Java environment using the [][keytool](https://docs.oracle.com/en/java/javase/11/tools/keytool.html) utility.

Create a keystore file that stores the key and certificate you have created earlier:

``` 
openssl pkcs12 -export \
  -in ./client_cert_app_001.pem \
  -inkey ./client_key_app_001.pem \
  -out client-keystore.p12 \
  -name "APP_01_P12"
```

As you can see the keystore is used to store the credentials associated with you client; it will be used later with the -javax.net.ssl.keyStore system property in the Java application.

In addition to the keys tore, you also have to create a trust store, that is used to store other credentials for example in our case the redis cluster certificate.

Create a trust store file and add the Redis cluster certificate to it

``` 
keytool -genkey \
  -dname "cn=CLIENT_APP_01" \
  -alias truststorekey \
  -keyalg RSA \
  -keystore ./client-truststore.p12 \
  -keypass secret
  -storepass secret
  -storetype pkcs12
```

``` 
keytool -import \
  -keystore ./client-truststore.p12 \
  -file ./proxy_cert.pem \
  -alias redis-cluster-crt
```

The trustore will be used later with the -javax.net.ssl.trustStore system property in the Java application.

You can now run the Java application with the following environment variables:

``` 
java -Djavax.net.ssl.keyStore=/path_to/certificates/java/client-keystore.p12 \
-Djavax.net.ssl.keyStorePassword=secret \
-Djavax.net.ssl.trustStore=/path_to/certificates/java/client-truststore.p12 \
-Djavax.net.ssl.trustStorePassword=secret \
-jar MyApp.jar
```

For this example and simplicity, I will hard code these property in the Java code itself:

``` 
import redis.clients.jedis.Jedis;
import java.net.URI;

public class SSLTest {

    public static void main(String[] args) {

        System.setProperty("javax.net.ssl.keyStore", "/path_to/certificates/client-keystore.p12");
        System.setProperty("javax.net.ssl.keyStorePassword", "secret");

        System.setProperty("javax.net.ssl.trustStore","/path_to/certificates/client-truststore.p12");
        System.setProperty("javax.net.ssl.trustStorePassword","secret");

        URI uri = URI.create("rediss://127.0.0.1:12000");

        Jedis jedis = new Jedis(uri);
        jedis.auth("secretdb01");


        System.out.println(jedis.info("SERVER"));
        jedis.close();
    }

}
```


Run our application

```
docker run -it --net redis `
-e REDIS_HOST=redis `
-e REDIS_PORT=6379 `
-e REDIS_PASSWORD="SuperSecretSecureStrongPass" `
-p 80:80 `
saurabharch/rollout:latest

```
