const admin = require('firebase-admin');

// Ensure you have valid credentials in your environment before initializing
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log('Firebase initialized');
  } else {
    console.warn('Firebase initialization skipped: Missing environment variables.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

module.exports = admin;
