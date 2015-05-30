function Be(value) {
    var constraint = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        constraint[_i - 1] = arguments[_i];
    }
    if (Be.util.isArguments(value)) {
        var args = value;
        if (constraint.length === 0) {
            for (var i = -1; ++i < args.length;) {
                var a = args[i];
                if (a === void 0) {
                    if (Be.util.report("Argument " + (i + 1) + " is undefined, and this function does not accept null, undefined, or NaN arguments."))
                        debugger;
                    return null;
                }
                else if (a === null) {
                    if (Be.util.report("Argument " + (i + 1) + " is null, and this function does not accept null, undefined, or NaN arguments."))
                        debugger;
                    return null;
                }
                else if (a !== a) {
                    if (Be.util.report("Argument " + (i + 1) + " is NaN, and this function does not accept null, undefined, or NaN arguments."))
                        debugger;
                    return null;
                }
            }
        }
        else {
            var overloads = [[]];
            for (var _a = 0; _a < constraint.length; _a++) {
                var item_1 = constraint[_a];
                Be.util.isArguments(item_1) ?
                    overloads.push([]) :
                    overloads[overloads.length - 1].push(item_1);
            }
            var signatures = [];
            for (var _b = 0; _b < overloads.length; _b++) {
                var ov = overloads[_b];
                var signature = Be.util.parseSignature(ov);
                if (signature.parseError) {
                    if (Be.util.report(signature.parseError, signature))
                        debugger;
                    return null;
                }
                signatures.push(signature);
            }
            if (overloads.length === 1) {
                var signature = signatures[0];
                /* Bad input checks */
                var checkLengthMessage = Be.util.checkLength(signature, args);
                if (checkLengthMessage) {
                    if (Be.util.report(checkLengthMessage, args))
                        debugger;
                    return null;
                }
                var checkArgumentsMessage = Be.util.checkArguments(signature, args);
                if (checkArgumentsMessage) {
                    if (Be.util.report(checkArgumentsMessage, args))
                        debugger;
                    return null;
                }
            }
            else {
                for (var _c = 0; _c < signatures.length; _c++) {
                    var signature = signatures[_c];
                    if (!Be.util.checkLength(signature, args))
                        if (!Be.util.checkArguments(signature, args))
                            return null;
                }
                var signaturesText = "";
                for (var _d = 0; _d < signatures.length; _d++) {
                    var sig = signatures[_d];
                    signaturesText += "\r\n\t" + Be.util.stringifySignature(sig);
                }
                if (Be.util.report("The arguments do not comply with any of the " + signatures.length + " overloads:" + signaturesText, args))
                    debugger;
                return null;
            }
        }
    }
    else if (constraint.length) {
        if (!Be.util.checkConstraint(value, constraint)) {
            if (Be.util.report("The value " + Be.util.stringifyValue(value) + " does not comply with the constraint: " + Be.util.stringifyParameter(constraint), value))
                debugger;
            return value;
        }
    }
    else if (!value) {
        if (Be.util.report("The value " + Be.util.stringifyValue(value) + " is not loosely equal (==) to true.", value))
            debugger;
        return value;
    }
    return value;
}
/**  */ //
var Be;
(function (Be) {
    /** An error that is generated when an expectation fails. */ //
    var BeError = (function () {
        function BeError(message) {
            this.message = message;
            this.name = "BeError";
            this.value = "(No value is associated with this expectation failure.)";
            this.stack = "";
            this.message = message;
            this.stack = (new Error()).stack || "";
        }
        return BeError;
    })();
    Be.BeError = BeError;
    BeError.prototype = new Error;
    /** Fails with the specified error message. */ //
    function helpful(message) {
        if (Be.util.report(message))
            debugger;
        return null;
    }
    Be.helpful = helpful;
    /** Makes sure that the execution point will never reach the current location. */ //
    function broken(value) {
        var message = "An invalid location has been reached in the program.";
        if (arguments.length === 1) {
            if (Be.util.report(message, value))
                debugger;
        }
        else if (Be.util.report(message))
            debugger;
        return null;
    }
    Be.broken = broken;
    /** Makes sure that the function is never called directly, and the only implementations exist in derived types. */ //
    function abstract() {
        if (Be.util.report("This function must be overridden by an inheritor."))
            debugger;
        return null;
    }
    Be.abstract = abstract;
    /** Makes sure that the property is read only. Intended for use in a setter function. */ //
    function readOnly() {
        if (Be.util.report("This property is read-only."))
            debugger;
        return null;
    }
    Be.readOnly = readOnly;
    /** Makes sure that the current function is not implemented. */ //
    function notImplemented() {
        if (Be.util.report("This function has not been implemented."))
            debugger;
        return null;
    }
    Be.notImplemented = notImplemented;
    /** Makes sure that value is not null, undefined, NaN, false, 0, or ''. */ //
    function not(value) {
        if (value && Be.util.report("The value " + Be.util.stringifyValue(value) + " is not loosely equal (==) false.", value))
            debugger;
        return value;
    }
    Be.not = not;
    /** Makes sure that value is not undefined. */ //
    function notUndefined(value) {
        if (value === void 0 && Be.util.report("The value is undefined."))
            debugger;
        return value;
    }
    Be.notUndefined = notUndefined;
    /** Makes sure that value is not null, undefined, or NaN. */ //
    function notNull(value) {
        if (value === null) {
            if (Be.util.report("The value is null."))
                debugger;
        }
        else if (value === void 0) {
            if (Be.util.report("The value is undefined."))
                debugger;
        }
        else if (value !== value) {
            if (Be.util.report("The value is NaN."))
                debugger;
        }
        return value;
    }
    Be.notNull = notNull;
    /**
    Makes sure that value is a non-empty or whitespace string, a non-empty array, or a non-function object with keys.
    */ //
    function notEmpty(value) {
        if (typeof value === "string") {
            if (!value || !/[\s]*/g.test(value))
                if (Be.util.report("The string is empty, or contains only whitespace."))
                    debugger;
        }
        else if (value instanceof Array) {
            if (!value.length)
                if (Be.util.report("The array is empty."))
                    debugger;
        }
        else if (value instanceof Object && !(value instanceof Function)) {
            var hasKeys = false;
            for (var key in value) {
                hasKeys = true;
                break;
            }
            if (!hasKeys)
                if (Be.util.report("The object is empty."))
                    debugger;
        }
        else {
            if (Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a non-empty string, array, or object.", value))
                debugger;
        }
        return value;
    }
    Be.notEmpty = notEmpty;
    /** Makes sure that value is a number greater than or equal to 0 (mainly used to check .indexOf()). */ //
    function positive(value) {
        if ((value !== +value || value < 0) && Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a number greater than or equal to 0.", value))
            debugger;
        return value;
    }
    Be.positive = positive;
    /** Makes sure that value is a string. */ //
    function string(value) {
        if (typeof value !== "string" && Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a string.", value))
            debugger;
        return value;
    }
    Be.string = string;
    /** Makes sure that value is a number. */ //
    function number(value) {
        if ((typeof value !== "number" || value !== value) && Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a number.", value))
            debugger;
        return value;
    }
    Be.number = number;
    /** Makes sure that value is a boolean. */ //
    function boolean(value) {
        if (value !== !!value && Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a boolean.", value))
            debugger;
        return value;
    }
    Be.boolean = boolean;
    /** Makes sure that value is a primitive (string, number, or boolean). */ //
    function primitive(value) {
        if (typeof value !== "string" && (typeof value !== "number" || value !== value) && value !== !!value)
            if (Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a primitive (string, number, boolean).", value))
                debugger;
        return value;
    }
    Be.primitive = primitive;
    /** Makes sure that value is a string containing an email address. */ //
    function email(value) {
        if (typeof value !== "string" || !value || value.length < 6 || value.length > 254) {
            if (Be.util.report("The value " + Be.util.stringifyValue(value) + " could not be parsed as an email address.", value))
                debugger;
            return value;
        }
        if (!/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/.test(value)) {
            if (Be.util.report("The value " + Be.util.stringifyValue(value) + " could not be parsed as an email address.", value))
                debugger;
            return value;
        }
        var parts = value.split("@");
        if (parts[0].length > 64) {
            if (Be.util.report("The value " + Be.util.stringifyValue(value) + " could not be parsed as an email address.", value))
                debugger;
            return value;
        }
        for (var _i = 0, _a = parts[1].split("."); _i < _a.length; _i++) {
            var domainPart = _a[_i];
            if (domainPart.length > 63)
                if (Be.util.report("The value " + Be.util.stringifyValue(value) + " could not be parsed as an email address.", value))
                    debugger;
        }
        return value;
    }
    Be.email = email;
    /** Makes sure that value is a Date object. */ //
    function date(value) {
        if (!(value instanceof Date) && Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a Date object.", value))
            debugger;
        return value;
    }
    Be.date = date;
    /** Makes sure that value is a function. */ //
    function func(value) {
        if (typeof value !== "function" && Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a function.", value))
            debugger;
        return value;
    }
    Be.func = func;
    /** Makes sure that value is a TypeScript-style enum. */ //
    function enumeration(value) {
        var isEnum = true;
        if (Object.prototype.toString.call(value) !== "[object Object]") {
            isEnum = false;
        }
        else {
            var keys = (function () {
                var out = [];
                for (var key in value)
                    out.push(key);
                return out;
            })();
            if (!keys.length || keys.length % 2)
                isEnum = false;
            else
                for (var i = -1; ++i < keys.length / 2;)
                    if (value[value[i]] !== i)
                        isEnum = false;
        }
        if (!isEnum && Be.util.report("The value " + Be.util.stringifyValue(value) + " is not a TypeScript-style enum type.", value))
            debugger;
        return value;
    }
    Be.enumeration = enumeration;
    /**
    Makes sure that value is an array.
    Use of the rest parameter checks that the items of the array are all of one of the specified types.
    Valid values are String, Number, Boolean, null, undefined, a constructor function, or primitive literals.
    */ //
    function array(value) {
        var constraint = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            constraint[_i - 1] = arguments[_i];
        }
        if (Array.isArray ? !Array.isArray(value) : Object.prototype.toString["call"](value) !== "[object Array]")
            if (Be.util.report("The value " + Be.util.stringifyValue(value) + " is not an array.", value))
                debugger;
        if (constraint.length) {
            for (var i = -1; ++i < value.length;) {
                if (!Be.util.checkConstraint(value[i], constraint)) {
                    if (Be.util.report("Array item " + i + " is " + Be.util.stringifyValue(value[i]) + ", which does not comply with the constraint: " + Be.util.stringifyParameter(constraint), value))
                        debugger;
                    return value;
                }
            }
        }
        return value;
    }
    Be.array = array;
    /**
    Makes sure that value is an object.
    Use of the rest parameter checks that the members of the object are all of one of the specified types.
    Valid values are String, Number, Boolean, null, undefined, or a constructor function.
    */ //
    function object(value) {
        var constraint = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            constraint[_i - 1] = arguments[_i];
        }
        if (!(value instanceof Object)) {
            if (Be.util.report("The value " + Be.util.stringifyValue(value) + " is not an object.", value))
                debugger;
        }
        else if (constraint.length) {
            for (var key in value) {
                if (!Be.util.checkConstraint(value[key], constraint)) {
                    if (Be.util.report(("The ." + key + " property in the object is " + Be.util.stringifyValue(value[key]) + ", which does not comply with the constraint: ") + Be.util.stringifyParameter(constraint), value))
                        debugger;
                    return value;
                }
            }
        }
        return value;
    }
    Be.object = object;
    Be.rest = function () { };
    Be.any = function () { };
    Be.optional = function () { };
    /** The handler function to call when an expectation fails. */ //
    Be.handler = null;
    /** Whether or not exceptions should be thrown when an expectation fails. */ //
    Be.exceptional = false;
    /**
    Whether or not debugger statements should be triggered on a failure. Automatically disables after the first failure.
    */ //
    Be.debuggable = true;
})(Be || (Be = {}));
var Be;
(function (Be) {
    var util;
    (function (util) {
        /** Reports the specified error and returns whether debugger; statements are enabled. */ //
        function report(message, value) {
            var hasValue = !(value instanceof Signature) && arguments.length > 1;
            message = value instanceof Signature ?
                "Invalid signature: " + message :
                "Failed expectation: " + message;
            var error = new Be.BeError(message);
            if (hasValue)
                error.value = value;
            var handlerError = null;
            if (Be.handler instanceof Function) {
                try {
                    Be.handler(error);
                }
                catch (e) {
                    handlerError = e;
                }
            }
            if (!Be.exceptional || typeof console !== "undefined") {
                var output = function (msg) {
                    return typeof console.error === "function" ?
                        console.error(msg) :
                        console.log(msg);
                };
                output(message);
                if (handlerError) {
                    console.log("%cYour error handler threw an error.", "color: red, font-size: 150%");
                    output(handlerError);
                }
            }
            else
                throw error;
            return Be.debuggable;
        }
        util.report = report;
        /** Returns whether the value is one of the obvious errors (NaN, null unless allowed, undefined unless allowed). */ //
        function checkObvious(value, constraint) {
            /* NaN is always an error. */
            if (value !== value)
                return false;
            var scanFor = function (val) {
                for (var i = -1; ++i < constraint.length;)
                    if (constraint[i] === val)
                        return true;
                return false;
            };
            /* undefined is an error if it's not explicitly allowed. */
            if (value === void 0)
                return scanFor(void 0);
            /* null is an error if it's not explicitly allowed. */
            if (value === null)
                return scanFor(null);
            return true;
        }
        util.checkObvious = checkObvious;
        /** Returns whether the specified value is congruent with one (or more) of the specified constraint. */ //
        function checkConstraint(value, constraint) {
            if (!checkObvious(value, constraint))
                return false;
            if (!constraint.length)
                return true;
            for (var _i = 0; _i < constraint.length; _i++) {
                var part = constraint[_i];
                if ((typeof value === "string" || +value === value || !!value === value) && value === part)
                    return true;
                else if (part === null && value === null)
                    return true;
                else if (part === void 0 && value === void 0)
                    return true;
                else if (part === String) {
                    if (typeof value === "string")
                        return true;
                }
                else if (part === Number) {
                    if (typeof value === "number")
                        return true;
                }
                else if (part === Boolean) {
                    if (typeof value === "boolean")
                        return true;
                }
                else if (part === Array && value instanceof Array)
                    return true;
                else if (part === Function && value instanceof Function)
                    return true;
                else if (typeof part === "function" && value instanceof part)
                    return true;
            }
            return false;
        }
        util.checkConstraint = checkConstraint;
        /** Returns the message to display if the wrong number of arguments were passed. */ //
        function checkLength(signature, args) {
            var minLength = signature.parameters.length;
            if (signature.optionalPoint > -1)
                minLength = signature.optionalPoint;
            else if (signature.hasRest)
                minLength--;
            if (args.length < minLength)
                return "The signature expects" + (minLength < signature.parameters.length ? " at least" : "") + " " + minLength + " parameter" + (minLength > 1 ? "s" : "") + " (" + stringifySignature(signature) + "), but " + args.length + " were specified.";
            if (args.length > signature.parameters.length && !signature.hasRest)
                return "The signature expects" + (signature.optionalPoint > -1 ? " at most" : "") + " " + signature.parameters.length + " parameter" + (signature.parameters.length > 1 ? "s" : "") + " (" + stringifySignature(signature) + "), but " + args.length + " were specified.";
            return "";
        }
        util.checkLength = checkLength;
        /** Returns the message to display if there is a type error with one or more of the arguments. */ //
        function checkArguments(signature, args) {
            for (var i = -1; ++i < args.length;) {
                var arg = args[i];
                var paramIdx = i >= signature.parameters.length ? signature.parameters.length - 1 : i;
                var param = signature.parameters[paramIdx];
                if (!util.checkConstraint(arg, param.types))
                    return "Argument " + (i + 1) + " is " + stringifyValue(arg) + ", but it's expected to comply with the constraint: " + stringifyParameter(param) + ".";
            }
            return "";
        }
        util.checkArguments = checkArguments;
        /** Creates a signature AST-thing from the input array. */ //
        function parseSignature(rawSignature) {
            var signature = new Signature();
            var extract = function (constraint, expectMarker) {
                if (constraint instanceof Array) {
                    var extracted = false;
                    for (var n = constraint.length; n-- > 0;) {
                        if (constraint[n] === expectMarker) {
                            constraint.splice(n, 1);
                            extracted = true;
                        }
                    }
                    return extracted;
                }
                return constraint === expectMarker;
            };
            for (var i = -1; ++i < rawSignature.length;) {
                var constraint = rawSignature[i] instanceof Array ? rawSignature[i] : [rawSignature[i]];
                if (extract(constraint, Be.rest)) {
                    if (i !== rawSignature.length - 1) {
                        signature.parseError = "Only the last parameter be a rest parameter.";
                        break;
                    }
                    if (extract(constraint, Be.optional)) {
                        signature.parseError = "Rest parameters can not be optional.";
                        break;
                    }
                    signature.hasRest = true;
                }
                if (extract(constraint, Be.optional)) {
                    if (signature.optionalPoint < 0) {
                        var op = signature.optionalPoint;
                        signature.optionalPoint = i;
                    }
                }
                else if (signature.optionalPoint > -1 && !signature.hasRest) {
                    signature.parseError = "Required parameters must go before optional and rest parameters.";
                    break;
                }
                signature.parameters.push(parseParameter(constraint));
            }
            return signature;
        }
        util.parseSignature = parseSignature;
        /** */ //
        function parseParameter(constraint) {
            var param = new Parameter();
            var constraintArray = constraint instanceof Array ? constraint : [constraint];
            for (var n = constraintArray.length; n-- > 0;) {
                var expectName = util.getBeFunctionName(constraintArray[n]);
                if (expectName) {
                    if (expectName in param)
                        param[expectName] = true;
                }
                else
                    param.types.push(constraintArray[n]);
            }
            return param;
        }
        util.parseParameter = parseParameter;
        /** */ //
        function stringifySignature(signature) {
            var sig = signature instanceof Signature ?
                signature :
                parseSignature(signature);
            var stringifiedParams = [];
            for (var i = -1; ++i < sig.parameters.length;) {
                var additionalOptions = [];
                if (i >= sig.optionalPoint && (!sig.hasRest || i !== sig.parameters.length - 1))
                    additionalOptions.push(getBeFunctionName(Be.optional));
                else if (sig.hasRest && i === sig.parameters.length - 1)
                    additionalOptions.push(getBeFunctionName(Be.rest));
                stringifiedParams.push(stringifyParameter(sig.parameters[i], additionalOptions));
            }
            return stringifiedParams.join(", ");
        }
        util.stringifySignature = stringifySignature;
        /** */ //
        function stringifyParameter(parameter, additionalOptions) {
            var param = parameter instanceof Parameter ?
                parameter :
                parseParameter(parameter);
            var types = [];
            if (param.types.length === 0) {
                types.push("any");
            }
            else
                for (var _i = 0, _a = param.types; _i < _a.length; _i++) {
                    var type = _a[_i];
                    if (type === String)
                        types.push("string");
                    else if (type === Number)
                        types.push("number");
                    else if (type === Boolean)
                        types.push("boolean");
                    else if (type === Function)
                        types.push("function");
                    else if (type === Array)
                        types.push("[]");
                    else if (type === Object)
                        types.push("{}");
                    else if (type instanceof Function) {
                        var info = parseFunction(type);
                        types.push(info.name || "(unknown constructor)");
                    }
                    else
                        types.push("" + type);
                }
            var options = [];
            for (var key in param)
                if (typeof param[key] === "boolean" && param[key])
                    options.push(key);
            if (additionalOptions)
                for (var _b = 0; _b < additionalOptions.length; _b++) {
                    var ao = additionalOptions[_b];
                    options.push(ao);
                }
            return types.join(" | ") + (options.length ? " (" + options.join(", ") + ")" : "");
        }
        util.stringifyParameter = stringifyParameter;
        /** Returns a string representation of an non-compliant value passed in. */ //
        function stringifyValue(value) {
            if (value instanceof Array)
                return "(Array(" + value.length + "))";
            if (typeof value === "function") {
                var fnInfo = parseFunction(value);
                return fnInfo.name ? "(function " + fnInfo.name + ")" : "(function)";
            }
            if (value instanceof Object) {
                var stringified = value.toString();
                return /\[object [a-z0-9_$]{0,}\]/i.test(stringified) ? stringified : "(object)";
            }
            if (typeof value === "string") {
                if (value === "")
                    return "(empty string '')";
                if (value.length > 10)
                    return "(string '" + value.slice(0, 10) + "...')";
                return "(string '" + value + "')";
            }
            return "(" + value + ")";
        }
        util.stringifyValue = stringifyValue;
        /** */ //
        function parseFunction(fn) {
            if (fn instanceof Function) {
                var fnText = fn.toString();
                var extracted = /^function\s([a-z_$]{1,})/i.exec(fnText);
                return {
                    name: extracted ? extracted[1] : "",
                    isBuiltIn: /^function\s[a-z_$]{1,}\(\)[\s]{0,}{[\s]{0,}\[\snative code\s\][\s]{0,}}/gi.test(fnText)
                };
            }
            return null;
        }
        /** */ //
        function getKeys(o) {
            if (!(o instanceof Object))
                return [];
            var out = [];
            for (var _i = 0; _i < o.length; _i++) {
                var key = o[_i];
                out.push(key);
            }
            return out;
        }
        util.getKeys = getKeys;
        /** Returns the name of the Be.* function. */ //
        function getBeFunctionName(constraint) {
            return constraint instanceof Function &&
                constraint.expectName &&
                Be[constraint.expectName] === constraint ?
                constraint.expectName : "";
        }
        util.getBeFunctionName = getBeFunctionName;
        /** */ //
        function isArguments(a) {
            return a instanceof Object && a.constructor === Object && a.length >= 0 && a.toString() === "[object Arguments]";
        }
        util.isArguments = isArguments;
        /** */ //
        function initialize() {
            var passable = [
                Be.not,
                Be.notEmpty,
                Be.positive,
                Be.email,
                Be.enumeration,
                Be.optional,
                Be.rest,
                Be.any
            ];
            for (var key in Be)
                if (passable.indexOf(Be[key]) > -1)
                    Be[key].expectName = key;
        }
        initialize();
        var Signature = (function () {
            function Signature() {
                this.parameters = [];
                this.optionalPoint = -1;
                this.hasRest = false;
                this.parseError = "";
            }
            return Signature;
        })();
        util.Signature = Signature;
        var Parameter = (function () {
            function Parameter() {
                this.types = [];
                this.not = false;
                this.notEmpty = false;
                this.positive = false;
                this.enumerated = false;
                this.email = false;
                this.parseError = "";
            }
            return Parameter;
        })();
        util.Parameter = Parameter;
    })(util = Be.util || (Be.util = {}));
})(Be || (Be = {}));
//# sourceMappingURL=Be.js.map