(()=>{"use strict";var deferred,next,__webpack_modules__={"./src/shared/workers/feature-sequence-download/featureSequenceDownload.worker.ts":(__unused_webpack_module,__unused_webpack___webpack_exports__,__webpack_require__)=>{var comlink=__webpack_require__("./node_modules/comlink/dist/esm/comlink.mjs");const LINE_LENGTH=60,toFasta=(sequence,options={})=>{const{header,value:rawSequence}=sequence,{lineLength=LINE_LENGTH}=options,formattedSequence=[];header&&formattedSequence.push(`>${header}`);let row="";for(let i=0;i<rawSequence.length;i++){row+=rawSequence[i];const isAtEndOfLine=(i+1)%lineLength==0;(i===rawSequence.length-1||isAtEndOfLine)&&(formattedSequence.push(row),row="")}return formattedSequence.join("\n")};__webpack_require__("./node_modules/core-js/modules/es.iterator.constructor.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.find.js");var esm=__webpack_require__("./node_modules/graphql-request/build/esm/index.js");const defaultEnvironment={buildEnvironment:"production",deploymentEnvironment:"development"},readEnvironment=()=>isClient()?window.__CONFIG__?.environment??defaultEnvironment:{buildEnvironment:globalThis.process?.env.NODE_ENV??"production",deploymentEnvironment:globalThis.process?.env.ENVIRONMENT??"development"},isClient=()=>"object"==typeof window,defaultApiUrls={coreApiUrl:"/api/graphql/core",metadataApiBaseUrl:"/api/metadata",comparaApiBaseUrl:"/api/graphql/compara",docsBaseUrl:"/api/docs",genomeBrowserBackendBaseUrl:"/api/browser/data",refgetBaseUrl:"/api/refget",tracksApiBaseUrl:"/api/tracks",toolsApiBaseUrl:"/api/tools",searchApiBaseUrl:"/api/search",variationApiUrl:"/api/graphql/variation",regulationApiBaseUrl:"https://dev-2020.ensembl.org/api/regulation"},defaultKeys={googleAnalyticsKey:""},buildEnvironment=readEnvironment().buildEnvironment,config={app_version:"0.4.0",isDevelopment:"development"===buildEnvironment,isProduction:"development"!==buildEnvironment,shouldReportAnalytics:isClient()&&window.__CONFIG__?.environment.shouldReportAnalytics,shouldReportErrors:isClient()&&window.__CONFIG__?.environment.shouldReportErrors,apiHost:"",...isClient()?window.__CONFIG__?.apiPaths??defaultApiUrls:{coreApiUrl:globalThis.process?.env.SSR_CORE_API_BASE_URL??`http://localhost:8080${defaultApiUrls.coreApiUrl}`,docsBaseUrl:globalThis.process?.env.SSR_DOCS_BASE_URL??`http://localhost:8080${defaultApiUrls.docsBaseUrl}`,variationApiUrl:globalThis.process?.env.SSR_VARIATION_GRAPHQL_API_URL??`http://localhost:8080${defaultApiUrls.variationApiUrl}`,metadataApiBaseUrl:globalThis.process?.env.SSR_METADATA_API_URL??`http://localhost:8080${defaultApiUrls.metadataApiBaseUrl}`,regulationApiBaseUrl:defaultApiUrls.regulationApiBaseUrl,comparaApiBaseUrl:defaultApiUrls.comparaApiBaseUrl,genomeBrowserBackendBaseUrl:defaultApiUrls.genomeBrowserBackendBaseUrl,refgetBaseUrl:defaultApiUrls.refgetBaseUrl,tracksApiBaseUrl:defaultApiUrls.tracksApiBaseUrl,toolsApiBaseUrl:defaultApiUrls.toolsApiBaseUrl,searchApiBaseUrl:defaultApiUrls.searchApiBaseUrl},...isClient()&&window.__CONFIG__?.keys||defaultKeys},refget=params=>{const{checksum,start,end}=params,searchParams=new URLSearchParams;if("number"==typeof start){const refgetStart=start-1;searchParams.append("start",`${refgetStart}`)}return"number"==typeof end&&searchParams.append("end",`${end}`),searchParams.append("accept","text/plain"),`${config.refgetBaseUrl}/sequence/${checksum}?${searchParams.toString()}`};__webpack_require__("./node_modules/core-js/modules/es.iterator.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.iterator.map.js");const forwardToReverseStrandMap=new Map;"ACGTURYWSMKBDHVNXacgturywsmkbdhvnx".split("").forEach(((character,index)=>{forwardToReverseStrandMap.set(character,"TGCAAYRWSKMVHDBNXtgcaayrwskmvhdbnx"[index])}));const getReverseComplement=sequence=>sequence.split("").map((character=>forwardToReverseStrandMap.get(character))).reverse().join(""),geneAndTranscriptsFragment=esm.J1`
  fragment GeneAndTranscripts on Gene {
    stable_id
    slice {
      location {
        start
        end
      }
      region {
        sequence {
          checksum
        }
      }
      strand {
        code
      }
    }
    transcripts {
      stable_id
      relative_location {
        start
        end
      }
      spliced_exons {
        index
        relative_location {
          start
          end
        }
        exon {
          stable_id
        }
      }
      product_generating_contexts {
        cds {
          sequence {
            checksum
          }
        }
        cdna {
          sequence {
            checksum
          }
        }
        product {
          stable_id
          sequence {
            checksum
          }
        }
      }
    }
  }
`,geneAndTranscriptsQuery=esm.J1`
  query GeneAndTranscripts($genomeId: String!, $geneId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      ...GeneAndTranscripts
    }
  }
  ${geneAndTranscriptsFragment}
`,transcriptAndGeneQuery=esm.J1`
  query TranscriptAndGene($genomeId: String!, $transcriptId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      gene {
        ...GeneAndTranscripts
      }
    }
  }
  ${geneAndTranscriptsFragment}
`;const needsGenomicSequence=params=>{const{geneSequenceTypes,transcriptSequenceTypes}=params;return geneSequenceTypes?.genomic||geneSequenceTypes?.exons||transcriptSequenceTypes?.genomic||transcriptSequenceTypes?.exons},getTranscriptSequence=params=>{const{start,end}=params.transcript_relative_location;return params.geneSequence.slice(start-1,end)},getExonSequence=params=>{const exonRelativeLocationInGene=(params=>{const{transcript,exon}=params;return{start:transcript.relative_start+exon.relative_start-1,end:transcript.relative_start+exon.relative_end-1}})({exon:{relative_start:params.exon_relative_location.start,relative_end:params.exon_relative_location.end},transcript:{relative_start:params.transcript_relative_location.start}}),exonStartIndex=exonRelativeLocationInGene.start-1,exonEndIndex=exonRelativeLocationInGene.end;return params.geneSequence.slice(exonStartIndex,exonEndIndex)},buildExonLabel=params=>{const{index:exonIndex,exon:{stable_id:exonId}}=params.splicedExon;return`${exonId} ${params.geneId?`gene:${params.geneId} `:""}${`transcript:${params.transcriptId} `}${`exon:${exonIndex} total_exons:${params.exonsCount}`}`},fetchGeneAndTranscriptsMetadata=async variables=>{const graphQLClient=new esm.l4("/api/graphql/core",{jsonSerializer:JSON});return await graphQLClient.request(geneAndTranscriptsQuery,variables)},fetchTranscriptAndGeneMetadata=async variables=>{const graphQLClient=new esm.l4("/api/graphql/core",{jsonSerializer:JSON});return await graphQLClient.request(transcriptAndGeneQuery,variables)},transcriptQueryForProtein=esm.J1`
  query TranscriptProteinChecksums($genomeId: String!, $transcriptId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      stable_id
      product_generating_contexts {
        cds {
          sequence {
            checksum
          }
        }
        product {
          stable_id
          sequence {
            checksum
          }
        }
      }
    }
  }
`;const fetchTranscriptMetadata=async variables=>{const graphQLClient=new esm.l4("/api/graphql/core",{jsonSerializer:JSON});return await graphQLClient.request(transcriptQueryForProtein,variables)},regionChecksumQuery=esm.J1`
  query RegionChecksum($genomeId: String!, $regionName: String!) {
    region(by_name: { genome_id: $genomeId, name: $regionName }) {
      sequence {
        checksum
      }
    }
  }
`,fetchRegionMetadata=async variables=>{const graphQLClient=new esm.l4("/api/graphql/core",{jsonSerializer:JSON});return await graphQLClient.request(regionChecksumQuery,variables)},growFastaString=params=>{const{data:{label,sequence},body}=params,fastaString=toFasta({header:label,value:sequence});return body?body+"\n"+fastaString:fastaString},workerApi={downloadSequencesForGene:async options=>{let body="";for await(const sequenceData of async function*geneAndTranscriptsSequences(params){const{genomeId,geneId,geneSequenceTypes,transcriptSequenceTypes}=params,metadata=await fetchGeneAndTranscriptsMetadata({genomeId,geneId}),strand=metadata.gene.slice.strand.code;let geneSequence="";if(needsGenomicSequence(params)){const regionChecksum=metadata.gene.slice.region.sequence.checksum,geneStart=metadata.gene.slice.location.start,geneEnd=metadata.gene.slice.location.end,refgetUrl=refget({checksum:regionChecksum,start:geneStart,end:geneEnd});geneSequence=await fetch(refgetUrl).then((response=>response.text())),"reverse"===strand&&(geneSequence=getReverseComplement(geneSequence))}if(geneSequenceTypes?.genomic&&(yield{label:`${geneId} genomic`,sequence:geneSequence}),geneSequenceTypes?.exons)for(const transcript of metadata.gene.transcripts)for(const splicedExon of transcript.spliced_exons){const exonSequence=getExonSequence({geneSequence,transcript_relative_location:transcript.relative_location,exon_relative_location:splicedExon.relative_location}),exonLabel=buildExonLabel({splicedExon,geneId:metadata.gene.stable_id,transcriptId:transcript.stable_id,exonsCount:transcript.spliced_exons.length});yield{label:exonLabel,sequence:exonSequence}}for(const transcript of metadata.gene.transcripts){const productGeneratingContext=transcript.product_generating_contexts[0];if(transcriptSequenceTypes?.genomic){const transcriptSequence=getTranscriptSequence({geneSequence,transcript_relative_location:transcript.relative_location});yield{label:`${transcript.stable_id} genomic`,sequence:transcriptSequence}}if(transcriptSequenceTypes?.exons)for(const splicedExon of transcript.spliced_exons){const exonSequence=getExonSequence({geneSequence,transcript_relative_location:transcript.relative_location,exon_relative_location:splicedExon.relative_location}),exonLabel=buildExonLabel({splicedExon,transcriptId:transcript.stable_id,exonsCount:transcript.spliced_exons.length});yield{label:exonLabel,sequence:exonSequence}}if(transcriptSequenceTypes?.cdna){const sequenceChecksum=productGeneratingContext.cdna.sequence.checksum,url=refget({checksum:sequenceChecksum}),sequence=await fetch(url).then((response=>response.text()));yield{label:`${transcript.stable_id} cdna`,sequence}}if(transcriptSequenceTypes?.cds){const sequenceChecksum=productGeneratingContext.cds?.sequence.checksum;if(sequenceChecksum){const url=refget({checksum:sequenceChecksum}),sequence=await fetch(url).then((response=>response.text()));yield{label:`${transcript.stable_id} cds`,sequence}}}if(transcriptSequenceTypes?.protein){const product=productGeneratingContext.product;if(product){const sequenceChecksum=product.sequence.checksum,url=refget({checksum:sequenceChecksum}),sequence=await fetch(url).then((response=>response.text()));yield{label:`${product.stable_id} pep`,sequence}}}}}(options))sequenceData&&(body=growFastaString({data:sequenceData,body}));return body},downloadSequencesForTranscript:async options=>{let body="";for await(const sequenceData of async function*transcriptAndGeneSequences(params){const{genomeId,transcriptId,geneSequenceTypes,transcriptSequenceTypes}=params,metadata=await fetchTranscriptAndGeneMetadata({genomeId,transcriptId}),gene=metadata.transcript.gene,transcript=metadata.transcript.gene.transcripts.find((({stable_id})=>stable_id===transcriptId)),strand=metadata.transcript.gene.slice.strand.code;let geneSequence="";if(needsGenomicSequence(params)){const regionChecksum=gene.slice.region.sequence.checksum,geneStart=gene.slice.location.start,geneEnd=gene.slice.location.end,refgetUrl=refget({checksum:regionChecksum,start:geneStart,end:geneEnd});geneSequence=await fetch(refgetUrl).then((response=>response.text())),"reverse"===strand&&(geneSequence=getReverseComplement(geneSequence))}const productGeneratingContext=transcript.product_generating_contexts[0];if(transcriptSequenceTypes?.genomic){const transcriptSequence=getTranscriptSequence({geneSequence,transcript_relative_location:transcript.relative_location});yield{label:`${transcript.stable_id} genomic`,sequence:transcriptSequence}}if(transcriptSequenceTypes?.exons)for(const splicedExon of transcript.spliced_exons){const exonSequence=getExonSequence({geneSequence,transcript_relative_location:transcript.relative_location,exon_relative_location:splicedExon.relative_location}),exonLabel=buildExonLabel({splicedExon,transcriptId:transcript.stable_id,exonsCount:transcript.spliced_exons.length});yield{label:exonLabel,sequence:exonSequence}}if(transcriptSequenceTypes?.cdna){const sequenceChecksum=productGeneratingContext.cdna.sequence.checksum,url=refget({checksum:sequenceChecksum}),sequence=await fetch(url).then((response=>response.text()));yield{label:`${transcript.stable_id} cdna`,sequence}}if(transcriptSequenceTypes?.cds){const sequenceChecksum=productGeneratingContext.cds?.sequence.checksum;if(sequenceChecksum){const url=refget({checksum:sequenceChecksum}),sequence=await fetch(url).then((response=>response.text()));yield{label:`${transcript.stable_id} cds`,sequence}}}if(transcriptSequenceTypes?.protein){const product=productGeneratingContext.product;if(product){const sequenceChecksum=product.sequence.checksum,url=refget({checksum:sequenceChecksum}),sequence=await fetch(url).then((response=>response.text()));yield{label:`${product.stable_id} pep`,sequence}}}if(geneSequenceTypes?.genomic&&(yield{label:`${gene.stable_id} genomic`,sequence:geneSequence}),geneSequenceTypes?.exons)for(const transcript of gene.transcripts)for(const splicedExon of transcript.spliced_exons){const exonSequence=getExonSequence({geneSequence,transcript_relative_location:transcript.relative_location,exon_relative_location:splicedExon.relative_location}),exonLabel=buildExonLabel({splicedExon,geneId:gene.stable_id,transcriptId:transcript.stable_id,exonsCount:transcript.spliced_exons.length});yield{label:exonLabel,sequence:exonSequence}}}(options))sequenceData&&(body=growFastaString({data:sequenceData,body}));return body},downloadSequencesForProtein:async options=>{let body="";for await(const sequenceData of async function*getProteinRelatedSequences(params){const transcript=(await fetchTranscriptMetadata(params)).transcript,productGeneratingContext=transcript.product_generating_contexts[0];if(params.sequenceTypes.protein){const proteinId=productGeneratingContext.product.stable_id,checksum=productGeneratingContext.product.sequence.checksum,refgetUrl=refget({checksum}),sequence=await fetch(refgetUrl).then((response=>response.text()));yield{label:`${proteinId} pep`,sequence}}if(params.sequenceTypes.cds){const checksum=productGeneratingContext.cds.sequence.checksum,refgetUrl=refget({checksum}),sequence=await fetch(refgetUrl).then((response=>response.text()));yield{label:`${transcript.stable_id} cds`,sequence}}}(options))sequenceData&&(body=growFastaString({data:sequenceData,body}));return body},downloadGenomicSlice:async options=>{const{label,sequence}=await(async params=>{const{label,start,end}=params,checksum=(await fetchRegionMetadata(params)).region.sequence.checksum,refgetUrl=refget({checksum,start,end});return{label,sequence:await fetch(refgetUrl).then((response=>response.text()))}})(options);return toFasta({header:label,value:sequence})}};(0,comlink.p)(workerApi)}},__webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;var module=__webpack_module_cache__[moduleId]={exports:{}};return __webpack_modules__[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.exports}__webpack_require__.m=__webpack_modules__,__webpack_require__.x=()=>{var __webpack_exports__=__webpack_require__.O(void 0,[8354,1413,4946],(()=>__webpack_require__("./src/shared/workers/feature-sequence-download/featureSequenceDownload.worker.ts")));return __webpack_exports__=__webpack_require__.O(__webpack_exports__)},deferred=[],__webpack_require__.O=(result,chunkIds,fn,priority)=>{if(!chunkIds){var notFulfilled=1/0;for(i=0;i<deferred.length;i++){for(var[chunkIds,fn,priority]=deferred[i],fulfilled=!0,j=0;j<chunkIds.length;j++)(!1&priority||notFulfilled>=priority)&&Object.keys(__webpack_require__.O).every((key=>__webpack_require__.O[key](chunkIds[j])))?chunkIds.splice(j--,1):(fulfilled=!1,priority<notFulfilled&&(notFulfilled=priority));if(fulfilled){deferred.splice(i--,1);var r=fn();void 0!==r&&(result=r)}}return result}priority=priority||0;for(var i=deferred.length;i>0&&deferred[i-1][2]>priority;i--)deferred[i]=deferred[i-1];deferred[i]=[chunkIds,fn,priority]},__webpack_require__.n=module=>{var getter=module&&module.__esModule?()=>module.default:()=>module;return __webpack_require__.d(getter,{a:getter}),getter},__webpack_require__.d=(exports,definition)=>{for(var key in definition)__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)&&Object.defineProperty(exports,key,{enumerable:!0,get:definition[key]})},__webpack_require__.f={},__webpack_require__.e=chunkId=>Promise.all(Object.keys(__webpack_require__.f).reduce(((promises,key)=>(__webpack_require__.f[key](chunkId,promises),promises)),[])),__webpack_require__.u=chunkId=>chunkId+"."+{1413:"13069759",4946:"2eae7073",8354:"c88c5ef4"}[chunkId]+".iframe.bundle.js",__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.o=(obj,prop)=>Object.prototype.hasOwnProperty.call(obj,prop),__webpack_require__.p="",(()=>{var installedChunks={7248:1};__webpack_require__.f.i=(chunkId,promises)=>{installedChunks[chunkId]||importScripts(__webpack_require__.p+__webpack_require__.u(chunkId))};var chunkLoadingGlobal=globalThis.webpackChunkensembl_new=globalThis.webpackChunkensembl_new||[],parentChunkLoadingFunction=chunkLoadingGlobal.push.bind(chunkLoadingGlobal);chunkLoadingGlobal.push=data=>{var[chunkIds,moreModules,runtime]=data;for(var moduleId in moreModules)__webpack_require__.o(moreModules,moduleId)&&(__webpack_require__.m[moduleId]=moreModules[moduleId]);for(runtime&&runtime(__webpack_require__);chunkIds.length;)installedChunks[chunkIds.pop()]=1;parentChunkLoadingFunction(data)}})(),next=__webpack_require__.x,__webpack_require__.x=()=>Promise.all([8354,1413,4946].map(__webpack_require__.e,__webpack_require__)).then(next);__webpack_require__.x()})();
//# sourceMappingURL=7248.16593e00.iframe.bundle.js.map