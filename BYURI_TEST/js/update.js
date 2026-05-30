function update(dt){
  if(game.gameOver || game.paused || game.debugPaused) return;

  game.elapsed += dt;

  updateSpawning(dt);
  updateCannons(dt);
  updateEnemies(dt);
  updateProjectiles(dt);
  updateByuris(dt);
  updateEffects(dt);
  updateEnergy(dt);
  updateHud();
}

function updateSpawning(dt){
  game.spawnTimer -= dt;

  var difficulty = Math.min(.82, game.elapsed * .0034);
  var interval = Math.max(.82, game.spawnBaseInterval - difficulty);

  if(game.spawnTimer <= 0){
    spawnEnemy();

    if(game.elapsed > 42 && Math.random() < .13){
      spawnEnemy();
    }

    if(game.elapsed > 90 && Math.random() < .12){
      spawnEnemy();
    }

    game.spawnTimer = interval;
  }
}

function updateCannons(dt){
  for(var i=0;i<cannons.length;i++){
    var cannon = cannons[i];

    cannon.fireTimer -= dt;
    cannon.burstTimer -= dt;

    var target = findTargetForCannon(cannon);

    if(!target) continue;
    if(!(cannon.charged && cannon.energy > 0)) continue;

    if(cannon.burstEnabled && cannon.burstTimer <= 0){
      fireBurst(cannon,target);
      cannon.burstTimer = cannon.burstInterval;
      cannon.fireTimer = Math.max(cannon.fireTimer,.18);
    }

    if(cannon.fireTimer <= 0){
      fireCannon(cannon,target);
      cannon.fireTimer = cannon.cooldown;
    }
  }
}

function updateEnemies(dt){
  for(var i=enemies.length-1;i>=0;i--){
    var e = enemies[i];

    var dx = cx - e.x;
    var dy = cy - e.y;
    var d = Math.sqrt(dx*dx + dy*dy) || 1;

    e.x += dx / d * e.speed * dt;
    e.y += dy / d * e.speed * dt;

    e.wobble += dt * 6.8;

    if(e.hitFlash > 0){
      e.hitFlash -= dt;
    }

    if(d < 26){
      game.coreHp -= 7;

      effects.push({
        type:"ring",
        x:cx,
        y:cy,
        life:.45,
        maxLife:.45,
        color:"#ffb7c7",
        r:26
      });

      enemies.splice(i,1);

      if(game.coreHp <= 0){
        game.coreHp = 0;
        endGame();
      }
    }
  }
}

function updateProjectiles(dt){
  for(var i=projectiles.length-1;i>=0;i--){
    var p = projectiles[i];

    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    var hit = false;

    for(var j=enemies.length-1;j>=0;j--){
      var e = enemies[j];

      if(e.laneIndex !== p.laneIndex) continue;

      if(dist(p.x,p.y,e.x,e.y) < e.size * .8){
        e.hp -= p.damage;
        e.hitFlash = .08;

        effects.push({
          type:"puff",
          x:p.x,
          y:p.y,
          life:.18,
          maxLife:.18,
          color:p.color,
          r:8
        });

        effects.push({
          type:"damageText",
          x:e.x,
          y:e.y - e.size * .9,
          life:.55,
          maxLife:.55,
          color:p.color,
          text:"-" + p.damage
        });

        hit = true;

        if(e.hp <= 0){
          enemies.splice(j,1);
          game.kills++;
        }

        break;
      }
    }

    if(hit || p.life <= 0 || p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30){
      projectiles.splice(i,1);
    }
  }
}

function updateEffects(dt){
  for(var i=effects.length-1;i>=0;i--){
    effects[i].life -= dt;

    if(effects[i].life <= 0){
      effects.splice(i,1);
    }
  }
}

function updateByuris(dt){
  var t = game.elapsed;

  for(var i=0;i<byuris.length;i++){
    var b = byuris[i];

    if(b.mode === "bless" && b.blessCannon){
      b.blessTimer += dt;

      var tt = b.blessTimer / b.blessDuration;
      var c = b.blessCannon;
      var ang = t * 12 + b.phase;
      var rr = 16 * (1 - Math.min(.55,tt));

      var tx = c.x + Math.cos(ang) * rr;
      var ty = c.y + Math.sin(ang) * rr * .7;

      b.vx = (tx - b.x) * 7.2;
      b.vy = (ty - b.y) * 7.2;

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if(Math.random() < .18){
        effects.push({
          type:"spark",
          x:b.x,
          y:b.y,
          life:.35,
          maxLife:.35,
          color:c.bulletColor,
          r:2
        });
      }

      if(tt >= 1){
        b.mode = "support";
        b.blessCannon = null;
        b.blessTimer = 0;
      }
    }else{
      var a = b.baseAngle + t * (.42 + i * .06) + Math.sin(t * .8 + b.phase) * .28;
      var orbit = b.orbit + Math.sin(t * 1.4 + b.phase) * 10;
      var hover = Math.sin(t * 2.1 + b.heightSeed) * 10 + Math.sin(t * 3.3 + b.phase) * 4;

      var tx2 = cx + Math.cos(a) * orbit;
      var ty2 = cy + Math.sin(a) * orbit * .65 - 45 + hover;

      b.vx = (tx2 - b.x) * 4.4;
      b.vy = (ty2 - b.y) * 4.4;

      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }
  }
}

function updateEnergy(dt){
  for(var i=0;i<cannons.length;i++){
    var c = cannons[i];

    var drain = 1.1;

    if(c.charged){
      drain = 4.2;
    }

    c.energy = Math.max(0,c.energy - drain * dt);

    if(c.energy <= 0){
      c.charged = false;
    }

    c.hudFill.style.width = c.energy + "%";

    if(c.charged){
      c.hudFill.style.opacity = "0.98";
    }else{
      c.hudFill.style.opacity = "0.55";
    }

    c.hudPct.textContent = Math.floor(c.energy) + "%";
  }
}
