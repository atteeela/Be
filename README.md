![Expects]
(https://back.io/Expects.png)

Expects is a semantic expectation (assertion) library for JavaScript and TypeScript that I wrote for Back.io. (Back.io is a JSFiddle-style object-relational BaaS. If you haven't seen it already, check it out. It's awesome! </shameless plug>).

It allows you to declare the expectations that you have about incoming function arguments, return values, etc. When these expectations are unmet, it will output highly informative error messages to the console, and optionally notify your bug tracker.

Integrating Expects into your coding style will substantially increase the quality of your code. If you are a framework developer, or are otherwise distributing an API library, integrating Expects will substantially increase the ease at which your users can consume your API.

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
You should `Expect()` at the top of most functions (especially ones that are exposed to other modules and/or included in your public API), any time you assign data to long-lived member variables, or any time there is any of ambiguity what-so-ever. The idea is to get notification about errors as early as possible. It's very time consuming to debug code where invalid data makes it way through 10 different function calls, gets saved to a member variable, is accessed later, and generates a bizarre error.

In short, *use them everywhere*, even when it may seem superfluous. They're easy to add and remove.

A key difference from other libraries in that, by default, it uses `debugger;` statements to break on unmet expectations rather than throwing exceptions. 

Throwing exceptions during development is annoying because it kills the current turn of the event loop, causing you to have to restart the debugging process. Often times the failed expectation isn't really a problem (especially when you're `Expect()`ing liberally) and you want to keep going. This whole library was written in such a way that every time an `Expect()` fails, you can always step over *exactly 3 times* to get back into your code. (Muscle memory FTW!)

#Tutorial

The only exposed object is the `Expect()` function. It has a variety of overloads, as well as some sub functions:

## Basics

If you expect `stuff` to loosely equal true (i.e. not null, undefined, NaN, false, 0, or ''):
```javascript
var stuff = getStuff();
Expect(stuff);
```

If you expect `stuff` to be a string:
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
var thing = getThings():
Expect(thing, jQuery, HTMLElement);
```

Or you can specify valid literals:
```javascript
var name = getSomeEventName();
Expect(name, "click", "mousedown", "mouseup");
```

Allow null (but still block out undefined and NaN):
```javascript
var obj = getSomeObject();
Expect(obj, Object, null);
```

## Value checking functions

`Expect.not(value);` - Expectation that value is null, undefined, NaN, false, 0, or ''.
`Expect.notEmpty(value);` - Expectation that the value is a non-empty or whitespace string, a non-empty array, or a non-function object with keys.
`Expect.positive(value);` - Expectation that value is a number greater than or equal to 0 (mainly used to check .indexOf()).
`Expect.email(value);` - Expectation that value is a string containing an email address.
`Expect.enumeration(value);` - Expectation that value is a TypeScript-style enum object.

`Expect.notUndefined(value);` - Expectation that value is not undefined.
`Expect.notNull(value);` - Expectation that value is not null, undefined, or NaN.
`Expect.string(value);` - Expectation that value is a string.
`Expect.number(value);` - Expectation that value is a number.
`Expect.boolean(value);` - Expectation that value is a boolean.
`Expect.primitive(value);` - Expectation that value is a string, number, or boolean.
`Expect.date(value);` - Expectation that value is a Date object.
`Expect.func(value);` - Expectation that value is a function.

## Contents checking functions

`Expect.array(value, constraints);` - Expectation that value is an array. If constraints are specified, it will make sure every item in the array complies with the constraint:

```javascript
var myArray = [10, "bunny", -35, true, false];

Expect.array(myArray); // Passes, no constraints
Expect.array(myArray, String); // Fails, array also has numbers and booleans
Expect.array(myArray, String, Number); // Fails, array also has booleans
Expect.array(myArray, String, Number, Boolean); // Passes
Expect.array(myArray, String, [Number, Expect.positive], Boolean); // Fails, negative numbers aren't cool.
```

`Expect.object(value, constraints);` - Expectation that value is an object. If constraints are specified, it will make sure every value in the object complies with the constraint:

```javascript
var myObject = {
	a: 10, 
	b: "bunny", 
	c: -35, 
	d: false
}

Expect.object(myObject); // Passes, no constraints
Expect.object(myObject, String); // Fails, object also has numbers and booleans
Expect.object(myObject, String, Number); // Fails, object also has booleans
Expect.object(myObject, String, Number, Boolean); // Passes
Expect.object(myObject, String, [Number, Expect.positive], Boolean); // Fails, negative numbers aren't cool.
```

# Signature validation

To validate the arguments to a function, pass the built-in `arguments` local to the Expect() function, followed by a series of constraints that each argument must comply with. For example:

```javascript
// This function takes arguments in the order of a string, a number, a boolean, and an optional function.
function myFunction(name, age, isNew, callbackFn)
{
	Expect(arguments, String, Number, Boolean, [Function, Expect.optional]);
}

// If a function takes a rest parameter
```

If you want to allow a type union on one of the arguments, you can specify it the arguments:


#Accepting Issues
Mission critical code depends on Expects. If you find a bug, please open an issue and I'll put out a fix ASAP. I'm also accepting feature suggestions.
