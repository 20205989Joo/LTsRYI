var gameDesk=document.getElementById("gameDesk");
var gameViewport=document.getElementById("gameViewport");
var gameShell=document.getElementById("gameShell");
var canvas=document.getElementById("game");
var ctx=canvas.getContext("2d");

var coreHpText=document.getElementById("coreHpText");
var killText=document.getElementById("killText");
var timeText=document.getElementById("timeText");
var levelText=document.getElementById("levelText");
var cannonHudBars=document.getElementById("cannonHudBars");
var toastEl=document.getElementById("toast");
var statusWindow=document.getElementById("statusWindow");
var windowTitle=document.getElementById("windowTitle");
var questionText=document.getElementById("questionText");
var choicesEl=document.getElementById("choices");
var closeWindow=document.getElementById("closeWindow");
var upgradeWindow=document.getElementById("upgradeWindow");
var upgradeTitle=document.getElementById("upgradeTitle");
var upgradeSub=document.getElementById("upgradeSub");
var upgradeCards=document.getElementById("upgradeCards");
var gameOverEl=document.getElementById("gameOver");
var restartBtn=document.getElementById("restartBtn");
var pauseBtn=document.getElementById("pauseBtn");
var leftPanelToggle=document.getElementById("leftPanelToggle");
var rightPanelToggle=document.getElementById("rightPanelToggle");
var panelCoreText=document.getElementById("panelCoreText");
var panelKillText=document.getElementById("panelKillText");
var panelTimeText=document.getElementById("panelTimeText");
var panelCannonList=document.getElementById("panelCannonList");
var panelEnemyInfo=document.getElementById("panelEnemyInfo");

var FRAME_W=375;
var FRAME_H=667;
var STAGE_W=340;
var STAGE_H=626;
var CORE_Y_RATIO=.76;
var DPR=Math.min(window.devicePixelRatio||1,2);

var w=STAGE_W;
var h=STAGE_H;
var cx=w*0.5;
var cy=h*CORE_Y_RATIO;

var game={
  coreHp:100,
  kills:0,
  elapsed:0,
  spawnTimer:1.2,
  spawnBaseInterval:2.35,
  enemyBaseHp:15,
  gameOver:false,
  paused:false,
  debugPaused:false
};

var directions=[
  {name:"10시",label:"11",angle:degToRad(240),bulletColor:"#9b5cff",laneColor:"rgba(190,150,255,.18)"},
  {name:"12시",label:"12",angle:degToRad(270),bulletColor:"#36ffe1",laneColor:"rgba(120,255,236,.18)"},
  {name:"2시",label:"1",angle:degToRad(300),bulletColor:"#74cfff",laneColor:"rgba(135,210,255,.18)"}
];

var upgradePool=[
  {
    id:"fireRate",
    title:"더 빠른 발포",
    desc:"해당 포탑의 발사 간격이 크게 줄어듭니다.",
    apply:function(c){c.cooldown=Math.max(.16,c.cooldown*.72);}
  },
  {
    id:"doubleShot",
    title:"쌍성 포탄",
    desc:"확률적으로 포탄을 2개 동시에 발사합니다.",
    apply:function(c){c.doubleShotChance=Math.min(.8,c.doubleShotChance+.28);}
  },
  {
    id:"burstFive",
    title:"오성 연발",
    desc:"긴 주기로 한 번에 포탄 5개를 흩뿌립니다.",
    apply:function(c){
      c.burstEnabled=true;
      c.burstInterval=Math.max(4.7,c.burstInterval*.88);
      c.burstTimer=Math.min(c.burstTimer,2.2);
    }
  },
  {
    id:"healCore",
    title:"코어 에너지 회복",
    desc:"상상력 코어 내구도를 50 회복합니다.",
    apply:function(c){
      game.coreHp=Math.min(100,game.coreHp+50);
      effects.push({type:"ring",x:cx,y:cy,life:.85,maxLife:.85,color:"#89fff2",r:30});
    }
  }
];

var cannons=[];
var enemies=[];
var projectiles=[];
var byuris=[];
var effects=[];

var activeCannon=null;
var activeAnswer=null;
var toastTimer=null;
var lastTime=performance.now();
