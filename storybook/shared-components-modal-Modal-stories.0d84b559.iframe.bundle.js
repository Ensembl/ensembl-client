/*! For license information please see shared-components-modal-Modal-stories.0d84b559.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[6617],{"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes="",i=0;i<arguments.length;i++){var arg=arguments[i];arg&&(classes=appendClass(classes,parseValue(arg)))}return classes}function parseValue(arg){if("string"==typeof arg||"number"==typeof arg)return arg;if("object"!=typeof arg)return"";if(Array.isArray(arg))return classNames.apply(null,arg);if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]"))return arg.toString();var classes="";for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&(classes=appendClass(classes,key));return classes}function appendClass(value,newClass){return newClass?value?value+" "+newClass:value+newClass:value}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/button/Button.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".primaryButton__Button-module__V5cOL {\n  --button-border: var(--primary-button-color, 1px solid var(--color-green));\n  --button-color: var(--primary-button-color, var(--color-green));\n  --button-text-color: var(--primary-button-text-color, var(--color-white));\n  font-weight: var(--font-weight-bold);\n}\n\n.primaryButton__Button-module__V5cOL:disabled {\n  --button-border: var(--primary-button-disabled-border, 1px solid var(--color-grey));\n  --button-color: var(--primary-button-disabled-color, transparent);\n  --button-text-color: var(--primary-button-disabled-text-color, var(--color-grey));\n}\n\n.secondaryButton__Button-module__qWaBA {\n  --button-border: var(--secondary-button-color, 1px solid var(--color-blue));\n  --button-color: var(--secondary-button-color, var(--color-blue));\n  --button-text-color: var(--secondary-button-text-color, var(--color-white));\n  font-weight: var(--font-weight-bold);\n}\n\n.button__Button-module___1f72 {\n  border: var(--button-border);\n  background-color: var(--button-color);\n  color: var(--button-text-color);\n  padding: 7px 18px;\n  border-radius: 4px;\n  -webkit-user-select: none;\n          user-select: none;\n}\n","",{version:3,sources:["webpack://./src/shared/components/button/Button.module.css"],names:[],mappings:"AAAA;EACE,0EAA0E;EAC1E,+DAA+D;EAC/D,yEAAyE;EACzE,oCAAoC;AACtC;;AAEA;EACE,mFAAmF;EACnF,iEAAiE;EACjE,iFAAiF;AACnF;;AAEA;EACE,2EAA2E;EAC3E,gEAAgE;EAChE,2EAA2E;EAC3E,oCAAoC;AACtC;;AAEA;EACE,4BAA4B;EAC5B,qCAAqC;EACrC,+BAA+B;EAC/B,iBAAiB;EACjB,kBAAkB;EAClB,yBAAiB;UAAjB,iBAAiB;AACnB",sourcesContent:[".primaryButton {\n  --button-border: var(--primary-button-color, 1px solid var(--color-green));\n  --button-color: var(--primary-button-color, var(--color-green));\n  --button-text-color: var(--primary-button-text-color, var(--color-white));\n  font-weight: var(--font-weight-bold);\n}\n\n.primaryButton:disabled {\n  --button-border: var(--primary-button-disabled-border, 1px solid var(--color-grey));\n  --button-color: var(--primary-button-disabled-color, transparent);\n  --button-text-color: var(--primary-button-disabled-text-color, var(--color-grey));\n}\n\n.secondaryButton {\n  --button-border: var(--secondary-button-color, 1px solid var(--color-blue));\n  --button-color: var(--secondary-button-color, var(--color-blue));\n  --button-text-color: var(--secondary-button-text-color, var(--color-white));\n  font-weight: var(--font-weight-bold);\n}\n\n.button {\n  border: var(--button-border);\n  background-color: var(--button-color);\n  color: var(--button-text-color);\n  padding: 7px 18px;\n  border-radius: 4px;\n  user-select: none;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={primaryButton:"primaryButton__Button-module__V5cOL",secondaryButton:"secondaryButton__Button-module__qWaBA",button:"button__Button-module___1f72"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/close-button/CloseButton.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".closeButton__CloseButton-module__QsTyC {\n  width: var(--close-button-size, 16px);\n  height: var(--close-button-size, 16px);\n  border-radius: 100%;\n}\n\n.icon__CloseButton-module__ut0Lm {\n  width: 100%;\n  height: 100%;\n  font-size: 0; /* to make the height of the svg independent on font-size settings */\n}\n\n\n.icon__CloseButton-module__ut0Lm circle {\n  fill: var(--color-blue);\n}\n\n.icon__CloseButton-module__ut0Lm path {\n  fill: var(--color-white);\n}\n\n\n.closeButtonWithLabel__CloseButton-module__y1_ui {\n  display: inline-flex;\n  align-items: center;\n  column-gap: var(--close-button-label-offset, 12px);\n  color: var(--color-blue);\n}\n\n.closeButtonWithLabel__CloseButton-module__y1_ui .icon__CloseButton-module__ut0Lm {\n  width: var(--close-button-size, 16px);\n  height: var(--close-button-size, 16px);\n}\n","",{version:3,sources:["webpack://./src/shared/components/close-button/CloseButton.module.css"],names:[],mappings:"AAAA;EACE,qCAAqC;EACrC,sCAAsC;EACtC,mBAAmB;AACrB;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,YAAY,EAAE,oEAAoE;AACpF;;;AAGA;EACE,uBAAuB;AACzB;;AAEA;EACE,wBAAwB;AAC1B;;;AAGA;EACE,oBAAoB;EACpB,mBAAmB;EACnB,kDAAkD;EAClD,wBAAwB;AAC1B;;AAEA;EACE,qCAAqC;EACrC,sCAAsC;AACxC",sourcesContent:[".closeButton {\n  width: var(--close-button-size, 16px);\n  height: var(--close-button-size, 16px);\n  border-radius: 100%;\n}\n\n.icon {\n  width: 100%;\n  height: 100%;\n  font-size: 0; /* to make the height of the svg independent on font-size settings */\n}\n\n\n.icon circle {\n  fill: var(--color-blue);\n}\n\n.icon path {\n  fill: var(--color-white);\n}\n\n\n.closeButtonWithLabel {\n  display: inline-flex;\n  align-items: center;\n  column-gap: var(--close-button-label-offset, 12px);\n  color: var(--color-blue);\n}\n\n.closeButtonWithLabel .icon {\n  width: var(--close-button-size, 16px);\n  height: var(--close-button-size, 16px);\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={closeButton:"closeButton__CloseButton-module__QsTyC",icon:"icon__CloseButton-module__ut0Lm",closeButtonWithLabel:"closeButtonWithLabel__CloseButton-module__y1_ui"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/modal/Modal.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".dialog__Modal-module__w8LbN {\n  width: 80vw;\n  height: 80vh;\n  border: none;\n  padding: 0;\n\n  /* this box-shadow is so dark because the modal body is set against a gray background */\n  box-shadow: 0 3px 6px #0000004D; /* TODO: resolve box-shadow colour globally w/Andrea */\n}\n\n.contentWrapper__Modal-module__AoR3C {\n  height: 100%;\n  background: white;\n  padding: 30px 45px;\n}\n\n.close__Modal-module___gspN {\n  position: absolute;\n  right: 20px;\n  top: 17px;\n}\n\n@media (width <= 980px) {\n  .dialog__Modal-module__w8LbN {\n    width: 95vw;\n  }\n}\n","",{version:3,sources:["webpack://./src/shared/components/modal/Modal.module.css"],names:[],mappings:"AAAA;EACE,WAAW;EACX,YAAY;EACZ,YAAY;EACZ,UAAU;;EAEV,uFAAuF;EACvF,+BAA+B,EAAE,sDAAsD;AACzF;;AAEA;EACE,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,kBAAkB;EAClB,WAAW;EACX,SAAS;AACX;;AAEA;EACE;IACE,WAAW;EACb;AACF",sourcesContent:[".dialog {\n  width: 80vw;\n  height: 80vh;\n  border: none;\n  padding: 0;\n\n  /* this box-shadow is so dark because the modal body is set against a gray background */\n  box-shadow: 0 3px 6px #0000004D; /* TODO: resolve box-shadow colour globally w/Andrea */\n}\n\n.contentWrapper {\n  height: 100%;\n  background: white;\n  padding: 30px 45px;\n}\n\n.close {\n  position: absolute;\n  right: 20px;\n  top: 17px;\n}\n\n@media (width <= 980px) {\n  .dialog {\n    width: 95vw;\n  }\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={dialog:"dialog__Modal-module__w8LbN",contentWrapper:"contentWrapper__Modal-module__AoR3C",close:"close__Modal-module___gspN"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.js":(__unused_webpack_module,exports)=>{"use strict";var REACT_ELEMENT_TYPE=Symbol.for("react.transitional.element"),REACT_FRAGMENT_TYPE=Symbol.for("react.fragment");function jsxProd(type,config,maybeKey){var key=null;if(void 0!==maybeKey&&(key=""+maybeKey),void 0!==config.key&&(key=""+config.key),"key"in config)for(var propName in maybeKey={},config)"key"!==propName&&(maybeKey[propName]=config[propName]);else maybeKey=config;return config=maybeKey.ref,{$$typeof:REACT_ELEMENT_TYPE,type,key,ref:void 0!==config?config:null,props:maybeKey}}exports.Fragment=REACT_FRAGMENT_TYPE,exports.jsx=jsxProd,exports.jsxs=jsxProd},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.js")},"./src/shared/components/button/Button.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{jn:()=>PrimaryButton,tA:()=>SecondaryButton});var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Button_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/button/Button.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Button_module.A,options);const button_Button_module=Button_module.A&&Button_module.A.locals?Button_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const PrimaryButton=props=>{const className=classnames_default()(button_Button_module.primaryButton,props.className);return(0,jsx_runtime.jsx)(Button,{...props,className})},SecondaryButton=props=>(0,jsx_runtime.jsx)(Button,{...props,className:classnames_default()(button_Button_module.secondaryButton,props.className)}),Button=props=>(0,jsx_runtime.jsx)("button",{...props,className:classnames_default()(button_Button_module.button,props.className),children:props.children});try{PrimaryButton.displayName="PrimaryButton",PrimaryButton.__docgenInfo={description:"",displayName:"PrimaryButton",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/button/Button.tsx#PrimaryButton"]={docgenInfo:PrimaryButton.__docgenInfo,name:"PrimaryButton",path:"src/shared/components/button/Button.tsx#PrimaryButton"})}catch(__react_docgen_typescript_loader_error){}try{SecondaryButton.displayName="SecondaryButton",SecondaryButton.__docgenInfo={description:"",displayName:"SecondaryButton",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/button/Button.tsx#SecondaryButton"]={docgenInfo:SecondaryButton.__docgenInfo,name:"SecondaryButton",path:"src/shared/components/button/Button.tsx#SecondaryButton"})}catch(__react_docgen_typescript_loader_error){}try{Button.displayName="Button",Button.__docgenInfo={description:"",displayName:"Button",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/button/Button.tsx#Button"]={docgenInfo:Button.__docgenInfo,name:"Button",path:"src/shared/components/button/Button.tsx#Button"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/close-button/CloseButton.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>close_button_CloseButton});var _circle,classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),react=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const icon_close=props=>react.createElement("svg",_extends({xmlns:"http://www.w3.org/2000/svg",xmlSpace:"preserve",viewBox:"0 0 32 32"},props),_circle||(_circle=react.createElement("circle",{cx:16,cy:16,r:15})),react.createElement("path",{d:"m18.6 16 5.1-5.1c.3-.3.3-.9 0-1.2l-1.4-1.4c-.3-.3-.9-.3-1.2 0L16 13.4l-5.1-5.1c-.3-.3-.9-.3-1.2 0L8.2 9.7c-.3.3-.3.9 0 1.2l5.1 5.1-5.1 5.1c-.3.3-.3.9 0 1.2l1.4 1.4c.3.3.9.3 1.2 0l5.1-5.1 5.1 5.1c.3.3.9.3 1.2 0l1.4-1.4c.3-.3.3-.9 0-1.2z",style:{fill:"#fff"}}));var injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),CloseButton_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/close-button/CloseButton.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(CloseButton_module.A,options);const close_button_CloseButton_module=CloseButton_module.A&&CloseButton_module.A.locals?CloseButton_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const CloseButton=props=>{const className=classnames_default()(close_button_CloseButton_module.closeButton,props.className);return(0,jsx_runtime.jsx)("button",{type:"button",className,onClick:props.onClick,children:(0,jsx_runtime.jsx)(icon_close,{className:close_button_CloseButton_module.icon})})},CloseButtonWithLabel=props=>{const{label="Close",labelPosition="left",onClick,className:classNameFromProps}=props,componentClasses=classNames(styles.closeButtonWithLabel,classNameFromProps),closeIcon=_jsx(CloseIcon,{className:styles.icon}),buttonContent="left"===labelPosition?_jsxs(_Fragment,{children:[_jsx("span",{children:label}),closeIcon]}):_jsxs(_Fragment,{children:[closeIcon,_jsx("span",{children:label})]});return _jsx("button",{type:"button",onClick,className:componentClasses,children:buttonContent})},close_button_CloseButton=CloseButton;try{CloseButtonWithLabel.displayName="CloseButtonWithLabel",CloseButtonWithLabel.__docgenInfo={description:"Design mock-ups are showing a common pattern of a close button\naccompanied by a short label either to the left or to the right of the button.\nBoth the label and the button are clickable.\nThis component captures this simple arrangement.\nFor anything more complicated, please use constituent components separately.",displayName:"CloseButtonWithLabel",props:{onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},labelPosition:{defaultValue:null,description:"",name:"labelPosition",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/close-button/CloseButton.tsx#CloseButtonWithLabel"]={docgenInfo:CloseButtonWithLabel.__docgenInfo,name:"CloseButtonWithLabel",path:"src/shared/components/close-button/CloseButton.tsx#CloseButtonWithLabel"})}catch(__react_docgen_typescript_loader_error){}try{CloseButton.displayName="CloseButton",CloseButton.__docgenInfo={description:"",displayName:"CloseButton",props:{onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/close-button/CloseButton.tsx#CloseButton"]={docgenInfo:CloseButton.__docgenInfo,name:"CloseButton",path:"src/shared/components/close-button/CloseButton.tsx#CloseButton"})}catch(__react_docgen_typescript_loader_error){}},"./stories/shared-components/modal/Modal.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DefaultModalStory:()=>DefaultModalStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Modal_stories});var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),CloseButton=__webpack_require__("./src/shared/components/close-button/CloseButton.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Modal_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/modal/Modal.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Modal_module.A,options);const modal_Modal_module=Modal_module.A&&Modal_module.A.locals?Modal_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const Modal=props=>{const dialogRef=(0,react.useRef)(null),handleClose=()=>{setTimeout((()=>{props.onClose()}),0)},componentClasses=classnames_default()(modal_Modal_module.dialog,props.className);return(0,jsx_runtime.jsx)("dialog",{ref:element=>(element.showModal(),element.addEventListener("cancel",handleClose),element.addEventListener("close",handleClose),dialogRef.current=element,()=>{element.removeEventListener("cancel",handleClose),element.removeEventListener("close",handleClose)}),className:componentClasses,onClick:event=>{event.target===dialogRef.current&&handleClose()},children:(0,jsx_runtime.jsxs)("div",{className:modal_Modal_module.contentWrapper,children:[(0,jsx_runtime.jsx)("div",{className:modal_Modal_module.close,children:(0,jsx_runtime.jsx)(CloseButton.A,{onClick:()=>{dialogRef.current?.close()}})}),props.children]})})},modal_Modal=Modal;try{Modal.displayName="Modal",Modal.__docgenInfo={description:"",displayName:"Modal",props:{onClose:{defaultValue:null,description:"",name:"onClose",required:!0,type:{name:"() => void"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/modal/Modal.tsx#Modal"]={docgenInfo:Modal.__docgenInfo,name:"Modal",path:"src/shared/components/modal/Modal.tsx#Modal"})}catch(__react_docgen_typescript_loader_error){}var Button=__webpack_require__("./src/shared/components/button/Button.tsx");const DefaultModalForStory=()=>{const[isOpen,setIsOpen]=(0,react.useState)(!1),toggleModal=()=>{setIsOpen(!isOpen)};return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Button.jn,{onClick:toggleModal,children:"Show modal"}),isOpen&&(0,jsx_runtime.jsx)(modal_Modal,{onClose:toggleModal,children:"Hello from inside the modal"})]})},DefaultModalStory={name:"default",render:()=>(0,jsx_runtime.jsx)(DefaultModalForStory,{})},Modal_stories={title:"Components/Shared Components/Modal"},__namedExportsOrder=["DefaultModalStory"];DefaultModalStory.parameters={...DefaultModalStory.parameters,docs:{...DefaultModalStory.parameters?.docs,source:{originalSource:"{\n  name: 'default',\n  render: () => <DefaultModalForStory />\n}",...DefaultModalStory.parameters?.docs?.source}}}}}]);