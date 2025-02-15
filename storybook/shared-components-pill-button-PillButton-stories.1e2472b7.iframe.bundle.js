/*! For license information please see shared-components-pill-button-PillButton-stories.1e2472b7.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[120],{"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes="",i=0;i<arguments.length;i++){var arg=arguments[i];arg&&(classes=appendClass(classes,parseValue(arg)))}return classes}function parseValue(arg){if("string"==typeof arg||"number"==typeof arg)return arg;if("object"!=typeof arg)return"";if(Array.isArray(arg))return classNames.apply(null,arg);if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]"))return arg.toString();var classes="";for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&(classes=appendClass(classes,key));return classes}function appendClass(value,newClass){return newClass?value?value+" "+newClass:value+newClass:value}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/pill-button/PillButton.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".pillButton__PillButton-module__zHtlB {\n  background: var(--pill-button-color, var(--color-blue));\n  color: var(--pill-button-text-color, var(--color-white));\n  font-size: var(--pill-button-font-size, 12px);\n  font-weight: var(--pill-button-font-weight, var(--font-weight-bold));\n  padding: var(--pill-button-padding, 2px 8px);\n  border-radius: var(--pill-button-border-radius, 14px);\n  white-space: nowrap;\n}\n","",{version:3,sources:["webpack://./src/shared/components/pill-button/PillButton.module.css"],names:[],mappings:"AAAA;EACE,uDAAuD;EACvD,wDAAwD;EACxD,6CAA6C;EAC7C,oEAAoE;EACpE,4CAA4C;EAC5C,qDAAqD;EACrD,mBAAmB;AACrB",sourcesContent:[".pillButton {\n  background: var(--pill-button-color, var(--color-blue));\n  color: var(--pill-button-text-color, var(--color-white));\n  font-size: var(--pill-button-font-size, 12px);\n  font-weight: var(--pill-button-font-weight, var(--font-weight-bold));\n  padding: var(--pill-button-padding, 2px 8px);\n  border-radius: var(--pill-button-border-radius, 14px);\n  white-space: nowrap;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={pillButton:"pillButton__PillButton-module__zHtlB"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.js":(__unused_webpack_module,exports)=>{"use strict";var REACT_ELEMENT_TYPE=Symbol.for("react.transitional.element"),REACT_FRAGMENT_TYPE=Symbol.for("react.fragment");function jsxProd(type,config,maybeKey){var key=null;if(void 0!==maybeKey&&(key=""+maybeKey),void 0!==config.key&&(key=""+config.key),"key"in config)for(var propName in maybeKey={},config)"key"!==propName&&(maybeKey[propName]=config[propName]);else maybeKey=config;return config=maybeKey.ref,{$$typeof:REACT_ELEMENT_TYPE,type,key,ref:void 0!==config?config:null,props:maybeKey}}exports.Fragment=REACT_FRAGMENT_TYPE,exports.jsx=jsxProd,exports.jsxs=jsxProd},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.js")},"./stories/shared-components/pill-button/PillButton.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{PlusButtonStory:()=>PlusButtonStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>PillButton_stories});var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),PillButton_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/pill-button/PillButton.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(PillButton_module.A,options);const pill_button_PillButton_module=PillButton_module.A&&PillButton_module.A.locals?PillButton_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const PillButton=props=>{const{className,...otherProps}=props,buttonClass=classnames_default()(pill_button_PillButton_module.pillButton,className);return(0,jsx_runtime.jsx)("button",{className:buttonClass,...otherProps})},pill_button_PillButton=PillButton;try{PillButton.displayName="PillButton",PillButton.__docgenInfo={description:"",displayName:"PillButton",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/pill-button/PillButton.tsx#PillButton"]={docgenInfo:PillButton.__docgenInfo,name:"PillButton",path:"src/shared/components/pill-button/PillButton.tsx#PillButton"})}catch(__react_docgen_typescript_loader_error){}const PillButton_stories={title:"Components/Shared Components/Pill button"},PlusButtonStory=()=>(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(pill_button_PillButton,{children:"+2"})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(pill_button_PillButton,{children:"+42"})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(pill_button_PillButton,{children:"+512"})}),(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(pill_button_PillButton,{children:"+1234"})})]});PlusButtonStory.storyName="default";const __namedExportsOrder=["PlusButtonStory"];PlusButtonStory.parameters={...PlusButtonStory.parameters,docs:{...PlusButtonStory.parameters?.docs,source:{originalSource:"() => <>\n    <div>\n      <PillButton>+2</PillButton>\n    </div>\n    <div>\n      <PillButton>+42</PillButton>\n    </div>\n    <div>\n      <PillButton>+512</PillButton>\n    </div>\n    <div>\n      <PillButton>+1234</PillButton>\n    </div>\n  </>",...PlusButtonStory.parameters?.docs?.source}}}}}]);