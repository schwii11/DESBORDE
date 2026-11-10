import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $=s=>document.querySelector(s),canvas=$('#scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x020202);scene.fog=new THREE.FogExp2(0x020202,.018);
const camera=new THREE.PerspectiveCamera(30,innerWidth/innerHeight,.1,80);camera.position.set(3.7,.25,10.25);
const controls=new OrbitControls(camera,canvas);controls.target.set(0,.05,0);controls.enableDamping=true;controls.dampingFactor=.055;controls.minDistance=8.5;controls.maxDistance=15;controls.autoRotate=false;controls.autoRotateSpeed=.16;controls.update();
let lastCameraInput=performance.now();controls.addEventListener('start',()=>{lastCameraInput=performance.now();controls.autoRotate=false});controls.addEventListener('end',()=>lastCameraInput=performance.now());

scene.add(new THREE.HemisphereLight(0xe9edf2,0x090207,1.2));
const key=new THREE.SpotLight(0xffffff,90,30,.42,.58,1.1);key.position.set(-5,7,7);key.target.position.set(0,.4,0);scene.add(key,key.target);
const redLight=new THREE.SpotLight(0xd20925,70,24,.48,.65,1.2);redLight.position.set(5,2,-4);redLight.target.position.set(0,0,0);scene.add(redLight,redLight.target);
const rim=new THREE.DirectionalLight(0xd7e0e8,8);rim.position.set(-3,3,-5);scene.add(rim);
const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(2.15,2.3,.16,72),new THREE.MeshPhysicalMaterial({color:0x121214,metalness:.9,roughness:.13,clearcoat:1}));pedestal.position.y=-3.48;scene.add(pedestal);
const ring=new THREE.Mesh(new THREE.TorusGeometry(2.18,.018,8,100),new THREE.MeshBasicMaterial({color:0xe8e3e2}));ring.rotation.x=Math.PI/2;ring.position.y=-3.39;scene.add(ring);

const sculpture=new THREE.Group(),filamentGroup=new THREE.Group(),volumeGroup=new THREE.Group(),membraneGroup=new THREE.Group();scene.add(sculpture,filamentGroup,volumeGroup,membraneGroup);
const modelMeshes=[],anchors=new Map(),filaments=[],volumes=[],membranes=[],memory=[],counts={hilo:0,volumen:0,velo:0,toque:0},participants=new Map(),lastSeq=new Map();
let mannequin=null,mannequinBaseY=0,mixer=null,selectedMaterial='auto',activePointer=null,pointerStart=0,lastSample=0,blowForce=0,audioContext=null,active=false,revealing=false,frameCounter=0,fpsTime=performance.now(),lastFrame=performance.now();
const glass=new THREE.MeshPhysicalMaterial({color:0xd7d0d1,metalness:.03,roughness:.04,transmission:.94,transparent:true,opacity:.52,thickness:.42,ior:1.22,clearcoat:1,clearcoatRoughness:.025,attenuationColor:new THREE.Color(0x8d2633),attenuationDistance:4.8,side:THREE.DoubleSide,depthWrite:false});

