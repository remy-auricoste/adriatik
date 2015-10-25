/** @ngInject */
function accountService() {
  'use strict';

  return {
    keys: ["email"],
    getData: function() {
      var result = {};
      this.keys.map(function(key) {
        result[key] = window.localStorage["account."+key];
      });
      return result;
    },
    save: function(account) {
      this.keys.map(function(key) {
        var value = account[key];
        window.localStorage["account."+key] = value;
      });
    }
  }
}
angular.module("adriatik").service("accountService", accountService);


