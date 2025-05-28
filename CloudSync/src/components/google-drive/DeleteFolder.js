import { db, storage } from "../../firebase"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

export async function DeleteFolder(folder) {
  // 1. Delete all files in the folder
  const filesRef = db.collection("files").where("folderId", "==", folder.id)
  const fileSnapshot = await filesRef.get()

  for (const fileDoc of fileSnapshot.docs) {
    const fileData = fileDoc.data()
    const storageRef = storage.ref(fileData.path)
    await storageRef.delete()
    await fileDoc.ref.delete()
  }

  // 2. Delete the folder itself
  await db.collection("folders").doc(folder.id).delete()
}
