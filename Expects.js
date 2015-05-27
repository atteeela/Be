function Expect(value) {
    var constraint = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        constraint[_i - 1] = arguments[_i];
    }
    if (Expect.util.isArguments(value)) {
        var args = value;
        if (constraint.length === 0) {
            for (var i = -1; ++i < args.length;) {
                var a = args[i];
                if (a === void 0) {
                    if (Expect.util.report("Argument " + (i + 1) + " is undefined, and this function does not accept null, undefined, or NaN arguments."))
                        debugger;
                    return;
                }
                else if (a === null) {
                    if (Expect.util.report("Argument " + (i + 1) + " is null, and this function does not accept null, undefined, or NaN arguments."))
                        debugger;
                    return;
                }
                else if (a !== a) {
                    if (Expect.util.report("Argument " + (i + 1) + " is NaN, and this function does not accept null, undefined, or NaN arguments."))
                        debugger;
                    return;
                }
            }
        }
        else {
            var signature = Expect.util.parseSignature(constraint);
            if (Expect.util.hasErrors) {
                if (Expect.util.flush())
                    debugger;
                return;
            }
            /* Bad input checks */
            if (Expect.util.checkLength(signature, args)) {
                if (Expect.util.flush())
                    debugger;
                return;
            }
            Expect.util.checkArguments(signature, args);
            if (Expect.util.hasErrors) {
                if (Expect.util.flush())
                    debugger;
                return;
            }
        }
    }
    else if (constraint.length) {
        if (!Expect.util.checkConstraint(value, constraint)) {
            if (Expect.util.report("Failed expectation: The value " + Expect.util.stringifyValue(value) + " does not comply with the constraint: " + Expect.util.stringifyParameter(constraint), value))
                debugger;
            return value;
        }
    }
    else if (!value) {
        if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not loosely equal (==) to true.", value))
            debugger;
        return value;
    }
    return value;
}
/**  */ //
var Expect;
(function (Expect) {
    /** An error that is generated when an expectation fails. */ //
    var ExpectationError = (function () {
        function ExpectationError(message) {
            this.message = message;
            this.name = "ExpectationError";
            this.value = "(No value is associated with this expectation failure.)";
            this.stack = "";
            this.message = message;
            this.stack = (new Error()).stack || "";
        }
        return ExpectationError;
    })();
    Expect.ExpectationError = ExpectationError;
    ExpectationError.prototype = new Error;
    /** Expectation that the execution point will never reach the current location. */ //
    function never() {
        if (Expect.util.report("An invalid location has been reached in the program."))
            debugger;
    }
    Expect.never = never;
    /** Expectation that the function is never called directly, and the only implementations exist in derived types. */ //
    function abstract() {
        if (Expect.util.report("This function must be overridden by an inheritor."))
            debugger;
    }
    Expect.abstract = abstract;
    /** Expectation that the property is read only. Intended for use in a setter function. */ //
    function readOnly() {
        if (Expect.util.report("This property is read-only."))
            debugger;
    }
    Expect.readOnly = readOnly;
    /** Expectation that the current function is not implemented. */ //
    function notImplemented() {
        if (Expect.util.report("This function has not been implemented."))
            debugger;
    }
    Expect.notImplemented = notImplemented;
    /** Expectation that value is null, undefined, NaN, false, 0, or ''. */ //
    function not(value) {
        if (value && Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not loosely equal (==) false.", value))
            debugger;
        return value;
    }
    Expect.not = not;
    /** Expectation that value is not undefined. */ //
    function notUndefined(value) {
        if (value === void 0 && Expect.util.report("The value is undefined."))
            debugger;
        return value;
    }
    Expect.notUndefined = notUndefined;
    /** Expectation that value is not null, undefined, or NaN. */ //
    function notNull(value) {
        if (value === null) {
            if (Expect.util.report("The value is null."))
                debugger;
            return value;
        }
        if (value === void 0) {
            if (Expect.util.report("The value is undefined."))
                debugger;
            return value;
        }
        if (value !== value) {
            if (Expect.util.report("The value is NaN."))
                debugger;
            return value;
        }
        return value;
    }
    Expect.notNull = notNull;
    /**
    Expectation that value is a non-empty or whitespace string, a non-empty array, or a non-function object with keys.
    */ //
    function notEmpty(value) {
        if (typeof value === "string") {
            if (!value || !/[\s]*/g.test(value))
                if (Expect.util.report("The string is empty, or contains only whitespace."))
                    debugger;
            return value;
        }
        if (value instanceof Array) {
            if (!value.length)
                if (Expect.util.report("The array is empty."))
                    debugger;
            return value;
        }
        if (value instanceof Object && !(value instanceof Function)) {
            var hasKeys = false;
            for (var key in value) {
                hasKeys = true;
                break;
            }
            if (!hasKeys)
                if (Expect.util.report("The object is empty."))
                    debugger;
            return value;
        }
        if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a non-empty string, array, or object.", value))
            debugger;
        return value;
    }
    Expect.notEmpty = notEmpty;
    /** Expectation that value is a number greater than or equal to 0 (mainly used to check .indexOf()). */ //
    function positive(value) {
        if ((value !== +value || value < 0) && Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a number greater than or equal to 0.", value))
            debugger;
        return value;
    }
    Expect.positive = positive;
    /** Expectation that value is a string. */ //
    function string(value) {
        if (typeof value !== "string" && Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a string.", value))
            debugger;
        return value;
    }
    Expect.string = string;
    /** Expectation that value is a number. */ //
    function number(value) {
        if ((typeof value !== "number" || value !== value) && Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a number.", value))
            debugger;
        return value;
    }
    Expect.number = number;
    /** Expectation that value is a boolean. */ //
    function boolean(value) {
        if (value !== !!value && Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a boolean.", value))
            debugger;
        return value;
    }
    Expect.boolean = boolean;
    /** Expectation that value is a primitive (string, number, or boolean). */ //
    function primitive(value) {
        if (typeof value !== "string" && (typeof value !== "number" || value !== value) && value !== !!value)
            if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a primitive (string, number, boolean).", value))
                debugger;
        return value;
    }
    Expect.primitive = primitive;
    /** Expectation that value is a string containing an email address. */ //
    function email(value) {
        if (typeof value !== "string" || !value || value.length < 6 || value.length > 254) {
            if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " could not be parsed as an email address.", value))
                debugger;
            return value;
        }
        if (!/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/.test(value)) {
            if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " could not be parsed as an email address.", value))
                debugger;
            return value;
        }
        var parts = value.split("@");
        if (parts[0].length > 64) {
            if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " could not be parsed as an email address.", value))
                debugger;
            return value;
        }
        for (var _i = 0, _a = parts[1].split("."); _i < _a.length; _i++) {
            var domainPart = _a[_i];
            if (domainPart.length > 63)
                if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " could not be parsed as an email address.", value))
                    debugger;
        }
        return value;
    }
    Expect.email = email;
    /** Expectation that value is a Date object. */ //
    function date(value) {
        if (!(value instanceof Date) && Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a Date object.", value))
            debugger;
        return value;
    }
    Expect.date = date;
    /** Expectation that value is a function. */ //
    function func(value) {
        if (typeof value !== "function" && Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a function.", value))
            debugger;
        return value;
    }
    Expect.func = func;
    /** Expectation that value is a TypeScript-style enum. */ //
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
        if (!isEnum && Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not a TypeScript-style enum type.", value))
            debugger;
        return value;
    }
    Expect.enumeration = enumeration;
    /**
    Expectation that value is an array.
    Use of the rest parameter checks that the items of the array are all of one of the specified types.
    Valid values are String, Number, Boolean, null, undefined, a constructor function, or primitive literals.
    */ //
    function array(value) {
        var constraint = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            constraint[_i - 1] = arguments[_i];
        }
        if (Array.isArray ? !Array.isArray(value) : Object.prototype.toString["call"](value) !== "[object Array]")
            if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not an array.", value))
                debugger;
        if (constraint.length) {
            for (var i = -1; ++i < value.length;) {
                if (!Expect.util.checkConstraint(value[i], constraint)) {
                    if (Expect.util.report("Array item " + i + " is " + Expect.util.stringifyValue(value[i]) + ", which does not comply with the constraint: " + Expect.util.stringifyParameter(constraint), value))
                        debugger;
                    return value;
                }
            }
        }
        return value;
    }
    Expect.array = array;
    /**
    Expectation that value is an object.
    Use of the rest parameter checks that the members of the object are all of one of the specified types.
    Valid values are String, Number, Boolean, null, undefined, or a constructor function.
    */ //
    function object(value) {
        var constraint = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            constraint[_i - 1] = arguments[_i];
        }
        if (!(value instanceof Object)) {
            if (Expect.util.report("The value " + Expect.util.stringifyValue(value) + " is not an object.", value))
                debugger;
            return value;
        }
        if (constraint.length) {
            for (var key in value) {
                if (!Expect.util.checkConstraint(value[key], constraint)) {
                    if (Expect.util.report(("The ." + key + " property in the object is " + Expect.util.stringifyValue(value[key]) + ", which does not comply with the constraint: ") + Expect.util.stringifyParameter(constraint), value))
                        debugger;
                    return value;
                }
            }
        }
        return value;
    }
    Expect.object = object;
    /** Expectation that the argument set to comply with one of the specified signatures (overloads). */ //
    function overloads(args) {
        var overloads = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            overloads[_i - 1] = arguments[_i];
        }
        if (!overloads || !overloads.length) {
            if (Expect.util.report("Expect.overloads requires an array of signatures.", args))
                debugger;
            return;
        }
        var passesOneOverload = false;
        var signatures = [];
        for (var i = -1; ++i < overloads.length;) {
            var signature = Expect.util.parseSignature(overloads[i]);
            if (Expect.util.hasErrors) {
                if (Expect.util.flush())
                    debugger;
                return;
            }
            signatures.push(signature);
            if (!Expect.util.checkLength(signature, args))
                if (!Expect.util.checkArguments(signature, args))
                    return;
        }
        var overloadsText = "";
        for (var _a = 0; _a < signatures.length; _a++) {
            var sig = signatures[_a];
            overloadsText += "\r\n\t" + Expect.util.stringifySignature(sig);
        }
        if (Expect.util.report("The arguments do not comply with any of the " + overloads.length + " overloads:" + overloadsText, args))
            debugger;
    }
    Expect.overloads = overloads;
    Expect.rest = function () { };
    Expect.any = function () { };
    Expect.optional = function () { };
    /** The handler function to call when an expectation fails. */ //
    Expect.handler = null;
    /** Whether or not exceptions should be thrown when an expectation fails. */ //
    Expect.useExceptions = false;
    /**
    Whether or not debugger; statements should be triggers when an Expectation fails.
    Automatically disables after the first Expectation fails.
    */ //
    Expect.useDebuggers = true;
})(Expect || (Expect = {}));
var Expect;
(function (Expect) {
    var util;
    (function (util) {
        /** Reports the specified error and returns whether debugger; statements are enabled. */ //
        function report(message, value) {
            var hasValue = !(value instanceof Signature) && arguments.length > 1;
            message = value instanceof Signature ?
                "Invalid signature: " + message :
                "Failed expectation: " + message;
            if (reportDeferred) {
                reportMessages.push(message);
                if (hasValue) {
                    reportValue = value;
                    reportValueSet = true;
                }
                return false;
            }
            else {
                var error = new Expect.ExpectationError(message);
                if (hasValue)
                    error.value = value;
                var handlerError = null;
                if (Expect.handler instanceof Function) {
                    try {
                        Expect.handler(error);
                    }
                    catch (e) {
                        handlerError = e;
                    }
                }
                if (Expect.useExceptions || typeof console !== "undefined")
                    throw error;
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
                return Expect.useDebuggers;
            }
        }
        util.report = report;
        /** Flushes out all deferred errors. */ //
        function flush() {
            var messages = reportMessages.join("\r\n");
            reportMessages.length = 0;
            var value = reportValue;
            reportValue = null;
            var valueSet = reportValueSet;
            reportValueSet = false;
            return valueSet ? report(messages, value) : report(messages);
        }
        util.flush = flush;
        /** Executes the specified function, returning an errors that are collected (without breaking on them immediately). */ //
        function defer(fn) {
            reportDeferred = true;
            fn();
            reportDeferred = false;
        }
        util.defer = defer;
        /** */ //
        function hasErrors() {
            return !!reportMessages.length;
        }
        util.hasErrors = hasErrors;
        var reportMessages = [];
        var reportValue = null;
        var reportValueSet = false;
        var reportDeferred = false;
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
            defer(function () {
                if (args.length < minLength)
                    report("The signature expects" + (minLength < signature.parameters.length ? " at least" : "") + " " + minLength + " parameter" + (minLength > 1 ? "s" : "") + " (" + stringifySignature(signature) + "), but " + args.length + " were specified.", args);
                else if (args.length > signature.parameters.length && !signature.hasRest)
                    report("The signature expects" + (signature.optionalPoint > -1 ? " at most" : "") + " " + signature.parameters.length + " parameter" + (signature.parameters.length > 1 ? "s" : "") + " (" + stringifySignature(signature) + "), but " + args.length + " were specified.", args);
            });
        }
        util.checkLength = checkLength;
        /** Returns the message to display if there is a type error with one or more of the arguments. */ //
        function checkArguments(signature, args) {
            defer(function () {
                for (var i = -1; ++i < args.length;) {
                    var arg = args[i];
                    var paramIdx = i >= signature.parameters.length ? signature.parameters.length - 1 : i;
                    var param = signature.parameters[paramIdx];
                    for (var key in param)
                        if (param[key] === true && (key in Expect))
                            Expect[key](arg);
                    if (!util.checkConstraint(arg, param.types))
                        report("Argument " + (i + 1) + " is " + stringifyValue(arg) + ", but it's expected to comply with the constraint: " + stringifyParameter(param) + ".", args);
                }
            });
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
            defer(function () {
                for (var i = -1; ++i < rawSignature.length;) {
                    var constraint = rawSignature[i] instanceof Array ? rawSignature[i] : [rawSignature[i]];
                    if (extract(constraint, Expect.rest)) {
                        if (i !== rawSignature.length - 1) {
                            report("Only the last parameter be a rest parameter.", rawSignature);
                            break;
                        }
                        if (extract(constraint, Expect.optional)) {
                            report("Rest parameters can not be optional.", rawSignature);
                            break;
                        }
                        signature.hasRest = true;
                    }
                    if (extract(constraint, Expect.optional)) {
                        if (signature.optionalPoint < 0) {
                            var op = signature.optionalPoint;
                            signature.optionalPoint = i;
                        }
                    }
                    else if (signature.optionalPoint > -1 && !signature.hasRest) {
                        report("Required parameters must go before optional and rest parameters.", rawSignature);
                        break;
                    }
                    signature.parameters.push(parseParameter(constraint));
                }
            });
            return signature;
        }
        util.parseSignature = parseSignature;
        /** */ //
        function parseParameter(constraint) {
            var param = new Parameter();
            var constraintArray = constraint instanceof Array ? constraint : [constraint];
            for (var n = constraintArray.length; n-- > 0;) {
                var expectName = util.getExpectName(constraintArray[n]);
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
                    additionalOptions.push(getExpectName(Expect.optional));
                else if (sig.hasRest && i === sig.parameters.length - 1)
                    additionalOptions.push(getExpectName(Expect.rest));
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
                return {
                    name: /^function\s([a-z_$]{1,})/i.exec(fnText)[1] || "",
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
        /** Returns the name of the expect function. */ //
        function getExpectName(constraint) {
            return constraint instanceof Function &&
                constraint.expectName &&
                Expect[constraint.expectName] === constraint ?
                constraint.expectName : "";
        }
        util.getExpectName = getExpectName;
        /** */ //
        function isArguments(a) {
            return a instanceof Object && a.constructor === Object && a.length >= 0 && a.toString() === "[object Arguments]";
        }
        util.isArguments = isArguments;
        /** */ //
        function initialize() {
            var passable = [
                Expect.not,
                Expect.notEmpty,
                Expect.positive,
                Expect.email,
                Expect.enumeration,
                Expect.optional,
                Expect.rest,
                Expect.any
            ];
            for (var key in Expect)
                if (passable.indexOf(Expect[key]) > -1)
                    Expect[key].expectName = key;
        }
        initialize();
        var Signature = (function () {
            function Signature() {
                this.parameters = [];
                this.optionalPoint = -1;
                this.hasRest = false;
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
            }
            return Parameter;
        })();
        util.Parameter = Parameter;
    })(util = Expect.util || (Expect.util = {}));
})(Expect || (Expect = {}));
var Enumeration;
(function (Enumeration) {
    Enumeration[Enumeration["one"] = 0] = "one";
    Enumeration[Enumeration["two"] = 1] = "two";
    Enumeration[Enumeration["three"] = 2] = "three";
})(Enumeration || (Enumeration = {}));
(function () {
    Expect.useDebuggers = false;
    var pass = function (fn) {
        var failed = false;
        Expect.handler = function () { return failed = true; };
        fn();
        if (failed) {
            console.log("Expect code didn't work.");
            debugger;
        }
    };
    var fail = function (fn) {
        var passed = true;
        Expect.handler = function () { return passed = false; };
        fn();
        if (passed) {
            console.log("Expect code didn't work.");
            debugger;
        }
    };
    // Basic tests
    (function () {
        var img = new Image();
        pass(function () { return Expect(img); });
        pass(function () { return Expect(img, Image); });
        fail(function () { return Expect(false); });
        fail(function () { return Expect(0); });
        fail(function () { return Expect(null, String, Number); });
    })();
    // Semantic expectations tests
    (function () {
        fail(function () { return Expect.never(); });
        fail(function () { return Expect.abstract(); });
        fail(function () { return Expect.notImplemented(); });
        fail(function () { return Expect.not(1); });
        pass(function () { return Expect.not(0); });
        pass(function () { return Expect.not(""); });
        pass(function () { return Expect.not(false); });
        pass(function () { return Expect.not(null); });
        pass(function () { return Expect.not(void 0); });
        fail(function () { return Expect.notNull(null); });
        fail(function () { return Expect.notNull(undefined); });
        pass(function () { return Expect.notEmpty([1]); });
        pass(function () { return Expect.notEmpty({ a: 1 }); });
        fail(function () { return Expect.notEmpty({}); });
        fail(function () { return Expect.notEmpty([]); });
        fail(function () { return Expect.notEmpty(""); });
        fail(function () { return Expect.notEmpty(null); });
        fail(function () { return Expect.notEmpty(0); });
        fail(function () { return Expect.notEmpty(Math); });
        pass(function () { return Expect.positive(1); });
        pass(function () { return Expect.positive(0); });
        fail(function () { return Expect.positive(-0.1); });
        pass(function () { return Expect.notUndefined(Math.floor); });
        fail(function () { return Expect.notUndefined(Math["non-existent"]); });
        pass(function () { return Expect.string(""); });
        fail(function () { return Expect.string(0); });
        fail(function () { return Expect.string(new String("")); });
        pass(function () { return Expect.number(0); });
        fail(function () { return Expect.number("0"); });
        fail(function () { return Expect.number(new Number(0)); });
        pass(function () { return Expect.boolean(false); });
        pass(function () { return Expect.boolean(true); });
        fail(function () { return Expect.boolean("0"); });
        fail(function () { return Expect.boolean(new Boolean(false)); });
        pass(function () { return Expect.primitive(0); });
        pass(function () { return Expect.primitive("0"); });
        pass(function () { return Expect.primitive(false); });
        fail(function () { return Expect.primitive({}); });
        fail(function () { return Expect.primitive([]); });
        fail(function () { return Expect.primitive(new String("")); });
        pass(function () { return Expect.email("jimbo@gmail.com"); });
        pass(function () { return Expect.email("jimbo@some-really-long-email.something.extension"); });
        pass(function () { return Expect.email("jimbos+email@some-really-long-email.something.extension"); });
        fail(function () { return Expect.email("jimbo_gmail.com"); });
        fail(function () { return Expect.email(""); });
        pass(function () { return Expect.func(function () { }); });
        fail(function () { return Expect.func({}); });
        pass(function () { return Expect.enumeration(Enumeration); });
        fail(function () { return Expect.enumeration({}); });
        fail(function () { return Expect.enumeration([0, 1, 2]); });
    })();
    // Contents tests
    (function () {
        pass(function () { return Expect.array([]); });
        fail(function () { Expect.array(arguments); });
        pass(function () { return Expect.array(["[]"]); });
        pass(function () { return Expect.array([1, 2, 3], Number); });
        pass(function () { return Expect.array([1, 2, 3], Number, String); });
        pass(function () { return Expect.array([1, 2, "3"], Number, String); });
        fail(function () { return Expect.array([1, 2, 3], String); });
        fail(function () { return Expect.array([1, 2, 3, null], Number); });
        pass(function () { return Expect.array([null, void 0, NaN]); });
        pass(function () { return Expect.array([new Image(), new Image(), new Image()], Image); });
        fail(function () { return Expect.array([0, null], Number); });
        fail(function () { return Expect.array([0, void 0], Number); });
        fail(function () { return Expect.array([0, NaN], Number); });
        pass(function () { return Expect.object({}); });
        pass(function () { return Expect.object(Math); });
        fail(function () { return Expect.object("{}"); });
        pass(function () { return Expect.object({ a: null, b: void 0, c: NaN }); });
        pass(function () { return Expect.object({ a: 1, b: null, c: void 0 }, Number, null, void 0); });
        pass(function () { return Expect.object({ a: 1, b: "" }, Number, String, Boolean); });
        pass(function () { return Expect.object({ a: 1, b: "", c: {}, d: [] }, Number, String, Object, Array); });
        fail(function () { return Expect.object({ a: 1, b: "" }, Number, Boolean); });
        fail(function () { return Expect.object({ a: 1, b: [] }, Number); });
    })();
    // Basic signature tests
    (function () {
        function fn() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            Expect(arguments, Number);
        }
        pass(function () { return fn(0); });
        fail(function () { return fn(null); });
        fail(function () { return fn(void 0); });
        fail(function () { return fn(NaN); });
        fail(function () { return fn({}); });
        fail(function () { return fn(new Number(0)); });
        fail(function () { return fn(0, 0); });
        fail(function () { return fn(); });
        function fnAllowNull() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            Expect(arguments, Number, [Number, Expect.positive], [Number, null], [Number, void 0], [Number, null, void 0]);
        }
        pass(function () { return fnAllowNull(0, 1, 0, 0, 0); });
        pass(function () { return fnAllowNull(0, 1, null, void 0, 0); });
        pass(function () { return fnAllowNull(0, 0, null, void 0, void 0); });
        pass(function () { return fnAllowNull(0, 0, null, void 0, null); });
        fail(function () { return fnAllowNull(null, -1, 0, 0, 0); });
        fail(function () { return fnAllowNull(0, 1, void 0, null, 0); });
        function fnSpecificValues(s, n) {
            Expect(arguments, ["str", "ing"], [1, 2, null]);
        }
        pass(function () { return fnSpecificValues("str", 1); });
        pass(function () { return fnSpecificValues("ing", 1); });
        pass(function () { return fnSpecificValues("ing", 2); });
        pass(function () { return fnSpecificValues("ing", null); });
        fail(function () { return fnSpecificValues("string", 1); });
        fail(function () { return fnSpecificValues("str", 3); });
    })();
    // Rest parameter tests
    (function () {
        function rest() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            Expect(arguments, Expect.rest);
        }
        pass(function () { return rest(); });
        pass(function () { return rest(1, ""); });
        fail(function () { return rest(undefined); });
        fail(function () { return rest(null); });
        fail(function () { return rest(1, null, 1); });
        function typedRestWithOthers(s, n) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            Expect(arguments, String, Number, [String, Expect.rest]);
        }
        pass(function () { return typedRestWithOthers("", 0); });
        pass(function () { return typedRestWithOthers("", 0, ""); });
        pass(function () { return typedRestWithOthers("", 0, "", ""); });
        fail(function () { return typedRestWithOthers("", 0, 0); });
        fail(function () { return typedRestWithOthers("", 0, "", 0); });
        fail(function () { return typedRestWithOthers(0, 0, "", "", "", ""); });
    })();
    // Optional parameter tests
    (function () {
        function optionals() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            Expect(arguments, Number, Expect.optional, [Number, Expect.optional]);
        }
        pass(function () { return optionals(0); });
        pass(function () { return optionals(0, 0); });
        pass(function () { return optionals(0, Math); });
        pass(function () { return optionals(0, console, 0); });
        fail(function () { return optionals(0, 0, "0"); });
        function optionalsWithRest() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            Expect(arguments, Number, [Number, Expect.optional], [Number, Expect.rest]);
        }
        pass(function () { return optionalsWithRest(-1); });
        pass(function () { return optionalsWithRest(0, 0); });
        pass(function () { return optionalsWithRest(0, 0, 0, 0, 0, 0); });
        fail(function () { return optionalsWithRest("0"); });
        fail(function () { return optionalsWithRest(0, "0"); });
        fail(function () { return optionalsWithRest(0, 0, "0"); });
    })();
    // Overloads tests
    (function () {
        function overloadable() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            Expect.overloads(arguments, [String, Number, RegExp], [Number, Object], [Number, [Object, null]], [Function, Number, String, String]);
        }
        pass(function () { return overloadable("", 0, /re/); });
        pass(function () { return overloadable(0, {}); });
        pass(function () { return overloadable(0, null); });
        pass(function () { return overloadable(function () { }, 0, "", ""); });
        fail(function () { return overloadable(null, {}); });
        fail(function () { return overloadable("", 0, "", ""); });
        fail(function () { Expect["overloads"](arguments); });
    })();
    console.log("All tests have run.");
})();
//# sourceMappingURL=Expects.js.map