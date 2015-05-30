
enum Enumeration
{
	one,
	two,
	three
}

(() =>
{
	Be.debuggable = false;
	
	let pass = (fn: () => void) =>
	{
		let failed = false;
		Be.handler = () => failed = true;
		fn();
		
		if (failed)
		{
			console.log("Need to Be better.");
			debugger;
		}
	}
	
	let fail = (fn: () => void) =>
	{
		let passed = true;
		Be.handler = () => passed = false;
		fn();
		
		if (passed)
		{
			console.log("Need to Be better.");
			debugger;
		}
	}
	
	// Basic tests
	(() =>
	{
		let img = new Image();
		pass(() => Be(img));
		pass(() => Be(img, Image));
		fail(() => Be(false));
		fail(() => Be(0));
		fail(() => Be(null, String, Number));
	})();
	
	// Semantic expectations tests
	(() =>
	{
		fail(() => Be.broken());
		fail(() => Be.abstract());
		fail(() => Be.notImplemented());
		
		fail(() => Be.not(1));
		pass(() => Be.not(0));
		pass(() => Be.not(""));
		pass(() => Be.not(false));
		pass(() => Be.not(null));
		pass(() => Be.not(void 0));
		
		fail(() => Be.notNull(null));
		fail(() => Be.notNull(undefined));
		
		pass(() => Be.notEmpty([1]));
		pass(() => Be.notEmpty({ a: 1 }));
		fail(() => Be.notEmpty({}));
		fail(() => Be.notEmpty([]));
		fail(() => Be.notEmpty(""));
		fail(() => Be.notEmpty(null));
		fail(() => Be.notEmpty(0));
		fail(() => Be.notEmpty(Math));
		
		pass(() => Be.positive(1));
		pass(() => Be.positive(0));
		fail(() => Be.positive(-0.1));
		
		pass(() => Be.notUndefined(Math.floor));
		fail(() => Be.notUndefined(Math["non-existent"]));
		
		pass(() => Be.string(""));
		fail(() => Be.string(0));
		fail(() => Be.string(new String("")));
		
		pass(() => Be.number(0));
		fail(() => Be.number("0"));
		fail(() => Be.number(new Number(0)));
		
		pass(() => Be.boolean(false));
		pass(() => Be.boolean(true));
		fail(() => Be.boolean("0"));
		fail(() => Be.boolean(new Boolean(false)));
		
		pass(() => Be.primitive(0));
		pass(() => Be.primitive("0"));
		pass(() => Be.primitive(false));
		fail(() => Be.primitive({}));
		fail(() => Be.primitive([]));
		fail(() => Be.primitive(new String("")));
		
		pass(() => Be.email("jimbo@gmail.com"));
		pass(() => Be.email("jimbo@some-really-long-email.something.extension"));
		pass(() => Be.email("jimbos+email@some-really-long-email.something.extension"));
		fail(() => Be.email("jimbo_gmail.com"));
		fail(() => Be.email(""));
		
		pass(() => Be.func(() => {}));
		fail(() => Be.func({}));
		
		pass(() => Be.enumeration(Enumeration));
		fail(() => Be.enumeration({}));
		fail(() => Be.enumeration([0, 1, 2]));
	})();
	
	// Contents tests
	(() =>
	{
		pass(() => Be.array([]));
		fail(function() { Be.array(<any>arguments); });
		pass(() => Be.array(["[]"]));
		
		pass(() => Be.array([1, 2, 3], Number));
		pass(() => Be.array([1, 2, 3], Number, String));
		pass(() => Be.array([1, 2, "3"], Number, String));
		fail(() => Be.array([1, 2, 3], String));
		fail(() => Be.array([1, 2, 3, null], Number));
		
		pass(() => Be.array([null, void 0, NaN]));
		
		pass(() => Be.array([new Image(), new Image(), new Image()], Image));
		fail(() => Be.array([0, null], Number));
		fail(() => Be.array([0, void 0], Number));
		fail(() => Be.array([0, NaN], Number));
		
		pass(() => Be.object({}));
		pass(() => Be.object(Math));
		fail(() => Be.object("{}"));
		
		pass(() => Be.object({ a: null, b: void 0, c: NaN }));
		pass(() => Be.object({ a: 1, b: null, c: void 0 }, Number, null, void 0));
		pass(() => Be.object({ a: 1, b: "" }, Number, String, Boolean));
		pass(() => Be.object({ a: 1, b: "", c: {}, d: [] }, Number, String, Object, Array));
		fail(() => Be.object({ a: 1, b: "" }, Number, Boolean));
		fail(() => Be.object({ a: 1, b: [] }, Number));
	})();
	
	// Basic signature tests
	(() =>
	{
		function fn(...args: any[])
		{
			Be(arguments, Number);
		}
		
		pass(() => fn(0));
		fail(() => fn(null));
		fail(() => fn(void 0));
		fail(() => fn(NaN));
		fail(() => fn({}));
		fail(() => fn(new Number(0)));
		fail(() => fn(0, 0));
		fail(() => fn());
		
		function fnAllowNull(...args: any[])
		{
			Be(arguments, Number, [Number, Be.positive], [Number, null], [Number, void 0], [Number, null, void 0]);
		}
		
		pass(() => fnAllowNull(0, 1, 0, 0, 0));
		pass(() => fnAllowNull(0, 1, null, void 0, 0));
		pass(() => fnAllowNull(0, 0, null, void 0, void 0));
		pass(() => fnAllowNull(0, 0, null, void 0, null));
		
		fail(() => fnAllowNull(null, -1, 0, 0, 0));
		fail(() => fnAllowNull(0, 1, void 0, null, 0));
		
		function fnSpecificValues(s: string, n: number)
		{
			Be(arguments, ["str", "ing"], [1, 2, null]);
		}
		
		pass(() => fnSpecificValues("str", 1));
		pass(() => fnSpecificValues("ing", 1));
		pass(() => fnSpecificValues("ing", 2));
		pass(() => fnSpecificValues("ing", null));
		fail(() => fnSpecificValues("string", 1));
		fail(() => fnSpecificValues("str", 3));
	})();
	
	// Rest parameter tests
	(() =>
	{
		function rest(...args: any[])
		{
			Be(arguments, Be.rest);
		}
		
		pass(() => rest());
		pass(() => rest(1, ""));
		fail(() => rest(undefined));
		fail(() => rest(null));
		fail(() => rest(1, null, 1));
		
		function typedRestWithOthers(s: any, n: any, ...args: any[])
		{
			Be(arguments, String, Number, [String, Be.rest]);
		}
		
		pass(() => typedRestWithOthers("", 0));
		pass(() => typedRestWithOthers("", 0, ""));
		pass(() => typedRestWithOthers("", 0, "", ""));
		fail(() => typedRestWithOthers("", 0, 0));
		fail(() => typedRestWithOthers("", 0, "", 0));
		fail(() => typedRestWithOthers(0, 0, "", "", "", ""));
	})();
	
	// Optional parameter tests
	(() =>
	{
		function optionals(...args: any[])
		{
			Be(arguments, Number, Be.optional, [Number, Be.optional]);
		}
		
		pass(() => optionals(0));
		pass(() => optionals(0, 0));
		pass(() => optionals(0, Math));
		pass(() => optionals(0, console, 0));
		fail(() => optionals(0, 0, "0"));
		
		function optionalsWithRest(...args: any[])
		{
			Be(arguments, Number, [Number, Be.optional], [Number, Be.rest]);
		}
		
		pass(() => optionalsWithRest(-1));
		pass(() => optionalsWithRest(0, 0));
		pass(() => optionalsWithRest(0, 0, 0, 0, 0, 0));
		
		fail(() => optionalsWithRest("0"));
		fail(() => optionalsWithRest(0, "0"));
		fail(() => optionalsWithRest(0, 0, "0"));
	})();
	
	// Overloads tests
	(() =>
	{
		function overloadable(...args: any[])
		{
			Be(arguments, String, Number, RegExp,
				arguments, Number, Object,
				arguments, Number, [Object, null],
				arguments, Function, Number, String, String);
		}
		
		pass(() => overloadable("", 0, /re/));
		pass(() => overloadable(0, {}));
		pass(() => overloadable(0, null));
		pass(() => overloadable(() => {}, 0, "", ""));
		
		fail(() => overloadable(null, {}));
		fail(() => overloadable("", 0, "", ""));
		
		fail(function() { overloadable(arguments) });
	})();
	
	console.log("All tests have run.");
})();
