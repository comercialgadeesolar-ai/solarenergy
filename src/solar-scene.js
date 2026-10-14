import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createSolarScene(container, onSelect, onViewChange = () => {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    container.parentElement.querySelector('.scene-fallback').hidden = false;
    container.parentElement.classList.add('no-webgl');
    let paused = false;
    return { select() {}, focusEarth() {}, setEarthZoom() {}, toggle() { paused = !paused; return paused; }, zoom() {}, reset() {} };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x070c13, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const solarSystem = new THREE.Group();
  scene.add(solarSystem);
  // Positive Y rotation is counterclockwise when viewed from above (+Y).
  const systemRotationSpeed = 0.006;
  const orbitTimeScale = 0.015;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 180);
  const initial = new THREE.Vector3(0, 14, 24);
  camera.position.copy(initial);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minDistance = 15;
  controls.maxDistance = 46;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI * 0.7;
  controls.target.set(0, 0, 0);
  controls.update();
  scene.add(new THREE.AmbientLight(0x829eb8, 1.1));
  const sunlight = new THREE.PointLight(0xffd0a0, 65, 80, 1.3);
  sunlight.position.set(0, 1, 0);
  scene.add(sunlight);
  const rim = new THREE.DirectionalLight(0x809dca, 2);
  rim.position.set(-5, 8, 9);
  scene.add(rim);

  // Procedural surface textures keep the experience independent of external services.
  function texture(type, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 256);
    let seed = 1793;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    if (type === 'earth') {
      ctx.fillStyle = '#245c89'; ctx.fillRect(0, 0, 512, 256);
      const continents = [ [[60,60],[88,34],[126,49],[144,79],[117,90],[105,112],[77,89]], [[128,113],[157,125],[166,157],[146,193],[132,211],[121,164]], [[250,51],[275,37],[309,50],[339,32],[406,47],[460,74],[441,99],[396,114],[361,91],[334,106],[319,88],[285,100],[260,81]], [[261,100],[292,101],[318,131],[299,172],[279,183],[266,139]], [[392,176],[421,166],[450,186],[442,208],[409,212]] ];
      for (const shape of continents) {
        ctx.beginPath(); shape.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath();
        ctx.fillStyle = '#6e9573'; ctx.fill();
        ctx.strokeStyle = '#b4b08a'; ctx.lineWidth = 5; ctx.stroke();
      }
      ctx.fillStyle = '#e9eff3'; ctx.fillRect(0,0,512,13); ctx.fillRect(0,244,512,12);
      for(let i=0;i<140;i++) { ctx.fillStyle = `rgba(235,244,249,${random() * .35})`; ctx.beginPath(); ctx.ellipse(random()*512,random()*256,random()*23+3,random()*3+1,0,0,Math.PI*2);ctx.fill(); }
    } else if (type === 'gas') {
      for(let y=0;y<256;y++) {
        const wave = Math.sin(y * .13) * .5 + Math.sin(y * .41) * .2;
        ctx.fillStyle = wave > 0 ? `rgba(255,235,214,${Math.abs(wave)*.55})` : `rgba(70,35,27,${Math.abs(wave)*.5})`;
        ctx.fillRect(0,y,512,1);
      }
      if (color === '#b79a82') {ctx.fillStyle='#a86448';ctx.beginPath();ctx.ellipse(360,163,27,9,-.06,0,Math.PI*2);ctx.fill();}
    } else {
      for(let i=0;i<4500;i++) {
        const x=random()*512,y=random()*256,r=random()*(type === 'sun'?7:5)+1;
        ctx.fillStyle = random()>.5 ? `rgba(255,223,150,${random()*.3})` : `rgba(65,24,10,${random()*.28})`;
        ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      }
    }
    const map = new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return map;
  }
  const sunMap = texture('sun', '#ff9e22');
  const sun = new THREE.Mesh(new THREE.SphereGeometry(2.04, 64, 48), new THREE.MeshBasicMaterial({ map: sunMap, color: 0xffb45b }));
  sun.userData.name = 'Sol'; solarSystem.add(sun);
  const glowCanvas = document.createElement('canvas');glowCanvas.width=256;glowCanvas.height=256;
  const glowCtx = glowCanvas.getContext('2d');
  const gradient = glowCtx.createRadialGradient(128,128,8,128,128,128);
  gradient.addColorStop(0,'rgba(255,195,78,0.8)');gradient.addColorStop(.26,'rgba(255,159,39,0.6)');gradient.addColorStop(.45,'rgba(255,127,23,0.13)');gradient.addColorStop(1,'rgba(255,101,20,0)');
  glowCtx.fillStyle=gradient;glowCtx.fillRect(0,0,256,256);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.scale.set(11,11,1);solarSystem.add(glow);
  const pickables = [sun];
  const definitions = [
    ['Mercúrio',3.2,.13,'#9b9389',.3,2.5,'rock'],
    ['Vênus',4.05,.23,'#d6aa78',.22,4.0,'rock'],
    ['Terra',5.05,.32,'#548fb8',.17,.45,'earth'],
    ['Marte',6.1,.21,'#c56a45',.13,3.5,'rock'],
    ['Júpiter',7.6,.67,'#b79a82',.07,5.5,'gas'],
    ['Saturno',9.4,.51,'#c5b591',.05,2.9,'gas'],
    ['Urano',11,.32,'#7fc4ce',.035,4.2,'gas'],
    ['Netuno',12.5,.31,'#537cc8',.028,.95,'gas'],
  ];
  const planets = definitions.map(([name,distance,size,color,speed,angle,type]) => {
    const points = Array.from({length:161},(_,i)=> new THREE.Vector3(Math.cos(i/160*Math.PI*2)*distance,0,Math.sin(i/160*Math.PI*2)*distance));
    const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x7290a2,transparent:true,opacity:.16}));solarSystem.add(orbit);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(size,type === 'earth' ? 64 : 32,type === 'earth' ? 48 : 24),new THREE.MeshStandardMaterial({map:texture(type,color),roughness:1,metalness:0}));
    mesh.userData.name=name;
    mesh.position.set(Math.cos(angle)*distance,0,Math.sin(angle)*distance);
    solarSystem.add(mesh);pickables.push(mesh);
    if(name === 'Saturno') {
      const ring = new THREE.Mesh(new THREE.RingGeometry(size*1.4,size*2.1,80),new THREE.MeshBasicMaterial({color:0xc9b99a,side:THREE.DoubleSide,transparent:true,opacity:.6}));ring.rotation.x=-Math.PI/2+.3;mesh.add(ring);
    }
    return {mesh,distance,speed,angle,orbit};
  });
  const earth = planets.find(planet => planet.mesh.userData.name === 'Terra');
  const earthMinDistance = 1.05;
  const earthMaxDistance = 4.5;
  let earthFocused = false;
  let lastViewState = '';
  const followOffset = new THREE.Vector3();
  const earthWorldPosition = new THREE.Vector3();

  function reportView() {
    const distance = camera.position.distanceTo(controls.target);
    const zoomPercent = earthFocused ? Math.round(THREE.MathUtils.clamp((earthMaxDistance - distance) / (earthMaxDistance - earthMinDistance) * 100, 0, 100)) : 0;
    const state = `${earthFocused}:${zoomPercent}`;
    if (state === lastViewState) return;
    lastViewState = state;
    onViewChange({ earthFocused, zoomPercent });
  }

  function setSceneVisibility(focused) {
    sun.visible = !focused;
    glow.visible = !focused;
    for (const planet of planets) {
      planet.mesh.visible = !focused || planet === earth;
      planet.orbit.visible = !focused;
    }
  }

  function focusEarth() {
    if (earthFocused) return;
    earthFocused = true;
    setSceneVisibility(true);
    controls.minDistance = earthMinDistance;
    controls.maxDistance = earthMaxDistance;
    earth.mesh.getWorldPosition(earthWorldPosition);
    controls.target.copy(earthWorldPosition);
    const startingDistance = earthMaxDistance - .8 * (earthMaxDistance - earthMinDistance);
    camera.position.copy(controls.target).add(initial.clone().normalize().multiplyScalar(startingDistance));
    controls.update();
    reportView();
  }

  function setEarthZoom(percent) {
    if (!earthFocused || !Number.isFinite(percent)) return;
    const distance = earthMaxDistance - THREE.MathUtils.clamp(percent, 0, 100) / 100 * (earthMaxDistance - earthMinDistance);
    const direction = camera.position.clone().sub(controls.target).setLength(distance);
    camera.position.copy(controls.target).add(direction);
    controls.update();
    reportView();
  }

  function reset() {
    earthFocused = false;
    setSceneVisibility(false);
    controls.minDistance = 15;
    controls.maxDistance = 46;
    camera.position.copy(initial);
    controls.target.set(0,0,0);
    controls.update();
    planets.forEach(planet => { planet.orbit.material.opacity = .16; });
    reportView();
  }
  let seed = 43;
  const random = () => {seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const stars = new Float32Array(650*3);
  for(let i=0;i<650;i++){ stars[i*3]=(random()-.5)*110;stars[i*3+1]=(random()-.5)*75;stars[i*3+2]=-15-random()*60; }
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(stars,3));
  scene.add(new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0xb6c4d1,size:.04,transparent:true,opacity:.7,sizeAttenuation:true})));
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(paused) {const button=container.parentElement.querySelector('#toggle-orbit');button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Retomar órbitas');button.innerHTML='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m8 4 12 8-12 8Z"/></svg>';}
  let visible = true;
  new IntersectionObserver(entries => {visible=entries[0].isIntersecting;}).observe(container);
  const raycaster = new THREE.Raycaster();const pointer = new THREE.Vector2();
  function intersection(event) {
    const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(pickables.filter(mesh => mesh.visible),false)[0];
  }
  let down = {x:0,y:0};
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
  renderer.domElement.addEventListener('pointerup',e=>{
    if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;
    const hit=intersection(e);
    if(!hit)return;
    if(hit.object.userData.name === 'Terra') {
      focusEarth();
      onSelect('Terra', true);
    } else {
      onSelect(hit.object.userData.name, false);
    }
  });
  renderer.domElement.addEventListener('pointermove',e=>{renderer.domElement.style.cursor=intersection(e)?'pointer':'grab';});
  renderer.domElement.addEventListener('wheel',event=>{
    if(Math.abs(event.deltaY)<1)return;
    // Modifier key leaves ordinary page scrolling available on touchpads.
    if(!event.ctrlKey && !event.shiftKey)return;
    event.preventDefault();zoom(event.deltaY>0?1.06:.94);
  },{passive:false});
  const hint=container.parentElement.querySelector('.scene-hint span');hint.innerHTML='Arraste para explorar <span class="hint-dot">·</span> Ctrl + scroll para aproximar';
  function zoom(factor){const direction=camera.position.clone().sub(controls.target);direction.setLength(THREE.MathUtils.clamp(direction.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(direction);controls.update();reportView();}
  const observer=new ResizeObserver(entries=>{const {width,height}=entries[0].contentRect;if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();});observer.observe(container);
  let previous = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    const dt=Math.min((now-previous)/1000,.05);previous=now;
    if(!visible || document.hidden)return;
    if(!paused)solarSystem.rotation.y+=dt*systemRotationSpeed;
    for(const planet of planets){
      if(!paused){
        // x = cos(angle), z = sin(angle): decreasing angle rotates counterclockwise.
        planet.angle-=planet.speed*dt*orbitTimeScale;
        planet.mesh.rotation.y+=dt*.02;
      }
      planet.mesh.position.set(Math.cos(planet.angle)*planet.distance,0,Math.sin(planet.angle)*planet.distance);
    }
    // Follow Earth's orbit while preserving the user's camera angle and distance.
    if(earthFocused) {
      earth.mesh.getWorldPosition(earthWorldPosition);
      followOffset.copy(earthWorldPosition).sub(controls.target);
      camera.position.add(followOffset);
      controls.target.copy(earthWorldPosition);
    }
    if(!paused)sun.rotation.y+=dt*.005;
    controls.update();renderer.render(scene,camera);
  }
  requestAnimationFrame(animate);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();container.parentElement.querySelector('.scene-fallback').hidden=false;});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{container.parentElement.querySelector('.scene-fallback').hidden=true;});
  return {
    toggle(){paused=!paused;return paused;},
    zoom,
    reset,
    focusEarth,
    setEarthZoom,
    select(name){planets.forEach(p=>{p.orbit.material.opacity=p.mesh.userData.name===name?.5:.16;});},
  };
}
