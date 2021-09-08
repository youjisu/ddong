import * as firebase from 'firebase';

import { Component } from '@angular/core';
import { FIREBASE_CONFIG } from '../environments/environment'

import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private primengConfig: PrimeNGConfig
  ) {

    this.initializeApp();

    firebase.default.auth().signInAnonymously()
      .then(() => {
        console.log('sign in!');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log('sign error! ' + errorCode + ': ' + errorMessage);
      });
    firebase.default.auth().onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('uId', user.uid);
        console.log('uid-' + user.uid);
      } else { }
    });

    this.primengConfig.ripple = true;
  }

  initializeApp() {

    firebase.default.initializeApp(FIREBASE_CONFIG);
  }
}
