/*! For license information please see shared-components-breadcrumbs-Breadcrumbs-stories.2e4c5499.iframe.bundle.js.LICENSE.txt */
"use strict";(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[8413],{"./node_modules/core-js/internals/call-with-safe-iteration-closing.js":(module,__unused_webpack_exports,__webpack_require__)=>{var anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),iteratorClose=__webpack_require__("./node_modules/core-js/internals/iterator-close.js");module.exports=function(iterator,fn,value,ENTRIES){try{return ENTRIES?fn(anObject(value)[0],value[1]):fn(value)}catch(error){iteratorClose(iterator,"throw",error)}}},"./node_modules/core-js/internals/create-iter-result-object.js":module=>{module.exports=function(value,done){return{value,done}}},"./node_modules/core-js/internals/define-built-ins.js":(module,__unused_webpack_exports,__webpack_require__)=>{var defineBuiltIn=__webpack_require__("./node_modules/core-js/internals/define-built-in.js");module.exports=function(target,src,options){for(var key in src)defineBuiltIn(target,key,src[key],options);return target}},"./node_modules/core-js/internals/iterator-create-proxy.js":(module,__unused_webpack_exports,__webpack_require__)=>{var call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),create=__webpack_require__("./node_modules/core-js/internals/object-create.js"),createNonEnumerableProperty=__webpack_require__("./node_modules/core-js/internals/create-non-enumerable-property.js"),defineBuiltIns=__webpack_require__("./node_modules/core-js/internals/define-built-ins.js"),wellKnownSymbol=__webpack_require__("./node_modules/core-js/internals/well-known-symbol.js"),InternalStateModule=__webpack_require__("./node_modules/core-js/internals/internal-state.js"),getMethod=__webpack_require__("./node_modules/core-js/internals/get-method.js"),IteratorPrototype=__webpack_require__("./node_modules/core-js/internals/iterators-core.js").IteratorPrototype,createIterResultObject=__webpack_require__("./node_modules/core-js/internals/create-iter-result-object.js"),iteratorClose=__webpack_require__("./node_modules/core-js/internals/iterator-close.js"),TO_STRING_TAG=wellKnownSymbol("toStringTag"),setInternalState=InternalStateModule.set,createIteratorProxyPrototype=function(IS_ITERATOR){var getInternalState=InternalStateModule.getterFor(IS_ITERATOR?"WrapForValidIterator":"IteratorHelper");return defineBuiltIns(create(IteratorPrototype),{next:function next(){var state=getInternalState(this);if(IS_ITERATOR)return state.nextHandler();if(state.done)return createIterResultObject(void 0,!0);try{var result=state.nextHandler();return state.returnHandlerResult?result:createIterResultObject(result,state.done)}catch(error){throw state.done=!0,error}},return:function(){var state=getInternalState(this),iterator=state.iterator;if(state.done=!0,IS_ITERATOR){var returnMethod=getMethod(iterator,"return");return returnMethod?call(returnMethod,iterator):createIterResultObject(void 0,!0)}if(state.inner)try{iteratorClose(state.inner.iterator,"normal")}catch(error){return iteratorClose(iterator,"throw",error)}return iterator&&iteratorClose(iterator,"normal"),createIterResultObject(void 0,!0)}})},WrapForValidIteratorPrototype=createIteratorProxyPrototype(!0),IteratorHelperPrototype=createIteratorProxyPrototype(!1);createNonEnumerableProperty(IteratorHelperPrototype,TO_STRING_TAG,"Iterator Helper"),module.exports=function(nextHandler,IS_ITERATOR,RETURN_HANDLER_RESULT){var IteratorProxy=function Iterator(record,state){state?(state.iterator=record.iterator,state.next=record.next):state=record,state.type=IS_ITERATOR?"WrapForValidIterator":"IteratorHelper",state.returnHandlerResult=!!RETURN_HANDLER_RESULT,state.nextHandler=nextHandler,state.counter=0,state.done=!1,setInternalState(this,state)};return IteratorProxy.prototype=IS_ITERATOR?WrapForValidIteratorPrototype:IteratorHelperPrototype,IteratorProxy}},"./node_modules/core-js/internals/iterator-map.js":(module,__unused_webpack_exports,__webpack_require__)=>{var call=__webpack_require__("./node_modules/core-js/internals/function-call.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),getIteratorDirect=__webpack_require__("./node_modules/core-js/internals/get-iterator-direct.js"),createIteratorProxy=__webpack_require__("./node_modules/core-js/internals/iterator-create-proxy.js"),callWithSafeIterationClosing=__webpack_require__("./node_modules/core-js/internals/call-with-safe-iteration-closing.js"),IteratorProxy=createIteratorProxy((function(){var iterator=this.iterator,result=anObject(call(this.next,iterator));if(!(this.done=!!result.done))return callWithSafeIterationClosing(iterator,this.mapper,[result.value,this.counter++],!0)}));module.exports=function map(mapper){return anObject(this),aCallable(mapper),new IteratorProxy(getIteratorDirect(this),{mapper})}},"./node_modules/core-js/internals/object-define-property.js":(__unused_webpack_module,exports,__webpack_require__)=>{var DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),IE8_DOM_DEFINE=__webpack_require__("./node_modules/core-js/internals/ie8-dom-define.js"),V8_PROTOTYPE_DEFINE_BUG=__webpack_require__("./node_modules/core-js/internals/v8-prototype-define-bug.js"),anObject=__webpack_require__("./node_modules/core-js/internals/an-object.js"),toPropertyKey=__webpack_require__("./node_modules/core-js/internals/to-property-key.js"),$TypeError=TypeError,$defineProperty=Object.defineProperty,$getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor;exports.f=DESCRIPTORS?V8_PROTOTYPE_DEFINE_BUG?function defineProperty(O,P,Attributes){if(anObject(O),P=toPropertyKey(P),anObject(Attributes),"function"==typeof O&&"prototype"===P&&"value"in Attributes&&"writable"in Attributes&&!Attributes.writable){var current=$getOwnPropertyDescriptor(O,P);current&&current.writable&&(O[P]=Attributes.value,Attributes={configurable:"configurable"in Attributes?Attributes.configurable:current.configurable,enumerable:"enumerable"in Attributes?Attributes.enumerable:current.enumerable,writable:!1})}return $defineProperty(O,P,Attributes)}:$defineProperty:function defineProperty(O,P,Attributes){if(anObject(O),P=toPropertyKey(P),anObject(Attributes),IE8_DOM_DEFINE)try{return $defineProperty(O,P,Attributes)}catch(error){}if("get"in Attributes||"set"in Attributes)throw new $TypeError("Accessors not supported");return"value"in Attributes&&(O[P]=Attributes.value),O}},"./node_modules/core-js/modules/es.iterator.map.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),map=__webpack_require__("./node_modules/core-js/internals/iterator-map.js");$({target:"Iterator",proto:!0,real:!0,forced:__webpack_require__("./node_modules/core-js/internals/is-pure.js")},{map})},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/breadcrumbs/Breadcrumbs.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,'.breadcrumbs__Breadcrumbs-module__yWai8 {\n  color: var(--color-black);\n  font-weight: var(--font-weight-light);\n  font-size: 11px;\n}\n\n.breadcrumb__Breadcrumbs-module__L5rnC{\n  margin-right: 15px;\n}\n\n.breadcrumb__Breadcrumbs-module__L5rnC:not(:last-child)::after { \n  content: ">";\n  margin-left: 7px;\n}\n\n.breadcrumb__Breadcrumbs-module__L5rnC:last-child{\n  font-weight: var(--font-weight-normal);\n}\n',"",{version:3,sources:["webpack://./src/shared/components/breadcrumbs/Breadcrumbs.module.css"],names:[],mappings:"AAAA;EACE,yBAAyB;EACzB,qCAAqC;EACrC,eAAe;AACjB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,YAAY;EACZ,gBAAgB;AAClB;;AAEA;EACE,sCAAsC;AACxC",sourcesContent:['.breadcrumbs {\n  color: var(--color-black);\n  font-weight: var(--font-weight-light);\n  font-size: 11px;\n}\n\n.breadcrumb{\n  margin-right: 15px;\n}\n\n.breadcrumb:not(:last-child)::after { \n  content: ">";\n  margin-left: 7px;\n}\n\n.breadcrumb:last-child{\n  font-weight: var(--font-weight-normal);\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={breadcrumbs:"breadcrumbs__Breadcrumbs-module__yWai8",breadcrumb:"breadcrumb__Breadcrumbs-module__L5rnC"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/breadcrumbs/Breadcrumbs.stories.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".wrapper__Breadcrumbs-stories-module__PfJ8V {\n  padding: 40px;\n}\n","",{version:3,sources:["webpack://./stories/shared-components/breadcrumbs/Breadcrumbs.stories.module.css"],names:[],mappings:"AAAA;EACE,aAAa;AACf",sourcesContent:[".wrapper {\n  padding: 40px;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={wrapper:"wrapper__Breadcrumbs-stories-module__PfJ8V"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.js":(__unused_webpack_module,exports)=>{var REACT_ELEMENT_TYPE=Symbol.for("react.transitional.element"),REACT_FRAGMENT_TYPE=Symbol.for("react.fragment");function jsxProd(type,config,maybeKey){var key=null;if(void 0!==maybeKey&&(key=""+maybeKey),void 0!==config.key&&(key=""+config.key),"key"in config)for(var propName in maybeKey={},config)"key"!==propName&&(maybeKey[propName]=config[propName]);else maybeKey=config;return config=maybeKey.ref,{$$typeof:REACT_ELEMENT_TYPE,type,key,ref:void 0!==config?config:null,props:maybeKey}}exports.Fragment=REACT_FRAGMENT_TYPE,exports.jsx=jsxProd,exports.jsxs=jsxProd},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.js")},"./stories/shared-components/breadcrumbs/Breadcrumbs.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DefaultBreadcrumbs:()=>DefaultBreadcrumbs,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Breadcrumbs_stories});__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.map.js");var injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Breadcrumbs_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/breadcrumbs/Breadcrumbs.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Breadcrumbs_module.A,options);const breadcrumbs_Breadcrumbs_module=Breadcrumbs_module.A&&Breadcrumbs_module.A.locals?Breadcrumbs_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const Breadcrumbs=props=>(0,jsx_runtime.jsx)("div",{className:breadcrumbs_Breadcrumbs_module.breadcrumbs,children:props.breadcrumbs.map(((breadcrumb,index)=>(0,jsx_runtime.jsx)("span",{className:breadcrumbs_Breadcrumbs_module.breadcrumb,children:breadcrumb},index)))}),breadcrumbs_Breadcrumbs=Breadcrumbs;try{Breadcrumbs.displayName="Breadcrumbs",Breadcrumbs.__docgenInfo={description:"",displayName:"Breadcrumbs",props:{breadcrumbs:{defaultValue:null,description:"",name:"breadcrumbs",required:!0,type:{name:"string[]"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/breadcrumbs/Breadcrumbs.tsx#Breadcrumbs"]={docgenInfo:Breadcrumbs.__docgenInfo,name:"Breadcrumbs",path:"src/shared/components/breadcrumbs/Breadcrumbs.tsx#Breadcrumbs"})}catch(__react_docgen_typescript_loader_error){}var Breadcrumbs_stories_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/breadcrumbs/Breadcrumbs.stories.module.css"),Breadcrumbs_stories_module_options={};Breadcrumbs_stories_module_options.styleTagTransform=styleTagTransform_default(),Breadcrumbs_stories_module_options.setAttributes=setAttributesWithoutAttributes_default(),Breadcrumbs_stories_module_options.insert=insertBySelector_default().bind(null,"head"),Breadcrumbs_stories_module_options.domAPI=styleDomAPI_default(),Breadcrumbs_stories_module_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Breadcrumbs_stories_module.A,Breadcrumbs_stories_module_options);const breadcrumbs_Breadcrumbs_stories_module=Breadcrumbs_stories_module.A&&Breadcrumbs_stories_module.A.locals?Breadcrumbs_stories_module.A.locals:void 0,Breadcrumbs_stories={title:"Components/Shared Components/Breadcrumbs"},DefaultBreadcrumbs=()=>(0,jsx_runtime.jsx)("div",{className:breadcrumbs_Breadcrumbs_stories_module.wrapper,children:(0,jsx_runtime.jsx)(breadcrumbs_Breadcrumbs,{breadcrumbs:["Item 1","Item 2","Item 3","Item 4"]})});DefaultBreadcrumbs.storyName="Breadcrumbs";const __namedExportsOrder=["DefaultBreadcrumbs"];DefaultBreadcrumbs.parameters={...DefaultBreadcrumbs.parameters,docs:{...DefaultBreadcrumbs.parameters?.docs,source:{originalSource:"() => <div className={styles.wrapper}>\n    <Breadcrumbs breadcrumbs={['Item 1', 'Item 2', 'Item 3', 'Item 4']} />\n  </div>",...DefaultBreadcrumbs.parameters?.docs?.source}}}}}]);