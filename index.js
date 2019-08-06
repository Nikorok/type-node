((global, factory) => {
	typeof exports === 'object' && typeof module !== 'undefined'
		? (module.exports = factory())
		: typeof define === 'function' && define.amd
		? define(factory)
		: ((global = global || self), (global.Kilo = factory()));
})(this, () => {
	let types = {
		string(v) {
			return typeof v === 'string' || v instanceof String;
		},
		number(v) {
			return typeof v === 'number' && !isNaN(v) && isFinite(v);
		},
		float(v) {
			const pattern = /^\d+\.\d+$/g;
			return typeof v === 'number' && !isNaN(v) && isFinite(v) && pattern.test(v);
		},
		int(v) {
			const pattern = /^\d+[^.]$/g;
			return typeof v === 'number' && !isNaN(v) && isFinite(v) && pattern.test(v);
		},
		boolean(v) {
			return typeof v === 'boolean';
		},
		simbol(v) {
			return typeof v === 'symbol';
		},
		function(v) {
			return typeof v === 'function';
		},
		undefined(v) {
			return typeof v === 'undefined';
		},
		object(v) {
			return (
				typeof v === 'object' &&
				!Array.isArray(v) &&
				Object.prototype.toString.call(v) === '[object Object]'
			);
		},
		array(v) {
			return (
				typeof v === 'object' &&
				Array.isArray(v) &&
				Object.prototype.toString.call(v) === '[object Array]'
			);
		},
		regexp(v) {
			return (
				typeof v === 'object' &&
				!Array.isArray(v) &&
				Object.prototype.toString.call(v) === '[object RegExp]'
			);
		},
		null(v) {
			return v === null;
		},
		error(v) {
			return v instanceof Error && typeof e.message !== 'undefined';
		},
		date(v) {
			return v instanceof Date;
		},
		promise(v) {
			return v instanceof Promise && typeof v.then === 'function';
		},
		iterable(v) {
			return typeof v[Symbol.iterator] === 'function';
		},
	};

	/**
	 * Check if value type equal type
	 * @param {any} v value
	 * @param {string|array} type
	 */
	function is(v, type) {
		return typeof type === 'object' &&
			Array.isArray(type) &&
			Object.prototype.toString.call(type) === '[object Array]'
			? Object.keys(types).some(type => of(v).includes(type))
			: types[type](v);
	}

	/**
	 * Return type(s) of value
	 * @param {any} v value
	 */
	function of(v) {
		let vTypes = [];
		for (const type in types) {
			if (types.hasOwnProperty(type)) {
				if (types[type](v)) vTypes.push(type);
			}
		}

		return vTypes.length == 1 ? vTypes[0] : vTypes;
	}

	/**
	 * Use to add new custom type
	 * @param {string} name Name of the new custom type
	 * @param {function} validator Function wich validate input argument. Must return true or false
	 */
	function use(name, validator) {
		if (typeof validator !== 'function') throw new TypeError(`Validator must be function.`);
		types[name] = validator;
	}

	/**
	 * Return is element equal schema
	 * ```
	 * // Schema key options
	 * const schema = {
	 *  key: {
	 *      type: 'string', //type of value,
	 *      required: true //is this key required
	 *  },
	 *  key: {
	 *      type: ['string', 'int'], //multiple type of value,
	 *  }
	 * }
	 * ```
	 * @param {any} v
	 * @param {object} schema
	 *
	 */
	function shape(v, schema) {
		for (const key in schema) {
			if (schema.hasOwnProperty(key)) {
				if (
					(!v[key] && schema[key].required) ||
					(schema[key].required && !is(v[key], schema[key].type))
				) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Add pack of types.
	 * ```
	 * // packs\your-pack
	 * module.exports = {
	 *  name: 'your-pack',
	 *  types: {
	 *   email: v => /^[^]+\@\w+\.\w+$/.test(v)
	 *  }
	 * }
	 *
	 * // app.js
	 * const type = require('type-node');
	 * const yourPack = require('./packs/your-pack');
	 *
	 * type.pack(yourPack);
	 * ```
	 * @param {object} pack name and types
	 */
	function pack({ name, types: packTypes }) {
		for (const type in packTypes) {
			if (types.hasOwnProperty(type)) {
				types[`${name}.${type}`] = packTypes[type];
			}
		}
	}

	return { is, use, shape, of, pack };
});
