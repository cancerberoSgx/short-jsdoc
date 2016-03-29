(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],2:[function(require,module,exports){
// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

// BINDING / post processing

//@class TypeBinding a datatype with an association between types names in source code and parsed class nodes. 
//It support generic types (recursive)
//@property {TypeBinding} type
//@property {Array<TypeBinding>} params - the generic types params array. For example the params for {Map<String,Apple>} is [StringBynding]
//@property {Object<String,TypeBinding>} properties - the properties literal object declaration binding, {a:A,b:B}
//@property {String} nativeTypeUrl the url for native type only


//@class JsDocMaker
//@method parseTypeString public, do a type binding @return {TypeBinding} the object binding to the original r
//eferenced AST node. Or null in case the given type cannot be parsed
//TODO: support multiple generics and generics anidation like in
JsDocMaker.prototype.parseTypeString = function(typeString, baseClass)
{
	if(!typeString || !baseClass)
	{ 
		return null;
	}
	//first remove the '{}'
	typeString = JsDocMaker.stringFullTrim(typeString); 
	var inner = /^{([^}]+)}$/.exec(typeString);
	if(!inner || inner.length<2)
	{
		return null;
	}
	typeString = inner[1]; 
	typeString = typeString.replace(/\s+/gi, '');
	var ret = this.parseSingleTypeString(typeString, baseClass); 
	// console.log('parseTypeString', ret)
	if(ret && ret.length===1)
	{
		return ret[0]; 
	}
	else
	{	
		return ret;	
	}	
}; 

// @method parseSingleTypeString @param {String} typeStr
JsDocMaker.prototype.parseSingleTypeString = function(typeStr, baseClass)
{
	var a = typeStr.split('|'), ret = [], self = this;

	_(a).each(function(typeString)
	{
	
		// is this a custom type, like #custom(1,2) ? 

		var regex = /^#(\w+)\(([^\()]+)\)/
		,	customType = regex.exec(typeString)
		,	type_binded = null
		,	type = null;

		if(customType && customType.length === 3)
		{
			var parserName = customType[1];
			var parserInput = customType[2]; 
			var parser = self.typeParsers[parserName]; 
			if(parser)
			{
				try 
				{
					var parsed = parser.parse(parserInput, baseClass);
					if(parsed)
					{
						// TODO bind type ? 
						//BIG PROBLEM HERE - this code executes at parsing time and here we are binding - do this binding in a post processing ast
						//TODO probably all this code should be moved to postprocessing ast phase and here we only dump the original type string.
						type_binded = self.bindParsedType(parsed, baseClass); 
						ret.push(type_binded); 
					}
				}
				catch(ex)
				{
					self.error('Invalid Custom Type: '+typeString, ', baseClass: ', (baseClass && baseClass.absoluteName)); 
				}				
			}
		}

		//it is a literal object type, like {a:String,b:Number}? 

		else if(typeString.indexOf(':')!==-1 && typeString.indexOf('#')===-1 ) //and is not a custom type #cus
		{
			type = null; 
			try
			{
				var props = JsDocMaker.parseType(typeString);
				type = {name: 'Object', properties: props}; 
				type_binded = self.bindParsedType(type, baseClass);
				ret.push(type_binded); 
			}
			catch(ex)
			{
				self.error('Invalid Type: '+typeString, ', baseClass: ', (baseClass && baseClass.absoluteName)); 
			}	
		}


		// it is a generic type like Array<String> ? 

		else if(typeString.indexOf('<')!==-1)
		{
			type = null;
			try
			{
				type = JsDocMaker.parseType(typeString);
				type_binded = self.bindParsedType(type, baseClass);
				ret.push(type_binded); 
			}
			catch(ex)
			{
				self.error('Invalid Type: '+typeString, ', baseClass: ', (baseClass && baseClass.absoluteName)); 
			}	
		}

		else
		{	
			ret.push(self.bindClass(typeString, baseClass));	
		}
	}) ; 

	return ret;
}; 

//@method bindParsedType merges the data of JsDocMaker.parseType with bindings of current jsdoc. recursive!
//@param {Object} typeObject @param {Object} baseClass @return {Object}
JsDocMaker.prototype.bindParsedType = function(typeObject, baseClass)
{
	var c = null
	,	out = typeObject
	,	self = this;

	if(typeObject && _(typeObject).isString())
	{
		c = this.bindClass(typeObject, baseClass); 
		out = {name: typeObject}; 
	}
	else if(typeObject && typeObject.name)
	{
		//recurse on params for generic types like M<T,K>!
		if(out.params)
		{			
			var new_params = [];

			c = this.bindClass(typeObject.name, baseClass); 

			_(out.params).each(function(param)
			{
				var new_param = self.bindParsedType(param, baseClass);
				new_params.push(new_param);
			}); 
			out.params = new_params;	
		}

		//recurse on properties for literal object type like name:String,config:Config
		if(out.properties)
		{
			var new_properties = {};
			_(out.properties).each(function(value, name)
			{
				var new_property = self.bindParsedType(value, baseClass);
				new_properties[name] = new_property; 
			}); 
			out.properties = new_properties;	
		}
	}
	if(c)
	{
		_(out).extend(c);
	}
	return out;
}; 



var PluginContainer = require('./plugin'); 



//POST PROCESSING

// @property {PluginContainer} beforeBindClassPlugins these plugins accept an object like 
// {name:name,baseClass:JsDocASTNode,jsdocmaker:JsDocMaker} and perform some modification to passed node:parsed instance.
// This is done just before a class name is binding to an actual AST class node.
JsDocMaker.prototype.beforeBindClassPlugins = new PluginContainer(); 

// @property {PluginContainer} afterBindClassPlugins these plugins accept an object like 
// {name:name,baseClass:JsDocASTNode,jsdocmaker:JsDocMaker} and perform some modification to passed node:parsed instance.
// This is done just after a class name is binding to an actual AST class node.
JsDocMaker.prototype.afterBindClassPlugins = new PluginContainer(); 



//@method bindClass @param {String}name @param {Object} baseClass
//TODO: using a internal map this could be done faster
JsDocMaker.prototype.bindClass = function(name, baseClass)
{
	var context = {
		name:name
	,	baseClass: baseClass
	,	jsdocmaker: this
	}; 

	this.beforeBindClassPlugins.execute(context); 

	// beforeBindClassPlugins have the oportunity of changing the context
	name = context.name || name;
	baseClass = context.baseClass || baseClass;

	var moduleName = baseClass.annotation === 'module' ? baseClass.name : baseClass.module.name; 
	
	//search all classes that matches the name
	var classesWithName = _(_(this.data.classes).values()).filter(function(c)
	{
		return c.name===name;//JsDocMaker.stringEndsWith(c.name, name); 
	});
	//search classes of the module
	var moduleClasses = _(classesWithName).filter(function(c)
	{
		return JsDocMaker.startsWith(c.module.name, moduleName); 
	}); 

	//TODO: performance - classesWithName could be compauted only if moduleClasses is empty

	var c = moduleClasses.length ? moduleClasses[0] : classesWithName[0]; 

	if(!c)
	{
		//TODO: look at native types
		var nativeType = this.getNativeTypeUrl ? this.getNativeTypeUrl(name) : null;
		var o = {name:name}; 
		if(nativeType)
		{
			o.nativeTypeUrl = nativeType; 
		}
		else
		{
			o.error = 'NAME_NOT_FOUND'; 
		}
		c = o;		
	}

	this.afterBindClassPlugins.execute({name:name, binded: c, baseClass: baseClass, jsdocmaker: this});

	return c;

}; 

// @method simpleName @param {String} name @return {String}
JsDocMaker.prototype.simpleName = function(name, prefix)
{
	if(prefix && name.indexOf(prefix) === 0)
	{
		return name.substring(prefix.length + 1, name.length);
	}
	else
	{	
		var a = name.split(JsDocMaker.ABSOLUTE_NAME_SEPARATOR);
		return a[a.length - 1]; 	
	}
}; 







},{"./class":3,"./plugin":6,"underscore":1}],3:[function(require,module,exports){
// @module shortjsdoc @class JsDocMaker
// Main jsdoc parser utility. It accepts a valid js source code String and returns a JavaScript object with a jsdoc AST, this is an object
// with classes and modules array that users can use to easily access jsdocs information, for example, parsed.classes.Apple.methods.getColor
// use the parseFile method for this! This will return the AST, if you want to perform more enrichment and type binding, then use 
// postProccess and postProccessBinding methods after.

/* jshint evil:true*/

var _ = require('underscore'); 

var JsDocMaker = function(options)
{	
	//@property {Object<String,String>} customNativeTypes name to url map that the user can modify to register new native types b givin its url.
	this.customNativeTypes = this.customNativeTypes || {};
	this.annotationRegexp = /(\s+@\w+)/gi;
	this.typeParsers = {};
	this.inputSource = [];
	this.options = options || {};

	if(this.initializePluginContainers)
	{
		this.initializePluginContainers();
	}
}; 

// @property {String} DEFAULT_CLASS @static
JsDocMaker.DEFAULT_CLASS = 'Object'; 

// @property {String} DEFAULT_MODULE @static
JsDocMaker.DEFAULT_MODULE = '__DefaultModule'; 

// @property {String} ABSOLUTE_NAME_SEPARATOR @static
JsDocMaker.ABSOLUTE_NAME_SEPARATOR = '.'; 

// @property {String} MULTIPLE_TEXT_SEPARATOR @static
JsDocMaker.MULTIPLE_TEXT_SEPARATOR = '\n\n'; 

//expose
if(typeof(window) !== 'undefined')
{
	window.JsDocMaker = JsDocMaker; 
}


//@method require perform an intelligent require n browser&nodejs, needed for esprima. Ugly :(
JsDocMaker.require = function(name)
{
	return (typeof(window) != 'undefined' && window[name]) ? window[name] : require(name);
}; 

module.exports = JsDocMaker; 
},{"underscore":1}],4:[function(require,module,exports){
'strict mode'; 

var JsDocMaker = require('./class'); 

require('./util'); 

require('./parse'); 

require('./preprocess'); 

require('./type-parsing'); 

require('./postprocess'); 

require('./binding'); 


module.exports = JsDocMaker;
},{"./binding":2,"./class":3,"./parse":5,"./postprocess":7,"./preprocess":8,"./type-parsing":9,"./util":10}],5:[function(require,module,exports){
/*
@module shortjsdoc 

@class JsDocMaker.Data
@property {Object<String, JsDocASTNode>} methods
@property {Object<JsDocASTNode>} classes
@property {Array<JsDocASTNode>} classes

@class JsDocASTNode all the jsdoc parsed information is stored as nodes one containing others. modules contains classes, @class contains methods and @method contains @param and @returns


@class JsDocMaker

#Parsing and processing 

The first thing done with source code is parsing its comments to extract general information about annotations. This implies

 * parse the sources with exprima and work with the comments array.
 * preprocess the comments array for normalization before start parsing them. Call preprocessing plugins. 
 * iterate the comments text and split using PRIMARY annotations

##Primary annotations
For representing some logic of JSDOC like 'a class contains methods that contains parameters' we have the concept of PRIMARY ANNOTATIONS. 
*These are @class @module @method @property*

These are the concepts that contains the stuff. All the other annotations are children of one primary annotation. For example @return, @param, @extend, @static are SECOND LEVEL ANNOTATIONS
and are always children of one primary annotation.

But this is the only logic contained in the core parsing. Then a general AST, using this primary container names logic, is returned. 

ALL declared annotations will be outputed (unless a plugin remove something)

*/


var JsDocMaker = require('./class'); 
var PluginContainer = require('./plugin'); 
var esprima = JsDocMaker.require('esprima');
var _ = require('underscore'); 


// @property {PluginContainer} allCommentPreprocessorPlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to esprima comment node - 
// this is the FIRST stage of the parser. This is the same as commentPreprocessorPlugins but all comments nodes are passed for those plugins that need some context about the comments. 
JsDocMaker.prototype.allCommentPreprocessorPlugins = new PluginContainer(); 

// @property {PluginContainer} commentPreprocessorPlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to esprima comment node - this is the FIRST stage of the parser
JsDocMaker.prototype.commentPreprocessorPlugins = new PluginContainer(); 

// @property {PluginContainer} beforeParseNodePlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done just before the first parsing is done on the first AST node. Only primary nodes are visited!
JsDocMaker.prototype.beforeParseNodePlugins = new PluginContainer(); 

// @property {PluginContainer} parsePreprocessors these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done just after the first parsing is done on the first AST node. Only primary nodes are visited!
JsDocMaker.prototype.afterParseNodePlugins = new PluginContainer();

// @property {PluginContainer} afterParseUnitSimplePlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done after an unit is parsed - this will iterated all nodes as units .The first node object is formed at this stage. 
JsDocMaker.prototype.afterParseUnitSimplePlugins = new PluginContainer();

// @property {String}primaryAnnotationsRegexString
JsDocMaker.prototype.primaryAnnotationsRegexString = '((?:@class)|(?:@method)|(?:@property)|(?:@attribute)|(?:@module)|(?:@event)|(?:@constructor)|(?:@function)|(?:@filename))';

JsDocMaker.prototype.isPrimaryAnnotation = function(s)
{
	if(s.indexOf('@')!==0)
	{
		s = '@' + s; 
	}
	return new RegExp('^'+this.primaryAnnotationsRegexString, 'g').test(s);
}


//@method jsdoc the public method to parse all the added files with addFile. @return {Object} the parsed object @param {String} source . Optional
JsDocMaker.prototype.jsdoc = function(source)
{
	//@property {Array<String>} all the input added included @filename annotations
	source = source || this.inputSource.join('');
	this.data = this.data || {}; 
	this.data.source = source;

	// @property {EsprimaSyntax} the Sprima Syntax object of the current pased file.	
	this.syntax = esprima.parse(source, {
		raw: true
	,	range: true
	,	comment: true		
	});

	this.parse(this.syntax.comments);

	return this.data;
}; 

//@method parseFile a public method for parsing a single file. Note if you want to parse more than one file please use addFile() and the jsdoc() 
//@return {Object} the parsed object @param {String} source @param {String} filename
JsDocMaker.prototype.parseFile = function(source, fileName)
{
	this.addFile(source, fileName); 
	return this.jsdoc(); 
}; 

//@method addFile @param {String}source the source code of the file @param  {String} the file name
JsDocMaker.prototype.addFile = function(source, fileName)
{
	this.inputSource.push('\n\n//@filename {Foo} fileName ' + fileName+'\n\n');
	this.inputSource.push(source);
}; 

//@property {String} ignoreCommentPrefix
JsDocMaker.prototype.ignoreCommentPrefix = '?';

//@method parse	@return {Array} array of class description - with methods, and methods containing params. 
JsDocMaker.prototype.parse = function(comments)
{
	var self = this
	,	currentClass = null
	,	currentMethod = null
	,	currentModule = null
	,	currentFile = null;

	this.comments = comments;
	this.data = this.data || {}; 
	this.data.classes = this.data.classes || {}; 
	this.data.modules = this.data.modules || {}; 
	this.data.files = this.data.files || {}; 

	self.allCommentPreprocessorPlugins.execute({node: self.comments, jsdocMaker: self}); 

	_(self.comments).each(function(node)
	{
		self.commentPreprocessorPlugins.execute({node: node, jsdocMaker: self}); 

		//because is global we must instantiate this regex each time
		var regex = new RegExp(self.primaryAnnotationsRegexString, 'gi');

		var a = JsDocMaker.splitAndPreserve(node.value || '', regex); 
		a = _(a).filter(function(v)  //delete empties and trim
		{
			return JsDocMaker.stringTrim(v);
		});
		
		_(a).each(function(value)
		{
			var parsed_array = self.parseUnit(value, node);
			
			_(parsed_array).each(function(parsed)
			{
				parsed.commentRange = node.range;
				parsed.fileName = (currentFile && currentFile.fileName) ? currentFile.fileName : undefined;

				delete parsed.theRestString; 

				// console.log('parse ', parsed.annotation)
				self.beforeParseNodePlugins.execute({node:parsed, jsdocmaker:self}); 

				//Note: the following lines is the (only) place were the 'primary annotations' (class,module,method,property) are implemented 
				//We get primary tags like class,module,method,property and form the first primary AST (a module contains classes which contain methods and properties)
				//All the other annotations are treated as secondary, this means they will be assigned as childresn to the last primary annotation.

				if(parsed.annotation === 'class') 
				{
					//allow classes without modules - asignated to a defulat module
					if (!currentModule)
					{
						currentModule = {name: JsDocMaker.DEFAULT_MODULE};
					}

					parsed.module = currentModule; 
					parsed.absoluteName = currentModule.name + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + parsed.name;

					//if the class was already defined we want to preserve all the definitions children and texts 
					if(self.data.classes[parsed.absoluteName])
					{
						//preserve text
						if(self.data.classes[parsed.absoluteName].text !== parsed.text)
						{
							self.data.classes[parsed.absoluteName].text += JsDocMaker.MULTIPLE_TEXT_SEPARATOR + parsed.text; 
						}

						// preserve children
						self.data.classes[parsed.absoluteName].children = self.data.classes[parsed.absoluteName].children || [];
						_(parsed.children).each(function(classPreservedChild)
						{
							var originalChild = _(self.data.classes[parsed.absoluteName].cihldren).find(function(c2)
							{
								return c2.annotation===classPreservedChild.annotation; 
							}); 
							if(!originalChild)
							{
								self.data.classes[parsed.absoluteName].children.push(classPreservedChild); 
							}
						});

						
						currentClass = self.data.classes[parsed.absoluteName]; 

					}
					else
					{						
						self.data.classes[parsed.absoluteName] = parsed; 
						delete self.data.classes[parsed.name];
						currentClass = parsed; 
					}
				}

				if(parsed.annotation === 'filename') 
				{
					currentFile = parsed; 
					currentFile.fileName = parsed.text; 
					delete parsed.text;
					self.data.files[currentFile.fileName] = currentFile;
				}

				else if(parsed.annotation === 'module')
				{	
					currentModule = parsed;

					//if the module was already defined we want to preserve all the definitions texts
					if(self.data.modules[currentModule.name])
					{
						if(self.data.modules[currentModule.name].text !== currentModule.text)
						{
							self.data.modules[currentModule.name].text += JsDocMaker.MULTIPLE_TEXT_SEPARATOR + currentModule.text; 
						}
					}
					else
					{
						self.data.modules[currentModule.name] = currentModule; 
					}
				}

				//the rest are all children of class : 

				//? we treat @method as equivalent as @constructor
				else if (parsed.annotation === 'method' && currentClass)
				{
					currentClass.methods = currentClass.methods || {};
					currentClass.methods[parsed.name] = parsed;
					currentMethod = parsed;
				}
				else if(parsed.annotation === 'constructor' && currentClass)
				{
					currentClass.constructors = currentClass.constructors || [];
					currentClass.constructors.push(parsed); 
					currentMethod = parsed; 
				}


				else if(parsed.annotation === 'function' && currentModule)
				{
					currentModule.functions = currentModule.functions || [];
					currentModule.functions.push(parsed); 
					currentMethod = parsed; // heads up - so future @params and @returns are assigned to this function
				}

				//? @property and @event and @attribute are treated similarly
				else if(parsed.annotation === 'property' && currentClass)
				{
					currentClass.properties = currentClass.properties || {};
					currentClass.properties[parsed.name] = parsed;
				}
				else if(parsed.annotation === 'event' && currentClass)
				{
					currentClass.events = currentClass.events || {};
					currentClass.events[parsed.name] = parsed;
				}
				else if(parsed.annotation === 'attribute' && currentClass)
				{
					currentClass.attributes = currentClass.attributes || {};
					currentClass.attributes[parsed.name] = parsed;
				}

				self.afterParseNodePlugins.execute({
					node: parsed
				,	jsdocmaker: self
					//add loop context information to plugins
				,	currentClass: currentClass
				,	currentMethod: currentMethod
				,	currentModule: currentModule
				,	currentFile: currentFile
				});
			}); 
		});
		
	}); 
};

// @method {Unit} parseUnit parse a simple substring like '@annotation {Type} a text' into an object {annotation, type, text} object.
// syntax: @method {String} methodName blabla @return {Number} blabla @param {Object} p1 blabla
JsDocMaker.prototype.parseUnit = function(str, comment)
{
	// TODO: split str into major units and then do the parsing
	var parsed = this.parseUnitSimple(str, comment); 
	if(!parsed)
	{
		return null;
	}
	var ret = [parsed];
	if(parsed.theRestString)
	{
		var s = parsed.theRestString; 
		var child;
		while((child = this.parseUnitSimple(s, comment)))
		{
			if(child.annotation === 'class') {
				ret.push(child); 
				parsed = child;
			}
			else
			{					
				parsed.children = parsed.children || []; 
				parsed.children.push(child); 
			}
			s = child.theRestString; 
		}
	}
	return ret; 
}; 

//@method parseUnitSimple @param {String} str @param {ASTSprimaNode} comment
JsDocMaker.prototype.parseUnitSimple = function(str, comment) 
{	
	if(!str)
	{
		return null;
	}
	var result;
	var regexp = null; 

	// HEADS UP - TODO: the fgollowing two regex definitions must be identical in the content but not perhasin the endings/begginigns / globals
	// if you fix one you must also fix the other
	if(comment.type==='Line')
	{
		str = JsDocMaker.stringFullTrim(str); 
		regexp = /\s*@([\w\.\-\_]+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}(.*)\s*/i; 
		result = regexp.exec(str);
	}
	else
	{
		str = JsDocMaker.stringTrim(str); 
		regexp = /\s*@([\w\.\-\_]+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}([.\s\w\W]*)/gmi;
		//TODO: I have to put this regexp inline here - if not the second time I call exec on the instance it won't match. This is because the 'g' modifier.
		result = regexp.exec(str); 
	}
	if(!result || result.length<4)
	{
		return null;  
	}
	var text = result[4] || '';
		
	var splitted = JsDocMaker.splitAndPreserve(text, this.annotationRegexp) || [''];  
	text = splitted[0]; 
	//@property {String} lineCommentSeparator used to separate each Line comment type text
	this.lineCommentSeparator = this.lineCommentSeparator || '\n';
	text = text.replace(new RegExp(this.lineCommentSeparatorMark, 'g'), this.lineCommentSeparator);
	text = JsDocMaker.stringTrim(text||'')
	splitted.splice(0,1); 
	var ret = {
		annotation: result[1]
	,	type: result[2]
	,	name: result[3]
	,	text: text
	,	theRestString: JsDocMaker.stringTrim(splitted.join(''))
	};

	this.afterParseUnitSimplePlugins.execute({node:ret, jsdocmaker:this}); 

	return ret;
}; 



// at last we want to document the output ast data that the parser returns:

// @property {JsDocMaker.Data} data the main data on which the parser and plugins will be working on. This is the resulting AST of jsdoc.

},{"./class":3,"./plugin":6,"underscore":1}],6:[function(require,module,exports){
// @module shortjsdoc.plugin
var JsDocMaker = require('./class')
,	_ = require('underscore'); 

// @class PluginContainer a plugin container can be used for installing plugins and then processing 
// some action with all of them, executing them in sequence.
// A plugin is basically a function that acts on some data - state
// Registered plugins are executed secuentially. plugin execution arguments can be modified so next-to-execute plugin can 
// consume new information - same with return value.
var PluginContainer = function()
{
	this.plugins = [];
};

//expose
JsDocMaker.PluginContainer = PluginContainer; 

//@method add @param {JsDocMakerPlugin} plugin
PluginContainer.prototype.add = function(plugin)
{
	this.plugins.push(plugin); 
	this.priorized = null;//clean priorized cache
}; 

//TODO: remove(plugin)

// @method execute @param {Object} @param {Any} input options @return {Any}
PluginContainer.prototype.execute = function(options, input)
{
	var result = null;
	this.visitPlugins(function(plugin)
	{
		result = plugin.execute(options, result);
	}); 
	return result; 
}; 

//@method visitPlugins visit children plugins respecting priority @param {Function} visitor
PluginContainer.prototype.visitPlugins = function(visitor)
{
	// @property {Array<Array<Plugin>>} priorized array of priorities - each priority index contains the plugins with that priority
	var priorized = this.priorized;// = (this.priorized || [1]); //priority calculations cache

	if(!priorized)
	{
		priorized = this.priorized = []; 
		for (var i = 0; i < PluginContainer.MAX_PRIORITY; i++) 
		{
			priorized[i] = []; 
		};
		_(this.plugins).each(function(plugin)
		{
			// visitor(plugin); 
			var p = plugin.priority || PluginContainer.DEFAULT_PRIORITY; // priority zero is invalid and it is treated as default
			// priorized[p] = priorized[p] || []; 
			priorized[p].push(plugin); 
		}); 
	}

	for (var i = 1; i < priorized.length; i++) 
	{
		var p = priorized[i]; 
		for (var j = 0; j < p.length; j++) 
		{
			visitor(p[j]);
		};
	};
}; 

PluginContainer.DEFAULT_PRIORITY = 6; 
PluginContainer.MAX_PRIORITY = 10; 

// TODO: priority



// @class JsDocMakerPlugin
// @property {String} name
// @method execute execute this plugin @param{Object}options @param {Any}result 
// @returns{Any} result possible enriched by the plugin in the chain

module.exports = PluginContainer;






//@method globalPlugins @static
// JsDocMaker.registerGlobalPlugin = function(pluginContainerName, plugin)
// {
// 	JsDocMaker.prototype.plugins = JsDocMaker.prototype.plugins || {};
// 	JsDocMaker.globalPlugins[pluginContainerName] = JsDocMaker.globalPlugins[pluginContainerName] || {}; 
// }; 
// //@method initializePluginContainers called in the constructor - will install all static plugins registered with JsDocMaker.registerGlobalPlugin
// JsDocMaker.prototype.initializePluginContainers = function()
// {
// }




},{"./class":3,"underscore":1}],7:[function(require,module,exports){
// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 
var PluginContainer = require('./plugin'); 

//POST PROCESSING

// @property {PluginContainer} beforeTypeBindingPlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done just before doing the type binding.
JsDocMaker.prototype.beforeTypeBindingPlugins = new PluginContainer(); 

// @property {PluginContainer} afterTypeBindingPlugins these plugins accept an object like 
// {node:parsed:jsdocmaker:self} and perform some modification to passed node:parsed instance.
// This is done just after doing the type binding.
JsDocMaker.prototype.afterTypeBindingPlugins = new PluginContainer(); 

// @method postProccess so the data is already parsed but we want to normalize some 
// children like @extend and @ module to be properties of the unit instead children.
// Also we enforce explicit  parent reference, this is a class must reference its 
// parent module and a method muest reference its parent class. Also related to this 
// is the fullname property that will return an unique full name in the format 
// '$MODULE.$CLASS.$METHOD'. We assume that a module contains unique named classes and 
// that classes contain unique named properties and methods. 
JsDocMaker.prototype.postProccess = function()
{
	var self = this;
	// set params and throws of constructors
	_(self.data.classes).each(function(c)
	{
		_(c.constructors).each(function(co)
		{
			co.params = _(co.children||[]).filter(function(child)
			{
				return child.annotation === 'param'; 
			});

			co.throws = _(co.children||[]).filter(function(child)
			{
				return child.annotation === 'throw' || child.annotation === 'throws'; 
			});
		}); 
	}); 
}; 


//@method postProccessBinding precondion: call postProccess() first. We separated the post proccessing in two because we shouln't do JSON.stringify() after we bind types because of recursive loops. 
JsDocMaker.prototype.postProccessBinding = function()
{
	if(this.literalObjectInstall)
	{
		this.literalObjectInstall(); 
	}
	var self = this;

	_(self.data.modules).each(function(m)
	{
		self.beforeTypeBindingPlugins.execute({node: m, jsdocmaker: self});
		self._postProccessBinding_methodSetup(m.functions, m, true);
	});
	
	//at this points we have all our modules and classes - now we normalize extend, methods and params and also do the type binding. 
	_(self.data.classes).each(function(c)
	{
		self.beforeTypeBindingPlugins.execute({node: c, jsdocmaker: self});
		//class.extends property
		var extend = _(c.children||[]).find(function(child)
		{
			return child.annotation === 'extend' || child.annotation === 'extends'; 
		}); 

		if(!extend) // All classes must extend something
		{
			extend = c.extends = (self.bindClass(JsDocMaker.DEFAULT_CLASS, c) || {error: 'NAME_NOT_FOUND', name: JsDocMaker.DEFAULT_CLASS});
		}
		else 
		{
			c.extends = self.bindClass(extend.name, c);
			c.children = _(c.children).without(extend);	//TODO: why we would want to do this? - remove this line
		}


		//setup methods & constructors

		var methods = _(c.methods).clone() || {};
		if(c.constructors) 
        {
            for (var i = 0; i < c.constructors.length; i++) 
            {
                var cname = 'constructor ' + i;
                methods[cname] = c.constructors[i]; //using invalid method name
                c.constructors[i].name = i+'';
            }
        }

		self._postProccessBinding_methodSetup(methods, c);		

		//setup properties
		var propertySetup = function(prop)
		{
			prop.ownerClass = c.absoluteName;
			prop.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + prop.name; 
			if(self.installModifiers)
			{
				self.installModifiers(prop); 
			}
			if(_(prop.type).isString())
			{
				prop.type = self.parseTypeString(prop.type, c) || prop.type;
			}	
		}; 
		_(c.properties).each(propertySetup);
		_(c.events).each(propertySetup);
		_(c.attributes).each(propertySetup);		
	});

	self.afterTypeBindingPlugins.execute({jsdocmaker: self});
};

JsDocMaker.prototype._postProccessBinding_methodSetup = function(methods, c, isFunction)
{
	var self = this;
	c = c || {}; 
	_(methods).each(function(method)
	{
		self.beforeTypeBindingPlugins.execute({node: method, jsdocmaker: self});
		//method.param property
		var params = _(method.children||[]).filter(function(child)
		{
			child.text = JsDocMaker.stringTrim(child.text||''); 
			return child.annotation === 'param'; 
		}); 
		method.params = params; 

		var absoluteName = c.absoluteName || c.name || '';
		if(!isFunction)
		{
			method.ownerClass = absoluteName;	
		}
		else
		{
			method.ownerModule = absoluteName;
		}		
		method.absoluteName = absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 

		_(method.params).each(function(param)
		{
			self.beforeTypeBindingPlugins.execute({node: param, jsdocmaker: self});

			if(_(param.type).isString())
			{
				param.typeOriginalString = param.type; 
				param.type = self.parseTypeString(param.type, c) || param.type;						
			}
		}); 

		//method throws property
		var throw$ = _(method.children||[]).filter(function(child)
		{
			return child.annotation === 'throw' || child.annotation === 'throws'; 
		}); 
		method.throws = throw$; 
		_(method.throws).each(function(t)
		{
			self.beforeTypeBindingPlugins.execute({node: t, jsdocmaker: self});

			//because @throws doesn't have a name it breaks our simple grammar, so we merge the name with its text.
			t.text = (t.name ? t.name+' ' : '') + (t.text||''); 
			if(_(t.type).isString())
			{
				t.typeOriginalString = t.type; 
				t.type = self.parseTypeString(t.type, c) || t.type;						
			}
		}); 

		//method.returns property
		var returns = _(method.children||[]).filter(function(child)
		{				
			self.beforeTypeBindingPlugins.execute({node: child, jsdocmaker: self});
			child.text = JsDocMaker.stringTrim(child.text||''); 
			return child.annotation === 'returns' || child.annotation === 'return'; 
		}); 
		method.returns = returns.length ? returns[0] : {name:'',type:''};

		//because @returns doesn't have a name it breaks our simple grammar, so we merge the name with its text.
		method.returns.text = (method.returns.name ? method.returns.name+' ' : '') + (method.returns.text||''); 

		if(_(method.returns.type).isString())
		{
			method.returns.type = self.parseTypeString(method.returns.type, c) || method.returns.type;						
		}

		if(self.installModifiers)
		{
			self.installModifiers(method); 
		}
	});
};
},{"./class":3,"./plugin":6,"underscore":1}],8:[function(require,module,exports){
/* @module shortjsdoc

#Comment Preprocessors

The core of comment preprocessing is done ba couple of plugins executed at allCommentPreprocessorPlugins and 
ingeneral normalizes the comments text, delete non relevant comments, unify line comments into a single one, etc

*/
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

//COMMENT PREPROCESSORS

//@class PreprocessCommentsPlugin1 @extends JsDocMakerPlugin  this plugin is registered in JsDocMaker.prototype.allCommentPreprocessorPlugins plugin container
// and do an initial preprocesing on the comments erasing those marked comments to be ignored, and fixing its text to support alternative syntax.
var preprocessCommentsPlugin1 = {
	name: 'preprocessCommentsPlugin1'
,	execute: function(options)
	{
		var comments = options.node;
		//we do the parsing block by block,
		for (var i = 0; i < comments.length; i++) 
		{
			var node = comments[i];//options.node; 
			node.value = node.value || ''; 

			// fix styled comment blocks with '*' as new line prefix
			// if(node.type === 'Block')
			// {
			// 	// Note: syntax /** - not necesary to implement
			// 	debugger
			// 	node.value = node.value.replace(/\n \*/gi, '\n');
			// }

			// remove comments that starts with ignoreCommentPrefix
			if(JsDocMaker.startsWith(JsDocMaker.stringTrim(node.value), options.jsdocMaker.ignoreCommentPrefix))
			{
				//if \n * is detected it is fixed to not count the decorative '*'
				comments.splice(i, 1); //remove this node
			}
		}
	}
} ; 

//install it as comment preprocessor plugin!
JsDocMaker.prototype.allCommentPreprocessorPlugins.add(preprocessCommentsPlugin1);//.push(JsDocMaker.prototype.preprocessComments); 


//@class FixUnamedAnnotationsPlugin @extends JsDocMakerPlugin This plugin is installed at JsDocMaker.prototype.commentPreprocessorPlugins and and solves the following problem: 
//Our regexp format expect an anotation with a name. So for enabling unamed annotations we do this dirty fix, this is add a name to precondition
var fixUnamedAnnotationsPlugin = {
	name: 'fixUnamedAnnotationsPlugin'
,	priority: 3
,	execute: function(options)
	{
		var node = options.node;
		if(node.value)
		{
			node.value = node.value.replace(/@constructor/gi, '@constructor n'); 
			node.value = node.value.replace(/(@\w+)\s*$/gi, '$1 dummy ');
			node.value = node.value.replace(/(@\w+)\s+(@\w+)/gi, '$1 dummy $2');
		}
	}
}; 
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessorPlugins.add(fixUnamedAnnotationsPlugin); 

//@class UnifyLineCommentsPlugin @extends JsDocMakerPlugin this is a very important plugin for normalize our js input Line comments 
// It is executed at JsDocMaker.prototype.allCommentPreprocessorPlugins
var unifyLineCommentsPlugin = {
	name: 'unifyLineCommentsPlugin'
,	execute: function(options)
	{
		var i = 0
		,	comments = options.node
		,	jsdocMaker = options.jsdocMaker; 
	
		jsdocMaker.lineCommentSeparatorMark = '_lineCommentSeparatorMark_';
		while(i < comments.length - 1)
		{
			var c = comments[i]
			,	next = comments[i+1]; 

			var sss = JsDocMaker.stringFullTrim(options.jsdocMaker.data.source.substring(c.range[1], next.range[0])); 
			if (c.type==='Line' && next.type==='Line' && !sss)
			{
				c.value += ' ' + jsdocMaker.lineCommentSeparatorMark + ' ' + next.value; 
				c.range[1] = next.range[1]; 
				comments.splice(i+1, 1); 
			}
			else
			{
				i++;
			}
		}
	}
}; 
JsDocMaker.prototype.allCommentPreprocessorPlugins.add(unifyLineCommentsPlugin); 


},{"./class":3,"underscore":1}],9:[function(require,module,exports){
/* jshint evil:true */
// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var shortjsdocParseLiteralObject = require('../objectTypeParser/parser.js');
var _ = require('underscore'); 

//TYPE PARSING

//@method parseType parse a type string like 'Map<String,Array<Apple>>' or 'String' and return an object like {name: 'Map',params:['String',{name: 'Array',params:['Apple']}]}. This is the default type parser. 
//It depends on type parser file typeParser.js @static
JsDocMaker.parseType = function(s)
{
	var parsed, ss;
	if(s.indexOf(':')!==-1)
	{
		ss = '{'+s+'}'; 
		parsed = JsDocMaker.parseLiteralObjectType(ss);
	}
	else
	{
		ss ='{name:'+s+'}'; 
		parsed = JsDocMaker.parseLiteralObjectType(ss);
		parsed = parsed.name; 
	}	
	return parsed;
}; 

// @method parse a object literal type string like '' @return {Object} the parsed object @static
JsDocMaker.parseLiteralObjectType = function(s)
{
	var parsed = shortjsdocParseLiteralObject.parse(s);	
	var obj = eval('(' + parsed + ')'); 
	return obj;
}; 

JsDocMaker.prototype.registerTypeParser = function(typeParser)
{
	this.typeParsers = this.typeParsers || {};
	this.typeParsers[typeParser.name] = typeParser; 
}; 


},{"../objectTypeParser/parser.js":12,"./class":3,"underscore":1}],10:[function(require,module,exports){
// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

// STATIC UTILITIES

// @method splitAndPreserve search for given regexp and split the given string but preserving the matches
// @param {Regexp} regexp must contain a capturing group (like /(\s+@\w+)/gi)
// @return {Array of string}
// @static
JsDocMaker.splitAndPreserve = function(string, replace)
{
	string = string || '';
	var marker = '_%_%_';
	var splitted = string.replace(replace, marker+'$1');
	if(splitted.length<2)
	{
		return null; //TODO: notify error?
	}
	splitted = splitted.split(marker);
	return splitted; 
}; 

//@method stringFullTrim @param {String} s @static
JsDocMaker.stringFullTrim = function(s)
{
	return (s||'').replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
};
//@method stringTrim @param {String} s @static
JsDocMaker.stringTrim = function(str)
{
	var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	for (var i = 0; i < str.length; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};
//@method stringEndsWith @static
JsDocMaker.stringEndsWith = function(str, suffix) 
{
	str = str || '';
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}; 
//@method stringEndsWith @static
JsDocMaker.startsWith = function(s, prefix)
{
	s = s || '';
	return s.indexOf(prefix)===0;
}; 

//@method error @param {String}msg
JsDocMaker.prototype.error = function(msg)
{
	console.error('Error detected: ' + msg); 
	// throw msg;
}; 


// JsDocMaker.getChildren = function(node, compareProperties)
// {
// 	var a = []
// }; 
// JsDocMaker.getAChildren = function(node, compareProperties)
// {
// 	var c = JsDocMaker.getChildren(node, compareProperties);
// 	return (c && c.length) ? return c[0] : null;
// }; 
},{"./class":3,"underscore":1}],11:[function(require,module,exports){
var JsDocMaker = require('./core/main'); 

require('./plugin/main.js'); 

module.exports = JsDocMaker;
},{"./core/main":4,"./plugin/main.js":19}],12:[function(require,module,exports){
/*

This is a syntax definition compiled to JavaScript that parses an expression like 

  {name:String,colors:Map<String,Array<String>>}

How to work with this file ? open the following syntax into http://pegjs.org/online. 
Then make sure it returns the parse() function in the global 'shortjsdocParseLiteralObject'


start
  = "{" exprs:(EXPR)+ [,]* "}" {return '{' + exprs.join(',') + '}'; }

EXPR
  = name:NAME ":" value:(VALUE) [,]* {return name + ':' + value; }

VALUE
  = type:TYPE / name:NAME [,]* {if(typeof name !== 'undefined'){return name;}}

TYPE
  = name:NAME "<" list:(LIST_OF_NAMES)+ ">" {return '{name: '+ name +',params:['+list.join(',')+']}'; }

NAME
  = name:[a-zA-z1-9_.]+ {return '\''+name.join('')+'\''; }

LIST_OF_NAMES
  = type:TYPE / name:NAME [,]* {
  if(typeof name !== 'undefined'){
  return name; 
  }
}

*/
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleIndices = { start: 0 },
        peg$startRuleIndex   = 0,

        peg$consts = [
          peg$FAILED,
          "{",
          { type: "literal", value: "{", description: "\"{\"" },
          [],
          /^[,]/,
          { type: "class", value: "[,]", description: "[,]" },
          "}",
          { type: "literal", value: "}", description: "\"}\"" },
          function(exprs) {return '{' + exprs.join(',') + '}'; },
          ":",
          { type: "literal", value: ":", description: "\":\"" },
          function(name, value) {return name + ':' + value; },
          function(name) {if(typeof name !== 'undefined'){return name;}},
          "<",
          { type: "literal", value: "<", description: "\"<\"" },
          ">",
          { type: "literal", value: ">", description: "\">\"" },
          function(name, list) {return '{name: '+ name +',params:['+list.join(',')+']}'; },
          /^[a-zA-z1-9_.]/,
          { type: "class", value: "[a-zA-z1-9_.]", description: "[a-zA-z1-9_.]" },
          function(name) {return '\''+name.join('')+'\''; },
          function(name) {
            if(typeof name !== 'undefined'){
            return name; 
            }
          }
        ],

        peg$bytecode = [
          peg$decode("!.!\"\"2!3\"+o$ #7!+&$,#&7!\"\"\"  +V% #0$\"\"1!3%,)&0$\"\"1!3%\"+8%.&\"\"2&3'+(%4$6($!\"%$$#  $##  $\"#  \"#  "),
          peg$decode("!7$+a$.)\"\"2)3*+Q%7\"+G% #0$\"\"1!3%,)&0$\"\"1!3%\"+)%4$6+$\"#!%$$#  $##  $\"#  \"#  "),
          peg$decode("7#*Q \"!7$+F$ #0$\"\"1!3%,)&0$\"\"1!3%\"+(%4\"6,\"!!%$\"#  \"#  "),
          peg$decode("!7$+b$.-\"\"2-3.+R% #7%+&$,#&7%\"\"\"  +9%./\"\"2/30+)%4$61$\"#!%$$#  $##  $\"#  \"#  "),
          peg$decode("! #02\"\"1!33+,$,)&02\"\"1!33\"\"\"  +' 4!64!! %"),
          peg$decode("7#*Q \"!7$+F$ #0$\"\"1!3%,)&0$\"\"1!3%\"+(%4\"65\"!!%$\"#  \"#  ")
        ],

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleIndices)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleIndex = peg$startRuleIndices[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$decode(s) {
      var bc = new Array(s.length), i;

      for (i = 0; i < s.length; i++) {
        bc[i] = s.charCodeAt(i) - 32;
      }

      return bc;
    }

    function peg$parseRule(index) {
      var bc    = peg$bytecode[index],
          ip    = 0,
          ips   = [],
          end   = bc.length,
          ends  = [],
          stack = [],
          params, i;

      function protect(object) {
        return Object.prototype.toString.apply(object) === "[object Array]" ? [] : object;
      }

      while (true) {
        while (ip < end) {
          switch (bc[ip]) {
            case 0:
              stack.push(protect(peg$consts[bc[ip + 1]]));
              ip += 2;
              break;

            case 1:
              stack.push(peg$currPos);
              ip++;
              break;

            case 2:
              stack.pop();
              ip++;
              break;

            case 3:
              peg$currPos = stack.pop();
              ip++;
              break;

            case 4:
              stack.length -= bc[ip + 1];
              ip += 2;
              break;

            case 5:
              stack.splice(-2, 1);
              ip++;
              break;

            case 6:
              stack[stack.length - 2].push(stack.pop());
              ip++;
              break;

            case 7:
              stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
              ip += 2;
              break;

            case 8:
              stack.pop();
              stack.push(input.substring(stack[stack.length - 1], peg$currPos));
              ip++;
              break;

            case 9:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1]) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 10:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] === peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 11:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (stack[stack.length - 1] !== peg$FAILED) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 12:
              if (stack[stack.length - 1] !== peg$FAILED) {
                ends.push(end);
                ips.push(ip);

                end = ip + 2 + bc[ip + 1];
                ip += 2;
              } else {
                ip += 2 + bc[ip + 1];
              }

              break;

            case 13:
              ends.push(end);
              ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

              if (input.length > peg$currPos) {
                end = ip + 3 + bc[ip + 1];
                ip += 3;
              } else {
                end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                ip += 3 + bc[ip + 1];
              }

              break;

            case 14:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 15:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 16:
              ends.push(end);
              ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

              if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
                end = ip + 4 + bc[ip + 2];
                ip += 4;
              } else {
                end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                ip += 4 + bc[ip + 2];
              }

              break;

            case 17:
              stack.push(input.substr(peg$currPos, bc[ip + 1]));
              peg$currPos += bc[ip + 1];
              ip += 2;
              break;

            case 18:
              stack.push(peg$consts[bc[ip + 1]]);
              peg$currPos += peg$consts[bc[ip + 1]].length;
              ip += 2;
              break;

            case 19:
              stack.push(peg$FAILED);
              if (peg$silentFails === 0) {
                peg$fail(peg$consts[bc[ip + 1]]);
              }
              ip += 2;
              break;

            case 20:
              peg$reportedPos = stack[stack.length - 1 - bc[ip + 1]];
              ip += 2;
              break;

            case 21:
              peg$reportedPos = peg$currPos;
              ip++;
              break;

            case 22:
              params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
              for (i = 0; i < bc[ip + 3]; i++) {
                params[i] = stack[stack.length - 1 - params[i]];
              }

              stack.splice(
                stack.length - bc[ip + 2],
                bc[ip + 2],
                peg$consts[bc[ip + 1]].apply(null, params)
              );

              ip += 4 + bc[ip + 3];
              break;

            case 23:
              stack.push(peg$parseRule(bc[ip + 1]));
              ip += 2;
              break;

            case 24:
              peg$silentFails++;
              ip++;
              break;

            case 25:
              peg$silentFails--;
              ip++;
              break;

            default:
              throw new Error("Invalid opcode: " + bc[ip] + ".");
          }
        }

        if (ends.length > 0) {
          end = ends.pop();
          ip = ips.pop();
        } else {
          break;
        }
      }

      return stack[0];
    }

    peg$result = peg$parseRule(peg$startRuleIndex);

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();
},{}],13:[function(require,module,exports){
// @module shortjsdoc.plugin.alias 
/*
#Alias plugin

this plugin allow to define an alias for annotations and classes. This means we can add name 
alias to annotations or classes. Alias can override previous defined ones. 

##Class alias

Class alias can be used to shortcut class names, like 

	@alias class A Array
	@alias class O Object
	@alias class S String
	@alias class N Number
	@alias class B Boolean

Or just use the shortcut

	@alias class A Array O Object S String

After this I just can write my types like this:

	@property {config:O<S,N>,tools:A<Tool>} complex

Note that these plugins perform two tasks using two different plugins: 
1) replace aliases initial annotation with original ones on parsing - the plugin runs on beforeParseNodePlugins
2) but also perform the aliasing on type binding. This is done on beforeBindClassPlugins

IMPORTANT. alias to complex types are not supported, only alias to simple types. The following is WRONG: @alias class MySuper Array<Leg>

##annotation alias
@alias annotation task method

##Implementation notes

at preprocessing the alias meta information will be stored in the AST under the 'alias' property. 
Then this information will be consumed at binding time in the second plugin

*/


var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class AliasBeforeParseNodePlugin @extends JsDocMakerPlugin a plugin executed at afterParseUnitSimplePlugins. Responsible of TODO 
var aliasBeforeParseNodePlugin = {

	name: 'alias'

,	execute: function(options)
	{
		var node = options.node
		,	context = options.jsdocmaker.data
		,	self = this;

		context.alias = context.alias || {}; 


		var aliasList = []; //its a list because node can have many alias children inside. alias is a second-level AST node
			
		if (node.annotation=='alias')
		{			
			aliasList = [node];
		}
		else 
		{
			aliasList = _(node.children).select(function(c)
			{
				return c.annotation=='alias';
			});
		}

		_(aliasList).each(function(alias)
		{
			self.parseAlias(alias, context, true); 
		}); 

		//TODO: remove the alias node from comments array ? 
		
	}

	//@method parseAlias @return {JSDocASTNode} the enhanced node with property *alias* enhanced
	//@param {JSDocASTNode} alias @param {JsDocMaker} context @param {Boolean} install  @return {Array<JSDocASTNode>} contained in the annotation text.
,	parseAlias: function(alias, context, install)
	{
		if(!alias)
		{
			return;
		}
		var a = alias.text.split(/\s+/)
		,	parsed = [];
		for (var i = 0; i < a.length; i+=2) 
		{
			var o = {type: alias.name, name: a[i], target: a[i+1]};
			parsed.push(o); 
			if(install)
			{
				context.alias[o.name] = o;

			}
		}
		return parsed;
	}
}; 



JsDocMaker.prototype.afterParseUnitSimplePlugins.add(aliasBeforeParseNodePlugin); 

//@class AliasBeforeBindClassPlugin @extends JsDocMakerPlugin a plugin executed at afterParseUnitSimplePlugins. Responsible of TODO 
var aliasBeforeBindClassPlugin = {
	name: 'aliasAfterTypeBindingPlugin'

	//@param {name:name, baseClass: baseClass, jsdocmaker: this} context  this plugin has the change of chainging the context.
,	execute: function(context)
	{
		context.jsdocmaker.data.alias = context.jsdocmaker.data.alias || {}; 
		var alias = context.jsdocmaker.data.alias[context.name]; 

		if(alias)
		{
			context.name = alias.target; //alias only sypport targetting single types!
		}
	}
}; 

JsDocMaker.prototype.beforeBindClassPlugins.add(aliasBeforeBindClassPlugin); 

//@class annotationAliasPlugin @extends JsDocMakerPlugin a plugin executed at commentPreprocessorPlugins. Responsible of TODO 
var annotationAliasPlugin = {
	execute: function(options)
	{
		var alias = {}
		var regex = /@alias\s+annotation\s+([\w\-_\.]+)\s+([\w\-_\.]+)/gi; //TODO: the core should provide this regex
		options.node.value.replace(regex, function(s, newName, targetName)
		{
			alias[newName] = targetName;
		});
		_.each(alias, function(targetName, newName)
		{
			var newNameRegex = new RegExp('@'+newName, 'gi');
			options.node.value = options.node.value.replace(newNameRegex, '@'+targetName);
		});
	}
}
JsDocMaker.prototype.commentPreprocessorPlugins.add(annotationAliasPlugin);

},{"../core/class":3,"underscore":1}],14:[function(require,module,exports){
/*
@module shortjsdoc.plugin.comment.indentation 
#Comment indentation plugin
Takes care of respecting the original indentation of block comments. 
It will erase the initial spaces of each line according to the comment indentation.
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 


//@class commentIndentationPlugin @extends JsDocMakerPlugin a plugin executed at beforeParseNodePlugins. 
var commentIndentationPlugin = {

	name: 'commentIndentation'

,	execute: function(options)
	{
		if(!options.node.text)
		{
			return;
		}
		var fileSource = options.jsdocmaker.data.files[options.currentFile.fileName]
		var beforeCommentText = options.jsdocmaker.data.source.substring(0, options.node.commentRange[0]); 

		var result = /([ \t]+)$/.exec(beforeCommentText)
		,	prefix = 0;
		if(result && result.length) 
		{
			prefix = result[0];

			var a = options.node.text.split('\n'), output = [];;
			_(a).each(function(line)
			{
				var repl = line.replace(new RegExp('^'+prefix), ''); 
				// console.log(line, repl); 
				output.push(repl);
			}); 

			// TODO we are ssumming files have unix end to line. we should pre process all commments first. 
			options.node.text = output.join('\n');//replaceAll('\n' + options.node.text, prefix, ''); 
		}	
	}
}
JsDocMaker.prototype.afterParseNodePlugins.add(commentIndentationPlugin); 


// function escapeRegExp(string) 
// {
//     return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
// }
// function replaceAll(string, find, replace) 
// {
// 	var r = new RegExp(escapeRegExp(find), 'g');
// 	debugger;
// 	console.log(r)
// 	return string.replace(r, replace);
// }

},{"../core/class":3,"underscore":1}],15:[function(require,module,exports){
// @module shortjsdoc.plugin.dependencies 
/*
#dependencies plugin

this is not technically a plugin because we don't want to make the cmd line tool slower and is a not 
important feature. It should be executed by hand in the user agent.

*/


var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

var Tool = function(maker, config)
{
	this.maker = maker;
	this.config = config || {}; 
}; 
_(Tool.prototype).extend({
	calculateClassDependencies: function()
	{
		var self = this
		,	currentClass
		// ,	currentModule
		,	fn = function(node)
			{
				// if(node.annotation==='module')
				// {
				// 	currentModule = node; 
				// }
				if(node.annotation==='class')
				{
					currentClass = node;
					currentClass.dependencies = currentClass.dependencies || {}; 
					currentClass.dependencies.classes = currentClass.dependencies.classes || {}; 
					if(self.config.includeExtends && currentClass.extends && 
						!_(self.config.ignoreClasses).contains(currentClass.extends.absoluteName))
					{
						currentClass.dependencies.classes[currentClass.extends.absoluteName] = currentClass.extends; 
					}
				}
				var deps = _(node.children).filter(function(c)
				{ 
					return c.annotation==='depends'; 
				});
			
				if(deps && deps.length)
				{	
					_(deps).each(function(dep)
					{
						if(dep.name==='class')
						{
							var c = self.maker.findClassByName(dep.text);
							if(!c)
							{
								console.log('warning dependency class not found: '+dep.text); 
								return;
							}

							if(_(self.config.ignoreClasses).contains(c.absoluteName))
							{
								return;
							}
							node.dependencies = node.dependencies || {}; 
							node.dependencies.classes = node.dependencies.classes || {}; 
							node.dependencies.classes[c.absoluteName] = c; 
							if(currentClass)
							{
								currentClass.dependencies.classes[c.absoluteName] = c; 
							}
						}
						// else if(dep.name==='module') //TODO
						// { }
						// else //TOOD: make class to be the default and use name instead of text
						// { }
					}); 
				}
			}
		,	fn_type = function(type, ownerNode)
			{
				if(!currentClass || _(self.config.ignoreClasses).contains(type.absoluteName))
				{
					return; 
				}

				//when iterating types, we automatically add the type as class dependency to the currentClass
				if(type.absoluteName !== currentClass.absoluteName && 
					!_(self.config.ignoreClasses).contains(type.absoluteName))
				{
					currentClass.dependencies.classes[type.absoluteName] = type; 	
				}
			};
		this.maker.recurseAST(fn, fn_type); 
	}
});

JsDocMaker.prototype.tools = JsDocMaker.tools || {}; 
JsDocMaker.prototype.tools.DependencyTool = Tool; 

JsDocMaker.prototype.findClassByName = function(className, data)
{
	data = data || this.data;
	var c = _(data.classes).find(function(c)
	{
		return c.absoluteName===className; 
	});
	if(!c)
	{
		c = _(data.classes).find(function(c)
		{
			return c.name===className; 
		});
	}
	return c; 
}; 
},{"../core/class":3,"underscore":1}],16:[function(require,module,exports){
var _ = require('underscore'); 
var JsDocMaker = require('../core/class'); 
var PluginContainer = require('../core/plugin'); 

require('./recurse-plugin-containers');

var key, keyRegexp; 

var pluginBefore = {
	name: 'escape-at'
,	priority: 2
,	execute: function(options)
	{
		var node = options.node;
		if(!key)
		{
			// debugger;
			key = 'escape_at_'+_.uniqueId();
			keyRegexp = new RegExp(key, 'g'); 
		}

		node.value = (node.value||'').replace(/@@/g, key); 
	}
}; 
JsDocMaker.prototype.commentPreprocessorPlugins.add(pluginBefore);


var pluginAfter = {
	name: 'escape-at'
,	execute: function(node) 
	{
		node.text = (node.text||'').replace(keyRegexp, '@'); 
	}
}; 
JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins.add(pluginAfter);





// old impl
// var plugin = {
// 	name: 'escape-at'
// ,	execute: function(node)
// 	{
// 		// debugger;
// 		node.text = (node.text||'').replace(/@@/g, '@'); 
// 	}
// }; 
// // debugger;
// JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins.add(plugin);
//JsDocMaker.prototype.commentPreprocessorPlugins.add(plugin);


},{"../core/class":3,"../core/plugin":6,"./recurse-plugin-containers":23,"underscore":1}],17:[function(require,module,exports){
// @module shortjsdoc.plugin @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

// TODO : turn this into a normal plugin - right now it is mixing itself in JsDocMaker
// INHERITED methods&properties postproccessing. Optional

//@method postProccessInherited calculates inherited methods&properties and put it in class'properties inheritedMethods and inheritedProperties
JsDocMaker.prototype.postProccessInherited = function()
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		c.inherited	= c.inherited || {}; 
		var inheritedData = {}; 

		c.inherited.methods = c.inherited.methods || {};
		self.extractInherited(c, c.extends, 'method', inheritedData);
		_(c.inherited.methods).extend(inheritedData); 

		inheritedData = {}; 
		c.inherited.properties = c.inherited.properties || {};
		self.extractInherited(c, c.extends, 'property', inheritedData);
		_(c.inherited.properties).extend(inheritedData); 

		inheritedData = {}; 
		c.inherited.events = c.inherited.events || {};
		self.extractInherited(c, c.extends, 'event', inheritedData);
		_(c.inherited.events).extend(inheritedData); 

		inheritedData = {}; 
		c.inherited.attributes = c.inherited.attributes || {};
		self.extractInherited(c, c.extends, 'attribute', inheritedData);
		_(c.inherited.attributes).extend(inheritedData); 
	});
};

