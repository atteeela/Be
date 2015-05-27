![Expects]
(Expects.png)

Expects is a semantic expectation (assertion) library for JavaScript and TypeScript that I wrote for Back.io. (Back.io is a JSFiddle-style object-relational BaaS. If you haven't seen it already, check it out. It's awesome!).

It allows you to declare the expectations that you have about incoming function arguments, return values, etc. When these expectations are unmet, it will output highly informative error messages to the console, and optionally notify your bug tracker.

Integrating Expects into your coding style will substantially increase the quality of your code, by calling out runtime errors as early as possible. If you are a framework developer, or are otherwise distributing an API library, Expects can substantially increase the ease at which your users can consume your API, as it often alleviates them from having to plow through your docs when something goes wrong.

#Installation
You can get started as easily as:
```html
<script src="//back.io/Expects.js"></script>
```
or
```
npm install expects
```
Or, you can just download Expects.js or Expects.ts from the repository and include it in your project. Expects has no dependencies, and does not rely on any specific environment (Browser, Node.js, etc).

#Usage
You should `Expect()` at the top of most functions (especially when they're exposed in your public API), any time you store data in long-lived member variables, or any time there is any kind of ambiguity. The idea is for you, or anyone using your code to get notification about errors as early as possible. It's very time consuming to debug code where invalid data makes it way through 10 different function calls, gets saved to a member variable, is accessed later, and then generates a bizarre error.

In short, **use them everywhere**, even when it may seem superfluous. They're easy to add and remove.

A difference from other libraries in that, by default, it uses `debugger;` statements to break on unmet expectations rather than throwing exceptions. **This is key**. Relying on exceptions during development is annoying because they blow away the current turn of the event loop, causing you to have to restart the debugging process. Often times the failed expectation isn't that much of a problem (especially when you're using `Expect()` liberally) and you want to keep going. This whole library was written in such a way that every time an expectation fails, you can always step over **exactly 3 times** to get back into your code. (Muscle memory FTW!)

#Tutorial

If you expect `stuff` to loosely equal true (i.e. not null, undefined, NaN, false, 0, or ''):
```javascript
var stuff = getStuff();
Expect(stuff);
```
You can also create a *constraint* by passing in a series of arguments after the first parameter. A constraint can be made up of:

- One or more constructors (such as HTMLElement, jQuery, Date) if the value must be at least one of these types.
- One or more of the built-in primitive constructors (String, Number, Boolean) if the value must be a string, number or boolean
- Literal values ("click", "abc", 25, null) if the value may be one of these exact values
- Various `Expect.*` functions such as `Expect.notEmpty` or `Expect.positive` (full documentation is below).

If you expect `stuff` to be string, pass the built-in String constructor:
```javascript
var stuff = getStuff();
Expect(stuff, String);
```

You can also do type unions:
```javascript
// Make sure stuff is a string, number, or boolean:
var stuff = getStuff();
Expect(stuff, String, Number, Boolean);

// Make sure thing is a jQuery or an HTMLElement:
var thing = getThing();
Expect(thing, jQuery, HTMLElement);
```

If you expect only specific literal values:
```javascript
var name = getSomeEventName();
Expect(name, "click", "mousedown", "mouseup");

var num = getSomeNumber();
Expect(num, 2, 3, 4);
```

If you want to allow null (but still block out undefined and NaN):
```javascript
var obj = getSomeObject();
Expect(obj, Object, null);
```


##Checking the contents of an array or object

It's very common to want to ensure that an array or object doesn't contain bogus data. Expects provides a very easy way to check this:

```javascript
var myArray = [10, "bunny", -35, true, false];

var myObject = {
	a: 10, 
	b: "bunny", 
	c: -35, 
	d: false
}

Expect.array(myObject); // Fails, myObject is not an array
Expect.array(myArray); // Passes, no contents constraints
Expect.array(myArray, String); // Fails, myArray also has numbers and booleans
Expect.array(myArray, String, Number); // Fails
Expect.array(myArray, String, Number, Boolean); // Passes

Expect.object(myObject); // Passes, no constraints
Expect.object(myObject, String); // Fails, object also has numbers and booleans
Expect.object(myObject, String, Number); // Fails, object also has booleans
Expect.object(myObject, String, Number, Boolean); // Passes
```

##Value checking functions

`Expect.not(value);` - Expectation that value is null, undefined, NaN, false, 0, or ''.
`Expect.notUndefined(value);` - Expectation that value is not undefined.
`Expect.notNull(value);` - Expectation that value is not null, undefined, or NaN.
`Expect.notEmpty(value);` - Expectation that the value is a non-empty or whitespace string, a non-empty array, or a non-function object with keys.
`Expect.string(value);` - Expectation that value is a string.
`Expect.number(value);` - Expectation that value is a number.
`Expect.boolean(value);` - Expectation that value is a boolean.
`Expect.primitive(value);` - Expectation that value is a string, number, or boolean.
`Expect.date(value);` - Expectation that value is a Date object.
`Expect.func(value);` - Expectation that value is a function.
`Expect.positive(value);` - Expectation that value is a number greater than or equal to 0 (mainly used to check .indexOf()).
`Expect.email(value);` - Expectation that value is a string containing an email address.
`Expect.enumeration(value);` - Expectation that value is a TypeScript-style enum object.

