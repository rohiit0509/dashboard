import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadVideo = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `videos/${file.name}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};
