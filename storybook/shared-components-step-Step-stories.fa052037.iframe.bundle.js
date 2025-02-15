/*! For license information please see shared-components-step-Step-stories.fa052037.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[9471],{"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes="",i=0;i<arguments.length;i++){var arg=arguments[i];arg&&(classes=appendClass(classes,parseValue(arg)))}return classes}function parseValue(arg){if("string"==typeof arg||"number"==typeof arg)return arg;if("object"!=typeof arg)return"";if(Array.isArray(arg))return classNames.apply(null,arg);if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]"))return arg.toString();var classes="";for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&(classes=appendClass(classes,key));return classes}function appendClass(value,newClass){return newClass?value?value+" "+newClass:value+newClass:value}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/step/Step.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".wrapper__Step-module__XS4za {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  grid-template-areas: 'icon label';\n  column-gap: 12px;\n  row-gap: 14px;\n}\n\n.wrapperWithChildren__Step-module__VraQv {\n  grid-template-areas:\n        'icon label'\n        '. children';\n}\n\n.stepIcon__Step-module__jAJ3g {\n  grid-area: icon;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  color: var(--color-white);\n  font-weight: var(--font-weight-bold);\n  border-radius: 50%;\n  background-color: var(--color-grey);\n}\n\n.stepLabel__Step-module__cttNx {\n  font-weight: var(--font-weight-bold);\n  color: var(--color-black);\n  padding-top: 5px;\n}\n\n.childrenContainer__Step-module__o1ifb {\n  grid-area: children;\n}\n","",{version:3,sources:["webpack://./src/shared/components/step/Step.module.css"],names:[],mappings:"AAAA;EACE,aAAa;EACb,+BAA+B;EAC/B,iCAAiC;EACjC,gBAAgB;EAChB,aAAa;AACf;;AAEA;EACE;;oBAEkB;AACpB;;AAEA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,WAAW;EACX,YAAY;EACZ,yBAAyB;EACzB,oCAAoC;EACpC,kBAAkB;EAClB,mCAAmC;AACrC;;AAEA;EACE,oCAAoC;EACpC,yBAAyB;EACzB,gBAAgB;AAClB;;AAEA;EACE,mBAAmB;AACrB",sourcesContent:[".wrapper {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  grid-template-areas: 'icon label';\n  column-gap: 12px;\n  row-gap: 14px;\n}\n\n.wrapperWithChildren {\n  grid-template-areas:\n        'icon label'\n        '. children';\n}\n\n.stepIcon {\n  grid-area: icon;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  color: var(--color-white);\n  font-weight: var(--font-weight-bold);\n  border-radius: 50%;\n  background-color: var(--color-grey);\n}\n\n.stepLabel {\n  font-weight: var(--font-weight-bold);\n  color: var(--color-black);\n  padding-top: 5px;\n}\n\n.childrenContainer {\n  grid-area: children;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={wrapper:"wrapper__Step-module__XS4za",wrapperWithChildren:"wrapperWithChildren__Step-module__VraQv",stepIcon:"stepIcon__Step-module__jAJ3g",stepLabel:"stepLabel__Step-module__cttNx",childrenContainer:"childrenContainer__Step-module__o1ifb"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/step/Step.stories.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".stepWrapper__Step-stories-module__bOZwH {\n  margin: 24px 10px;\n}\n\n.multilineStepWrapper__Step-stories-module__LT3y1 {\n  margin: 24px 10px;\n  width: 200px;\n}\n\n.stepWithChildrenWrapper__Step-stories-module__KyvZF {\n  margin: 24px 10px;\n  width: 300px;\n}\n","",{version:3,sources:["webpack://./stories/shared-components/step/Step.stories.module.css"],names:[],mappings:"AAAA;EACE,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,YAAY;AACd;;AAEA;EACE,iBAAiB;EACjB,YAAY;AACd",sourcesContent:[".stepWrapper {\n  margin: 24px 10px;\n}\n\n.multilineStepWrapper {\n  margin: 24px 10px;\n  width: 200px;\n}\n\n.stepWithChildrenWrapper {\n  margin: 24px 10px;\n  width: 300px;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={stepWrapper:"stepWrapper__Step-stories-module__bOZwH",multilineStepWrapper:"multilineStepWrapper__Step-stories-module__LT3y1",stepWithChildrenWrapper:"stepWithChildrenWrapper__Step-stories-module__KyvZF"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.js":(__unused_webpack_module,exports)=>{"use strict";var REACT_ELEMENT_TYPE=Symbol.for("react.transitional.element"),REACT_FRAGMENT_TYPE=Symbol.for("react.fragment");function jsxProd(type,config,maybeKey){var key=null;if(void 0!==maybeKey&&(key=""+maybeKey),void 0!==config.key&&(key=""+config.key),"key"in config)for(var propName in maybeKey={},config)"key"!==propName&&(maybeKey[propName]=config[propName]);else maybeKey=config;return config=maybeKey.ref,{$$typeof:REACT_ELEMENT_TYPE,type,key,ref:void 0!==config?config:null,props:maybeKey}}exports.Fragment=REACT_FRAGMENT_TYPE,exports.jsx=jsxProd,exports.jsxs=jsxProd},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.js")},"./stories/shared-components/step/Step.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{MultilineStepStory:()=>MultilineStepStory,StepStory:()=>StepStory,StepWithChildrenStory:()=>StepWithChildrenStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Step_stories});var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Step_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/step/Step.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Step_module.A,options);const step_Step_module=Step_module.A&&Step_module.A.locals?Step_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const Step=props=>{const wrapperClassname=classnames_default()(step_Step_module.wrapper,{[step_Step_module.wrapperWithChildren]:props.children});return(0,jsx_runtime.jsxs)("div",{className:wrapperClassname,children:[(0,jsx_runtime.jsx)("div",{className:step_Step_module.stepIcon,children:(0,jsx_runtime.jsx)("span",{children:props.count})}),(0,jsx_runtime.jsx)("div",{className:step_Step_module.stepLabel,children:props.label}),props.children&&(0,jsx_runtime.jsx)("div",{className:step_Step_module.childrenContainer,children:props.children})]})};try{Step.displayName="Step",Step.__docgenInfo={description:"",displayName:"Step",props:{count:{defaultValue:null,description:"",name:"count",required:!0,type:{name:"number"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/step/Step.tsx#Step"]={docgenInfo:Step.__docgenInfo,name:"Step",path:"src/shared/components/step/Step.tsx#Step"})}catch(__react_docgen_typescript_loader_error){}var Step_stories_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/step/Step.stories.module.css"),Step_stories_module_options={};Step_stories_module_options.styleTagTransform=styleTagTransform_default(),Step_stories_module_options.setAttributes=setAttributesWithoutAttributes_default(),Step_stories_module_options.insert=insertBySelector_default().bind(null,"head"),Step_stories_module_options.domAPI=styleDomAPI_default(),Step_stories_module_options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Step_stories_module.A,Step_stories_module_options);const step_Step_stories_module=Step_stories_module.A&&Step_stories_module.A.locals?Step_stories_module.A.locals:void 0,steps=["Go to BurgerKing","Order a burger of your choice","Eat happily"],StepStory=()=>(0,jsx_runtime.jsx)("div",{children:steps.map(((step,index)=>(0,jsx_runtime.jsx)("div",{className:step_Step_stories_module.stepWrapper,children:(0,jsx_runtime.jsx)(Step,{count:index,label:step})},index)))});StepStory.storyName="default";const MultilineStepStory=()=>(0,jsx_runtime.jsx)("div",{className:step_Step_stories_module.multilineStepWrapper,children:(0,jsx_runtime.jsx)(Step,{count:1,label:"\n    This is going to be a long label that should wrap over several lines.\n  "})});MultilineStepStory.storyName="multiline";const StepWithChildrenStory=()=>{const childElement=(0,jsx_runtime.jsx)("div",{children:"\n    Hey, look at me! I have been passed to the Step component,\n    and this is where I am getting rendered. Ain't I pretty?\n  "});return(0,jsx_runtime.jsx)("div",{className:step_Step_stories_module.multilineStepWrapper,children:(0,jsx_runtime.jsx)(Step,{count:1,label:"There’s more to see below me",children:childElement})})};StepWithChildrenStory.storyName="with children";const Step_stories={title:"Components/Shared Components/Step"},__namedExportsOrder=["StepStory","MultilineStepStory","StepWithChildrenStory"];StepStory.parameters={...StepStory.parameters,docs:{...StepStory.parameters?.docs,source:{originalSource:"() => {\n  return <div>\n      {steps.map((step, index) => {\n      return <div key={index} className={styles.stepWrapper}>\n            <Step count={index} label={step} />\n          </div>;\n    })}\n    </div>;\n}",...StepStory.parameters?.docs?.source}}},MultilineStepStory.parameters={...MultilineStepStory.parameters,docs:{...MultilineStepStory.parameters?.docs,source:{originalSource:"() => {\n  const label = `\n    This is going to be a long label that should wrap over several lines.\n  `;\n  return <div className={styles.multilineStepWrapper}>\n      <Step count={1} label={label} />\n    </div>;\n}",...MultilineStepStory.parameters?.docs?.source}}},StepWithChildrenStory.parameters={...StepWithChildrenStory.parameters,docs:{...StepWithChildrenStory.parameters?.docs,source:{originalSource:"() => {\n  const label = 'There’s more to see below me';\n  const longChildText = `\n    Hey, look at me! I have been passed to the Step component,\n    and this is where I am getting rendered. Ain't I pretty?\n  `;\n  const childElement = <div>{longChildText}</div>;\n  return <div className={styles.multilineStepWrapper}>\n      <Step count={1} label={label}>\n        {childElement}\n      </Step>\n    </div>;\n}",...StepWithChildrenStory.parameters?.docs?.source}}}}}]);