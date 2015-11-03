!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Meta=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Collections = {
    foreach: function(object, fonction) {
        if (object instanceof Array) {
            for (var i=0;i<object.length;i++) {
                var stop = fonction(object[i], i);
                if (stop) {
                    break;
                }
            }
        } else {
            for (var key in object) {
                var stop = fonction(object[key], key);
                if (stop) {
                    break;
                }
            }
        }
    },
    forall: function (object, fonction) {
        var result = true;
        Collections.foreach(object, function (value, key) {
            var success = fonction(value, key);
            if (!success) {
                result = false;
                return true;
            }
        });
        return result;
    },
    find: function (object, fonction) {
        var index = Collections.findIndex(object, fonction);
        if (index === undefined) {
            return undefined;
        }
        return object[index];
    },
    findIndex: function (object, fonction) {
        var result;
        Collections.foreach(object, function(value, key) {
            var value = object[key];
            if (fonction(value, key)) {
                result = key;
                return true;
            }
        });
        return result;
    },
    map: function (object, fonction) {
        if (Collections.isArray(object)) {
            var result = [];
            Collections.foreach(object, function (value, key) {
                result.push(fonction(value, key));
            });
            return result;
        } else {
            var result = {};
            Collections.foreach(object, function (value, key) {
                result[key] = fonction(value, key);
            });
            return result;
        }
    },
    fold: function(object, init, fonction) {
        var result = init;
        Collections.foreach(object, function(value, key) {
            result = fonction(result, value, key);
        });
        return result;
    },
    reduce: function(object, fonction) {
        var result;
        var isFirst = true;
        Collections.foreach(object, function (value) {
            result = isFirst ? value : fonction(result, value);
            isFirst = false;
        });
        return result;
    },
    sum: function(object) {
        return Collections.reduce(object, function(value1, value2) {
            return value1 + value2;
        });
    },
    filter: function (object, fonction) {
        var isArray = Collections.isArray(object);
        var result = isArray ? [] : {};
        var transform = isArray ? function (value, key) {
            if (fonction(value, key)) {
                result.push(value);
            }
        } : function (value, key) {
            if (fonction(value, key)) {
                result[key] = value;
            }
        };
        Collections.foreach(object, transform);
        return result;
    },
    partition: function (object, fonction) {
        var isArray = Collections.isArray(object);
        var resultOK = isArray ? [] : {};
        var resultKO = isArray ? [] : {};
        var transform = isArray ? function (value) {
            var added = fonction(value) ? resultOK : resultKO;
            added.push(value);
        } : function (value, key) {
            var added = fonction(value) ? resultOK : resultKO;
            added[key] = value;
        };
        Collections.foreach(object, transform);
        return [resultOK, resultKO];
    },
    shuffle: function (array) {
        var result = [].concat(array);
        for (var j, x, i = result.length; i; j = Math.floor(Math.random() * i), x = result[--i], result[i] = result[j], result[j] = x);
        return result;
    },
    mkString: function (array, separateur, prefix, suffix) {
        if (!prefix) {
            prefix = "";
        }
        if (!suffix) {
            suffix = "";
        }
        if (!separateur) {
            separateur = "";
        }
        var result = "";
        Collections.foreach(array, function (value) {
            result += separateur + value;
        });
        result = result.substring(separateur.length);
        return prefix + result + suffix;
    },
    tuples: function(array1, array2, excludeIdentities) {
        var result = [];
        if (excludeIdentities) {
            Collections.foreach(array1, function(object1) {
                Collections.foreach(array2, function(object2) {
                    if (object1 !== object2) {
                        result.push([object1, object2]);
                    }
                });
            });
        } else {
            Collections.foreach(array1, function(object1) {
                Collections.foreach(array2, function(object2) {
                    result.push([object1, object2]);
                });
            });
        }
        return result;
    },
    isArray: function(object) {
        return typeof object === "object" && (object.length || object.length === 0);
    },
    flatten: function(array) {
        var self = Collections;
        var result = [];
        self.foreach(array, function(value) {
            if (self.isArray(value)) {
                result = result.concat(self.flatten(value));
            } else {
                result.push(value);
            }
        });
        return result;
    },
    reverse: function(array) {
        return array.reverse();
    },
    groupBy: function(object, fonction) {
        var result = {};
        var getGroup = function(key) {
            var group = result[key];
            if (!group) {
                group = [];
                result[key] = group;
            }
            return group;
        }
        Collections.foreach(object, function(value, key) {
            var groupKey = fonction(value, key);
            getGroup(groupKey).push(value);
        });
        return result;
    },
    min: function(object) {
        return Collections.reduce(object, Math.min);
    },
    max: function(object) {
        return Collections.reduce(object, Math.max);
    },
    size: function(object) {
        if (Collections.isArray(object)) {
            return object.length;
        } else {
            return Collections.fold(object, 0, function(result, value, key) {
                return result + 1;
            });
        }
    },
    last: function(arr) {
        return arr && arr.length ? arr[arr.length - 1] : null;
    },
    takeWhile: function(arr, fonction) {
        var index = Collections.findIndex(arr, function(item, index) {
            return !fonction(item, index);
        });
        if (index === undefined) {
            return arr;
        }
        return Collections.take(arr, index);
    },
    take: function(arr, nb) {
        if (!arr || !nb) {
            return [];
        }
        if (arr.length <= nb) {
            return arr;
        }
        return arr.slice(0, nb);
    },
    drop: function(arr, nb) {
        if (!arr || nb >= arr.length) {
            return [];
        }
        if (nb === 0) {
            return arr;
        }
        return arr.slice(nb);
    },
    toMap: function(arr) {
        var map = new Object();
        Collections.foreach(arr, function(item) {
            map[item] = 1;
        });
        return map;
    },
    uniq: function(arr) {
        var map = Collections.toMap(arr);
        var result = [];
        Collections.foreach(map, function(item, key) {
            result.push(key);
        });
        return result;
    },
    sortBy: function(arr, fonction) {
        var sortObjects = Collections.map(arr, function(item, index) {
            return {
                value: fonction(item, index),
                item: item
            };
        });
        sortObjects = sortObjects.sort(function(a, b) {
            return a.value > b.value ? 1 : -1;
        });
        return Collections.map(sortObjects, function(object) {
            return object.item;
        });
    }
};

