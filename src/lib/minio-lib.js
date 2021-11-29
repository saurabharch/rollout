var Minio = require('minio')
const multer = require('multer');
const uuid = require('uuid/v4');
const { getRedisConnectionInstance } = require('../common/redis');

const redisInstance = await getRedisConnectionInstance();

export const minioClient = new Minio.Client ({
    endPoint: process.env.MINIO_ENDPOIN,
    port: process.env.MINIO_PORT,
    useSSL: process.env.MINIO_SSL_STATUS,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    region: process.env.MINIO_REGION, 
    transport: process.env.MINIO_TRANSPORT, 
    sessionToken:'', 
    partSize:  process.env.MINIO_PART_SIZE || '100mb'
  });

  export var createBucket = async (req,res, next) => {
      await minioClient.bucketExists(req.body.bucketname, function(err, exists) {
        if (err) {
        return console.log(err)
        }

        if (!exists) {
             await minioClient.makeBucket(req.body.bucketname, function(e) {
                if (e) {
                    return res.status(502).json({
                        message: e.message
                    })
                }
                    return res.status(200).json({
                        message: `successfully added ${req.body.bucketname}`
                    })
                })
            }
    });

    
        next();
        // // Create a bucket with object locking enabled.
        // minioClient.makeBucket('mybucket', 'us-east-1', { ObjectLocking:true }, function(err) {
        // if (err) return console.log('Error creating bucket with lock .', err)
        // console.log('Bucket created successfully in "us-east-1" and enabled object lock')
        // })
  }

// List all buckets by bucketname.
  export var getListOfBucket = async (req,res,next) => {
     await minioClient.listBuckets(function(e, buckets) {
        if (e) {return res.status(502).json({message: e.message})}

        return res.status(200).json({list:JSON.stringify(buckets)})
    })
    next();
  }

// List all object paths in bucket  by bucketname.
  export var getAllobjectsByBucketName = async (req,res,next) => {
     var objectsStream = await minioClient.listObjectsV2(req.body.bucketname, '', true,'')
        objectsStream.on('data', function(obj) {
          return   res.status(200).json({
                 message: obj
             })
        })
        objectsStream.on('error', function(e) {
        return res.status(502).json({
           message: e.message
       })
    })
    next();
  }

  // Remove a bucket by name.
  // This operation will only work if your bucket is empty.
export var removeBucketByName = (req,res,next) => {
    
     minioClient.removeBucket(req.body.bucketname, function(e) {
     if (e) {
         return res.status(502).json({message: e.message})
     }
        return res.status(200).json({message: `${req.body.bucketname} successfully remove from bucketlists`})
     })
     next();
}

export var uploadObject = () => (multer({storage: multer.memoryStorage()}).single("file"), async (req, res, next) => {
	if (req.file) {
		var originalname = req.file.originalname.split(' ');
		const fileName = originalname.join('_');
		try {
			await minioClient.putObject(req.body.bucketname, fileName, req.file.buffer);

			// get url
			const url = await minioClient.presignedGetObject(req.body.bucketname, fileName);
            return res.status(200).json({url})
		//	var id = uuid();
			// link valid for 3 minutes (180 seconds)
			// save link to redis
		// 	redisInstance.setex(id, 180, url, (err, reply) => {
		// 		if (err) {
		// 			return res.json({'success': false, 'message': err});
		// 		}
		// 		return res.json({'success': true, 'message': id});
		// 	});
		} catch(err) {
			return res.json({'success': false, 'message': err});
		}
	}
});