
/**
Makes sure that the value loosely equals one of the specified types.  If the rest parameters are omitted, the value is checked for loose equality to true.
*///
function Be<T>(value: T, ...parameter: any[]): T;

/**
Makes sure that the arguments to comply with the specified signature. If the signature is omitted, the arguments are checked against null, undefined, and NaN.
*///
function Be(arguments: IArguments, ...signature: any[]): void;
function Be(value: any, ...constraint: any[])
{
	if (Be.util.isArguments(value))
	{
		let args: IArguments = value;
		
		if (constraint.length === 0)
		{
			for (let i = -1; ++i < args.length;)
			{
				let a = args[i];
				
				if (a === void 0)
				{
					if (Be.util.report(`Argument ${i + 1} is undefined, and this function does not accept null, undefined, or NaN arguments.`))
						debugger;
					
					return;
				}
				else if (a === null)
				{
					if (Be.util.report(`Argument ${i + 1} is null, and this function does not accept null, undefined, or NaN arguments.`))
						debugger;
					
					return;
				}
				else if (a !== a)
				{
					if (Be.util.report(`Argument ${i + 1} is NaN, and this function does not accept null, undefined, or NaN arguments.`))
						debugger;
					
					return;
				}
			}
		}
		else
		{
			let signature = Be.util.parseSignature(constraint);
			if (signature.parseError)
			{
				if (Be.util.report(signature.parseError, signature))
					debugger;
				
				return;
			}
			
			/* Bad input checks */
			let checkLengthMessage = Be.util.checkLength(signature, args);
			if (checkLengthMessage)
			{
				if (Be.util.report(checkLengthMessage, args))
					debugger;
				
				return;
			}
			
			let checkArgumentsMessage = Be.util.checkArguments(signature, args);
			if (checkArgumentsMessage)
			{
				if (Be.util.report(checkArgumentsMessage, args))
					debugger;
				
				return;
			}
		}
	}
	else if (constraint.length)
	{
		if (!Be.util.checkConstraint(value, constraint))
		{
			if (Be.util.report(`The value ${Be.util.stringifyValue(value)} does not comply with the constraint: ${Be.util.stringifyParameter(constraint)}`, value))
				debugger;
			
			return value;
		}
	}
	else if (!value)
	{
		if (Be.util.report(`The value ${Be.util.stringifyValue(value)} is not loosely equal (==) to true.`, value))
			debugger;
		
		return value;
	}
	
	return value;
}

/**  *///
module Be
{
	/** An error that is generated when an expectation fails. *///
	export class BeError implements Error
	{
		constructor(public message: string)
		{
			this.message = message;
			this.stack = (<any>new Error()).stack || "";
		}
		
		name = "BeError";
		value: any = "(No value is associated with this expectation failure.)";
		stack = "";
		constraint: string;
		
		/** The error, if any, that was thrown by the provided error handler (it happens). *///
		handlerError: Error;
	}
	
	BeError.prototype = <any>new Error;
	
	/** Fails with the specified error message. *///
	export function helpful(message: string)
	{
		if (util.report(message))
			debugger;
	}
	
	/** Makes sure that the execution point will never reach the current location. *///
	export function broken(value?: any): void
	{
		let message = "An invalid location has been reached in the program.";
		
		if (arguments.length === 1)
		{
			if (util.report(message, value))
				debugger;
		}
		else if (util.report(message))
			debugger;
	}
	
	/** Makes sure that the function is never called directly, and the only implementations exist in derived types. *///
	export function abstract()
	{
		if (util.report("This function must be overridden by an inheritor."))
			debugger;
	}
	
	/** Makes sure that the property is read only. Intended for use in a setter function. *///
	export function readOnly()
	{
		if (util.report("This property is read-only."))
			debugger;
	}
	
	/** Makes sure that the current function is not implemented. *///
	export function notImplemented()
	{
		if (util.report("This function has not been implemented."))
			debugger;
	}
	
	/** Makes sure that value is not null, undefined, NaN, false, 0, or ''. *///
	export function not<T>(value: T): T
	{
		if (value && util.report(`The value ${util.stringifyValue(value)} is not loosely equal (==) false.`, value))
			debugger;
	
		return value;
	}
	
	/** Makes sure that value is not undefined. *///
	export function notUndefined<T>(value: T): T
	{
		if (value === void 0 && util.report("The value is undefined."))
			debugger;
		
		return value;
	}
	
