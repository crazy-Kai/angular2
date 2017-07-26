"use strict";

export class Limt{
	 contains(arr,target){
		let result:boolean = false;
		let obj :any = {};
		 for(let i = 0; i<arr.length;i++){
		 	if(arr[i] == target){
		 		obj.index = i;
		 		 result = true;
		 	}
		 };
		 obj.result = result;
		 return obj;
	}
}

// // 变量
// const limits = {};//工具类
// const WIN = window;
// const DOC = WIN.document;
// const BODY = DOC.body;
// const objectProto = Object.prototype;
// const arrayProto = Array.prototype;
// const stringProto = String.prototype;
// const functionProto = Function.prototype;

// 	// 确定全局是否用兼容方法
// limits['limitFixed'] = false;
// limits['limitFixed'] = false;

// // 自有属性
// const { defineProperty, is, assign, keys, values, entries } = Object;
// const { toString, hasOwnProperty } = objectProto;
// const { from, of } = Array;
// const {	concat, push, slice, unshift, splice,
// 		forEach, map, filter, some, every, indexOf, lastIndexOf, reduce, reduceRight,
// 		find, findIndex, fill, copyWithin } = arrayProto;
// const { fromCodePoint } = String;
// const { trim, codePointAt, startsWith, endsWith, repeat} = stringProto;
// const { bind } = functionProto;

// 	// 传递器
// const K = val => val;
// const F = (...args) => args;

// 	// 空函数
// const E = () => {};

// 	// 空对象
// const O = {};
// // --检查参数-- //

// // 如果是null undefined 返回空对象
// const checkTargetNoEqualNull = (target, ...args) => target == null ? [{}, ...args] : [target, ...args];

// // 如果是控制为array
// const checkTargetWithArray = (target, ...args) => [limits['toArray'](target), ...args];


// // 控制参数为数字
// const checkTargetWithNumber = (target, ...args) => [limits['toNumber'](target), ...args];

// // 确定第一个参数是对象，第二个参数函数
// const checkObjFunction = (obj, iterator, ...args) => checkTargetNoEqualNull(obj, limits['cb'](iterator), ...args);

// // 确定第一个参数是数组，第二个参数函数
// const checkArrFunction = (arr, iterator, ...args) => checkTargetWithArray(arr, limits['cb'](iterator), ...args);

// 	// 获取属性
// const getProp = (obj = O, key = '', deVal) => obj[key] === void 0 ? deVal : obj[key];

// // 定义:priority,fixed,when,format
// const defineIt = (name, config = O) => {
// 	let priority, fixed, when, format, value;
// 	// 对name进行处理
// 	let arr = name.split(',');
// 	name = arr.shift();
// 	if(!name) return;
// 	if(arr.length){
// 		defineIt(arr.join(','), config);
// 	};
// 	if( config['value'] === void 0 ){
// 		// 新方法
// 		priority = getProp(config, 'priority', F);
// 		// 兼容性方法
// 		fixed = getProp(config, 'fixed', K);
// 		// 条件 [默认为false]
// 		when = getProp(config, 'when', E);
// 		// 格式化参数
// 		format = getProp(config, 'format', F);
// 		// 主函数
// 		value = function(){
// 			// 这里的arguments就相当于调用limit.FN方法后传入的obj的值
// 			let args = concat.call( arrayProto, arrayProto.slice.call(arguments) );
// 			//...es6 解构操作符
// 			return !limits['limitFixed'] && when(...args) ? priority(...args) : fixed(...args);
// 		};
// 	}else{
// 		value = config['value'];
// 	};
// 	typeof value === 'function' && (value.toString = () => 'function () { [native code] }');
// 	if( defineProperty ){
// 		defineProperty(limits, name, {
// 			value,
// 			writable: false, //只读
// 			enumerable: true, //被枚举
// 			configurable: false //更改内部属性
// 		});
// 	}else{
// 		if( limits['name'] !== void 0){
// 			throw new TypeError('Cannot redefine property: ' + name);
// 		};
// 		limits['name'] = value;
// 	};
// 	return value;
// };

// // 传递器
// defineIt('K', {value: K});
// defineIt('F', {value: F});

// // 获取属性
// defineIt('getProp', {value: getProp});



// // mix: toArray
// const sliceFix = obj => {
// 	let arr = [], 
// 		i = 0;
// 	for(; i < obj.length; i++){
// 		arr[i] = obj[i];
// 	};
// 	return arr;
// };

