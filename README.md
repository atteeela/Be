![Be.ts]
(Be.png)

**Be** is a semantic assertion library for JavaScript and TypeScript that I wrote for [Back.io](https://back.io). (Back.io is a JSFiddle-style object-relational BaaS. If you're more of a front-end person and would like to build data-driven web apps without involving server code, you should really [check it out](https://back.io). It's awesome!).

Differences from most other assertion libraries:

- It optionally breaks with `debugger` statements instead of throwing exceptions (rationale below).
- You can make it do run-time type checking of incoming function arguments it's TypeScript-style method signature declaration system, which supports optional and rest parameters (important for API vendors).
- It outputs highly descriptive failure messages to the console, and optionally to your bug tracker, when things go wrong (critical for API vendors).

For example:

```javascript
var bug = {};
Be(bug, String, Number);
```

Produces the following error because `bug` is not a string or number:

![Screenshot]
(screenshot.png)

`Be()` calls all return the value that was passed in, so you can wrap return values in `Be()` calls to defend yourself against undesirable errors:

```javascript
function stuff() { return Be.notNull(getSomethingThatMightBeNull()); }
```

Integrating **Be** into your coding style will substantially increase the quality of your code, by calling out runtime errors as early as possible. If you are a framework developer, or are otherwise distributing an API library, Be can substantially increase the ease at which your users can consume your API, as it often alleviates them from having to plow through your docs when something goes wrong.

#Installation
Download Be.js or Be.ts from the repository and include it in your project. Be has no dependencies, and does not rely on any specific environment (Browser, Node.js, etc).

#Usage
You should `Be()` at the top of most functions (especially when they're exposed in your public API), any time you store data in long-lived member variables, or any time there is any kind of ambiguity. The idea is for you, or anyone using your code to get notification about errors as early as possible. It's very time consuming to debug code where invalid data makes it way through 10 different function calls, gets saved to a member variable, is accessed later, and then generates a bizarre error.

In short, **use them everywhere**, even when it may seem superfluous. They're easy to add and remove.

A difference from other libraries in that, by default, it uses `debugger;` statements to break on unmet expectations rather than throwing exceptions. **This is key**. Relying on exceptions during development is annoying because they blow away the current turn of the event loop, causing you to have to restart the debugging process. Often times the failed expectation isn't that much of a problem (especially when you're using `Be()` liberally) and you want to keep going. This whole library was written in such a way that every time an expectation fails, you can always step over **exactly 3 times** to get back into your code. (Muscle memory FTW!)

#Tutorial

If you expect `stuff` to loosely equal true (i.e. not null, undefined, NaN, false, 0, or ''):
```javascript
var stuff = getStuff();
Be(stuff);
```
You can also create a *constraint* by passing in a series of arguments after the first parameter. A constraint can be made up of:

- One or more constructors (such as HTMLElement, jQuery, Date) if the value must be at least one of these types.
- One or more of the built-in primitive constructors (String, Number, Boolean) if the value must be a string, number or boolean
- Literal values ("click", "abc", 25, null) if the value may be one of these exact values
- Various `Be.*` functions such as `Be.notEmpty` or `Be.positive` (full documentation is below).

If you expect `stuff` to be string, pass the built-in String constructor:
```javascript
var stuff = getStuff();
Be(stuff, String);
```

You can also do type unions:
```javascript
// Make sure stuff is a string, number, or boolean:
var stuff = getStuff();
Be(stuff, String, Number, Boolean);

// Make sure thing is a jQuery or an HTMLElement:
var thing = getThing();
Be(thing, jQuery, HTMLElement);
```

If you expect only specific literal values:
```javascript
var name = getSomeEventName();
Be(name, "click", "mousedown", "mouseup");

var num = getSomeNumber();
Be(num, 2, 3, 4);
```

If you want to allow null (but still block out undefined and NaN):
```javascript
var obj = getSomeObject();
Be(obj, Object, null);
```


##Checking the contents of an array or object

It's very common to want to ensure that an array or object doesn't contain bogus data. Be provides a very easy way to check this:

```javascript
var myArray = [10, "bunny", -35, true, false];

var myObject = {
	a: 10, 
	b: "bunny", 
	c: -35, 
	d: false
}

Be.array(myObject); // Fails, myObject is not an array
Be.array(myArray); // Passes, no contents constraints
Be.array(myArray, String); // Fails, myArray also has numbers and booleans
Be.array(myArray, String, Number); // Fails
Be.array(myArray, String, Number, Boolean); // Passes

Be.object(myObject); // Passes, no constraints
Be.object(myObject, String); // Fails, object also has numbers and booleans
Be.object(myObject, String, Number); // Fails, object also has booleans
Be.object(myObject, String, Number, Boolean); // Passes
```

##Value checking functions

`Be.not(value);` - Expectation that value is null, undefined, NaN, false, 0, or ''.

`Be.notUndefined(value);` - Expectation that value is not undefined.

`Be.notNull(value);` - Expectation that value is not null, undefined, or NaN.

`Be.notEmpty(value);` - Expectation that the value is a non-empty or whitespace string, a non-empty array, or a non-function object with keys.

`Be.string(value);` - Expectation that value is a string.

`Be.number(value);` - Expectation that value is a number.

`Be.boolean(value);` - Expectation that value is a boolean.

`Be.primitive(value);` - Expectation that value is a string, number, or boolean.

`Be.date(value);` - Expectation that value is a Date object.

`Be.func(value);` - Expectation that value is a function.

`Be.positive(value);` - Expectation that value is a number greater than or equal to 0 (mainly used to check .indexOf()).

`Be.email(value);` - Expectation that value is a string containing an email address.

`Be.enumeration(value);` - Expectation that value is a TypeScript-style enum object.

##Returnable expectations

The `Be()` function, as well as all the value checking functions always return the value that was passed, so you can wrap return values in `Be()` to quickly achieve perfect error reporting:

```javascript
function getSomething()
{
	// Passes through the return value of "getTheThing"
	return Be(getTheThing()); 
}
```

This gets even better if you're using an ES6-compliant JS variant with arrow functions:

```javascript
var fn = () => Be(getTheThing());
```

How many times have you not done proper error checking because you didn't want to split up the code into multiple lines? (Be honest :))

Check out how safely and easily you can slice an array (i.e. if value weren't actually in the array, this would make for a pretty hidden but disastrous bug without the Be):

```javascript
array.slice(0, Be.positive(array.indexOf(value)));
```

**TypeScript users**: The Be functions are all generic, so the types flow from the value through to the return type of your method. There's no `any` leakage.

##Checking arguments

To validate the arguments to a function, pass the built-in `arguments` local to the `Be()` function, followed by an list of constraints that each argument must comply with. For example:

```javascript
// This function takes arguments in the order of a string, a number, a boolean, and an optional function.
function myFunction(name, age, isNew, callbackFn)
{
	Be(arguments, String, Number, Boolean, [Function, Be.optional]);
}
```
If you want to allow a type union on an argument, put it in an array:
```javascript
function fnWithTypeUnion(strOrNum, callbackFn)
{
	Be(arguments, [String, Number], Function);
}
```
If you don't want to force a type on a certain parameter, pass in an empty array:
```javascript
function fn(num, anything, str)
{
	Be(arguments, Number, [], String);
}
```
If a function has a rest parameter (variable number of arguments) at the end:
```javascript
function splice(startIndex, numToRemove)
{
	Be(arguments, Number, Number, [Be.rest]);

	// Or if all the rest arguments need to be, say, functions:
	Be(arguments, Number, Number, [Function, Be.rest]);
}
```
If some of the parameters are optional: (optionals need to go before a rest, like TypeScript)
```javascript
function withOptionals(num1, num2Opt, num3Opt)
{
	Be(arguments, Number, [Number, Be.optional], [Number, Be.optional]);
}
```
Sometimes your parameter structure is a bit too complicated to fit into the *required stuff* -> *optional stuff* -> *rest* structure. For these situations, you might need to define multiple overloads. 

For example, in the Back.io client library, there are 6 different ways to call the `User.login()` method. Below is the `Be()` I used to make sure helpful errors are displayed. (The example is TypeScript, because that's what most people who care about this stuff will probably be using). 

```javascript

static login<T>(email: string, pwd: string, doneFn?: (user: T) => void);
static login<T>(email: string, pwd: string, days: number, doneFn?: (user: T) => void);
static login<T>(user: T, doneFn?: (user: T) => void);
static login<T>(user: T, days: number, doneFn?: (user: T) => void);
static login<T>(days: number, doneFn?: (user: T) => void);
static login<T>(doneFn?: (user: T) => void);
static login(a: any, b?: any, c?: any, d?: any)
{
	Be.overloads(arguments,
		[String, String, [Function, Be.optional]],
		[String, String, Number, [Function, Be.optional]],
		[UserModel, [Function, Be.optional]],
		[UserModel, Number, [Function, Be.optional]],
		[Number, [Function, Be.optional]],
		[Function, Be.optional]]);
}
```

In short, `Be.overloads(arguments)` works like `Be(arguments)`, except that it takes an array of constraints, instead of just a single list of constraints.



##Failing semantically

Use `Be.never()` to mark points where code execution should never reach, for example:
```javascript
function handleState1or2()
{
	if (inState1)
		console.log("We're in state 1.");
	
	else if (inState2)
		console.log("We're in state 2.");
	
	// wtf?
	else Be.never();
}
```

Use `Be.notImplemented()` for functions that haven't been implemented yet.

Use `Be.abstract()` to mark out functions that should have been overridden in a child class (mainly used for TypeScript).

## Other features

In production, or while running your unit tests, you'll want exceptions to be thrown on unmet expectations:
```javascript
Be.useExceptions = true;
```

The `debugger;` statements are disabled after the first expectation is unmet (it's usually annoying otherwise). You can turn them back on with:
```javascript
Be.useDebuggers = true;
```

If you want to send errors to your bug tracker, you can set a function that will be called when an expectation is unmet. The error argument is an `BeError` that contains the descriptive error message, as well as a `.value` property that stores the invalid value (or arguments list) that caused the error.

```javascript

Be.handler = function(error)
{
	MyBugTracker.sendError(error);
}
```

#Accepting Issues
Mission critical code depends on Be. If you find a bug, please open an issue and I'll put out a fix ASAP. I'm also accepting feature suggestions.
