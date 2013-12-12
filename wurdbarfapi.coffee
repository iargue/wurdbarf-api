myWurdBarf = ($http) ->
  key: null
  bf: null
  token: null
  gameToken: null
  matchToken: null
  register: {}
  matchmaking: {}
  cipherLogin: null
  cipherRegister: null
  cipherMatchmaking: null
  cipherMatch: null
  gameData: null
  userData: {}
  promise: null
  server: "http://api.raedixgames.com"
  
  initialize: (rootObject) ->
    rootObject.promise = $http.get(rootObject.server + "/requestkey").success((data) ->
      console.log data.key
      rootObject.bf = new Blowfish(data.key)
    )
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"
    $http.defaults.transformRequest = [(data) ->
      
      ###
      The workhorse; converts an object to x-www-form-urlencoded serialization.
      @param {Object} obj
      @return {String}
      ###
      param = (obj) ->
        query = ""
        name = undefined
        value = undefined
        fullSubName = undefined
        subName = undefined
        subValue = undefined
        innerObj = undefined
        i = undefined
        for name of obj
          value = obj[name]
          if value instanceof Array
            i = 0
            while i < value.length
              subValue = value[i]
              fullSubName = name + "[" + i + "]"
              innerObj = {}
              innerObj[fullSubName] = subValue
              query += param(innerObj) + "&"
              ++i
          else if value instanceof Object
            for subName of value
              subValue = value[subName]
              fullSubName = name + "[" + subName + "]"
              innerObj = {}
              innerObj[fullSubName] = subValue
              query += param(innerObj) + "&"
          else query += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&"  if value isnt `undefined` and value isnt null
        (if query.length then query.substr(0, query.length - 1) else query)

      (if angular.isObject(data) and String(data) isnt "[object File]" then param(data) else data)
    ]


  sendLogin: (rootObject) ->
    rootObject.promise = $http.post(rootObject.server + "/login/",
      encdata: rootObject.cipherLogin
    ).success((data) ->
      console.log data
      data = rootObject.bf.decrypt(data.encdata) # decrypts encdata and makes it the default data object
      try
        data = JSON.parse(data)
      catch err
        data += "}"
        data = JSON.parse(data)
      if data.result is "Fail"
        console.log data.error
      else
        rootObject.token = data.token
        console.log rootObject.token
    )

