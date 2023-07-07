/*! For license information please see hooks-use-outside-click-useOutsideClick-stories.3686eaf0.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[2215],{"./stories/hooks/use-outside-click/useOutsideClick.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{MultipleRefsStory:()=>MultipleRefsStory,SingleRefStory:()=>SingleRefStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>hooks_use_outside_click_useOutsideClick_stories});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react=__webpack_require__("./node_modules/react/index.js"),useOutsideClick=__webpack_require__("./src/shared/hooks/useOutsideClick.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),useOutsideClick_stories=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/hooks/use-outside-click/useOutsideClick.stories.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(useOutsideClick_stories.Z,options);const use_outside_click_useOutsideClick_stories=useOutsideClick_stories.Z&&useOutsideClick_stories.Z.locals?useOutsideClick_stories.Z.locals:void 0;var _SingleRefStory$param,_SingleRefStory$param2,_SingleRefStory$param3,_MultipleRefsStory$pa,_MultipleRefsStory$pa2,_MultipleRefsStory$pa3,jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var SingleRefStory=args=>{var option,onClick,content,[numberOfClicks,setNumberOfClicks]=(0,react.useState)(0),parentRef=(0,react.useRef)(null);return(0,useOutsideClick.Z)(parentRef,(()=>{args.onClickOutside(numberOfClicks)})),(0,jsx_runtime.jsxs)("div",{className:use_outside_click_useOutsideClick_stories.wrapper,children:[(0,jsx_runtime.jsxs)("div",{className:use_outside_click_useOutsideClick_stories.parentElement,ref:parentRef,children:["Ref",(option=numberOfClicks%2,onClick=()=>{setNumberOfClicks(numberOfClicks+1)},content="I‘m inside Ref, and both me and my parent will re-render if you click me",option%2?(0,jsx_runtime.jsx)("div",{className:use_outside_click_useOutsideClick_stories.childElement,onClick,children:content}):(0,jsx_runtime.jsx)("span",{className:use_outside_click_useOutsideClick_stories.childElement,style:{borderRadius:"50%"},onClick,children:content})),(0,jsx_runtime.jsxs)("div",{className:use_outside_click_useOutsideClick_stories.halfInside,children:[" ","I'm also inside Ref and do not cause any updates"]})]}),(0,jsx_runtime.jsx)("div",{className:use_outside_click_useOutsideClick_stories.someOtherElement,children:" I'm outside Ref "})]})};SingleRefStory.displayName="SingleRefStory",SingleRefStory.storyName="single ref";var MultipleRefsStory=args=>{var elementRef1=(0,react.useRef)(null),elementRef2=(0,react.useRef)(null);return(0,useOutsideClick.Z)([elementRef1,elementRef2],(()=>{args.onClickOutside()})),(0,jsx_runtime.jsxs)("div",{className:use_outside_click_useOutsideClick_stories.wrapper,children:[(0,jsx_runtime.jsx)("div",{className:use_outside_click_useOutsideClick_stories.childElement,ref:elementRef1,children:"Ref1"}),(0,jsx_runtime.jsx)("div",{className:use_outside_click_useOutsideClick_stories.someOtherElement,children:" I'm outside Ref1 & Ref2 "}),(0,jsx_runtime.jsx)("div",{className:use_outside_click_useOutsideClick_stories.childElement,ref:elementRef2,children:"Ref2"})]})};MultipleRefsStory.displayName="MultipleRefsStory",MultipleRefsStory.storyName="multiple refs";const hooks_use_outside_click_useOutsideClick_stories={title:"Hooks/Shared Hooks/useOutsideClick",argTypes:{onClickOutside:{action:"clicked ouside"}}};SingleRefStory.parameters=_objectSpread(_objectSpread({},SingleRefStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_SingleRefStory$param=SingleRefStory.parameters)||void 0===_SingleRefStory$param?void 0:_SingleRefStory$param.docs),{},{source:_objectSpread({originalSource:"(args: DefaultArgs) => {\n  const [numberOfClicks, setNumberOfClicks] = useState(0);\n  const parentRef = useRef<HTMLDivElement>(null);\n  const updateComponent = () => {\n    setNumberOfClicks(numberOfClicks + 1);\n  };\n  const callback = () => {\n    args.onClickOutside(numberOfClicks);\n  };\n  useOutsideClick(parentRef, callback);\n  return <div className={styles.wrapper}>\n      <div className={styles.parentElement} ref={parentRef}>\n        Ref\n        {buildChild(numberOfClicks % 2, updateComponent)}\n        <div className={styles.halfInside}>\n          {' '}\n          I'm also inside Ref and do not cause any updates\n        </div>\n      </div>\n      <div className={styles.someOtherElement}> I'm outside Ref </div>\n    </div>;\n}"},null===(_SingleRefStory$param2=SingleRefStory.parameters)||void 0===_SingleRefStory$param2||null===(_SingleRefStory$param3=_SingleRefStory$param2.docs)||void 0===_SingleRefStory$param3?void 0:_SingleRefStory$param3.source)})}),MultipleRefsStory.parameters=_objectSpread(_objectSpread({},MultipleRefsStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_MultipleRefsStory$pa=MultipleRefsStory.parameters)||void 0===_MultipleRefsStory$pa?void 0:_MultipleRefsStory$pa.docs),{},{source:_objectSpread({originalSource:"(args: DefaultArgs) => {\n  const elementRef1 = useRef<HTMLDivElement>(null);\n  const elementRef2 = useRef<HTMLDivElement>(null);\n  const callback = () => {\n    args.onClickOutside();\n  };\n  useOutsideClick([elementRef1, elementRef2], callback);\n  return <div className={styles.wrapper}>\n      <div className={styles.childElement} ref={elementRef1}>\n        Ref1\n      </div>\n      <div className={styles.someOtherElement}> I'm outside Ref1 & Ref2 </div>\n      <div className={styles.childElement} ref={elementRef2}>\n        Ref2\n      </div>\n    </div>;\n}"},null===(_MultipleRefsStory$pa2=MultipleRefsStory.parameters)||void 0===_MultipleRefsStory$pa2||null===(_MultipleRefsStory$pa3=_MultipleRefsStory$pa2.docs)||void 0===_MultipleRefsStory$pa3?void 0:_MultipleRefsStory$pa3.source)})});var __namedExportsOrder=["SingleRefStory","MultipleRefsStory"];try{SingleRefStory.displayName="SingleRefStory",SingleRefStory.__docgenInfo={description:"",displayName:"SingleRefStory",props:{onClickOutside:{defaultValue:null,description:"",name:"onClickOutside",required:!0,type:{name:"(...args: any) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["stories/hooks/use-outside-click/useOutsideClick.stories.tsx#SingleRefStory"]={docgenInfo:SingleRefStory.__docgenInfo,name:"SingleRefStory",path:"stories/hooks/use-outside-click/useOutsideClick.stories.tsx#SingleRefStory"})}catch(__react_docgen_typescript_loader_error){}try{MultipleRefsStory.displayName="MultipleRefsStory",MultipleRefsStory.__docgenInfo={description:"",displayName:"MultipleRefsStory",props:{onClickOutside:{defaultValue:null,description:"",name:"onClickOutside",required:!0,type:{name:"(...args: any) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["stories/hooks/use-outside-click/useOutsideClick.stories.tsx#MultipleRefsStory"]={docgenInfo:MultipleRefsStory.__docgenInfo,name:"MultipleRefsStory",path:"stories/hooks/use-outside-click/useOutsideClick.stories.tsx#MultipleRefsStory"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/hooks/useOutsideClick.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>useOutsideClick});__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js");function useOutsideClick(refOrRefs,callback){var refs=Array.isArray(refOrRefs)?refOrRefs:[refOrRefs],handleClickOutside=event=>{var isClickInside=!1;for(var ref of refs){var _ref$current;null!==(_ref$current=ref.current)&&void 0!==_ref$current&&_ref$current.contains(event.target)&&(isClickInside=!0)}isClickInside||callback()};(0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>(document.addEventListener("click",handleClickOutside,{capture:!0}),()=>{document.removeEventListener("click",handleClickOutside,!0)})))}},"./node_modules/core-js/internals/add-to-unscopables.js":(module,__unused_webpack_exports,__webpack_require__)=>{var wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),defineProperty=__webpack_require__("./node_modules/core-js/internals/object-define-property.js").f,UNSCOPABLES=wellKnownSymbol("unscopables"),ArrayPrototype=Array.prototype;null==ArrayPrototype[UNSCOPABLES]&&defineProperty(ArrayPrototype,UNSCOPABLES,{configurable:!0,value:create(null)}),module.exports=function(key){ArrayPrototype[UNSCOPABLES][key]=!0}},"./node_modules/core-js/internals/correct-prototype-getter.js":(module,__unused_webpack_exports,__webpack_require__)=>{var fails=__webpack_require__("./node_modules/core-js/internals/fails.js");module.exports=!fails((function(){function F(){}return F.prototype.constructor=null,Object.getPrototypeOf(new F)!==F.prototype}))},"./node_modules/core-js/internals/create-iter-result-object.js":module=>{module.exports=function(value,done){return{value,done}}},"./node_modules/core-js/internals/dom-iterables.js":module=>{module.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},"./node_modules/core-js/internals/dom-token-list-prototype.js":(module,__unused_webpack_exports,__webpack_require__)=>{var classList=__webpack_require__("./node_modules/core-js/internals/document-create-element.js")("span").classList,DOMTokenListPrototype=classList&&classList.constructor&&classList.constructor.prototype;module.exports=DOMTokenListPrototype===Object.prototype?void 0:DOMTokenListPrototype},"./node_modules/core-js/internals/html.js":(module,__unused_webpack_exports,__webpack_require__)=>{var getBuiltIn=__webpack_require__("./node_modules/core-js/internals/get-built-in.js");module.exports=getBuiltIn("document","documentElement")},"./node_modules/core-js/internals/iterator-create-constructor.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var IteratorPrototype=__webpack_require__("./node_modules/core-js/internals/iterators-core.js").IteratorPrototype,create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),createPropertyDescriptor=__webpack_require__("./node_modules/core-js/internals/create-property-descriptor.js"),setToStringTag=__webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js"),Iterators=__webpack_require__("./node_modules/core-js/internals/iterators.js"),returnThis=function(){return this};module.exports=function(IteratorConstructor,NAME,next,ENUMERABLE_NEXT){var TO_STRING_TAG=NAME+" Iterator";return IteratorConstructor.prototype=create(IteratorPrototype,{next:createPropertyDescriptor(+!ENUMERABLE_NEXT,next)}),setToStringTag(IteratorConstructor,TO_STRING_TAG,!1,!0),Iterators[TO_STRING_TAG]=returnThis,IteratorConstructor}},"./node_modules/core-js/internals/iterator-define.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),FunctionName=__webpack_require__("./node_modules/core-js/internals/function-name.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),createIteratorConstructor=__webpack_require__("./node_modules/core-js/internals/iterator-create-constructor.js"),getPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-get-prototype-of.js"),setPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-set-prototype-of.js"),setToStringTag=__webpack_require__("./node_modules/core-js/internals/set-to-string-tag.js"),createNonEnumerableProperty=__webpack_require__("./node_modules/core-js/internals/create-non-enumerable-property.js"),defineBuiltIn=__webpack_require__("./node_modules/core-js/internals/define-built-in.js"),wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),Iterators=__webpack_require__("./node_modules/core-js/internals/iterators.js"),IteratorsCore=__webpack_require__("./node_modules/core-js/internals/iterators-core.js"),PROPER_FUNCTION_NAME=FunctionName.PROPER,CONFIGURABLE_FUNCTION_NAME=FunctionName.CONFIGURABLE,IteratorPrototype=IteratorsCore.IteratorPrototype,BUGGY_SAFARI_ITERATORS=IteratorsCore.BUGGY_SAFARI_ITERATORS,ITERATOR=wellKnownSymbol("iterator"),returnThis=function(){return this};module.exports=function(Iterable,NAME,IteratorConstructor,next,DEFAULT,IS_SET,FORCED){createIteratorConstructor(IteratorConstructor,NAME,next);var CurrentIteratorPrototype,methods,KEY,getIterationMethod=function(KIND){if(KIND===DEFAULT&&defaultIterator)return defaultIterator;if(!BUGGY_SAFARI_ITERATORS&&KIND in IterablePrototype)return IterablePrototype[KIND];switch(KIND){case"keys":return function keys(){return new IteratorConstructor(this,KIND)};case"values":return function values(){return new IteratorConstructor(this,KIND)};case"entries":return function entries(){return new IteratorConstructor(this,KIND)}}return function(){return new IteratorConstructor(this)}},TO_STRING_TAG=NAME+" Iterator",INCORRECT_VALUES_NAME=!1,IterablePrototype=Iterable.prototype,nativeIterator=IterablePrototype[ITERATOR]||IterablePrototype["@@iterator"]||DEFAULT&&IterablePrototype[DEFAULT],defaultIterator=!BUGGY_SAFARI_ITERATORS&&nativeIterator||getIterationMethod(DEFAULT),anyNativeIterator="Array"==NAME&&IterablePrototype.entries||nativeIterator;if(anyNativeIterator&&(CurrentIteratorPrototype=getPrototypeOf(anyNativeIterator.call(new Iterable)))!==Object.prototype&&CurrentIteratorPrototype.next&&(IS_PURE||getPrototypeOf(CurrentIteratorPrototype)===IteratorPrototype||(setPrototypeOf?setPrototypeOf(CurrentIteratorPrototype,IteratorPrototype):isCallable(CurrentIteratorPrototype[ITERATOR])||defineBuiltIn(CurrentIteratorPrototype,ITERATOR,returnThis)),setToStringTag(CurrentIteratorPrototype,TO_STRING_TAG,!0,!0),IS_PURE&&(Iterators[TO_STRING_TAG]=returnThis)),PROPER_FUNCTION_NAME&&"values"==DEFAULT&&nativeIterator&&"values"!==nativeIterator.name&&(!IS_PURE&&CONFIGURABLE_FUNCTION_NAME?createNonEnumerableProperty(IterablePrototype,"name","values"):(INCORRECT_VALUES_NAME=!0,defaultIterator=function values(){return call(nativeIterator,this)})),DEFAULT)if(methods={values:getIterationMethod("values"),keys:IS_SET?defaultIterator:getIterationMethod("keys"),entries:getIterationMethod("entries")},FORCED)for(KEY in methods)(BUGGY_SAFARI_ITERATORS||INCORRECT_VALUES_NAME||!(KEY in IterablePrototype))&&defineBuiltIn(IterablePrototype,KEY,methods[KEY]);else $({target:NAME,proto:!0,forced:BUGGY_SAFARI_ITERATORS||INCORRECT_VALUES_NAME},methods);return IS_PURE&&!FORCED||IterablePrototype[ITERATOR]===defaultIterator||defineBuiltIn(IterablePrototype,ITERATOR,defaultIterator,{name:DEFAULT}),Iterators[NAME]=defaultIterator,methods}},"./node_modules/core-js/internals/iterators-core.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var IteratorPrototype,PrototypeOfArrayIteratorPrototype,arrayIterator,fails=__webpack_require__("./node_modules/core-js/internals/fails.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),isObject=__webpack_require__("./node_modules/core-js/internals/is-object.js"),create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),getPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-get-prototype-of.js"),defineBuiltIn=__webpack_require__("./node_modules/core-js/internals/define-built-in.js"),wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),ITERATOR=wellKnownSymbol("iterator"),BUGGY_SAFARI_ITERATORS=!1;[].keys&&("next"in(arrayIterator=[].keys())?(PrototypeOfArrayIteratorPrototype=getPrototypeOf(getPrototypeOf(arrayIterator)))!==Object.prototype&&(IteratorPrototype=PrototypeOfArrayIteratorPrototype):BUGGY_SAFARI_ITERATORS=!0),!isObject(IteratorPrototype)||fails((function(){var test={};return IteratorPrototype[ITERATOR].call(test)!==test}))?IteratorPrototype={}:IS_PURE&&(IteratorPrototype=create(IteratorPrototype)),isCallable(IteratorPrototype[ITERATOR])||defineBuiltIn(IteratorPrototype,ITERATOR,(function(){return this})),module.exports={IteratorPrototype,BUGGY_SAFARI_ITERATORS}},"./node_modules/core-js/internals/iterators.js":module=>{module.exports={}},"./node_modules/core-js/internals/object-create.js":(module,__unused_webpack_exports,__webpack_require__)=>{var activeXDocument,anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),definePropertiesModule=__webpack_require__("./node_modules/core-js/internals/object-define-properties.js"),enumBugKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js"),hiddenKeys=__webpack_require__("./node_modules/core-js/internals/hidden-keys.js"),html=__webpack_require__("./node_modules/core-js/internals/html.js"),documentCreateElement=__webpack_require__("./node_modules/core-js/internals/document-create-element.js"),sharedKey=__webpack_require__("./node_modules/core-js/internals/shared-key.js"),IE_PROTO=sharedKey("IE_PROTO"),EmptyConstructor=function(){},scriptTag=function(content){return"<script>"+content+"<\/script>"},NullProtoObjectViaActiveX=function(activeXDocument){activeXDocument.write(scriptTag("")),activeXDocument.close();var temp=activeXDocument.parentWindow.Object;return activeXDocument=null,temp},NullProtoObject=function(){try{activeXDocument=new ActiveXObject("htmlfile")}catch(error){}var iframeDocument,iframe;NullProtoObject="undefined"!=typeof document?document.domain&&activeXDocument?NullProtoObjectViaActiveX(activeXDocument):((iframe=documentCreateElement("iframe")).style.display="none",html.appendChild(iframe),iframe.src=String("javascript:"),(iframeDocument=iframe.contentWindow.document).open(),iframeDocument.write(scriptTag("document.F=Object")),iframeDocument.close(),iframeDocument.F):NullProtoObjectViaActiveX(activeXDocument);for(var length=enumBugKeys.length;length--;)delete NullProtoObject.prototype[enumBugKeys[length]];return NullProtoObject()};hiddenKeys[IE_PROTO]=!0,module.exports=Object.create||function create(O,Properties){var result;return null!==O?(EmptyConstructor.prototype=anObject(O),result=new EmptyConstructor,EmptyConstructor.prototype=null,result[IE_PROTO]=O):result=NullProtoObject(),void 0===Properties?result:definePropertiesModule.f(result,Properties)}},"./node_modules/core-js/internals/object-define-properties.js":(__unused_webpack_module,exports,__webpack_require__)=>{var DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),V8_PROTOTYPE_DEFINE_BUG=__webpack_require__("./node_modules/core-js/internals/v8-prototype-define-bug.js"),definePropertyModule=__webpack_require__("./node_modules/core-js/internals/object-define-property.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),toIndexedObject=__webpack_require__("./node_modules/core-js/internals/to-indexed-object.js"),objectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys.js");exports.f=DESCRIPTORS&&!V8_PROTOTYPE_DEFINE_BUG?Object.defineProperties:function defineProperties(O,Properties){anObject(O);for(var key,props=toIndexedObject(Properties),keys=objectKeys(Properties),length=keys.length,index=0;length>index;)definePropertyModule.f(O,key=keys[index++],props[key]);return O}},"./node_modules/core-js/internals/object-get-own-property-names.js":(__unused_webpack_module,exports,__webpack_require__)=>{var internalObjectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys-internal.js"),hiddenKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js").concat("length","prototype");exports.f=Object.getOwnPropertyNames||function getOwnPropertyNames(O){return internalObjectKeys(O,hiddenKeys)}},"./node_modules/core-js/internals/object-get-prototype-of.js":(module,__unused_webpack_exports,__webpack_require__)=>{var hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),sharedKey=__webpack_require__("./node_modules/core-js/internals/shared-key.js"),CORRECT_PROTOTYPE_GETTER=__webpack_require__("./node_modules/core-js/internals/correct-prototype-getter.js"),IE_PROTO=sharedKey("IE_PROTO"),$Object=Object,ObjectPrototype=$Object.prototype;module.exports=CORRECT_PROTOTYPE_GETTER?$Object.getPrototypeOf:function(O){var object=toObject(O);if(hasOwn(object,IE_PROTO))return object[IE_PROTO];var constructor=object.constructor;return isCallable(constructor)&&object instanceof constructor?constructor.prototype:object instanceof $Object?ObjectPrototype:null}},"./node_modules/core-js/internals/object-keys.js":(module,__unused_webpack_exports,__webpack_require__)=>{var internalObjectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys-internal.js"),enumBugKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js");module.exports=Object.keys||function keys(O){return internalObjectKeys(O,enumBugKeys)}},"./node_modules/core-js/internals/set-to-string-tag.js":(module,__unused_webpack_exports,__webpack_require__)=>{var defineProperty=__webpack_require__("./node_modules/core-js/internals/object-define-property.js").f,hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),TO_STRING_TAG=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js")("toStringTag");module.exports=function(target,TAG,STATIC){target&&!STATIC&&(target=target.prototype),target&&!hasOwn(target,TO_STRING_TAG)&&defineProperty(target,TO_STRING_TAG,{configurable:!0,value:TAG})}},"./node_modules/core-js/modules/es.array.iterator.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var toIndexedObject=__webpack_require__("./node_modules/core-js/internals/to-indexed-object.js"),addToUnscopables=__webpack_require__("./node_modules/core-js/internals/add-to-unscopables.js"),Iterators=__webpack_require__("./node_modules/core-js/internals/iterators.js"),InternalStateModule=__webpack_require__("./node_modules/core-js/internals/internal-state.js"),defineProperty=__webpack_require__("./node_modules/core-js/internals/object-define-property.js").f,defineIterator=__webpack_require__("./node_modules/core-js/internals/iterator-define.js"),createIterResultObject=__webpack_require__("./node_modules/core-js/internals/create-iter-result-object.js"),IS_PURE=__webpack_require__("./node_modules/core-js/internals/is-pure.js"),DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),setInternalState=InternalStateModule.set,getInternalState=InternalStateModule.getterFor("Array Iterator");module.exports=defineIterator(Array,"Array",(function(iterated,kind){setInternalState(this,{type:"Array Iterator",target:toIndexedObject(iterated),index:0,kind})}),(function(){var state=getInternalState(this),target=state.target,kind=state.kind,index=state.index++;return!target||index>=target.length?(state.target=void 0,createIterResultObject(void 0,!0)):createIterResultObject("keys"==kind?index:"values"==kind?target[index]:[index,target[index]],!1)}),"values");var values=Iterators.Arguments=Iterators.Array;if(addToUnscopables("keys"),addToUnscopables("values"),addToUnscopables("entries"),!IS_PURE&&DESCRIPTORS&&"values"!==values.name)try{defineProperty(values,"name",{value:"values"})}catch(error){}},"./node_modules/core-js/modules/es.symbol.description.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),global=__webpack_require__("./node_modules/core-js/internals/global.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),isPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-is-prototype-of.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),defineBuiltInAccessor=__webpack_require__("./node_modules/core-js/internals/define-built-in-accessor.js"),copyConstructorProperties=__webpack_require__("./node_modules/core-js/internals/copy-constructor-properties.js"),NativeSymbol=global.Symbol,SymbolPrototype=NativeSymbol&&NativeSymbol.prototype;if(DESCRIPTORS&&isCallable(NativeSymbol)&&(!("description"in SymbolPrototype)||void 0!==NativeSymbol().description)){var EmptyStringDescriptionStore={},SymbolWrapper=function Symbol(){var description=arguments.length<1||void 0===arguments[0]?void 0:toString(arguments[0]),result=isPrototypeOf(SymbolPrototype,this)?new NativeSymbol(description):void 0===description?NativeSymbol():NativeSymbol(description);return""===description&&(EmptyStringDescriptionStore[result]=!0),result};copyConstructorProperties(SymbolWrapper,NativeSymbol),SymbolWrapper.prototype=SymbolPrototype,SymbolPrototype.constructor=SymbolWrapper;var NATIVE_SYMBOL="Symbol(test)"==String(NativeSymbol("test")),thisSymbolValue=uncurryThis(SymbolPrototype.valueOf),symbolDescriptiveString=uncurryThis(SymbolPrototype.toString),regexp=/^Symbol\((.*)\)[^)]+$/,replace=uncurryThis("".replace),stringSlice=uncurryThis("".slice);defineBuiltInAccessor(SymbolPrototype,"description",{configurable:!0,get:function description(){var symbol=thisSymbolValue(this);if(hasOwn(EmptyStringDescriptionStore,symbol))return"";var string=symbolDescriptiveString(symbol),desc=NATIVE_SYMBOL?stringSlice(string,7,-1):replace(string,regexp,"$1");return""===desc?void 0:desc}}),$({global:!0,constructor:!0,forced:!0},{Symbol:SymbolWrapper})}},"./node_modules/core-js/modules/web.dom-collections.iterator.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var global=__webpack_require__("./node_modules/core-js/internals/global.js"),DOMIterables=__webpack_require__("./node_modules/core-js/internals/dom-iterables.js"),DOMTokenListPrototype=__webpack_require__("./node_modules/core-js/internals/dom-token-list-prototype.js"),ArrayIteratorMethods=__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),createNonEnumerableProperty=__webpack_require__("./node_modules/core-js/internals/create-non-enumerable-property.js"),wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),ITERATOR=wellKnownSymbol("iterator"),TO_STRING_TAG=wellKnownSymbol("toStringTag"),ArrayValues=ArrayIteratorMethods.values,handlePrototype=function(CollectionPrototype,COLLECTION_NAME){if(CollectionPrototype){if(CollectionPrototype[ITERATOR]!==ArrayValues)try{createNonEnumerableProperty(CollectionPrototype,ITERATOR,ArrayValues)}catch(error){CollectionPrototype[ITERATOR]=ArrayValues}if(CollectionPrototype[TO_STRING_TAG]||createNonEnumerableProperty(CollectionPrototype,TO_STRING_TAG,COLLECTION_NAME),DOMIterables[COLLECTION_NAME])for(var METHOD_NAME in ArrayIteratorMethods)if(CollectionPrototype[METHOD_NAME]!==ArrayIteratorMethods[METHOD_NAME])try{createNonEnumerableProperty(CollectionPrototype,METHOD_NAME,ArrayIteratorMethods[METHOD_NAME])}catch(error){CollectionPrototype[METHOD_NAME]=ArrayIteratorMethods[METHOD_NAME]}}};for(var COLLECTION_NAME in DOMIterables)handlePrototype(global[COLLECTION_NAME]&&global[COLLECTION_NAME].prototype,COLLECTION_NAME);handlePrototype(DOMTokenListPrototype,"DOMTokenList")},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/hooks/use-outside-click/useOutsideClick.stories.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".wrapper__useOutsideClick-stories__b6aNj{height:100vh;display:flex;align-items:center;justify-content:center}.parentElement__useOutsideClick-stories__ZHzhH{background-color:#ccc;height:400px;width:400px;padding:80px 100px 100px;position:relative;-webkit-user-select:none;user-select:none}.childElement__useOutsideClick-stories__cGTmB{background-color:green;display:flex;justify-content:center;align-items:center;color:#fff;height:200px;width:200px;padding:20px;-webkit-user-select:none;user-select:none;cursor:pointer}.halfInside__useOutsideClick-stories__Eug38{background-color:blue;color:#fff;height:200px;width:200px;padding:20px;position:absolute;bottom:-150px;left:100px;-webkit-user-select:none;user-select:none}.someOtherElement__useOutsideClick-stories__vl1e2{background-color:red;height:200px;width:200px;margin:0px 20px;padding:20px;-webkit-user-select:none;user-select:none}","",{version:3,sources:["webpack://./stories/hooks/use-outside-click/useOutsideClick.stories.scss"],names:[],mappings:"AAAA,yCACE,YAAA,CACA,YAAA,CACA,kBAAA,CACA,sBAAA,CAGF,+CACE,qBAAA,CACA,YAAA,CACA,WAAA,CACA,wBAAA,CACA,iBAAA,CACA,wBAAA,CAAA,gBAAA,CAGF,8CACE,sBAAA,CACA,YAAA,CACA,sBAAA,CACA,kBAAA,CACA,UAAA,CACA,YAAA,CACA,WAAA,CACA,YAAA,CACA,wBAAA,CAAA,gBAAA,CACA,cAAA,CAGF,4CACE,qBAAA,CACA,UAAA,CACA,YAAA,CACA,WAAA,CACA,YAAA,CACA,iBAAA,CACA,aAAA,CACA,UAAA,CACA,wBAAA,CAAA,gBAAA,CAGF,kDACE,oBAAA,CACA,YAAA,CACA,WAAA,CACA,eAAA,CACA,YAAA,CACA,wBAAA,CAAA,gBAAA",sourcesContent:[".wrapper {\n  height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.parentElement {\n  background-color: #ccc;\n  height: 400px;\n  width: 400px;\n  padding: 80px 100px 100px;\n  position: relative;\n  user-select: none;\n}\n\n.childElement {\n  background-color: green;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: white;\n  height: 200px;\n  width: 200px;\n  padding: 20px;\n  user-select: none;\n  cursor: pointer;\n}\n\n.halfInside {\n  background-color: blue;\n  color: white;\n  height: 200px;\n  width: 200px;\n  padding: 20px;\n  position: absolute;\n  bottom: -150px;\n  left: 100px;\n  user-select: none;\n}\n\n.someOtherElement {\n  background-color: red;\n  height: 200px;\n  width: 200px;\n  margin: 0px 20px;\n  padding: 20px;\n  user-select: none;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={wrapper:"wrapper__useOutsideClick-stories__b6aNj",parentElement:"parentElement__useOutsideClick-stories__ZHzhH",childElement:"childElement__useOutsideClick-stories__cGTmB",halfInside:"halfInside__useOutsideClick-stories__Eug38",someOtherElement:"someOtherElement__useOutsideClick-stories__vl1e2"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);