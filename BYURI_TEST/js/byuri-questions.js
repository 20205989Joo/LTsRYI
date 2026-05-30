(function(global){
  "use strict";

  const STORAGE_KEY="byuriQuestionConfig";
  const QUESTION_TYPES={
    MULTIPLE_CHOICE:"multipleChoice",
    NUMERIC_INPUT:"numericInput",
    WORD_SCRAMBLE:"wordScramble",
    SEQUENCE:"sequence",
    MATCH:"match"
  };

  function fallbackRandInt(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  function fallbackShuffle(list){
    const arr=[...list];

    for(let i=arr.length-1;i>0;i--){
      const j=fallbackRandInt(0,i);
      const t=arr[i];

      arr[i]=arr[j];
      arr[j]=t;
    }

    return arr;
  }

  function getTools(tools){
    return{
      randInt:(tools&&tools.randInt)||fallbackRandInt,
      shuffle:(tools&&tools.shuffle)||fallbackShuffle
    };
  }

  function normalizeText(value){
    return String(value==null?"":value)
      .normalize("NFKC")
      .trim()
      .toLowerCase()
      .replace(/[’‘`]/g,"'")
      .replace(/[–—]/g,"-")
      .replace(/\s+/g," ");
  }

  function normalizeScramble(value){
    return normalizeText(value).replace(/[^a-z0-9]/g,"");
  }

  function uniqueValues(list){
    const seen=new Set();
    const out=[];

    list.forEach(value=>{
      const text=String(value==null?"":value).trim();
      const key=normalizeText(text);

      if(text&&!seen.has(key)){
        seen.add(key);
        out.push(text);
      }
    });

    return out;
  }

  function pick(list,randInt){
    if(!list||!list.length)return null;
    return list[randInt(0,list.length-1)];
  }

  function numberChoices(answer,tools){
    const randInt=tools.randInt||fallbackRandInt;
    const shuffle=tools.shuffle||fallbackShuffle;
    const set=new Set([answer]);

    while(set.size<4){
      const offset=randInt(-9,9);
      const value=answer+offset;

      if(offset!==0&&value>=0){
        set.add(value);
      }
    }

    return shuffle([...set]);
  }

  const multipleChoiceFactories=[
    tools=>{
      const randInt=tools.randInt||fallbackRandInt;
      const a=randInt(4,13);
      const b=randInt(3,11);
      const answer=a+b;

      return{
        id:"wasteland-add-01",
        type:QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt:"별가루 "+a+"개와 청록 결정 "+b+"개를 합치면 모두 몇 개인가?",
        answer,
        choices:numberChoices(answer,tools)
      };
    },
    tools=>{
      const randInt=tools.randInt||fallbackRandInt;
      const a=randInt(2,7);
      const b=randInt(3,8);
      const answer=a*b;

      return{
        id:"byuri-multiply-01",
        type:QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt:"벼리 "+a+"명이 각각 포탄 "+b+"개씩 충전했다. 총 포탄은 몇 개인가?",
        answer,
        choices:numberChoices(answer,tools)
      };
    },
    tools=>{
      const randInt=tools.randInt||fallbackRandInt;
      const a=randInt(18,39);
      const b=randInt(4,13);
      const answer=a-b;

      return{
        id:"cleanse-subtract-01",
        type:QUESTION_TYPES.MULTIPLE_CHOICE,
        prompt:"오염 수치 "+a+"에서 정화 수치 "+b+"를 빼면 남는 수치는?",
        answer,
        choices:numberChoices(answer,tools)
      };
    }
  ];

  const numericInputFactories=[
    tools=>{
      const randInt=tools.randInt||fallbackRandInt;
      const a=randInt(20,45);
      const b=randInt(2,9);
      const answer=a+b*2;

      return{
        id:"core-charge-input-01",
        type:QUESTION_TYPES.NUMERIC_INPUT,
        prompt:"코어 잔량 "+a+"에 충전팩 "+b+"개를 2씩 더하면?",
        answer,
        checkAnswer:value=>Number(value)===answer
      };
    }
  ];

  const fallbackFactories=[...multipleChoiceFactories,...numericInputFactories];

  function readConfig(){
    let config=null;

    try{
      const raw=global.localStorage&&global.localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed=JSON.parse(raw);
        if(parsed&&Array.isArray(parsed.pools)&&parsed.pools.length){
          config=parsed;
        }
      }
    }catch(_){
      config=null;
    }

    if(config)return config;

    try{
      const params=new URLSearchParams(global.location&&global.location.search?global.location.search:"");
      const set=params.get("set")||params.get("byuriSet");
      const level=(params.get("level")||"A1").toUpperCase();
      const days=(params.get("days")||params.get("day")||"").split(",").map(v=>v.trim()).filter(Boolean);

      if(set==="aisth")return{pools:[{type:"aisth"}]};
      if(set==="wordChoice")return{pools:[{type:"wordChoice",level,days}]};
      if(set==="wordScramble")return{pools:[{type:"wordScramble",level,days}]};
    }catch(_){
      return null;
    }

    return null;
  }

  function poolKind(pool){
    return String((pool&&pool.type)||(pool&&pool.kind)||"").trim();
  }

  function toStringSet(values){
    const set=new Set();

    if(Array.isArray(values)){
      values.forEach(value=>{
        const text=String(value==null?"":value).trim();
        if(text)set.add(text);
      });
    }

    return set;
  }

  function filteredAisthQuestions(pool){
    const set=global.ByuriAisthQuestionSet;
    if(!set||!Array.isArray(set.questions))return[];

    const unitIds=toStringSet(pool.unitIds||pool.units);
    const lessonIds=toStringSet(pool.lessonIds||pool.lessons);

    return set.questions.filter(question=>{
      if(unitIds.size&& !unitIds.has(String(question.unit)))return false;
      if(lessonIds.size&& !lessonIds.has(String(question.lesson)))return false;
      return question.prompt&&question.answer&&Array.isArray(question.choices)&&question.choices.length>1;
    });
  }

  function createAisthQuestion(pool,tools){
    const q=pick(filteredAisthQuestions(pool),tools.randInt);
    if(!q)return null;

    const title=q.title?" · "+q.title:"";
    const qNo=q.qNumber?" #"+q.qNumber:"";
    const instruction=q.instruction?"\n"+q.instruction:"";

    return{
      id:q.id,
      type:QUESTION_TYPES.MULTIPLE_CHOICE,
      prompt:"Aisth L"+q.lesson+"-E"+q.exercise+title+qNo+instruction+"\n"+q.prompt,
      answer:q.answer,
      choices:tools.shuffle(uniqueValues(q.choices)),
      checkAnswer:value=>normalizeText(value)===normalizeText(q.answer),
      payload:{source:"aisth",unit:q.unit,lesson:q.lesson,exercise:q.exercise,title:q.title}
    };
  }

  function filteredWords(pool){
    const set=global.ByuriWordSet;
    if(!set||!Array.isArray(set.words))return[];

    const level=String(pool.level||"").trim().toUpperCase();
    const days=toStringSet(pool.days||pool.dayIds);

    return set.words.filter(word=>{
      if(level&&String(word.level).toUpperCase()!==level)return false;
      if(days.size&&!days.has(String(word.day)))return false;
      return word.word&&word.meaning;
    });
  }

  function wordScopeFallback(pool){
    const set=global.ByuriWordSet;
    if(!set||!Array.isArray(set.words))return[];

    const level=String(pool.level||"").trim().toUpperCase();
    return set.words.filter(word=>{
      if(level&&String(word.level).toUpperCase()!==level)return false;
      return word.word&&word.meaning;
    });
  }

  function wordMetaLine(entry){
    const bits=[];
    if(entry.level)bits.push(entry.level);
    if(entry.day)bits.push("Day "+entry.day);
    if(entry.partOfSpeech)bits.push(entry.partOfSpeech);
    return bits.join(" · ");
  }

  function createWordChoiceQuestion(pool,tools){
    const rows=filteredWords(pool);
    const entry=pick(rows,tools.randInt);
    if(!entry)return null;

    const fallback=wordScopeFallback(pool);
    const wrongPool=(rows.length>=4?rows:fallback).filter(item=>normalizeText(item.meaning)!==normalizeText(entry.meaning));
    const wrongs=uniqueValues(tools.shuffle(wrongPool).map(item=>item.meaning)).slice(0,3);

    if(wrongs.length<2)return null;

    return{
      id:"word-choice-"+entry.id,
      type:QUESTION_TYPES.MULTIPLE_CHOICE,
      prompt:"뜻을 고르세요.\n"+entry.word+"\n"+wordMetaLine(entry),
      answer:entry.meaning,
      choices:tools.shuffle(uniqueValues([entry.meaning,...wrongs])),
      checkAnswer:value=>normalizeText(value)===normalizeText(entry.meaning),
      payload:{source:"word",mode:"choice",level:entry.level,day:entry.day,word:entry.word}
    };
  }

  function scrambleLetters(word,tools){
    const answer=normalizeScramble(word);
    if(!answer)return[];

    let letters=tools.shuffle(answer.split(""));
    if(letters.join("")===answer&&letters.length>1){
      letters=letters.reverse();
    }
    return letters;
  }

  function createWordScrambleQuestion(pool,tools){
    const rows=filteredWords(pool).filter(entry=>normalizeScramble(entry.word).length>=2);
    const entry=pick(rows,tools.randInt);
    if(!entry)return null;

    const meta=wordMetaLine(entry);
    const example=entry.example?"\n"+entry.example:"";

    return{
      id:"word-scramble-"+entry.id,
      type:QUESTION_TYPES.WORD_SCRAMBLE,
      prompt:"단어를 완성하세요.\n"+entry.meaning+(meta?"\n"+meta:"")+example,
      answer:entry.word,
      checkAnswer:value=>normalizeScramble(value)===normalizeScramble(entry.word),
      payload:{source:"word",mode:"scramble",level:entry.level,day:entry.day,word:entry.word,letters:scrambleLetters(entry.word,tools)}
    };
  }

  function configuredFactories(){
    const config=readConfig();
    const pools=config&&Array.isArray(config.pools)?config.pools:[];
    const factories=[];

    pools.forEach(pool=>{
      const kind=poolKind(pool);
      if(kind==="aisth")factories.push(tools=>createAisthQuestion(pool,tools));
      if(kind==="wordChoice")factories.push(tools=>createWordChoiceQuestion(pool,tools));
      if(kind==="wordScramble")factories.push(tools=>createWordScrambleQuestion(pool,tools));
    });

    return factories;
  }

  function normalizeQuestion(question){
    return{
      id:question.id||"question",
      type:question.type||QUESTION_TYPES.MULTIPLE_CHOICE,
      prompt:question.prompt||question.text||"",
      answer:question.answer,
      choices:question.choices||[],
      checkAnswer:question.checkAnswer||null,
      payload:question.payload||null
    };
  }

  function create(tools){
    const options=getTools(tools||{});
    const configured=configuredFactories();

    if(configured.length){
      const ordered=options.shuffle([...configured]);
      for(let i=0;i<ordered.length;i++){
        const question=ordered[i](options);
        if(question)return normalizeQuestion(question);
      }
    }

    const factory=fallbackFactories[options.randInt(0,fallbackFactories.length-1)];
    return normalizeQuestion(factory(options));
  }

  global.ByuriQuestionBank={
    STORAGE_KEY,
    QUESTION_TYPES,
    create,
    normalizeQuestion,
    readConfig
  };
})(window);