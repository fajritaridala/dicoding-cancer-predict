import tf from '@tensorflow/tfjs-node';
import { InputError } from '../exceptions/InputError.js';

const predictClassification = async (model, image) => {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    let suggestion, label;

    if (confidenceScore > 50) {
      label = 'Cancer';
      suggestion = 'Segera periksa ke dokter!';
    } else {
      label = 'Non-cancer';
      suggestion = 'Penyakit kanker tidak terdeteksi.';
    }

    return { label, suggestion };
  } catch (err) {
    throw new InputError(`Terjadi kesalahan input: ${err.message}`);
  }
};

export { predictClassification };
