"use strict";(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[6323],{"./stories/shared-components/tabs/Tabs.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DefaultTabsStory:()=>DefaultTabsStory,EntityViewerTabsStory:()=>EntityViewerTabsStory,PanelHeaderTabsStory:()=>PanelHeaderTabsStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Tabs_stories});__webpack_require__("./node_modules/core-js/modules/es.error.cause.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.push.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js");var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),Tabs=__webpack_require__("./src/shared/components/tabs/Tabs.tsx"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Tabs_stories_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/tabs/Tabs.stories.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Tabs_stories_module.A,options);const tabs_Tabs_stories_module=Tabs_stories_module.A&&Tabs_stories_module.A.locals?Tabs_stories_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _defineProperty(obj,key,value){return(key=function _toPropertyKey(t){var i=function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(t)}(t,"string");return"symbol"==typeof i?i:i+""}(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}var tabsData=[{title:"Proteins"},{title:"Variants"},{title:"Phenotypes"},{title:"Gene expression"},{title:"Gene ontology",isDisabled:!0},{title:"Gene pathways"}],Wrapper=props=>{var[selectedTab,setselectedTab]=(0,react.useState)("Proteins");return(0,jsx_runtime.jsx)(Tabs.A,_objectSpread(_objectSpread({},props),{},{tabs:tabsData,selectedTab,onTabChange:tab=>{setselectedTab(tab),props.onTabChange(tab)}}))},DefaultTabsStory=args=>(0,jsx_runtime.jsx)("div",{className:tabs_Tabs_stories_module.fullPageWrapper,children:(0,jsx_runtime.jsx)(Wrapper,_objectSpread({},args))});DefaultTabsStory.storyName="default";var PanelHeaderTabsStory=args=>{var tabClassNames={default:tabs_Tabs_stories_module.defaultTabPanel,selected:tabs_Tabs_stories_module.selectedTabPanel,disabled:tabs_Tabs_stories_module.disabledTabPanel,tabsContainer:tabs_Tabs_stories_module.panelTabsContainer};return(0,jsx_runtime.jsx)("div",{className:tabs_Tabs_stories_module.fullPageWrapper,children:(0,jsx_runtime.jsx)(Wrapper,_objectSpread({classNames:tabClassNames},args))})};PanelHeaderTabsStory.storyName="panel-header style";var EntityViewerTabsStory=args=>{var tabClassNames={default:tabs_Tabs_stories_module.defaultTabDark,selected:tabs_Tabs_stories_module.selectedTabDark,disabled:tabs_Tabs_stories_module.disabledTabDark},wrapperClassNames=classnames_default()(tabs_Tabs_stories_module.fullPageWrapper,tabs_Tabs_stories_module.fullPageWrapperDark);return(0,jsx_runtime.jsx)("div",{className:wrapperClassNames,children:(0,jsx_runtime.jsx)(Wrapper,_objectSpread({classNames:tabClassNames},args))})};EntityViewerTabsStory.storyName="entity-viewer style";const Tabs_stories={title:"Components/Shared Components/Tabs",argTypes:{onTabChange:{action:"tab changed"}}};DefaultTabsStory.parameters={...DefaultTabsStory.parameters,docs:{...DefaultTabsStory.parameters?.docs,source:{originalSource:"(args: DefaultArgs) => <div className={styles.fullPageWrapper}>{<Wrapper {...args} />}</div>",...DefaultTabsStory.parameters?.docs?.source}}},PanelHeaderTabsStory.parameters={...PanelHeaderTabsStory.parameters,docs:{...PanelHeaderTabsStory.parameters?.docs,source:{originalSource:"(args: DefaultArgs) => {\n  const tabClassNames = {\n    default: styles.defaultTabPanel,\n    selected: styles.selectedTabPanel,\n    disabled: styles.disabledTabPanel,\n    tabsContainer: styles.panelTabsContainer\n  };\n  return <div className={styles.fullPageWrapper}>\n      {<Wrapper classNames={tabClassNames} {...args} />}\n    </div>;\n}",...PanelHeaderTabsStory.parameters?.docs?.source}}},EntityViewerTabsStory.parameters={...EntityViewerTabsStory.parameters,docs:{...EntityViewerTabsStory.parameters?.docs,source:{originalSource:"(args: DefaultArgs) => {\n  const tabClassNames = {\n    default: styles.defaultTabDark,\n    selected: styles.selectedTabDark,\n    disabled: styles.disabledTabDark\n  };\n  const wrapperClassNames = classNames(styles.fullPageWrapper, styles.fullPageWrapperDark);\n  return <div className={wrapperClassNames}>\n      {<Wrapper classNames={tabClassNames} {...args} />}\n    </div>;\n}",...EntityViewerTabsStory.parameters?.docs?.source}}};const __namedExportsOrder=["DefaultTabsStory","PanelHeaderTabsStory","EntityViewerTabsStory"];try{DefaultTabsStory.displayName="DefaultTabsStory",DefaultTabsStory.__docgenInfo={description:"",displayName:"DefaultTabsStory",props:{onTabChange:{defaultValue:null,description:"",name:"onTabChange",required:!0,type:{name:"(...args: any) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["stories/shared-components/tabs/Tabs.stories.tsx#DefaultTabsStory"]={docgenInfo:DefaultTabsStory.__docgenInfo,name:"DefaultTabsStory",path:"stories/shared-components/tabs/Tabs.stories.tsx#DefaultTabsStory"})}catch(__react_docgen_typescript_loader_error){}try{PanelHeaderTabsStory.displayName="PanelHeaderTabsStory",PanelHeaderTabsStory.__docgenInfo={description:"",displayName:"PanelHeaderTabsStory",props:{onTabChange:{defaultValue:null,description:"",name:"onTabChange",required:!0,type:{name:"(...args: any) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["stories/shared-components/tabs/Tabs.stories.tsx#PanelHeaderTabsStory"]={docgenInfo:PanelHeaderTabsStory.__docgenInfo,name:"PanelHeaderTabsStory",path:"stories/shared-components/tabs/Tabs.stories.tsx#PanelHeaderTabsStory"})}catch(__react_docgen_typescript_loader_error){}try{EntityViewerTabsStory.displayName="EntityViewerTabsStory",EntityViewerTabsStory.__docgenInfo={description:"",displayName:"EntityViewerTabsStory",props:{onTabChange:{defaultValue:null,description:"",name:"onTabChange",required:!0,type:{name:"(...args: any) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["stories/shared-components/tabs/Tabs.stories.tsx#EntityViewerTabsStory"]={docgenInfo:EntityViewerTabsStory.__docgenInfo,name:"EntityViewerTabsStory",path:"stories/shared-components/tabs/Tabs.stories.tsx#EntityViewerTabsStory"})}catch(__react_docgen_typescript_loader_error){}},"./src/shared/components/tabs/Tabs.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>tabs_Tabs});var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),noop=__webpack_require__("./node_modules/lodash/noop.js"),noop_default=__webpack_require__.n(noop),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),Tabs_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/tabs/Tabs.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(Tabs_module.A,options);const tabs_Tabs_module=Tabs_module.A&&Tabs_module.A.locals?Tabs_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),Tabs=props=>{var _props$classNames4,getTabClassNames=tab=>{var _props$classNames,_props$classNames2,_props$classNames3,defaultClassNames=classnames_default()(tabs_Tabs_module.tab,null===(_props$classNames=props.classNames)||void 0===_props$classNames?void 0:_props$classNames.default),disabledClassNames=classnames_default()(tabs_Tabs_module.disabled,null===(_props$classNames2=props.classNames)||void 0===_props$classNames2?void 0:_props$classNames2.disabled),selectedClassNames=classnames_default()(tabs_Tabs_module.selected,null===(_props$classNames3=props.classNames)||void 0===_props$classNames3?void 0:_props$classNames3.selected);return classnames_default()(defaultClassNames,{[disabledClassNames]:tab.isDisabled,[selectedClassNames]:!tab.isDisabled&&tab.title===props.selectedTab})},tabsContainerClassName=classnames_default()(tabs_Tabs_module.tabsContainer,null===(_props$classNames4=props.classNames)||void 0===_props$classNames4?void 0:_props$classNames4.tabsContainer);return(0,jsx_runtime.jsx)("div",{className:tabsContainerClassName,children:Object.values(props.tabs).map((tab=>(0,jsx_runtime.jsx)("span",{className:getTabClassNames(tab),onClick:tab.isDisabled?noop_default():()=>{return tabTitle=tab.title,void props.onTabChange(tabTitle);var tabTitle},children:tab.title},tab.title)))})};const tabs_Tabs=Tabs;try{Tabs.displayName="Tabs",Tabs.__docgenInfo={description:"",displayName:"Tabs",props:{tabs:{defaultValue:null,description:"",name:"tabs",required:!0,type:{name:"Tab[]"}},classNames:{defaultValue:null,description:"",name:"classNames",required:!1,type:{name:"{ default?: string; disabled?: string; selected?: string | undefined; tabsContainer?: string | undefined; } | undefined"}},selectedTab:{defaultValue:null,description:"",name:"selectedTab",required:!0,type:{name:"string | null"}},onTabChange:{defaultValue:null,description:"",name:"onTabChange",required:!0,type:{name:"(selectedTab: string) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/tabs/Tabs.tsx#Tabs"]={docgenInfo:Tabs.__docgenInfo,name:"Tabs",path:"src/shared/components/tabs/Tabs.tsx#Tabs"})}catch(__react_docgen_typescript_loader_error){}},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/tabs/Tabs.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".tabsContainer__Tabs-module__s7VN_ {\n  display: flex;\n  overflow-y: hidden;\n  height: 40px;\n  scrollbar-width: none;\n}\n\n.tab__Tabs-module__DEw_c {\n  padding: 3px 18px;\n  color: var(--color-blue);\n  cursor: pointer;\n  margin-right: 3px;\n  white-space: nowrap;\n}\n\n.disabled__Tabs-module__XuuRy {\n  color: var(--color-medium-dark-grey);\n  cursor: default;\n}\n\n.selected__Tabs-module__hgUUt {\n  color: var(--color-black);\n  position: relative;\n  cursor: default;\n}\n","",{version:3,sources:["webpack://./src/shared/components/tabs/Tabs.module.css"],names:[],mappings:"AAAA;EACE,aAAa;EACb,kBAAkB;EAClB,YAAY;EACZ,qBAAqB;AACvB;;AAEA;EACE,iBAAiB;EACjB,wBAAwB;EACxB,eAAe;EACf,iBAAiB;EACjB,mBAAmB;AACrB;;AAEA;EACE,oCAAoC;EACpC,eAAe;AACjB;;AAEA;EACE,yBAAyB;EACzB,kBAAkB;EAClB,eAAe;AACjB",sourcesContent:[".tabsContainer {\n  display: flex;\n  overflow-y: hidden;\n  height: 40px;\n  scrollbar-width: none;\n}\n\n.tab {\n  padding: 3px 18px;\n  color: var(--color-blue);\n  cursor: pointer;\n  margin-right: 3px;\n  white-space: nowrap;\n}\n\n.disabled {\n  color: var(--color-medium-dark-grey);\n  cursor: default;\n}\n\n.selected {\n  color: var(--color-black);\n  position: relative;\n  cursor: default;\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={tabsContainer:"tabsContainer__Tabs-module__s7VN_",tab:"tab__Tabs-module__DEw_c",disabled:"disabled__Tabs-module__XuuRy",selected:"selected__Tabs-module__hgUUt"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./stories/shared-components/tabs/Tabs.stories.module.css":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".fullPageWrapper__Tabs-stories-module__rixij {\n  display: flex;\n  padding: 20px;\n  align-items: flex-start;\n  height: 100vh;\n}\n\n.fullPageWrapperDark__Tabs-stories-module__u_8el {\n  background-color: var(--color-black);\n}\n\n.defaultTabDark__Tabs-stories-module__bRSTT {\n  background-color: #33adff;\n  color: #fff;\n  font-weight: 700;\n  border-radius: 3px;\n  margin-right: 3px;\n  height: 30px;\n}\n\n.disabledTabDark__Tabs-stories-module__nvIFf {\n  background-color: var(--color-grey);\n}\n\n.selectedTabDark__Tabs-stories-module__c7_qa {\n  background-color: transparent;\n  border: 1px solid var(--color-blue);\n}\n\n.selectedTabDark__Tabs-stories-module__c7_qa::after {\n  content: '';\n  width: 12px;\n  height: 12px;\n  background-color: var(--color-black);\n  border: 1px solid var(--color-blue);\n  border-color: transparent transparent var(--color-blue) var(--color-blue);\n  box-shadow: none;\n  box-sizing: border-box;\n  position: absolute;\n  left: calc(50% - 8px);\n  transform-origin: 0 0;\n  transform: rotate(-45deg);\n  top: 28px;\n}\n\n.defaultTabPanel__Tabs-stories-module__TQZzb {\n  background-color: transparent;\n  color: var(--color-blue);\n  font-weight: 700;\n  border-radius: 3px;\n  margin-right: 3px;\n  height: 30px;\n  border: none;\n}\n\n.disabledTabPanel__Tabs-stories-module__D2EOs {\n  color: var(--color-grey);\n}\n\n.selectedTabPanel__Tabs-stories-module__s80Rv {\n  background-color: transparent;\n  color: var(--color-black);\n}\n\n.selectedTabPanel__Tabs-stories-module__s80Rv::after {\n  content: '';\n  border: 6px solid var(--color-grey);\n  border-color: transparent transparent var(--color-light-grey) var(--color-light-grey);\n  box-shadow: -2px 2px 2px 0 var(--color-medium-light-grey);\n\n  width: 0;\n  height: 0;\n  box-sizing: border-box;\n  position: absolute;\n  left: calc(50% - 8px);\n  transform-origin: 0 0;\n  transform: rotate(-45deg);\n  top: 28px;\n}\n\n.panelTabsContainer__Tabs-stories-module__ZlhPI {\n  height: auto;\n  overflow: unset;\n  background-color: var(--color-light-grey);\n  box-shadow: 0 2px 2px 0 var(--color-medium-light-grey);\n}\n","",{version:3,sources:["webpack://./stories/shared-components/tabs/Tabs.stories.module.css"],names:[],mappings:"AAAA;EACE,aAAa;EACb,aAAa;EACb,uBAAuB;EACvB,aAAa;AACf;;AAEA;EACE,oCAAoC;AACtC;;AAEA;EACE,yBAAyB;EACzB,WAAW;EACX,gBAAgB;EAChB,kBAAkB;EAClB,iBAAiB;EACjB,YAAY;AACd;;AAEA;EACE,mCAAmC;AACrC;;AAEA;EACE,6BAA6B;EAC7B,mCAAmC;AACrC;;AAEA;EACE,WAAW;EACX,WAAW;EACX,YAAY;EACZ,oCAAoC;EACpC,mCAAmC;EACnC,yEAAyE;EACzE,gBAAgB;EAChB,sBAAsB;EACtB,kBAAkB;EAClB,qBAAqB;EACrB,qBAAqB;EACrB,yBAAyB;EACzB,SAAS;AACX;;AAEA;EACE,6BAA6B;EAC7B,wBAAwB;EACxB,gBAAgB;EAChB,kBAAkB;EAClB,iBAAiB;EACjB,YAAY;EACZ,YAAY;AACd;;AAEA;EACE,wBAAwB;AAC1B;;AAEA;EACE,6BAA6B;EAC7B,yBAAyB;AAC3B;;AAEA;EACE,WAAW;EACX,mCAAmC;EACnC,qFAAqF;EACrF,yDAAyD;;EAEzD,QAAQ;EACR,SAAS;EACT,sBAAsB;EACtB,kBAAkB;EAClB,qBAAqB;EACrB,qBAAqB;EACrB,yBAAyB;EACzB,SAAS;AACX;;AAEA;EACE,YAAY;EACZ,eAAe;EACf,yCAAyC;EACzC,sDAAsD;AACxD",sourcesContent:[".fullPageWrapper {\n  display: flex;\n  padding: 20px;\n  align-items: flex-start;\n  height: 100vh;\n}\n\n.fullPageWrapperDark {\n  background-color: var(--color-black);\n}\n\n.defaultTabDark {\n  background-color: #33adff;\n  color: #fff;\n  font-weight: 700;\n  border-radius: 3px;\n  margin-right: 3px;\n  height: 30px;\n}\n\n.disabledTabDark {\n  background-color: var(--color-grey);\n}\n\n.selectedTabDark {\n  background-color: transparent;\n  border: 1px solid var(--color-blue);\n}\n\n.selectedTabDark::after {\n  content: '';\n  width: 12px;\n  height: 12px;\n  background-color: var(--color-black);\n  border: 1px solid var(--color-blue);\n  border-color: transparent transparent var(--color-blue) var(--color-blue);\n  box-shadow: none;\n  box-sizing: border-box;\n  position: absolute;\n  left: calc(50% - 8px);\n  transform-origin: 0 0;\n  transform: rotate(-45deg);\n  top: 28px;\n}\n\n.defaultTabPanel {\n  background-color: transparent;\n  color: var(--color-blue);\n  font-weight: 700;\n  border-radius: 3px;\n  margin-right: 3px;\n  height: 30px;\n  border: none;\n}\n\n.disabledTabPanel {\n  color: var(--color-grey);\n}\n\n.selectedTabPanel {\n  background-color: transparent;\n  color: var(--color-black);\n}\n\n.selectedTabPanel::after {\n  content: '';\n  border: 6px solid var(--color-grey);\n  border-color: transparent transparent var(--color-light-grey) var(--color-light-grey);\n  box-shadow: -2px 2px 2px 0 var(--color-medium-light-grey);\n\n  width: 0;\n  height: 0;\n  box-sizing: border-box;\n  position: absolute;\n  left: calc(50% - 8px);\n  transform-origin: 0 0;\n  transform: rotate(-45deg);\n  top: 28px;\n}\n\n.panelTabsContainer {\n  height: auto;\n  overflow: unset;\n  background-color: var(--color-light-grey);\n  box-shadow: 0 2px 2px 0 var(--color-medium-light-grey);\n}\n"],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={fullPageWrapper:"fullPageWrapper__Tabs-stories-module__rixij",fullPageWrapperDark:"fullPageWrapperDark__Tabs-stories-module__u_8el",defaultTabDark:"defaultTabDark__Tabs-stories-module__bRSTT",disabledTabDark:"disabledTabDark__Tabs-stories-module__nvIFf",selectedTabDark:"selectedTabDark__Tabs-stories-module__c7_qa",defaultTabPanel:"defaultTabPanel__Tabs-stories-module__TQZzb",disabledTabPanel:"disabledTabPanel__Tabs-stories-module__D2EOs",selectedTabPanel:"selectedTabPanel__Tabs-stories-module__s80Rv",panelTabsContainer:"panelTabsContainer__Tabs-stories-module__ZlhPI"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);