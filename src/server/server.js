import { config } from 'dotenv';
import Hapi from '@hapi/hapi';
import { routes } from './routes.js';
import { loadModel } from '../services/loadModel.js';
import { InputError } from '../exceptions/InputError.js';

const main = async () => {
  const server = Hapi.server({
    port: 5000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', (req, h) => {
    const res = req.response;

    // if (res instanceof InputError) {
    //   const newRes = h.response({
    //     status: 'fail',
    //     message: `${res.message} Silakan gunakan foto lain.`,
    //   });
    //   newRes.code(res.output.statusCode);
    //   return newRes;
    // }

    if (res.isBoom && res.output.statusCode === 413) {
      const newRes = h.response({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
      newRes.code(413);
      return newRes;
    }
    // if (res.isBoom) {
    //   const newRes = h.response({
    //     status: 'fail',
    //     message: res.message,
    //   });
    //   newRes.code(res.output.statusCode);
    //   return newRes;
    // }

    if (res instanceof InputError || (res.isBoom && res.output.statusCode === 400)) {
      // const statusCode =res instanceof InputError ? res.statusCode : res.output.statusCode;
      const newRes = h.response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
      newRes.code(400);
      return newRes;
    }

    return h.continue;
    
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
};

main();
