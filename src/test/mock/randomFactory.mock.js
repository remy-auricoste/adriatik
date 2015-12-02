  var socketMockFactory = function(source) {
    return {
      mockReceive: function(source, message) {
        this.listener && this.listener({
          message: message,
          source: source
        })
      },
      send: function(message) {
        this.mockReceive(source, message);
      },
      addListener: function(fonction) {
        this.listener = fonction;
      },
      getId: function() {
        return source;
      }
    }
  }
  var randomSocketMockFactory = function(source) {
    return {
      hashSocket: socketMockFactory(source),
      valueSocket: socketMockFactory(source)
    }
  }
  var hashServiceMock = function(value) {
    return value+"";
  }

  var randomSocketMock = randomSocketMockFactory("default");
  var randomFactoryInstance = randomFactory(qPlusInstance, randomSocketMock, hashServiceMock, StateSync);
