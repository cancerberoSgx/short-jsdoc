(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
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
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

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
  _.VERSION = '1.7.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var createCallback = function(func, context, argCount) {
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
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
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
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
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
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
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
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
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
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
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
      iteratee = _.iteratee(iteratee, context);
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

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
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
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {
        if (!i || seen !== value) result.push(value);
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);
        if (_.indexOf(seen, computed) < 0) {
          seen.push(computed);
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
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
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
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

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
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
      var address = hasher ? hasher.apply(this, arguments) : key;
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
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

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
        clearTimeout(timeout);
        timeout = null;
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

      if (last < wait && last > 0) {
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

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed before being called N times.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
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
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
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
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
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

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
  if (typeof /./ !== 'function') {
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

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
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
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
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
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
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
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
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
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

// BINDING / post processing

//@class TypeBinding a datatype with an association between types names in source code and parsed class nodes. 
//It support generic types (recursive)
//@property {TypeBinding} type
//@property {Array<TypeBinding>} params - the generic types params array. For example the params for {Map<String,Apple>} is [StringBynding]
//@property {String} nativeTypeUrl - if this is a native type - this 


//@class JsDocMaker
//@method parseTypeString @return {TypeBinding} or nulll in case the given type cannot be parsed
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
					self.error('Invalid Custom Type: '+typeString, ', baseClass: ', JSON.stringify(baseClass)); 
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
				self.error('Invalid Type: '+typeString, ', baseClass: ', JSON.stringify(baseClass)); 
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
				self.error('Invalid Type: '+typeString, ', baseClass: ', JSON.stringify(baseClass)); 
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
	var c = null, out = typeObject, self=this;
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

//@method bindClass @param {String}name @param {Object} baseClass
//TODO: using a internal map this could be done faster
JsDocMaker.prototype.bindClass = function(name, baseClass)
{
	//search all classes that matches the name
	var classesWithName = _(_(this.data.classes).values()).filter(function(c)
	{
		return c.name===name;//JsDocMaker.stringEndsWith(c.name, name); 
	});
	//search classes of the module
	var moduleClasses = _(classesWithName).filter(function(c)
	{
		return JsDocMaker.startsWith(c.module.name, baseClass.module.name); 
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
		return o;		
	}
	else
	{
		return c;
	}
}; 

// @method simpleName @param {String} name @return {String}
JsDocMaker.prototype.simpleName = function(name)
{
	var a = name.split(JsDocMaker.ABSOLUTE_NAME_SEPARATOR);
	return a[a.length-1]; 
}; 







},{"./class":3,"underscore":1}],3:[function(require,module,exports){
// @class JsDocMaker
// Main jsdoc parser utility. It accepts a valid js source code String and returns a JavaScript object with a jsdoc AST, this is an object
// with classes and modules array that users can use to easily access jsdocs information, for example, parsed.classes.Apple.methods.getColor
// use the parseFile method for this! This will return the AST, if you want to perform more enrichment and type binding, then use 
// postProccess and postProccessBinding methods after.

var _ = require('underscore'); 

var JsDocMaker = function(options)
{	
	//@property {Object<String,String>} customNativeTypes name to url map that the user can modify to register new native types b givin its url.
	this.customNativeTypes = this.customNativeTypes || {};
	this.annotationRegexp = /(\s+@\w+)/gi;
	this.typeParsers = {};
	this.inputSource = [];
	this.options = options || {};
}; 


JsDocMaker.DEFAULT_CLASS = 'Object'; 
JsDocMaker.DEFAULT_MODULE = '__DefaultModule'; 
JsDocMaker.ABSOLUTE_NAME_SEPARATOR = '.'; 
JsDocMaker.MULTIPLE_TEXT_SEPARATOR = '\n\n'; 

//expose
/* jshint evil:true*/
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

require('./postprocess'); 

require('./binding'); 
require('./type-parsing'); 

module.exports = JsDocMaker;
},{"./binding":2,"./class":3,"./parse":5,"./postprocess":6,"./preprocess":7,"./type-parsing":8,"./util":9}],5:[function(require,module,exports){
var JsDocMaker = require('./class'); 
var esprima = JsDocMaker.require('esprima');
var _ = require('underscore'); 

//PARSING AND PREPROCESSING

//@property {Array<Function>}commentPreprocessors
JsDocMaker.prototype.commentPreprocessors = []; 

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
	this.data.filenames = this.data.filenames || {}; 

	_(this.commentPreprocessors).each(function(preprocessor)
	{
		preprocessor.apply(self, [self]); 
	});

	_(this.comments).each(function(node)
	{
		var regex = /((?:@class)|(?:@method)|(?:@property)|(?:@method)|(?:@module)|(?:@event)|(?:@constructor)|(?:@filename))/gi; 
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
				parsed.file = currentFile;

				delete parsed.theRestString; 

				//Note: here is the (only) place were the 'primary tags' are implemented 
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

					//if the class was already defined we want to preserve all the definitions texts
					if(self.data.classes[parsed.absoluteName])
					{
						if(self.data.classes[parsed.absoluteName].text !== parsed.text)
						{
							self.data.classes[parsed.absoluteName].text += JsDocMaker.MULTIPLE_TEXT_SEPARATOR + parsed.text; 
						}
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

				//? @property and @event are treated similarly
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

				//? @param is children of @method
				else if(parsed.annotation === 'param' && currentClass)
				{
					if(!currentMethod)
					{
						self.error('param before method: ', parsed);
					}
					else
					{						
						currentMethod.params = currentMethod.params || {};
						currentMethod.params[parsed.name] = parsed; 
					}
				}
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

	if(comment.type==='Line')
	{
		str = JsDocMaker.stringFullTrim(str); 
		regexp = /\s*@(\w+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}(.*)\s*/i; 
		result = regexp.exec(str);
	}
	else
	{
		str = JsDocMaker.stringTrim(str); 
		regexp = /\s*@(\w+)\s*(\{[\w<>\|, #:\(\)\.]+\}){0,1}\s*([\w\._\$]+){0,1}([.\s\w\W]*)/gmi;
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
	splitted.splice(0,1); 
	var ret = {
		annotation: result[1]
	,	type: result[2]
	,	name: result[3]
	,	text: JsDocMaker.stringTrim(text||'')
	,	theRestString: JsDocMaker.stringTrim(splitted.join(''))
	};

	return ret;
}; 

},{"./class":3,"underscore":1}],6:[function(require,module,exports){
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

//POST PROCESSING


//@property {Array<Function>}postProccessors
JsDocMaker.prototype.postProccessors = []; 

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
		_(c.constructors).each(function(co){
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
	
	//at this points we have all our modules and classes - now we normalize extend, methods and params and also do the type binding. 
	_(self.data.classes).each(function(c)
	{
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

		_(methods).each(function(method)
		{
			//method.param property
			var params = _(method.children||[]).filter(function(child)
			{
				child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'param'; 
			}); 
			method.params = params; 

			method.ownerClass = c.absoluteName;				
			method.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 

			_(method.params).each(function(param)
			{
				if(_(param.type).isString())
				{
					param.typeOriginalString = param.type; 
					param.type = self.parseTypeString(param.type, c) || param.type;						
				}
			}); 

			//method throws property
			var throw$ = _(method.children||[]).filter(function(child)
			{
				// child.text = JsDocMaker.stringTrim(child.text||''); 
				return child.annotation === 'throw' || child.annotation === 'throws'; 
			}); 
			method.throws = throw$; 
			// method.ownerClass = c.absoluteName;				
			// method.absoluteName = c.absoluteName + JsDocMaker.ABSOLUTE_NAME_SEPARATOR + method.name; 
			_(method.throws).each(function(t)
			{
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
	});
};

},{"./class":3,"underscore":1}],7:[function(require,module,exports){
var JsDocMaker = require('./class'); 
var _ = require('underscore'); 

//COMMENT PREPROCESSORS

//@method preprocessComments do an initial preprocesing on the comments erasing those marked to be ignored, and fixing its text to support alternative syntax.
JsDocMaker.prototype.preprocessComments = function()
{
	//we do the parsing block by block,
	for (var i = 0; i < this.comments.length; i++) 
	{
		var node = this.comments[i]; 
		node.value = node.value || ''; 

		// fix styled comment blocks with '*' as new line prefix
		if(node.type === 'Block')
		{
			// Note: syntax /** - not necesary to implement
			node.value = node.value.replace(/\n \*/gi, '\n');
		}

		// remove comments that starts with ignoreCommentPrefix
		if(JsDocMaker.startsWith(JsDocMaker.stringTrim(node.value), this.ignoreCommentPrefix))
		{
			//if \n * is detected it is fixed to not count the decorative '*'
			this.comments.splice(i, 1); //remove this node
		}
	}
}; 
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.preprocessComments); 


//@method fixUnamedAnnotations - our regexp format expect an anotation with a name. So for enabling unamed annotations we do this dirty fix, this is add a name to 
//precondition
JsDocMaker.prototype.fixUnamedAnnotations = function()
{
	_(this.comments).each(function(node)
	{
		if(node.value)
		{
			node.value = node.value.replace(/@constructor/gi, '@constructor n'); 
			// node.value = node.value.replace(/@throw/gi, '@throws n'); 
			// node.value = node.value.replace(/@throws/gi, '@throws n'); 
			node.value = node.value.replace(/(@\w+)\s*$/gi, '$1 dummy ');
			node.value = node.value.replace(/(@\w+)\s+(@\w+)/gi, '$1 dummy $2');
		}
	});
};
//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.fixUnamedAnnotations); 


// @method unifyLineComments unify adjacents Line comment nodes into one in the ns.syntax.coments generated after visiting. 
JsDocMaker.prototype.unifyLineComments = function()
{
	var i = 0;
	
	//@property {String} lineCommentSeparator used to separate each Line comment type text
	this.lineCommentSeparator = this.lineCommentSeparator || ' '; 

	while(i < this.comments.length - 1)
	{
		var c = this.comments[i]
		,	next = this.comments[i+1]; 

		var sss = JsDocMaker.stringFullTrim(this.data.source.substring(c.range[1], next.range[0])); 
		if (c.type==='Line' && next.type==='Line' && !sss)
		{
			c.value += ' ' + this.lineCommentSeparator + ' ' + next.value; 
			c.range[1] = next.range[1]; 
			this.comments.splice(i+1, 1); 
		}
		else
		{
			i++;
		}
	}
}; 

//install it as comment preprocessor plugin!
JsDocMaker.prototype.commentPreprocessors.push(JsDocMaker.prototype.unifyLineComments); 

},{"./class":3,"underscore":1}],8:[function(require,module,exports){
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


},{"../objectTypeParser/parser.js":11,"./class":3,"underscore":1}],9:[function(require,module,exports){
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

//@mmethod error @param {String}msg
JsDocMaker.prototype.error = function(msg)
{
	console.error('Error detected: ' + msg); 
	throw msg;
}; 



},{"./class":3,"underscore":1}],10:[function(require,module,exports){
var JsDocMaker = require('./core/main'); 

require('./plugin/main.js'); 

module.exports = JsDocMaker;
},{"./core/main":4,"./plugin/main.js":14}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

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

},{"../core/class":3,"underscore":1}],13:[function(require,module,exports){
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

// this should be commented
// it is an exmaple of a plugin that parse literal types like @param {#obj({p1:P1,p2:P2,...})} param1

// CUSTOM TPE PLUGIN literalObjectParse - requires literalObjectParser.js - it adds support 
// for the custom type syntax #obj({p1:P1,p2:P2,...})to express literal objects
// syntax: {#obj(prop1:String,prop2:Array<Apple>)}
// DEPRECATED - turn it into a unit test showing an  example of plugin 
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


},{"../core/class":3,"underscore":1}],14:[function(require,module,exports){
'strict mode'; 

var JsDocMaker = require('../core/main.js'); 

require('./native-types.js'); 
require('./modifiers.js'); 
require('./inherited.js');
require('./util.js');
require('./literal-object.js');

module.exports = JsDocMaker; 
},{"../core/main.js":4,"./inherited.js":12,"./literal-object.js":13,"./modifiers.js":15,"./native-types.js":16,"./util.js":17}],15:[function(require,module,exports){
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

},{"../core/class":3,"underscore":1}],16:[function(require,module,exports){
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

},{"../core/class":3,"underscore":1}],17:[function(require,module,exports){
var JsDocMaker = require('../core/class'); 
var _ = require('underscore'); 

//@method recurseAST An utility method that can be used in extensions to visit all the ast nodes with given function 
//@param {Function} fn
JsDocMaker.prototype.recurseAST = function(fn)
{
	var self = this;
	_(self.data.classes).each(function(c)
	{
		_(c.methods).each(function(m)
		{
			fn.apply(m, [m]); 
			//TODO: params
		}); 

		_(c.properties).each(function(p)
		{
			fn.apply(p, [p]); 
		}); 
		//TODO: events
	});
	_(self.data.modules).each(function(m)
	{
		fn.apply(m, [m]); 
	});
}; 


},{"../core/class":3,"underscore":1}]},{},[10]);