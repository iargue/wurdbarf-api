(function() {
  var myWurdBarf;

  myWurdBarf = function($http) {
    return {
      key: null,
      bf: null,
      token: null,
      gameToken: null,
      matchToken: null,
      register: {},
      matchmaking: {},
      cipherLogin: null,
      cipherRegister: null,
      cipherMatchmaking: null,
      cipherMatch: null,
      gameData: null,
      userData: {},
      promise: null,
      server: "http://api.raedixgames.com",
      initialize: function(rootObject) {
        rootObject.promise = $http.get(rootObject.server + "/requestkey").success(function(data) {
          console.log(data.key);
          return rootObject.bf = new Blowfish(data.key);
        });
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        return $http.defaults.transformRequest = [
          function(data) {
            /*
            The workhorse; converts an object to x-www-form-urlencoded serialization.
            @param {Object} obj
            @return {String}
            */

            var param;
            param = function(obj) {
              var fullSubName, i, innerObj, name, query, subName, subValue, value;
              query = "";
              name = void 0;
              value = void 0;
              fullSubName = void 0;
              subName = void 0;
              subValue = void 0;
              innerObj = void 0;
              i = void 0;
              for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                  i = 0;
                  while (i < value.length) {
                    subValue = value[i];
                    fullSubName = name + "[" + i + "]";
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + "&";
                    ++i;
                  }
                } else if (value instanceof Object) {
                  for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + "[" + subName + "]";
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + "&";
                  }
                } else {
                  if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
                  }
                }
              }
              if (query.length) {
                return query.substr(0, query.length - 1);
              } else {
                return query;
              }
            };
            if (angular.isObject(data) && String(data) !== "[object File]") {
              return param(data);
            } else {
              return data;
            }
          }
        ];
      },
      sendLogin: function(rootObject) {
        return rootObject.promise = $http.post(rootObject.server + "/login/", {
          encdata: rootObject.cipherLogin
        }).success(function(data) {
          var err;
          console.log(data);
          data = rootObject.bf.decrypt(data.encdata);
          try {
            data = JSON.parse(data);
          } catch (_error) {
            err = _error;
            data += "}";
            data = JSON.parse(data);
          }
          if (data.result === "Fail") {
            return console.log(data.error);
          } else {
            rootObject.token = data.token;
            return console.log(rootObject.token);
          }
        });
      }
    };
  };

}).call(this);