//@method extractInherited @param baseClass @param c @param what @para data
JsDocMaker.prototype.extractInherited = function(baseClass, c, what, data)
{
	var self = this;
	if(!c || c.nativeTypeUrl)
	{
		return;
	}
	what = what || 'method'; 
	if(what === 'method')
	{		
		_(c.methods).each(function(method, name)
		{
			baseClass.methods = baseClass.methods || {};
			if(!baseClass.methods[name])
			{
				data[name] = method;
				// TODO: here we can act and clone the inherited nodes and add more info about the owner
				// data[name].inherited = true; 
				// data[name].inheritedFrom = c; 
			}
		});
	}
	else if(what === 'property')
	{
		_(c.properties).each(function(p, name)
		{
			baseClass.properties = baseClass.properties || {};
			if(!baseClass.properties[name])
			{
				data[name] = p;
				// TODO: here we can act and clone the inherited nodes and add more info about the owner
				// data[name].inherited = true; 
				// data[name].inheritedFrom = c; 
			}
		});
	}
	else if(what === 'event')
	{
		_(c.events).each(function(p, name)
		{
			baseClass.events = baseClass.events || {};
			if(!baseClass.events[name])
			{
				data[name] = p;
				// TODO: here we can act and clone the inherited nodes and add more info about the owner	
				// data[name].inherited = true; 
				// data[name].inheritedFrom = c; 
			}
		});
	}

	else if(what === 'attribute')
	{
		_(c.attributes).each(function(p, name)
		{
			baseClass.attributes = baseClass.attributes || {};
			if(!baseClass.attributes[name])
			{
				data[name] = p;
				// TODO: here we can act and clone the inherited nodes and add more info about the owner	
				// data[name].inherited = true; 
				// data[name].inheritedFrom = c; 
			}
		});
	}

	if(c.extends && c !== c.extends) //recurse!
	{
		self.extractInherited(baseClass, c.extends, what, data);
	}
};