module.exports = Collections;



},{}],2:[function(require,module,exports){
/* import Collections */ var Collections = require('./Collections');
/* import Wrapper */ var Wrapper = require('./Wrapper');

var Meta = {
    repeat: function (string, number) {
        var result = "";
        for (var i = 0; i < number; i++) {
            result += string;
        }
        return result;
    },
    addAttribute: function (object, key, value) {
        if (typeof object !== "object") {
            throw new Error("object " + object+" is of type "+typeof object);
        }
        if (object[key] !== undefined) {
            throw new Error("impossible to add attribute " + key);
        }
        object[key] = value;
    },
    declareClass: function(a,b) {return Meta.createClass(a,b)},
    createClass: function (name, template) {
        Meta.requireType(name, "string");
        Meta.requireType(template, "object");
        var partition = Collections.partition(template, function (value) {
            return typeof value != "function";
        });
        var attributes = partition[0];
        var methods = partition[1];

        var classe = function (params) {
            try {
                if (!params) {
                    params = {};
                }
                var self = this;
                Collections.foreach(attributes, function (valueTemplate, key) {
                    var value = params[key];
                    if (value !== undefined) {
                        try {
                            if (typeof valueTemplate === "string" && valueTemplate.length && valueTemplate !== "fct") {
                                Meta.requireType(value, "object");
                            } else {
                                Meta.requireType(value, valueTemplate == "fct" ? "function" : typeof valueTemplate);
                            }
                        } catch(err) {
                            err.message = "error in type of field "+key+" : "+err.message;
                            throw err;
                        }
                        Meta.addAttribute(self, key, value);
                    }
                });
                if (template.init && typeof template.init === "function") {
                    self.init();
                }
                if (classe.template._primary !== undefined) {
                  var key = self[classe.template._primary];
                  classe._all[key] = self;
                }
            } catch(e) {
                e.message = "error when creating new instance of "+name+". template="+Meta.format(template)+" : "+e.message;
                throw e;
            }
        };

        classe.subClass = function(name, template) {
            var subClass = Meta.createClass(name, template);
            subClass = Meta.extend(subClass, classe);
            return subClass;
        };
        classe.template = template;
        Meta.addAttribute(classe.prototype, "clone", function () {
            return new classe(this);
        });
        Meta.addAttribute(classe.prototype, "withAtt", function (attName, value) {
            var result = this.clone();
            result[attName] = value;
            return result;
        });
        classe._all = {};
        classe.fromObject = function (object) {
            if (classe.template._primary !== undefined) {
              var key = object[classe.template._primary];
              var instance = classe._all[key];
              if (instance) {
                return instance;
              }
            }
            var instance = new classe(object);
            Meta.foreach(attributes, function(templateValue, key) {
                if (!instance[key]) {
                    return;
                }
                if (typeof templateValue === "string" && templateValue.length) {
                    var subClass = Meta.classes[templateValue];
                    instance[key] = subClass.fromObject(instance[key]);
                } else if(templateValue.constructor === Array && typeof templateValue[0] === "string" && templateValue[0].length) {
                    var subClass = Meta.classes[templateValue[0]];
                    instance[key] = Collections.map(instance[key], function(item) {
                        return subClass.fromObject(item);
                    });
                }
            })
            return new classe(instance);
        };
        if (name) {
            classe.prototype.className = name;
            classe.className = name;
            Meta.classes[name] = classe;
        }
        Collections.foreach(methods, function (value, key) {
            Meta.addAttribute(classe.prototype, key, value);
        });
        return classe;
    },
    mixObjects: function(object1, object2) {
        var result = {};
        Meta.foreach(object1, function(value, key) {
            result[key] = value;
        });
        Meta.foreach(object2, function(value, key) {
            if (typeof value === "function" && typeof result[key] === "function") {
                result[key] = Meta.reduceFct(value, result[key]);
            } else if (typeof value === "function" && result[key] === "fct") {
                result[key] = value;
            } else if (typeof result[key] === "function" && value === "fct") {
                // do nothing
            } else {
                Meta.addAttribute(result, key, value);
            }
        });
        return result;
    },
    copy: function(dest, object) {
        Meta.foreach(object, function(value, key) {
            dest[key] = value;
        });
        return dest;
    },
    extend: function (dest, parents) {
        if (!(parents instanceof Array)) {
            parents = [parents];
        }
        var resultTemplate = dest.template;
        Collections.foreach(parents, function (parent) {
            console.log(dest.className + " extends " + parent.className);
            resultTemplate = Meta.mixObjects(resultTemplate, parent.template);
        });
        return Meta.createClass(dest.className, resultTemplate);
    },
    require: function(cond, message) {
        if (!cond) {
            if (typeof message === "function") {
                message = message();
            }
            throw new Error(message);
        }
    },
    requireType: function(object, type) {
        Meta.require(typeof object == type, function() {return "typeof exception. expected "+type+". found "+typeof object});
    },
    format: function(object) {
        try {
            return JSON.stringify(object, null, 2);
        } catch(e) {
            return Collections.foreach(object, function(value, key) {
                return key;
            });
        }
    },
    reduceFct: function(fct1, fct2) {
        return function(a,b,c,d,e,f) {
            var result = fct1.bind(this)(a,b,c,d,e,f);
            return fct2.bind(this)(a,b,c,d,e,f);
        }
    }
};

Meta.classes = {};

Collections.foreach(Collections, function(value, name) {
    Meta[name] = Collections[name];
});

Meta.box = function(object) {
    return new Wrapper(object);
}

Meta.Wrapper = Wrapper;

Meta.expose = function() {
    Collections.foreach(Collections, function(fonction, name) {
        Array.prototype[name] = function (arg1, arg2, arg3) {
            return Collections[name](this, arg1, arg2, arg3);
        };
    });
}

module.exports = Meta;



},{"./Collections":1,"./Wrapper":3}],3:[function(require,module,exports){
/* import Collections */ var Collections = require('./Collections');

var Wrapper = function (object) {
    this.object = object;
};
var wrap = function (name) {
    Wrapper.prototype[name] = function (arg1, arg2, arg3) {
        var self = this;
        return new Wrapper(Collections[name](self.object, arg1, arg2, arg3));
    };
};
Wrapper.prototype.unbox = function () {
    return this.object;
};

Collections.foreach(Collections, function(fonction, name) {
    wrap(name);
});

var boxFct = function() {
    return new Wrapper(this);
}

//Array.prototype.box = boxFct;
//Object.prototype.box = boxFct;

module.exports = Wrapper;

},{"./Collections":1}]},{},[2])(2)
});