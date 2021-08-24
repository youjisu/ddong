import { collectExternalReferences } from '@angular/compiler';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { FIREBASE_CONFIG } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private activatedRoute: ActivatedRoute
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

        this.activatedRoute.queryParams.subscribe(params => {
          localStorage.setItem('rId', params['rId']);
          (async () => {
            if (params['rId'] != null || params['rId'] != undefined) {
              if ((await firebase.default.database().ref('rooms/' + params['rId']).once('value')).val() != null) {
                firebase.default.database().ref('rooms/' + params['rId'] + '/users/' + localStorage.uId).set(true);
                firebase.default.database().ref('rooms/' + params['rId'] + '/users/' + localStorage.uId).onDisconnect().set(false);
              }
              else {
                localStorage.setItem('rId', null);
              }
            }
            else {
              localStorage.setItem('rId', null);
            }
          })();
        });
      } else { }
    });
  }

  initializeApp() {

    firebase.default.initializeApp(FIREBASE_CONFIG);
  }
}
