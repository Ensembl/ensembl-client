/*! For license information please see shared-components-textarea-Textarea-stories.fc8819c9.iframe.bundle.js.LICENSE.txt */
(self.webpackChunkensembl_new=self.webpackChunkensembl_new||[]).push([[3681],{"./stories/shared-components/textarea/Textarea.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{CustomStyledStory:()=>CustomStyledStory,DefaultStory:()=>DefaultStory,FocusBlurStory:()=>FocusBlurStory,NoResizeStory:()=>NoResizeStory,ShadedTextareaStory:()=>ShadedTextareaStory,WithPlaceholderStory:()=>WithPlaceholderStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>shared_components_textarea_Textarea_stories});__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/react/index.js");var Textarea=__webpack_require__("./src/shared/components/textarea/Textarea.tsx"),ShadedTextarea=__webpack_require__("./src/shared/components/textarea/ShadedTextarea.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Textarea_stories=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/shared-components/textarea/Textarea.stories.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Textarea_stories.Z,options);const textarea_Textarea_stories=Textarea_stories.Z&&Textarea_stories.Z.locals?Textarea_stories.Z.locals:void 0;var _DefaultStory$paramet,_DefaultStory$paramet2,_WithPlaceholderStory,_WithPlaceholderStory2,_NoResizeStory$parame,_NoResizeStory$parame2,_FocusBlurStory$param,_FocusBlurStory$param2,_ShadedTextareaStory$,_ShadedTextareaStory$2,_CustomStyledStory$pa,_CustomStyledStory$pa2,jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var DefaultStory=()=>(0,jsx_runtime.jsx)("div",{className:textarea_Textarea_stories.defaultWrapper,children:(0,jsx_runtime.jsx)(Textarea.Z,{})});DefaultStory.displayName="DefaultStory",DefaultStory.storyName="default";var WithPlaceholderStory=()=>(0,jsx_runtime.jsx)("div",{className:textarea_Textarea_stories.defaultWrapper,children:(0,jsx_runtime.jsx)(Textarea.Z,{placeholder:"Enter something..."})});WithPlaceholderStory.displayName="WithPlaceholderStory",WithPlaceholderStory.storyName="with placeholder";var NoResizeStory=()=>(0,jsx_runtime.jsx)("div",{className:textarea_Textarea_stories.defaultWrapper,children:(0,jsx_runtime.jsx)(Textarea.Z,{placeholder:"Enter something...",resizable:!1})});NoResizeStory.displayName="NoResizeStory",NoResizeStory.storyName="resize disabled";var FocusBlurStory=args=>(0,jsx_runtime.jsx)("div",{className:textarea_Textarea_stories.defaultWrapper,children:(0,jsx_runtime.jsx)(Textarea.Z,{placeholder:"Enter something...",onFocus:args.onFocus,onBlur:args.onBlur})});FocusBlurStory.displayName="FocusBlurStory",FocusBlurStory.storyName="with onFocus and onBlur";var ShadedTextareaStory=()=>(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsxs)("div",{className:textarea_Textarea_stories.stage,children:[(0,jsx_runtime.jsx)("p",{children:"Against a white background"}),(0,jsx_runtime.jsx)("div",{className:textarea_Textarea_stories.defaultWrapper,children:(0,jsx_runtime.jsx)(ShadedTextarea.Z,{placeholder:"Enter something..."})})]}),(0,jsx_runtime.jsxs)("div",{className:"".concat(textarea_Textarea_stories.stage," ").concat(textarea_Textarea_stories.greyStage),children:[(0,jsx_runtime.jsx)("p",{children:"Against a grey background"}),(0,jsx_runtime.jsx)("div",{className:textarea_Textarea_stories.defaultWrapper,children:(0,jsx_runtime.jsx)(ShadedTextarea.Z,{placeholder:"Enter something..."})})]})]});ShadedTextareaStory.storyName="shaded textarea";var CustomStyledStory=()=>(0,jsx_runtime.jsx)("div",{className:textarea_Textarea_stories.defaultWrapper,children:(0,jsx_runtime.jsx)(Textarea.Z,{placeholder:"Enter something...",className:textarea_Textarea_stories.customizedTextarea})});CustomStyledStory.displayName="CustomStyledStory",CustomStyledStory.storyName="with custom styles";const shared_components_textarea_Textarea_stories={title:"Components/Shared Components/Textarea",argTypes:{onFocus:{action:"focus"},onBlur:{action:"blur"}}};DefaultStory.parameters=_objectSpread(_objectSpread({},DefaultStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_DefaultStory$paramet=DefaultStory.parameters)||void 0===_DefaultStory$paramet?void 0:_DefaultStory$paramet.docs),{},{source:_objectSpread({originalSource:"() => <div className={styles.defaultWrapper}>\n    <Textarea />\n  </div>"},null===(_DefaultStory$paramet2=DefaultStory.parameters)||void 0===_DefaultStory$paramet2||null===(_DefaultStory$paramet2=_DefaultStory$paramet2.docs)||void 0===_DefaultStory$paramet2?void 0:_DefaultStory$paramet2.source)})}),WithPlaceholderStory.parameters=_objectSpread(_objectSpread({},WithPlaceholderStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_WithPlaceholderStory=WithPlaceholderStory.parameters)||void 0===_WithPlaceholderStory?void 0:_WithPlaceholderStory.docs),{},{source:_objectSpread({originalSource:'() => <div className={styles.defaultWrapper}>\n    <Textarea placeholder="Enter something..." />\n  </div>'},null===(_WithPlaceholderStory2=WithPlaceholderStory.parameters)||void 0===_WithPlaceholderStory2||null===(_WithPlaceholderStory2=_WithPlaceholderStory2.docs)||void 0===_WithPlaceholderStory2?void 0:_WithPlaceholderStory2.source)})}),NoResizeStory.parameters=_objectSpread(_objectSpread({},NoResizeStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_NoResizeStory$parame=NoResizeStory.parameters)||void 0===_NoResizeStory$parame?void 0:_NoResizeStory$parame.docs),{},{source:_objectSpread({originalSource:'() => <div className={styles.defaultWrapper}>\n    <Textarea placeholder="Enter something..." resizable={false} />\n  </div>'},null===(_NoResizeStory$parame2=NoResizeStory.parameters)||void 0===_NoResizeStory$parame2||null===(_NoResizeStory$parame2=_NoResizeStory$parame2.docs)||void 0===_NoResizeStory$parame2?void 0:_NoResizeStory$parame2.source)})}),FocusBlurStory.parameters=_objectSpread(_objectSpread({},FocusBlurStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_FocusBlurStory$param=FocusBlurStory.parameters)||void 0===_FocusBlurStory$param?void 0:_FocusBlurStory$param.docs),{},{source:_objectSpread({originalSource:'(args: DefaultArgs) => <div className={styles.defaultWrapper}>\n    <Textarea placeholder="Enter something..." onFocus={args.onFocus} onBlur={args.onBlur} />\n  </div>'},null===(_FocusBlurStory$param2=FocusBlurStory.parameters)||void 0===_FocusBlurStory$param2||null===(_FocusBlurStory$param2=_FocusBlurStory$param2.docs)||void 0===_FocusBlurStory$param2?void 0:_FocusBlurStory$param2.source)})}),ShadedTextareaStory.parameters=_objectSpread(_objectSpread({},ShadedTextareaStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_ShadedTextareaStory$=ShadedTextareaStory.parameters)||void 0===_ShadedTextareaStory$?void 0:_ShadedTextareaStory$.docs),{},{source:_objectSpread({originalSource:'() => <>\n    <div className={styles.stage}>\n      <p>Against a white background</p>\n      <div className={styles.defaultWrapper}>\n        <ShadedTextarea placeholder="Enter something..." />\n      </div>\n    </div>\n    <div className={`${styles.stage} ${styles.greyStage}`}>\n      <p>Against a grey background</p>\n      <div className={styles.defaultWrapper}>\n        <ShadedTextarea placeholder="Enter something..." />\n      </div>\n    </div>\n  </>'},null===(_ShadedTextareaStory$2=ShadedTextareaStory.parameters)||void 0===_ShadedTextareaStory$2||null===(_ShadedTextareaStory$2=_ShadedTextareaStory$2.docs)||void 0===_ShadedTextareaStory$2?void 0:_ShadedTextareaStory$2.source)})}),CustomStyledStory.parameters=_objectSpread(_objectSpread({},CustomStyledStory.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_CustomStyledStory$pa=CustomStyledStory.parameters)||void 0===_CustomStyledStory$pa?void 0:_CustomStyledStory$pa.docs),{},{source:_objectSpread({originalSource:'() => <div className={styles.defaultWrapper}>\n    <Textarea placeholder="Enter something..." className={styles.customizedTextarea} />\n  </div>'},null===(_CustomStyledStory$pa2=CustomStyledStory.parameters)||void 0===_CustomStyledStory$pa2||null===(_CustomStyledStory$pa2=_CustomStyledStory$pa2.docs)||void 0===_CustomStyledStory$pa2?void 0:_CustomStyledStory$pa2.source)})});var __namedExportsOrder=["DefaultStory","WithPlaceholderStory","NoResizeStory","FocusBlurStory","ShadedTextareaStory","CustomStyledStory"];try{FocusBlurStory.displayName="FocusBlurStory",FocusBlurStory.__docgenInfo={description:"",displayName:"FocusBlurStory",props:{onFocus:{defaultValue:null,description:"",name:"onFocus",required:!0,type:{name:"(...args: any) => void"}},onBlur:{defaultValue:null,description:"",name:"onBlur",required:!0,type:{name:"(...args: any) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["stories/shared-components/textarea/Textarea.stories.tsx#FocusBlurStory"]={docgenInfo:FocusBlurStory.__docgenInfo,name:"FocusBlurStory",path:"stories/shared-components/textarea/Textarea.stories.tsx#FocusBlurStory"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/textarea/ShadedTextarea.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__),_Textarea__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/shared/components/textarea/Textarea.tsx"),_Textarea_scss__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/shared/components/textarea/Textarea.scss"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_excluded=["className"];function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var ShadedTextarea=(props,ref)=>{var{className}=props,otherProps=_objectWithoutProperties(props,_excluded),inputClasses=classnames__WEBPACK_IMPORTED_MODULE_4___default()(_Textarea_scss__WEBPACK_IMPORTED_MODULE_6__.Z.shadedTextarea,className);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_Textarea__WEBPACK_IMPORTED_MODULE_5__.Z,function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}({ref,className:inputClasses},otherProps))};ShadedTextarea.displayName="ShadedTextarea";const __WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_3__.forwardRef)(ShadedTextarea);try{ShadedTextarea.displayName="ShadedTextarea",ShadedTextarea.__docgenInfo={description:"",displayName:"ShadedTextarea",props:{resizable:{defaultValue:null,description:"",name:"resizable",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/textarea/ShadedTextarea.tsx#ShadedTextarea"]={docgenInfo:ShadedTextarea.__docgenInfo,name:"ShadedTextarea",path:"src/shared/components/textarea/ShadedTextarea.tsx#ShadedTextarea"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/textarea/Textarea.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js");var react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__),_Textarea_scss__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/shared/components/textarea/Textarea.scss"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_excluded=["className","resizable"];function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _objectWithoutProperties(source,excluded){if(null==source)return{};var key,i,target=function _objectWithoutPropertiesLoose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var Textarea=(props,ref)=>{var{className:classNameFromProps,resizable=!0}=props,otherProps=_objectWithoutProperties(props,_excluded),className=classnames__WEBPACK_IMPORTED_MODULE_4___default()(_Textarea_scss__WEBPACK_IMPORTED_MODULE_5__.Z.textarea,classNameFromProps,{[_Textarea_scss__WEBPACK_IMPORTED_MODULE_5__.Z.disableResize]:!resizable});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("textarea",function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}({ref,className},otherProps))};Textarea.displayName="Textarea";const __WEBPACK_DEFAULT_EXPORT__=(0,react__WEBPACK_IMPORTED_MODULE_3__.forwardRef)(Textarea);try{Textarea.displayName="Textarea",Textarea.__docgenInfo={description:"",displayName:"Textarea",props:{resizable:{defaultValue:null,description:"",name:"resizable",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/textarea/Textarea.tsx#Textarea"]={docgenInfo:Textarea.__docgenInfo,name:"Textarea",path:"src/shared/components/textarea/Textarea.tsx#Textarea"})}catch(__react_docgen_typescript_loader_error){}},"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes=[],i=0;i<arguments.length;i++){var arg=arguments[i];if(arg){var argType=typeof arg;if("string"===argType||"number"===argType)classes.push(arg);else if(Array.isArray(arg)){if(arg.length){var inner=classNames.apply(null,arg);inner&&classes.push(inner)}}else if("object"===argType){if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]")){classes.push(arg.toString());continue}for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&classes.push(key)}}}return classes.join(" ")}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/core-js/internals/object-get-own-property-names.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var internalObjectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys-internal.js"),hiddenKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js").concat("length","prototype");exports.f=Object.getOwnPropertyNames||function getOwnPropertyNames(O){return internalObjectKeys(O,hiddenKeys)}},"./node_modules/core-js/modules/es.symbol.description.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),global=__webpack_require__("./node_modules/core-js/internals/global.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),isPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-is-prototype-of.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),defineBuiltInAccessor=__webpack_require__("./node_modules/core-js/internals/define-built-in-accessor.js"),copyConstructorProperties=__webpack_require__("./node_modules/core-js/internals/copy-constructor-properties.js"),NativeSymbol=global.Symbol,SymbolPrototype=NativeSymbol&&NativeSymbol.prototype;if(DESCRIPTORS&&isCallable(NativeSymbol)&&(!("description"in SymbolPrototype)||void 0!==NativeSymbol().description)){var EmptyStringDescriptionStore={},SymbolWrapper=function Symbol(){var description=arguments.length<1||void 0===arguments[0]?void 0:toString(arguments[0]),result=isPrototypeOf(SymbolPrototype,this)?new NativeSymbol(description):void 0===description?NativeSymbol():NativeSymbol(description);return""===description&&(EmptyStringDescriptionStore[result]=!0),result};copyConstructorProperties(SymbolWrapper,NativeSymbol),SymbolWrapper.prototype=SymbolPrototype,SymbolPrototype.constructor=SymbolWrapper;var NATIVE_SYMBOL="Symbol(description detection)"===String(NativeSymbol("description detection")),thisSymbolValue=uncurryThis(SymbolPrototype.valueOf),symbolDescriptiveString=uncurryThis(SymbolPrototype.toString),regexp=/^Symbol\((.*)\)[^)]+$/,replace=uncurryThis("".replace),stringSlice=uncurryThis("".slice);defineBuiltInAccessor(SymbolPrototype,"description",{configurable:!0,get:function description(){var symbol=thisSymbolValue(this);if(hasOwn(EmptyStringDescriptionStore,symbol))return"";var string=symbolDescriptiveString(symbol),desc=NATIVE_SYMBOL?stringSlice(string,7,-1):replace(string,regexp,"$1");return""===desc?void 0:desc}}),$({global:!0,constructor:!0,forced:!0},{Symbol:SymbolWrapper})}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/textarea/Textarea.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".textarea__Textarea__FA_76{border-color:var(--textarea-border-color, #b7c0c8);border-width:var(--textarea-border-width, 1px);border-style:var(--textarea-border-style, solid);padding:7px;width:100%;height:var(--textarea-height, 85px)}.textarea__Textarea__FA_76:focus,.textarea__Textarea__FA_76:active{outline:none}.textarea__Textarea__FA_76::placeholder{color:#1b2c39;font-weight:300}.disableResize__Textarea__iYn6x{resize:none}.shadedTextarea__Textarea__x4fyC{--textarea-border-style: none;box-shadow:inset 2px 2px 4px -2px #9aa7b1,inset -2px -2px 1px -2px #6f8190;padding:7px 15px;border:none}","",{version:3,sources:["webpack://./src/shared/components/textarea/Textarea.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,2BACE,kDAAA,CACA,8CAAA,CACA,gDAAA,CACA,WAAA,CACA,UAAA,CACA,mCAAA,CAEA,mEAEE,YAAA,CAGF,wCACE,aCXI,CDYJ,eCiEI,CD7DR,gCACE,WAAA,CAGF,iCACE,6BAAA,CACA,0EC2BkB,CD1BlB,gBAAA,CACA,WAAA",sourcesContent:["@import 'src/styles/common';\n\n.textarea {\n  border-color: var(--textarea-border-color, $grey);\n  border-width: var(--textarea-border-width, 1px);\n  border-style: var(--textarea-border-style, solid);\n  padding: 7px;\n  width: 100%;\n  height: var(--textarea-height, 85px); /* To display 5 lines of text */\n\n  &:focus,\n  &:active {\n    outline: none;\n  }\n\n  &::placeholder {\n    color: $black;\n    font-weight: $light;\n  }\n}\n\n.disableResize {\n  resize: none;\n}\n\n.shadedTextarea {\n  --textarea-border-style: none;\n  box-shadow: $form-field-shadow;\n  padding: 7px 15px;\n  border: none;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",textarea:"textarea__Textarea__FA_76",disableResize:"disableResize__Textarea__iYn6x",shadedTextarea:"shadedTextarea__Textarea__x4fyC"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/shared-components/textarea/Textarea.stories.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".customizedTextarea__Textarea-stories__DyWMZ{color:#09f;font-size:30px;font-weight:bold;padding:16px;border:1px solid #09f}.defaultWrapper__Textarea-stories__OIRNj{padding:40px;background:#f1f2f4}.stage__Textarea-stories__Mom_t{padding:30px}.stage__Textarea-stories__Mom_t+.stage__Textarea-stories__Mom_t{margin-top:3ch}.greyStage__Textarea-stories__xn7I7{background:#f1f2f4}","",{version:3,sources:["webpack://./stories/shared-components/textarea/Textarea.stories.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,6CACE,UC0BK,CDzBL,cAAA,CACA,gBAAA,CACA,YAAA,CACA,qBAAA,CAGF,yCACE,YAAA,CACA,kBCwBW,CDrBb,gCACE,YAAA,CAEA,gEACE,cAAA,CAIJ,oCACE,kBCYW",sourcesContent:["@import 'src/styles/common';\n\n.customizedTextarea {\n  color: $blue;\n  font-size: 30px;\n  font-weight: bold;\n  padding: 16px;\n  border: 1px solid $blue;\n}\n\n.defaultWrapper {\n  padding: 40px;\n  background: $light-grey;\n}\n\n.stage {\n  padding: 30px;\n\n  & + .stage {\n    margin-top: 3ch;\n  }\n}\n\n.greyStage {\n  background: $light-grey;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",customizedTextarea:"customizedTextarea__Textarea-stories__DyWMZ",defaultWrapper:"defaultWrapper__Textarea-stories__OIRNj",stage:"stage__Textarea-stories__Mom_t",greyStage:"greyStage__Textarea-stories__xn7I7"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")},"./src/shared/components/textarea/Textarea.scss":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__),_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__),_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__),_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__),_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__),_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Textarea_scss__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/textarea/Textarea.scss"),options={};options.styleTagTransform=_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default(),options.setAttributes=_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default(),options.insert=_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null,"head"),options.domAPI=_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default(),options.insertStyleElement=_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default();_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Textarea_scss__WEBPACK_IMPORTED_MODULE_6__.Z,options);const __WEBPACK_DEFAULT_EXPORT__=_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Textarea_scss__WEBPACK_IMPORTED_MODULE_6__.Z&&_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Textarea_scss__WEBPACK_IMPORTED_MODULE_6__.Z.locals?_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_13_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_13_use_2_node_modules_sass_loader_dist_cjs_js_Textarea_scss__WEBPACK_IMPORTED_MODULE_6__.Z.locals:void 0}}]);