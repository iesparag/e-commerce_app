import { Injectable } from '@angular/core';
import { gapi } from 'gapi-script';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  constructor() {}

  initializeClient() {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your Google Client ID
      });
    });
  }

  googleSignIn() {
    return new Promise<any>((resolve, reject) => {
      const authInstance = gapi.auth2.getAuthInstance();
      authInstance.signIn().then(
        (googleUser:any) => {
          resolve(googleUser);
        },
        (error:any) => {
          reject(error);
        }
      );
    });
  }
}
