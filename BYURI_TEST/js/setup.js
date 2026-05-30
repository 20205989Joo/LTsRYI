function init(){
  resize();
  initCannons();
  initByuris();
  initEvents();
  updatePauseButton();
  updateHud();
}

function initCannons(){
  cannons.length=0;
  cannonHudBars.innerHTML="";

  for(var i=0;i<directions.length;i++){
    var dir=directions[i];
    var displayName=dir.label || dir.name;
    var r=Math.min(w,h)*0.23;
    var x=cx+Math.cos(dir.angle)*r;
    var y=cy+Math.sin(dir.angle)*r;

    var row=document.createElement("div");
    row.className="hudCannonRow";
    row.innerHTML='<div class="hudCannonName">'+displayName+'</div><div class="hudEnergyTrack"><div class="hudEnergyFill"></div></div><div class="hudEnergyPct">100%</div><div class="hudCannonDamage">DMG 17</div>';
    cannonHudBars.appendChild(row);

    var fill=row.querySelector(".hudEnergyFill");
    fill.style.background=dir.bulletColor;
    fill.style.color=dir.bulletColor;

    cannons.push({
      index:i,
      name:displayName,
      x:x,
      y:y,
      r:24,
      angle:dir.angle,
      bulletColor:dir.bulletColor,
      laneColor:dir.laneColor,
      level:1,
      correctCount:0,
      energy:100,
      charged:true,
      damage:17,
      cooldown:.56,
      fireTimer:Math.random()*.25,
      range:330,
      doubleShotChance:0,
      burstEnabled:false,
      burstInterval:8,
      burstTimer:4+Math.random()*2,
      hudFill:fill,
      hudPct:row.querySelector(".hudEnergyPct"),
      hudDamage:row.querySelector(".hudCannonDamage")
    });
  }
}

function initByuris(){
  byuris.length=0;

  for(var i=0;i<4;i++){
    byuris.push({
      baseAngle:Math.random()*Math.PI*2,
      orbit:58+Math.random()*40,
      heightSeed:Math.random()*Math.PI*2,
      mode:"support",
      x:cx,
      y:cy,
      vx:0,
      vy:0,
      phase:Math.random()*Math.PI*2,
      baseScale:.7+Math.random()*.12,
      blessTimer:0,
      blessDuration:1.45,
      blessCannon:null
    });
  }
}

function initEvents(){
  window.addEventListener("resize",resize);
  window.addEventListener("wheel",preventPageZoom,{passive:false});
  window.addEventListener("keydown",preventZoomKeys);
  canvas.addEventListener("pointerdown",onPointerDown);
  closeWindow.addEventListener("click",closeStatus);
  restartBtn.addEventListener("click",resetGame);
  pauseBtn.addEventListener("click",toggleDebugPause);
  leftPanelToggle.addEventListener("click",makePanelToggle("left"));
  rightPanelToggle.addEventListener("click",makePanelToggle("right"));
}

function makePanelToggle(side){
  return function(){
    toggleSidePanel(side);
  };
}

function toggleSidePanel(side){
  if(!gameDesk) return;

  var leftOpen = side === "left" && !gameDesk.classList.contains("leftPanelOpen");
  var rightOpen = side === "right" && !gameDesk.classList.contains("rightPanelOpen");

  gameDesk.classList.toggle("leftPanelOpen",leftOpen);
  gameDesk.classList.toggle("rightPanelOpen",rightOpen);
}

function toggleDebugPause(){
  if(game.gameOver) return;

  game.debugPaused = !game.debugPaused;
  updatePauseButton();
}

function updatePauseButton(){
  if(!pauseBtn) return;

  pauseBtn.textContent = game.debugPaused ? ">" : "II";
  pauseBtn.classList.toggle("paused",game.debugPaused);
}

function preventPageZoom(e){
  if(e.ctrlKey || e.metaKey){
    e.preventDefault();
  }
}

function preventZoomKeys(e){
  if(!(e.ctrlKey || e.metaKey)) return;

  var key = e.key;
  var code = e.code;
  var zoomKey = key === "+" || key === "-" || key === "=" || key === "_" || key === "0" || code === "NumpadAdd" || code === "NumpadSubtract" || code === "Numpad0";

  if(zoomKey){
    e.preventDefault();
  }
}

function resize(){
  w=STAGE_W;
  h=STAGE_H;
  cx=w*0.5;
  cy=h*CORE_Y_RATIO;
  DPR=Math.min(window.devicePixelRatio||1,2);

  canvas.width=Math.floor(w*DPR);
  canvas.height=Math.floor(h*DPR);
  canvas.style.width=w+"px";
  canvas.style.height=h+"px";
  ctx.setTransform(DPR,0,0,DPR,0,0);

  gameViewport.style.width=FRAME_W+"px";
  gameViewport.style.height=FRAME_H+"px";
  gameShell.style.width=STAGE_W+"px";
  gameShell.style.height=STAGE_H+"px";

  var r=Math.min(w,h)*0.23;
  for(var i=0;i<cannons.length;i++){
    var c=cannons[i];
    c.x=cx+Math.cos(c.angle)*r;
    c.y=cy+Math.sin(c.angle)*r;
  }
}

