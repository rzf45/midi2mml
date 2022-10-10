var be=Object.defineProperty;var ge=(t,e,r)=>e in t?be(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var ie=(t,e,r)=>(ge(t,typeof e!="symbol"?e+"":e,r),r);const ve=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function r(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerpolicy&&(s.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?s.credentials="include":i.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(i){if(i.ep)return;i.ep=!0;const s=r(i);fetch(i.href,s)}};ve();var F=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ke(t){var e=t.default;if(typeof e=="function"){var r=function(){return e.apply(this,arguments)};r.prototype=e.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(t).forEach(function(a){var i=Object.getOwnPropertyDescriptor(t,a);Object.defineProperty(r,a,i.get?i:{enumerable:!0,get:function(){return t[a]}})}),r}var ue={},D={};function Ie(t){var e=new x(t),r=e.readChunk();if(r.id!="MThd")throw"Bad MIDI file.  Expected 'MHdr', got: '"+r.id+"'";for(var a=xe(r.data),i=[],s=0;!e.eof()&&s<a.numTracks;s++){var n=e.readChunk();if(n.id!="MTrk")throw"Bad MIDI file.  Expected 'MTrk', got: '"+n.id+"'";var l=Te(n.data);i.push(l)}return{header:a,tracks:i}}function xe(t){var e=new x(t),r=e.readUInt16(),a=e.readUInt16(),i={format:r,numTracks:a},s=e.readUInt16();return s&32768?(i.framesPerSecond=256-(s>>8),i.ticksPerFrame=s&255):i.ticksPerBeat=s,i}function Te(t){for(var e=new x(t),r=[];!e.eof();){var a=s();r.push(a)}return r;var i;function s(){var n={};n.deltaTime=e.readVarInt();var l=e.readUInt8();if((l&240)===240)if(l===255){n.meta=!0;var u=e.readUInt8(),c=e.readVarInt();switch(u){case 0:if(n.type="sequenceNumber",c!==2)throw"Expected length for sequenceNumber event is 2, got "+c;return n.number=e.readUInt16(),n;case 1:return n.type="text",n.text=e.readString(c),n;case 2:return n.type="copyrightNotice",n.text=e.readString(c),n;case 3:return n.type="trackName",n.text=e.readString(c),n;case 4:return n.type="instrumentName",n.text=e.readString(c),n;case 5:return n.type="lyrics",n.text=e.readString(c),n;case 6:return n.type="marker",n.text=e.readString(c),n;case 7:return n.type="cuePoint",n.text=e.readString(c),n;case 32:if(n.type="channelPrefix",c!=1)throw"Expected length for channelPrefix event is 1, got "+c;return n.channel=e.readUInt8(),n;case 33:if(n.type="portPrefix",c!=1)throw"Expected length for portPrefix event is 1, got "+c;return n.port=e.readUInt8(),n;case 47:if(n.type="endOfTrack",c!=0)throw"Expected length for endOfTrack event is 0, got "+c;return n;case 81:if(n.type="setTempo",c!=3)throw"Expected length for setTempo event is 3, got "+c;return n.microsecondsPerBeat=e.readUInt24(),n;case 84:if(n.type="smpteOffset",c!=5)throw"Expected length for smpteOffset event is 5, got "+c;var b=e.readUInt8(),f={0:24,32:25,64:29,96:30};return n.frameRate=f[b&96],n.hour=b&31,n.min=e.readUInt8(),n.sec=e.readUInt8(),n.frame=e.readUInt8(),n.subFrame=e.readUInt8(),n;case 88:if(n.type="timeSignature",c!=2&&c!=4)throw"Expected length for timeSignature event is 4 or 2, got "+c;return n.numerator=e.readUInt8(),n.denominator=1<<e.readUInt8(),c===4?(n.metronome=e.readUInt8(),n.thirtyseconds=e.readUInt8()):(n.metronome=36,n.thirtyseconds=8),n;case 89:if(n.type="keySignature",c!=2)throw"Expected length for keySignature event is 2, got "+c;return n.key=e.readInt8(),n.scale=e.readUInt8(),n;case 127:return n.type="sequencerSpecific",n.data=e.readBytes(c),n;default:return n.type="unknownMeta",n.data=e.readBytes(c),n.metatypeByte=u,n}}else if(l==240){n.type="sysEx";var c=e.readVarInt();return n.data=e.readBytes(c),n}else if(l==247){n.type="endSysEx";var c=e.readVarInt();return n.data=e.readBytes(c),n}else throw"Unrecognised MIDI event type byte: "+l;else{var o;if((l&128)===0){if(i===null)throw"Running status byte encountered before status byte";o=l,l=i,n.running=!0}else o=e.readUInt8(),i=l;var h=l>>4;switch(n.channel=l&15,h){case 8:return n.type="noteOff",n.noteNumber=o,n.velocity=e.readUInt8(),n;case 9:var p=e.readUInt8();return n.type=p===0?"noteOff":"noteOn",n.noteNumber=o,n.velocity=p,p===0&&(n.byte9=!0),n;case 10:return n.type="noteAftertouch",n.noteNumber=o,n.amount=e.readUInt8(),n;case 11:return n.type="controller",n.controllerType=o,n.value=e.readUInt8(),n;case 12:return n.type="programChange",n.programNumber=o,n;case 13:return n.type="channelAftertouch",n.amount=o,n;case 14:return n.type="pitchBend",n.value=o+(e.readUInt8()<<7)-8192,n;default:throw"Unrecognised MIDI event type: "+h}}}}function x(t){this.buffer=t,this.bufferLen=this.buffer.length,this.pos=0}x.prototype.eof=function(){return this.pos>=this.bufferLen};x.prototype.readUInt8=function(){var t=this.buffer[this.pos];return this.pos+=1,t};x.prototype.readInt8=function(){var t=this.readUInt8();return t&128?t-256:t};x.prototype.readUInt16=function(){var t=this.readUInt8(),e=this.readUInt8();return(t<<8)+e};x.prototype.readInt16=function(){var t=this.readUInt16();return t&32768?t-65536:t};x.prototype.readUInt24=function(){var t=this.readUInt8(),e=this.readUInt8(),r=this.readUInt8();return(t<<16)+(e<<8)+r};x.prototype.readInt24=function(){var t=this.readUInt24();return t&8388608?t-16777216:t};x.prototype.readUInt32=function(){var t=this.readUInt8(),e=this.readUInt8(),r=this.readUInt8(),a=this.readUInt8();return(t<<24)+(e<<16)+(r<<8)+a};x.prototype.readBytes=function(t){var e=this.buffer.slice(this.pos,this.pos+t);return this.pos+=t,e};x.prototype.readString=function(t){var e=this.readBytes(t);return String.fromCharCode.apply(null,e)};x.prototype.readVarInt=function(){for(var t=0;!this.eof();){var e=this.readUInt8();if(e&128)t+=e&127,t<<=7;else return t+e}return t};x.prototype.readChunk=function(){var t=this.readString(4),e=this.readUInt32(),r=this.readBytes(e);return{id:t,length:e,data:r}};var Se=Ie;function we(t,e){if(typeof t!="object")throw"Invalid MIDI data";e=e||{};var r=t.header||{},a=t.tracks||[],i,s=a.length,n=new v;for(Ue(n,r,s),i=0;i<s;i++)Oe(n,a[i],e);return n.buffer}function Ue(t,e,r){var a=e.format==null?1:e.format,i=128;e.timeDivision?i=e.timeDivision:e.ticksPerFrame&&e.framesPerSecond?i=-(e.framesPerSecond&255)<<8|e.ticksPerFrame&255:e.ticksPerBeat&&(i=e.ticksPerBeat&32767);var s=new v;s.writeUInt16(a),s.writeUInt16(r),s.writeUInt16(i),t.writeChunk("MThd",s.buffer)}function Oe(t,e,r){var a=new v,i,s=e.length,n=null;for(i=0;i<s;i++)(r.running===!1||!r.running&&!e[i].running)&&(n=null),n=Ce(a,e[i],n,r.useByte9ForNoteOff);t.writeChunk("MTrk",a.buffer)}function Ce(t,e,r,a){var i=e.type,s=e.deltaTime,n=e.text||"",l=e.data||[],u=null;switch(t.writeVarInt(s),i){case"sequenceNumber":t.writeUInt8(255),t.writeUInt8(0),t.writeVarInt(2),t.writeUInt16(e.number);break;case"text":t.writeUInt8(255),t.writeUInt8(1),t.writeVarInt(n.length),t.writeString(n);break;case"copyrightNotice":t.writeUInt8(255),t.writeUInt8(2),t.writeVarInt(n.length),t.writeString(n);break;case"trackName":t.writeUInt8(255),t.writeUInt8(3),t.writeVarInt(n.length),t.writeString(n);break;case"instrumentName":t.writeUInt8(255),t.writeUInt8(4),t.writeVarInt(n.length),t.writeString(n);break;case"lyrics":t.writeUInt8(255),t.writeUInt8(5),t.writeVarInt(n.length),t.writeString(n);break;case"marker":t.writeUInt8(255),t.writeUInt8(6),t.writeVarInt(n.length),t.writeString(n);break;case"cuePoint":t.writeUInt8(255),t.writeUInt8(7),t.writeVarInt(n.length),t.writeString(n);break;case"channelPrefix":t.writeUInt8(255),t.writeUInt8(32),t.writeVarInt(1),t.writeUInt8(e.channel);break;case"portPrefix":t.writeUInt8(255),t.writeUInt8(33),t.writeVarInt(1),t.writeUInt8(e.port);break;case"endOfTrack":t.writeUInt8(255),t.writeUInt8(47),t.writeVarInt(0);break;case"setTempo":t.writeUInt8(255),t.writeUInt8(81),t.writeVarInt(3),t.writeUInt24(e.microsecondsPerBeat);break;case"smpteOffset":t.writeUInt8(255),t.writeUInt8(84),t.writeVarInt(5);var c={24:0,25:32,29:64,30:96},b=e.hour&31|c[e.frameRate];t.writeUInt8(b),t.writeUInt8(e.min),t.writeUInt8(e.sec),t.writeUInt8(e.frame),t.writeUInt8(e.subFrame);break;case"timeSignature":t.writeUInt8(255),t.writeUInt8(88),t.writeVarInt(4),t.writeUInt8(e.numerator);var f=Math.floor(Math.log(e.denominator)/Math.LN2)&255;t.writeUInt8(f),t.writeUInt8(e.metronome),t.writeUInt8(e.thirtyseconds||8);break;case"keySignature":t.writeUInt8(255),t.writeUInt8(89),t.writeVarInt(2),t.writeInt8(e.key),t.writeUInt8(e.scale);break;case"sequencerSpecific":t.writeUInt8(255),t.writeUInt8(127),t.writeVarInt(l.length),t.writeBytes(l);break;case"unknownMeta":e.metatypeByte!=null&&(t.writeUInt8(255),t.writeUInt8(e.metatypeByte),t.writeVarInt(l.length),t.writeBytes(l));break;case"sysEx":t.writeUInt8(240),t.writeVarInt(l.length),t.writeBytes(l);break;case"endSysEx":t.writeUInt8(247),t.writeVarInt(l.length),t.writeBytes(l);break;case"noteOff":var o=a!==!1&&e.byte9||a&&e.velocity==0?144:128;u=o|e.channel,u!==r&&t.writeUInt8(u),t.writeUInt8(e.noteNumber),t.writeUInt8(e.velocity);break;case"noteOn":u=144|e.channel,u!==r&&t.writeUInt8(u),t.writeUInt8(e.noteNumber),t.writeUInt8(e.velocity);break;case"noteAftertouch":u=160|e.channel,u!==r&&t.writeUInt8(u),t.writeUInt8(e.noteNumber),t.writeUInt8(e.amount);break;case"controller":u=176|e.channel,u!==r&&t.writeUInt8(u),t.writeUInt8(e.controllerType),t.writeUInt8(e.value);break;case"programChange":u=192|e.channel,u!==r&&t.writeUInt8(u),t.writeUInt8(e.programNumber);break;case"channelAftertouch":u=208|e.channel,u!==r&&t.writeUInt8(u),t.writeUInt8(e.amount);break;case"pitchBend":u=224|e.channel,u!==r&&t.writeUInt8(u);var h=8192+e.value,p=h&127,y=h>>7&127;t.writeUInt8(p),t.writeUInt8(y);break;default:throw"Unrecognized event type: "+i}return u}function v(){this.buffer=[]}v.prototype.writeUInt8=function(t){this.buffer.push(t&255)};v.prototype.writeInt8=v.prototype.writeUInt8;v.prototype.writeUInt16=function(t){var e=t>>8&255,r=t&255;this.writeUInt8(e),this.writeUInt8(r)};v.prototype.writeInt16=v.prototype.writeUInt16;v.prototype.writeUInt24=function(t){var e=t>>16&255,r=t>>8&255,a=t&255;this.writeUInt8(e),this.writeUInt8(r),this.writeUInt8(a)};v.prototype.writeInt24=v.prototype.writeUInt24;v.prototype.writeUInt32=function(t){var e=t>>24&255,r=t>>16&255,a=t>>8&255,i=t&255;this.writeUInt8(e),this.writeUInt8(r),this.writeUInt8(a),this.writeUInt8(i)};v.prototype.writeInt32=v.prototype.writeUInt32;v.prototype.writeBytes=function(t){this.buffer=this.buffer.concat(Array.prototype.slice.call(t,0))};v.prototype.writeString=function(t){var e,r=t.length,a=[];for(e=0;e<r;e++)a.push(t.codePointAt(e));this.writeBytes(a)};v.prototype.writeVarInt=function(t){if(t<0)throw"Cannot write negative variable-length integer";if(t<=127)this.writeUInt8(t);else{var e=t,r=[];for(r.push(e&127),e>>=7;e;){var a=e&127|128;r.push(a),e>>=7}this.writeBytes(r.reverse())}};v.prototype.writeChunk=function(t,e){this.writeString(t),this.writeUInt32(e.length),this.writeBytes(e)};var Ne=we;D.parseMidi=Se;D.writeMidi=Ne;var J={},N={};Object.defineProperty(N,"__esModule",{value:!0});N.insert=N.search=void 0;function le(t,e,r){r===void 0&&(r="ticks");var a=0,i=t.length,s=i;if(i>0&&t[i-1][r]<=e)return i-1;for(;a<s;){var n=Math.floor(a+(s-a)/2),l=t[n],u=t[n+1];if(l[r]===e){for(var c=n;c<t.length;c++){var b=t[c];b[r]===e&&(n=c)}return n}else{if(l[r]<e&&u[r]>e)return n;l[r]>e?s=n:l[r]<e&&(a=n+1)}}return-1}N.search=le;function Me(t,e,r){if(r===void 0&&(r="ticks"),t.length){var a=le(t,e[r],r);t.splice(a+1,0,e)}else t.push(e)}N.insert=Me;(function(t){Object.defineProperty(t,"__esModule",{value:!0}),t.Header=t.keySignatureKeys=void 0;var e=N,r=new WeakMap;t.keySignatureKeys=["Cb","Gb","Db","Ab","Eb","Bb","F","C","G","D","A","E","B","F#","C#"];var a=function(){function i(s){var n=this;if(this.tempos=[],this.timeSignatures=[],this.keySignatures=[],this.meta=[],this.name="",r.set(this,480),s){r.set(this,s.header.ticksPerBeat),s.tracks.forEach(function(u){u.forEach(function(c){c.meta&&(c.type==="timeSignature"?n.timeSignatures.push({ticks:c.absoluteTime,timeSignature:[c.numerator,c.denominator]}):c.type==="setTempo"?n.tempos.push({bpm:6e7/c.microsecondsPerBeat,ticks:c.absoluteTime}):c.type==="keySignature"&&n.keySignatures.push({key:t.keySignatureKeys[c.key+7],scale:c.scale===0?"major":"minor",ticks:c.absoluteTime}))})});var l=0;s.tracks[0].forEach(function(u){l+=u.deltaTime,u.meta&&(u.type==="trackName"?n.name=u.text:(u.type==="text"||u.type==="cuePoint"||u.type==="marker"||u.type==="lyrics")&&n.meta.push({text:u.text,ticks:l,type:u.type}))}),this.update()}}return i.prototype.update=function(){var s=this,n=0,l=0;this.tempos.sort(function(u,c){return u.ticks-c.ticks}),this.tempos.forEach(function(u,c){var b=c>0?s.tempos[c-1].bpm:s.tempos[0].bpm,f=u.ticks/s.ppq-l,o=60/b*f;u.time=o+n,n=u.time,l+=f}),this.timeSignatures.sort(function(u,c){return u.ticks-c.ticks}),this.timeSignatures.forEach(function(u,c){var b=c>0?s.timeSignatures[c-1]:s.timeSignatures[0],f=(u.ticks-b.ticks)/s.ppq,o=f/b.timeSignature[0]/(b.timeSignature[1]/4);b.measures=b.measures||0,u.measures=o+b.measures})},i.prototype.ticksToSeconds=function(s){var n=(0,e.search)(this.tempos,s);if(n!==-1){var l=this.tempos[n],u=l.time,c=(s-l.ticks)/this.ppq;return u+60/l.bpm*c}else{var b=s/this.ppq;return 60/120*b}},i.prototype.ticksToMeasures=function(s){var n=(0,e.search)(this.timeSignatures,s);if(n!==-1){var l=this.timeSignatures[n],u=(s-l.ticks)/this.ppq;return l.measures+u/(l.timeSignature[0]/l.timeSignature[1])/4}else return s/this.ppq/4},Object.defineProperty(i.prototype,"ppq",{get:function(){return r.get(this)},enumerable:!1,configurable:!0}),i.prototype.secondsToTicks=function(s){var n=(0,e.search)(this.tempos,s,"time");if(n!==-1){var l=this.tempos[n],u=l.time,c=s-u,b=c/(60/l.bpm);return Math.round(l.ticks+b*this.ppq)}else{var f=s/.5;return Math.round(f*this.ppq)}},i.prototype.toJSON=function(){return{keySignatures:this.keySignatures,meta:this.meta,name:this.name,ppq:this.ppq,tempos:this.tempos.map(function(s){return{bpm:s.bpm,ticks:s.ticks}}),timeSignatures:this.timeSignatures}},i.prototype.fromJSON=function(s){this.name=s.name,this.tempos=s.tempos.map(function(n){return Object.assign({},n)}),this.timeSignatures=s.timeSignatures.map(function(n){return Object.assign({},n)}),this.keySignatures=s.keySignatures.map(function(n){return Object.assign({},n)}),this.meta=s.meta.map(function(n){return Object.assign({},n)}),r.set(this,s.ppq),this.update()},i.prototype.setTempo=function(s){this.tempos=[{bpm:s,ticks:0}],this.update()},i}();t.Header=a})(J);var A={},Q={};(function(t){Object.defineProperty(t,"__esModule",{value:!0}),t.ControlChange=t.controlChangeIds=t.controlChangeNames=void 0,t.controlChangeNames={1:"modulationWheel",2:"breath",4:"footController",5:"portamentoTime",7:"volume",8:"balance",10:"pan",64:"sustain",65:"portamentoTime",66:"sostenuto",67:"softPedal",68:"legatoFootswitch",84:"portamentoControl"},t.controlChangeIds=Object.keys(t.controlChangeNames).reduce(function(i,s){return i[t.controlChangeNames[s]]=s,i},{});var e=new WeakMap,r=new WeakMap,a=function(){function i(s,n){e.set(this,n),r.set(this,s.controllerType),this.ticks=s.absoluteTime,this.value=s.value}return Object.defineProperty(i.prototype,"number",{get:function(){return r.get(this)},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"name",{get:function(){return t.controlChangeNames[this.number]?t.controlChangeNames[this.number]:null},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"time",{get:function(){var s=e.get(this);return s.ticksToSeconds(this.ticks)},set:function(s){var n=e.get(this);this.ticks=n.secondsToTicks(s)},enumerable:!1,configurable:!0}),i.prototype.toJSON=function(){return{number:this.number,ticks:this.ticks,time:this.time,value:this.value}},i}();t.ControlChange=a})(Q);var V={};Object.defineProperty(V,"__esModule",{value:!0});V.createControlChanges=void 0;var j=Q;function Fe(){return new Proxy({},{get:function(t,e){if(t[e])return t[e];if(j.controlChangeIds.hasOwnProperty(e))return t[j.controlChangeIds[e]]},set:function(t,e,r){return j.controlChangeIds.hasOwnProperty(e)?t[j.controlChangeIds[e]]=r:t[e]=r,!0}})}V.createControlChanges=Fe;var R={};Object.defineProperty(R,"__esModule",{value:!0});R.PitchBend=void 0;var G=new WeakMap,Pe=function(){function t(e,r){G.set(this,r),this.ticks=e.absoluteTime,this.value=e.value}return Object.defineProperty(t.prototype,"time",{get:function(){var e=G.get(this);return e.ticksToSeconds(this.ticks)},set:function(e){var r=G.get(this);this.ticks=r.secondsToTicks(e)},enumerable:!1,configurable:!0}),t.prototype.toJSON=function(){return{ticks:this.ticks,time:this.time,value:this.value}},t}();R.PitchBend=Pe;var L={},U={};Object.defineProperty(U,"__esModule",{value:!0});U.DrumKitByPatchID=U.InstrumentFamilyByID=U.instrumentByPatchID=void 0;U.instrumentByPatchID=["acoustic grand piano","bright acoustic piano","electric grand piano","honky-tonk piano","electric piano 1","electric piano 2","harpsichord","clavi","celesta","glockenspiel","music box","vibraphone","marimba","xylophone","tubular bells","dulcimer","drawbar organ","percussive organ","rock organ","church organ","reed organ","accordion","harmonica","tango accordion","acoustic guitar (nylon)","acoustic guitar (steel)","electric guitar (jazz)","electric guitar (clean)","electric guitar (muted)","overdriven guitar","distortion guitar","guitar harmonics","acoustic bass","electric bass (finger)","electric bass (pick)","fretless bass","slap bass 1","slap bass 2","synth bass 1","synth bass 2","violin","viola","cello","contrabass","tremolo strings","pizzicato strings","orchestral harp","timpani","string ensemble 1","string ensemble 2","synthstrings 1","synthstrings 2","choir aahs","voice oohs","synth voice","orchestra hit","trumpet","trombone","tuba","muted trumpet","french horn","brass section","synthbrass 1","synthbrass 2","soprano sax","alto sax","tenor sax","baritone sax","oboe","english horn","bassoon","clarinet","piccolo","flute","recorder","pan flute","blown bottle","shakuhachi","whistle","ocarina","lead 1 (square)","lead 2 (sawtooth)","lead 3 (calliope)","lead 4 (chiff)","lead 5 (charang)","lead 6 (voice)","lead 7 (fifths)","lead 8 (bass + lead)","pad 1 (new age)","pad 2 (warm)","pad 3 (polysynth)","pad 4 (choir)","pad 5 (bowed)","pad 6 (metallic)","pad 7 (halo)","pad 8 (sweep)","fx 1 (rain)","fx 2 (soundtrack)","fx 3 (crystal)","fx 4 (atmosphere)","fx 5 (brightness)","fx 6 (goblins)","fx 7 (echoes)","fx 8 (sci-fi)","sitar","banjo","shamisen","koto","kalimba","bag pipe","fiddle","shanai","tinkle bell","agogo","steel drums","woodblock","taiko drum","melodic tom","synth drum","reverse cymbal","guitar fret noise","breath noise","seashore","bird tweet","telephone ring","helicopter","applause","gunshot"];U.InstrumentFamilyByID=["piano","chromatic percussion","organ","guitar","bass","strings","ensemble","brass","reed","pipe","synth lead","synth pad","synth effects","world","percussive","sound effects"];U.DrumKitByPatchID={0:"standard kit",8:"room kit",16:"power kit",24:"electronic kit",25:"tr-808 kit",32:"jazz kit",40:"brush kit",48:"orchestra kit",56:"sound fx kit"};Object.defineProperty(L,"__esModule",{value:!0});L.Instrument=void 0;var E=U,ae=new WeakMap,Be=function(){function t(e,r){if(this.number=0,ae.set(this,r),this.number=0,e){var a=e.find(function(i){return i.type==="programChange"});a&&(this.number=a.programNumber)}}return Object.defineProperty(t.prototype,"name",{get:function(){return this.percussion?E.DrumKitByPatchID[this.number]:E.instrumentByPatchID[this.number]},set:function(e){var r=E.instrumentByPatchID.indexOf(e);r!==-1&&(this.number=r)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"family",{get:function(){return this.percussion?"drums":E.InstrumentFamilyByID[Math.floor(this.number/8)]},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"percussion",{get:function(){var e=ae.get(this);return e.channel===9},enumerable:!1,configurable:!0}),t.prototype.toJSON=function(){return{family:this.family,number:this.number,name:this.name}},t.prototype.fromJSON=function(e){this.number=e.number},t}();L.Instrument=Be;var H={};Object.defineProperty(H,"__esModule",{value:!0});H.Note=void 0;function _e(t){var e=Math.floor(t/12)-1;return fe(t)+e.toString()}function fe(t){var e=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],r=t%12;return e[r]}function Ae(t){var e=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];return e.indexOf(t)}var je=function(){var t=/^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,e={cbb:-2,cb:-1,c:0,"c#":1,cx:2,dbb:0,db:1,d:2,"d#":3,dx:4,ebb:2,eb:3,e:4,"e#":5,ex:6,fbb:3,fb:4,f:5,"f#":6,fx:7,gbb:5,gb:6,g:7,"g#":8,gx:9,abb:7,ab:8,a:9,"a#":10,ax:11,bbb:9,bb:10,b:11,"b#":12,bx:13};return function(r){var a=t.exec(r),i=a[1],s=a[2],n=e[i.toLowerCase()];return n+(parseInt(s,10)+1)*12}}(),M=new WeakMap,Ee=function(){function t(e,r,a){M.set(this,a),this.midi=e.midi,this.velocity=e.velocity,this.noteOffVelocity=r.velocity,this.ticks=e.ticks,this.durationTicks=r.ticks-e.ticks}return Object.defineProperty(t.prototype,"name",{get:function(){return _e(this.midi)},set:function(e){this.midi=je(e)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"octave",{get:function(){return Math.floor(this.midi/12)-1},set:function(e){var r=e-this.octave;this.midi+=r*12},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"pitch",{get:function(){return fe(this.midi)},set:function(e){this.midi=12*(this.octave+1)+Ae(e)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"duration",{get:function(){var e=M.get(this);return e.ticksToSeconds(this.ticks+this.durationTicks)-e.ticksToSeconds(this.ticks)},set:function(e){var r=M.get(this),a=r.secondsToTicks(this.time+e);this.durationTicks=a-this.ticks},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"time",{get:function(){var e=M.get(this);return e.ticksToSeconds(this.ticks)},set:function(e){var r=M.get(this);this.ticks=r.secondsToTicks(e)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"bars",{get:function(){var e=M.get(this);return e.ticksToMeasures(this.ticks)},enumerable:!1,configurable:!0}),t.prototype.toJSON=function(){return{duration:this.duration,durationTicks:this.durationTicks,midi:this.midi,name:this.name,ticks:this.ticks,time:this.time,velocity:this.velocity}},t}();H.Note=Ee;Object.defineProperty(A,"__esModule",{value:!0});A.Track=void 0;var z=N,qe=Q,Je=V,De=R,se=L,Ve=H,q=new WeakMap,Re=function(){function t(e,r){var a=this;if(this.name="",this.notes=[],this.controlChanges=(0,Je.createControlChanges)(),this.pitchBends=[],q.set(this,r),e){var i=e.find(function(o){return o.type==="trackName"});this.name=i?i.text:""}if(this.instrument=new se.Instrument(e,this),this.channel=0,e){for(var s=e.filter(function(o){return o.type==="noteOn"}),n=e.filter(function(o){return o.type==="noteOff"}),l=function(){var o=s.shift();u.channel=o.channel;var h=n.findIndex(function(y){return y.noteNumber===o.noteNumber&&y.absoluteTime>=o.absoluteTime});if(h!==-1){var p=n.splice(h,1)[0];u.addNote({durationTicks:p.absoluteTime-o.absoluteTime,midi:o.noteNumber,noteOffVelocity:p.velocity/127,ticks:o.absoluteTime,velocity:o.velocity/127})}},u=this;s.length;)l();var c=e.filter(function(o){return o.type==="controller"});c.forEach(function(o){a.addCC({number:o.controllerType,ticks:o.absoluteTime,value:o.value/127})});var b=e.filter(function(o){return o.type==="pitchBend"});b.forEach(function(o){a.addPitchBend({ticks:o.absoluteTime,value:o.value/Math.pow(2,13)})});var f=e.find(function(o){return o.type==="endOfTrack"});this.endOfTrackTicks=f!==void 0?f.absoluteTime:void 0}}return t.prototype.addNote=function(e){var r=q.get(this),a=new Ve.Note({midi:0,ticks:0,velocity:1},{ticks:0,velocity:0},r);return Object.assign(a,e),(0,z.insert)(this.notes,a,"ticks"),this},t.prototype.addCC=function(e){var r=q.get(this),a=new qe.ControlChange({controllerType:e.number},r);return delete e.number,Object.assign(a,e),Array.isArray(this.controlChanges[a.number])||(this.controlChanges[a.number]=[]),(0,z.insert)(this.controlChanges[a.number],a,"ticks"),this},t.prototype.addPitchBend=function(e){var r=q.get(this),a=new De.PitchBend({},r);return Object.assign(a,e),(0,z.insert)(this.pitchBends,a,"ticks"),this},Object.defineProperty(t.prototype,"duration",{get:function(){if(!this.notes.length)return 0;for(var e=this.notes[this.notes.length-1].time+this.notes[this.notes.length-1].duration,r=0;r<this.notes.length-1;r++){var a=this.notes[r].time+this.notes[r].duration;e<a&&(e=a)}return e},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"durationTicks",{get:function(){if(!this.notes.length)return 0;for(var e=this.notes[this.notes.length-1].ticks+this.notes[this.notes.length-1].durationTicks,r=0;r<this.notes.length-1;r++){var a=this.notes[r].ticks+this.notes[r].durationTicks;e<a&&(e=a)}return e},enumerable:!1,configurable:!0}),t.prototype.fromJSON=function(e){var r=this;this.name=e.name,this.channel=e.channel,this.instrument=new se.Instrument(void 0,this),this.instrument.fromJSON(e.instrument),e.endOfTrackTicks!==void 0&&(this.endOfTrackTicks=e.endOfTrackTicks);for(var a in e.controlChanges)e.controlChanges[a]&&e.controlChanges[a].forEach(function(i){r.addCC({number:i.number,ticks:i.ticks,value:i.value})});e.notes.forEach(function(i){r.addNote({durationTicks:i.durationTicks,midi:i.midi,ticks:i.ticks,velocity:i.velocity})})},t.prototype.toJSON=function(){for(var e={},r=0;r<127;r++)this.controlChanges.hasOwnProperty(r)&&(e[r]=this.controlChanges[r].map(function(i){return i.toJSON()}));var a={channel:this.channel,controlChanges:e,pitchBends:this.pitchBends.map(function(i){return i.toJSON()}),instrument:this.instrument.toJSON(),name:this.name,notes:this.notes.map(function(i){return i.toJSON()})};return this.endOfTrackTicks!==void 0&&(a.endOfTrackTicks=this.endOfTrackTicks),a},t}();A.Track=Re;var $={};function Le(t){var e=[];return he(t,e),e}function he(t,e){for(var r=0;r<t.length;r++){var a=t[r];Array.isArray(a)?he(a,e):e.push(a)}}const He=Object.freeze(Object.defineProperty({__proto__:null,flatten:Le},Symbol.toStringTag,{value:"Module"})),$e=ke(He);var w=F&&F.__spreadArray||function(t,e,r){if(r||arguments.length===2)for(var a=0,i=e.length,s;a<i;a++)(s||!(a in e))&&(s||(s=Array.prototype.slice.call(e,0,a)),s[a]=e[a]);return t.concat(s||Array.prototype.slice.call(e))};Object.defineProperty($,"__esModule",{value:!0});$.encode=void 0;var We=D,Ge=J,ze=$e;function Ke(t,e){return[{absoluteTime:t.ticks,channel:e,deltaTime:0,noteNumber:t.midi,type:"noteOn",velocity:Math.floor(t.velocity*127)},{absoluteTime:t.ticks+t.durationTicks,channel:e,deltaTime:0,noteNumber:t.midi,type:"noteOff",velocity:Math.floor(t.noteOffVelocity*127)}]}function Xe(t){return(0,ze.flatten)(t.notes.map(function(e){return Ke(e,t.channel)}))}function Qe(t,e){return{absoluteTime:t.ticks,channel:e,controllerType:t.number,deltaTime:0,type:"controller",value:Math.floor(t.value*127)}}function Ye(t){for(var e=[],r=0;r<127;r++)t.controlChanges.hasOwnProperty(r)&&t.controlChanges[r].forEach(function(a){e.push(Qe(a,t.channel))});return e}function Ze(t,e){return{absoluteTime:t.ticks,channel:e,deltaTime:0,type:"pitchBend",value:t.value}}function et(t){var e=[];return t.pitchBends.forEach(function(r){e.push(Ze(r,t.channel))}),e}function tt(t){return{absoluteTime:0,channel:t.channel,deltaTime:0,programNumber:t.instrument.number,type:"programChange"}}function rt(t){return{absoluteTime:0,deltaTime:0,meta:!0,text:t,type:"trackName"}}function nt(t){return{absoluteTime:t.ticks,deltaTime:0,meta:!0,microsecondsPerBeat:Math.floor(6e7/t.bpm),type:"setTempo"}}function it(t){return{absoluteTime:t.ticks,deltaTime:0,denominator:t.timeSignature[1],meta:!0,metronome:24,numerator:t.timeSignature[0],thirtyseconds:8,type:"timeSignature"}}function at(t){var e=Ge.keySignatureKeys.indexOf(t.key);return{absoluteTime:t.ticks,deltaTime:0,key:e+7,meta:!0,scale:t.scale==="major"?0:1,type:"keySignature"}}function st(t){return{absoluteTime:t.ticks,deltaTime:0,meta:!0,text:t.text,type:t.type}}function ot(t){var e={header:{format:1,numTracks:t.tracks.length+1,ticksPerBeat:t.header.ppq},tracks:w([w(w(w(w([{absoluteTime:0,deltaTime:0,meta:!0,text:t.header.name,type:"trackName"}],t.header.keySignatures.map(function(r){return at(r)}),!0),t.header.meta.map(function(r){return st(r)}),!0),t.header.tempos.map(function(r){return nt(r)}),!0),t.header.timeSignatures.map(function(r){return it(r)}),!0)],t.tracks.map(function(r){return w(w(w([rt(r.name),tt(r)],Xe(r),!0),Ye(r),!0),et(r),!0)}),!0)};return e.tracks=e.tracks.map(function(r){r=r.sort(function(i,s){return i.absoluteTime-s.absoluteTime});var a=0;return r.forEach(function(i){i.deltaTime=i.absoluteTime-a,a=i.absoluteTime,delete i.absoluteTime}),r.push({deltaTime:0,meta:!0,type:"endOfTrack"}),r}),new Uint8Array((0,We.writeMidi)(e))}$.encode=ot;(function(t){var e=F&&F.__awaiter||function(f,o,h,p){function y(d){return d instanceof h?d:new h(function(I){I(d)})}return new(h||(h=Promise))(function(d,I){function T(k){try{m(p.next(k))}catch(P){I(P)}}function S(k){try{m(p.throw(k))}catch(P){I(P)}}function m(k){k.done?d(k.value):y(k.value).then(T,S)}m((p=p.apply(f,o||[])).next())})},r=F&&F.__generator||function(f,o){var h={label:0,sent:function(){if(d[0]&1)throw d[1];return d[1]},trys:[],ops:[]},p,y,d,I;return I={next:T(0),throw:T(1),return:T(2)},typeof Symbol=="function"&&(I[Symbol.iterator]=function(){return this}),I;function T(m){return function(k){return S([m,k])}}function S(m){if(p)throw new TypeError("Generator is already executing.");for(;h;)try{if(p=1,y&&(d=m[0]&2?y.return:m[0]?y.throw||((d=y.return)&&d.call(y),0):y.next)&&!(d=d.call(y,m[1])).done)return d;switch(y=0,d&&(m=[m[0]&2,d.value]),m[0]){case 0:case 1:d=m;break;case 4:return h.label++,{value:m[1],done:!1};case 5:h.label++,y=m[1],m=[0];continue;case 7:m=h.ops.pop(),h.trys.pop();continue;default:if(d=h.trys,!(d=d.length>0&&d[d.length-1])&&(m[0]===6||m[0]===2)){h=0;continue}if(m[0]===3&&(!d||m[1]>d[0]&&m[1]<d[3])){h.label=m[1];break}if(m[0]===6&&h.label<d[1]){h.label=d[1],d=m;break}if(d&&h.label<d[2]){h.label=d[2],h.ops.push(m);break}d[2]&&h.ops.pop(),h.trys.pop();continue}m=o.call(f,h)}catch(k){m=[6,k],y=0}finally{p=d=0}if(m[0]&5)throw m[1];return{value:m[0]?m[1]:void 0,done:!0}}};Object.defineProperty(t,"__esModule",{value:!0}),t.Header=t.Track=t.Midi=void 0;var a=D,i=J,s=A,n=$,l=function(){function f(o){var h=this,p=null;if(o){var y=o instanceof ArrayBuffer?new Uint8Array(o):o;p=(0,a.parseMidi)(y),p.tracks.forEach(function(d){var I=0;d.forEach(function(T){I+=T.deltaTime,T.absoluteTime=I})}),p.tracks=b(p.tracks)}this.header=new i.Header(p),this.tracks=[],o&&(this.tracks=p.tracks.map(function(d){return new s.Track(d,h.header)}),p.header.format===1&&this.tracks[0].duration===0&&this.tracks.shift())}return f.fromUrl=function(o){return e(this,void 0,void 0,function(){var h,p;return r(this,function(y){switch(y.label){case 0:return[4,fetch(o)];case 1:return h=y.sent(),h.ok?[4,h.arrayBuffer()]:[3,3];case 2:return p=y.sent(),[2,new f(p)];case 3:throw new Error("Could not load '".concat(o,"'"))}})})},Object.defineProperty(f.prototype,"name",{get:function(){return this.header.name},set:function(o){this.header.name=o},enumerable:!1,configurable:!0}),Object.defineProperty(f.prototype,"duration",{get:function(){var o=this.tracks.map(function(h){return h.duration});return Math.max.apply(Math,o)},enumerable:!1,configurable:!0}),Object.defineProperty(f.prototype,"durationTicks",{get:function(){var o=this.tracks.map(function(h){return h.durationTicks});return Math.max.apply(Math,o)},enumerable:!1,configurable:!0}),f.prototype.addTrack=function(){var o=new s.Track(void 0,this.header);return this.tracks.push(o),o},f.prototype.toArray=function(){return(0,n.encode)(this)},f.prototype.toJSON=function(){return{header:this.header.toJSON(),tracks:this.tracks.map(function(o){return o.toJSON()})}},f.prototype.fromJSON=function(o){var h=this;this.header=new i.Header,this.header.fromJSON(o.header),this.tracks=o.tracks.map(function(p){var y=new s.Track(void 0,h.header);return y.fromJSON(p),y})},f.prototype.clone=function(){var o=new f;return o.fromJSON(this.toJSON()),o},f}();t.Midi=l;var u=A;Object.defineProperty(t,"Track",{enumerable:!0,get:function(){return u.Track}});var c=J;Object.defineProperty(t,"Header",{enumerable:!0,get:function(){return c.Header}});function b(f){for(var o=[],h=0;h<f.length;h++)for(var p=o.length,y=new Map,d=Array(16).fill(0),I=0,T=f[h];I<T.length;I++){var S=T[I],m=p,k=S.channel;if(k!==void 0){S.type==="programChange"&&(d[k]=S.programNumber);var P=d[k],W="".concat(P," ").concat(k);y.has(W)?m=y.get(W):(m=p+y.size,y.set(W,m))}o[m]||o.push([]),o[m].push(S)}return o}})(ue);const C=class{static save(e){this.getSaveNames().includes(e)||localStorage.setItem("midi2mml::advOpt.saveNames",JSON.stringify([...C.getSaveNames(),e])),localStorage.setItem(`midi2mml::advOpt.saves[${e}]`,JSON.stringify(C.current))}static saveCurrent(){localStorage.setItem("midi2mml::advOpt.lastSave",JSON.stringify(C.current))}static getSaveNames(){var e;return JSON.parse((e=localStorage.getItem("midi2mml::advOpt.saveNames"))!=null?e:"[]")}static loadFromSave(e){const r=localStorage.getItem(`midi2mml::advOpt.saves[${e}]`);r&&(C.current=JSON.parse(r))}static loadLastSave(){const e=localStorage.getItem("midi2mml::advOpt.lastSave");e&&(C.current=JSON.parse(e))}};let g=C;ie(g,"current");function ct(){var t;return JSON.parse((t=localStorage.getItem("midi2mml::advOpt.enabled"))!=null?t:"false")}function ut(t,e,r){let a=r;for(let i=0;i<e.length;i++)if(t===e[i][0]){a=e[i][1];break}return a}function lt(t){const r=ht(pt(yt(pe(t.notes),"desc"))),a=[];for(const i of r){if(i.length==0)break;let s=(g.current.startAtMeasure-1)*512,n=0,l="";for(let u=0;u<i.length;u++){const c=i[u],b=c.durationTicks,f=c.ticks,o=c.octave-1;if(!(c.ticks<(g.current.startAtMeasure-1)*512)){if(g.current.endAtMeasure>0&&f>512*g.current.endAtMeasure)break;for(de(s,c)&&(l+=me(f-s),s+=f-s);o!=n;)o>n?(l+=">",n++):o<n&&(l+="<",n--);l+=`${dt(c.name)}${Y(b)}`,s+=c.durationTicks}}a.push(l.trim())}return a}function oe(t){let e="";const r=mt(t),a=Object.entries(pe(r.notes));for(const[,i]of a)if(i[0].name=="R")e+=me(i[0].durationTicks);else{let s=0;i.forEach(n=>s+=ft(n)),e+=`@${s}c${Y(i[0].durationTicks)}`}return e.trim()}function de(t,e){return e.ticks>t}function me(t){return`r${Y(t)}`}function ft(t){return ut(t.name,[["C2",1],["E2",2],["F2",4],["A2",8],["C3",16],["XX",32],["D2",64],["F#2",128],["A#2",256],["C#3",512],["D#3",1024]],0)}function Y(t){let e=t,r="";for(;e>0;)e>=512?(e=e-512,r+="1&"):e>=256?(e=e-256,r+="2&"):e>=128?(e=e-128,r+="4&"):e>=64?(e=e-64,r+="8&"):e>=32?(e=e-32,r+="16&"):e>=16?(e=e-16,r+="32&"):(r=r.slice(0,r.length-1),r+=`%${Math.floor(e/2)}&`,e=0);return r.slice(0,r.length-1)}function ht(t){const e=[];let r=-1,a=0;return t.forEach(i=>{r!=i.ticks?(r=i.ticks,a=0):a+=1,e[a]==null&&e.push([]),e[a].push(i)}),e}function dt(t){return t.toLowerCase().slice(0,t.length-1).replace("#","+")}function mt(t){var s,n,l;let e=0,r,a={...t,notes:[]};const i=u=>e==0?de(e,u):r!=null?u.ticks-r.ticks>r.duration:!1;for(const u of t.notes){const{ticks:c}=u;if(i(u))for(;e<c;)if((e%512||0)===0){const f={ticks:e,durationTicks:512,midi:0,velocity:0,name:"R"};e+=512,(s=a.notes)==null||s.push(f)}else{const f={ticks:e,durationTicks:u.ticks-e,midi:0,velocity:0,name:"R"};e+=u.ticks-e,(n=a.notes)==null||n.push(f);break}(l=a.notes)==null||l.push(u),e=u.ticks+u.durationTicks,r=u}return a}function pt(t){return Object.values(t).flat(4)}function yt(t,e="asc"){const r={};for(const[a,i]of Object.entries(t)){const s=i.sort(e=="desc"?gt:bt);r[a.toString()]=s}return r}function pe(t){const e={};let r=0;return t.forEach(a=>{r=a.ticks,e[r.toString()]==null&&(e[r.toString()]=[]),e[r.toString()].push(a)}),e}function ce(t){return t==null||t.length==0||g.current.rhythmPresets.replace(/\s/g,"").split(",").forEach(r=>{const[a,i]=r.split("=");t=t.replaceAll(a,i)}),t}function bt(t,e){return t.midi-e.midi}function gt(t,e){return e.midi-t.midi}const vt=document.querySelector("#inputMidi"),kt=document.querySelector("#btnConvert"),It=document.querySelector("#advOptToggle"),xt=document.querySelector("#tracks"),Tt=document.querySelector("#saveOptBtn"),St=document.querySelector("#loadOptBtn"),wt=document.querySelector("#resetOptBtn"),K=document.querySelector("#advOptWrapper"),Z=document.querySelector("#startAtMeasure"),ee=document.querySelector("#endAtMeasure"),te=document.querySelector("#midiOffset"),re=document.querySelector("#rhythmPresets"),ne=document.querySelector("#processAsRhythm"),ye=xt.querySelector("tbody"),O={startAtMeasure:0,endAtMeasure:0,midiOffset:0,rhythmPresets:"",processAsRhythm:"9"};let B=!1;window.onload=()=>{kt.addEventListener("click",Ut),It.onclick=t=>{t.preventDefault(),B=!B,B?K.classList.remove("hidden"):K.classList.add("hidden"),localStorage.setItem("midi2mml::advOpt.enabled",JSON.stringify(B))},Tt.onclick=()=>{const t=Object.entries(localStorage).filter(([r])=>r.includes("midi2mml::saves")),e=prompt("Save as:",t.length.toString());e&&(g.save(e),alert(`Saved as "${e}"`))},St.onclick=()=>{let t="Available Saves:";t+=`
${g.getSaveNames()}`,t+=`

Enter save name to load:`;const e=prompt(t);e&&(g.loadFromSave(e),g.saveCurrent(),X())},wt.onclick=()=>{g.current=O,X()},Ct(),X(),Z.onchange=()=>_(),ee.onchange=()=>_(),te.onchange=()=>_(),re.onchange=()=>_(),ne.onchange=()=>_(),ct()&&(K.classList.remove("hidden"),B=!0)};function Ut(){const t=vt.files[0];if(t){const e=URL.createObjectURL(t);ue.Midi.fromUrl(e).then(r=>{ye.textContent="",Ot(r)})}else alert("Select the file first.")}function Ot(t){const e=g.current.processAsRhythm.split(",");for(let r=0;r<t.tracks.length;r++){const a=t.tracks[r],i=ye.insertRow(),[s,n,l,u]=[i.insertCell(),i.insertCell(),i.insertCell(),i.insertCell()];if(s.appendChild(document.createTextNode(r.toString())),n.appendChild(document.createTextNode(a.channel.toString())),l.appendChild(document.createTextNode(a.name)),e.includes(a.channel)){const c=oe(a),b=document.createElement("div");b.textContent=g.current.rhythmPresets?ce(c):c,u.appendChild(b)}else(g.current.processAsRhythm.split(",").map(f=>f.trim()).includes(a.channel.toString())?[oe(a)]:lt(a)).forEach(f=>{const o=document.createElement("div");o.textContent=g.current.rhythmPresets?ce(f):f,u.appendChild(o)})}}function Ct(){g.current={...O},g.loadLastSave()}function _(){g.current={startAtMeasure:parseInt(Z.value),endAtMeasure:parseInt(ee.value),midiOffset:parseInt(te.value),rhythmPresets:re.value,processAsRhythm:ne.value},setTimeout(()=>{g.saveCurrent()},1e3)}function X(){var t,e,r,a,i,s,n,l;Z.value=((e=(t=g.current)==null?void 0:t.startAtMeasure)==null?void 0:e.toString())||O.startAtMeasure,ee.value=((a=(r=g.current)==null?void 0:r.endAtMeasure)==null?void 0:a.toString())||O.endAtMeasure,te.value=((s=(i=g.current)==null?void 0:i.midiOffset)==null?void 0:s.toString())||O.midiOffset,re.value=((n=g.current)==null?void 0:n.rhythmPresets)||O.rhythmPresets,ne.value=((l=g.current)==null?void 0:l.processAsRhythm)||O.processAsRhythm}