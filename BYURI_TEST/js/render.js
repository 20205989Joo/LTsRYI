function draw(){
  ctx.clearRect(0,0,w,h);

  drawBackground();
  drawLanes();
  drawCore();
  drawEnemies();
  drawProjectiles();
  drawCannons();
  drawByuris();
  drawEffects();

  if(game.debugPaused){
    drawPauseOverlay();
  }
}

function drawPauseOverlay(){
  ctx.save();
  ctx.fillStyle = "rgba(35,22,24,.34)";
  ctx.fillRect(0,0,w,h);
  ctx.fillStyle = "#e8e3da";
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 4;
  roundRect(ctx,cx-62,cy-24,124,48,14,true,true);
  ctx.font = "900 17px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#3d2630";
  ctx.fillText("PAUSED",cx,cy);
  ctx.restore();
}

function drawBackground(){
  var sky = ctx.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,"#4f4148");
  sky.addColorStop(.42,"#74615e");
  sky.addColorStop(1,"#8e7670");

  ctx.fillStyle = sky;
  ctx.fillRect(0,0,w,h);

  ctx.save();
  ctx.globalAlpha = .24;
  ctx.fillStyle = "#9bcac3";
  ctx.beginPath();
  ctx.arc(w*.18,h*.18,46,0,Math.PI*2);
  ctx.fill();
  ctx.restore();

  var ground = ctx.createRadialGradient(cx,cy,30,cx,cy,Math.max(w,h)*.68);
  ground.addColorStop(0,"rgba(126,216,202,.16)");
  ground.addColorStop(.48,"rgba(110,86,90,.24)");
  ground.addColorStop(1,"rgba(66,42,43,.36)");
  ctx.fillStyle = ground;
  ctx.fillRect(0,0,w,h);

  ctx.save();
  for(var i=0;i<34;i++){
    var x = (i * 197 + 41) % (w + 80) - 40;
    var y = (i * 139 + 67) % (h + 80) - 40;
    var s = 7 + (i % 6) * 3;
    var rot = (i % 9) * .35;

    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(rot);
    ctx.fillStyle = i % 3 === 0 ? "#7d4f47" : "#816763";
    ctx.strokeStyle = "rgba(48,35,38,.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0,-s);
    ctx.lineTo(s*.95,-s*.1);
    ctx.lineTo(s*.42,s*.82);
    ctx.lineTo(-s*.72,s*.54);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  for(var j=0;j<11;j++){
    var px = (j * 293 + 90) % w;
    var py = (j * 181 + 120) % h;
    var len = 26 + (j % 4) * 12;

    ctx.strokeStyle = "rgba(67,42,43,.34)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(px,py);
    ctx.lineTo(px + len*.45,py + len*.16);
    ctx.lineTo(px + len*.72,py - len*.12);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLanes(){
  for(var i=0;i<directions.length;i++){
    var dir = directions[i];
    var laneLen = laneEdgeDistance(dir.angle,18);
    var x2 = cx + Math.cos(dir.angle) * laneLen;
    var y2 = cy + Math.sin(dir.angle) * laneLen;

    ctx.save();
    ctx.lineCap = "round";

    ctx.strokeStyle = "rgba(45,32,37,.72)";
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(x2,y2);
    ctx.stroke();

    ctx.strokeStyle = "#74615e";
    ctx.lineWidth = 25;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(x2,y2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(126,216,202,.32)";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(x2,y2);
    ctx.stroke();

    ctx.strokeStyle = dir.bulletColor;
    ctx.globalAlpha = .75;
    ctx.lineWidth = 4;
    ctx.setLineDash([8,12]);
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    for(var p=1;p<=3;p++){
      var t = p / 4;
      var bx = cx + (x2-cx) * t;
      var by = cy + (y2-cy) * t;
      ctx.fillStyle = dir.bulletColor;
      ctx.strokeStyle = "#2f232a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx,by,4,0,Math.PI*2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawCore(){
  ctx.save();

  var pulse = 1 + Math.sin(game.elapsed * 2.2) * .045;

  ctx.fillStyle = "rgba(40,25,28,.34)";
  ctx.beginPath();
  ctx.ellipse(cx,cy+30,76,23,0,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "#574047";
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx,cy,50,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#7ed8ca";
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx,cy,38,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(137,255,242,.45)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx,cy,62*pulse,0,Math.PI*2);
  ctx.stroke();

  drawCoreGem(cx,cy,27*pulse);
  drawCoreHpBar();

  ctx.restore();
}

function drawCoreGem(x,y,r){
  var grad = ctx.createLinearGradient(x,y-r,x,y+r);
  grad.addColorStop(0,"#f8fffd");
  grad.addColorStop(.45,"#7fe5d9");
  grad.addColorStop(1,"#43b8e8");

  ctx.fillStyle = grad;
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x,y-r);
  ctx.lineTo(x+r*.78,y);
  ctx.lineTo(x,y+r);
  ctx.lineTo(x-r*.78,y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x-r*.28,y-r*.38);
  ctx.lineTo(x,y-r*.72);
  ctx.stroke();
}

function drawCoreHpBar(){
  var bw = 142;
  var bh = 20;
  var x = cx - bw * .5;
  var y = cy - 116;
  var ratio = clamp(game.coreHp / 100,0,1);
  var fillW = Math.max(0,(bw-8) * ratio);
  var fill = ratio > .45 ? "#75f0c8" : ratio > .22 ? "#e98787" : "#e9879b";

  ctx.save();
  ctx.fillStyle = "rgba(38,24,27,.34)";
  roundRect(ctx,x+4,y+5,bw,bh,99,true,false);
  ctx.fillStyle = "#2f232a";
  roundRect(ctx,x,y,bw,bh,99,true,false);
  ctx.fillStyle = "#e8e3da";
  roundRect(ctx,x+4,y+4,bw-8,bh-8,99,true,false);
  ctx.fillStyle = fill;
  if(fillW > 0){
    roundRect(ctx,x+4,y+4,fillW,bh-8,99,true,false);
  }

  ctx.font = "900 11px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#2f232a";
  ctx.fillStyle = "#f4f1ea";
  ctx.strokeText("CORE " + Math.ceil(game.coreHp),cx,y+bh*.5);
  ctx.fillText("CORE " + Math.ceil(game.coreHp),cx,y+bh*.5);
  ctx.restore();
}

function drawCannons(){
  for(var i=0;i<cannons.length;i++){
    var c = cannons[i];
    var target = findTargetForCannon(c);
    var ang = c.angle;

    if(target){
      ang = Math.atan2(target.y - c.y,target.x - c.x);
    }

    ctx.save();
    ctx.fillStyle = "rgba(38,24,27,.36)";
    ctx.beginPath();
    ctx.ellipse(c.x,c.y+25,34,12,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(c.x,c.y);
    ctx.rotate(ang);

    ctx.fillStyle = "#4d3a43";
    ctx.strokeStyle = "#2f232a";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0,0,24,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#7b5e63";
    ctx.strokeStyle = "#2f232a";
    ctx.lineWidth = 4;
    roundRect(ctx,-10,-15,35,30,11,true,true);

    ctx.fillStyle = "#53616f";
    ctx.strokeStyle = "#2f232a";
    ctx.lineWidth = 4;
    roundRect(ctx,10,-9,38,18,9,true,true);

    ctx.fillStyle = "#2f232a";
    ctx.beginPath();
    ctx.arc(47,0,10,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle = c.bulletColor;
    ctx.strokeStyle = "#2f232a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(47,0,6,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.35)";
    ctx.beginPath();
    ctx.arc(-3,-8,4,0,Math.PI*2);
    ctx.fill();

    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#e8e3da";
    ctx.strokeStyle = "#2f232a";
    ctx.lineWidth = 4;
    ctx.font = "900 12px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(c.name,c.x,c.y-42);
    ctx.fillText(c.name,c.x,c.y-42);

    ctx.fillStyle = "#2f232a";
    roundRect(ctx,c.x-31,c.y-57,62,11,99,true,false);

    ctx.fillStyle = "rgba(255,255,255,.2)";
    roundRect(ctx,c.x-28,c.y-54,56,5,99,true,false);

    ctx.fillStyle = c.bulletColor;
    roundRect(ctx,c.x-28,c.y-55,56*(c.energy/100),7,99,true,false);

    if(!c.charged){
      ctx.fillStyle = "rgba(47,35,42,.55)";
      roundRect(ctx,c.x-28,c.y-55,56,7,99,true,false);
    }

    if(c.energy < 35 || !c.charged){
      drawTapPrompt(c);
    }

    ctx.restore();
  }
}

function drawTapPrompt(c){
  var bounce = Math.sin(game.elapsed * 8 + c.index) * 4;
  var x = c.x;
  var y = c.y - 76 + bounce;

  ctx.save();
  ctx.fillStyle = "rgba(38,24,27,.28)";
  roundRect(ctx,x-19,y+5,38,15,99,true,false);
  ctx.fillStyle = "#e8e3da";
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 3;
  roundRect(ctx,x-21,y-9,42,20,99,true,true);
  ctx.fillStyle = c.bulletColor;
  ctx.beginPath();
  ctx.moveTo(x-5,y+9);
  ctx.lineTo(x+5,y+9);
  ctx.lineTo(x,y+16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.font = "900 12px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#3d2630";
  ctx.fillText("tap!",x,y+1);
  ctx.restore();
}

function drawEnemies(){
  for(var i=0;i<enemies.length;i++){
    var e = enemies[i];
    ctx.save();
    ctx.fillStyle = "rgba(38,24,27,.32)";
    ctx.beginPath();
    ctx.ellipse(e.x,e.y+e.size*.82,e.size*.72,e.size*.24,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(e.x,e.y);
    var sy = 1 + Math.sin(e.wobble) * .07;
    var sx = 1 - Math.sin(e.wobble) * .035;
    ctx.scale(sx,sy);

    ctx.fillStyle = e.hitFlash > 0 ? "#bfffee" : "#6dd0a5";
    ctx.strokeStyle = "#2f232a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-e.size*.92,e.size*.28);
    ctx.bezierCurveTo(-e.size*.95,-e.size*.46,-e.size*.52,-e.size*1.03,0,-e.size*1.04);
    ctx.bezierCurveTo(e.size*.52,-e.size*1.03,e.size*.95,-e.size*.46,e.size*.92,e.size*.28);
    ctx.quadraticCurveTo(e.size*.78,e.size*.74,e.size*.24,e.size*.78);
    ctx.lineTo(-e.size*.24,e.size*.78);
    ctx.quadraticCurveTo(-e.size*.78,e.size*.74,-e.size*.92,e.size*.28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(47,35,42,.24)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-e.size*.48,e.size*.56);
    ctx.quadraticCurveTo(0,e.size*.68,e.size*.48,e.size*.56);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.38)";
    ctx.beginPath();
    ctx.ellipse(-e.size*.28,-e.size*.36,e.size*.21,e.size*.11,-.6,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "#2f232a";
    ctx.beginPath();
    ctx.ellipse(-e.size*.23,-e.size*.08,e.size*.11,e.size*.15,0,0,Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(e.size*.23,-e.size*.08,e.size*.11,e.size*.15,0,0,Math.PI*2);
    ctx.fill();

    ctx.strokeStyle = "#2f232a";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0,e.size*.12,e.size*.16,.15,Math.PI-.15,false);
    ctx.stroke();

    ctx.fillStyle = "#f8a6a6";
    ctx.beginPath();
    ctx.arc(-e.size*.44,e.size*.1,e.size*.1,0,Math.PI*2);
    ctx.arc(e.size*.44,e.size*.1,e.size*.1,0,Math.PI*2);
    ctx.fill();

    ctx.restore();

    drawEnemyHp(e);
    drawEnemyLaneBadge(e);
  }
}

function drawEnemyHp(e){
  var bw = Math.max(26,e.size*1.42);
  var ratio = clamp(e.hp/e.maxHp,0,1);
  var hpText = "HP " + Math.max(0,Math.ceil(e.hp));

  ctx.save();
  ctx.fillStyle = "#2f232a";
  roundRect(ctx,e.x-bw/2,e.y-e.size-14,bw,7,99,true,false);
  var fillW = Math.max(0,bw*ratio-4);
  ctx.fillStyle = "#e98787";
  if(fillW > 0){
    roundRect(ctx,e.x-bw/2+2,e.y-e.size-12,fillW,3,99,true,false);
  }

  ctx.font = "900 12px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  var tw = ctx.measureText(hpText).width + 14;
  ctx.fillStyle = "#e8e3da";
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 3;
  roundRect(ctx,e.x-tw/2,e.y-e.size-35,tw,17,8,true,true);
  ctx.fillStyle = "#3d2630";
  ctx.fillText(hpText,e.x,e.y-e.size-26.5);
  ctx.restore();
}

function drawEnemyLaneBadge(e){
  var dir = directions[e.laneIndex];

  ctx.save();
  ctx.fillStyle = dir.bulletColor;
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(e.x,e.y+e.size+8,4.5,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawProjectiles(){
  for(var i=0;i<projectiles.length;i++){
    var p = projectiles[i];
    var ang = Math.atan2(p.vy,p.vx);

    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(ang);

    ctx.fillStyle = p.color;
    ctx.globalAlpha = .34;
    ctx.beginPath();
    ctx.ellipse(-10,0,16,6,0,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = p.color;
    ctx.strokeStyle = "#2f232a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0,0,p.r+2,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.65)";
    ctx.beginPath();
    ctx.arc(-2,-2,2.2,0,Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
}

function drawByuris(){
  for(var i=0;i<byuris.length;i++){
    var b = byuris[i];
    var a = Math.atan2(b.vy,b.vx || 0.0001);
    var scale = b.baseScale * (1 + Math.sin(game.elapsed*4 + b.phase) * .08);

    drawByuri(b.x,b.y,a,scale);
  }
}

function drawByuri(x,y,ang,scale){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(ang);
  ctx.scale(scale,scale);

  ctx.fillStyle = "rgba(126,216,202,.20)";
  ctx.beginPath();
  ctx.arc(0,0,24,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "rgba(202,255,242,.82)";
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(-9,-1,8,16,-.52,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(9,-1,8,16,.52,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.rotate(.42);

  ctx.fillStyle = "#f0ece5";
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0,-10,9.5,0,Math.PI*2);
  ctx.fill();
  ctx.stroke();

  var grad = ctx.createLinearGradient(0,-2,0,18);
  grad.addColorStop(0,"#f1ede6");
  grad.addColorStop(.38,"#9fe6d5");
  grad.addColorStop(.75,"#6fb9d6");
  grad.addColorStop(1,"#d9828a");

  ctx.fillStyle = grad;
  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-2,-3);
  ctx.lineTo(2,-3);
  ctx.lineTo(9,10);
  ctx.quadraticCurveTo(0,20,-9,10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#2f232a";
  ctx.beginPath();
  ctx.ellipse(-2.7,-10,1.4,2.1,0,0,Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(2.7,-10,1.4,2.1,0,0,Math.PI*2);
  ctx.fill();

  ctx.strokeStyle = "#2f232a";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0,-7.4,2.4,.2,Math.PI-.2,false);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.beginPath();
  ctx.arc(-3.6,-13.8,2.1,0,Math.PI*2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

function drawEffects(){
  for(var i=0;i<effects.length;i++){
    var fx = effects[i];
    var ratio = 1 - fx.life / fx.maxLife;

    if(fx.type === "ring"){
      ctx.save();
      ctx.strokeStyle = "#2f232a";
      ctx.globalAlpha = (1-ratio) * .28;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(fx.x,fx.y,fx.r + ratio*34,0,Math.PI*2);
      ctx.stroke();
      ctx.strokeStyle = fx.color;
      ctx.globalAlpha = (1-ratio) * .88;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(fx.x,fx.y,fx.r + ratio*34,0,Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }

    if(fx.type === "puff"){
      ctx.save();
      ctx.fillStyle = fx.color;
      ctx.strokeStyle = "#2f232a";
      ctx.globalAlpha = (1-ratio) * .7;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fx.x,fx.y,fx.r + ratio*10,0,Math.PI*2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if(fx.type === "spark"){
      ctx.save();
      ctx.fillStyle = fx.color;
      ctx.strokeStyle = "#2f232a";
      ctx.globalAlpha = (1-ratio) * .95;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(fx.x,fx.y-ratio*10,fx.r + ratio*3,0,Math.PI*2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if(fx.type === "damageText"){
      ctx.save();
      ctx.globalAlpha = (1-ratio);
      ctx.font = "900 16px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#2f232a";
      ctx.fillStyle = fx.color;
      ctx.strokeText(fx.text,fx.x,fx.y-ratio*22);
      ctx.fillText(fx.text,fx.x,fx.y-ratio*22);
      ctx.restore();
    }
  }
}