##Returnable expectations

The `Expect()` function, as well as all the value checking functions always return the value that was passed, so you can wrap return values in Expect() to quickly achieve perfect error reporting:

```javascript
function getSomething()
{
	// Passes through the return value of "getTheThing"
	return Expect(getTheThing()); 
}
```

This gets even better if you're using an ES6-compliant JS variant with arrow functions:

```javascript
var fn = () => Expect(getTheThing());
```

How many times have you not done proper error checking because you didn't want to split up the code into multiple lines? (Be honest :))

Check out how safely and easily you can slice an array (i.e. if value weren't actually in the array, this would make for a pretty hidden but disastrous bug without the Expect):

```javascript
array.slice(0, Expect.positive(array.indexOf(value)));
```

**TypeScript users**: The Expect functions are all generic, so the types flow from the value through to the return type of your method. There's no `any` leakage.

##Checking arguments

To validate the arguments to a function, pass the built-in `arguments` local to the Expect() function, followed by an list of constraints that each argument must comply with. For example:

```javascript
// This function takes arguments in the order of a string, a number, a boolean, and an optional function.
function myFunction(name, age, isNew, callbackFn)
{
	Expect(arguments, String, Number, Boolean, [Function, Expect.optional]);
}
```
If you want to allow a type union on an argument, put it in an array:
```javascript
function fnWithTypeUnion(strOrNum, callbackFn)
{
	Expect(arguments, [String, Number], Function);
}
```
If you don't want to force a type on a certain parameter, pass in an empty array:
```javascript
function fn(num, anything, str)
{
	Expect(arguments, Number, [], String);
}
```
If a function has a rest parameter (variable number of arguments) at the end:
```javascript
function splice(startIndex, numToRemove)
{
	Expect(arguments, Number, Number, [Expect.rest]);

	// Or if all the rest arguments need to be, say, functions:
	Expect(arguments, Number, Number, [Function, Expect.rest]);
}
```
If some of the parameters are optional: (optionals need to go before a rest, like TypeScript)
```javascript
function withOptionals(num1, num2Opt, num3Opt)
{
	Expect(arguments, Number, [Number, Expect.optional], [Number, Expect.optional]);
}
```
Sometimes your parameter structure is a bit too complicated to fit into the *required stuff* -> *optional stuff* -> *rest* structure. For these situations, you might need to define multiple overloads. 

For example, in the Back.io client library, there are 6 different ways to call the `User.login()` method. Below is the `Expect()` I used to make sure helpful errors are displayed. (The example is TypeScript, because that's what most people who care about this stuff will probably be using). 

```javascript

static login<T>(email: string, pwd: string, doneFn?: (user: T) => void);
static login<T>(email: string, pwd: string, days: number, doneFn?: (user: T) => void);
static login<T>(user: T, doneFn?: (user: T) => void);
static login<T>(user: T, days: number, doneFn?: (user: T) => void);
static login<T>(days: number, doneFn?: (user: T) => void);
static login<T>(doneFn?: (user: T) => void);
static login(a: any, b?: any, c?: any, d?: any)
{
	Expect.overloads(arguments,
		[String, String, [Function, Expect.optional]],
		[String, String, Number, [Function, Expect.optional]],
		[UserModel, [Function, Expect.optional]],
		[UserModel, Number, [Function, Expect.optional]],
		[Number, [Function, Expect.optional]],
		[Function, Expect.optional]]);
}
```

In short, `Expect.overloads(arguments)` works like `Expect(arguments)`, except that it takes an array of constraints, instead of just a single list of constraints.



##Failing semantically

Use `Expect.never()` to mark points where code execution should never reach, for example:
```javascript
function handleState1or2()
{
	if (inState1)
		console.log("We're in state 1.");
	
	else if (inState2)
		console.log("We're in state 2.");
	
	// wtf?
	else Expect.never();
}
```

Use `Expect.notImplemented()` for functions that haven't been implemented yet.

Use `Expect.abstract()` to mark out functions that should have been overridden in a child class (mainly used for TypeScript).

## Other features

In production, or while running your unit tests, you'll want exceptions to be thrown on unmet expectations:
```javascript
Expect.useExceptions = true;
```

The `debugger;` statements are disabled after the first expectation is unmet (it's usually annoying otherwise). You can turn them back on with:
```javascript
Expect.useDebuggers = true;
```

If you want to send errors to your bug tracker, you can set a function that will be called when an expectation is unmet. The error argument is an `ExpectationError` that contains the descriptive error message, as well as a `.value` property that stores the invalid value (or arguments list) that caused the error.

```javascript

Expect.handler = function(error)
{
	MyBugTracker.sendError(error);
}
```

#Accepting Issues
Mission critical code depends on Expects. If you find a bug, please open an issue and I'll put out a fix ASAP. I'm also accepting feature suggestions.
