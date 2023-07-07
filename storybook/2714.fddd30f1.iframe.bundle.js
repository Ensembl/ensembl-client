/*! For license information please see 2714.fddd30f1.iframe.bundle.js.LICENSE.txt */
(()=>{var deferred,next,__webpack_modules__={"./src/shared/workers/sequenceFetcher.worker.ts":(__unused_webpack_module,__unused_webpack___webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__("./node_modules/core-js/modules/es.promise.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");const proxyMarker=Symbol("Comlink.proxy"),createEndpoint=Symbol("Comlink.endpoint"),releaseProxy=Symbol("Comlink.releaseProxy"),finalizer=Symbol("Comlink.finalizer"),throwMarker=Symbol("Comlink.thrown"),isObject=val=>"object"==typeof val&&null!==val||"function"==typeof val,transferHandlers=new Map([["proxy",{canHandle:val=>isObject(val)&&val[proxyMarker],serialize(obj){const{port1,port2}=new MessageChannel;return expose(obj,port1),[port2,[port2]]},deserialize:port=>(port.start(),function wrap(ep,target){return createProxy(ep,[],target)}(port))}],["throw",{canHandle:value=>isObject(value)&&throwMarker in value,serialize({value}){let serialized;return serialized=value instanceof Error?{isError:!0,value:{message:value.message,name:value.name,stack:value.stack}}:{isError:!1,value},[serialized,[]]},deserialize(serialized){if(serialized.isError)throw Object.assign(new Error(serialized.value.message),serialized.value);throw serialized.value}}]]);function expose(obj,ep=globalThis,allowedOrigins=["*"]){ep.addEventListener("message",(function callback(ev){if(!ev||!ev.data)return;if(!function isAllowedOrigin(allowedOrigins,origin){for(const allowedOrigin of allowedOrigins){if(origin===allowedOrigin||"*"===allowedOrigin)return!0;if(allowedOrigin instanceof RegExp&&allowedOrigin.test(origin))return!0}return!1}(allowedOrigins,ev.origin))return void console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);const{id,type,path}=Object.assign({path:[]},ev.data),argumentList=(ev.data.argumentList||[]).map(fromWireValue);let returnValue;try{const parent=path.slice(0,-1).reduce(((obj,prop)=>obj[prop]),obj),rawValue=path.reduce(((obj,prop)=>obj[prop]),obj);switch(type){case"GET":returnValue=rawValue;break;case"SET":parent[path.slice(-1)[0]]=fromWireValue(ev.data.value),returnValue=!0;break;case"APPLY":returnValue=rawValue.apply(parent,argumentList);break;case"CONSTRUCT":returnValue=function proxy(obj){return Object.assign(obj,{[proxyMarker]:!0})}(new rawValue(...argumentList));break;case"ENDPOINT":{const{port1,port2}=new MessageChannel;expose(obj,port2),returnValue=function transfer(obj,transfers){return transferCache.set(obj,transfers),obj}(port1,[port1])}break;case"RELEASE":returnValue=void 0;break;default:return}}catch(value){returnValue={value,[throwMarker]:0}}Promise.resolve(returnValue).catch((value=>({value,[throwMarker]:0}))).then((returnValue=>{const[wireValue,transferables]=toWireValue(returnValue);ep.postMessage(Object.assign(Object.assign({},wireValue),{id}),transferables),"RELEASE"===type&&(ep.removeEventListener("message",callback),closeEndPoint(ep),finalizer in obj&&"function"==typeof obj[finalizer]&&obj[finalizer]())})).catch((error=>{const[wireValue,transferables]=toWireValue({value:new TypeError("Unserializable return value"),[throwMarker]:0});ep.postMessage(Object.assign(Object.assign({},wireValue),{id}),transferables)}))})),ep.start&&ep.start()}function closeEndPoint(endpoint){(function isMessagePort(endpoint){return"MessagePort"===endpoint.constructor.name})(endpoint)&&endpoint.close()}function throwIfProxyReleased(isReleased){if(isReleased)throw new Error("Proxy has been released and is not useable")}function releaseEndpoint(ep){return requestResponseMessage(ep,{type:"RELEASE"}).then((()=>{closeEndPoint(ep)}))}const proxyCounter=new WeakMap,proxyFinalizers="FinalizationRegistry"in globalThis&&new FinalizationRegistry((ep=>{const newCount=(proxyCounter.get(ep)||0)-1;proxyCounter.set(ep,newCount),0===newCount&&releaseEndpoint(ep)}));function createProxy(ep,path=[],target=function(){}){let isProxyReleased=!1;const proxy=new Proxy(target,{get(_target,prop){if(throwIfProxyReleased(isProxyReleased),prop===releaseProxy)return()=>{!function unregisterProxy(proxy){proxyFinalizers&&proxyFinalizers.unregister(proxy)}(proxy),releaseEndpoint(ep),isProxyReleased=!0};if("then"===prop){if(0===path.length)return{then:()=>proxy};const r=requestResponseMessage(ep,{type:"GET",path:path.map((p=>p.toString()))}).then(fromWireValue);return r.then.bind(r)}return createProxy(ep,[...path,prop])},set(_target,prop,rawValue){throwIfProxyReleased(isProxyReleased);const[value,transferables]=toWireValue(rawValue);return requestResponseMessage(ep,{type:"SET",path:[...path,prop].map((p=>p.toString())),value},transferables).then(fromWireValue)},apply(_target,_thisArg,rawArgumentList){throwIfProxyReleased(isProxyReleased);const last=path[path.length-1];if(last===createEndpoint)return requestResponseMessage(ep,{type:"ENDPOINT"}).then(fromWireValue);if("bind"===last)return createProxy(ep,path.slice(0,-1));const[argumentList,transferables]=processArguments(rawArgumentList);return requestResponseMessage(ep,{type:"APPLY",path:path.map((p=>p.toString())),argumentList},transferables).then(fromWireValue)},construct(_target,rawArgumentList){throwIfProxyReleased(isProxyReleased);const[argumentList,transferables]=processArguments(rawArgumentList);return requestResponseMessage(ep,{type:"CONSTRUCT",path:path.map((p=>p.toString())),argumentList},transferables).then(fromWireValue)}});return function registerProxy(proxy,ep){const newCount=(proxyCounter.get(ep)||0)+1;proxyCounter.set(ep,newCount),proxyFinalizers&&proxyFinalizers.register(proxy,ep,proxy)}(proxy,ep),proxy}function processArguments(argumentList){const processed=argumentList.map(toWireValue);return[processed.map((v=>v[0])),(arr=processed.map((v=>v[1])),Array.prototype.concat.apply([],arr))];var arr}const transferCache=new WeakMap;function toWireValue(value){for(const[name,handler]of transferHandlers)if(handler.canHandle(value)){const[serializedValue,transferables]=handler.serialize(value);return[{type:"HANDLER",name,value:serializedValue},transferables]}return[{type:"RAW",value},transferCache.get(value)||[]]}function fromWireValue(value){switch(value.type){case"HANDLER":return transferHandlers.get(value.name).deserialize(value.value);case"RAW":return value.value}}function requestResponseMessage(ep,msg,transfers){return new Promise((resolve=>{const id=function generateUUID(){return new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-")}();ep.addEventListener("message",(function l(ev){ev.data&&ev.data.id&&ev.data.id===id&&(ep.removeEventListener("message",l),resolve(ev.data))})),ep.start&&ep.start(),ep.postMessage(Object.assign({id},msg),transfers)}))}__webpack_require__("./node_modules/core-js/modules/es.array.reverse.js");var forwardToReverseStrandMap=new Map;"ACGTURYWSMKBDHVNXacgturywsmkbdhvnx".split("").forEach(((character,index)=>{forwardToReverseStrandMap.set(character,"TGCAAYRWSKMVHDBNXtgcaayrwskmvhdbnx"[index])}));__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var LINE_LENGTH=60;function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}expose({downloadSequences:function(){var _ref=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}((function*(params){var sequencePromises=params.map((_ref2=>{var{label,url,reverseComplement}=_ref2;return fetch(url).then((response=>{if(response.ok)return response.text();throw new Error})).then((sequence=>(reverseComplement&&(sequence=(sequence=>sequence.split("").map((character=>forwardToReverseStrandMap.get(character))).reverse().join(""))(sequence)),function toFasta(sequence){var options=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{header,value:rawSequence}=sequence,{lineLength=LINE_LENGTH}=options,formattedSequence=[];header&&formattedSequence.push(">".concat(header));for(var row="",i=0;i<rawSequence.length;i++){row+=rawSequence[i];var isAtEndOfLine=(i+1)%lineLength==0;(i===rawSequence.length-1||isAtEndOfLine)&&(formattedSequence.push(row),row="")}return formattedSequence.join("\n")}({header:label,value:sequence}))))}));return(yield Promise.all(sequencePromises)).join("\n")}));return function downloadSequences(_x){return _ref.apply(this,arguments)}}()})},"./node_modules/core-js/internals/add-to-unscopables.js":(module,__unused_webpack_exports,__webpack_require__)=>{var wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),defineProperty=__webpack_require__("./node_modules/core-js/internals/object-define-property.js").f,UNSCOPABLES=wellKnownSymbol("unscopables"),ArrayPrototype=Array.prototype;null==ArrayPrototype[UNSCOPABLES]&&defineProperty(ArrayPrototype,UNSCOPABLES,{configurable:!0,value:create(null)}),module.exports=function(key){ArrayPrototype[UNSCOPABLES][key]=!0}},"./node_modules/core-js/internals/correct-prototype-getter.js":(module,__unused_webpack_exports,__webpack_require__)=>{var fails=__webpack_require__("./node_modules/core-js/internals/fails.js");module.exports=!fails((function(){function F(){}return F.prototype.constructor=null,Object.getPrototypeOf(new F)!==F.prototype}))},"./node_modules/core-js/internals/create-iter-result-object.js":module=>{module.exports=function(value,done){return{value,done}}},"./node_modules/core-js/internals/dom-iterables.js":module=>{module.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},"./node_modules/core-js/internals/dom-token-list-prototype.js":(module,__unused_webpack_exports,__webpack_require__)=>{var classList=__webpack_require__("./node_modules/core-js/internals/document-create-element.js")("span").classList,DOMTokenListPrototype=classList&&classList.constructor&&classList.constructor.prototype;module.exports=DOMTokenListPrototype===Object.prototype?void 0:DOMTokenListPrototype},"./node_modules/core-js/internals/html.js":(module,__unused_webpack_exports,__webpack_require__)=>{var getBuiltIn=__webpack_require__("./node_modules/core-js/internals/get-built-in.js");module.exports=getBuiltIn("document","documentElement")},"./node_modules/core-js/internals/iterator-create-constructor.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var IteratorPrototype=__webpack_require__("./node_modules/core-js/internals/iterators-core.js").IteratorPrototype,create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),createPropertyDescriptor=__webpack_require__("./node_modules/core-js/internals/create-property-descriptor.js"),setToStringTag=__webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js"),Iterators=__webpack_require__("./node_modules/core-js/internals/iterators.js"),returnThis=function(){return this};module.exports=function(IteratorConstructor,NAME,next,ENUMERABLE_NEXT){var TO_STRING_TAG=NAME+" Iterator";return IteratorConstructor.prototype=create(IteratorPrototype,{next:createPropertyDescriptor(+!ENUMERABLE_NEXT,next)}),setToStringTag(IteratorConstructor,TO_STRING_TAG,!1,!0),Iterators[TO_STRING_TAG]=returnThis,IteratorConstructor}},"./node_modules/core-js/internals/iterator-define.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),FunctionName=__webpack_require__("./node_modules/core-js/internals/function-name.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),createIteratorConstructor=__webpack_require__("./node_modules/core-js/internals/iterator-create-constructor.js"),getPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-get-prototype-of.js"),setPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-set-prototype-of.js"),setToStringTag=__webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js"),createNonEnumerableProperty=__webpack_require__("./node_modules/core-js/internals/create-non-enumerable-property.js"),defineBuiltIn=__webpack_require__("./node_modules/core-js/internals/define-built-in.js"),wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),Iterators=__webpack_require__("./node_modules/core-js/internals/iterators.js"),IteratorsCore=__webpack_require__("./node_modules/core-js/internals/iterators-core.js"),PROPER_FUNCTION_NAME=FunctionName.PROPER,CONFIGURABLE_FUNCTION_NAME=FunctionName.CONFIGURABLE,IteratorPrototype=IteratorsCore.IteratorPrototype,BUGGY_SAFARI_ITERATORS=IteratorsCore.BUGGY_SAFARI_ITERATORS,ITERATOR=wellKnownSymbol("iterator"),returnThis=function(){return this};module.exports=function(Iterable,NAME,IteratorConstructor,next,DEFAULT,IS_SET,FORCED){createIteratorConstructor(IteratorConstructor,NAME,next);var CurrentIteratorPrototype,methods,KEY,getIterationMethod=function(KIND){if(KIND===DEFAULT&&defaultIterator)return defaultIterator;if(!BUGGY_SAFARI_ITERATORS&&KIND in IterablePrototype)return IterablePrototype[KIND];switch(KIND){case"keys":return function keys(){return new IteratorConstructor(this,KIND)};case"values":return function values(){return new IteratorConstructor(this,KIND)};case"entries":return function entries(){return new IteratorConstructor(this,KIND)}}return function(){return new IteratorConstructor(this)}},TO_STRING_TAG=NAME+" Iterator",INCORRECT_VALUES_NAME=!1,IterablePrototype=Iterable.prototype,nativeIterator=IterablePrototype[ITERATOR]||IterablePrototype["@@iterator"]||DEFAULT&&IterablePrototype[DEFAULT],defaultIterator=!BUGGY_SAFARI_ITERATORS&&nativeIterator||getIterationMethod(DEFAULT),anyNativeIterator="Array"==NAME&&IterablePrototype.entries||nativeIterator;if(anyNativeIterator&&(CurrentIteratorPrototype=getPrototypeOf(anyNativeIterator.call(new Iterable)))!==Object.prototype&&CurrentIteratorPrototype.next&&(IS_PURE||getPrototypeOf(CurrentIteratorPrototype)===IteratorPrototype||(setPrototypeOf?setPrototypeOf(CurrentIteratorPrototype,IteratorPrototype):isCallable(CurrentIteratorPrototype[ITERATOR])||defineBuiltIn(CurrentIteratorPrototype,ITERATOR,returnThis)),setToStringTag(CurrentIteratorPrototype,TO_STRING_TAG,!0,!0),IS_PURE&&(Iterators[TO_STRING_TAG]=returnThis)),PROPER_FUNCTION_NAME&&"values"==DEFAULT&&nativeIterator&&"values"!==nativeIterator.name&&(!IS_PURE&&CONFIGURABLE_FUNCTION_NAME?createNonEnumerableProperty(IterablePrototype,"name","values"):(INCORRECT_VALUES_NAME=!0,defaultIterator=function values(){return call(nativeIterator,this)})),DEFAULT)if(methods={values:getIterationMethod("values"),keys:IS_SET?defaultIterator:getIterationMethod("keys"),entries:getIterationMethod("entries")},FORCED)for(KEY in methods)(BUGGY_SAFARI_ITERATORS||INCORRECT_VALUES_NAME||!(KEY in IterablePrototype))&&defineBuiltIn(IterablePrototype,KEY,methods[KEY]);else $({target:NAME,proto:!0,forced:BUGGY_SAFARI_ITERATORS||INCORRECT_VALUES_NAME},methods);return IS_PURE&&!FORCED||IterablePrototype[ITERATOR]===defaultIterator||defineBuiltIn(IterablePrototype,ITERATOR,defaultIterator,{name:DEFAULT}),Iterators[NAME]=defaultIterator,methods}},"./node_modules/core-js/internals/iterators-core.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var IteratorPrototype,PrototypeOfArrayIteratorPrototype,arrayIterator,fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),isObject=__webpack_require__("./node_modules/core-js/internals/is-object.js"),create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),getPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-get-prototype-of.js"),defineBuiltIn=__webpack_require__("./node_modules/core-js/internals/define-built-in.js"),wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),ITERATOR=wellKnownSymbol("iterator"),BUGGY_SAFARI_ITERATORS=!1;[].keys&&("next"in(arrayIterator=[].keys())?(PrototypeOfArrayIteratorPrototype=getPrototypeOf(getPrototypeOf(arrayIterator)))!==Object.prototype&&(IteratorPrototype=PrototypeOfArrayIteratorPrototype):BUGGY_SAFARI_ITERATORS=!0),!isObject(IteratorPrototype)||fails((function(){var test={};return IteratorPrototype[ITERATOR].call(test)!==test}))?IteratorPrototype={}:IS_PURE&&(IteratorPrototype=create(IteratorPrototype)),isCallable(IteratorPrototype[ITERATOR])||defineBuiltIn(IteratorPrototype,ITERATOR,(function(){return this})),module.exports={IteratorPrototype,BUGGY_SAFARI_ITERATORS}},"./node_modules/core-js/internals/iterators.js":module=>{module.exports={}},"./node_modules/core-js/internals/object-create.js":(module,__unused_webpack_exports,__webpack_require__)=>{var activeXDocument,anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),definePropertiesModule=__webpack_require__("./node_modules/core-js/internals/object-define-properties.js"),enumBugKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js"),hiddenKeys=__webpack_require__("./node_modules/core-js/internals/hidden-keys.js"),html=__webpack_require__("./node_modules/core-js/internals/html.js"),documentCreateElement=__webpack_require__("./node_modules/core-js/internals/document-create-element.js"),sharedKey=__webpack_require__("./node_modules/core-js/internals/shared-key.js"),IE_PROTO=sharedKey("IE_PROTO"),EmptyConstructor=function(){},scriptTag=function(content){return"<script>"+content+"<\/script>"},NullProtoObjectViaActiveX=function(activeXDocument){activeXDocument.write(scriptTag("")),activeXDocument.close();var temp=activeXDocument.parentWindow.Object;return activeXDocument=null,temp},NullProtoObject=function(){try{activeXDocument=new ActiveXObject("htmlfile")}catch(error){}var iframeDocument,iframe;NullProtoObject="undefined"!=typeof document?document.domain&&activeXDocument?NullProtoObjectViaActiveX(activeXDocument):((iframe=documentCreateElement("iframe")).style.display="none",html.appendChild(iframe),iframe.src=String("javascript:"),(iframeDocument=iframe.contentWindow.document).open(),iframeDocument.write(scriptTag("document.F=Object")),iframeDocument.close(),iframeDocument.F):NullProtoObjectViaActiveX(activeXDocument);for(var length=enumBugKeys.length;length--;)delete NullProtoObject.prototype[enumBugKeys[length]];return NullProtoObject()};hiddenKeys[IE_PROTO]=!0,module.exports=Object.create||function create(O,Properties){var result;return null!==O?(EmptyConstructor.prototype=anObject(O),result=new EmptyConstructor,EmptyConstructor.prototype=null,result[IE_PROTO]=O):result=NullProtoObject(),void 0===Properties?result:definePropertiesModule.f(result,Properties)}},"./node_modules/core-js/internals/object-define-properties.js":(__unused_webpack_module,exports,__webpack_require__)=>{var DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),V8_PROTOTYPE_DEFINE_BUG=__webpack_require__("./node_modules/core-js/internals/v8-prototype-define-bug.js"),definePropertyModule=__webpack_require__("./node_modules/core-js/internals/object-define-property.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),toIndexedObject=__webpack_require__("./node_modules/core-js/internals/to-indexed-object.js"),objectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys.js");exports.f=DESCRIPTORS&&!V8_PROTOTYPE_DEFINE_BUG?Object.defineProperties:function defineProperties(O,Properties){anObject(O);for(var key,props=toIndexedObject(Properties),keys=objectKeys(Properties),length=keys.length,index=0;length>index;)definePropertyModule.f(O,key=keys[index++],props[key]);return O}},"./node_modules/core-js/internals/object-get-own-property-names.js":(__unused_webpack_module,exports,__webpack_require__)=>{var internalObjectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys-internal.js"),hiddenKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js").concat("length","prototype");exports.f=Object.getOwnPropertyNames||function getOwnPropertyNames(O){return internalObjectKeys(O,hiddenKeys)}},"./node_modules/core-js/internals/object-get-prototype-of.js":(module,__unused_webpack_exports,__webpack_require__)=>{var hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),sharedKey=__webpack_require__("./node_modules/core-js/internals/shared-key.js"),CORRECT_PROTOTYPE_GETTER=__webpack_require__("./node_modules/core-js/internals/correct-prototype-getter.js"),IE_PROTO=sharedKey("IE_PROTO"),$Object=Object,ObjectPrototype=$Object.prototype;module.exports=CORRECT_PROTOTYPE_GETTER?$Object.getPrototypeOf:function(O){var object=toObject(O);if(hasOwn(object,IE_PROTO))return object[IE_PROTO];var constructor=object.constructor;return isCallable(constructor)&&object instanceof constructor?constructor.prototype:object instanceof $Object?ObjectPrototype:null}},"./node_modules/core-js/internals/object-keys.js":(module,__unused_webpack_exports,__webpack_require__)=>{var internalObjectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys-internal.js"),enumBugKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js");module.exports=Object.keys||function keys(O){return internalObjectKeys(O,enumBugKeys)}},"./node_modules/core-js/internals/set-to-string-tag.js":(module,__unused_webpack_exports,__webpack_require__)=>{var defineProperty=__webpack_require__("./node_modules/core-js/internals/object-define-property.js").f,hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),TO_STRING_TAG=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("toStringTag");module.exports=function(target,TAG,STATIC){target&&!STATIC&&(target=target.prototype),target&&!hasOwn(target,TO_STRING_TAG)&&defineProperty(target,TO_STRING_TAG,{configurable:!0,value:TAG})}},"./node_modules/core-js/modules/es.array.iterator.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var toIndexedObject=__webpack_require__("./node_modules/core-js/internals/to-indexed-object.js"),addToUnscopables=__webpack_require__("./node_modules/core-js/internals/add-to-unscopables.js"),Iterators=__webpack_require__("./node_modules/core-js/internals/iterators.js"),InternalStateModule=__webpack_require__("./node_modules/core-js/internals/internal-state.js"),defineProperty=__webpack_require__("./node_modules/core-js/internals/object-define-property.js").f,defineIterator=__webpack_require__("./node_modules/core-js/internals/iterator-define.js"),createIterResultObject=__webpack_require__("./node_modules/core-js/internals/create-iter-result-object.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),setInternalState=InternalStateModule.set,getInternalState=InternalStateModule.getterFor("Array Iterator");module.exports=defineIterator(Array,"Array",(function(iterated,kind){setInternalState(this,{type:"Array Iterator",target:toIndexedObject(iterated),index:0,kind})}),(function(){var state=getInternalState(this),target=state.target,kind=state.kind,index=state.index++;return!target||index>=target.length?(state.target=void 0,createIterResultObject(void 0,!0)):createIterResultObject("keys"==kind?index:"values"==kind?target[index]:[index,target[index]],!1)}),"values");var values=Iterators.Arguments=Iterators.Array;if(addToUnscopables("keys"),addToUnscopables("values"),addToUnscopables("entries"),!IS_PURE&&DESCRIPTORS&&"values"!==values.name)try{defineProperty(values,"name",{value:"values"})}catch(error){}},"./node_modules/core-js/modules/es.array.reverse.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),isArray=__webpack_require__("./node_modules/core-js/internals/is-array.js"),nativeReverse=uncurryThis([].reverse),test=[1,2];$({target:"Array",proto:!0,forced:String(test)===String(test.reverse())},{reverse:function reverse(){return isArray(this)&&(this.length=this.length),nativeReverse(this)}})},"./node_modules/core-js/modules/web.dom-collections.iterator.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var global=__webpack_require__("./node_modules/core-js/internals/global.js"),DOMIterables=__webpack_require__("./node_modules/core-js/internals/dom-iterables.js"),DOMTokenListPrototype=__webpack_require__("./node_modules/core-js/internals/dom-token-list-prototype.js"),ArrayIteratorMethods=__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),createNonEnumerableProperty=__webpack_require__("./node_modules/core-js/internals/create-non-enumerable-property.js"),wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),ITERATOR=wellKnownSymbol("iterator"),TO_STRING_TAG=wellKnownSymbol("toStringTag"),ArrayValues=ArrayIteratorMethods.values,handlePrototype=function(CollectionPrototype,COLLECTION_NAME){if(CollectionPrototype){if(CollectionPrototype[ITERATOR]!==ArrayValues)try{createNonEnumerableProperty(CollectionPrototype,ITERATOR,ArrayValues)}catch(error){CollectionPrototype[ITERATOR]=ArrayValues}if(CollectionPrototype[TO_STRING_TAG]||createNonEnumerableProperty(CollectionPrototype,TO_STRING_TAG,COLLECTION_NAME),DOMIterables[COLLECTION_NAME])for(var METHOD_NAME in ArrayIteratorMethods)if(CollectionPrototype[METHOD_NAME]!==ArrayIteratorMethods[METHOD_NAME])try{createNonEnumerableProperty(CollectionPrototype,METHOD_NAME,ArrayIteratorMethods[METHOD_NAME])}catch(error){CollectionPrototype[METHOD_NAME]=ArrayIteratorMethods[METHOD_NAME]}}};for(var COLLECTION_NAME in DOMIterables)handlePrototype(global[COLLECTION_NAME]&&global[COLLECTION_NAME].prototype,COLLECTION_NAME);handlePrototype(DOMTokenListPrototype,"DOMTokenList")},"./node_modules/process/browser.js":module=>{var cachedSetTimeout,cachedClearTimeout,process=module.exports={};function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}function runTimeout(fun){if(cachedSetTimeout===setTimeout)return setTimeout(fun,0);if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(fun,0);try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}!function(){try{cachedSetTimeout="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){cachedClearTimeout=defaultClearTimeout}}();var currentQueue,queue=[],draining=!1,queueIndex=-1;function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var timeout=runTimeout(cleanUpNextTick);draining=!0;for(var len=queue.length;len;){for(currentQueue=queue,queue=[];++queueIndex<len;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,len=queue.length}currentQueue=null,draining=!1,function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout)return clearTimeout(marker);if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(marker);try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}(timeout)}}function Item(fun,array){this.fun=fun,this.array=array}function noop(){}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)args[i-1]=arguments[i];queue.push(new Item(fun,args)),1!==queue.length||draining||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.prependListener=noop,process.prependOnceListener=noop,process.listeners=function(name){return[]},process.binding=function(name){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(dir){throw new Error("process.chdir is not supported")},process.umask=function(){return 0}}},__webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;var module=__webpack_module_cache__[moduleId]={exports:{}};return __webpack_modules__[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.exports}__webpack_require__.m=__webpack_modules__,__webpack_require__.x=()=>{var __webpack_exports__=__webpack_require__.O(void 0,[3333,8674],(()=>__webpack_require__("./src/shared/workers/sequenceFetcher.worker.ts")));return __webpack_exports__=__webpack_require__.O(__webpack_exports__)},deferred=[],__webpack_require__.O=(result,chunkIds,fn,priority)=>{if(!chunkIds){var notFulfilled=1/0;for(i=0;i<deferred.length;i++){for(var[chunkIds,fn,priority]=deferred[i],fulfilled=!0,j=0;j<chunkIds.length;j++)(!1&priority||notFulfilled>=priority)&&Object.keys(__webpack_require__.O).every((key=>__webpack_require__.O[key](chunkIds[j])))?chunkIds.splice(j--,1):(fulfilled=!1,priority<notFulfilled&&(notFulfilled=priority));if(fulfilled){deferred.splice(i--,1);var r=fn();void 0!==r&&(result=r)}}return result}priority=priority||0;for(var i=deferred.length;i>0&&deferred[i-1][2]>priority;i--)deferred[i]=deferred[i-1];deferred[i]=[chunkIds,fn,priority]},__webpack_require__.f={},__webpack_require__.e=chunkId=>Promise.all(Object.keys(__webpack_require__.f).reduce(((promises,key)=>(__webpack_require__.f[key](chunkId,promises),promises)),[])),__webpack_require__.u=chunkId=>chunkId+"."+{3333:"1ef19093",8674:"386f6e0e"}[chunkId]+".iframe.bundle.js",__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.o=(obj,prop)=>Object.prototype.hasOwnProperty.call(obj,prop),__webpack_require__.p="",(()=>{var installedChunks={2714:1};__webpack_require__.f.i=(chunkId,promises)=>{installedChunks[chunkId]||importScripts(__webpack_require__.p+__webpack_require__.u(chunkId))};var chunkLoadingGlobal=globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[],parentChunkLoadingFunction=chunkLoadingGlobal.push.bind(chunkLoadingGlobal);chunkLoadingGlobal.push=data=>{var[chunkIds,moreModules,runtime]=data;for(var moduleId in moreModules)__webpack_require__.o(moreModules,moduleId)&&(__webpack_require__.m[moduleId]=moreModules[moduleId]);for(runtime&&runtime(__webpack_require__);chunkIds.length;)installedChunks[chunkIds.pop()]=1;parentChunkLoadingFunction(data)}})(),next=__webpack_require__.x,__webpack_require__.x=()=>Promise.all([__webpack_require__.e(3333),__webpack_require__.e(8674)]).then(next);__webpack_require__.x()})();