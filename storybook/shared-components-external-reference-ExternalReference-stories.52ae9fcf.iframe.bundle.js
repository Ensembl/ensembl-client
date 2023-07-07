/*! For license information please see shared-components-external-reference-ExternalReference-stories.52ae9fcf.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[2400],{"./stories/shared-components/external-reference/ExternalReference.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DefaultExternalReference:()=>DefaultExternalReference,WithoutLabel:()=>WithoutLabel,__namedExportsOrder:()=>__namedExportsOrder,default:()=>shared_components_external_reference_ExternalReference_stories});__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/react/index.js");var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),ExternalLink=__webpack_require__("./src/shared/components/external-link/ExternalLink.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),ExternalReference=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/external-reference/ExternalReference.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(ExternalReference.Z,options);const external_reference_ExternalReference=ExternalReference.Z&&ExternalReference.Z.locals?ExternalReference.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var ExternalReference_ExternalReference=props=>{var _props$classNames,_props$classNames2,_props$classNames3,_props$classNames4,containerClass=classnames_default()(null===(_props$classNames=props.classNames)||void 0===_props$classNames?void 0:_props$classNames.container),containerProps=containerClass?{className:containerClass}:{},labelClass=classnames_default()(external_reference_ExternalReference.label,null===(_props$classNames2=props.classNames)||void 0===_props$classNames2?void 0:_props$classNames2.label);return(0,jsx_runtime.jsxs)("div",_objectSpread(_objectSpread({},containerProps),{},{children:[!!props.label&&(0,jsx_runtime.jsx)("span",{className:labelClass,children:props.label}),props.to?(0,jsx_runtime.jsx)(ExternalLink.Z,{to:props.to,linkText:props.linkText,classNames:{icon:null===(_props$classNames3=props.classNames)||void 0===_props$classNames3?void 0:_props$classNames3.icon,link:null===(_props$classNames4=props.classNames)||void 0===_props$classNames4?void 0:_props$classNames4.link},onClick:props.onClick}):(0,jsx_runtime.jsx)("span",{className:external_reference_ExternalReference.noLink,children:props.linkText})]}))};ExternalReference_ExternalReference.displayName="ExternalReference";const components_external_reference_ExternalReference=ExternalReference_ExternalReference;try{ExternalReference_ExternalReference.displayName="ExternalReference",ExternalReference_ExternalReference.__docgenInfo={description:"",displayName:"ExternalReference",props:{label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string | null"}},to:{defaultValue:null,description:"",name:"to",required:!0,type:{name:"string"}},linkText:{defaultValue:null,description:"",name:"linkText",required:!0,type:{name:"string"}},classNames:{defaultValue:null,description:"",name:"classNames",required:!1,type:{name:"{ container?: string; label?: string; icon?: string | undefined; link?: string | undefined; } | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/external-reference/ExternalReference.tsx#ExternalReference"]={docgenInfo:ExternalReference_ExternalReference.__docgenInfo,name:"ExternalReference",path:"src/shared/components/external-reference/ExternalReference.tsx#ExternalReference"})}catch(__react_docgen_typescript_loader_error){}var ExternalReference_stories=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/shared-components/external-reference/ExternalReference.stories.scss"),ExternalReference_stories_options={};ExternalReference_stories_options.styleTagTransform=styleTagTransform_default(),ExternalReference_stories_options.setAttributes=setAttributesWithoutAttributes_default(),ExternalReference_stories_options.insert=insertBySelector_default().bind(null,"head"),ExternalReference_stories_options.domAPI=styleDomAPI_default(),ExternalReference_stories_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(ExternalReference_stories.Z,ExternalReference_stories_options);const external_reference_ExternalReference_stories=ExternalReference_stories.Z&&ExternalReference_stories.Z.locals?ExternalReference_stories.Z.locals:void 0;var _DefaultExternalRefer,_DefaultExternalRefer2,_DefaultExternalRefer3,_WithoutLabel$paramet,_WithoutLabel$paramet2,_WithoutLabel$paramet3;function ExternalReference_stories_ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function ExternalReference_stories_objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ExternalReference_stories_ownKeys(Object(source),!0).forEach((function(key){ExternalReference_stories_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ExternalReference_stories_ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function ExternalReference_stories_defineProperty(obj,key,value){return(key=function ExternalReference_stories_toPropertyKey(arg){var key=function ExternalReference_stories_toPrimitive(input,hint){if("object"!=typeof input||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!=typeof res)return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"==typeof key?key:String(key)}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}const shared_components_external_reference_ExternalReference_stories={title:"Components/Shared Components/ExternalReference"};var DefaultExternalReference=()=>(0,jsx_runtime.jsx)(components_external_reference_ExternalReference,{label:"Source name",linkText:"LinkText",to:"",classNames:{container:external_reference_ExternalReference_stories.wrapper}});DefaultExternalReference.displayName="DefaultExternalReference",DefaultExternalReference.storyName="default";var WithoutLabel=()=>(0,jsx_runtime.jsx)(components_external_reference_ExternalReference,{linkText:"LinkText",to:"",classNames:{container:external_reference_ExternalReference_stories.wrapper}});WithoutLabel.displayName="WithoutLabel",WithoutLabel.storyName="without label",DefaultExternalReference.parameters=ExternalReference_stories_objectSpread(ExternalReference_stories_objectSpread({},DefaultExternalReference.parameters),{},{docs:ExternalReference_stories_objectSpread(ExternalReference_stories_objectSpread({},null===(_DefaultExternalRefer=DefaultExternalReference.parameters)||void 0===_DefaultExternalRefer?void 0:_DefaultExternalRefer.docs),{},{source:ExternalReference_stories_objectSpread({originalSource:"() => <ExternalReference label={'Source name'} linkText={'LinkText'} to={''} classNames={{\n  container: styles.wrapper\n}} />"},null===(_DefaultExternalRefer2=DefaultExternalReference.parameters)||void 0===_DefaultExternalRefer2||null===(_DefaultExternalRefer3=_DefaultExternalRefer2.docs)||void 0===_DefaultExternalRefer3?void 0:_DefaultExternalRefer3.source)})}),WithoutLabel.parameters=ExternalReference_stories_objectSpread(ExternalReference_stories_objectSpread({},WithoutLabel.parameters),{},{docs:ExternalReference_stories_objectSpread(ExternalReference_stories_objectSpread({},null===(_WithoutLabel$paramet=WithoutLabel.parameters)||void 0===_WithoutLabel$paramet?void 0:_WithoutLabel$paramet.docs),{},{source:ExternalReference_stories_objectSpread({originalSource:"() => <ExternalReference linkText={'LinkText'} to={''} classNames={{\n  container: styles.wrapper\n}} />"},null===(_WithoutLabel$paramet2=WithoutLabel.parameters)||void 0===_WithoutLabel$paramet2||null===(_WithoutLabel$paramet3=_WithoutLabel$paramet2.docs)||void 0===_WithoutLabel$paramet3?void 0:_WithoutLabel$paramet3.source)})});var __namedExportsOrder=["DefaultExternalReference","WithoutLabel"]},"./src/shared/components/external-link/ExternalLink.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>components_external_link_ExternalLink});var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames);function _extends(){return _extends=Object.assign?Object.assign.bind():function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}const icon_xlink=props=>react.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",style:{enableBackground:"new 0 0 32 32"},viewBox:"0 0 32 32"},props),react.createElement("path",{d:"m22 5.2-.1.1-8.5 8.7c-1 1-1 2.5 0 3.5l1.2 1.2c1 1 2.5 1 3.5 0l8.5-8.7.1-.1 2.6 2.7c1 1 1.7.6 1.7-.7V1.8c0-.4-.4-.8-.8-.8h-9.8c-1.4 0-1.7.8-.7 1.8L22 5.2zM6 1C3.2 1 1 3.2 1 6v20c0 2.8 2.2 5 5 5h20c2.8 0 5-2.2 5-5V13.1v7.1L26 16v7.5c0 1.4-1.1 2.5-2.5 2.5h-15C7.1 26 6 24.9 6 23.5v-15C6 7.1 7.1 6 8.5 6H16l-4.2-5h7.1H6z",style:{fillRule:"evenodd",clipRule:"evenodd"}}));var injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),ExternalLink=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/external-link/ExternalLink.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(ExternalLink.Z,options);const external_link_ExternalLink=ExternalLink.Z&&ExternalLink.Z.locals?ExternalLink.Z.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),ExternalLink_ExternalLink=props=>{var _props$classNames,_props$classNames2,iconClass=classnames_default()(external_link_ExternalLink.icon,null===(_props$classNames=props.classNames)||void 0===_props$classNames?void 0:_props$classNames.icon),linkClass=classnames_default()(external_link_ExternalLink.link,null===(_props$classNames2=props.classNames)||void 0===_props$classNames2?void 0:_props$classNames2.link);return(0,jsx_runtime.jsxs)("span",{className:external_link_ExternalLink.externalLinkContainer,children:[(0,jsx_runtime.jsx)(icon_xlink,{className:iconClass}),(0,jsx_runtime.jsx)("a",{className:linkClass,href:props.to,target:"_blank",rel:"nofollow noreferrer",onClick:props.onClick,children:props.linkText})]})};ExternalLink_ExternalLink.displayName="ExternalLink";const components_external_link_ExternalLink=ExternalLink_ExternalLink;try{ExternalLink_ExternalLink.displayName="ExternalLink",ExternalLink_ExternalLink.__docgenInfo={description:"",displayName:"ExternalLink",props:{to:{defaultValue:null,description:"",name:"to",required:!0,type:{name:"string"}},linkText:{defaultValue:null,description:"",name:"linkText",required:!0,type:{name:"string"}},classNames:{defaultValue:null,description:"",name:"classNames",required:!1,type:{name:"{ icon?: string; link?: string; } | undefined"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/external-link/ExternalLink.tsx#ExternalLink"]={docgenInfo:ExternalLink_ExternalLink.__docgenInfo,name:"ExternalLink",path:"src/shared/components/external-link/ExternalLink.tsx#ExternalLink"})}catch(__react_docgen_typescript_loader_error){}},"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes=[],i=0;i<arguments.length;i++){var arg=arguments[i];if(arg){var argType=typeof arg;if("string"===argType||"number"===argType)classes.push(arg);else if(Array.isArray(arg)){if(arg.length){var inner=classNames.apply(null,arg);inner&&classes.push(inner)}}else if("object"===argType){if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]")){classes.push(arg.toString());continue}for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&classes.push(key)}}}return classes.join(" ")}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/core-js/internals/object-get-own-property-names.js":(__unused_webpack_module,exports,__webpack_require__)=>{var internalObjectKeys=__webpack_require__("./node_modules/core-js/internals/object-keys-internal.js"),hiddenKeys=__webpack_require__("./node_modules/core-js/internals/enum-bug-keys.js").concat("length","prototype");exports.f=Object.getOwnPropertyNames||function getOwnPropertyNames(O){return internalObjectKeys(O,hiddenKeys)}},"./node_modules/core-js/modules/es.symbol.description.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),DESCRIPTORS=__webpack_require__("./node_modules/core-js/internals/descriptors.js"),global=__webpack_require__("./node_modules/core-js/internals/global.js"),uncurryThis=__webpack_require__("./node_modules/core-js/internals/function-uncurry-this.js"),hasOwn=__webpack_require__("./node_modules/core-js/internals/has-own-property.js"),isCallable=__webpack_require__("./node_modules/core-js/internals/is-callable.js"),isPrototypeOf=__webpack_require__("./node_modules/core-js/internals/object-is-prototype-of.js"),toString=__webpack_require__("./node_modules/core-js/internals/to-string.js"),defineBuiltInAccessor=__webpack_require__("./node_modules/core-js/internals/define-built-in-accessor.js"),copyConstructorProperties=__webpack_require__("./node_modules/core-js/internals/copy-constructor-properties.js"),NativeSymbol=global.Symbol,SymbolPrototype=NativeSymbol&&NativeSymbol.prototype;if(DESCRIPTORS&&isCallable(NativeSymbol)&&(!("description"in SymbolPrototype)||void 0!==NativeSymbol().description)){var EmptyStringDescriptionStore={},SymbolWrapper=function Symbol(){var description=arguments.length<1||void 0===arguments[0]?void 0:toString(arguments[0]),result=isPrototypeOf(SymbolPrototype,this)?new NativeSymbol(description):void 0===description?NativeSymbol():NativeSymbol(description);return""===description&&(EmptyStringDescriptionStore[result]=!0),result};copyConstructorProperties(SymbolWrapper,NativeSymbol),SymbolWrapper.prototype=SymbolPrototype,SymbolPrototype.constructor=SymbolWrapper;var NATIVE_SYMBOL="Symbol(test)"==String(NativeSymbol("test")),thisSymbolValue=uncurryThis(SymbolPrototype.valueOf),symbolDescriptiveString=uncurryThis(SymbolPrototype.toString),regexp=/^Symbol\((.*)\)[^)]+$/,replace=uncurryThis("".replace),stringSlice=uncurryThis("".slice);defineBuiltInAccessor(SymbolPrototype,"description",{configurable:!0,get:function description(){var symbol=thisSymbolValue(this);if(hasOwn(EmptyStringDescriptionStore,symbol))return"";var string=symbolDescriptiveString(symbol),desc=NATIVE_SYMBOL?stringSlice(string,7,-1):replace(string,regexp,"$1");return""===desc?void 0:desc}}),$({global:!0,constructor:!0,forced:!0},{Symbol:SymbolWrapper})}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/external-link/ExternalLink.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".externalLinkContainer__ExternalLink__XrTbR{display:inline-grid;grid-template-columns:[icon] auto [link] auto}.icon__ExternalLink__bxxFy{display:inline-block;fill:#f90;grid-column:icon;top:1px;position:relative;height:12px;width:12px}.link__ExternalLink__l3s2W{display:inline-block;position:relative;top:-2px;margin-left:5px}","",{version:3,sources:["webpack://./src/shared/components/external-link/ExternalLink.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,4CACE,mBAAA,CACA,6CAAA,CAGF,2BACE,oBAAA,CACA,SCqCO,CDpCP,gBAAA,CACA,OAAA,CACA,iBAAA,CACA,WAAA,CACA,UAAA,CAGF,2BACE,oBAAA,CACA,iBAAA,CACA,QAAA,CACA,eAAA",sourcesContent:["@import 'src/styles/common';\n\n.externalLinkContainer {\n  display: inline-grid;\n  grid-template-columns:  [icon] auto [link] auto;\n}\n\n.icon {\n  display: inline-block;\n  fill: $orange;\n  grid-column: icon;\n  top: 1px;\n  position: relative;\n  height: 12px;\n  width: 12px;\n}\n\n.link {\n  display: inline-block;\n  position: relative;\n  top: -2px;\n  margin-left: 5px;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",externalLinkContainer:"externalLinkContainer__ExternalLink__XrTbR",icon:"icon__ExternalLink__bxxFy",link:"link__ExternalLink__l3s2W"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/shared/components/external-reference/ExternalReference.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".label__ExternalReference__IppOQ{margin-right:5px;font-weight:300}.xrefText__ExternalReference__pDIIQ{font-weight:300;margin-left:7px}.noLink__ExternalReference__X5V8L{margin-left:5px}","",{version:3,sources:["webpack://./src/shared/components/external-reference/ExternalReference.scss","webpack://./src/styles/_settings.scss"],names:[],mappings:"AAEA,iCACE,gBAAA,CACA,eC8EM,CD3ER,oCACE,eC0EM,CDzEN,eAAA,CAGF,kCACE,eAAA",sourcesContent:["@import 'src/styles/common';\n\n.label {\n  margin-right: 5px;\n  font-weight: $light;\n}\n\n.xrefText {\n  font-weight: $light;\n  margin-left: 7px;\n}\n\n.noLink {\n  margin-left: 5px;\n}\n","// 1. Global\n// ---------\n\n$global-font-size: 13px;\n$global-lineheight: 1.5;\n$black: #1b2c39;\n$white: #fff;\n$off-white: #fefefe;\n$body-background: $off-white;\n$body-font-color: $black;\n$body-font-family: Lato, 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;\n$body-antialiased: true;\n$global-weight-normal: normal;\n$global-weight-bold: bold;\n$global-radius: 0;\n$global-button-cursor: auto;\n\n$standard-gutter: 30px;\n$half-gutter: calc($standard-gutter / 2);\n$double-standard-gutter: calc($standard-gutter * 2);\n$global-padding-left: calc($standard-gutter * 4);\n$global-padding-bottom: 90px;\n\n// Colour Palette\n// ---------\n$soft-black: #374148;\n\n$shadow-color: rgba(0, 0, 0, 0.4);\n\n$blue: #0099ff; // blue on white\n$light-blue: #33adff; // blue on black\n$ice-blue: #e5f5ff; // text highlight\n$teal: #327C89;\n$duckegg-blue: #96D0C9;\n$neon-blue: #8ef4f8;\n\n$light-grey: #f1f2f4;\n$medium-light-grey: #d4d9de;\n$grey: #b7c0c8;\n$medium-dark-grey: #9aa7b1;\n$dark-grey: #6f8190;\n\n$red: #d90000;\n$dark-pink: #e685ae;\n$purple: #ca81ff;\n\n$orange: #ff9900;\n$mustard: #cc9933;\n$dark-yellow: #f8c041;\n\n$green: #47d147;\n$lime: #84fa3a;\n\n$global-box-shadow: $medium-light-grey;\n$form-field-shadow: inset 2px 2px 4px -2px $medium-dark-grey,\n  inset -2px -2px 1px -2px $dark-grey;\n\n/* stylelint-disable */\n:export {\n  black: $black;\n  soft-black: $soft-black;\n  blue: $blue;\n  light-blue: $light-blue;\n  ice-blue: $ice-blue;\n  red: $red;\n  orange: $orange;\n  mustard: $mustard;\n  dark-grey: $dark-grey;\n  medium-dark-grey: $medium-dark-grey;\n  grey: $grey;\n  medium-light-grey: $medium-light-grey;\n  light-grey: $light-grey;\n  green: $green;\n  white: $white;\n  shadow-color: $shadow-color;\n}\n/* stylelint-enable */\n\n$img-base-url: '/static/img';\n\n// font weights\n\n$light: 300;\n$normal: 400;\n$bold: 700;\n$dark: 900;\n\n// Base Typography\n// ------------------\n\n$font-family-monospace: 'IBM Plex Mono', 'Liberation Mono', Courier, monospace;\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={black:"#1b2c39","soft-black":"#374148",blue:"#09f","light-blue":"#33adff","ice-blue":"#e5f5ff",red:"#d90000",orange:"#f90",mustard:"#c93","dark-grey":"#6f8190","medium-dark-grey":"#9aa7b1",grey:"#b7c0c8","medium-light-grey":"#d4d9de","light-grey":"#f1f2f4",green:"#47d147",white:"#fff","shadow-color":"rgba(0,0,0,.4)",label:"label__ExternalReference__IppOQ",xrefText:"xrefText__ExternalReference__pDIIQ",noLink:"noLink__ExternalReference__X5V8L"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./node_modules/sass-loader/dist/cjs.js!./stories/shared-components/external-reference/ExternalReference.stories.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".wrapper__ExternalReference-stories__qJziz{padding:40px}","",{version:3,sources:["webpack://./stories/shared-components/external-reference/ExternalReference.stories.scss"],names:[],mappings:"AAAA,2CACE,YAAA",sourcesContent:[".wrapper {\n  padding: 40px;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={wrapper:"wrapper__ExternalReference-stories__qJziz"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.Fragment=l,exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")}}]);