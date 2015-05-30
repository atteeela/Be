var Enumeration;
(function (Enumeration) {
    Enumeration[Enumeration["one"] = 0] = "one";
    Enumeration[Enumeration["two"] = 1] = "two";
    Enumeration[Enumeration["three"] = 2] = "three";
})(Enumeration || (Enumeration = {}));
(function () {
    Be.debuggable = false;
    var pass = function (fn) {
        var failed = false;
        Be.handler = function () { return failed = true; };
        fn();
        if (failed) {
            console.log("Need to Be better.");
            debugger;
        }
    };
    var fail = function (fn) {
        var passed = true;
        Be.handler = function () { return passed = false; };
        fn();
        if (passed) {
            console.log("Need to Be better.");
            debugger;
        }
    };
    // Basic tests
    (function () {
        var img = new Image();
        pass(function () { return Be(img); });
        pass(function () { return Be(img, Image); });
        fail(function () { return Be(false); });
        fail(function () { return Be(0); });
        fail(function () { return Be(null, String, Number); });
    })();
    // Semantic expectations tests
    (function () {
        fail(function () { return Be.broken(); });
        fail(function () { return Be.abstract(); });
        fail(function () { return Be.notImplemented(); });
        fail(function () { return Be.not(1); });
        pass(function () { return Be.not(0); });
        pass(function () { return Be.not(""); });
        pass(function () { return Be.not(false); });
        pass(function () { return Be.not(null); });
        pass(function () { return Be.not(void 0); });
        fail(function () { return Be.notNull(null); });
        fail(function () { return Be.notNull(undefined); });
        pass(function () { return Be.notEmpty([1]); });
        pass(function () { return Be.notEmpty({ a: 1 }); });
        fail(function () { return Be.notEmpty({}); });
        fail(function () { return Be.notEmpty([]); });
        fail(function () { return Be.notEmpty(""); });
        fail(function () { return Be.notEmpty(null); });
        fail(function () { return Be.notEmpty(0); });
        fail(function () { return Be.notEmpty(Math); });
        pass(function () { return Be.positive(1); });
        pass(function () { return Be.positive(0); });
        fail(function () { return Be.positive(-0.1); });
        pass(function () { return Be.notUndefined(Math.floor); });
        fail(function () { return Be.notUndefined(Math["non-existent"]); });
        pass(function () { return Be.string(""); });
        fail(function () { return Be.string(0); });
        fail(function () { return Be.string(new String("")); });
        pass(function () { return Be.number(0); });
        fail(function () { return Be.number("0"); });
        fail(function () { return Be.number(new Number(0)); });
        pass(function () { return Be.boolean(false); });
        pass(function () { return Be.boolean(true); });
        fail(function () { return Be.boolean("0"); });
        fail(function () { return Be.boolean(new Boolean(false)); });
        pass(function () { return Be.primitive(0); });
        pass(function () { return Be.primitive("0"); });
        pass(function () { return Be.primitive(false); });
        fail(function () { return Be.primitive({}); });
        fail(function () { return Be.primitive([]); });
        fail(function () { return Be.primitive(new String("")); });
        pass(function () { return Be.email("jimbo@gmail.com"); });
        pass(function () { return Be.email("jimbo@some-really-long-email.something.extension"); });
        pass(function () { return Be.email("jimbos+email@some-really-long-email.something.extension"); });
        fail(function () { return Be.email("jimbo_gmail.com"); });
        fail(function () { return Be.email(""); });
        pass(function () { return Be.func(function () { }); });
        fail(function () { return Be.func({}); });
        pass(function () { return Be.enumeration(Enumeration); });
        fail(function () { return Be.enumeration({}); });
        fail(function () { return Be.enumeration([0, 1, 2]); });
    })();
    // Contents tests
    (function () {
        pass(function () { return Be.array([]); });
        fail(function () { Be.array(arguments); });
        pass(function () { return Be.array(["[]"]); });
        pass(function () { return Be.array([1, 2, 3], Number); });
        pass(function () { return Be.array([1, 2, 3], Number, String); });
        pass(function () { return Be.array([1, 2, "3"], Number, String); });
        fail(function () { return Be.array([1, 2, 3], String); });
        fail(function () { return Be.array([1, 2, 3, null], Number); });
        pass(function () { return Be.array([null, void 0, NaN]); });
        pass(function () { return Be.array([new Image(), new Image(), new Image()], Image); });
        fail(function () { return Be.array([0, null], Number); });
        fail(function () { return Be.array([0, void 0], Number); });
        fail(function () { return Be.array([0, NaN], Number); });
        pass(function () { return Be.object({}); });
        pass(function () { return Be.object(Math); });
        fail(function () { return Be.object("{}"); });
        pass(function () { return Be.object({ a: null, b: void 0, c: NaN }); });
        pass(function () { return Be.object({ a: 1, b: null, c: void 0 }, Number, null, void 0); });
        pass(function () { return Be.object({ a: 1, b: "" }, Number, String, Boolean); });
        pass(function () { return Be.object({ a: 1, b: "", c: {}, d: [] }, Number, String, Object, Array); });
        fail(function () { return Be.object({ a: 1, b: "" }, Number, Boolean); });
        fail(function () { return Be.object({ a: 1, b: [] }, Number); });
    })();
    // Basic signature tests
    (function () {
        function fn() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            Be(arguments, Number);
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
            Be(arguments, Number, [Number, Be.positive], [Number, null], [Number, void 0], [Number, null, void 0]);
        }
        pass(function () { return fnAllowNull(0, 1, 0, 0, 0); });
        pass(function () { return fnAllowNull(0, 1, null, void 0, 0); });
        pass(function () { return fnAllowNull(0, 0, null, void 0, void 0); });
        pass(function () { return fnAllowNull(0, 0, null, void 0, null); });
        fail(function () { return fnAllowNull(null, -1, 0, 0, 0); });
        fail(function () { return fnAllowNull(0, 1, void 0, null, 0); });
        function fnSpecificValues(s, n) {
            Be(arguments, ["str", "ing"], [1, 2, null]);
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
            Be(arguments, Be.rest);
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
            Be(arguments, String, Number, [String, Be.rest]);
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
            Be(arguments, Number, Be.optional, [Number, Be.optional]);
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
            Be(arguments, Number, [Number, Be.optional], [Number, Be.rest]);
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
            Be(arguments, String, Number, RegExp, arguments, Number, Object, arguments, Number, [Object, null], arguments, Function, Number, String, String);
        }
        pass(function () { return overloadable("", 0, /re/); });
        pass(function () { return overloadable(0, {}); });
        pass(function () { return overloadable(0, null); });
        pass(function () { return overloadable(function () { }, 0, "", ""); });
        fail(function () { return overloadable(null, {}); });
        fail(function () { return overloadable("", 0, "", ""); });
        fail(function () { overloadable(arguments); });
    })();
    console.log("All tests have run.");
})();
//# sourceMappingURL=Be.test.js.map