// // 是否是函数function
// defineIt('isFunction', { value: n => typeof n === 'function' });

// // 确定是函数
// defineIt('cb', { value: callback => limits['isFunction'](callback) ? callback : K });

// // 获取键值
// defineIt('_getLoopKey', { value: obj => limits['isArrayLike'](obj) ? limits['keys']( limits['toArray'](obj) ) : limits['keys'](obj) });

// // array arguments nodeList jObject window[排除] function[排除]
// defineIt('isArrayLike', { value: n => !!n && limits['isNumber'](n.length) && !limits['isFunction'](n) && !limits['isWin'](n) });

// // 判断是否是window
// defineIt('isWin', { value: n => !!n && n.window === n && n.self == n });

// // --工具方法-- //
// // 是否是这些[string number array data regexp error]对象
// 'String,Number,Array,Date,RegExp,Error,Math'.replace(/\w+/g, (k) => defineIt('is' + k, { value: n => toString.call(n) === '[object '+k+']' }) );

// // 私有遍历
// defineIt('_loop', {
// 	value: (obj, iterator, context, isBreak, begin) => {
// 		// 循环遍历
// 		let target = limits['_getLoopKey'](obj),
// 			key, num = ~~begin, len = target.length;
// 		for(; num < len; num++){
// 			key = target[num];
// 			if( iterator.call(context, obj[key], key, obj) === false && isBreak ) break;
// 		};
// 	}
// });


// // 静态判定
// defineIt('has', {
// 	// format: checkTargetNoEqualNull,
// 	fixed: (n, k) => {
// 		//排除 null 和 undefined
// 		return  n != null && hasOwnProperty.call(n, k);
// 	}
// });

// // ES5: Object.keys();
// defineIt('keys', {
// 	when: () => !!keys,
// 	priority: (args) => keys(args),
// 	// format: checkTargetNoEqualNull,
// 	fixed(obj){
// 		let arr = [];
// 		//排除null 和 undefined
// 		if (obj == null) return arr;

// 		limits['forin'](obj, (val, key) => limits['has'](obj, key) && arr.push(key) );
// 		return arr;
// 	}
// });

// defineIt('toArray', {
// 	value: obj => {
// 		// 如果是数组原始返回
// 		if( limits['isArray'](obj) ){
// 			return obj;
// 		}else if( limits['isArrayLike'](obj) ){ // 如果是类数组对象的话就格式化数组
// 			try{
// 				return slice.call(obj);
// 			}catch(e){
// 				//将
// 				return sliceFix(obj)
// 			};
// 		}else{
// 			return  [] ;
// 		};
// 	}
// });

// // 遍历
// defineIt('forin', {
// 	// format: checkObjFunction,
// 	fixed(obj, iterator, context){
// 		//排除null 和 undefined
// 		if (obj == null ) return {};
// 		for(let key in obj){
// 			iterator.call(context, obj[key], key, obj);
// 		};
// 	}
// });

// //包涵
// defineIt('contains', {

// 	value:(array,target) => {
// 		let object :any = {};
			
// 		limits['_loop'](array,(val,key)=> {
// 			console.log(array,val,limits['is'](val,target))
// 			if(limits['is'](val,target)){
// 				console.log('进入最后循环');
// 				object.index = key;
// 				object.result = true;
// 				return false;
// 			}
// 		},null,true);
// 		return object;	
// 	}
// })

// defineIt('isNaN', {
// 	// 由于isNaN方法会预先 Number(n) 再去做判断 所以导致有些变量(+null = 0);返回错误,如isNaN('NaN') => true,NaN =>[ object Number ]
//     when: () => !!Number.isNaN, 
//     priority: (args) => Number.isNaN(args), 
//     fixed: n => limits['isNumber'] && isNaN(n) 
// })

// defineIt('is', {
// 	// format: checkObjFunction,
// 	  when: () => !!Object.is, 
// 	  priority: (...args) => Object.is(...args),
// 	  fixed: (a,b) => {
// 	  	 // 区分NaN
// 	  	if(limits['isNaN'](a) && limits['isNaN'](b)){
// 	  	 	return true;

// 	  	}
// 	  	// 区分 +0 -0
//  		if( a === 0 && b === 0){
//  			return 1/a === 1/b;
//  		};
//  		console.log(a === b)
// 	 	return a === b;
// 	  }
// })

	
// export  { limits };