	/** Makes sure that value is not null, undefined, or NaN. *///
	export function notNull<T>(value: T): T
	{
		if (value === null)
		{
			if (util.report(`The value is null.`))
				debugger;
			
			return value;
		}
		
		if (value === void 0)
		{
			if (util.report(`The value is undefined.`))
				debugger;
			
			return value;
		}
		
		if (value !== value)
		{
			if (util.report(`The value is NaN.`))
				debugger;
			
			return value;
		}
		
		return value;
	}
	
	/**
	Makes sure that value is a non-empty or whitespace string, a non-empty array, or a non-function object with keys.
	*///
	export function notEmpty<T>(value: T): T
	{
		if (typeof value === "string")
		{
			if (!value || !/[\s]*/g.test(<any>value)) /* All whitespace */
				if (util.report("The string is empty, or contains only whitespace."))
					debugger;
			
			return value;
		}
		
		if (value instanceof Array)
		{
			if (!(<any>value).length)
				if (util.report("The array is empty."))
					debugger;
				
			return value;
		}
		
		if (value instanceof Object && !(value instanceof Function))
		{
			let hasKeys = false;
			for (let key in value)
			{
				hasKeys = true;
				break;
			}
			
			if (!hasKeys)
				if (util.report("The object is empty."))
					debugger;
				
			return value;
		}
		
		if (util.report(`The value ${util.stringifyValue(value)} is not a non-empty string, array, or object.`, value))
			debugger;
		
		return value;
	}
	
	/** Makes sure that value is a number greater than or equal to 0 (mainly used to check .indexOf()). *///
	export function positive(value: number): number
	{
		if ((value !== +value || value < 0) && util.report(`The value ${util.stringifyValue(value)} is not a number greater than or equal to 0.`, value))
			debugger;
		
		return value;
	}
	
	/** Makes sure that value is a string. *///
	export function string(value: any): string
	{
		if (typeof value !== "string" && util.report(`The value ${util.stringifyValue(value)} is not a string.`, value))
			debugger;
		
		return value;
	}
	
	/** Makes sure that value is a number. *///
	export function number(value: any): number
	{
		if ((typeof value !== "number" || value !== value) && util.report(`The value ${util.stringifyValue(value)} is not a number.`, value))
			debugger;
		
		return value;
	}
	
	/** Makes sure that value is a boolean. *///
	export function boolean(value: any): boolean
	{
		if (value !== !!value && util.report(`The value ${util.stringifyValue(value)} is not a boolean.`, value))
			debugger;
		
		return value;
	}
	
	/** Makes sure that value is a primitive (string, number, or boolean). *///
	export function primitive<T>(value: T): T
	{
		if (typeof value !== "string" && (typeof value !== "number" || value !== value) && (<any>value) !== !!value)
			if (util.report(`The value ${util.stringifyValue(value)} is not a primitive (string, number, boolean).`, value))
				debugger;
		
		return value;
	}
	
	/** Makes sure that value is a string containing an email address. *///
	export function email(value: any): string
	{
		if (typeof value !== "string" || !value || value.length < 6 || value.length > 254)
		{
			if (util.report(`The value ${util.stringifyValue(value)} could not be parsed as an email address.`, value))
				debugger;
			
			return value;
		}
		
		if (!/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/.test(value))
		{
			if (util.report(`The value ${util.stringifyValue(value)} could not be parsed as an email address.`, value))
				debugger;
			
			return value;
		}
			
		let parts = value.split("@");
		
		if (parts[0].length > 64)
		{
			if (util.report(`The value ${util.stringifyValue(value)} could not be parsed as an email address.`, value))
				debugger;
			
			return value;
		}
		
		for (let domainPart of parts[1].split("."))
			if (domainPart.length > 63)
				if (util.report(`The value ${util.stringifyValue(value)} could not be parsed as an email address.`, value))
					debugger;
		
		return value;
	}
	
	/** Makes sure that value is a Date object. *///
	export function date(value: any): Date
	{
		if (!(value instanceof Date) && util.report(`The value ${util.stringifyValue(value)} is not a Date object.`, value))
			debugger;
		
		return value;
	}
	
	/** Makes sure that value is a function. *///
	export function func<T>(value: T): T
	{
		if (typeof value !== "function" && util.report(`The value ${util.stringifyValue(value)} is not a function.`, value))
			debugger;
		
		return value;
	}
	
	/** Makes sure that value is a TypeScript-style enum. *///
	export function enumeration<T>(value: T): T
	{
		let isEnum = true;
		
		if (Object.prototype.toString.call(value) !== "[object Object]")
		{
			isEnum = false;
		}
		else
		{
			let keys = (() =>
			{
				let out: string[] = [];
				for (let key in value)
					out.push(key);
				
				return out;
			})();
			
			if (!keys.length || keys.length % 2)
				isEnum = false;
			
			else for (let i = -1; ++i < keys.length / 2;)
				if (value[value[i]] !== i)
					isEnum = false;
		}
		
		if (!isEnum && util.report(`The value ${util.stringifyValue(value)} is not a TypeScript-style enum type.`, value))
			debugger;
		
		return value;
	}
	
