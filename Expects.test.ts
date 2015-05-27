
enum Enumeration
{
	one,
	two,
	three
}

(() =>
{
	Expect.useDebuggers = false;
	
	let pass = (fn: () => void) =>
	{
		let failed = false;
		Expect.handler = () => failed = true;
		fn();
		
		if (failed)
		{
			console.log("Expect code didn't work.");
			debugger;
		}
	}
	
	let fail = (fn: () => void) =>
	{
		let passed = true;
		Expect.handler = () => passed = false;
		fn();
		
		if (passed)
		{
			console.log("Expect code didn't work.");
			debugger;
		}
	}
	
	// Basic tests
	(() =>
	{
		let img = new Image();
		pass(() => Expect(img));
		pass(() => Expect(img, Image));
		fail(() => Expect(false));
		fail(() => Expect(0));
		fail(() => Expect(null, String, Number));
	})();
	
	// Semantic expectations tests
	(() =>
	{
		fail(() => Expect.never());
		fail(() => Expect.abstract());
		fail(() => Expect.notImplemented());
		
		fail(() => Expect.not(1));
		pass(() => Expect.not(0));
		pass(() => Expect.not(""));
		pass(() => Expect.not(false));
		pass(() => Expect.not(null));
		pass(() => Expect.not(void 0));
		
		fail(() => Expect.notNull(null));
		fail(() => Expect.notNull(undefined));
		
		pass(() => Expect.notEmpty([1]));
		pass(() => Expect.notEmpty({ a: 1 }));
		fail(() => Expect.notEmpty({}));
		fail(() => Expect.notEmpty([]));
		fail(() => Expect.notEmpty(""));
		fail(() => Expect.notEmpty(null));
		fail(() => Expect.notEmpty(0));
		fail(() => Expect.notEmpty(Math));
		
		pass(() => Expect.positive(1));
		pass(() => Expect.positive(0));
		fail(() => Expect.positive(-0.1));
		
		pass(() => Expect.notUndefined(Math.floor));
		fail(() => Expect.notUndefined(Math["non-existent"]));
		
		pass(() => Expect.string(""));
		fail(() => Expect.string(0));
		fail(() => Expect.string(new String("")));
		
		pass(() => Expect.number(0));
		fail(() => Expect.number("0"));
		fail(() => Expect.number(new Number(0)));
		
		pass(() => Expect.boolean(false));
		pass(() => Expect.boolean(true));
		fail(() => Expect.boolean("0"));
		fail(() => Expect.boolean(new Boolean(false)));
		
		pass(() => Expect.primitive(0));
		pass(() => Expect.primitive("0"));
		pass(() => Expect.primitive(false));
		fail(() => Expect.primitive({}));
		fail(() => Expect.primitive([]));
		fail(() => Expect.primitive(new String("")));
		
		pass(() => Expect.email("jimbo@gmail.com"));
		pass(() => Expect.email("jimbo@some-really-long-email.something.extension"));
		pass(() => Expect.email("jimbos+email@some-really-long-email.something.extension"));
		fail(() => Expect.email("jimbo_gmail.com"));
		fail(() => Expect.email(""));
		
		pass(() => Expect.func(() => {}));
		fail(() => Expect.func({}));
		
		pass(() => Expect.enumeration(Enumeration));
		fail(() => Expect.enumeration({}));
		fail(() => Expect.enumeration([0, 1, 2]));
	})();
	
	// Contents tests
	(() =>
	{
		pass(() => Expect.array([]));
		fail(function() { Expect.array(<any>arguments); });
		pass(() => Expect.array(["[]"]));
		
		pass(() => Expect.array([1, 2, 3], Number));
		pass(() => Expect.array([1, 2, 3], Number, String));
		pass(() => Expect.array([1, 2, "3"], Number, String));
		fail(() => Expect.array([1, 2, 3], String));
		fail(() => Expect.array([1, 2, 3, null], Number));
		
		pass(() => Expect.array([null, void 0, NaN]));
		
		pass(() => Expect.array([new Image(), new Image(), new Image()], Image));
		fail(() => Expect.array([0, null], Number));
		fail(() => Expect.array([0, void 0], Number));
		fail(() => Expect.array([0, NaN], Number));
		
		pass(() => Expect.object({}));
		pass(() => Expect.object(Math));
		fail(() => Expect.object("{}"));
		
		pass(() => Expect.object({ a: null, b: void 0, c: NaN }));
		pass(() => Expect.object({ a: 1, b: null, c: void 0 }, Number, null, void 0));
		pass(() => Expect.object({ a: 1, b: "" }, Number, String, Boolean));
		pass(() => Expect.object({ a: 1, b: "", c: {}, d: [] }, Number, String, Object, Array));
		fail(() => Expect.object({ a: 1, b: "" }, Number, Boolean));
		fail(() => Expect.object({ a: 1, b: [] }, Number));
	})();
	
	// Basic signature tests
	(() =>
	{
		function fn(...args: any[])
		{
			Expect(arguments, Number);
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
			Expect(arguments, Number, [Number, Expect.positive], [Number, null], [Number, void 0], [Number, null, void 0]);
		}
		
		pass(() => fnAllowNull(0, 1, 0, 0, 0));
		pass(() => fnAllowNull(0, 1, null, void 0, 0));
		pass(() => fnAllowNull(0, 0, null, void 0, void 0));
		pass(() => fnAllowNull(0, 0, null, void 0, null));
		
		fail(() => fnAllowNull(null, -1, 0, 0, 0));
		fail(() => fnAllowNull(0, 1, void 0, null, 0));
		
		function fnSpecificValues(s: string, n: number)
		{
			Expect(arguments, ["str", "ing"], [1, 2, null]);
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
			Expect(arguments, Expect.rest);
		}
		
		pass(() => rest());
		pass(() => rest(1, ""));
		fail(() => rest(undefined));
		fail(() => rest(null));
		fail(() => rest(1, null, 1));
		
		function typedRestWithOthers(s: any, n: any, ...args: any[])
		{
			Expect(arguments, String, Number, [String, Expect.rest]);
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
			Expect(arguments, Number, Expect.optional, [Number, Expect.optional]);
		}
		
		pass(() => optionals(0));
		pass(() => optionals(0, 0));
		pass(() => optionals(0, Math));
		pass(() => optionals(0, console, 0));
		fail(() => optionals(0, 0, "0"));
		
		function optionalsWithRest(...args: any[])
		{
			Expect(arguments, Number, [Number, Expect.optional], [Number, Expect.rest]);
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
			Expect.overloads(arguments,
				[String, Number, RegExp],
				[Number, Object],
				[Number, [Object, null]],
				[Function, Number, String, String]);
		}
		
		pass(() => overloadable("", 0, /re/));
		pass(() => overloadable(0, {}));
		pass(() => overloadable(0, null));
		pass(() => overloadable(() => {}, 0, "", ""));
		
		fail(() => overloadable(null, {}));
		fail(() => overloadable("", 0, "", ""));
		
		fail(function() { Expect["overloads"](arguments) });
	})();
	
	console.log("All tests have run.");
})();
