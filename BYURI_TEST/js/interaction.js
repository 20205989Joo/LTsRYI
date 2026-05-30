function onPointerDown(e){
  if(game.gameOver || game.paused || game.debugPaused || statusWindow.classList.contains("show")) return;

  var rect = canvas.getBoundingClientRect();
  var mx = (e.clientX - rect.left) * (w / rect.width);
  var my = (e.clientY - rect.top) * (h / rect.height);

  for(var i=0;i<cannons.length;i++){
    var cannon = cannons[i];

    if(dist(mx,my,cannon.x,cannon.y) <= cannon.r + 14){
      openStatus(cannon);
      break;
    }
  }
}

function openStatus(cannon){
  activeCannon = cannon;

  var q = makeQuestion();
  activeAnswer = q.answer;

  windowTitle.textContent = "상태창 호출 : " + cannon.name + " 포탑";

  questionText.innerHTML =
    "<b>" + q.text + "</b><br>" +
    '<span style="font-size:13px;color:#a9cfd7;">정답: 에너지 완전 충전 · 3문제 정답마다 진화</span>';

  choicesEl.innerHTML = "";

  for(var i=0;i<q.choices.length;i++){
    var choice = q.choices[i];
    var btn = document.createElement("button");

    btn.className = "choiceBtn";
    btn.textContent = choice;
    btn.addEventListener("click", makeChoiceHandler(choice));

    choicesEl.appendChild(btn);
  }

  statusWindow.classList.add("show");
}

function makeChoiceHandler(choice){
  return function(){
    answerQuestion(choice);
  };
}

function closeStatus(){
  statusWindow.classList.remove("show");
  activeCannon = null;
  activeAnswer = null;
}

function makeQuestion(){
  var patterns = [
    function(){
      var a = randInt(4,13);
      var b = randInt(3,11);

      return {
        text:"별가루 " + a + "개와 청록 결정 " + b + "개를 합치면 모두 몇 개인가?",
        answer:a+b
      };
    },
    function(){
      var a = randInt(2,7);
      var b = randInt(3,8);

      return {
        text:"벼리 " + a + "명이 각각 포탄 " + b + "개씩 충전했다. 총 포탄은 몇 개인가?",
        answer:a*b
      };
    },
    function(){
      var a = randInt(18,39);
      var b = randInt(4,13);

      return {
        text:"오염 수치 " + a + "에서 정화 수치 " + b + "를 빼면 남는 수치는?",
        answer:a-b
      };
    }
  ];

  var base = patterns[randInt(0,patterns.length-1)]();
  var set = new Set([base.answer]);

  while(set.size < 4){
    var offset = randInt(-9,9);
    var v = base.answer + offset;

    if(offset !== 0 && v >= 0){
      set.add(v);
    }
  }

  return {
    text:base.text,
    answer:base.answer,
    choices:shuffle(Array.from(set))
  };
}

function answerQuestion(choice){
  var buttons = document.querySelectorAll(".choiceBtn");

  for(var i=0;i<buttons.length;i++){
    buttons[i].disabled = true;
  }

  var correct = Number(choice) === activeAnswer;
  var cannon = activeCannon;

  if(correct){
    var evolved = chargeCannon(cannon);

    showToast(evolved ? "진화 가능!" : "정답 · 에너지 충전","good");
    closeStatus();

    if(evolved){
      setTimeout(function(){
        openUpgrade(cannon);
      },180);
    }
  }else{
    showToast("오답","bad");
    closeStatus();
  }
}

function chargeCannon(cannon){
  cannon.correctCount++;
  cannon.energy = 100;
  cannon.charged = true;

  effects.push({
    type:"ring",
    x:cannon.x,
    y:cannon.y,
    life:.55,
    maxLife:.55,
    color:cannon.bulletColor,
    r:18
  });

  triggerByuriBlessing(cannon);

  var evolved = false;

  if(cannon.correctCount >= 3){
    cannon.correctCount = 0;
    evolved = true;
  }

  return evolved;
}

function openUpgrade(cannon){
  if(!cannon || game.gameOver) return;

  game.paused = true;

  upgradeWindow.style.display = "grid";
  upgradeTitle.textContent = cannon.name + " 포탑 진화";
  upgradeSub.textContent = "강화 요소를 하나 선택하세요.";
  upgradeCards.innerHTML = "";

  var picks = shuffle(upgradePool.slice()).slice(0,3);

  for(var i=0;i<picks.length;i++){
    var upgrade = picks[i];
    var card = document.createElement("button");

    card.className = "upgradeCard";
    card.innerHTML = "<b>" + upgrade.title + "</b><span>" + upgrade.desc + "</span>";
    card.addEventListener("click", makeUpgradeHandler(cannon,upgrade));

    upgradeCards.appendChild(card);
  }
}

function makeUpgradeHandler(cannon,upgrade){
  return function(){
    applyUpgrade(cannon,upgrade);
  };
}

function applyUpgrade(cannon,upgrade){
  upgrade.apply(cannon);

  cannon.level++;
  cannon.damage = Math.round(cannon.damage * 1.12 + 2);
  cannon.range += 22;

  showToast(upgrade.title + " 적용","good");

  effects.push({
    type:"ring",
    x:cannon.x,
    y:cannon.y,
    life:.7,
    maxLife:.7,
    color:cannon.bulletColor,
    r:20
  });

  triggerByuriBlessing(cannon);

  upgradeWindow.style.display = "none";
  game.paused = false;
}

function triggerByuriBlessing(cannon){
  var chosen = null;

  for(var i=0;i<byuris.length;i++){
    if(byuris[i].mode !== "bless"){
      chosen = byuris[i];
      break;
    }
  }

  if(!chosen){
    chosen = byuris[0];
  }

  chosen.mode = "bless";
  chosen.blessCannon = cannon;
  chosen.blessTimer = 0;
  chosen.blessDuration = 1.45;
}
