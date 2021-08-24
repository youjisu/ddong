// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDPkO71TbvKOZliRA9qk93BXRR4fIWX5I4",
  authDomain: "ddong-b30bf.firebaseapp.com",
  databaseURL: "https://ddong-b30bf-default-rtdb.firebaseio.com",
  projectId: "ddong-b30bf",
  storageBucket: "ddong-b30bf.appspot.com",
  messagingSenderId: "728551012246",
  appId: "1:728551012246:web:8a64d7f826056f98760fb7",
  measurementId: "G-LFHTF05MPQ"
};

export const snapshotToArray = snapshot => {
  let returnArray = []
  snapshot.forEach(element => {
      let item = element.val()
      item.key = element.key
      returnArray.push(item)
  });
  return returnArray
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