	/**
	Makes sure that value is an array. 
	Use of the rest parameter checks that the items of the array are all of one of the specified types.
	Valid values are String, Number, Boolean, null, undefined, a constructor function, or primitive literals.
	*///
	export function array(value: any[], ...constraint: any[])
	{
		if (Array.isArray ? !Array.isArray(value) : Object.prototype.toString["call"](value) !== "[object Array]")
			if (util.report(`The value ${util.stringifyValue(value)} is not an array.`, value))
				debugger;
		
		if (constraint.length)
		{
			for (let i = -1; ++i < value.length;)
			{
				if (!util.checkConstraint(value[i], constraint))
				{
					if (util.report(`Array item ${i} is ${util.stringifyValue(value[i])}, which does not comply with the constraint: ${util.stringifyParameter(constraint)}`, value))
						debugger;
					
					return value;
				}
			}
		}
		
		return value;
	}
	
	/**
	Makes sure that value is an object. 
	Use of the rest parameter checks that the members of the object are all of one of the specified types.
	Valid values are String, Number, Boolean, null, undefined, or a constructor function.
	*///
	export function object<T>(value: T, ...constraint: any[]): T
	{
		if (!(value instanceof Object))
		{
			if (util.report(`The value ${util.stringifyValue(value)} is not an object.`, value))
				debugger;
			
			return value;
		}
		
		if (constraint.length)
		{
			for (let key in value)
			{
				if (!util.checkConstraint(value[key], constraint))
				{
					if (util.report(`The .${key} property in the object is ${util.stringifyValue(value[key])}, which does not comply with the constraint: ` + util.stringifyParameter(constraint), value))
						debugger;
					
					return value;
				}
			}
		}
		
		return value;
	}
	
	/** Makes sure that the argument set to comply with one of the specified signatures (overloads). *///
	export function overloads(args: IArguments, ...overloads: any[]): void
	{
		if (!overloads || !overloads.length)
		{
			if (util.report("Be.overloads requires an array of signatures.", args))
				debugger;
			
			return;
		}
		
		let passesOneOverload = false;
		let signatures: util.Signature[] = [];
		
		for (let i = -1; ++i < overloads.length;)
		{
			let signature = util.parseSignature(overloads[i]);
			signatures.push(signature);
			
			if (signature.parseError)
			{
				if (Be.util.report(signature.parseError, signature))
					debugger;
				
				return;
			}
			
			if (!util.checkLength(signature, args))
				if (!util.checkArguments(signature, args))
					return;
		}
		
		let overloadsText = "";
		
		for (let sig of signatures)
			overloadsText += "\r\n\t" + util.stringifySignature(sig);
		
		if (util.report(`The arguments do not comply with any of the ${overloads.length} overloads:${overloadsText}`, args))
			debugger;
	}
	
	export var rest = () => {};
	export var any = () => {};
	export var optional = () => {};
	
	/** The handler function to call when an expectation fails. *///
	export var handler: (e: BeError) => void = null;
	
	/** Whether or not exceptions should be thrown when an expectation fails. *///
	export var exceptional = false;
		
	/**
	Whether or not debugger statements should be triggered on a failure. Automatically disables after the first failure.
	*///
	export var debuggable = true;
}

module Be.util
{
	/** Reports the specified error and returns whether debugger; statements are enabled. *///
	export function report(message: string, value?: any): boolean
	{
		let hasValue = !(value instanceof Signature) && arguments.length > 1;
		
		message = value instanceof Signature ?
			"Invalid signature: " + message :
			"Failed expectation: " + message;
		
		let error = new BeError(message);
		
		if (hasValue)
			error.value = value;
		
		let handlerError: Error = null;
		
		if (Be.handler instanceof Function)
		{
			try
			{
				Be.handler(error);
			}
			catch (e)
			{
				handlerError = e;
			}
		}
		
		if (!Be.exceptional || typeof console !== "undefined")
		{
			let output = msg => 
				typeof console.error === "function" ?
					console.error(msg) :
					console.log(msg);
			
			output(message);
			
			if (handlerError)
			{
				console.log("%cYour error handler threw an error.", "color: red, font-size: 150%");
				output(handlerError);
			}
		}
		else throw error;
		
		return Be.debuggable;
	}
	
