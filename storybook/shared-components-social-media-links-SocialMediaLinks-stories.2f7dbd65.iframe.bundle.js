/*! For license information please see shared-components-social-media-links-SocialMediaLinks-stories.2f7dbd65.iframe.bundle.js.LICENSE.txt */
(globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[]).push([[6119],{"./node_modules/classnames/index.js":(module,exports)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var hasOwn={}.hasOwnProperty;function classNames(){for(var classes="",i=0;i<arguments.length;i++){var arg=arguments[i];arg&&(classes=appendClass(classes,parseValue(arg)))}return classes}function parseValue(arg){if("string"==typeof arg||"number"==typeof arg)return arg;if("object"!=typeof arg)return"";if(Array.isArray(arg))return classNames.apply(null,arg);if(arg.toString!==Object.prototype.toString&&!arg.toString.toString().includes("[native code]"))return arg.toString();var classes="";for(var key in arg)hasOwn.call(arg,key)&&arg[key]&&(classes=appendClass(classes,key));return classes}function appendClass(value,newClass){return newClass?value?value+" "+newClass:value+newClass:value}module.exports?(classNames.default=classNames,module.exports=classNames):void 0===(__WEBPACK_AMD_DEFINE_RESULT__=function(){return classNames}.apply(exports,[]))||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/social-media-links/SocialMediaLinks.module.css":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,'/* \n  To style individual icons, use the following selectors:\n  - [data-part="blog-icon"] for the blog icon\n  - [data-part="facebook-icon"] for Facebook icon\n  - [data-part="twitter-icon"] for Twitter/X icon\n */\n\n@layer components {\n  .container__SocialMediaLinks-module__cJ_5D {\n    display: inline-grid;\n    grid-template-columns: repeat(3, auto);\n    column-gap: 24px;\n  }\n  \n  .blog__SocialMediaLinks-module__OpCz6 {\n    display: inline-flex;\n    align-items: center;\n    gap: 16px;\n    white-space: nowrap;\n  }\n  \n  .mediaIcon__SocialMediaLinks-module___2bHR {\n    height: 24px;\n  }\n\n  .mediaIcon__SocialMediaLinks-module___2bHR[data-part="twitter-icon"] {\n    height: 22px;\n  }\n}\n',"",{version:3,sources:["webpack://./src/shared/components/social-media-links/SocialMediaLinks.module.css"],names:[],mappings:"AAAA;;;;;EAKE;;AAEF;EACE;IACE,oBAAoB;IACpB,sCAAsC;IACtC,gBAAgB;EAClB;;EAEA;IACE,oBAAoB;IACpB,mBAAmB;IACnB,SAAS;IACT,mBAAmB;EACrB;;EAEA;IACE,YAAY;EACd;;EAEA;IACE,YAAY;EACd;AACF",sourcesContent:['/* \n  To style individual icons, use the following selectors:\n  - [data-part="blog-icon"] for the blog icon\n  - [data-part="facebook-icon"] for Facebook icon\n  - [data-part="twitter-icon"] for Twitter/X icon\n */\n\n@layer components {\n  .container {\n    display: inline-grid;\n    grid-template-columns: repeat(3, auto);\n    column-gap: 24px;\n  }\n  \n  .blog {\n    display: inline-flex;\n    align-items: center;\n    gap: 16px;\n    white-space: nowrap;\n  }\n  \n  .mediaIcon {\n    height: 24px;\n  }\n\n  .mediaIcon[data-part="twitter-icon"] {\n    height: 22px;\n  }\n}\n'],sourceRoot:""}]),___CSS_LOADER_EXPORT___.locals={container:"container__SocialMediaLinks-module__cJ_5D",blog:"blog__SocialMediaLinks-module__OpCz6",mediaIcon:"mediaIcon__SocialMediaLinks-module___2bHR"};const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/react/cjs/react-jsx-runtime.production.js":(__unused_webpack_module,exports)=>{"use strict";var REACT_ELEMENT_TYPE=Symbol.for("react.transitional.element"),REACT_FRAGMENT_TYPE=Symbol.for("react.fragment");function jsxProd(type,config,maybeKey){var key=null;if(void 0!==maybeKey&&(key=""+maybeKey),void 0!==config.key&&(key=""+config.key),"key"in config)for(var propName in maybeKey={},config)"key"!==propName&&(maybeKey[propName]=config[propName]);else maybeKey=config;return config=maybeKey.ref,{$$typeof:REACT_ELEMENT_TYPE,type,key,ref:void 0!==config?config:null,props:maybeKey}}exports.Fragment=REACT_FRAGMENT_TYPE,exports.jsx=jsxProd,exports.jsxs=jsxProd},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.js")},"./static/icons/icon_blog.svg?url":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__.p+"e6d396e4e62145202ae9.svg?url"},"./static/icons/icon_facebook.svg?url":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__.p+"b9df790fef5cc1a653cd.svg?url"},"./static/icons/icon_twitter.svg?url":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__.p+"5a83d64212f3fd7c7cd7.svg?url"},"./stories/shared-components/social-media-links/SocialMediaLinks.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DefaultSocialMediaLinksStory:()=>DefaultSocialMediaLinksStory,__namedExportsOrder:()=>__namedExportsOrder,default:()=>SocialMediaLinks_stories});var classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),icon_facebookurl=__webpack_require__("./static/icons/icon_facebook.svg?url"),icon_twitterurl=__webpack_require__("./static/icons/icon_twitter.svg?url"),icon_blogurl=__webpack_require__("./static/icons/icon_blog.svg?url"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),SocialMediaLinks_module=__webpack_require__("./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[13].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[13].use[2]!./src/shared/components/social-media-links/SocialMediaLinks.module.css"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(SocialMediaLinks_module.A,options);const social_media_links_SocialMediaLinks_module=SocialMediaLinks_module.A&&SocialMediaLinks_module.A.locals?SocialMediaLinks_module.A.locals:void 0;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const SocialMediaLinks=props=>{const componentStyles=classnames_default()(social_media_links_SocialMediaLinks_module.container,props.className);return(0,jsx_runtime.jsxs)("div",{className:componentStyles,children:[(0,jsx_runtime.jsxs)("a",{className:social_media_links_SocialMediaLinks_module.blog,href:"https://www.ensembl.info",target:"_blank",rel:"noopener noreferrer",children:[(0,jsx_runtime.jsx)("span",{children:"Ensembl blog"}),(0,jsx_runtime.jsx)("img",{"data-part":"blog-icon",src:icon_blogurl,className:social_media_links_SocialMediaLinks_module.mediaIcon,alt:""})]}),(0,jsx_runtime.jsx)("a",{href:"https://www.facebook.com/Ensembl.org",target:"_blank",rel:"noopener noreferrer",children:(0,jsx_runtime.jsx)("img",{"data-part":"facebook-icon",src:icon_facebookurl,className:social_media_links_SocialMediaLinks_module.mediaIcon,alt:"Ensembl profile on Facebook"})}),(0,jsx_runtime.jsx)("a",{href:"https://x.com/ensembl",target:"_blank",rel:"noopener noreferrer",children:(0,jsx_runtime.jsx)("img",{"data-part":"twitter-icon",src:icon_twitterurl,className:social_media_links_SocialMediaLinks_module.mediaIcon,alt:"Ensembl profile on X"})})]})},social_media_links_SocialMediaLinks=SocialMediaLinks;try{SocialMediaLinks.displayName="SocialMediaLinks",SocialMediaLinks.__docgenInfo={description:"",displayName:"SocialMediaLinks",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/shared/components/social-media-links/SocialMediaLinks.tsx#SocialMediaLinks"]={docgenInfo:SocialMediaLinks.__docgenInfo,name:"SocialMediaLinks",path:"src/shared/components/social-media-links/SocialMediaLinks.tsx#SocialMediaLinks"})}catch(__react_docgen_typescript_loader_error){}const SocialMediaLinks_stories={title:"Components/Shared Components/SocialMediaLinks"},DefaultSocialMediaLinksStory={name:"default",render:()=>(0,jsx_runtime.jsx)("div",{children:(0,jsx_runtime.jsx)(social_media_links_SocialMediaLinks,{})})},__namedExportsOrder=["DefaultSocialMediaLinksStory"];DefaultSocialMediaLinksStory.parameters={...DefaultSocialMediaLinksStory.parameters,docs:{...DefaultSocialMediaLinksStory.parameters?.docs,source:{originalSource:"{\n  name: 'default',\n  render: () => <div>\n      <SocialMediaLinks />\n    </div>\n}",...DefaultSocialMediaLinksStory.parameters?.docs?.source}}}}}]);