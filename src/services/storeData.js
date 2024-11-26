import { Firestore } from '@google-cloud/firestore';

const storeData = async (id, data) => {
  const db = new Firestore();

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
};

const getData = async () => {
  const db = new Firestore();
  const predictRef = db.collection('predictions');
  const snapshot = await predictRef.get();
  return snapshot;
}

export { storeData, getData };
