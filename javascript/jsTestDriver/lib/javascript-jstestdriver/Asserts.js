/*
 * Copyright 2009 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
function expectAsserts(count) {
  jstestdriver.expectedAssertCount = count;
};


function fail(msg) {
  var err = new Error(msg);

  err.name = 'AssertError';
  throw err;
};


function isBoolean_(bool) {
  if (typeof(bool) != 'boolean') {
    this.fail('Not a boolean: ' + this.prettyPrintEntity_(bool));
  }
};


function prettyPrintEntity_(entity) {
  var str = JSON.stringify(entity);
  if (!str) {
    if (typeof entity === 'function') {
      return "[function]";
    }
    return "[" + typeof entity + "]";
  }
  return str;
};


function argsWithOptionalMsg_(args, length) {
  var copyOfArgs = [];
  // make copy because it's bad practice to change a passed in mutable
  // And to ensure we aren't working with an arguments array. IE gets bitchy.
  for(var i = 0; i < args.length; i++) {
    copyOfArgs.push(args[i]);
  }
  var min = length - 1;

  if (args.length < min) {
    this.fail("expected at least " +
        min + " arguments, got " + args.length);
  } else if (args.length == length) {
    copyOfArgs[0] += " ";
  } else {
    copyOfArgs.unshift("");
  }
  return copyOfArgs;
}


function assertTrue(msg, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 2);
  jstestdriver.assertCount++;

  isBoolean_(args[1]);
  if (args[1] != true) {
    this.fail(args[0] + 'expected true but was '
        + this.prettyPrintEntity_(args[1]));
  }
  return true;
};


function assertFalse(msg, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 2);
  jstestdriver.assertCount++;

  isBoolean_(args[1]);
  if (args[1] != false) {
    this.fail(args[0] + 'expected false but was ' +
        this.prettyPrintEntity_(args[1]));
  }
  return true;
};


function assertEquals(msg, expected, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 3);
  jstestdriver.assertCount++;
  msg = args[0];
  expected = args[1];
  actual = args[2];

  if (!compare_(expected, actual)) {
    this.fail(msg + 'expected ' + this.prettyPrintEntity_(expected) +
        ' but was ' + this.prettyPrintEntity_(actual) + '');
  }
  return true;
};


function compare_(expected, actual) {
  var key = null;

  // Do we compare an Array or an Object?
  // 'null' and 'undefined' are of type 'object' therefore the extra check is
  // required.
  if (expected !== undefined && typeof(expected) == 'object') {
    var actualLength   = 0;
    var expectedLength = 0;
    // If an array is expected the length of actual should be simple to
    // determine. If it is not it is undefined.
    if (expected instanceof [].constructor) {
        actualLength = actual.length;
    }
    else {
        // In case it is an object it is a little bit more complicated to
        // get the length.
        for(key in actual) {
          if (!actual.hasOwnProperty(key)) {
              continue;
          }
          ++actualLength;
        }
    }

    for (key in expected) {
      if (!expected.hasOwnProperty(key)) {
        // Do not run up the inheritance chain
        continue;
      }
      if (!compare_(expected[key], actual[key])) {
        return false;
      }
      ++expectedLength;
    }

    if (expectedLength !== actualLength) {
        return false;
    }
      
    return true;
  }

  // We are dealing with a scalar here. Simple comparison should do the trick
  if (actual != expected) {
    return false;
  }

  // actual and expected are equal
  return true;
};


function assertNotEquals(msg, expected, actual) {
  try {
    assertEquals.apply(this, arguments);
  } catch (e) {
    if (e.name == "AssertError") {
      return true;
    }

    throw e;
  }

  var args = this.argsWithOptionalMsg_(arguments, 3);

  this.fail(args[0] + "expected " + this.prettyPrintEntity_(args[1]) +
       " not to be equal to " + this.prettyPrintEntity_(args[2]));
}


function assertSame(msg, expected, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 3);
  jstestdriver.assertCount++;

  if (!isSame_(args[2], args[1])) {
    this.fail(args[0] + 'expected ' + this.prettyPrintEntity_(args[1]) +
       ' but was ' + this.prettyPrintEntity_(args[2]));
  }
  return true;
};


function assertNotSame(msg, expected, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 3);
  jstestdriver.assertCount++;

  if (isSame_(args[2], args[1])) {
    this.fail(args[0] + 'expected not same as ' +
        this.prettyPrintEntity_(args[1]) + ' but was ' +
        this.prettyPrintEntity_(args[2]));
  }
  return true;
};


function isSame_(expected, actual) {
  return actual === expected;
};


function assertNull(msg, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 2);
  jstestdriver.assertCount++;

  if (args[1] !== null) {
    this.fail(args[0] + 'expected null but was ' +
        this.prettyPrintEntity_(args[1]));
  }
  return true;
};


function assertNotNull(msg, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 2);
  jstestdriver.assertCount++;

  if (args[1] === null) {
    this.fail(args[0] + "expected not null but was null");
  }

  return true;
};


function assertUndefined(msg, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 2);
  jstestdriver.assertCount++;

  if (typeof args[1] != "undefined") {
    this.fail(args[2] + "expected undefined but was " +
        this.prettyPrintEntity_(args[1]));
  }
  return true;
};


function assertNotUndefined(msg, actual) {
  var args = this.argsWithOptionalMsg_(arguments, 2);
  jstestdriver.assertCount++;

  if (typeof args[1] == "undefined") {
    this.fail(args[0] + 'expected not undefined but was undefined');
  }
  return true;
};


function assertNaN(msg, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    jstestdriver.assertCount++;

    if (!isNaN(args[1])) {
        this.fail(args[0] + "expected to be NaN but was " + args[1]);
    }

    return true;
}


function assertNotNaN(msg, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    jstestdriver.assertCount++;

    if (isNaN(args[1])) {
        this.fail(args[0] + "expected not to be NaN");
    }

    return true;
}


function assertException(msg, callback, error) {
    if (arguments.length == 1) {
        // assertThrows(callback)
        callback = msg;
        msg = "";
    } else if (arguments.length == 2) {
        if (typeof callback != "function") {
            // assertThrows(callback, type)
            error = callback;
            callback = msg;
            msg = "";
        } else {
            // assertThrows(msg, callback)
            msg += " ";
        }
    } else {
        // assertThrows(msg, callback, type)
        msg += " ";
    }

    jstestdriver.assertCount++;

    try {
        callback();
    } catch(e) {
        if (e.name == "AssertError") {
            throw e;
        }

        if (error && e.name != error) {
            this.fail(msg + "expected to throw " +
                error + " but threw " + e.name);
        }

        return true;
    }

    this.fail(msg + "expected to throw exception");
}


function assertNoException(msg, callback) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    jstestdriver.assertCount++;

    try {
        args[1]();
    } catch(e) {
        fail(args[0] + "expected not to throw exception, but threw " +
            e.name + " (" + e.message + ")");
    }
}


function assertArray(msg, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    jstestdriver.assertCount++;

    if (!jstestdriver.jQuery.isArray(args[1])) {
        fail(args[0] + "expected to be array, but was " +
            this.prettyPrintEntity_(args[1]));
    }
}


function assertTypeOf(msg, expected, value) {
    var args = this.argsWithOptionalMsg_(arguments, 3);
    jstestdriver.assertCount++;
    var actual = typeof args[2];

    if (actual != args[1]) {
        this.fail(args[0] + "expected to be " + args[1] + " but was " + actual);
    }

    return true;
}


function assertBoolean(msg, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    return assertTypeOf(args[0], "boolean", args[1]);
}


function assertFunction(msg, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    return assertTypeOf(args[0], "function", args[1]);
}


function assertObject(msg, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    return assertTypeOf(args[0], "object", args[1]);
}


function assertNumber(msg, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    return assertTypeOf(args[0], "number", args[1]);
}


function assertString(msg, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 2);
    return assertTypeOf(args[0], "string", args[1]);
}


function assertMatch(msg, regexp, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 3);
    var isUndef = typeof args[2] == "undefined";
    jstestdriver.assertCount++;

    if (isUndef || !args[1].test(args[2])) {
        actual = (isUndef ? undefined : this.prettyPrintEntity_(args[2]));
        this.fail(args[0] + "expected " + actual + " to match " + args[1]);
    }

    return true;
}


function assertNoMatch(msg, regexp, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 3);
    jstestdriver.assertCount++;

    if (args[1].test(args[2])) {
        this.fail(args[0] + "expected " + this.prettyPrintEntity_(args[2]) +
            " not to match " + args[1]);
    }

    return true;
}


function assertTagName(msg, tagName, element) {
    var args = this.argsWithOptionalMsg_(arguments, 3);
    var actual = args[2] && args[2].tagName;

    if (String(actual).toUpperCase() != args[1].toUpperCase()) {
      this.fail(args[0] + "expected tagName to be " + args[1] + " but was " +
                actual);
    }
    return true;
}


function assertClassName(msg, className, element) {
    var args = this.argsWithOptionalMsg_(arguments, 3);
    var actual = args[2] && args[2].className;
    var regexp = new RegExp("(^|\\s)" + args[1] + "(\\s|$)");

    try {
        this.assertMatch(args[0], regexp, actual);
    } catch (e) {
        actual = this.prettyPrintEntity_(actual);
        this.fail(args[0] + "expected class name to include " +
            this.prettyPrintEntity_(args[1]) + " but was " + actual);
    }

    return true;
}


function assertElementId(msg, id, element) {
    var args = this.argsWithOptionalMsg_(arguments, 3);
    var actual = args[2] && args[2].id;
    jstestdriver.assertCount++;

    if (actual !== args[1]) {
        this.fail(args[0] + "expected id to be " + args[1] + " but was " +
            actual);
    }

    return true;
}


function assertInstanceOf(msg, constructor, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 3);
    jstestdriver.assertCount++;

    if (!(Object(args[2]) instanceof args[1])) {
        var expected = args[1] && args[1].name || args[1];
        var pretty = this.prettyPrintEntity_(args[2]);
        this.fail(args[0] + "expected " + pretty + " to be instance of " +
            expected);
    }

    return true;
}


function assertNotInstanceOf(msg, constructor, actual) {
    var args = this.argsWithOptionalMsg_(arguments, 3);
    jstestdriver.assertCount++;

    if (Object(args[2]) instanceof args[1]) {
        var expected = args[1] && args[1].name || args[1];
        var pretty = this.prettyPrintEntity_(args[2]);
        this.fail(args[0] + "expected " + pretty + " not to be instance of " +
            expected);
    }

    return true;
}

var assert = assertTrue;
