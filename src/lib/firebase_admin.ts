import admin from 'firebase-admin';
import {config} from "dotenv";

config();

try {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG || "{}")),
        storageBucket: JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || "{}")["storageBucket"]
    });

    admin.firestore().settings({
        timestampsInSnapshots: true,
        ignoreUndefinedProperties: true
    })
} catch (error: any) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/u.test(error.message)) {
        console.error('Firebase admin initialization error', error.stack)
    }
}

export class FirebaseAdmin {

    static firestore() {
        return admin.firestore();
    }

    static firestoreInst() {
        return admin.firestore;
    }

    static serverTimestamp() {
        return admin.firestore.FieldValue.serverTimestamp();
    }

    static auth() {
        return admin.auth();
    }

    static async getCollectionArray(collection: string) {
        const querySnapshot = await FirebaseAdmin.firestore().collection(collection).get();
        let result: any[] = []
        querySnapshot.forEach((doc) => {
            result.push({ ...doc.data(), doc_id: doc.id })
        });
        return result;
    }

    static bucket() {
        return admin.storage().bucket();
    }

    static async getPublicUrl(file: any) {
        let signedUrls = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        });

        return signedUrls?.length ? signedUrls[0] : undefined;
    }

    static async verifyReq(req: any) {
        return await FirebaseAdmin.auth().verifyIdToken(req.headers.authorization);
    }

}