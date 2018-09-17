import * as express from 'express';
import FileUploadCtrl from './controllers/file-upload';

export default function setRoutes(app) {

  const router = express.Router();
  const fileCtrl = new FileUploadCtrl();

  //file upload 
  router.route('/upload').post(fileCtrl.upload);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