function findBone(root,tokens){let found=null;root.traverse(o=>{const n=o.name.toLowerCase();if(!found&&o.isBone&&tokens.every(t=>n.includes(t)))found=o});return found}
function makeAnchor(name,tokens,fallback){const a=new THREE.Object3D();a.name='anchor-'+name;const bone=findBone(mannequin,tokens);if(bone)bone.add(a);else{a.position.set(...fallback);mannequin.add(a)}anchors.set(name,a)}
function anchorPoint(name){const p=new THREE.Vector3();anchors.get(name)?.getWorldPosition(p);return p}
const domAnchor={shoulderL:[44,27],shoulderR:[61,27],armL:[39,43],armR:[65,43],chest:[53,34],waist:[53,50],hipL:[47,57],hipR:[59,57],thighL:[48,72],thighR:[58,72],back:[53,39]};
function addMaterialLayer(type,intensity=.6){const layer=document.createElement('img');layer.className=`material-piece ${type}`;layer.src=type==='membrane'?'assets/membranas.png':'assets/volumen-carmesi.png';const shift=(Math.random()-.5)*10,turn=(Math.random()-.5)*(type==='membrane'?14:24),scale=.7+intensity*.42;layer.style.left=`${53+shift}%`;layer.style.transform=`translate(-50%,-50%) rotate(${turn}deg) scale(.05)`;layer.style.setProperty('--final-scale',scale);$('#materialLayers').append(layer);while($('#materialLayers').children.length>7)$('#materialLayers').firstElementChild.remove()}
function addThreadLayer(fromName,toName,intensity=.6){const [x1,y1]=domAnchor[fromName]||domAnchor.chest,[x2,y2]=domAnchor[toName]||domAnchor.waist,svg=$('#threadLayers'),p=document.createElementNS('http://www.w3.org/2000/svg','path'),bend=(Math.random()-.5)*22;p.setAttribute('d',`M ${x1} ${y1} C ${x1+bend} ${(y1+y2)/2}, ${x2-bend} ${(y1+y2)/2}, ${x2} ${y2}`);p.style.strokeWidth=String(.08+intensity*.13);svg.append(p);while(svg.children.length>45)svg.firstElementChild.remove()}
function configureModel(gltf){
  mannequin=gltf.scene;
  let box=new THREE.Box3().setFromObject(mannequin),height=box.max.y-box.min.y,scale=6.55/height;mannequin.scale.setScalar(scale);
  box.setFromObject(mannequin);const center=box.getCenter(new THREE.Vector3());mannequin.position.set(-center.x,-3.36-box.min.y,-center.z);mannequinBaseY=mannequin.position.y;mannequin.rotation.y=-.12;
  mannequin.traverse(o=>{if(o.isMesh){o.material=glass;o.castShadow=true;o.frustumCulled=false;modelMeshes.push(o)}});sculpture.add(mannequin);
  if(gltf.animations?.length){mixer=new THREE.AnimationMixer(mannequin);const idle=gltf.animations.find(a=>/idle/i.test(a.name))||gltf.animations[0];mixer.clipAction(idle).play()}
  makeAnchor('shoulderL',['left','shoulder'],[-.9,1.8,0]);makeAnchor('shoulderR',['right','shoulder'],[.9,1.8,0]);makeAnchor('armL',['left','forearm'],[-1.1,.65,0]);makeAnchor('armR',['right','forearm'],[1.1,.65,0]);
  makeAnchor('chest',['spine','2'],[0,1.35,.18]);makeAnchor('waist',['spine'],[0,.05,.12]);makeAnchor('hipL',['left','upleg'],[-.58,-.72,0]);makeAnchor('hipR',['right','upleg'],[.58,-.72,0]);
  makeAnchor('thighL',['left','leg'],[-.42,-1.8,0]);makeAnchor('thighR',['right','leg'],[.42,-1.8,0]);makeAnchor('back',['spine','1'],[0,.9,-.35]);
  seedComposition('completa');$('#loader').classList.add('hidden');
}
new GLTFLoader().load('assets/maniqui-xbot.glb',configureModel,undefined,error=>{console.error(error);$('#loader small').textContent='ERROR AL CARGAR EL MANIQUÍ'});

