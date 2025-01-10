// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  update: "http://emops.com.br/econtrol/app/update.xml",
  //pi_webservice: "https://emops.com.br/world/webservice-cod/",
  // api_webservice: "http://167.99.185.182:3000/",
  api_webservice: "http://192.168.0.10:3333/",

  maps_api_key: "AIzaSyD5oy_vcs8dd6q8a2kqAtz1jwrOt082Kr0",
  versao: "3.0.0"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
