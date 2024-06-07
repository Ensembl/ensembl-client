/*! For license information please see 156.f9740da5.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[156],{"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes="",i=0;i<arguments.length;i++){var arg=arguments[i];arg&&(classes=appendClass(classes,parseValue(arg)))}return classes}function parseValue(arg){if("string"==typeof arg||"number"==typeof arg)return arg;if("object"!=typeof arg)return"";if(Array.isArray(arg))return classNames.apply(null,arg);if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]"))return arg.toString();var classes="";for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&(classes=appendClass(classes,key));return classes}function appendClass(value,newClass){return newClass?value?value+" "+newClass:value+newClass:value}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/core-js/internals/array-method-is-strict.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var fails=__webpack_require__("./node_modules/core-js/internals/fails.js");module.exports=function(METHOD_NAME,argument){var method=[][METHOD_NAME];return!!method&&fails((function(){method.call(null,argument||function(){return 1},1)}))}},"./node_modules/core-js/internals/array-reduce.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),IndexedObject=__webpack_require__("./node_modules/core-js/internals/indexed-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),$TypeError=TypeError,REDUCE_EMPTY="Reduce of empty array with no initial value",createMethod=function(IS_RIGHT){return function(that,callbackfn,argumentsLength,memo){var O=toObject(that),self=IndexedObject(O),length=lengthOfArrayLike(O);if(aCallable(callbackfn),0===length&&argumentsLength<2)throw new $TypeError(REDUCE_EMPTY);var index=IS_RIGHT?length-1:0,i=IS_RIGHT?-1:1;if(argumentsLength<2)for(;;){if(index in self){memo=self[index],index+=i;break}if(index+=i,IS_RIGHT?index<0:length<=index)throw new $TypeError(REDUCE_EMPTY)}for(;IS_RIGHT?index>=0:length>index;index+=i)index in self&&(memo=callbackfn(memo,self[index],index,O));return memo}};module.exports={left:createMethod(!1),right:createMethod(!0)}},"./node_modules/core-js/internals/correct-is-regexp-logic.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var MATCH=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("match");module.exports=function(METHOD_NAME){var regexp=/./;try{"/./"[METHOD_NAME](regexp)}catch(error1){try{return regexp[MATCH]=!1,"/./"[METHOD_NAME](regexp)}catch(error2){}}return!1}},"./node_modules/core-js/internals/define-built-in-accessor.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var makeBuiltIn=__webpack_require__("./node_modules/core-js/internals/make-built-in.js"),defineProperty=__webpack_require__("./node_modules/core-js/internals/object-define-property.js");module.exports=function(target,name,descriptor){return descriptor.get&&makeBuiltIn(descriptor.get,name,{getter:!0}),descriptor.set&&makeBuiltIn(descriptor.set,name,{setter:!0}),defineProperty.f(target,name,descriptor)}},"./node_modules/core-js/internals/delete-property-or-throw.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var tryToString=__webpack_require__("./node_modules/core-js/internals/try-to-string.js"),$TypeError=TypeError;module.exports=function(O,P){if(!delete O[P])throw new $TypeError("Cannot delete property "+tryToString(P)+" of "+tryToString(O))}},"./node_modules/core-js/internals/is-regexp.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var isObject=__webpack_require__("./node_modules/core-js/internals/is-object.js"),classof=__webpack_require__("./node_modules/core-js/internals/classof-raw.js"),MATCH=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("match");module.exports=function(it){var isRegExp;return isObject(it)&&(void 0!==(isRegExp=it[MATCH])?!!isRegExp:"RegExp"===classof(it))}},"./node_modules/core-js/internals/not-a-regexp.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var isRegExp=__webpack_require__("./node_modules/core-js/internals/is-regexp.js"),$TypeError=TypeError;module.exports=function(it){if(isRegExp(it))throw new $TypeError("The method doesn't accept regular expressions");return it}},"./node_modules/core-js/internals/object-get-own-property-names.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var internalObjectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys-internal.js"),hiddenKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js").concat("length","prototype");exports.f=Object.getOwnPropertyNames||function getOwnPropertyNames(O){return internalObjectKeys(O,hiddenKeys)}},"./node_modules/core-js/modules/es.array.includes.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),$includes=__webpack_require__("./node_modules/core-js/internals/array-includes.js").includes,fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),addToUnscopables=__webpack_require__("./node_modules/core-js/internals/add-to-unscopables.js");$({target:"Array",proto:!0,forced:fails((function(){return!Array(1).includes()}))},{includes:function includes(el){return $includes(this,el,arguments.length>1?arguments[1]:void 0)}}),addToUnscopables("includes")},"./node_modules/core-js/modules/es.array.reduce.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),$reduce=__webpack_require__("./node_modules/core-js/internals/array-reduce.js").left,arrayMethodIsStrict=__webpack_require__("./node_modules/core-js/internals/array-method-is-strict.js"),CHROME_VERSION=__webpack_require__("./node_modules/core-js/internals/engine-v8-version.js");$({target:"Array",proto:!0,forced:!__webpack_require__("./node_modules/core-js/internals/engine-is-node.js")&&CHROME_VERSION>79&&CHROME_VERSION<83||!arrayMethodIsStrict("reduce")},{reduce:function reduce(callbackfn){var length=arguments.length;return $reduce(this,callbackfn,length,length>1?arguments[1]:void 0)}})},"./node_modules/core-js/modules/es.array.unshift.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),setArrayLength=__webpack_require__("./node_modules/core-js/internals/array-set-length.js"),deletePropertyOrThrow=__webpack_require__("./node_modules/core-js/internals/delete-property-or-throw.js"),doesNotExceedSafeInteger=__webpack_require__("./node_modules/core-js/internals/does-not-exceed-safe-integer.js");$({target:"Array",proto:!0,arity:1,forced:1!==[].unshift(0)||!function(){try{Object.defineProperty([],"length",{writable:!1}).unshift()}catch(error){return error instanceof TypeError}}()},{unshift:function unshift(item){var O=toObject(this),len=lengthOfArrayLike(O),argCount=arguments.length;if(argCount){doesNotExceedSafeInteger(len+argCount);for(var k=len;k--;){var to=k+argCount;k in O?O[to]=O[k]:deletePropertyOrThrow(O,to)}for(var j=0;j<argCount;j++)O[j]=arguments[j]}return setArrayLength(O,len+argCount)}})},"./node_modules/core-js/modules/es.string.includes.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),notARegExp=__webpack_require__("./node_modules/core-js/internals/not-a-regexp.js"),requireObjectCoercible=__webpack_require__("./node_modules/core-js/internals/require-object-coercible.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),correctIsRegExpLogic=__webpack_require__("./node_modules/core-js/internals/correct-is-regexp-logic.js"),stringIndexOf=uncurryThis("".indexOf);$({target:"String",proto:!0,forced:!correctIsRegExpLogic("includes")},{includes:function includes(searchString){return!!~stringIndexOf(toString(requireObjectCoercible(this)),toString(notARegExp(searchString)),arguments.length>1?arguments[1]:void 0)}})},"./node_modules/core-js/modules/es.symbol.description.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),global=__webpack_require__("./node_modules/core-js/internals/global.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),isPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-is-prototype-of.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),defineBuiltInAccessor=__webpack_require__("./node_modules/core-js/internals/define-built-in-accessor.js"),copyConstructorProperties=__webpack_require__("./node_modules/core-js/internals/copy-constructor-properties.js"),NativeSymbol=global.Symbol,SymbolPrototype=NativeSymbol&&NativeSymbol.prototype;if(DESCRIPTORS&&isCallable(NativeSymbol)&&(!("description"in SymbolPrototype)||void 0!==NativeSymbol().description)){var EmptyStringDescriptionStore={},SymbolWrapper=function Symbol(){var description=arguments.length<1||void 0===arguments[0]?void 0:toString(arguments[0]),result=isPrototypeOf(SymbolPrototype,this)?new NativeSymbol(description):void 0===description?NativeSymbol():NativeSymbol(description);return""===description&&(EmptyStringDescriptionStore[result]=!0),result};copyConstructorProperties(SymbolWrapper,NativeSymbol),SymbolWrapper.prototype=SymbolPrototype,SymbolPrototype.constructor=SymbolWrapper;var NATIVE_SYMBOL="Symbol(description detection)"===String(NativeSymbol("description detection")),thisSymbolValue=uncurryThis(SymbolPrototype.valueOf),symbolDescriptiveString=uncurryThis(SymbolPrototype.toString),regexp=/^Symbol\((.*)\)[^)]+$/,replace=uncurryThis("".replace),stringSlice=uncurryThis("".slice);defineBuiltInAccessor(SymbolPrototype,"description",{configurable:!0,get:function description(){var symbol=thisSymbolValue(this);if(hasOwn(EmptyStringDescriptionStore,symbol))return"";var string=symbolDescriptiveString(symbol),desc=NATIVE_SYMBOL?stringSlice(string,7,-1):replace(string,regexp,"$1");return""===desc?void 0:desc}}),$({global:!0,constructor:!0,forced:!0},{Symbol:SymbolWrapper})}},"./node_modules/lodash/_baseFindIndex.js":module=>{module.exports=function baseFindIndex(array,predicate,fromIndex,fromRight){for(var length=array.length,index=fromIndex+(fromRight?1:-1);fromRight?index--:++index<length;)if(predicate(array[index],index,array))return index;return-1}},"./node_modules/lodash/_baseTrim.js":(module,__unused_webpack_exports,__webpack_require__)=>{var trimmedEndIndex=__webpack_require__("./node_modules/lodash/_trimmedEndIndex.js"),reTrimStart=/^\s+/;module.exports=function baseTrim(string){return string?string.slice(0,trimmedEndIndex(string)+1).replace(reTrimStart,""):string}},"./node_modules/lodash/_trimmedEndIndex.js":module=>{var reWhitespace=/\s/;module.exports=function trimmedEndIndex(string){for(var index=string.length;index--&&reWhitespace.test(string.charAt(index)););return index}},"./node_modules/lodash/before.js":(module,__unused_webpack_exports,__webpack_require__)=>{var toInteger=__webpack_require__("./node_modules/lodash/toInteger.js");module.exports=function before(n,func){var result;if("function"!=typeof func)throw new TypeError("Expected a function");return n=toInteger(n),function(){return--n>0&&(result=func.apply(this,arguments)),n<=1&&(func=void 0),result}}},"./node_modules/lodash/findIndex.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseFindIndex=__webpack_require__("./node_modules/lodash/_baseFindIndex.js"),baseIteratee=__webpack_require__("./node_modules/lodash/_baseIteratee.js"),toInteger=__webpack_require__("./node_modules/lodash/toInteger.js"),nativeMax=Math.max;module.exports=function findIndex(array,predicate,fromIndex){var length=null==array?0:array.length;if(!length)return-1;var index=null==fromIndex?0:toInteger(fromIndex);return index<0&&(index=nativeMax(length+index,0)),baseFindIndex(array,baseIteratee(predicate,3),index)}},"./node_modules/lodash/isEqual.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseIsEqual=__webpack_require__("./node_modules/lodash/_baseIsEqual.js");module.exports=function isEqual(value,other){return baseIsEqual(value,other)}},"./node_modules/lodash/noop.js":module=>{module.exports=function noop(){}},"./node_modules/lodash/once.js":(module,__unused_webpack_exports,__webpack_require__)=>{var before=__webpack_require__("./node_modules/lodash/before.js");module.exports=function once(func){return before(2,func)}},"./node_modules/lodash/toFinite.js":(module,__unused_webpack_exports,__webpack_require__)=>{var toNumber=__webpack_require__("./node_modules/lodash/toNumber.js");module.exports=function toFinite(value){return value?Infinity===(value=toNumber(value))||-Infinity===value?17976931348623157e292*(value<0?-1:1):value==value?value:0:0===value?value:0}},"./node_modules/lodash/toInteger.js":(module,__unused_webpack_exports,__webpack_require__)=>{var toFinite=__webpack_require__("./node_modules/lodash/toFinite.js");module.exports=function toInteger(value){var result=toFinite(value),remainder=result%1;return result==result?remainder?result-remainder:result:0}},"./node_modules/lodash/toNumber.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseTrim=__webpack_require__("./node_modules/lodash/_baseTrim.js"),isObject=__webpack_require__("./node_modules/lodash/isObject.js"),isSymbol=__webpack_require__("./node_modules/lodash/isSymbol.js"),reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt;module.exports=function toNumber(value){if("number"==typeof value)return value;if(isSymbol(value))return NaN;if(isObject(value)){var other="function"==typeof value.valueOf?value.valueOf():value;value=isObject(other)?other+"":other}if("string"!=typeof value)return 0===value?value:+value;value=baseTrim(value);var isBinary=reIsBinary.test(value);return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NaN:+value}},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);