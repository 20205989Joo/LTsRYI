function spawnEnemy(){
  var laneIndex = randInt(0,directions.length-1);
  var dir = directions[laneIndex];

  var startR = laneEdgeDistance(dir.angle,28);
  var spread = 22;
  var sideOffset = randFloat(-spread,spread);
  var px = Math.cos(dir.angle + Math.PI/2);
  var py = Math.sin(dir.angle + Math.PI/2);

  var x = cx + Math.cos(dir.angle) * startR + px * sideOffset;
  var y = cy + Math.sin(dir.angle) * startR + py * sideOffset;

  var hpScale = 1 + game.elapsed * .0095;
  var hp = Math.round(game.enemyBaseHp * hpScale);

  enemies.push({
    laneIndex:laneIndex,
    x:x,
    y:y,
    hp:hp,
    maxHp:hp,
    speed:randFloat(34,48),
    size:20 + Math.random() * 4,
    wobble:Math.random() * Math.PI * 2,
    hitFlash:0
  });
}

function fireProjectile(cannon,target,spread){
  if(spread === undefined){
    spread = 0;
  }

  var dx = target.x - cannon.x;
  var dy = target.y - cannon.y;
  var ang = Math.atan2(dy,dx) + spread;
  var speed = 340 + cannon.level * 18;

  projectiles.push({
    laneIndex:cannon.index,
    x:cannon.x + Math.cos(ang) * 20,
    y:cannon.y + Math.sin(ang) * 20,
    vx:Math.cos(ang) * speed,
    vy:Math.sin(ang) * speed,
    damage:cannon.damage,
    color:cannon.bulletColor,
    life:2.1,
    r:5
  });
}

function fireCannon(cannon,target){
  fireProjectile(cannon,target,0);

  if(cannon.doubleShotChance > 0 && Math.random() < cannon.doubleShotChance){
    fireProjectile(cannon,target,randFloat(-.12,.12));
  }
}

function fireBurst(cannon,target){
  var spreads = [-.18,-.09,0,.09,.18];

  for(var i=0;i<spreads.length;i++){
    fireProjectile(cannon,target,spreads[i]);
  }
}

function findTargetForCannon(cannon){
  var best = null;
  var bestScore = Infinity;

  for(var i=0;i<enemies.length;i++){
    var e = enemies[i];

    if(e.laneIndex !== cannon.index) continue;

    var d = dist(cannon.x,cannon.y,e.x,e.y);
    if(d > cannon.range) continue;

    var score = d + e.hp * .02;

    if(score < bestScore){
      bestScore = score;
      best = e;
    }
  }

  return best;
}
