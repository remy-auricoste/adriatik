/** @ngInject */
function accountService() {
  'use strict';

  return {
    keys: ["email"],
    getData: function() {
      var account = {};
      this.keys.map(function(key) {
        account[key] = window.localStorage["account."+key];
      });
      if (!account.name) {
        account.name = "random"+Math.random();
      }
      return account;
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


