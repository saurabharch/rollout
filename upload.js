var Express = require("express");
var Multer = require("multer");
var Minio = require("minio");
var BodyParser = require("body-parser");
var app = Express();

app.use(BodyParser.json({limit: "4mb"}));

var minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'Q3AM3UQ867SPQQA43P2F',
    secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

app.post("/upload", Multer({storage: Multer.memoryStorage()}).single("upload"), function(request, response) {
    minioClient.putObject("rollout", request.file.originalname, request.file.buffer, function(error, etag) {
        if(error) {
            return console.log(error);
        }
        response.send(request.file);
    });
});

app.post("/uploadfile", Multer({dest: "./uploads/"}).single("upload"), function(request, response) {
    minioClient.fPutObject("rollout", request.file.originalname, request.file.path, "application/octet-stream", function(error, etag) {
        if(error) {
            return console.log(error);
        }
        response.send(request.file);
    });
});

app.get("/download", function(request, response) {
    minioClient.getObject("rollout", request.query.filename, function(error, stream) {
        if(error) {
            return response.status(500).send(error);
        }
        stream.pipe(response);
    });
});

minioClient.bucketExists("rollout", function(error) {
    if(error) {
        return console.log(error);
    }
    var server = app.listen(3000, function() {
        console.log("Listening on port %s...", server.address().port);
    });
});