function disposeObject(o){o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose()}
function curveBetween(start,end,tension=.5,seed=Math.random()*10){const d=end.clone().sub(start),n=new THREE.Vector3(-d.y,d.x,0).normalize(),a=start.clone().lerp(end,.32).addScaledVector(n,(.22+tension*.34)*Math.sin(seed)),b=start.clone().lerp(end,.7).addScaledVector(n,(.16+tension*.28)*Math.cos(seed*1.7));b.z+=Math.sin(seed)*.55;return new THREE.CatmullRomCurve3([start,a,b,end],false,'centripetal',.48)}
function createFilament(fromName,toName,intensity=.55,spatialEnd=null){
  if(!mannequin)return;if(filaments.length>=40){const old=filaments.shift();filamentGroup.remove(old.mesh);disposeObject(old.mesh)}
  const start=anchorPoint(fromName),end=spatialEnd||anchorPoint(toName),curve=curveBetween(start,end,intensity),geo=new THREE.TubeGeometry(curve,42,.008+intensity*.012,5,false);
  const mat=new THREE.MeshPhysicalMaterial({color:intensity>.72?0xf21a35:0xa91025,metalness:.28,roughness:.24,clearcoat:.75,emissive:0x2a0005,emissiveIntensity:.18}),mesh=new THREE.Mesh(geo,mat);mesh.scale.setScalar(.01);filamentGroup.add(mesh);
  filaments.push({mesh,fromName,toName,intensity,growth:.01,phase:Math.random()*6});addThreadLayer(fromName,toName,intensity);counts.hilo++;record('hilo',intensity,start)
}
function createFilamentFamily(a,b,intensity=.55,amount=4){for(let i=0;i<amount;i++){const offset=new THREE.Vector3((i-(amount-1)/2)*.045,Math.sin(i*2.1)*.035,i*.018);createFilament(a,b,intensity*(.9+i*.025),anchorPoint(b).add(offset))}}
function organicGeometry(intensity,seed){const g=new THREE.SphereGeometry(.42,34,24),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),l=1+Math.sin(y*5+seed)*.16+Math.cos(x*6-seed)*.1;p.setXYZ(i,x*l*(.62+intensity*.35),y*l*(.9+intensity*.55),z*l*(.58+intensity*.4))}g.computeVertexNormals();return g}
function createVolume(anchorName,intensity=.65,direction=new THREE.Vector3(1,.25,0)){
  if(!mannequin)return;if(volumes.length>=3){const old=volumes.shift();volumeGroup.remove(old.mesh);disposeObject(old.mesh)}
  const origin=anchorPoint(anchorName),geo=organicGeometry(intensity,Math.random()*8),mat=new THREE.MeshPhysicalMaterial({color:volumes.length%2?0x210207:0x740a18,metalness:.18,roughness:.12,transmission:.42,transparent:true,opacity:.68,thickness:.65,clearcoat:1,depthWrite:false}),mesh=new THREE.Mesh(geo,mat);
  mesh.position.copy(origin).add(direction.clone().normalize().multiplyScalar(.25));mesh.rotation.set(direction.z*.4,Math.atan2(direction.x,direction.z),direction.y*.5);mesh.scale.setScalar(.01);volumeGroup.add(mesh);
  volumes.push({mesh,anchorName,intensity,growth:.01,phase:Math.random()*6});addMaterialLayer('volume',intensity);filaments.forEach(f=>{if(f.fromName.includes('hip')||f.toName?.includes('hip'))f.intensity=Math.min(1,f.intensity+.12)});counts.volumen++;record('volumen',intensity,origin)
}
function createMembrane(names,intensity=.65,tint=0xd8d1d3){
  if(!mannequin||names.length<3)return;if(membranes.length>=5){const old=membranes.shift();membraneGroup.remove(old.mesh);disposeObject(old.mesh)}
  const points=names.map(anchorPoint),center=points.reduce((s,p)=>s.add(p),new THREE.Vector3()).multiplyScalar(1/points.length),side=center.x<0?-1:1,width=2.3+intensity*1.15,height=3.5+intensity*1.35;
  const geo=new THREE.PlaneGeometry(width,height,36,30),pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const y=pos.getY(i),v=y/height+.5,taper=.06+.94*Math.pow(Math.sin(Math.PI*Math.max(.02,Math.min(.98,v))),.72);pos.setX(i,pos.getX(i)*taper)}const base=pos.array.slice(),color=new THREE.Color(tint),mat=new THREE.ShaderMaterial({uniforms:{uTime:{value:0},uColor:{value:color},uPhase:{value:Math.random()*8},uForce:{value:intensity}},vertexShader:`varying vec2 vUv; varying float vFold; uniform float uTime; uniform float uPhase; uniform float uForce; void main(){vUv=uv;vec3 p=position;float wave=sin(p.y*2.4+uTime*1.15+uPhase)*.16+cos(p.x*3.2-uTime*.8)*.1;p.z+=wave*(.65+uForce);p.x+=sin(p.y*1.7+uTime*.55+uPhase)*.12;vFold=wave;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,fragmentShader:`varying vec2 vUv; varying float vFold; uniform vec3 uColor; void main(){float shape=pow(sin(3.14159*vUv.x)*sin(3.14159*vUv.y),.34);float veins=.5+.5*sin(vUv.y*34.0+vFold*15.0);float rim=pow(1.0-abs(vUv.x-.5)*2.0,1.4);float alpha=shape*(.12+veins*.2+rim*.035);vec3 c=mix(uColor,vec3(1.0,.86,.89),.4+veins*.22);gl_FragColor=vec4(c,alpha);}`,side:THREE.DoubleSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}),mesh=new THREE.Mesh(geo,mat);
  mesh.position.copy(center).add(new THREE.Vector3(side*1.38,-.46,-.28));mesh.rotation.set(.05,side*.42,side*.08);mesh.scale.setScalar(.01);membraneGroup.add(mesh);membranes.push({mesh,base,names,intensity,growth:.01,velocity:0,phase:Math.random()*8});addMaterialLayer('membrane',intensity);counts.velo++;record('velo',intensity,center)
}
function clearMaterials(){[filamentGroup,volumeGroup,membraneGroup].forEach(g=>g.children.slice().forEach(o=>{g.remove(o);disposeObject(o)}));filaments.length=volumes.length=membranes.length=0;$('#materialLayers').replaceChildren();$('#threadLayers').replaceChildren()}
function seedComposition(preset){if(!mannequin)return;clearMaterials();if(preset==='maniqui')return;
  if(preset==='filamentos'||preset==='completa'){createFilamentFamily('shoulderL','waist',.62,3);createFilamentFamily('shoulderR','hipL',.72,3);for(let i=0;i<3;i++)createFilament(i%2?'shoulderR':'waist','hipL',.55,new THREE.Vector3((i%2?1:-1)*(1.5+i*.12),1.2-i*.62,-.2+i*.06))}
  if(preset==='volumenes'||preset==='completa')createVolume('hipR',.62,new THREE.Vector3(.65,.2,-.25));
  if(preset==='membranas'||preset==='completa')createMembrane(['shoulderL','armL','waist','hipL'],.76,0xe1d5d7)
}
function record(type,intensity,p){memory.push({type,intensity,x:+p.x.toFixed(3),y:+p.y.toFixed(3),t:performance.now()});counts.toque++;$('#gestureCount').textContent=String(memory.length).padStart(3,'0');$('#phase').textContent=memory.length<15?'CONTENCIÓN':memory.length<35?'TENSIÓN':'DESBORDE';if(memory.length>=3){$('#reveal').disabled=false;$('#reveal').title='Revelar el archivo del gesto'}}

const raycaster=new THREE.Raycaster();
function raycastNormalized(x,y){raycaster.setFromCamera(new THREE.Vector2(x*2-1,-y*2+1),camera);return raycaster.intersectObjects(modelMeshes,false)[0]||null}
function nearestAnchor(p){let result='chest',distance=Infinity;anchors.forEach((a,n)=>{const d=p.distanceTo(anchorPoint(n));if(d<distance){distance=d;result=n}});return result}
function useGesture(data){
  if(!mannequin)return;const hit=raycastNormalized(data.x,data.y);if(!hit)return;const a=nearestAnchor(hit.point),i=THREE.MathUtils.clamp(data.intensity||.4,.1,1),m=data.material||selectedMaterial;
  if(m==='volumen'&&data.phase==='end')createVolume(a,i,new THREE.Vector3(data.x-.5,.65-data.y,.25));
  else if(m==='membrana'&&data.phase==='end'){const side=a.includes('L')?'L':'R';createMembrane(a.includes('shoulder')?[a,'arm'+side,'waist','hip'+side]:['shoulderL','shoulderR','waist',a],i,Math.random()>.65?0x7e1320:0xd8d1d3)}
  else if((m==='filamento'||m==='auto')&&data.phase==='move'&&performance.now()-lastSample>135){lastSample=performance.now();const target=a==='waist'?'shoulderR':a.includes('shoulder')?'waist':a.includes('hip')?'shoulderL':'hipR';createFilament(a,target,i)}
}
canvas.addEventListener('pointerdown',e=>{if(!active)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;if(!raycastNormalized(x,y))return;controls.enabled=false;activePointer=e.pointerId;pointerStart=performance.now();canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(e.pointerId!==activePointer)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;useGesture({x,y,phase:'move',intensity:Math.min(1,.2+(performance.now()-pointerStart)/1500),material:selectedMaterial})});
function releasePointer(e){if(e.pointerId!==activePointer)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;useGesture({x,y,phase:'end',intensity:Math.min(1,(performance.now()-pointerStart)/1100),material:selectedMaterial==='auto'?'volumen':selectedMaterial});activePointer=null;controls.enabled=true;lastCameraInput=performance.now()}
canvas.addEventListener('pointerup',releasePointer);canvas.addEventListener('pointercancel',releasePointer);

function sound(type,intensity=.5){audioContext||=new AudioContext();const now=audioContext.currentTime,o=audioContext.createOscillator(),g=audioContext.createGain(),f=audioContext.createBiquadFilter();o.type=type==='hilo'?'triangle':type==='velo'?'sine':'sawtooth';o.frequency.value=type==='hilo'?120+intensity*180:type==='velo'?70:48;f.type='lowpass';f.frequency.value=400+intensity*1700;g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.035+intensity*.07,now+.02);g.gain.exponentialRampToValueAtTime(.0001,now+.55);o.connect(f).connect(g).connect(audioContext.destination);o.start();o.stop(now+.6)}
function updateMaterials(time){
  filaments.forEach(f=>{f.growth+=(1-f.growth)*.1;f.mesh.scale.setScalar(f.growth);f.mesh.rotation.z=Math.sin(time*.0018+f.phase)*(.004+f.intensity*.006+blowForce*.025)});
  volumes.forEach(v=>{v.growth+=(1-v.growth)*.075;v.mesh.scale.setScalar(v.growth*(1+Math.sin(time*.0012+v.phase)*.018))});
  membranes.forEach(m=>{m.growth+=(1-m.growth)*.065;m.velocity=m.velocity*.92+blowForce*.018;m.mesh.scale.setScalar(m.growth);m.mesh.material.uniforms.uTime.value=time*.001;m.mesh.material.uniforms.uForce.value=m.intensity+m.velocity*2.5});blowForce*=.91
}

const mqttCfg=window.DESBORDE_CONFIG||{},broker=String(mqttCfg.broker||'').trim()||'wss://broker.emqx.io:8084/mqtt',privateBroker=Boolean(mqttCfg.broker&&mqttCfg.username&&mqttCfg.password),topicPrefix=String(mqttCfg.topicPrefix||'tacto/desborde').replace(/^\/+|\/+$/g,''),room=crypto.randomUUID().slice(0,8),topic=`${topicPrefix}/${room}`;
const client=mqtt.connect(broker,{clientId:`desborde-screen-${crypto.randomUUID()}`,clean:true,reconnectPeriod:1800,connectTimeout:9000,...(privateBroker?{username:mqttCfg.username,password:mqttCfg.password}:{})});
const mobileUrl=`${location.origin}${location.pathname.replace(/[^/]*$/,'')}control.html?sala=${room}`;$('#mobileLink').href=mobileUrl;$('#mobileLink').textContent=mobileUrl;$('#roomCode').textContent=room.toUpperCase();new QRCode($('#qr'),{text:mobileUrl,width:224,height:224,colorDark:'#080808',colorLight:'#eeeeea',correctLevel:QRCode.CorrectLevel.M});
client.on('connect',()=>{client.subscribe(`${topic}/#`);$('#mqttState').textContent=privateBroker?'EMQX PRIVADO':'BROKER PÚBLICO';$('#mqttDot').classList.add('online')});
client.on('message',(channel,payload)=>{let data;try{data=JSON.parse(payload.toString())}catch{return}if(data.device)participants.set(data.device,Date.now());if(data.device&&(lastSeq.get(data.device)||0)>=(data.seq||0))return;if(data.device)lastSeq.set(data.device,data.seq||0);if(data.type==='gesture'){useGesture(data);if(data.phase==='end')sound(data.material==='membrana'?'velo':data.material==='volumen'?'volumen':'hilo',data.intensity)}if(data.type==='blow'){blowForce=Math.max(blowForce,data.intensity||.5);sound('velo',data.intensity)}$('#participantCount').textContent=participants.size;$('#finalParticipants').textContent=Math.max(1,participants.size)});

$('#enter').onclick=()=>{active=true;document.body.classList.add('experience-active');$('#presence').classList.add('hidden');$('#heroArtwork').classList.add('hidden');$('#constructionArt').classList.remove('hidden');['#hud','#legend','#counter','#experienceNav','#reveal'].forEach(s=>$(s).classList.remove('hidden'));audioContext||=new AudioContext()};
$('#connectPhone').onclick=()=>$('#connectPanel').classList.remove('hidden');$('#closeConnect').onclick=()=>$('#connectPanel').classList.add('hidden');$('#openStudio').onclick=()=>$('#studioPanel').classList.remove('hidden');$('#helpToggle').onclick=()=>$('#helpPanel').classList.remove('hidden');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).classList.add('hidden'));
$('#desktopMaterials').onclick=e=>{const b=e.target.closest('[data-material]');if(!b)return;selectedMaterial=b.dataset.material;document.querySelectorAll('#desktopMaterials button').forEach(x=>x.classList.toggle('active',x===b))};
$('#validationViews').onclick=e=>{const b=e.target.closest('[data-preset]');if(!b)return;seedComposition(b.dataset.preset);document.querySelectorAll('#validationViews button').forEach(x=>x.classList.toggle('active',x===b))};
const cameraPositions={front:[0,.4,11],three:[5.2,.8,10.5],side:[11,.4,0],back:[0,.4,-11]};
$('#cameraViews').onclick=e=>{const b=e.target.closest('[data-view]');if(!b)return;camera.position.fromArray(cameraPositions[b.dataset.view]);controls.target.set(0,.1,0);controls.update();controls.autoRotate=false;document.querySelectorAll('#cameraViews button').forEach(x=>x.classList.toggle('active',x===b))};
$('#quality').onclick=e=>{const b=e.target.closest('[data-quality]');if(!b)return;const ratios={low:.75,medium:1.15,high:1.65};renderer.setPixelRatio(Math.min(devicePixelRatio,ratios[b.dataset.quality]));document.querySelectorAll('#quality button').forEach(x=>x.classList.toggle('active',x===b))};
$('#soundToggle').onclick=e=>{const off=e.currentTarget.textContent.includes('ON');e.currentTarget.textContent=off?'SONIDO OFF':'SONIDO ON';if(audioContext)(off?audioContext.suspend():audioContext.resume()).catch(()=>{})};
$('#reveal').onclick=()=>{revealing=true;controls.autoRotate=true;controls.autoRotateSpeed=.75;['#hud','#legend','#counter','#experienceNav','#reveal'].forEach(s=>$(s).classList.add('hidden'));$('#revealAct').classList.remove('hidden');setTimeout(finishReveal,6500)};
function finishReveal(){$('#revealAct').classList.add('hidden');$('#pieceName').textContent=`ESTUDIO Nº ${String(memory.length).padStart(3,'0')} — TENSIÓN EN EXPANSIÓN`;$('#materialCount').textContent=filaments.length+volumes.length+membranes.length;$('#soundCount').textContent=memory.length;$('#dominantGesture').textContent=Object.entries(counts).filter(([k])=>k!=='toque').sort((a,b)=>b[1]-a[1])[0]?.[0].toUpperCase()||'HILO';$('#final').classList.remove('hidden')}
$('#skipReveal').onclick=finishReveal;$('#return').onclick=()=>{$('#final').classList.add('hidden');revealing=false;controls.autoRotateSpeed=.22;['#hud','#legend','#counter','#experienceNav','#reveal'].forEach(s=>$(s).classList.remove('hidden'))};
$('#export').onclick=()=>{renderer.render(scene,camera);const a=document.createElement('a');a.download='desborde-archivo-del-gesto.png';a.href=canvas.toDataURL('image/png');a.click()};
$('#exportJson').onclick=()=>{const a=document.createElement('a');a.download='desborde-memoria.json';a.href=URL.createObjectURL(new Blob([JSON.stringify({project:'DESBORDE',room,counts,events:memory},null,2)],{type:'application/json'}));a.click()};
$('#replay').onclick=()=>memory.slice(-40).forEach((e,i)=>setTimeout(()=>sound(e.type,e.intensity),i*80));

function animate(time){requestAnimationFrame(animate);const dt=Math.min(.04,(time-lastFrame)/1000||0);lastFrame=time;mixer?.update(dt);frameCounter++;if(time-fpsTime>1000){$('#fps').textContent=`${Math.round(frameCounter*1000/(time-fpsTime))} FPS`;frameCounter=0;fpsTime=time}if(performance.now()-lastCameraInput>12000&&!activePointer)controls.autoRotate=true;if(mannequin)mannequin.position.y=mannequinBaseY+Math.sin(time*.0011)*.012;updateMaterials(time);controls.update();renderer.render(scene,camera)}
animate(0);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