	/** Returns whether the value is one of the obvious errors (NaN, null unless allowed, undefined unless allowed). *///
	export function checkObvious(value: any, constraint: any[])
	{
		/* NaN is always an error. */
		if (value !== value)
			return false;
		
		let scanFor = (val: any) =>
		{
			for (let i = -1; ++i < constraint.length;)
				if (constraint[i] === val)
					return true;
			
			return false;
		}
		
		/* undefined is an error if it's not explicitly allowed. */
		if (value === void 0)
			return scanFor(void 0);
		
		/* null is an error if it's not explicitly allowed. */
		if (value === null)
			return scanFor(null);
		
		return true;
	}
	
	/** Returns whether the specified value is congruent with one (or more) of the specified constraint. *///
	export function checkConstraint(value: any, constraint: any[])
	{
		if (!checkObvious(value, constraint))
			return false;
		
		if (!constraint.length)
			return true;
		
		for (let part of constraint)
		{
			if ((typeof value === "string" || +value === value || !!value === value) && value === part)
				return true;
			
			else if (part === null && value === null)
				return true;
			
			else if (part === void 0 && value === void 0)
				return true;
			
			else if (part === String)
			{
				if (typeof value === "string")
					return true;
			}
			else if (part === Number)
			{
				if (typeof value === "number")
					return true;
			}
			else if (part === Boolean)
			{
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
	
	/** Returns the message to display if the wrong number of arguments were passed. *///
	export function checkLength(signature: Signature, args: IArguments)
	{
		let minLength = signature.parameters.length;
		
		if (signature.optionalPoint > -1)
			minLength = signature.optionalPoint;
		
		else if (signature.hasRest)
			minLength--;
		
		if (args.length < minLength)
			return `The signature expects${minLength < signature.parameters.length ? " at least" : ""} ${minLength} parameter${minLength > 1 ? "s" : ""} (${stringifySignature(signature)}), but ${args.length} were specified.`;
		
		if (args.length > signature.parameters.length && !signature.hasRest)
			return `The signature expects${signature.optionalPoint > -1 ? " at most" : ""} ${signature.parameters.length} parameter${signature.parameters.length > 1 ? "s" : ""} (${stringifySignature(signature)}), but ${args.length} were specified.`;
		
		return "";
	}
	
	/** Returns the message to display if there is a type error with one or more of the arguments. *///
	export function checkArguments(signature: Signature, args: IArguments)
	{
		for (let i = -1; ++i < args.length;)
		{
			let arg = args[i];
			let paramIdx = i >= signature.parameters.length ? signature.parameters.length - 1 : i;
			let param = signature.parameters[paramIdx];
			
			if (!util.checkConstraint(arg, param.types))
				return `Argument ${i + 1} is ${stringifyValue(arg)}, but it's expected to comply with the constraint: ${stringifyParameter(param)}.`;
		}
		
		return "";
	}
	
	/** Creates a signature AST-thing from the input array. *///
	export function parseSignature(rawSignature: any[])
	{
		let signature = new Signature();
		
		let extract = (constraint: any, expectMarker: any) =>
		{
			if (constraint instanceof Array)
			{
				let extracted = false;
				
				for (let n = constraint.length; n-- > 0;)
				{
					if (constraint[n] === expectMarker)
					{
						constraint.splice(n, 1);
						extracted = true;
					}
				}
				
				return extracted;
			}
			
			return constraint === expectMarker;
		}
		
		for (let i = -1; ++i < rawSignature.length;)
		{
			let constraint: any[] = rawSignature[i] instanceof Array ? rawSignature[i] : [rawSignature[i]];
			
			if (extract(constraint, Be.rest))
			{
				if (i !== rawSignature.length - 1)
				{
					signature.parseError = "Only the last parameter be a rest parameter.";
					break;
				}
				
				if (extract(constraint, Be.optional))
				{
					signature.parseError = "Rest parameters can not be optional.";
					break;
				}
				
				signature.hasRest = true;
			}
			
			if (extract(constraint, Be.optional))
			{
				if (signature.optionalPoint < 0)
				{
					let op = signature.optionalPoint;
					signature.optionalPoint = i;
				}
			}
			else if (signature.optionalPoint > -1 && !signature.hasRest)
			{
				signature.parseError = "Required parameters must go before optional and rest parameters.";
				break;
			}
			
			signature.parameters.push(parseParameter(constraint));
		}
		
		return signature;
	}
	
	/** *///
	export function parseParameter(constraint: any)
	{
		let param = new Parameter();
		let constraintArray: any[] = constraint instanceof Array ? constraint : [constraint];
			
		for (let n = constraintArray.length; n-- > 0;)
		{
			let expectName = util.getBeFunctionName(constraintArray[n]);
			if (expectName)
			{
				if (expectName in param)
					param[expectName] = true;
			}
			else param.types.push(constraintArray[n]);
		}
		
		return param;
	}
	
	/** *///
	export function stringifySignature(signature: any[]|Signature)
	{
		let sig: Signature = signature instanceof Signature ?
			signature : 
			parseSignature(<any[]>signature);
		
		let stringifiedParams: string[] = [];
		
		for (let i = -1; ++i < sig.parameters.length;)
		{
			let additionalOptions: string[] = [];
			
			if (i >= sig.optionalPoint && (!sig.hasRest || i !== sig.parameters.length - 1))
				additionalOptions.push(getBeFunctionName(Be.optional));
			
			else if (sig.hasRest && i === sig.parameters.length - 1)
				additionalOptions.push(getBeFunctionName(Be.rest));
			
			stringifiedParams.push(stringifyParameter(sig.parameters[i], additionalOptions));
		}
		
		return stringifiedParams.join(", ");
	}
	
	/** *///
	export function stringifyParameter(parameter: any[]|Parameter, additionalOptions?: string[])
	{
		let param: Parameter = parameter instanceof Parameter ?
			parameter :
			parseParameter(<any[]>parameter);
		
		let types: string[] = [];
		
		if (param.types.length === 0)
		{
			types.push("any");
		}
		else for (let type of param.types)
		{
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
			
			else if (type instanceof Function)
			{
				let info = parseFunction(type);
				types.push(info.name || "(unknown constructor)");
			}
			
			else types.push("" + type);
		}
		
		let options: string[] = [];
		
		for (let key in param)
			if (typeof param[key] === "boolean" && param[key])
				options.push(key);
		
		if (additionalOptions)
			for (let ao of additionalOptions)
				options.push(ao);
		
		return types.join(" | ") + (options.length ? ` (${options.join(", ")})` : "");
	}
	
	/** Returns a string representation of an non-compliant value passed in. *///
	export function stringifyValue(value: any)
	{
		if (value instanceof Array)
			return `(Array(${value.length}))`;
		
		if (typeof value === "function")
		{
			let fnInfo = parseFunction(value);
			return fnInfo.name ? `(function ${fnInfo.name})` : `(function)`;
		}
		
		if (value instanceof Object)
		{
			let stringified = value.toString();
			return /\[object [a-z0-9_$]{0,}\]/i.test(stringified) ? stringified : "(object)";
		}
		
		if (typeof value === "string")
		{
			if (value === "")
				return "(empty string '')";
			
			if (value.length > 10)
				return `(string '${value.slice(0, 10)}...')`;
			
			return `(string '${value}')`;
		}
		
		return "(" + value + ")";
	}
		
	/** *///
	function parseFunction(fn: any)
	{
		if (fn instanceof Function)
		{
			let fnText = fn.toString();
			return {
				name: /^function\s([a-z_$]{1,})/i.exec(fnText)[1] || "",
				isBuiltIn: /^function\s[a-z_$]{1,}\(\)[\s]{0,}{[\s]{0,}\[\snative code\s\][\s]{0,}}/gi.test(fnText)
			}
		}
		
		return null;
	}
	
	/** *///
	export function getKeys(o: any)
	{
		if (!(o instanceof Object))
			return [];
		
		let out: string[] = [];
		
		for (let key of o)
			out.push(key);
		
		return out;
	}
	
	/** Returns the name of the Be.* function. *///
	export function getBeFunctionName(constraint: any)
	{
		return constraint instanceof Function && 
			constraint.expectName && 
			Be[constraint.expectName] === constraint ? 
				constraint.expectName : "";
	}
	
	/** *///
	export function isArguments(a: any)
	{
		return a instanceof Object && a.constructor === Object && a.length >= 0 && a.toString() === "[object Arguments]";
	}
	
	/** *///
	function initialize()
	{
		let passable = [
			Be.not,
			Be.notEmpty,
			Be.positive,
			Be.email,
			Be.enumeration,
			Be.optional,
			Be.rest,
			Be.any
		];
		
		for (let key in Be)
			if (passable.indexOf(Be[key]) > -1)
				Be[key].expectName = key;
	}
	initialize();
	
	
	export class Signature
	{
		parameters: Parameter[] = [];
		optionalPoint = -1;
		hasRest = false;
		
		parseError = "";
	}
	
	
	export class Parameter
	{
		types = [];
		not = false;
		notEmpty = false;
		positive = false;
		enumerated = false;
		email = false;
		
		parseError = "";
	}
}
