import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';

import setRoutes from './routes';

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setRoutes(app);
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

if (!module.parent) {
  app.listen(app.get('port'), () => console.log(`Angular app listening on port ${app.get('port')}`));
}

export { app };
