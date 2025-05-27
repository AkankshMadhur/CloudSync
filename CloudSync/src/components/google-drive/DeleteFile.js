import { storage, database } from "../../firebase";

export async function DeleteFile(file) {
  try {
    // Delete file from Firebase Storage
    const storageRef = storage.refFromURL(file.url);
    await storageRef.delete();

    // Delete file record from Firestore
    await database.files.doc(file.id).delete();
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error; // re-throw so caller can handle the error
  }
}
