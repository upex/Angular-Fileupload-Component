
import * as dotenv from 'dotenv';
import AWS = require('aws-sdk');
import {ServiceConfigurationOptions} from 'aws-sdk/lib/service';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as async from 'async';
dotenv.load({ path: '.env' });
/** Use our env vars for setting credentials */
AWS.config.update({
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY
});
/** Create an S3 client setting the Endpoint to DigitalOcean Spaces */
const serviceConfigOptions : ServiceConfigurationOptions = {
    region: process.env.REGION,
    endpoint: process.env.END_POINT
};
const s3 = new AWS.S3(serviceConfigOptions);

export default class FileUploadCtrl {
   /*
   |--------------------------------------------------------------------------
   | Upload file
   |--------------------------------------------------------------------------
   */
    upload = (req, res) => {
        const upload = multer({
            storage: multerS3({
              s3: s3,
              bucket: process.env.BUCKET_NAME,
              acl: 'public-read',
              contentType: multerS3.AUTO_CONTENT_TYPE,
              metadata: (request, file, ab_callback) => {
                    ab_callback(null, {fieldname: file.fieldname});
              },
              key: (request, file, ab_callback) => {
                    const newFileName = Date.now() + "-" + file.originalname;
                    const fullPath = newFileName;
                    ab_callback(null, fullPath);
              }
            })
          }).array('uploads[]', 100);
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).send({ message: 'Error uploading file' });
            } else {
                /** Build up the paramters for the delete statement */
                let paramsS3Delete = {
                    Bucket: process.env.BUCKET_NAME,
                    Delete: {
                        Objects: []
                    }
                };
                /** Expand the array with all the keys that we have found in the ListObjects function call, so that we can remove all the keys at once after we have copied all the keys */
                async.each(req.files, (file) => {
                    paramsS3Delete.Delete.Objects.push({
                        Key: file.key
                    });
                });
                /** Copy all the source files to the destination */
                let productUrls = [];
                async.each(req.files, (file, cb) => {
                    const newkey = 'products/' + req.body.productId + '/' + file.key;
                    const params = {
                        Bucket: file.bucket,
                        ACL: file.acl,
                        ContentType: file.contentType,
                        CopySource: encodeURIComponent('/' +file.bucket +'/' + file.key),
                        Key: newkey
                    };
                    s3.copyObject(params, (copyErr, copyData) => {
                        if (copyErr) {
                            return res.status(400).send({ message: 'copyErr' })
                        } else {
                            productUrls.push(
                                {
                                    key: newkey,
                                    alt: file.originalname,
                                    title: req.body.title || '',  
                                    url: `https://${process.env.BUCKET_NAME}.${process.env.END_POINT}/${newkey}`
                                }
                            );
                        }
                        cb();
                    });
                }, (asyncError, asyncData) => {
                    /**All the requests for the file copy have finished */
                    if (asyncError) {
                        return res.status(400).send({ message: 'asyncError' });
                    } else {
                        /** Now remove the source files - that way we effectively moved all the content */
                        s3.deleteObjects(paramsS3Delete, (deleteError, deleteData) => {
                            if (deleteError) {
                                return res.status(400).send({ message: 'delete error' });
                            }
                            /** Any other database operation like updating a document field could be carried out here 
                             * For now we just return a success message.
                             * */   
                            res.status(200).send({
                                message: 'Success',
                                urls : productUrls
                            });
                        });
                    }
                });
            }
        });
    }
}
