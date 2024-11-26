import crypto from 'crypto';
import { predictClassification } from '../services/inferenceService.js';
import { storeData, getData } from '../services/storeData.js';

const predictHandler = async (req, h) => {
  const { image } = req.payload;
  const { model } = req.server.app;

  const { suggestion, label } = await predictClassification(model, image);

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  await storeData(id, data);

  const res = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data,
  });
  res.code(201);
  return res;
};

const getHistories = async (req, h) => {
  try {
    const snapshot = await getData();

    if (snapshot.empty) {
      return h
        .response({
          status: 'fail',
          message: 'Tidak ada histori yang ditemukan',
        })
        .code(404);
    }

    const dataHistory = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        history: {
          result: data.result,
          createdAt: data.createdAt,
          suggestion: data.suggestion,
          id: doc.id,
        },
      };
    });

    const res = h.response({
      status: 'success',
      data: dataHistory,
    });

    res.code(200);
    return res;

  } catch (err) {
    
    const res = h.response({
      status: 'fail',
      message: `Gagal mengambil histori: ${err.message}`,
    });
    res.code(500);
    return res;
  }
};

export { predictHandler, getHistories };
