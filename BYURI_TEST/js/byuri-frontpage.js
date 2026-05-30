(function(global){
  "use strict";

  const STORAGE_KEY="byuriQuestionConfig";
  const state={
    selectedUnits:new Set(),
    selectedDays:new Set(),
    wordLevel:"A1"
  };

  const els={};

  function $(id){
    return document.getElementById(id);
  }

  function setText(id,value){
    const el=$(id);
    if(el)el.textContent=value;
  }

  function sortedNumbers(values){
    return [...values].sort((a,b)=>Number(a)-Number(b));
  }

  function getAisthUnits(){
    const set=global.ByuriAisthQuestionSet;
    if(!set||!Array.isArray(set.lessons))return[];

    return set.lessons.flatMap(lesson=>(lesson.units||[]).map(unit=>({
      ...unit,
      lessonId:String(lesson.id),
      lessonTitle:lesson.title
    })));
  }

  function getWordLevels(){
    const set=global.ByuriWordSet;
    return set&&Array.isArray(set.levels)?set.levels:[];
  }

  function getCurrentLevel(){
    return getWordLevels().find(level=>level.id===state.wordLevel)||getWordLevels()[0]||null;
  }

  function createChip(text,active,onClick,meta){
    const button=document.createElement("button");
    button.type="button";
    button.className="chip"+(active?" active":"");
    button.textContent=text;
    if(meta)button.title=meta;
    button.addEventListener("click",onClick);
    return button;
  }

  function renderAisthUnits(){
    const wrap=els.aisthUnits;
    if(!wrap)return;

    wrap.innerHTML="";
    const lessons=global.ByuriAisthQuestionSet&&Array.isArray(global.ByuriAisthQuestionSet.lessons)
      ? global.ByuriAisthQuestionSet.lessons
      : [];

    if(!lessons.length){
      wrap.appendChild(emptyNote("Aisth data not loaded"));
      return;
    }

    lessons.forEach(lesson=>{
      const group=document.createElement("div");
      const title=document.createElement("div");
      const chips=document.createElement("div");

      group.className="unitGroup";
      title.className="unitTitle";
      title.textContent=(lesson.title||("Lesson "+lesson.id))+" · "+lesson.count;
      chips.className="chipGrid units";

      (lesson.units||[]).forEach(unit=>{
        const id=String(unit.id);
        chips.appendChild(createChip(
          "L"+unit.lesson+" E"+unit.exercise+" · "+unit.count,
          state.selectedUnits.has(id),
          ()=>{
            if(state.selectedUnits.has(id))state.selectedUnits.delete(id);
            else state.selectedUnits.add(id);
            renderAisthUnits();
            updateSummary();
          },
          unit.title||id
        ));
      });

      group.appendChild(title);
      group.appendChild(chips);
      wrap.appendChild(group);
    });
  }

  function renderWordLevels(){
    const select=els.wordLevel;
    if(!select)return;

    select.innerHTML="";
    getWordLevels().forEach(level=>{
      const option=document.createElement("option");
      option.value=level.id;
      option.textContent=level.id+" · "+level.count;
      select.appendChild(option);
    });

    select.value=state.wordLevel;
  }

  function renderWordDays(){
    const wrap=els.wordDays;
    const level=getCurrentLevel();
    if(!wrap)return;

    wrap.innerHTML="";
    if(!level){
      wrap.appendChild(emptyNote("Word data not loaded"));
      return;
    }

    (level.days||[]).forEach(day=>{
      const key=String(day.day);
      wrap.appendChild(createChip(
        "D"+key+" · "+day.count,
        state.selectedDays.has(key),
        ()=>{
          if(state.selectedDays.has(key))state.selectedDays.delete(key);
          else state.selectedDays.add(key);
          renderWordDays();
          updateSummary();
        },
        level.id+" Day "+key
      ));
    });
  }

  function emptyNote(text){
    const note=document.createElement("div");
    note.className="emptyNote";
    note.textContent=text;
    return note;
  }

  function selectedAisthCount(){
    const units=getAisthUnits();
    if(!els.aisthEnabled||!els.aisthEnabled.checked)return 0;
    return units.filter(unit=>state.selectedUnits.has(String(unit.id))).reduce((sum,unit)=>sum+Number(unit.count||0),0);
  }

  function selectedWordCount(){
    const level=getCurrentLevel();
    if(!level)return 0;
    return (level.days||[])
      .filter(day=>state.selectedDays.has(String(day.day)))
      .reduce((sum,day)=>sum+Number(day.count||0),0);
  }

  function buildPools(){
    const pools=[];
    const unitIds=[...state.selectedUnits];
    const days=sortedNumbers(state.selectedDays);

    if(els.aisthEnabled&&els.aisthEnabled.checked&&unitIds.length){
      pools.push({type:"aisth",unitIds});
    }

    if(els.wordChoiceEnabled&&els.wordChoiceEnabled.checked&&days.length){
      pools.push({type:"wordChoice",level:state.wordLevel,days});
    }

    if(els.wordScrambleEnabled&&els.wordScrambleEnabled.checked&&days.length){
      pools.push({type:"wordScramble",level:state.wordLevel,days});
    }

    return pools;
  }

  function updateSummary(){
    const pools=buildPools();
    const wordCount=selectedWordCount();
    const wordModes=[];

    if(els.wordChoiceEnabled&&els.wordChoiceEnabled.checked)wordModes.push("Choice");
    if(els.wordScrambleEnabled&&els.wordScrambleEnabled.checked)wordModes.push("Scramble");

    setText("aisthCount",selectedAisthCount()+" Q");
    setText("wordCount",wordCount+" W");
    setText("poolCount",pools.length+" pools");
    setText("wordModeText",wordModes.length?wordModes.join(" + "):"OFF");
    setText("dayText",state.selectedDays.size?"Day "+sortedNumbers(state.selectedDays).join(", "):"No day");

    const preview=els.preview;
    if(preview){
      preview.innerHTML="";
      if(!pools.length){
        preview.appendChild(previewLine("기본", "수학 예비 문제"));
      }else{
        pools.forEach(pool=>{
          if(pool.type==="aisth")preview.appendChild(previewLine("Aisth", pool.unitIds.length+" units"));
          if(pool.type==="wordChoice")preview.appendChild(previewLine("Words", pool.level+" choice · "+pool.days.length+" days"));
          if(pool.type==="wordScramble")preview.appendChild(previewLine("Words", pool.level+" scramble · "+pool.days.length+" days"));
        });
      }
    }
  }

  function previewLine(label,value){
    const row=document.createElement("div");
    const left=document.createElement("span");
    const right=document.createElement("b");
    row.className="previewLine";
    left.textContent=label;
    right.textContent=value;
    row.appendChild(left);
    row.appendChild(right);
    return row;
  }

  function selectAllUnits(){
    state.selectedUnits=new Set(getAisthUnits().map(unit=>String(unit.id)));
    renderAisthUnits();
    updateSummary();
  }

  function clearUnits(){
    state.selectedUnits.clear();
    renderAisthUnits();
    updateSummary();
  }

  function selectAllDays(){
    const level=getCurrentLevel();
    state.selectedDays=new Set(level?(level.days||[]).map(day=>String(day.day)):[]);
    renderWordDays();
    updateSummary();
  }

  function clearDays(){
    state.selectedDays.clear();
    renderWordDays();
    updateSummary();
  }

  function selectFirstDay(){
    const level=getCurrentLevel();
    state.selectedDays.clear();
    if(level&&level.days&&level.days[0])state.selectedDays.add(String(level.days[0].day));
  }

  function start(target){
    const pools=buildPools();
    const config={
      version:1,
      createdAt:new Date().toISOString(),
      pools
    };

    try{
      global.localStorage.setItem(STORAGE_KEY,JSON.stringify(config));
    }catch(error){
      console.warn("Failed to store byuri config",error);
    }

    global.location.href=target;
  }

  function wire(){
    els.aisthEnabled=$("aisthEnabled");
    els.wordChoiceEnabled=$("wordChoiceEnabled");
    els.wordScrambleEnabled=$("wordScrambleEnabled");
    els.aisthUnits=$("aisthUnits");
    els.wordLevel=$("wordLevel");
    els.wordDays=$("wordDays");
    els.preview=$("configPreview");

    [els.aisthEnabled,els.wordChoiceEnabled,els.wordScrambleEnabled].forEach(el=>{
      if(el)el.addEventListener("change",updateSummary);
    });

    $("selectAllUnits")?.addEventListener("click",selectAllUnits);
    $("clearUnits")?.addEventListener("click",clearUnits);
    $("selectAllDays")?.addEventListener("click",selectAllDays);
    $("clearDays")?.addEventListener("click",clearDays);
    $("start3d")?.addEventListener("click",()=>start("BYURI_TEST_3D.html"));

    if(els.wordLevel){
      els.wordLevel.addEventListener("change",()=>{
        state.wordLevel=els.wordLevel.value;
        selectFirstDay();
        renderWordDays();
        updateSummary();
      });
    }
  }

  function init(){
    wire();

    const firstLevel=getWordLevels()[0];
    state.wordLevel=firstLevel?firstLevel.id:"A1";
    selectAllUnits();
    renderWordLevels();
    selectFirstDay();
    renderWordDays();
    updateSummary();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
})(window);