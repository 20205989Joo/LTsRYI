function updateHud(){
  coreHpText.textContent = Math.ceil(game.coreHp);
  killText.textContent = game.kills;
  timeText.textContent = Math.floor(game.elapsed);

  var parts = [];

  for(var i=0;i<cannons.length;i++){
    var c = cannons[i];
    parts.push(c.name + " Lv." + c.level);

    if(c.hudDamage){
      c.hudDamage.textContent = "DMG " + c.damage;
    }
  }

  levelText.textContent = parts.join(" / ");
  updateSidePanels();
}

function updateSidePanels(){
  if(panelCoreText){
    panelCoreText.textContent = Math.ceil(game.coreHp);
  }

  if(panelKillText){
    panelKillText.textContent = game.kills;
  }

  if(panelTimeText){
    panelTimeText.textContent = Math.floor(game.elapsed);
  }

  if(panelEnemyInfo){
    var nextHp = Math.round(game.enemyBaseHp * (1 + game.elapsed * .0095));
    panelEnemyInfo.textContent = "HP " + nextHp + " / LIVE " + enemies.length;
  }

  if(panelCannonList){
    var html = "";

    for(var i=0;i<cannons.length;i++){
      var c = cannons[i];
      html += '<div class="panelCannonRow"><b>' + c.name + '</b><span>LV ' + c.level + '</span><span>DMG ' + c.damage + '</span><span>' + Math.floor(c.energy) + '%</span></div>';
    }

    panelCannonList.innerHTML = html;
  }
}

function showToast(text,type){
  clearTimeout(toastTimer);

  toastEl.textContent = text;
  toastEl.className = "";

  void toastEl.offsetWidth;

  toastEl.classList.add("show",type);

  toastTimer = setTimeout(function(){
    toastEl.className = "";
  },620);
}

function resetGame(){
  game.coreHp = 100;
  game.kills = 0;
  game.elapsed = 0;
  game.spawnTimer = 1.2;
  game.gameOver = false;
  game.paused = false;
  game.debugPaused = false;
  updatePauseButton();

  enemies.length = 0;
  projectiles.length = 0;
  effects.length = 0;

  closeStatus();

  upgradeWindow.style.display = "none";
  gameOverEl.style.display = "none";

  for(var i=0;i<cannons.length;i++){
    var c = cannons[i];

    c.level = 1;
    c.correctCount = 0;
    c.energy = 100;
    c.charged = true;
    c.damage = 17;
    c.cooldown = .56;
    c.fireTimer = Math.random() * .25;
    c.range = 330;
    c.doubleShotChance = 0;
    c.burstEnabled = false;
    c.burstInterval = 8;
    c.burstTimer = 4 + Math.random() * 2;
  }

  initByuris();
  updateHud();
}

function endGame(){
  game.gameOver = true;
  game.paused = false;
  game.debugPaused = false;
  updatePauseButton();
  gameOverEl.style.display = "grid";
}
