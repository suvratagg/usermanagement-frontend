// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  findUser : 'http://localhost:9000/find',
  findAllUsers : 'http://localhost:9000/findAll',
  addUser : 'http://localhost:9000/save',
  updateUser:'http://localhost:9000/updateUser',
  registerUser:'http://localhost:9000/registerUser',
  getUserName:'http://localhost:9000/findUsername',
  getPassword: 'http://localhost:9000/checkPassword',
  updateAdmin:'http://localhost:9000/updateAdmin',
  logout:'http://localhost:9000/logout'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