//@method isClassOwner utility method for knowing if a property is defined in given class or is inherithed
//@static @param aClass @param prop
JsDocMaker.classOwnsProperty = function(aClass, prop)
{
	var result = prop.absoluteName && aClass.absoluteName && prop.absoluteName.indexOf(aClass.absoluteName) === 0; 
	return result;
}; 

},{"../core/class":3,"underscore":1}],18:[function(require,module,exports){
// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//
// it is an exmaple of a plugin that parse literal types like @param {#obj({p1:P1,p2:P2,...})} param1

// CUSTOM TPE PLUGIN literalObjectParse - requires literalObjectParser.js - it adds support 
// for the custom type syntax #obj({p1:P1,p2:P2,...})to express literal objects
// syntax: {#obj(prop1:String,prop2:Array<Apple>)}
// DEPRECATED - turn it into a unit test showing an  example of plugin making. this file will be delete.
// @method literalObjectParse
JsDocMaker.prototype.literalObjectParse = function(s, baseClass)
{
	var parsed = null
	,	self=this
	,	properties = {};
	try
	{
		var result  = JsDocMaker.parseLiteralObjectType('{' + s + '}');
		_(result).each(function(value, key)
		{
			var valueBinded = self.bindParsedType(value, baseClass);
			properties[key] = valueBinded; 
		}); 
	}
	catch(ex)
	{
		JsDocMaker.prototype.error('Failed to parse literal object ' + s);
		throw ex;
	}
	return {
		name: 'Object'
	,	properties: properties
	,	propertiesOriginal: parsed
	}; 
};

JsDocMaker.prototype.literalObjectInstall = function()
{	
	this.typeParsers = this.typeParsers || {}; 
	var parser = {
		name: 'obj'
	,	parse: _(this.literalObjectParse).bind(this)
	};
	this.registerTypeParser(parser); 
}; 


},{"../core/class":3,"underscore":1}],19:[function(require,module,exports){
'strict mode'; 

var JsDocMaker = require('../core/main.js'); 

require('./native-types.js'); 
require('./modifiers.js'); 
require('./inherited.js');
require('./util.js');
require('./literal-object.js');
require('./module-exports.js');
require('./alias.js');
// require('./metadata.js');
require('./comment-indentation.js');

require('./text-marks.js');
require('./text-marks-references.js');

require('./recurse-plugin-containers.js');
require('./escape-at.js');

//tools
require('./dependencies.js');

module.exports = JsDocMaker; 
},{"../core/main.js":4,"./alias.js":13,"./comment-indentation.js":14,"./dependencies.js":15,"./escape-at.js":16,"./inherited.js":17,"./literal-object.js":18,"./modifiers.js":20,"./module-exports.js":21,"./native-types.js":22,"./recurse-plugin-containers.js":23,"./text-marks-references.js":24,"./text-marks.js":25,"./util.js":26}],20:[function(require,module,exports){
// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//MODIFIERS postproccessing- like static, private, final. Optional module

//@property {Array<String>}MODIFIERS @static
JsDocMaker.MODIFIERS = ['static', 'private', 'final', 'deprecated', 'experimental', 'optional', 'abstract']; 
//@method installModifiers sets the property modifiers to the node according its children
JsDocMaker.prototype.installModifiers = function(node)
{
	node.modifiers = node.modifiers || []; 
	_(node.children).each(function(child)
	{
		if(_(JsDocMaker.MODIFIERS).contains(child.annotation))
		{
			node.modifiers.push(child.annotation); 
		}
	});
}; 
 
},{"../core/class":3,"underscore":1}],21:[function(require,module,exports){
/* @module shortjsdoc.plugin.module-export

#@module @exports
the module AST will contain a property exports pointing to a type that can be complex. Example:

	@module module1 blabla
	@class MyTool1
	@exports {version:String,Tool:MyTool1}
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class ModuleExportsPlugin @extends JsDocMakerPlugin
var plugin_beforeTypeBinding = {
	name: '@module @exports - beforeTypeBinding'
,	execute: function(options)
	{
		var node = options.node
		,	jsdocMaker = options.jsdocmaker; 
		if(node.annotation!='module')
		{
			return;
		}
		var exports = _(node.children).select(function(child)
		{
			return child.annotation=='exports';
		}) || null;

		if(exports && exports.length)
		{
			exports = exports[0]; 
			node.exports = exports;
			//name is part of the text
			exports.text = exports.name + ' ' + exports.text; 

			//type binding
			var parsedType = jsdocMaker.parseTypeString(node.exports.type, node);
			node.exports.typeString = node.exports.type;
			node.exports.type = parsedType;
		}
	}
}; 
  
JsDocMaker.prototype.beforeTypeBindingPlugins.add(plugin_beforeTypeBinding); 
},{"../core/class":3,"underscore":1}],22:[function(require,module,exports){
// @module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

// NATIVE TYPES LINKING / post processing. Optional

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
JsDocMaker.NATIVE_TYPES = ['String', 'Object', 'Array', 'Date', 'Regex', 'Function', 
	'Boolean', 'Error', 'TypeError', 'Number']; 

//@method getNativeTypeUrl @returns {String}an url if given name match a native types or undefined otherwise
JsDocMaker.prototype.getNativeTypeUrl = function(name)
{
	if(_(JsDocMaker.NATIVE_TYPES).contains(name))
	{
		return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/' + name;
	}

	var customTypeUrl;
	_(this.customNativeTypes).each(function(val, key)
	{
		if(key===name)
		{
			//TODO: support wildcard like $(name) for inserting the name in the given url dynamically
			customTypeUrl = val;
		}
	});
	return customTypeUrl;
}; 

},{"../core/class":3,"underscore":1}],23:[function(require,module,exports){
// @module recurse-plugin-containers - a plugin to be used by concrete plugins to iterate on all 
// nodes after some interesting stages. by calling recurseAST. 
// The objective is that other concrete plugins register here and so the AST recursion is made 
// ONCE instead of using recurseAST in each of them.


var JsDocMaker = require('../core/class'); 
var PluginContainer = require('../core/plugin'); 
require('./util'); 
var _ = require('underscore'); 

// @class AfterTypeBindingRecurseASTPluginContainer it is both a plugin and a plugin container @extends PluginContainer
var AfterTypeBindingRecurseASTPluginContainer = function()
{
	return PluginContainer.apply(this, arguments); 
};
AfterTypeBindingRecurseASTPluginContainer.prototype = _({}).extend(PluginContainer.prototype);
_(AfterTypeBindingRecurseASTPluginContainer.prototype).extend(
{
	name: 'AfterTypeBindingRecurseASTPluginContainer'

	// for each AST node all child plugins will be executed - the objective is to recurse the ast only once.
,	execute: function(options)
	{
		// debugger;
		//TODO: this logic doesn't respect priority - don't copy and paste this logic here - define a cisitor method in super
		var result = null, self = this;
		options.jsdocmaker.recurseAST(function(node)
		{
			_(self.plugins).each(function(plugin) 
			{
				result = plugin.execute(node, plugin);
			}); 
		}); 
		return result; 
	}
}); 


var plugin = new AfterTypeBindingRecurseASTPluginContainer();

//@module shortjsdoc @class JsDocMaker @property {AfterTypeBindingRecurseASTPluginContainer} afterTypeBindingRecurseASTPlugins
JsDocMaker.prototype.afterTypeBindingRecurseASTPlugins = plugin; 

JsDocMaker.prototype.afterTypeBindingPlugins.add(plugin); 
},{"../core/class":3,"../core/plugin":6,"./util":26,"underscore":1}],24:[function(require,module,exports){
/*
@module shortjsdoc.plugin.text-marks-references

It is based on text-marks plugin to give support to @?class @?method @?module @?property @?event and @?ref  text marks. 

They will be binded to referenced nodes. The @?ref can bind anything passed as absolute name but it is less performant. 

Also it contains the implementation for @?link

*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

var textMarksReferencesPlugin = {

	name: 'text-marks-references'

,	execute: function(options)
	{
		var currentClass
		,	self = this
		,	classMemberNameDic = {
				method: 'methods'
			,	property: 'properties'
			,	event: 'events'
			}; 

		options.jsdocmaker.recurseAST(function(node)
		{
			if(node.annotation==='class')
			{
				currentClass = node;
			}
			_(node.textMarks).each(function(mark, key)
			{
				if(mark.binding)
				{
					return;
				}
				if(mark.name==='link')
				{
					var linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g; 
					var result = linkRegex.exec(mark.arg); 
					if(result && result.length >= 3)
					{
						mark.linkLabel = result[1]; 
						mark.linkUrl = result[2]; 
					}
				}
				else if(mark.name==='class')
				{
					mark.binding = self.bindClass(mark, currentClass, options.jsdocmaker) || {annotation: 'class', name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='module')
				{
					mark.binding = self.bindModule(mark, currentClass, options.jsdocmaker) || {annotation: 'module', name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='method' || mark.name==='property' || mark.name==='event')
				{
					mark.binding = self.bindClassMember(mark, currentClass, options.jsdocmaker, [classMemberNameDic[mark.name]]) || {annotation: mark.name, name: mark.name, error:'NAME_NOT_FOUND'};
				}
				else if(mark.name==='ref')
				{
					mark.binding = self.bindModule(mark, currentClass, options.jsdocmaker); 
					if(!mark.binding)
					{
						mark.binding = self.bindClass(mark, currentClass, options.jsdocmaker); 
					}
					if(!mark.binding)
					{
						mark.binding = self.bindClassMember(mark, currentClass, options.jsdocmaker, [classMemberNameDic['method'], classMemberNameDic['property'], classMemberNameDic['event']]) || {annotation: mark.name, name: mark.name, error:'NAME_NOT_FOUND'}; 
					}
				}
			}); 
		});
	}

	//@method bindClassMember binds a method, property or event using the marking  @param {String} what can be method, property, event
,	bindClassMember:function(mark, currentClass, maker, what)
	{
		var binded;
		if(currentClass)
		{
			_(what).each(function(member)
			{
				if(currentClass[member] && currentClass[member][mark.arg])
				{
					binded = currentClass[member][mark.arg];
				}
			});
		}
		if(!binded)
		{
			//the assume absolute method name
			var className = mark.arg.substring(0, mark.arg.lastIndexOf('.')); 
			var c = maker.data.classes[className]; 
			if(!c)
			{
				return;//return {name: '', error: 'NAME_NOT_FOUND'}; // this is probably an error on the text don't do anything.
			}
			_(what).each(function(member)
			{
				if(!binded)
				{
					if(c[member])
					{
						var simpleName = mark.arg.substring(mark.arg.lastIndexOf('.') + 1, mark.arg.length);
						binded = c[member][simpleName];
					}					
				}
			}); 		
		}
		return binded;
	} 

,	bindClass: function(mark, currentClass, maker)
	{
		var self=this
		,	binded = maker.parseSingleTypeString(mark.arg, currentClass);
		if(_(binded).isArray() && binded.length)
		{
			binded = binded[0]; 
		}
		if(!binded || binded.error === 'NAME_NOT_FOUND')
		{
			binded = self.findClass(mark.arg, maker); 			
		}
		return binded;
	}

,	findClass: function(name, maker)
	{
		var binded;
		_(maker.data.classes).each(function(c, absoluteName)
		{
			if(absoluteName === name)
			{
				binded = c;
			}
		}); 
		return binded;
	}

,	bindModule: function(mark, currentClass, maker)
	{
		var binded;
		_(maker.data.modules).each(function(m, module_name)
		{
			if(module_name === mark.arg)
			{
				binded = m;
			}
		}); 
		return binded;
	}
}

JsDocMaker.prototype.afterTypeBindingPlugins.add(textMarksReferencesPlugin); 





},{"../core/class":3,"underscore":1}],25:[function(require,module,exports){
/*
@module shortjsdoc.plugin.text-marks

TODO: markings should be done 100% on post processing. 

this is a meta plugin that allow to define marks inside a text. markings like @?foo something will be replaced with 
a unique string key and evaluate functions and store the result in the AST under the node 'textMarks' property.

Other concrete plugins then can expose a certain functionality, for example

@module client 
@class MyClass The attributes of this class are given and well explained the server service that poblate this 
model with JSON @?see server.MyService.Attributes

##History

This tool born with the neccesity of java's @see. We consider using templates (underscore,handlebars) but discarded because we cannot introduce any new 
reserved characters or complexity. An approach with template would allow also to call a function. 

But finally the idea of markins is more compatible and enrich the AST and don't add a postprocessing that complicate the syntax. 

##Implementation notes

Why @?see and not @see ? Because @see will break the simple syntax @annotation name text. We don't want to break 
the basic syntax even if we would easily do w a preprocessing plugin replacing @see with a no annotation mark. 
*/

var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@class TextMarksAfterParseNodePlugin @extends JsDocMakerPlugin a plugin executed at afterParseNodePlugin that implements the text-marks feature. 
var textMarksAfterParseNodePlugin = {

	name: 'text-marks'

,	execute: function(options)
	{
		var node = options.node
		,	self = this;

		node.text = node.text || ''; 

		var replaceHandler = function(all, name, arg)
		{
			node.textMarks = node.textMarks || {}; 
			var mark = options.jsdocmaker.getUnique('_shortjsdoc_textmarkplugin_');
			node.textMarks[mark] = {name:name,arg:arg}; 
			return mark; 
		}; 

		// first expressions like this: @?link "[This is a link](http://google.com)"
		var regex = /@\?([a-zA-Z0-9_\.]+)\s+"([^"]+)"/g; 
		node.text = node.text.replace(regex, replaceHandler); 

		// and then expressions like this: @?ref foo.bar.Class.method2
		regex = /@\?([a-zA-Z0-9_\.]+)\s+([^\s]+)/g; 
		node.text = node.text.replace(regex, replaceHandler); 
	}
}; 

