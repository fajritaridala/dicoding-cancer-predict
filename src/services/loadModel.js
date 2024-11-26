import tf from '@tensorflow/tfjs-node';

const loadModel = async () => {
  return tf.loadGraphModel('https://storage.googleapis.com/storage-model/submissions-model/model.json');
};

export { loadModel };