JsDocMaker.prototype.afterParseUnitSimplePlugins.add(textMarksAfterParseNodePlugin); 





// afterTypeBindingPlugins


},{"../core/class":3,"underscore":1}],26:[function(require,module,exports){
//TODO: move this file to core/recurseAST.js
//@module shortjsdoc @class JsDocMaker
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@method recurseAST An utility method that can be used in extensions to visit all the ast nodes and types of the AST recursively. Children are visited first. JsDocMaker.recurseAST can be used for visiting nodes through AST. The same for Types, this is visiting all subtypes of a complex type. 
//@param {Function} fn a visitor for all the nodes
//@param {Function} fn_type a visitor for all the nodes' types
JsDocMaker.prototype.recurseAST = function(fn, fn_type, fn_end)
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		self.recurseASTClass(c, fn, fn_type); 
	});
	_(self.data.modules).each(function(m)
	{
		fn.apply(m, [m]); 
	});
	fn_end && fn_end();
}; 

JsDocMaker.prototype.recurseASTClass = function(c, fn, fn_type)
{
	if(!c)
	{
		return;
	}
	fn.apply(c, [c]);
	_(c.methods).each(function(m)
	{
		fn.apply(m, [m]); 
		_(m.params).each(function(p)
		{
			p.parentNode=m;
			fn.apply(p, [p]); 
			JsDocMaker.recurseType(p.type, fn_type, p); 
		}); 
		if(m.returns)
		{
			m.returns.parentNode=m;
			fn.apply(m.returns, [m.returns]);
			JsDocMaker.recurseType(m.returns.type, fn_type, m); 
		}
		_(m.throws).each(function(t)
		{
			fn.apply(t, [t]); 
			JsDocMaker.recurseType(t.type, fn_type, t); 
		}); 
	}); 

	_(c.properties).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	}); 
	_(c.events).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	}); 
	_(c.attributes).each(function(p)
	{
		fn.apply(p, [p]);
		JsDocMaker.recurseType(p.type, fn_type, p);
	});
	if (c.extends)
	{
		fn.apply(c.extends, [c.extends]);
		JsDocMaker.recurseType(c.extends.type, fn_type, c);
	}
}
// @method recurseType will recurse the type AST - children first. 
// @param {ASTNode} type a class node @param {Function}fn @param {ASTNode} ownerNode @static 
JsDocMaker.recurseType = function(type, fn, ownerNode)
{
	if(!type || !fn)
	{
		return;
	}
	if(_(type).isArray())
	{
		_(type).each(function(t)
		{
			JsDocMaker.recurseType(t, fn, ownerNode); 
		}); 
	}
	else if(!type.annotation || type.annotation !== 'class')
	{
		_(type.properties).each(function(prop)
		{
			JsDocMaker.recurseType(prop, fn, ownerNode); 
		}); 
		_(type.params).each(function(param)
		{
			JsDocMaker.recurseType(param, fn, ownerNode); 
		}); 		
	}


	// console.log('recurseType', type.name, ownerNode.absoluteName|| ownerNode.name)
	fn(type, ownerNode); 
}; 


JsDocMaker.prototype.getUnique = function(prefix)
{
	this.counter = this.counter || 0;
	prefix = prefix || ''; 
	this.counter++;
	return prefix + this.counter;
}
},{"../core/class":3,"underscore":1}]},{},[11]);
