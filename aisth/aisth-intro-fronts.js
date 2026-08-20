(function (global) {
  "use strict";

  const INTRO_MAP = {
    "0-1": {
      title: "단수/복수",
      maxSteps: 3,
      steps: [
        {
          title: "주어에 s가 있다면, 동사엔 s가 없습니다",
          titleHtml: buildL0e1Step1TitleHtml(),
          exampleHtml: buildL0e1Step1Example(),
        },
        {
          title: "주어에 s가 없다면 동사엔 s가 있습니다",
          titleHtml: buildL0e1Step2TitleHtml(),
          exampleHtml: buildL0e1Step2Example(),
        },
        {
          title: "이제 직접 해보세요!",
        },
      ],
    },    "2-1": {
      title: "시제",
      maxSteps: 6,
      steps: [
        {
          title: "시간 표현은 어떻게 쓸까요?",
          body: "",
          exampleHtml: buildTenseTimeExpressionHtml(),
        },
        {
          title: "지금 하는 건(현재), 그냥 동사를 그대로 써줍시다.",
          body: "",
          exampleHtml: buildLonelyWalkHtml(),
        },
        {
          title: "과거라면 'ed'를 더해줍시다. 어제 난 걸었다!",
          body: "",
          exampleHtml: buildTenseFormulaHtml("past"),
        },
        {
          title: "미래라면 'will'을 더해줍시다. 내일 난 걸을거야!",
          body: "",
          exampleHtml: buildTenseFormulaHtml("future"),
        },
        {
          title: "'하고있는 중이야!!'를 강조하고 싶다면, be V ing로 바꿔버리세요.",
          body: "",
          exampleHtml: buildTenseFormulaHtml("progressive"),
        },
        {
          title: "이제 시점에 따라 적당한 형태를 바꿔보세요!",
          body: "",
          exampleHtml: buildTenseRotationHtml(),
        },
      ],
    },
    "2-2": {
      title: "조동사",
      maxSteps: 5,
      steps: [
        {
          title: "그러면, '하고 싶다!!'는 어떻게 쓸까요? '해야 한다', '안 한다'는요?",
          body: "",
          exampleHtml: buildModalQuestionHtml(),
        },
        {
          title: "앞에다 뭘 붙여봅시다. '할 것이다' 처럼 말이에요.",
          body: "",
          exampleHtml: buildModalPrefixHtml(),
        },
        {
          title: "우리는 이걸 '조동사'라고 부릅니다.",
          body: "",
          exampleHtml: buildModalSingleWordListHtml(),
        },
        {
          title: "단어를 두개 써도, 조동사로 기억해버리세요!",
          body: "",
          exampleHtml: buildModalPhraseListHtml(),
        },
        {
          title: "이제 직접 조동사를 넣어보세요!",
          body: "",
          exampleHtml: buildModalPracticeHtml(),
        },
      ],
    },
    "2-3": {
      title: "여러 단어 유사조동사",
      maxSteps: 5,
      steps: [
        {
          title: "2-2 마지막에서 여러 단어짜리 표현을 살짝 맛봤습니다.",
          body: "",
          exampleHtml: buildModalPhraseBridgeHtml(),
        },
        {
          title: "have to와 need to는 의무와 필요를 나타냅니다.",
          body: "",
          exampleHtml: buildModalObligationPhraseHtml(),
        },
        {
          title: "don't have to는 '하지 마'가 아니라 '안 해도 돼'입니다.",
          body: "",
          exampleHtml: buildModalNoNeedPhraseHtml(),
        },
        {
          title: "used to와 be able to도 한 덩어리처럼 기억하세요.",
          body: "",
          exampleHtml: buildModalHabitAbilityPhraseHtml(),
        },
        {
          title: "길어도 앞 덩어리 + 본동사 구조는 똑같습니다.",
          body: "",
          exampleHtml: buildModalPhrasePracticeHtml(),
        },
      ],
    },
    "3-1": {
      title: "의문문",
      maxSteps: 4,
      steps: [
        {
          title: "질문은 어떻게 만들까요?",
          body: "",
          exampleHtml: buildQuestionAskHtml(),
        },
        {
          title: "순서를 바꿔주면 됩니다. 새치기!",
          body: "",
          exampleHtml: buildQuestionSwapHtml(),
        },
        {
          title: "동사 안의 (또는 be동사, 조동사)를 앞으로 쪽옥 뽑아주세요.",
          body: "",
          exampleHtml: buildQuestionPullHtml(),
        },
        {
          title: "의문문, 완성입니다!",
          body: "",
          exampleHtml: buildQuestionCompleteHtml(),
        },
      ],
    },
    "retired-3-2": {
      title: "의문문",
      steps: [
        {
          title: "평서문은 그냥 말하는 문장입니다.",
          body: "He is tired. = 그는 피곤하다.",
          rows: [
            ["He is tired."],
            ["그는 피곤하다."],
          ],
        },
        {
          title: "의문문은 물어보는 문장입니다.",
          body: "Is he tired? = 그는 피곤하니?",
          rows: [
            ["Is he tired?"],
            ["그는 피곤하니?"],
          ],
        },
        {
          title: "am / are / is / can / will 같은 말이 있으면 그것을 앞으로 보냅니다.",
          body: "",
          rows: [
            ["am"],
            ["are"],
            ["is"],
            ["can"],
            ["will"],
          ],
        },
        {
          title: "그런 말이 없고 행동동사만 있으면 앞에 do / does / did를 붙입니다.",
          body: "",
          rows: [
            ["do"],
            ["does"],
          ],
        },
        {
          title: "이제 평서문을 보고 질문 문장으로 바꿔봅니다.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "3-2": {
      title: "부정문",
      maxSteps: 4,
      steps: [
        {
          title: "'아니다'는 Not입니다.",
          body: "",
          exampleHtml: buildNegativeNotHtml(),
        },
        {
          title: "그럼 is, do(walk)는 어떻게 '아니라'고 할까요?",
          body: "",
          exampleHtml: buildNegativeTargetsHtml(),
        },
        {
          title: "be는 not을 붙여봅시다. 아니야!",
          body: "",
          exampleHtml: buildNegativeBeHtml(),
        },
        {
          title: "do(walk)는 don't walk을 앞에 붙여줍시다. 안해!",
          body: "",
          exampleHtml: buildNegativeDoHtml(),
        },
      ],
    },
    "3-3": {
      title: "비교급 / 최상급",
      maxSteps: 4,
      steps: [
        {
          title: "내가 더 빨라!는 어떻게 말할까요?",
          body: "",
          exampleHtml: buildCompareMoreQuestionHtml(),
        },
        {
          title: "'more'을 붙여줍니다. 짧은 단어는 '-er'을 붙여버려요.",
          body: "",
          exampleHtml: buildCompareMoreErHtml(),
        },
        {
          title: "너보다 더 빨라는요? 'than'까지 붙여줍니다.",
          body: "",
          exampleHtml: buildCompareThanHtml(),
        },
        {
          title: "내가 제일 빨라!는요? 'MOST'를 붙여줍니다. (또는 -est)",
          body: "",
          exampleHtml: buildCompareMostHtml(),
        },
      ],
    },
    "3-4": {
      title: "There is / Here is",
      maxSteps: 4,
      steps: [
        {
          title: "여기있다, 저기있다!!는 어떻게 쓸까요?",
          body: "",
          exampleHtml: buildThereHereQuestionHtml(),
        },
        {
          title: "강하게 말하고 싶으니, 맨 앞에 써줍시다. 여기!! 저기!!",
          body: "",
          exampleHtml: buildThereFrontHtml(),
        },
        {
          title: "그 후에 '~에 있다'를 붙여줍시다.",
          body: "",
          exampleHtml: buildThereIsHtml(),
        },
        {
          title: "아무거나 넣어도 완성!",
          body: "",
          exampleHtml: buildThereCompleteHtml(),
        },
      ],
    },
    "4-1": {
      title: "격",
      maxSteps: 4,
      steps: [
        {
          title: "영어에는 은 / 는 이 / 가 가 없습니다. 그럼 나는 / 나를 / 나의 는 어떻게 쓸까요?",
          body: "",
          exampleHtml: buildPronounQuestionHtml(),
        },
        {
          title: "정답은, 다 따로 단어로 만든다! 입니다.",
          body: "",
          exampleHtml: buildPronounSeparateHtml(),
        },
        {
          title: "뜻에 따라 다르게 넣어줘야해요.",
          body: "",
          exampleHtml: buildPronounMeaningShiftHtml(),
        },
        {
          title: "억울하지만, 다 외워줍시다.",
          body: "",
          exampleHtml: buildPronounMemorizeHtml(),
        },
      ],
    },
    "4-2": {
      title: "전치사1",
      maxSteps: 3,
      steps: [
        {
          title: "아니 정확히 어디라고?",
          body: "",
          exampleHtml: buildPrepositionSpecificHtml(),
        },
        {
          title: "'~옆에', '~뒤', '~근처에' 처럼, 위치는 '전치사'로 정해줍니다.",
          body: "",
          exampleHtml: buildPrepositionOrderHtml(),
        },
        {
          title: "뒷 단어의 위치라는 점, 꼭 기억해주세요!",
          body: "",
          exampleHtml: buildPrepositionBackWordHtml(),
        },
      ],
    },
    "4-3": {
      title: "if : 만약에…",
      maxSteps: 2,
      steps: [
        {
          title: "만약에..는 어떻게 써주면 좋을까요?",
          body: "",
          exampleHtml: buildIfQuestionHtml(),
        },
        {
          title: "if를 써줍니다.",
          body: "",
          exampleHtml: buildIfUseHtml(),
        },
      ],
    },
    "5-1": {
      title: "불규칙",
      maxSteps: 4,
      steps: [
        {
          title: "영어는 정신이 나갔습니다. 잘 쓰던 ed를 파괴해봅시다.",
          body: "",
          exampleHtml: buildIrregularBreakHtml(),
        },
        {
          title: "그대신 전용 단어를 써줄거에요. 미쳤죠?",
          body: "",
          exampleHtml: buildIrregularDedicatedHtml(),
        },
        {
          title: "이걸 보통 '불규칙 동사'라고 부릅니다.",
          body: "",
          exampleHtml: buildIrregularNameHtml(),
        },
        {
          title: "억울하지만, 다 외워줍시다.",
          body: "",
          exampleHtml: buildIrregularMemorizeHtml(),
        },
      ],
    },
    "5-2": {
      title: "현재완료",
      maxSteps: 3,
      steps: [
        {
          title: "이제 강조를 위한 표현을 또 배워봅시다.",
          body: "",
          exampleHtml: buildPerfectEmphasisHtml(),
        },
        {
          title: "저번 시간에 배웠던 P.P에 have를 더해주면 됩니다.",
          body: "",
          exampleHtml: buildPerfectFormulaHtml(),
        },
        {
          title: "자주 쓰진 않지만, 찰떡같이 쓰입니다!",
          body: "",
          exampleHtml: buildPerfectUseHtml(),
        },
      ],
    },
    "5-3": {
      title: "접속사",
      maxSteps: 3,
      steps: [
        {
          title: "할 말이 많으면, 짧은 말을 이어줘야 합니다.",
          body: "",
          exampleHtml: buildConjunctionWordsHtml(),
        },
        {
          title: "방금 문장을 영어로 그대로 옮겨봅시다.",
          body: "",
          exampleHtml: buildConjunctionTranslateHtml(),
        },
        {
          title: "자주 쓰는 접속사를 먼저 살펴봅시다.",
          body: "",
          exampleHtml: buildConjunctionListHtml(),
        },
      ],
    },
    "5-4": {
      title: "조동사2",
      maxSteps: 4,
      steps: [
        {
          title: "더 더 어려운 말은 어떻게 쓸까요? 조동사 2개로?",
          body: "",
          exampleHtml: buildAdvancedModalQuestionHtml(),
        },
        {
          title: "조동사는 1개만 쓸 수 없어요.",
          body: "",
          exampleHtml: buildAdvancedModalWrongHtml(),
        },
        {
          title: "그래서 옛날 사람들은 꼼수를 발견했습니다. 조동사처럼 쓰기!",
          body: "",
          exampleHtml: buildAdvancedModalTrickHtml(),
        },
        {
          title: "길어보이지만, 조동사란걸 기억하세요!",
          body: "",
          exampleHtml: buildAdvancedModalRememberHtml(),
        },
      ],
    },
    "6-1": {
      title: "-ing / -ed 1. 분사",
      maxSteps: 4,
      steps: [
        {
          title: "ing와 ed를 구분해봅시다. 시제에서 봤었죠?",
          body: "",
          exampleHtml: buildIngEdCompareHtml(),
        },
        {
          title: "ing는 가합니다. 지금 하고있습니다.",
          body: "",
          exampleHtml: buildIngActiveHtml(),
        },
        {
          title: "ed는 당합니다. 이미 다 끝났거든요.",
          body: "",
          exampleHtml: buildEdPassiveHtml(),
        },
        {
          title: "'가하는 상태', '당하는 상태' 라는 개념은 앞으로도 아주 중요하니 꼭 기억해둡시다!",
          body: "",
          exampleHtml: buildIngEdDirectionHtml(),
        },
      ],
    },
    "6-2": {
      title: "-ing / -ed 2. 동명사st",
      maxSteps: 3,
      steps: [
        {
          title: "응용해볼까요?",
          body: "",
          exampleHtml: buildIngApplicationStartHtml(),
        },
        {
          title: "'가하는 상태'만 알고있으면, 응용이 쉽습니다.",
          body: "",
          exampleHtml: buildIngStateApplyHtml(),
        },
        {
          title: "한국어로 예쁘게 다듬어만 주세요.",
          body: "",
          exampleHtml: buildIngKoreanPolishHtml(),
        },
      ],
    },
    "6-3": {
      title: "-ing / -ed 3. 수동태",
      maxSteps: 3,
      steps: [
        {
          title: "이번에는 ed를 응용해봅시다.",
          body: "",
          exampleHtml: buildPassiveApplicationStartHtml(),
        },
        {
          title: "ed는 명사 앞에서 '~된'이라는 뜻으로 꾸밉니다.",
          body: "",
          exampleHtml: buildEdBeforeNounHtml(),
        },
        {
          title: "be 뒤에 놓으면 '~되어 있다'라는 문장이 됩니다.",
          body: "",
          exampleHtml: buildEdAfterBeHtml(),
        },
      ],
    },
    "6-4": {
      title: "-ing / -ed 4. 진행형 vs 수동태",
      maxSteps: 4,
      steps: [
        {
          title: "한국사람이 어려운 건 바로 여기입니다.",
          body: "",
          exampleHtml: buildIngEdAdvancedWarningHtml(),
        },
        {
          title: "잠시만, 물건들이 살아났다고 생각해봅시다.",
          body: "",
          exampleHtml: buildObjectsAliveHtml(),
        },
        {
          title: "물건들이 가했을까요, 당했을까요?",
          body: "",
          exampleHtml: buildIngEdObjectQuestionHtml(),
        },
        {
          title: "몸에 익기 전까진 차근차근 생각해봅시다.",
          body: "",
          exampleHtml: buildIngEdThinkSlowHtml(),
        },
      ],
    },
    "6-5": {
      title: "전치사2",
      maxSteps: 3,
      steps: [
        {
          title: "어떤 전치사는 한국어로 말이 안됩니다.",
          body: "",
          exampleHtml: buildPrepositionAwkwardHtml(),
        },
        {
          title: "그럴 땐, 짝꿍과 함께 외워주는 게 좋아요.",
          body: "",
          exampleHtml: buildPrepositionPairsHtml(),
        },
        {
          title: "억울하지만, 되도록 많이 외워줍시다.",
          body: "",
          exampleHtml: buildPrepositionMemorizeHtml(),
        },
      ],
    },
    "7-1": {
      title: "S-V-T-D : 하나로 끝.",
      steps: [
        {
          title: "주어-동사 뒤엔 뭐가 올까요?",
          titleHtml: buildSvtdStackedTitleHtml(1, [
            { text: "주어", role: "subject" },
            "-",
            { text: "동사", role: "verb" },
            " 뒤엔 뭐가 올까요?",
          ]),
          body: "",
          exampleHtml: buildSvtdNextFocusHtml(),
        },
        {
          title: "'누구한테 했게요?' 부터 써줍니다. 목표 조준!",
          titleHtml: buildSvtdStackedTitleHtml(2, [
            "'",
            { text: "누구한테 했게요?", role: "target" },
            "' 부터 써줍니다. ",
            { text: "목표 조준!", role: "target" },
          ]),
          body: "",
          exampleHtml: buildSvtdTargetingHtml(),
        },
        {
          title: "'어떻게 했는 지' 뒤에 설명합니다. 추가 설명!",
          titleHtml: buildSvtdStackedTitleHtml(3, [
            "'",
            { text: "어떻게 했는 지", role: "detail" },
            "' 뒤에 설명합니다. ",
            { text: "추가 설명!", role: "detail" },
          ]),
          body: "",
          exampleHtml: buildSvtdDetailTooltipHtml(),
        },
        {
          title: "S(누가) - V(했다) - T(누구한테) - D(어떻게)의 순서에 익숙해져보세요!",
          titleHtml: buildSvtdStackedTitleHtml(4, [
            { text: "S(누가)", role: "subject" },
            " - ",
            { text: "V(했다)", role: "verb" },
            " - ",
            { text: "T(누구한테)", role: "target" },
            " - ",
            { text: "D(어떻게)", role: "detail" },
            "의 순서에 익숙해져보세요!",
          ]),
          body: "",
          exampleHtml: buildSvtdFlipSentenceHtml(),
        },
      ],
    },
    "7-2": {
      title: "S-V-T-D : 하나로 끝.",
      steps: [
        {
          title: "문장의 각 단어 아래에는 원 하나가 있습니다.",
          body: "단어 하나마다 역할 글자 하나를 놓습니다.",
          rows: [
            ["She  cleaned  the  room"],
          ],
        },
        {
          title: "아래의 S·V·T·D 원을 단어로 끌어갑니다.",
          body: "S   V   T   D",
          rows: [
            ["S", "V", "T", "D"],
          ],
        },
        {
          title: "주인공 단어에는 S, 행동 단어에는 V를 놓습니다.",
          body: "She → S / cleaned → V",
          rows: [
            ["She → S"],
            ["cleaned → V"],
          ],
        },
        {
          title: "한 역할이 여러 단어에 이어져도 하나씩 놓습니다.",
          body: "the → T / room → T",
          rows: [
            ["the → T"],
            ["room → T"],
          ],
        },
        {
          title: "시간·장소·방법을 나타내는 각 단어에는 D를 놓습니다.",
          body: "every → D / morning → D",
          rows: [
            ["every → D"],
            ["morning → D"],
          ],
        },
      ],
    },
    "7-3": {
      title: "that",
      maxSteps: 4,
      steps: [
        {
          title: "영어에는 은, 는, 이, 가, 을, 를이 없습니다.",
          body: "",
          exampleHtml: buildThatNoParticlesHtml(),
        },
        {
          title: "정 답답할 경우 '근데 그게 뭐냐면..' 만 씁니다.",
          body: "",
          exampleHtml: buildThatBridgeOnlyHtml(),
        },
        {
          title: "우린 이걸 that이라고 부릅니다.",
          titleHtml: buildThatTitleHtml("우린 이걸 ", "이라고 부릅니다."),
          body: "",
          exampleHtml: buildThatNameHtml(),
        },
        {
          title: "that을 넣고 빼보세요!",
          titleHtml: buildThatTitleHtml("", "을 넣고 빼보세요!"),
          body: "",
          exampleHtml: buildThatToggleHtml(),
        },
      ],
    },
    "8-1": {
      title: "가정법 과거완료",
      steps: [
        {
          title: "가정법 과거완료는 “과거에 실제로는 안 했는데, 했더라면…”을 말할 때 씁니다.",
          body: "",
          rows: [
            ["과거에 실제로는 안 했는데, 했더라면…"],
          ],
        },
        {
          title: "기본 느낌은 후회나 상상입니다.",
          body: "“내가 더 열심히 공부했더라면, 합격했을 텐데.”",
          rows: [
            ["내가 더 열심히 공부했더라면, 합격했을 텐데."],
          ],
        },
        {
          title: "조건 쪽은 If + had + 세 번째 동사모양을 씁니다.",
          body: "If I had studied harder",
          rows: [
            ["If", "had"],
            ["If", "had studied", "harder"],
          ],
        },
        {
          title: "결과 쪽은 would have + 세 번째 동사모양을 씁니다.",
          body: "I would have passed",
          rows: [
            ["would"],
            ["would"],
          ],
        },
        {
          title: "이제 “과거에 못 한 일”과 “달라졌을 결과”를 연결해봅니다.",
          body: "",
          rows: [
            ["과거에 못 한 일"],
            ["달라졌을 결과"],
          ],
        },
      ],
    },
    "8-2": {
      title: "도치, 강조, 분사구문",
      steps: [
        {
          title: "영어는 보통 주어 + 동사 순서입니다.",
          body: "그런데 강조하려고 순서가 바뀌는 경우가 있습니다.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "Never, Hardly, Only after 같은 말이 앞에 오면 뒤의 순서가 흔들릴 수 있습니다.",
          body: "Never have I seen...",
          rows: [
            ["Never", "Hardly", "Only", "after"],
            ["Never", "have", "seen"],
          ],
        },
        {
          title: "이런 문장을 볼 때는 놀라지 말고 진짜 주어와 진짜 동사를 다시 찾습니다.",
          body: "I have seen이 원래 뼈대입니다.",
          rows: [
            ["have"],
          ],
        },
        {
          title: "분사구문은 문장을 짧게 줄인 표현입니다.",
          body: "Walking down the street, I saw him. = 길을 걷다가, 나는 그를 보았다.",
          rows: [
            ["Walking down the street, I saw him."],
            ["길을 걷다가, 나는 그를 보았다."],
          ],
        },
        {
          title: "이제 특이한 어순이나 줄어든 표현이 나와도 중심 문장을 찾아봅니다.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "8-3": {
      title: "대명사 it / that / one",
      steps: [
        {
          title: "대명사는 앞에 나온 말을 다시 가리키는 말입니다.",
          body: "하지만 it, that, one은 쓰임이 다릅니다.",
          rows: [
            ["it"],
            ["that"],
          ],
        },
        {
          title: "it은 날씨, 시간, 상황, 앞의 대상을 받을 때 자주 씁니다.",
          body: "It is raining. = 비가 온다.",
          rows: [
            ["It is raining."],
            ["비가 온다."],
          ],
        },
        {
          title: "that은 앞에서 말한 내용이나 대상을 조금 떨어져서 가리키는 느낌입니다.",
          body: "That is true. = 그것은 사실이다.",
          rows: [
            ["That is true."],
            ["그것은 사실이다."],
          ],
        },
        {
          title: "one은 앞에 나온 명사와 같은 종류의 “하나”를 대신합니다.",
          body: "I need a pen. Do you have one?",
          rows: [
            ["하나"],
          ],
        },
        {
          title: "이제 대명사가 정확히 무엇을 대신하는지 찾아봅니다.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "8-4": {
      title: "간접의문문",
      steps: [
        {
          title: "직접 질문은 Where is the restroom?처럼 묻는 문장입니다.",
          body: "",
          rows: [
            ["is"],
          ],
        },
        {
          title: "간접의문문은 질문을 다른 문장 안에 넣은 것입니다.",
          body: "Can you tell me where the restroom is?",
          rows: [
            ["is"],
          ],
        },
        {
          title: "간접의문문 안에서는 보통 의문사 + 주어 + 동사 순서가 됩니다.",
          body: "where + the restroom + is",
          rows: [
            ["is"],
          ],
        },
        {
          title: "한국어로는 “화장실이 어디에 있는지”처럼 ~인지 / ~하는지 느낌이 납니다.",
          body: "",
          rows: [
            ["화장실이 어디에 있는지"],
          ],
        },
        {
          title: "이제 문장 안에서 “어디에 있는지 / 언제 시작하는지 / 무엇을 원하는지” 부분을 찾아 밑줄쳐봅니다.",
          body: "",
          rows: [
            ["어디에 있는지 / 언제 시작하는지 / 무엇을 원하는지"],
          ],
        },
      ],
    },
    "8-5": {
      title: "To부정사의 용법",
      steps: [
        {
          title: "to + 동사는 문장 안에서 여러 역할을 할 수 있습니다.",
          body: "예: to swim, to study, to be",
          rows: [
            ["to"],
            ["to swim", "to study", "to be"],
          ],
        },
        {
          title: "“~하는 것”이라는 뜻이면 명사처럼 쓰인 것입니다.",
          body: "To swim is fun. = 수영하는 것은 재미있다.",
          rows: [
            ["~하는 것"],
            ["To swim is fun.", "수영하는 것은 재미있다."],
          ],
        },
        {
          title: "앞의 명사를 설명하면 형용사처럼 쓰인 것입니다.",
          body: "something to eat = 먹을 것",
          rows: [
            ["something to eat"],
            ["먹을 것"],
          ],
        },
        {
          title: "이유나 목적을 말하면 부사처럼 쓰인 것입니다.",
          body: "I went there to study. = 공부하기 위해 거기에 갔다.",
          rows: [
            ["I went there to study."],
            ["공부하기 위해 거기에 갔다."],
          ],
        },
        {
          title: "이제 to + 동사가 문장에서 “것 / 할 / 하기 위해” 중 어떤 느낌인지 골라봅니다.",
          body: "",
          rows: [
            ["것 / 할 / 하기 위해"],
          ],
        },
      ],
    },
    "8-6": {
      title: "동명사와 To부정사의 의미 차이",
      steps: [
        {
          title: "-ing와 to + 동사는 둘 다 “~하는 것”처럼 보일 때가 있습니다.",
          body: "",
          rows: [
            ["~하는 것"],
          ],
        },
        {
          title: "하지만 느낌이 다릅니다.",
          body: "-ing는 이미 하고 있거나 실제로 한 행동에 가까울 때가 많습니다.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "to + 동사는 앞으로 할 일, 목적, 방향에 가까울 때가 많습니다.",
          body: "",
          rows: [
            ["to"],
          ],
        },
        {
          title: "stop smoking은 “담배 피우는 것을 멈추다”입니다.",
          body: "stop to smoke는 “담배 피우려고 멈추다”입니다.",
          rows: [
            ["담배 피우는 것을 멈추다"],
            ["담배 피우려고 멈추다"],
          ],
        },
        {
          title: "이제 -ing인지 to + 동사인지에 따라 의미가 어떻게 달라지는지 골라봅니다.",
          body: "",
          rows: [
            ["to"],
          ],
        },
      ],
    },
    "8-7": {
      title: "사역동사 / 지각동사 구문",
      steps: [
        {
          title: "어떤 동사는 “누가 누구에게 무엇을 하게 했다”를 만들 수 있습니다.",
          body: "예: make, let, help",
          rows: [
            ["누가 누구에게 무엇을 하게 했다"],
            ["make", "let", "help"],
          ],
        },
        {
          title: "make + 사람 + 동사 기본모양은 “사람에게 ~하게 시키다”입니다.",
          body: "She made me wash the dishes.",
          rows: [
            ["사람에게 ~하게 시키다"],
            ["She", "made me", "wash the", "dishes"],
          ],
        },
        {
          title: "어떤 동사는 “누가 무엇을 하는 것을 보았다/들었다”를 만들 수 있습니다.",
          body: "예: see, hear, watch",
          rows: [
            ["누가 무엇을 하는 것을 보았다/들었다"],
            ["see", "hear", "watch"],
          ],
        },
        {
          title: "see + 사람 + 동사 기본모양은 그 행동을 봤다는 뜻입니다.",
          body: "I saw him walk into the building.",
          rows: [
            ["see"],
            ["saw him", "walk into", "the building"],
          ],
        },
        {
          title: "이제 make / let / see / hear / watch 뒤에 누가 무엇을 하는지 찾아봅니다.",
          body: "9단원",
          rows: [
            ["make"],
            ["let"],
            ["see"],
            ["hear"],
          ],
        },
      ],
    },
    "9-1": {
      title: "자잘한 초등문법",
      steps: [
        {
          title: "영어에는 작지만 자주 틀리는 기본 규칙들이 있습니다.",
          body: "예: a / an, 복수형, 셀 수 있는 명사와 셀 수 없는 명사",
          rows: [
            ["a / an"],
            ["복수형"],
            ["셀 수 있는 명사와 셀 수 없는 명사"],
          ],
        },
        {
          title: "a와 an은 글자가 아니라 소리로 고릅니다.",
          body: "모음 소리로 시작하면 보통 an을 씁니다. 예: an elephant, an honest man",
          rows: [
            ["an elephant"],
            ["an honest man"],
          ],
        },
        {
          title: "복수형은 보통 s를 붙이지만, 불규칙도 있습니다.",
          body: "child → children, goose → geese",
          rows: [
            ["child"],
            ["→"],
            ["children, goose → geese"],
          ],
        },
        {
          title: "어떤 명사는 하나, 둘로 세기 어렵습니다.",
          body: "information, advice, water 같은 말은 조심해야 합니다.",
          rows: [
            ["information"],
            ["advice"],
            ["water"],
          ],
        },
        {
          title: "이제 작은 규칙들을 하나씩 확인하면서 자연스러운 표현을 골라봅니다.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
  };

  INTRO_MAP["7-2"] = INTRO_MAP["7-1"];

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function tokenRole(cell) {
    return cell && typeof cell === "object" ? String(cell.role || "") : "";
  }

  function tokenLabel(cell) {
    return cell && typeof cell === "object" ? cell.label : cell;
  }

  function tokenCaption(cell) {
    return cell && typeof cell === "object" ? String(cell.caption || "") : "";
  }

  function tokenClass(index, cell) {
    const role = tokenRole(cell);
    if (role === "subject") return " is-subject";
    if (role === "verb") return " is-verb";
    if (role) return "";
    return index === 0 ? " is-subject" : index === 1 ? " is-verb" : "";
  }

  function svtdRoleStyleRules(role) {
    if (role === "subject") {
      return ["border-color:#2f8f55", "background:#e2f7e8", "color:#17643c"];
    }
    if (role === "verb") {
      return ["border-color:var(--aisth-role-v-border, #c88a12)", "background:var(--aisth-role-v-bg, #fff4cc)", "color:var(--aisth-role-v-text, #7a4a00)"];
    }
    if (role === "target") {
      return ["border-color:#dc3f3f", "background:#ffe1e1", "color:#a91f1f"];
    }
    if (role === "detail") {
      return ["border-color:#111", "background:#1f1f1f", "color:#fff"];
    }
    if (role === "pending") {
      return ["border-color:rgba(126,49,6,0.18)", "background:rgba(255,255,255,0.82)", "color:rgba(126,49,6,0.62)"];
    }
    return [];
  }

  function styleAttr(styles) {
    return styles.length ? ` style="${styles.join(";")}"` : "";
  }

  function roleStyleAttr(role, extraStyles = []) {
    return styleAttr([...svtdRoleStyleRules(role), ...extraStyles]);
  }

  function tokenStyle(cell) {
    const styles = [];
    if (tokenCaption(cell)) {
      styles.push("flex-direction:column", "gap:1px", "min-width:38px", "min-height:30px", "padding:4px 6px", "font-size:13px", "line-height:1.05");
    }
    styles.push(...svtdRoleStyleRules(tokenRole(cell)));
    return styleAttr(styles);
  }

  function buildTokenHtml(cell, index) {
    const role = tokenRole(cell);
    const label = String(tokenLabel(cell) ?? "");
    if (role === "arrow") {
      return `<span class="lip-example-symbol" style="font-size:13px;line-height:1;">${escapeHtml(label || "→")}</span>`;
    }
    const caption = tokenCaption(cell);
    const captionHtml = caption
      ? `<span style="font-size:9px;line-height:1;font-weight:800;opacity:0.78;">${escapeHtml(caption)}</span>`
      : "";
    return `<span class="lip-example-token${tokenClass(index, cell)}"${tokenStyle(cell)}><span>${escapeHtml(label)}</span>${captionHtml}</span>`;
  }


  function buildL0e1RuleExample(subject, verb, note) {
    const noteHtml = note ? `<div class="lip-example-note">${escapeHtml(note)}</div>` : "";
    return `
      <div class="lip-grammar-demo">
        <div class="lip-grammar-side is-subject">
          <div class="lip-grammar-side-label">Subject</div>
          <div class="lip-grammar-token">${subject}</div>
        </div>
        <div class="lip-grammar-arrow">→</div>
        <div class="lip-grammar-side is-verb">
          <div class="lip-grammar-side-label">Verb</div>
          <div class="lip-grammar-token">${verb}</div>
        </div>
      </div>
      ${noteHtml}
    `;
  }

  function buildL0e1CircleS(char) {
    return `<span class="lip-grammar-mark is-ring">${escapeHtml(char)}</span>`;
  }

  function buildL0e1MissingS() {
    return `<span class="lip-grammar-miss" aria-hidden="true"></span>`;
  }

  function buildL0e1InstructionWord(text, variant) {
    return `<span class="lip-inline-word lip-inline-word-${variant}">${escapeHtml(text)}</span>`;
  }

  function buildL0e1InstructionS() {
    return `<span class="lip-inline-s">${escapeHtml("s")}</span>`;
  }

  function buildL0e1PlainS() {
    return escapeHtml("s");
  }

  function buildL0e1Step1TitleHtml() {
    return `${buildL0e1InstructionWord("주어", "subject")}에 ${buildL0e1InstructionS()}가 있다면, ${buildL0e1InstructionWord("동사", "verb")}엔 ${buildL0e1PlainS()}가 없습니다`;
  }

  function buildL0e1Step2TitleHtml() {
    return `${buildL0e1InstructionWord("주어", "subject")}에 ${buildL0e1PlainS()}가 없다면 ${buildL0e1InstructionWord("동사", "verb")}엔 ${buildL0e1InstructionS()}가 있습니다`;
  }

  function buildL0e1Step1Example() {
    return buildL0e1RuleExample(
      `dog${buildL0e1CircleS("s")}`,
      `run${buildL0e1MissingS()}`
    );
  }

  function buildL0e1Step2Example() {
    return buildL0e1RuleExample(
      `he${buildL0e1MissingS()}`,
      `run${buildL0e1CircleS("s")}`
    );
  }
  function buildExampleHtml(rows) {
    if (!Array.isArray(rows) || !rows.length) return "";
    return rows.map((row) => {
      const cells = Array.isArray(row) ? row : [row];
      return `<div class="lip-example-row">${cells.map((cell, index) => buildTokenHtml(cell, index)).join("")}</div>`;
    }).join("");
  }

  function buildTenseTimeExpressionHtml() {
    const items = [
      { lead: "어제 ", mark: "했", tail: "다" },
      { lead: "내일 ", mark: "할 거", tail: "야" },
      { lead: "지금 ", mark: "하고있", tail: "어" },
    ];

    return `
      <div class="lip-example-stack">
        ${items.map((item) => `
          <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
            ${buildTenseText(item.lead)}
            ${buildTenseMarker(item.mark)}
            ${buildTenseText(item.tail)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildLonelyWalkHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;gap:10px;">
          ${buildTenseStateLabel("현재:")}
          ${buildTenseChip("walk", "verb", "hero")}
        </div>
      </div>
    `;
  }

  function buildTenseFormulaHtml(type) {
    const formulas = {
      past: {
        label: "과거:",
        parts: [
          buildTenseChip("walk", "verb", "boss"),
          buildTenseMarker("ed"),
        ],
      },
      future: {
        label: "미래:",
        parts: [
          buildTenseMarker("will"),
          buildTenseChip("walk", "verb", "boss"),
        ],
      },
      progressive: {
        label: "진행:",
        parts: [
          buildTenseMarker("be"),
          buildTenseChip("walk", "verb", "boss"),
          buildTenseMarker("ing"),
        ],
      },
    };
    const formula = formulas[type] || { label: "", parts: [] };

    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;gap:10px;">
          ${buildTenseStateLabel(formula.label)}
          ${formula.parts.join("")}
        </div>
      </div>
    `;
  }

  function buildTenseRotationHtml() {
    const states = [
      { label: "현재", before: "", after: "" },
      { label: "과거", before: "", after: "ed" },
      { label: "미래", before: "will", after: "" },
      { label: "진행", before: "be", after: "ing" },
    ];

    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <div class="lip-rotator-window" style="flex:0 0 236px;width:236px;height:48px;">
            ${states.map((state, index) => `
              <span class="lip-rotator-item" style="--lip-delay:${(index * 1.4).toFixed(1)}s;align-items:center;justify-content:center;gap:8px;">
                ${buildTenseStateLabel(state.label)}
                ${state.before ? buildTenseMarker(state.before) : buildTenseGhostMarker()}
                ${buildTenseChip("walk", "verb", "boss")}
                ${state.after ? buildTenseMarker(state.after) : buildTenseGhostMarker()}
              </span>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function buildTenseText(text) {
    return `<span class="aisth-tense-text" style="font-size:15px;line-height:1.35;font-weight:900;color:#3c2d22;">${escapeHtml(text)}</span>`;
  }

  function buildTenseSymbol(symbol) {
    return `<span class="lip-example-symbol aisth-tense-symbol" style="font-size:13px;line-height:1;color:#7e3106;">${escapeHtml(symbol)}</span>`;
  }

  function buildTenseMarker(text) {
    return `<span class="aisth-tense-marker" style="display:inline-flex;align-items:center;justify-content:center;font-size:15px;line-height:1;font-weight:950;color:#f17b2a;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildTenseGhostMarker() {
    return `<span style="width:24px;height:1px;flex:0 0 24px;"></span>`;
  }

  function buildTenseStateLabel(text) {
    return `<span style="font-size:12px;line-height:1;font-weight:950;color:#7e3106;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildTenseChip(text, variant, size) {
    const variants = {
      verb: ["border-color:var(--aisth-role-v-border, #c88a12)", "background:var(--aisth-role-v-bg, #fff4cc)", "color:var(--aisth-role-v-text, #7a4a00)", "box-shadow:0 0 12px var(--aisth-role-v-glow, rgba(216,162,27,.30))"],
      adv: ["border-color:rgba(43,103,199,0.24)", "background:rgba(235,243,255,0.98)", "color:#2b67c7"],
      adj: ["border-color:rgba(255,187,74,0.26)", "background:rgba(255,247,228,0.98)", "color:#7e5a06"],
    };
    const sizes = {
      hero: ["min-width:116px", "min-height:54px", "padding:5px 18px", "font-size:28px"],
      boss: ["min-width:86px", "min-height:42px", "padding:5px 15px", "font-size:20px"],
      normal: ["min-height:30px", "padding:4px 10px", "font-size:13px"],
      compact: ["min-height:26px", "padding:3px 8px", "font-size:13px"],
      small: ["min-height:22px", "padding:2px 7px", "font-size:11px"],
    };
    const styles = [
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "border-radius:999px",
      "border:1px solid transparent",
      "font-weight:900",
      "line-height:1",
      "white-space:nowrap",
      ...(variants[variant] || variants.verb),
      ...(sizes[size] || sizes.normal),
    ];

    return `<span class="aisth-tense-chip aisth-tense-chip-${variant || "plain"} aisth-tense-chip-${size || "normal"}" style="${styles.join(";")}">${escapeHtml(text)}</span>`;
  }

  function buildQuestionAskHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildTenseText("평소문장")}
          ${buildTenseSymbol("→")}
          ${buildTenseMarker("질문?")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildTenseText("순서를 바꿀 말을 찾아봅시다")}
        </div>
      </div>
    `;
  }

  function buildQuestionSwapHtml() {
    return `
      <div class="lip-example-stack">
        ${buildQuestionMoveLine("is", "She", "ready?")}
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildTenseText("가운데 말이 앞으로 새치기")}
        </div>
      </div>
    `;
  }

  function buildQuestionPullHtml() {
    const rows = [
      ["is", "She", "tired?", 0],
      ["can", "you", "go?", 0.2],
      ["do", "you", "walk?", 0.4],
    ];
    return `
      <div class="lip-example-stack">
        ${rows.map(([front, subject, rest, delay]) => buildQuestionMoveLine(front, subject, rest, delay)).join("")}
      </div>
    `;
  }

  function buildQuestionCompleteHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildTenseMarker("Is")}
          ${buildTenseChip("she", "adv", "compact")}
          ${buildTenseChip("ready?", "verb", "compact")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildTenseMarker("Can")}
          ${buildTenseChip("you", "adv", "normal")}
          ${buildTenseChip("go?", "verb", "normal")}
        </div>
      </div>
    `;
  }

  function buildQuestionMoveLine(front, subject, rest, delay = 0) {
    return `
      <style>
        @keyframes aisth-question-front-pop {
          0%, 24% {
            transform: translateY(-50%) translateX(0);
            opacity: 1;
          }
          52%, 78% {
            transform: translateY(-50%) translateX(-104px);
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) translateX(0);
            opacity: 1;
          }
        }
      </style>
      <div style="position:relative;width:236px;max-width:100%;height:36px;margin:0 auto;">
        <span style="position:absolute;left:54px;top:50%;transform:translateY(-50%);">${buildTenseChip(subject, "adv", "compact")}</span>
        <span style="position:absolute;left:112px;top:50%;animation:aisth-question-front-pop 3.6s ease-in-out ${Number(delay || 0).toFixed(1)}s infinite;z-index:2;">${buildTenseMarker(front)}</span>
        <span style="position:absolute;left:150px;top:50%;transform:translateY(-50%);">${buildTenseChip(rest, "verb", "compact")}</span>
      </div>
    `;
  }

  function buildNegativeNotHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildTenseText("아니다")}
          ${buildTenseSymbol("=")}
          ${buildNegativeMarker("not")}
        </div>
      </div>
    `;
  }

  function buildNegativeTargetsHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:10px;margin-bottom:0;">
          ${buildTenseChip("is", "verb", "boss")}
          ${buildNegativeMarker("not?")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:10px;margin-bottom:0;">
          ${buildTenseChip("walk", "verb", "boss")}
          ${buildNegativeMarker("not?")}
        </div>
      </div>
    `;
  }

  function buildNegativeBeHtml() {
    return `
      <div class="lip-example-stack">
        ${buildNegativeBeRow("is", "isn't")}
        ${buildNegativeBeRow("are", "aren't")}
        ${buildNegativeBeRow("am", "am not")}
      </div>
    `;
  }

  function buildNegativeDoHtml() {
    return `
      <div class="lip-example-stack">
        ${buildNegativeDoRow("do", "don't")}
        ${buildNegativeDoRow("does", "doesn't")}
      </div>
    `;
  }

  function buildNegativeBeRow(beWord, shortForm) {
    const tail = beWord === "am" ? "late" : beWord === "are" ? "ready" : "happy";
    return `
      <div class="lip-example-row" style="justify-content:center;align-items:center;gap:8px;margin-bottom:0;">
        ${buildNegativePairWithShort(beWord, "not", shortForm)}
        ${buildTenseChip(tail, "verb", "boss")}
      </div>
    `;
  }

  function buildNegativeDoRow(doWord, shortForm) {
    return `
      <div class="lip-example-row" style="justify-content:center;align-items:center;gap:8px;margin-bottom:0;">
        ${buildNegativePairWithShort(doWord, "not", shortForm)}
        ${buildTenseChip("walk", "verb", "boss")}
      </div>
    `;
  }

  function buildNegativePairWithShort(front, negative, shortForm) {
    return `
      <span style="display:inline-grid;grid-template-columns:1fr;justify-items:center;gap:2px;">
        <span style="display:inline-flex;align-items:center;justify-content:center;gap:7px;">
          ${buildNegativePlain(front)}
          ${buildNegativeMarker(negative)}
        </span>
        ${buildNegativeMarker(`(${shortForm})`, "small")}
      </span>
    `;
  }

  function buildNegativePlain(text, size = "normal") {
    const sizes = {
      normal: ["font-size:16px"],
      small: ["font-size:12px"],
    };
    const styles = [
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "font-weight:950",
      "line-height:1",
      "white-space:nowrap",
      "color:#1f1f1f",
      ...(sizes[size] || sizes.normal),
    ];
    return `<span style="${styles.join(";")}">${escapeHtml(text)}</span>`;
  }

  function buildNegativeMarker(text, size = "normal") {
    const sizes = {
      normal: ["font-size:16px"],
      small: ["font-size:12px"],
    };
    const styles = [
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "font-weight:950",
      "line-height:1",
      "white-space:nowrap",
      "color:#dc3f3f",
      ...(sizes[size] || sizes.normal),
    ];
    return `<span style="${styles.join(";")}">${escapeHtml(text)}</span>`;
  }

  function buildCompareMoreQuestionHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildTenseText("내가 ")}
          ${buildCompareKoreanMoreMarker()}
          ${buildTenseText(" 빨라!")}
        </div>
      </div>
    `;
  }

  function buildCompareKoreanMoreMarker() {
    return buildCompareYellowMarker("더");
  }

  function buildCompareMoreErHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildCompareYellowMarker("more")}
          ${buildTenseChip("beautiful", "verb", "normal")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildTenseChip("fast", "verb", "normal")}
          ${buildCompareYellowMarker("-er")}
        </div>
      </div>
    `;
  }

  function buildCompareThanHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildTenseText("너")}
          ${buildCompareKoreanPostpositionMarker("보다")}
          ${buildCompareKoreanMoreMarker()}
          ${buildTenseText(" 빨라")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildTenseChip("fast", "verb", "normal")}
          ${buildCompareYellowMarker("-er")}
          ${buildComparePlainYellowText("than")}
          ${buildComparePlainBlackText("you")}
        </div>
      </div>
    `;
  }

  function buildCompareMostHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildTenseText("내가 ")}
          ${buildCompareOrangeMarker("가장")}
          ${buildTenseText(" 빨라!")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildCompareOrangeMarker("MOST")}
          ${buildTenseChip("beautiful", "verb", "normal")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildTenseChip("fast", "verb", "normal")}
          ${buildCompareOrangeMarker("-est")}
        </div>
      </div>
    `;
  }

  function buildCompareYellowMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:1.36em;padding:0.04em 0.42em;border-radius:7px;background:#ffe36e;color:#111;font-size:13px;line-height:1;font-weight:950;border:1px solid #111;">${escapeHtml(text)}</span>`;
  }

  function buildCompareOrangeMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:1.36em;padding:0.04em 0.44em;border-radius:7px;background:#c98642;color:#111;font-size:13px;line-height:1;font-weight:950;border:1px solid #111;">${escapeHtml(text)}</span>`;
  }

  function buildCompareKoreanPostpositionMarker(text) {
    return `<span style="display:inline-flex;align-items:center;font-size:15px;line-height:1.35;font-weight:950;color:#d5a000;">${escapeHtml(text)}</span>`;
  }

  function buildComparePlainYellowText(text) {
    return `<span style="display:inline-flex;align-items:center;font-size:15px;line-height:1.35;font-weight:950;color:#d5a000;">${escapeHtml(text)}</span>`;
  }

  function buildComparePlainBlackText(text) {
    return `<span style="display:inline-flex;align-items:center;font-size:13px;line-height:1.35;font-weight:950;color:#111;">${escapeHtml(text)}</span>`;
  }

  function buildThereHereQuestionHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildThereKoMarker("여기")}
          ${buildTherePlain("있다!!")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildThereKoMarker("저기")}
          ${buildTherePlain("있다!!")}
        </div>
      </div>
    `;
  }

  function buildThereFrontHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:10px;margin-bottom:0;">
          ${buildThereMarker("Here!!")}
          ${buildThereMarker("There!!")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildTenseText("맨 앞에 세워서 시선 집중")}
        </div>
      </div>
    `;
  }

  function buildThereIsHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildThereMarker("Here")}
          ${buildTherePlain("is")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildThereMarker("There")}
          ${buildTherePlain("is")}
        </div>
      </div>
    `;
  }

  function buildThereCompleteHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildThereMarker("Here")}
          ${buildTherePlain("is")}
          ${buildTenseChip("a book", "verb", "normal")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildThereMarker("There")}
          ${buildTherePlain("is")}
          ${buildTenseChip("a cat", "verb", "normal")}
        </div>
      </div>
    `;
  }

  function buildThereMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:1.42em;padding:0.04em 0.48em;border-radius:8px;background:#e9f6ff;color:#164b73;font-size:15px;line-height:1;font-weight:950;border:1px solid #164b73;">${escapeHtml(text)}</span>`;
  }

  function buildThereKoMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:1.42em;padding:0.04em 0.48em;border-radius:8px;background:#e9f6ff;color:#164b73;font-size:15px;line-height:1;font-weight:950;border:1px solid #164b73;">${escapeHtml(text)}</span>`;
  }

  function buildTherePlain(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;font-size:15px;line-height:1.35;font-weight:950;color:#111;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPronounQuestionHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row aisth-pronoun-question-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildPronounParticleWordHtml("나", "는")}
          ${buildPronounParticleWordHtml("나", "를")}
          ${buildPronounParticleWordHtml("나", "의")}
        </div>
      </div>
    `;
  }

  function buildPronounSeparateHtml() {
    return `
      <div class="lip-example-stack">
        ${buildPronounRow("나는", "I")}
        ${buildPronounRow("나를", "me")}
        ${buildPronounRow("나의", "my")}
        ${buildPronounRow("나의 것", "mine")}
      </div>
    `;
  }

  function buildPronounMeaningShiftHtml() {
    const items = [
      { word: "I", before: [], after: ["jump"], suffix: "", ko: "나는 점프한다", koHtml: `${buildPronounParticleWordHtml("나", "는")} ${escapeHtml("점프한다")}`, fromX: "22px" },
      { word: "me", before: ["Tell"], after: [], suffix: ".", ko: "나에게 말해줘", koHtml: `${buildPronounParticleWordHtml("나", "에게")} ${escapeHtml("말해줘")}`, fromX: "-18px" },
      { word: "my", before: [], after: ["book"], suffix: "", ko: "나의 책", koHtml: `${buildPronounParticleWordHtml("나", "의")} ${escapeHtml("책")}`, fromX: "22px" },
      { word: "mine", before: ["This is"], after: [], suffix: ".", ko: "이것은 나의 것", koHtml: `${buildPronounParticleWordHtml("이것", "은")} ${buildPronounParticleWordHtml("나", "의")} ${escapeHtml("것")}`, fromX: "-24px" },
    ];
    return `
      <style>
        @keyframes aisth-pronoun-fly-in {
          0%, 8% {
            opacity: 0;
            transform: translate(var(--pronoun-from-x), -56px);
          }
          12%, 16% {
            opacity: 1;
            transform: translate(var(--pronoun-from-x), -56px);
          }
          26%, 32% {
            opacity: 1;
            transform: translate(0, 0);
          }
          38%, 100% {
            opacity: 0;
            transform: translate(0, -3px);
          }
        }
        @keyframes aisth-pronoun-source-label {
          0%, 18% { opacity: 1; }
          24%, 100% { opacity: 0; }
        }
        @keyframes aisth-pronoun-target-label {
          0%, 18% { opacity: 0; }
          24%, 100% { opacity: 1; }
        }
      </style>
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <div class="lip-rotator-window" style="flex:0 0 270px;width:270px;max-width:100%;height:112px;">
            ${items.map((item, index) => `
              <span class="lip-rotator-item" style="--lip-delay:${(index * 1.4).toFixed(1)}s;align-items:center;justify-content:center;">
                <span style="position:relative;display:block;width:270px;max-width:100%;height:112px;">
                  <span style="position:absolute;left:50%;top:2px;transform:translateX(-50%);opacity:0.22;">
                    ${buildPronounEnMarker("나")}
                  </span>
                  <span style="position:absolute;left:0;right:0;top:58px;display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;">
                    ${item.before.map((text) => buildPronounSentenceText(text)).join("")}
                    <span style="position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:28px;">
                      ${buildPronounFlyingMarker(item.word, item.fromX)}
                      ${item.suffix ? buildPronounSentencePunctuation(item.suffix) : ""}
                    </span>
                    ${item.after.map((text) => buildPronounSentenceText(text)).join("")}
                  </span>
                  <span class="aisth-pronoun-ko-line" style="position:absolute;left:0;right:0;top:92px;text-align:center;font-size:12px;line-height:1.25;font-weight:900;color:#5b4c42;">${item.koHtml || escapeHtml(item.ko)}</span>
                </span>
              </span>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function buildPronounMemorizeHtml() {
    const rows = [
      { baseHtml: buildPronounParticleWordHtml("나", "는"), forms: ["I", "you", "he", "she", "it", "we", "they"] },
      { baseHtml: buildPronounParticleWordHtml("나", "의"), forms: ["my", "your", "his", "her", "its", "our", "their"] },
      { baseHtml: buildPronounParticleWordHtml("나", "를"), forms: ["me", "you", "him", "her", "it", "us", "them"] },
      { baseHtml: buildPronounParticleWordHtml("나", "의것"), forms: ["mine", "yours", "his", "hers", "its", "ours", "theirs"] },
    ];
    return `
      <div class="aisth-pronoun-carousel">
        ${rows.map((row, index) => `
          <div class="aisth-pronoun-carousel-row">
            <span class="aisth-pronoun-carousel-base">${row.baseHtml}</span>
            <span class="aisth-pronoun-carousel-window">
              <span class="aisth-pronoun-carousel-track">
                ${row.forms.concat(row.forms).map((form) => `<span class="aisth-pronoun-carousel-chip">${escapeHtml(form)}</span>`).join("")}
              </span>
            </span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildPronounRow(ko, en) {
    return `
      <div class="lip-example-row aisth-pronoun-separate-row" style="justify-content:center;gap:8px;margin-bottom:0;">
        <span class="aisth-pronoun-separate-ko">${buildPronounParticlePhraseHtml(ko)}</span>
        ${buildTenseSymbol("→")}
        <span class="aisth-pronoun-separate-en">${buildPronounEnMarker(en)}</span>
      </div>
    `;
  }

  function buildPronounKoMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:1.36em;padding:0.04em 0.42em;border-radius:7px;background:#fff4bf;color:#111;font-size:13px;line-height:1;font-weight:950;border:1px solid #111;">${buildPronounParticlePhraseHtml(text)}</span>`;
  }

  function buildPronounEnMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:28px;padding:4px 10px;border-radius:999px;background:#fff;border:1px solid #f1c18e;color:#7e3106;font-size:14px;line-height:1;font-weight:950;">${escapeHtml(text)}</span>`;
  }

  function buildPronounMeaningMarker(en, ko) {
    return `
      <span style="display:inline-grid;grid-template-columns:1fr;justify-items:center;gap:2px;min-width:44px;">
        <span style="display:inline-flex;align-items:center;justify-content:center;min-width:38px;min-height:23px;padding:3px 7px;border-radius:999px;background:#fff;border:1px solid #f1c18e;color:#7e3106;font-size:12px;line-height:1;font-weight:950;">${escapeHtml(en)}</span>
        <span style="font-size:9.5px;line-height:1.12;font-weight:900;color:#5b4c42;white-space:nowrap;">${escapeHtml(ko)}</span>
      </span>
    `;
  }

  function buildPronounParticleWordHtml(stem, particle) {
    return `<span class="aisth-pronoun-particle-word"><span>${escapeHtml(stem)}</span><span class="aisth-pronoun-particle">${escapeHtml(particle)}</span></span>`;
  }

  function buildPronounParticlePhraseHtml(text) {
    const value = String(text || "");
    if (value === "나는") return buildPronounParticleWordHtml("나", "는");
    if (value === "나를") return buildPronounParticleWordHtml("나", "를");
    if (value === "나의") return buildPronounParticleWordHtml("나", "의");
    if (value === "나의 것") return buildPronounParticleWordHtml("나", "의것");
    return escapeHtml(value);
  }

  function buildPronounFlyingMarker(word, fromX) {
    return `
      <span style="--pronoun-from-x:${fromX};position:relative;z-index:2;display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:28px;padding:4px 10px;border-radius:999px;background:#fff;border:1px solid #f1c18e;color:#7e3106;font-size:14px;line-height:1;font-weight:950;animation:aisth-pronoun-fly-in 5.6s infinite;animation-delay:var(--lip-delay, 0s);will-change:transform,opacity;">
        <span style="animation:aisth-pronoun-source-label 5.6s infinite;animation-delay:var(--lip-delay, 0s);">${escapeHtml("나")}</span>
        <span style="position:absolute;inset:0;display:inline-flex;align-items:center;justify-content:center;animation:aisth-pronoun-target-label 5.6s infinite;animation-delay:var(--lip-delay, 0s);">${escapeHtml(word)}</span>
      </span>
    `;
  }

  function buildPronounSentenceText(text) {
    if (!text) return "";
    return `<span style="display:inline-flex;align-items:center;font-size:13px;line-height:1.35;font-weight:950;color:#111;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPronounSentencePunctuation(text) {
    return `<span style="display:inline-flex;align-items:center;margin-left:2px;font-size:13px;line-height:1.35;font-weight:950;color:#111;">${escapeHtml(text)}</span>`;
  }

  function buildPronounSlot() {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:42px;height:24px;border-bottom:2px dashed #d5a22a;"></span>`;
  }

  function buildPrepositionSpecificHtml() {
    const items = [
      ["책상", "옆에"],
      ["나무", "뒤에"],
      ["빵집", "근처에"],
    ];
    return `
      <div class="lip-example-stack" style="gap:10px;">
        ${items.map(([thing, place]) => `
          <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
            ${buildPrepositionKoLocationPhrase(thing, place)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildPrepositionOrderHtml() {
    const rows = [
      { thing: "책상", place: "옆에", prep: "beside", object: "the desk" },
      { thing: "나무", place: "뒤에", prep: "behind", object: "the tree" },
      { thing: "빵집", place: "근처에", prep: "near", object: "the bakery" },
    ];
    return `
      <div class="lip-example-stack" style="gap:0;">
        ${rows.map((row, index) => buildPrepositionExampleCard(row, index, false)).join("")}
      </div>
    `;
  }

  function buildPrepositionBackWordHtml() {
    const rows = [
      { thing: "책상", place: "옆에", prep: "beside", object: "the desk" },
      { thing: "나무", place: "뒤에", prep: "behind", object: "the tree" },
      { thing: "빵집", place: "근처에", prep: "near", object: "the bakery" },
    ];
    return `
      <div class="lip-example-stack" style="gap:0;">
        ${rows.map((row, index) => buildPrepositionExampleCard(row, index, true)).join("")}
      </div>
    `;
  }

  function buildPrepositionAwkwardHtml() {
    const rows = [
      { head: "", prep: "on", tail: "time", literal: "시간 위에" },
      { head: "interested", prep: "in", tail: "", literal: "~ 안에 흥미를 느끼다" },
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;gap:7px;min-width:0;">
        ${rows.map((row) => `
          <div style="display:grid;grid-template-columns:minmax(0,1fr) 14px minmax(0,1.05fr);gap:7px;align-items:center;min-width:0;padding:5px 0;">
            <div style="display:flex;justify-content:flex-end;min-width:0;">
              ${buildPrepositionPhraseParts(row.head, row.prep, row.tail)}
            </div>
            ${buildTenseSymbol(":")}
            ${buildPrepositionLiteralKo(row.literal)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildPrepositionPairsHtml() {
    const rows = [
      { head: "interested", prep: "in", meaning: "~에 흥미가 있는" },
      { head: "famous", prep: "for", meaning: "~로 유명한" },
      { head: "good", prep: "at", meaning: "~를 잘하는" },
      { head: "afraid", prep: "of", meaning: "~를 두려워하는" },
      { head: "different", prep: "from", meaning: "~와 다른" },
      { head: "similar", prep: "to", meaning: "~와 비슷한" },
    ];
    return `
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;min-width:0;">
        ${rows.map((row) => buildPrepositionPairCard(row.head, row.prep, row.meaning)).join("")}
      </div>
    `;
  }

  function buildPrepositionMemorizeHtml() {
    const rows = [
      ["interested", "in"],
      ["famous", "for"],
      ["good", "at"],
      ["afraid", "of"],
      ["different", "from"],
      ["similar", "to"],
    ];
    return `
      <div class="lip-example-stack" style="gap:7px;">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:12px;line-height:1;font-weight:950;color:#7e3106;white-space:nowrap;">짝꿍 표현</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;min-width:0;">
          ${rows.map(([head, prep]) => buildPrepositionMemoryChip(head, prep)).join("")}
        </div>
      </div>
    `;
  }

  function buildPrepositionPhraseParts(head, prep, tail) {
    const headHtml = head ? `<span>${escapeHtml(head)}</span>` : "";
    const tailHtml = tail ? `<span>${escapeHtml(tail)}</span>` : "";
    return `
      <span style="display:inline-flex;align-items:baseline;justify-content:center;gap:4px;max-width:100%;font-size:16px;line-height:1.1;font-weight:950;color:#3c2d22;white-space:nowrap;">
        ${headHtml}
        ${buildPrepositionPrepText(prep)}
        ${tailHtml}
      </span>
    `;
  }

  function buildPrepositionPrepText(text) {
    return `<span style="color:#1f7b3a;text-shadow:0 0 5px rgba(47,123,58,0.22);">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionLiteralKo(text) {
    return `<span style="display:block;min-width:0;font-size:13px;line-height:1.24;font-weight:900;color:#a12c2c;text-align:left;word-break:keep-all;text-shadow:0 0 4px rgba(220,63,63,0.13);">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionPairCard(head, prep, meaning) {
    return `
      <div style="display:grid;grid-template-columns:1fr;gap:2px;min-width:0;padding:6px 7px;border-radius:8px;background:rgba(255,255,255,0.78);border:1px solid rgba(47,123,58,0.18);box-shadow:0 4px 10px rgba(47,123,58,0.07);">
        <div style="display:flex;align-items:baseline;justify-content:center;gap:4px;min-width:0;font-size:13px;line-height:1.1;font-weight:950;color:#3c2d22;white-space:nowrap;">
          <span>${escapeHtml(head)}</span>
          ${buildPrepositionPrepText(prep)}
        </div>
        <div style="font-size:10.5px;line-height:1.15;font-weight:900;color:#5b4c42;text-align:center;word-break:keep-all;">${escapeHtml(meaning)}</div>
      </div>
    `;
  }

  function buildPrepositionMemoryChip(head, prep) {
    return `
      <div style="display:flex;align-items:center;justify-content:center;gap:4px;min-width:0;min-height:28px;padding:4px 6px;border-bottom:1px solid rgba(47,123,58,0.24);">
        <span style="font-size:13px;line-height:1;font-weight:950;color:#3c2d22;white-space:nowrap;">${escapeHtml(head)}</span>
        <span style="font-size:12px;line-height:1;font-weight:950;color:#7e3106;opacity:0.8;">+</span>
        <span style="font-size:15px;line-height:1;font-weight:950;color:#1f7b3a;text-shadow:0 0 6px rgba(47,123,58,0.24);white-space:nowrap;">${escapeHtml(prep)}</span>
      </div>
    `;
  }

  function buildPrepositionThing(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:25px;padding:3px 8px;border-radius:999px;background:#fff;border:1px solid #cfc5b8;color:#111;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionKoLocationPhrase(thing, place) {
    return `<span style="display:inline-flex;align-items:baseline;justify-content:center;gap:4px;font-size:19px;line-height:1;font-weight:950;white-space:nowrap;"><span style="color:#111;">${escapeHtml(thing)}</span>${buildPrepositionPrepTextLarge(place)}</span>`;
  }

  function buildPrepositionExampleCard(row, index, glow) {
    const borderStyle = index ? "border-top:1px solid rgba(47,123,58,0.16);padding-top:5px;margin-top:5px;" : "";
    return `
      <div style="display:grid;grid-template-columns:1fr;gap:2px;min-width:0;${borderStyle}">
        <div class="lip-example-row" style="justify-content:center;gap:4px;margin-bottom:0;">
          ${buildPrepositionNounPill(row.thing, glow)}
          ${buildPrepositionPrepText(row.place)}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildPrepositionMarker(row.prep)}
          ${buildPrepositionObject(row.object, glow)}
        </div>
      </div>
    `;
  }

  function buildPrepositionKoMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:25px;padding:3px 8px;border-radius:7px;background:#e8f6df;color:#1f5b2b;border:1px solid #2f7b3a;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;font-size:14px;line-height:1;font-weight:950;white-space:nowrap;">${buildPrepositionPrepText(text)}</span>`;
  }

  function buildPrepositionNounPill(text, glow) {
    const glowClass = glow ? " aisth-preposition-noun-glow" : "";
    return `<span class="aisth-preposition-noun-pill${glowClass}" style="display:inline-flex;align-items:center;justify-content:center;min-height:21px;padding:1px 8px;border-radius:999px;background:#fff;border:2px solid rgba(47,123,58,0.32);color:#111;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionObject(text, glow) {
    const glowClass = glow ? " aisth-preposition-noun-glow" : "";
    return `<span class="aisth-preposition-noun-pill${glowClass}" style="display:inline-flex;align-items:center;justify-content:center;min-height:21px;padding:1px 8px;border-radius:999px;background:#fff;border:2px solid rgba(47,123,58,0.32);color:#111;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionObjectStrong(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:29px;padding:4px 9px;border-radius:999px;background:#fff;border:2px solid rgba(47,123,58,0.32);color:#111;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionBackMeaning(base, prep, tail) {
    return `<span style="display:inline-flex;align-items:baseline;justify-content:center;gap:3px;color:#5b4c42;font-size:12px;line-height:1;font-weight:900;white-space:nowrap;"><span>${escapeHtml(base)}</span>${buildPrepositionPrepText(prep)}<span>${escapeHtml(tail)}</span></span>`;
  }

  function buildPrepositionPrepTextLarge(text) {
    return `<span style="color:#1f7b3a;text-shadow:0 0 6px rgba(47,123,58,0.24);font-size:24px;">${escapeHtml(text)}</span>`;
  }

  function buildIfQuestionHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildIfKoMarker("만약에..")}
          ${buildTenseText("비가 오면?")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildIfKoMarker("만약에..")}
          ${buildTenseText("네가 피곤하면?")}
        </div>
      </div>
    `;
  }

  function buildIfUseHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildIfMarker("if")}
          ${buildIfSentenceText("you are tired")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildIfKoMarker("네가 피곤하다면")}
        </div>
      </div>
    `;
  }

  function buildIfMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:29px;padding:4px 12px;border-radius:8px;background:#efe9ff;color:#44227d;border:1px solid #7657b5;font-size:15px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIfKoMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:28px;padding:4px 10px;border-radius:8px;background:#efe9ff;color:#44227d;border:1px solid #7657b5;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIfSentenceText(text) {
    return `<span style="display:inline-flex;align-items:center;font-size:14px;line-height:1.35;font-weight:950;color:#111;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularBreakHtml() {
    return `
      <style>
        @keyframes aisth-irregular-circle-draw {
          0%, 10% {
            opacity: 0;
            stroke-dashoffset: 1;
          }
          16% {
            opacity: 1;
            stroke-dashoffset: 1;
          }
          48%, 82% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: 0;
          }
        }
        @keyframes aisth-irregular-x-stroke-a {
          0%, 22% {
            opacity: 0;
            stroke-dashoffset: 1;
          }
          32% {
            opacity: 1;
            stroke-dashoffset: 1;
          }
          48%, 82% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: 0;
          }
        }
        @keyframes aisth-irregular-x-stroke-b {
          0%, 44% {
            opacity: 0;
            stroke-dashoffset: 1;
          }
          54% {
            opacity: 1;
            stroke-dashoffset: 1;
          }
          70%, 82% {
            opacity: 1;
            stroke-dashoffset: 0;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: 0;
          }
        }
      </style>
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildIrregularRegularCirclePair("play", "played")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildIrregularCrossPair("go", "goed")}
        </div>
      </div>
    `;
  }

  function buildIrregularDedicatedHtml() {
    const rows = [
      ["goed", "went", true],
      ["eated", "ate", true],
      ["seeed", "saw", true],
    ];
    return `
      <div class="lip-example-stack">
        ${rows.map(([base, past, fromWrong]) => buildIrregularPairRow(base, past, fromWrong)).join("")}
      </div>
    `;
  }

  function buildIrregularNameHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildIrregularNameMarker("불규칙 동사")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildIrregularGuideText("(기본 - 과거 - 과거분사(P.P)로 외워주면 좋아요!)")}
        </div>
        ${buildIrregularThreeColumnRow(["기본", "과거", "P.P"], "header")}
        ${buildIrregularThreeColumnRow(["go", "went", "gone"])}
      </div>
    `;
  }

  function buildIrregularMemorizeHtml() {
    const rows = [
      ["go", "went", "gone"],
      ["eat", "ate", "eaten"],
      ["see", "saw", "seen"],
      ["do", "did", "done"],
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;gap:4px;justify-items:center;">
        ${buildIrregularThreeColumnRow(["기본", "과거", "P.P"], "header")}
        ${rows.map((row) => buildIrregularThreeColumnRow(row)).join("")}
      </div>
    `;
  }

  function buildIrregularPairRow(base, past, fromWrong) {
    return `
      <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
        ${fromWrong ? buildIrregularWrongChip(base) : buildIrregularVerbChip(base)}
        ${buildTenseSymbol("→")}
        ${buildIrregularPastChip(past)}
      </div>
    `;
  }

  function buildIrregularRegularCirclePair(base, past) {
    return `
      <span style="position:relative;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:7px 10px;">
        <svg viewBox="0 0 168 46" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;">
          <ellipse cx="84" cy="23" rx="78" ry="18" pathLength="1" style="fill:none;stroke:#4fa85c;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:aisth-irregular-circle-draw 1.65s ease-in-out infinite;"></ellipse>
        </svg>
        ${buildIrregularRegularChip(base)}
        ${buildTenseSymbol("→")}
        ${buildIrregularRegularChip(past)}
      </span>
    `;
  }

  function buildIrregularCrossPair(base, wrong) {
    return `
      <span style="position:relative;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:7px 10px;">
        ${buildIrregularVerbChip(base)}
        ${buildTenseSymbol("→")}
        <span style="position:relative;display:inline-flex;align-items:center;justify-content:center;overflow:visible;">
          ${buildIrregularWrongChip(wrong, false)}
          <svg viewBox="0 0 58 34" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;left:50%;top:50%;width:58px;height:34px;margin-left:-29px;margin-top:-17px;overflow:visible;pointer-events:none;">
            <line x1="7" y1="5" x2="51" y2="29" pathLength="1" style="fill:none;stroke:#d02f2f;stroke-width:4;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:aisth-irregular-x-stroke-a 1.35s ease-in-out infinite;"></line>
            <line x1="51" y1="5" x2="7" y2="29" pathLength="1" style="fill:none;stroke:#d02f2f;stroke-width:4;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:aisth-irregular-x-stroke-b 1.35s ease-in-out infinite;"></line>
          </svg>
        </span>
      </span>
    `;
  }

  function buildIrregularThreeColumnRow(row, role) {
    return `
      <div style="display:grid;grid-template-columns:46px 54px 54px;column-gap:4px;align-items:center;justify-content:center;margin:0 auto;">
        ${row.map((word, index) => {
          if (role === "header") return buildIrregularTableHeaderChip(word);
          if (index === 0) return buildIrregularTableBaseChip(word);
          if (index === 1) return buildIrregularTablePastChip(word);
          return buildIrregularTablePpChip(word);
        }).join("")}
      </div>
    `;
  }

  function buildIrregularVerbChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:50px;min-height:27px;padding:4px 8px;border-radius:999px;background:#fff;border:1px solid #d2c8bd;color:#111;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularRegularChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:52px;min-height:27px;padding:4px 8px;border-radius:999px;background:#edf9ee;border:1px solid #4fa85c;color:#1f6b2b;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularSpecialChip(text) {
    return buildIrregularPastChip(text);
  }

  function buildIrregularPastChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:50px;min-height:27px;padding:4px 8px;border-radius:999px;background:linear-gradient(135deg,#ffdfe7 0%,#fff2b8 28%,#d9f5d2 53%,#d6ecff 76%,#eadbff 100%);border:1px solid #8f75b7;color:#2c2635;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularPpChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:50px;min-height:27px;padding:4px 8px;border-radius:999px;background:linear-gradient(135deg,#f8f8f8 0%,#ececec 28%,#dadada 53%,#eeeeee 76%,#d0d0d0 100%);border:1px solid #8a8a8a;color:#333;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularWrongChip(text, strikeEd = true) {
    const value = String(text ?? "");
    const hasEd = strikeEd && value.endsWith("ed") && value.length > 2;
    const labelHtml = hasEd
      ? `${escapeHtml(value.slice(0, -2))}<span style="text-decoration:line-through;text-decoration-thickness:2px;">ed</span>`
      : escapeHtml(value);
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:50px;min-height:27px;padding:4px 8px;border-radius:999px;background:#ffe9e9;border:1px solid #c43d3d;color:#8b1d1d;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${labelHtml}</span>`;
  }

  function buildIrregularHeaderChip(text) {
    return buildIrregularTableHeaderChip(text);
  }

  function buildIrregularTableHeaderChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:21px;padding:3px 2px;border-radius:7px;background:#f4efe8;border:1px solid #cbbca9;color:#4b3828;font-size:10.5px;line-height:1;font-weight:950;white-space:nowrap;box-sizing:border-box;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularTableBaseChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:24px;padding:3px 2px;border-radius:999px;background:#fff;border:1px solid #d2c8bd;color:#111;font-size:11.5px;line-height:1;font-weight:950;white-space:nowrap;box-sizing:border-box;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularTablePastChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:24px;padding:3px 2px;border-radius:999px;background:linear-gradient(135deg,#ffdfe7 0%,#fff2b8 28%,#d9f5d2 53%,#d6ecff 76%,#eadbff 100%);border:1px solid #8f75b7;color:#2c2635;font-size:11.5px;line-height:1;font-weight:950;white-space:nowrap;box-sizing:border-box;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularTablePpChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:24px;padding:3px 2px;border-radius:999px;background:linear-gradient(135deg,#f8f8f8 0%,#ececec 28%,#dadada 53%,#eeeeee 76%,#d0d0d0 100%);border:1px solid #8a8a8a;color:#333;font-size:11.5px;line-height:1;font-weight:950;white-space:nowrap;box-sizing:border-box;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularNameMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:30px;padding:5px 12px;border-radius:8px;background:#fff3dc;border:1px solid #b26d2c;color:#7b3a0d;font-size:15px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIrregularGuideText(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;max-width:100%;font-size:10.5px;line-height:1.25;font-weight:900;color:#4b3828;white-space:normal;text-align:center;">${escapeHtml(text)}</span>`;
  }

  function buildPerfectEmphasisHtml() {
    const items = [
      ["해버렸잖아!", "버렸잖"],
      ["해왔어.", "왔"],
      ["지금 막 끝났다구!", "지금 막"],
    ];
    return `
      <div class="lip-example-stack">
        ${items.map(([item, target]) => `
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildPerfectKoEmphasisLine(item, target)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildPerfectKoEmphasisLine(text, target) {
    const value = String(text || "");
    const needle = String(target || "");
    const index = needle ? value.indexOf(needle) : -1;
    if (index < 0) return `<span style="color:#111;font-size:15px;line-height:1;font-weight:900;white-space:nowrap;">${escapeHtml(value)}</span>`;
    return `<span style="display:inline-flex;align-items:center;justify-content:center;color:#111;font-size:15px;line-height:1;font-weight:900;white-space:nowrap;">${escapeHtml(value.slice(0, index))}${buildPerfectKoMarker(needle)}${escapeHtml(value.slice(index + needle.length))}</span>`;
  }

  function buildPerfectFormulaHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildPerfectHaveMarker("have")}
          ${buildTenseSymbol("+")}
          ${buildPerfectPpMarker("P.P")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildPerfectHaveMarker("have")}
          ${buildPerfectPpMarker("eaten")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildPerfectHaveMarker("has")}
          ${buildPerfectPpMarker("gone")}
        </div>
      </div>
    `;
  }

  function buildPerfectUseHtml() {
    const rows = [
      ["I", "have", "", "finished", "", "해버렸잖아!"],
      ["I", "have", "", "lived", "here", "해왔어."],
      ["I", "have", "just", "finished", "", "지금 막 끝났다구!"],
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;">
        ${rows.map(([subject, have, prePp, pp, tail, ko], index) => `
          <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;padding:6px 0;${index ? "border-top:1px solid rgba(21,83,72,0.16);" : ""}">
            <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
              ${buildPerfectPlainText(subject)}
              ${buildPerfectHaveMarker(have)}
              ${prePp ? buildPerfectPlainText(prePp) : ""}
              ${buildPerfectPpMarker(pp)}
              ${tail ? buildPerfectPlainText(tail) : ""}
            </div>
            <div style="font-size:10.5px;line-height:1.2;font-weight:900;color:#155348;text-align:center;white-space:nowrap;">${escapeHtml(ko)}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildPerfectKoMarker(text) {
    return `<span class="aisth-perfect-chrome-text" style="display:inline-flex;align-items:center;justify-content:center;min-height:28px;padding:2px 1px;background:linear-gradient(180deg,#050505 0%,#1c1c1c 26%,#f7f7f7 38%,#4b4b4b 48%,#080808 64%,#b9b9b9 77%,#111 100%);background-size:100% 140%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;-webkit-text-stroke:.25px rgba(0,0,0,.48);font-size:15px;line-height:1;font-weight:1000;letter-spacing:-.02em;white-space:nowrap;filter:drop-shadow(0 1px 0 rgba(0,0,0,.34));">${escapeHtml(text)}</span>`;
  }

  function buildPerfectKoSmallMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:23px;padding:3px 7px;border-radius:7px;background:#eaf7f3;color:#155348;border:1px solid #2c7d70;font-size:10px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPerfectHaveMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;color:#f17b2a;font-size:15px;line-height:1.2;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPerfectPpMarker(text) {
    return buildIrregularPpChip(text);
  }

  function buildPerfectSentenceChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:23px;padding:3px 7px;border-radius:999px;background:#fff;border:1px solid #d2c8bd;color:#111;font-size:10px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPerfectPlainText(text) {
    return `<span style="display:inline-flex;align-items:center;font-size:12px;line-height:1.3;font-weight:950;color:#111;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildConjunctionWordsHtml() {
    const rows = [
      ["그리고", "디저트도 먹었어"],
      ["그러나", "운동은 하지 않았어"],
    ];
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildTenseText("나 점심 먹었어")}
        </div>
        ${rows.map(([connector, sentence]) => `
          <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
            ${buildConjunctionKoChip(connector)}
            ${buildTenseText(sentence)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildConjunctionInsertHtml() {
    const rows = [
      ["I am tired.", "but", "I will study."],
      ["I ate.", "and", "I slept."],
      ["It rained.", "so", "I stayed home."],
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;">
        ${rows.map(([left, mid, right], index) => `
          <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;padding:6px 0;${index ? "border-top:1px solid rgba(231,193,135,0.7);" : ""}">
            <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
              ${buildConjunctionSentence(left)}
              ${buildConjunctionEnChip(mid)}
              ${buildConjunctionSentence(right)}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildConjunctionTranslateHtml() {
    const rows = [
      ["and", "I ate dessert too."],
      ["but", "I did not exercise."],
    ];
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildTenseText("I ate lunch.")}
        </div>
        ${rows.map(([connector, sentence]) => `
          <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
            ${buildConjunctionEnChip(connector)}
            ${buildTenseText(sentence)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildConjunctionListHtml() {
    const rows = [
      ["and", "그리고"],
      ["but", "그러나"],
      ["or", "또는"],
      ["so", "그래서"],
      ["because", "왜냐하면"],
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;">
        ${rows.map(([word, meaning], index) => `
          <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;padding:6px 0;${index ? "border-top:1px solid rgba(231,193,135,0.7);" : ""}">
            <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
              ${buildConjunctionEnChip(word)}
              ${buildTenseSymbol("→")}
              ${buildConjunctionKoChip(meaning)}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildConjunctionKoChip(text) {
    return `<span class="aisth-conjunction-chip is-ko" style="display:inline-flex;align-items:center;justify-content:center;min-width:58px;min-height:26px;padding:4px 9px;border-radius:8px;background:#ffe8b8;color:#7e3106;border:1px solid #e7c187;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildConjunctionEnChip(text) {
    return `<span class="aisth-conjunction-chip is-en" style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:26px;padding:4px 9px;border-radius:999px;background:#ffe8b8;color:#7e3106;border:1px solid #e7c187;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildConjunctionSentence(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:24px;padding:3px 7px;border-radius:999px;background:#fff;border:1px solid #d4cbc1;color:#111;font-size:10.5px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildConjunctionPlainWord(text) {
    return `<span style="font-size:15px;line-height:1.35;font-weight:950;color:#f17b2a;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildConjunctionPlainMeaning(text) {
    return `<span style="font-size:15px;line-height:1.35;font-weight:900;color:#3c2d22;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildAdvancedModalQuestionHtml() {
    const rows = [
      [
        { text: "하고싶어질 수", role: "orange" },
        { text: "도 있다", role: "plain" },
      ],
      [
        { text: "아닐 수도 있을", role: "orange" },
        { text: " 것이다", role: "plain" },
      ],
    ];
    return `
      <div class="lip-example-stack">
        ${rows.map((parts) => `
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildAdvancedKoPhraseParts(parts)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildAdvancedModalWrongHtml() {
    const rows = [
      ["can", "will", "work"],
      ["may", "should", "go"],
    ];
    return `
      <div class="lip-example-stack">
        ${rows.map(([first, second, verb]) => `
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildAdvancedModalWord(first)}
            ${buildAdvancedModalWord(second)}
            ${buildAdvancedVerbChip(verb)}
            ${buildAdvancedXMark()}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildAdvancedModalTrickHtml() {
    const rows = [
      ["will", "be able to", "work", "할 수 있을 것이다"],
      ["may", "have to", "leave", "해야 할 수도 있다"],
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;">
        ${rows.map(([modal, phrase, verb, ko], index) => `
          <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;padding:6px 0;${index ? "border-top:1px solid rgba(126,49,6,0.14);" : ""}">
            <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
              ${buildAdvancedModalWord(modal)}
              ${buildAdvancedPhraseChip(phrase)}
              ${buildAdvancedVerbChip(verb)}
            </div>
            ${buildAdvancedMeaningLine(ko)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildAdvancedModalRememberHtml() {
    const rows = [
      ["be able to", "할 수 있다"],
      ["be going to", "할 것이다"],
      ["have to", "해야 한다"],
      ["want to", "하고 싶다"],
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;">
        ${rows.map(([word, meaning], index) => `
          <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;padding:5px 0;${index ? "border-top:1px solid rgba(126,49,6,0.14);" : ""}">
            <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
              ${buildAdvancedPhraseChip(word)}
            </div>
            ${buildAdvancedMeaningLine(meaning)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildAdvancedKoPhrase(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;max-width:100%;font-size:18px;line-height:1.25;font-weight:950;color:#7e3106;white-space:normal;word-break:keep-all;text-align:center;">${escapeHtml(text)}</span>`;
  }

  function buildAdvancedKoPhraseParts(parts) {
    return `
      <span style="display:inline-flex;align-items:center;justify-content:center;max-width:100%;font-size:18px;line-height:1.25;font-weight:950;color:#7e3106;white-space:normal;word-break:keep-all;text-align:center;">
        ${(parts || []).map((part) => part.role === "orange"
          ? `<span style="${advancedSimpleOrangeTextStyle()}">${escapeHtml(part.text)}</span>`
          : `<span>${escapeHtml(part.text)}</span>`).join("")}
      </span>
    `;
  }

  function buildAdvancedPhraseChip(text) {
    return `<span style="${advancedGradientTextStyle()}font-size:18px;line-height:1.1;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildAdvancedModalWord(text) {
    return `<span style="${advancedSimpleOrangeTextStyle()}font-size:18px;line-height:1.1;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildAdvancedVerbChip(text) {
    return `<span style="font-size:18px;line-height:1.1;font-weight:950;color:#3c2d22;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function advancedGradientTextStyle() {
    return "display:inline-block;font-weight:950;background:linear-gradient(90deg,#7e3106 0%,#f17b2a 52%,#7e3106 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 3px rgba(241,123,42,0.45));";
  }

  function advancedSimpleOrangeTextStyle() {
    return "display:inline-block;font-weight:950;color:#f17b2a;";
  }

  function buildAdvancedMeaningLine(text) {
    return `<div style="font-size:15px;line-height:1.25;font-weight:900;color:#f17b2a;text-align:center;white-space:normal;word-break:keep-all;">${escapeHtml(text)}</div>`;
  }

  function buildAdvancedXMark() {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;color:#c52525;font-size:22px;line-height:1;font-weight:950;">X</span>`;
  }

  function buildIngEdCompareHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:10px;margin-bottom:0;">
          ${buildIngMarker("ing")}
          ${buildEdMarker("ed")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildIngWord("running")}
          ${buildEdWord("broken")}
        </div>
      </div>
    `;
  }

  function buildIngActiveHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildIngMarker("ing")}
          ${buildTenseSymbol("=")}
          ${buildIngKoMarker("가함")}
        </div>
        ${buildIngEdDivider("ing")}
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildIngEdPlainText("I am")}
          ${buildIngWord("kicking")}
          ${buildIngEdPlainText("now")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildIngMeaningLine("내가 너를 차버린다!!")}
        </div>
      </div>
    `;
  }

  function buildEdPassiveHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildEdMarker("ed")}
          ${buildTenseSymbol("=")}
          ${buildEdKoMarker("당함 / 끝남")}
        </div>
        ${buildIngEdDivider("ed")}
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildIngEdPlainText("the")}
          ${buildEdWord("kicked")}
          ${buildIngEdPlainText("ball")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildEdMeaningLine("내가 너에게 차였다!!")}
        </div>
      </div>
    `;
  }

  function buildIngEdDirectionHtml() {
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:center;min-width:0;">
        <div style="display:grid;grid-template-columns:1fr;gap:7px;justify-items:center;min-width:0;">
          <div style="display:grid;grid-template-columns:1fr;gap:2px;justify-items:center;min-width:0;">
            ${buildCuteArrowFan("ing")}
            ${buildIngWord("heating")}
          </div>
          ${buildIngMeaningLine("가하는 상태")}
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:7px;justify-items:center;min-width:0;">
          <div style="display:grid;grid-template-columns:1fr;gap:2px;justify-items:center;min-width:0;">
            ${buildCuteArrowFan("ed")}
            ${buildEdWord("frozen")}
          </div>
          ${buildEdMeaningLine("당하는 상태")}
        </div>
      </div>
    `;
  }

  function buildIngApplicationStartHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:12px;line-height:1;font-weight:900;color:#7e3106;white-space:nowrap;">6-1 마지막 단계</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:2px;justify-items:center;min-width:0;">
          ${buildCuteArrowFan("ing")}
          ${buildIngWord("heating")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildIngMeaningLine("가하는 상태")}
        </div>
      </div>
    `;
  }

  function buildPassiveApplicationStartHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:12px;line-height:1;font-weight:900;color:#7e3106;white-space:nowrap;">6-1 마지막 단계</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:2px;justify-items:center;min-width:0;">
          ${buildCuteArrowFan("ed")}
          ${buildEdWord("closed")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildEdMeaningLine("당하는 상태")}
        </div>
      </div>
    `;
  }

  function buildPassiveBeFormHtml() {
    return `
      <div class="lip-example-stack" style="gap:10px;">
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;flex-wrap:wrap;">
          ${buildIngEdPlainText("The door")}
          <span style="font-size:20px;line-height:1;font-weight:950;color:#7e3106;">+</span>
          <span style="display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border-radius:9px;background:#fff7e8;border:2px solid #f17b2a;color:#c25a00;font-size:17px;line-height:1;font-weight:950;box-shadow:0 0 8px rgba(241,123,42,.2);">is</span>
          <span style="font-size:20px;line-height:1;font-weight:950;color:#7e3106;">+</span>
          ${buildEdWord("closed")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:14px;line-height:1.35;font-weight:950;color:#3c2d22;text-align:center;">문은 <span style="color:#075fc9;text-shadow:0 0 5px rgba(0,103,255,.2);">닫힘을 당한 상태</span>이다.</span>
        </div>
      </div>
    `;
  }

  function buildPassiveByAgentHtml() {
    return `
      <div class="lip-example-stack" style="gap:8px;">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:14px;line-height:1.35;font-weight:900;color:#67584d;text-align:center;">Mina closed the door.</span>
        </div>
        <div style="font-size:22px;line-height:1;font-weight:950;color:#f17b2a;text-align:center;">↓</div>
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;flex-wrap:wrap;">
          ${buildIngEdPlainText("The door was")}
          ${buildEdWord("closed")}
          <span style="display:inline-flex;align-items:center;padding:5px 8px;border-radius:8px;background:rgba(47,157,87,.1);border:1px solid rgba(47,157,87,.28);color:#237b44;font-size:15px;line-height:1;font-weight:950;box-shadow:0 0 7px rgba(47,157,87,.14);">by Mina</span>
        </div>
      </div>
    `;
  }

  function buildEdBeforeNounHtml() {
    return `
      <div class="lip-example-stack" style="gap:9px;">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:14px;line-height:1.35;font-weight:950;color:#3c2d22;">닫혀진 문</span>
        </div>
        <div style="font-size:21px;line-height:1;font-weight:950;color:#f17b2a;text-align:center;">↓</div>
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildEdWord("closed")}
          ${buildIngEdPlainText("door")}
        </div>
      </div>
    `;
  }

  function buildEdAfterBeHtml() {
    return `
      <div class="lip-example-stack" style="gap:9px;">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:14px;line-height:1.35;font-weight:950;color:#3c2d22;">문은 닫혀 있다.</span>
        </div>
        <div style="font-size:21px;line-height:1;font-weight:950;color:#f17b2a;text-align:center;">↓</div>
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildIngEdPlainText("The door is")}
          ${buildEdWord("closed")}
          ${buildIngEdPlainText(".")}
        </div>
      </div>
    `;
  }

  function buildEdPositionCompareHtml() {
    return `
      <div style="display:grid;grid-template-columns:1fr;gap:11px;min-width:0;">
        <div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center;padding:9px;border-radius:12px;background:#fff;border:1px solid rgba(7,95,201,.16);">
          <span style="font-size:11px;line-height:1;font-weight:950;color:#075fc9;white-space:nowrap;">명사 앞</span>
          <span style="display:flex;align-items:center;justify-content:center;gap:5px;min-width:0;">${buildEdWord("closed")}${buildIngEdPlainText("door")}</span>
        </div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center;padding:9px;border-radius:12px;background:#fff;border:1px solid rgba(7,95,201,.16);">
          <span style="font-size:11px;line-height:1;font-weight:950;color:#075fc9;white-space:nowrap;">be 뒤</span>
          <span style="display:flex;align-items:center;justify-content:center;gap:5px;min-width:0;">${buildIngEdPlainText("The door is")}${buildEdWord("closed")}</span>
        </div>
      </div>
    `;
  }

  function buildIngStateApplyHtml() {
    const rows = [
      { lead: "나는 ", core: "수영하는 상태", tail: "이다" },
      { lead: "", core: "수영하는 상태", tail: "는 즐겁다" },
      { lead: "", core: "수영하는 상태", tail: "의 물개" },
    ];
    return `
      ${buildIngApplyStylesHtml()}
      <div class="aisth-ing-app-grid">
        ${rows.map((row, index) => buildIngTransformRow(row, index)).join("")}
      </div>
    `;
  }

  function buildIngKoreanPolishHtml() {
    const rows = [
      {
        from: "나는 수영하는 상태이다",
        variants: [
          "나는 수영하는 중이다",
          "= 나는 수영하고 있다",
        ],
      },
      {
        from: "수영하는 상태는 즐겁다",
        to: "수영하는 것은 즐겁다",
      },
      {
        from: "수영하는 상태의 물개",
        to: "수영하는 물개",
      },
    ];
    return `
      ${buildIngApplyStylesHtml()}
      <div class="aisth-ing-app-grid">
        ${rows.map((row, index) => buildIngPolishRow(row, index)).join("")}
      </div>
    `;
  }

  function buildIngEdAdvancedWarningHtml() {
    return `
      <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;min-width:0;">
        <div style="display:grid;grid-template-columns:1fr;gap:5px;justify-items:center;">
          ${buildIngWord("ing")}
          <span style="font-size:13px;line-height:1;font-weight:950;color:#c7001f;text-shadow:0 0 5px rgba(255,20,58,0.22);white-space:nowrap;">ing 심화</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:3px;justify-items:center;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;background:#fff7e8;border:2px solid #f17b2a;color:#c25a00;font-size:21px;line-height:1;font-weight:950;box-shadow:0 0 9px rgba(241,123,42,0.24);">!</span>
          <span style="font-size:11px;line-height:1;font-weight:950;color:#7e3106;white-space:nowrap;">주의</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:5px;justify-items:center;">
          ${buildEdWord("ed")}
          <span style="font-size:13px;line-height:1;font-weight:950;color:#075fc9;text-shadow:0 0 5px rgba(0,103,255,0.22);white-space:nowrap;">ed 심화</span>
        </div>
      </div>
    `;
  }

  function buildObjectsAliveHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:15px;line-height:1.3;font-weight:950;color:#3c2d22;white-space:nowrap;">물건들이 살아났어요</span>
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:12px;margin-bottom:0;">
          ${buildObjectAliveChip("movie", "ing")}
          ${buildObjectAliveChip("hiking", "ed")}
        </div>
      </div>
    `;
  }

  function buildIngEdObjectQuestionHtml() {
    return `
      <div style="display:grid;grid-template-columns:1fr;gap:8px;min-width:0;">
        <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;padding-bottom:7px;border-bottom:1px solid rgba(199,0,31,0.18);">
          <div class="lip-example-row" style="justify-content:center;gap:4px;margin-bottom:0;">
            ${buildIngStatePlain("영화가 나를")}
            ${buildIngStateCore("지루하게")}
            ${buildIngStatePlain("해요.")}
          </div>
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildTenseSymbol("→")}
            ${buildIngMeaningLine("이 지루한 영화")}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;">
          <div class="lip-example-row" style="justify-content:center;gap:4px;margin-bottom:0;">
            ${buildIngStatePlain("나는 등산에게")}
            ${buildEdStateCore("피곤함을 당했어요.")}
          </div>
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildTenseSymbol("→")}
            ${buildEdMeaningLine("나 지금 피곤해.")}
          </div>
        </div>
      </div>
    `;
  }

  function buildIngEdThinkSlowHtml() {
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:start;min-width:0;">
        <div style="display:grid;grid-template-columns:1fr;gap:5px;justify-items:center;min-width:0;">
          ${buildIngWord("ing")}
          <span style="font-size:14px;line-height:1.25;font-weight:950;color:#c7001f;text-shadow:0 0 5px rgba(255,20,58,0.22);white-space:nowrap;">가했나요?</span>
          <span style="font-size:12px;line-height:1.2;font-weight:900;color:#3c2d22;text-align:center;word-break:keep-all;">감정을 일으키는 쪽</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:5px;justify-items:center;min-width:0;">
          ${buildEdWord("ed")}
          <span style="font-size:14px;line-height:1.25;font-weight:950;color:#075fc9;text-shadow:0 0 5px rgba(0,103,255,0.22);white-space:nowrap;">당했나요?</span>
          <span style="font-size:12px;line-height:1.2;font-weight:900;color:#3c2d22;text-align:center;word-break:keep-all;">감정을 느끼는 쪽</span>
        </div>
      </div>
    `;
  }

  function buildIngApplyStylesHtml() {
    return `
      <style>
        .aisth-ing-app-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 7px;
          min-width: 0;
        }
        .aisth-ing-app-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          align-items: center;
          min-width: 0;
        }
        .aisth-ing-sentence {
          position: relative;
          min-height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          min-width: 0;
          overflow: hidden;
        }
        .aisth-state-replace {
          position: relative;
          display: inline-grid;
          place-items: center;
          min-width: 104px;
          min-height: 24px;
          isolation: isolate;
        }
        .aisth-state-old,
        .aisth-state-new {
          grid-area: 1 / 1;
          white-space: nowrap;
        }
        .aisth-state-old {
          animation: aisth-state-old-out 3.1s ease-in-out infinite;
        }
        .aisth-state-new {
          opacity: 0;
          animation: aisth-state-new-in 3.1s ease-in-out infinite;
        }
        .aisth-state-cutter {
          position: absolute;
          left: 0;
          top: 2px;
          width: 12px;
          height: 20px;
          border-radius: 5px;
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(199,0,31,0.2));
          box-shadow: 0 0 6px rgba(255,20,58,0.28);
          opacity: 0;
          z-index: 2;
          animation: aisth-state-cutter-sweep 3.1s ease-in-out infinite;
        }
        .aisth-polish-slot {
          position: relative;
          min-height: 26px;
          display: grid;
          align-items: center;
          justify-items: center;
          min-width: 0;
          overflow: hidden;
          width: min(100%, 260px);
          margin: 0 auto;
        }
        .aisth-polish-old,
        .aisth-polish-new {
          grid-area: 1 / 1;
          display: block;
          min-width: 0;
          width: 100%;
          max-width: 100%;
        }
        .aisth-polish-old {
          animation: aisth-polish-old-erase 6.4s ease-in-out infinite;
        }
        .aisth-polish-new {
          opacity: 0;
          animation: aisth-polish-new-write 6.4s ease-in-out infinite;
        }
        .aisth-polish-eraser {
          position: absolute;
          left: 0;
          top: 0;
          width: 14px;
          height: 100%;
          border-radius: 5px;
          background: repeating-linear-gradient(-45deg, rgba(255,255,255,0.95) 0 4px, rgba(199,0,31,0.16) 4px 8px);
          box-shadow: 0 0 6px rgba(199,0,31,0.26);
          opacity: 0;
          animation: aisth-polish-eraser-sweep 6.4s ease-in-out infinite;
          z-index: 3;
        }
        .aisth-polish-variant {
          grid-area: 1 / 1;
          opacity: 0;
          transform: rotateX(90deg);
        }
        .aisth-polish-variant.is-first {
          animation: aisth-polish-variant-first 6.4s ease-in-out infinite;
        }
        .aisth-polish-variant.is-second {
          animation: aisth-polish-variant-second 6.4s ease-in-out infinite;
        }
        .aisth-polish-focus {
          display: inline-block;
          padding: 1px 5px;
          border-radius: 7px;
          background: rgba(255,20,58,.1);
          color: #c7001f;
          box-shadow: 0 0 8px rgba(255,20,58,.18);
          text-shadow: 0 0 5px rgba(255,20,58,.18);
        }
        @keyframes aisth-state-old-out {
          0%, 34% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          48%, 100% { opacity: 0; transform: translateY(1px) scale(0.98); filter: blur(1px); }
        }
        @keyframes aisth-state-new-in {
          0%, 45% { opacity: 0; transform: translateY(-1px) scale(0.98); }
          58%, 100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aisth-state-cutter-sweep {
          0%, 24% { opacity: 0; transform: translateX(-8px) rotate(-6deg); }
          34% { opacity: 1; transform: translateX(0) rotate(-6deg); }
          50% { opacity: 1; transform: translateX(98px) rotate(6deg); }
          60%, 100% { opacity: 0; transform: translateX(108px) rotate(6deg); }
        }
        @keyframes aisth-polish-old-erase {
          0%, 22% { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); }
          40% { opacity: 1; clip-path: inset(0 0 0 100%); filter: blur(0.6px); }
          42%, 100% { opacity: 0; clip-path: inset(0 0 0 100%); }
        }
        @keyframes aisth-polish-new-write {
          0%, 41% { opacity: 0; clip-path: inset(0 100% 0 0); }
          46% { opacity: 1; clip-path: inset(0 100% 0 0); }
          58%, 89% { opacity: 1; clip-path: inset(0 0 0 0); }
          92%, 100% { opacity: 0; clip-path: inset(0 0 0 0); }
        }
        @keyframes aisth-polish-eraser-sweep {
          0%, 22% { opacity: 0; left: 0; transform: translateX(-14px) rotate(-7deg); }
          27% { opacity: 1; left: 0; transform: translateX(0) rotate(-7deg); }
          34% { opacity: 1; left: calc(55% - 7px); transform: rotate(7deg); }
          40% { opacity: 1; left: calc(100% - 14px); transform: rotate(7deg); }
          44%, 100% { opacity: 0; left: calc(100% - 14px); transform: rotate(7deg); }
        }
        @keyframes aisth-polish-variant-first {
          0%, 45% { opacity: 0; transform: rotateX(90deg); }
          50%, 67% { opacity: 1; transform: rotateX(0deg); }
          71%, 100% { opacity: 0; transform: rotateX(-90deg); }
        }
        @keyframes aisth-polish-variant-second {
          0%, 68% { opacity: 0; transform: rotateX(90deg); }
          73%, 88% { opacity: 1; transform: rotateX(0deg); }
          92%, 100% { opacity: 0; transform: rotateX(-90deg); }
        }
      </style>
    `;
  }

  function buildIngTransformRow(row, index) {
    return `
      <div class="aisth-ing-app-row">
        <div class="aisth-ing-sentence">
          ${row.lead ? buildIngStatePlain(row.lead) : ""}
          <span class="aisth-state-replace">
            <span class="aisth-state-old">${buildIngStateCore(row.core)}</span>
            <span class="aisth-state-new">${buildIngWord("swimming")}</span>
            <span class="aisth-state-cutter"></span>
          </span>
          ${buildIngStatePlain(row.tail)}
        </div>
      </div>
    `;
  }

  function buildIngPolishRow(row, index) {
    return `
      <div class="aisth-ing-app-row">
        <div class="aisth-polish-slot">
          <span class="aisth-polish-old">${buildIngPolishedOriginalLine(row.from)}</span>
          <span class="aisth-polish-new">${row.variants ? buildIngPolishRotator(row.variants) : buildIngPolishedLine(row.to, false)}</span>
          <span class="aisth-polish-eraser"></span>
        </div>
      </div>
    `;
  }

  function buildIngStatePlain(text) {
    return `<span style="font-size:15px;line-height:1.3;font-weight:900;color:#3c2d22;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIngStateCore(text) {
    return `<span style="font-size:15px;line-height:1.3;font-weight:950;color:#c7001f;text-shadow:0 0 5px rgba(255,20,58,0.24);white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildEdStateCore(text) {
    return `<span style="font-size:15px;line-height:1.3;font-weight:950;color:#075fc9;text-shadow:0 0 5px rgba(0,103,255,0.24);white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildObjectAliveChip(text, kind) {
    const isEd = kind === "ed";
    const color = isEd ? "#075fc9" : "#c7001f";
    const glow = isEd ? "rgba(0,103,255,0.2)" : "rgba(255,20,58,0.2)";
    return `
      <span style="display:inline-flex;align-items:center;justify-content:center;min-width:76px;min-height:32px;padding:5px 10px;border-radius:10px;background:rgba(255,255,255,0.72);border:1px solid ${isEd ? "rgba(7,95,201,0.22)" : "rgba(199,0,31,0.2)"};color:${color};font-size:15px;line-height:1;font-weight:950;box-shadow:0 0 8px ${glow};white-space:nowrap;">
        ${escapeHtml(text)}
      </span>
    `;
  }

  function buildIngPolishedLine(text, muted) {
    const color = muted ? "rgba(60,45,34,0.62)" : "#3c2d22";
    return `<span style="display:block;min-width:0;font-size:14.5px;line-height:1.35;font-weight:950;color:${color};word-break:keep-all;text-align:center;">${escapeHtml(text)}</span>`;
  }

  function buildIngPolishedOriginalLine(text) {
    const target = "수영하는 상태";
    const source = String(text ?? "");
    const idx = source.indexOf(target);
    if (idx < 0) return buildIngPolishedLine(source, true);
    const before = source.slice(0, idx);
    const after = source.slice(idx + target.length);
    return `
      <span style="display:block;min-width:0;font-size:14.5px;line-height:1.35;font-weight:950;word-break:keep-all;text-align:center;white-space:nowrap;">
        <span style="color:rgba(60,45,34,0.62);">${escapeHtml(before)}</span>${buildIngStateCore(target)}<span style="color:rgba(60,45,34,0.62);">${escapeHtml(after)}</span>
      </span>
    `;
  }

  function buildIngPolishRotator(variants) {
    const items = Array.isArray(variants) ? variants : [];
    return `
      <span style="display:grid;grid-template-columns:1fr;align-items:center;justify-items:center;min-width:0;perspective:200px;">
        ${items.map((text, index) => `<span class="aisth-polish-variant ${index === 0 ? "is-first" : "is-second"}">${buildIngPolishedVariantLine(text, index)}</span>`).join("")}
      </span>
    `;
  }

  function buildIngPolishedVariantLine(text, index) {
    const source = String(text ?? "");
    const target = index === 0 ? "수영하는 중" : "";
    const at = target ? source.indexOf(target) : -1;
    if (at < 0) return buildIngPolishedLine(source, false);
    return `<span style="display:block;min-width:0;font-size:14.5px;line-height:1.35;font-weight:950;color:#3c2d22;word-break:keep-all;text-align:center;">${escapeHtml(source.slice(0, at))}<span class="aisth-polish-focus">${escapeHtml(target)}</span>${escapeHtml(source.slice(at + target.length))}</span>`;
  }

  function buildIngMarker(text) {
    return `<span style="${ingLegoStyle("hero")}">${escapeHtml(text)}</span>`;
  }

  function buildEdMarker(text) {
    return `<span style="${edLegoStyle("hero")}">${escapeHtml(text)}</span>`;
  }

  function buildIngWord(text) {
    return `<span style="${ingLegoStyle("word")}">${escapeHtml(text)}</span>`;
  }

  function buildEdWord(text) {
    return `<span style="${edLegoStyle("word")}">${escapeHtml(text)}</span>`;
  }

  function buildIngKoMarker(text) {
    return `<span style="${ingLegoStyle("ko")}">${escapeHtml(text)}</span>`;
  }

  function buildEdKoMarker(text) {
    return `<span style="${edLegoStyle("ko")}">${escapeHtml(text)}</span>`;
  }

  function buildIngMeaningLine(text) {
    return `<span style="font-size:15px;line-height:1.35;font-weight:950;color:#c7001f;text-shadow:0 0 5px rgba(255,20,58,0.28);white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildEdMeaningLine(text) {
    return `<span style="font-size:15px;line-height:1.35;font-weight:950;color:#075fc9;text-shadow:0 0 5px rgba(0,103,255,0.28);white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIngEdPlainText(text) {
    return `<span style="display:inline-flex;align-items:center;font-size:17px;line-height:1.25;font-weight:950;color:#3c2d22;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIngEdDivider(kind) {
    const color = kind === "ed" ? "rgba(7,95,201,0.34)" : "rgba(199,0,31,0.32)";
    return `<div style="height:1px;width:78%;max-width:210px;margin:1px auto 2px;background:linear-gradient(90deg,transparent 0%,${color} 50%,transparent 100%);"></div>`;
  }

  function buildCuteArrowFan(kind) {
    const isEd = kind === "ed";
    const color = isEd ? "#075fc9" : "#c7001f";
    const glow = isEd ? "rgba(0,103,255,0.34)" : "rgba(255,20,58,0.32)";
    const clipId = `aisth-${kind}-arrow-clip`;
    const clipRect = isEd
      ? `
        <rect x="0" y="0" width="104" height="0">
          <animate attributeName="height" values="0;28;28;28" keyTimes="0;0.58;0.78;1" dur="1.45s" repeatCount="indefinite"></animate>
        </rect>
      `
      : `
        <rect x="0" y="28" width="104" height="0">
          <animate attributeName="y" values="28;0;0;0" keyTimes="0;0.58;0.78;1" dur="1.45s" repeatCount="indefinite"></animate>
          <animate attributeName="height" values="0;28;28;28" keyTimes="0;0.58;0.78;1" dur="1.45s" repeatCount="indefinite"></animate>
        </rect>
      `;
    const paths = isEd
      ? [
          "M22 4 Q32 8 40 22",
          "M52 2 Q52 11 52 24",
          "M82 4 Q72 8 64 22",
        ]
      : [
          "M40 24 Q32 9 22 4",
          "M52 24 Q52 11 52 2",
          "M64 24 Q72 9 82 4",
        ];
    return `
      <span style="display:block;width:104px;height:28px;margin-bottom:-2px;filter:drop-shadow(0 0 4px ${glow});">
        <svg viewBox="0 0 104 28" width="104" height="28" aria-hidden="true" focusable="false" style="display:block;overflow:visible;">
          <defs>
            <marker id="aisth-${kind}-arrowhead" markerWidth="5" markerHeight="5" refX="4.2" refY="2.5" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="${color}" opacity="0.88"></path>
            </marker>
            <clipPath id="${clipId}">
              ${clipRect}
            </clipPath>
          </defs>
          <g clip-path="url(#${clipId})">
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.78;1" dur="1.45s" repeatCount="indefinite"></animate>
            ${paths.map((d) => `
              <path d="${d}" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2.4 3.2" marker-end="url(#aisth-${kind}-arrowhead)"></path>
            `).join("")}
          </g>
        </svg>
      </span>
    `;
  }

  function ingLegoStyle(size) {
    const sizes = {
      hero: "font-size:20px;",
      word: "font-size:17px;",
      ko: "font-size:16px;",
    };
    return "display:inline-block;line-height:1.08;font-weight:950;white-space:nowrap;color:rgba(199,0,31,0.92);-webkit-text-stroke:0.25px rgba(199,0,31,0.34);text-shadow:-1px -1px 0 rgba(255,255,255,0.58),1px 1px 0 rgba(104,0,17,0.28),0 0 6px rgba(255,20,58,0.38),0 0 12px rgba(255,20,58,0.18);" + (sizes[size] || sizes.word);
  }

  function edLegoStyle(size) {
    const sizes = {
      hero: "font-size:20px;",
      word: "font-size:17px;",
      ko: "font-size:16px;",
    };
    return "display:inline-block;line-height:1.08;font-weight:950;white-space:nowrap;color:rgba(7,95,201,0.92);-webkit-text-stroke:0.25px rgba(7,95,201,0.34);text-shadow:-1px -1px 0 rgba(255,255,255,0.6),1px 1px 0 rgba(0,42,116,0.28),0 0 6px rgba(0,103,255,0.4),0 0 12px rgba(0,103,255,0.18);" + (sizes[size] || sizes.word);
  }

  function buildModalQuestionHtml() {
    const items = [
      { lead: "나 이거 ", mark: "하고 싶다!!", tail: "" },
      { lead: "이건 꼭 ", mark: "해야 한다", tail: "" },
      { lead: "오늘은 ", mark: "안 한다", tail: "" },
    ];
    return `
      <div class="lip-example-stack">
        ${items.map((item) => `
          <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
            ${buildTenseText(item.lead)}
            ${buildTenseMarker(item.mark)}
            ${buildTenseText(item.tail)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildModalPrefixHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildModalFrontVerbHtml("will", "go", "hero")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildModalChip("I", "plain", "small")}
          ${buildTenseMarker("will")}
          ${buildTenseChip("go", "verb", "compact")}
        </div>
      </div>
    `;
  }

  function buildModalSingleWordListHtml() {
    const rows = [
      ["can", ["swim", "run", "help"], "할 수 있다", "can"],
      ["may", ["leave", "use", "ask"], "해도 된다", "may"],
      ["should", ["study", "sleep", "listen"], "하는 게 좋다", "should"],
      ["must", ["finish", "stop", "wait"], "반드시 해야 한다", "must"],
      ["will", ["go", "come", "start"], "할 것이다", "future"],
      ["don't", ["run", "touch", "worry"], "안 한다", "negative"],
    ];
    return buildModalListHtml(rows);
  }

  function buildModalPhraseListHtml() {
    const rows = [
      ["want to", ["eat", "play", "learn"], "하고 싶다", "want"],
      ["need to", ["sleep", "practice", "check"], "할 필요가 있다", "need"],
      ["have to", ["study", "clean", "leave"], "해야 한다", "must"],
    ];
    return buildModalListHtml(rows);
  }

  function buildModalPhraseBridgeHtml() {
    return buildModalRotatorHtml([
      ["want to", "eat", "먹고 싶다", "want"],
      ["have to", "study", "공부해야 한다", "must"],
      ["need to", "check", "확인할 필요가 있다", "need"],
    ]);
  }

  function buildModalObligationPhraseHtml() {
    return buildModalListHtml([
      ["have to", ["study", "leave", "wear"], "해야 한다", "must"],
      ["need to", ["check", "practice", "find"], "할 필요가 있다", "need"],
    ]);
  }

  function buildModalNoNeedPhraseHtml() {
    return buildModalListHtml([
      ["don't have to", ["come", "hurry", "bring"], "안 해도 된다", "negative"],
      ["doesn't have to", ["wait", "leave", "pay"], "안 해도 된다", "negative"],
    ]);
  }

  function buildModalHabitAbilityPhraseHtml() {
    return buildModalListHtml([
      ["used to", ["play", "live", "walk"], "예전에는 하곤 했다", "future"],
      ["be able to", ["solve", "swim", "join"], "할 수 있다", "can"],
    ]);
  }

  function buildModalPhrasePracticeHtml() {
    return buildModalRotatorHtml([
      ["am going to", "call", "전화할 예정이다", "future"],
      ["would like to", "order", "주문하고 싶습니다", "want"],
      ["are able to", "join", "함께할 수 있다", "can"],
      ["used to", "play", "예전에 놀곤 했다", "future"],
    ]);
  }

  function buildModalPracticeHtml() {
    const rows = [
      ["can", "swim", "수영할 수 있다", "can"],
      ["must", "study", "공부해야 한다", "must"],
      ["will", "go", "갈 것이다", "future"],
      ["want to", "eat", "먹고 싶다", "want"],
      ["don't", "run", "달리지 않는다", "negative"],
    ];
    return buildModalRotatorHtml(rows);
  }

  function buildModalListHtml(rows) {
    const count = Array.isArray(rows) ? rows.length : 0;
    return `
      <div class="aisth-modal-list" data-aisth-list-count="${count}" style="--aisth-list-count:${count};display:grid;grid-template-columns:1fr;">
        ${(rows || []).map(([word, verbs, meaning, role], index) => `
          <div class="aisth-modal-list-row" style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;padding:6px 0;${index ? "border-top:1px solid rgba(126,49,6,0.14);" : ""}">
            <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
              ${buildModalFrontVerbRotatorHtml(word, verbs, "list")}
            </div>
            ${buildModalMeaningLine(meaning, role)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildModalFrontVerbRotatorHtml(front, verbs, size = "normal") {
    const list = Array.isArray(verbs) ? verbs : [verbs];
    const step = list.length ? 5.6 / list.length : 1.4;
    return `
      <span class="aisth-modal-front-verb aisth-modal-front-verb-${size}" style="display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap;">
        ${buildTenseMarker(front)}
        <span class="lip-rotator-window aisth-modal-rotator-window" style="flex:0 0 86px;width:86px;height:34px;">
          ${list.map((verb, index) => `
            <span class="lip-rotator-item" style="--lip-delay:${(index * step).toFixed(2)}s;align-items:center;justify-content:center;">
              ${buildTenseChip(verb, "verb", size === "list" ? "compact" : "normal")}
            </span>
          `).join("")}
        </span>
      </span>
    `;
  }

  function buildModalRotatorHtml(rows) {
    const items = Array.isArray(rows) ? rows : [];
    const step = 1.55;
    const duration = Math.max(items.length * step, step).toFixed(2);
    return `
      <style>
        .aisth-modal-practice-window {
          position: relative;
          overflow: hidden;
        }
        .aisth-modal-practice-item {
          position: absolute;
          inset: 0;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          opacity: 0;
          transform: translateY(4px);
          animation-name: aisth-modal-practice-swap;
          animation-duration: var(--aisth-cycle);
          animation-delay: var(--aisth-delay);
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: opacity, transform;
        }
        @keyframes aisth-modal-practice-swap {
          0%, 15% {
            opacity: 1;
            transform: translateY(0);
          }
          20%, 100% {
            opacity: 0;
            transform: translateY(-4px);
          }
        }
      </style>
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <div class="aisth-modal-practice-window" style="flex:0 0 250px;width:min(100%,250px);height:72px;">
            ${items.map(([word, verb, meaning, role], index) => `
              <span class="aisth-modal-practice-item" style="--aisth-cycle:${duration}s;--aisth-delay:${(index * step).toFixed(2)}s;">
                ${buildModalFrontVerbHtml(word, verb, "hero")}
                ${buildModalMeaningLine(meaning, role)}
              </span>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function buildModalFrontVerbHtml(front, verb, size = "normal") {
    const sizes = {
      hero: "boss",
      normal: "normal",
      compact: "compact",
      list: "compact",
    };
    const gap = size === "hero" ? 10 : 7;
    return `
      <span class="aisth-modal-front-verb aisth-modal-front-verb-${size}" style="display:inline-flex;align-items:center;justify-content:center;gap:${gap}px;white-space:nowrap;">
        ${buildTenseMarker(front)}
        ${buildTenseChip(verb, "verb", sizes[size] || "normal")}
      </span>
    `;
  }

  function buildModalChip(text, role = "plain", size = "normal", caption = "") {
    const sizes = {
      hero: ["min-width:76px", "min-height:42px", "padding:5px 15px", "font-size:20px"],
      wide: ["min-height:34px", "padding:5px 13px", "font-size:14px"],
      normal: ["min-height:32px", "padding:5px 11px", "font-size:14px"],
      list: ["min-width:62px", "min-height:29px", "padding:4px 8px", "font-size:13px"],
      small: ["min-height:25px", "padding:3px 8px", "font-size:12px"],
    };
    const styles = [
      "display:inline-flex",
      "align-items:center",
      "justify-content:center",
      "border-radius:999px",
      "border:1px solid transparent",
      "font-weight:950",
      "line-height:1.05",
      "white-space:nowrap",
      ...(caption ? ["flex-direction:column", "gap:2px"] : []),
      ...modalRoleStyleRules(role),
      ...(sizes[size] || sizes.normal),
    ];
    const captionHtml = caption
      ? `<span style="font-size:8.5px;line-height:1;font-weight:850;opacity:0.76;">${escapeHtml(caption)}</span>`
      : "";
    return `<span class="aisth-modal-chip aisth-modal-chip-${role || "plain"} aisth-modal-chip-${size || "normal"}" style="${styles.join(";")}"><span>${escapeHtml(text)}</span>${captionHtml}</span>`;
  }

  function buildModalMeaningLine(text, role = "plain") {
    return `<div class="aisth-modal-meaning-line" style="${[
      "font-size:13px",
      "font-weight:900",
      "line-height:1.35",
      "text-align:center",
      "word-break:keep-all",
      ...modalTextStyleRules(role),
    ].join(";")}">${escapeHtml(text)}</div>`;
  }

  function modalTextStyleRules(role) {
    if (role === "can") return ["color:#2b67c7"];
    if (role === "may") return ["color:#17643c"];
    if (role === "should") return ["color:#6a3fc0"];
    if (role === "must") return ["color:#a91f1f"];
    if (role === "future") return ["color:#7e3106"];
    if (role === "negative") return ["color:#40484f"];
    if (role === "want") return ["color:#b62f74"];
    if (role === "need") return ["color:#16707a"];
    return ["color:#7e3106"];
  }

  function modalRoleStyleRules(role) {
    if (role === "can") {
      return ["border-color:rgba(43,103,199,0.28)", "background:rgba(235,243,255,0.98)", "color:#2b67c7"];
    }
    if (role === "may") {
      return ["border-color:rgba(47,143,85,0.28)", "background:rgba(226,247,232,0.98)", "color:#17643c"];
    }
    if (role === "should") {
      return ["border-color:rgba(122,70,214,0.25)", "background:rgba(241,235,255,0.98)", "color:#6a3fc0"];
    }
    if (role === "must") {
      return ["border-color:rgba(220,63,63,0.28)", "background:rgba(255,225,225,0.98)", "color:#a91f1f"];
    }
    if (role === "future") {
      return ["border-color:rgba(241,123,42,0.26)", "background:rgba(255,236,219,0.98)", "color:#7e3106"];
    }
    if (role === "negative") {
      return ["border-color:rgba(79,88,96,0.24)", "background:rgba(244,246,248,0.98)", "color:#40484f"];
    }
    if (role === "want") {
      return ["border-color:rgba(219,74,145,0.24)", "background:rgba(255,235,246,0.98)", "color:#b62f74"];
    }
    if (role === "need") {
      return ["border-color:rgba(22,132,141,0.25)", "background:rgba(228,250,250,0.98)", "color:#16707a"];
    }
    if (role === "verb") {
      return ["border-color:#f1c18e", "background:#fff", "color:#7e3106"];
    }
    return ["border-color:rgba(126,49,6,0.18)", "background:rgba(255,255,255,0.92)", "color:#7e3106"];
  }

  function buildSvtdInlinePart(part) {
    if (!part || typeof part !== "object") return escapeHtml(part ?? "");
    return `<span${roleStyleAttr(part.role, ["display:inline-flex", "align-items:center", "justify-content:center", "min-height:1.5em", "padding:0.04em 0.42em", "border-radius:999px", "border-width:1px", "border-style:solid"])}>${escapeHtml(part.text ?? "")}</span>`;
  }

  function buildSvtdStackedTitleHtml(stepNumber, parts) {
    return `<span style="display:block;">${(parts || []).map(buildSvtdInlinePart).join("")}</span>`;
  }
  function buildSvtdNextFocusToken(label, caption, role, extraClass = "") {
    return `
      <span class="aisth-svtd-focus-token is-${role}${extraClass ? ` ${extraClass}` : ""}"${roleStyleAttr(role, ["position:relative", "z-index:2", "display:inline-flex", "align-items:center", "justify-content:center", "flex-direction:column", "gap:2px", "width:100%", "min-height:50px", "padding:6px 6px", "border-width:1px", "border-style:solid", "box-sizing:border-box"])}>
        <span class="aisth-svtd-focus-label">${escapeHtml(label)}</span>
        <span class="aisth-svtd-focus-caption">${escapeHtml(caption)}</span>
      </span>
    `;
  }

  function buildSvtdNextFocusArrow() {
    return `<span class="aisth-svtd-focus-arrow" aria-hidden="true">→</span>`;
  }

  function buildSvtdNextFocusHtml() {
    return `
      <div class="aisth-svtd-shift-stage">
        <div class="aisth-svtd-shift-track">
          ${buildSvtdNextFocusToken("S", "누가", "subject")}
          ${buildSvtdNextFocusArrow()}
          ${buildSvtdNextFocusToken("V", "했다", "verb")}
          ${buildSvtdNextFocusArrow()}
          ${buildSvtdNextFocusToken("?", "다음은?", "pending", "is-pending")}
        </div>
      </div>
    `;
  }

  function buildSvtdTargetingHtml() {
    return `
      <div class="aisth-svtd-snap-stage">
        <div class="aisth-svtd-snap-slot-wrap">
          ${buildSvtdNextFocusToken("V", "했다", "verb", "aisth-svtd-snap-prev-v")}
          <span class="aisth-svtd-snap-arrow" aria-hidden="true">→</span>
          <div class="aisth-svtd-snap-slot">
            ${buildSvtdNextFocusToken("?", "다음은?", "pending", "aisth-svtd-snap-pending")}
            <span class="aisth-svtd-snap-reticle" aria-hidden="true"><span class="aisth-svtd-reticle-ring"></span><span class="aisth-svtd-reticle-line-x"></span><span class="aisth-svtd-reticle-line-y"></span><span class="aisth-svtd-reticle-shot"></span></span>
            ${buildSvtdNextFocusToken("T", "누구한테", "target", "aisth-svtd-snap-target")}
          </div>
        </div>
      </div>
    `;
  }

  function buildSvtdDetailTooltipHtml() {
    return `
      <div class="aisth-svtd-detail-stage">
        <div class="aisth-svtd-detail-line">
          ${buildSvtdNextFocusToken("T", "누구한테", "target", "aisth-svtd-detail-target")}
          <span class="aisth-svtd-detail-colon" aria-hidden="true">:</span>
          ${buildSvtdNextFocusToken("D", "어떻게", "detail", "aisth-svtd-detail-tooltip")}
        </div>
      </div>
    `;
  }

  function buildSvtdFlipChip(fromLabel, fromCaption, toLabel, role, delay) {
    const styles = [
      `--lip-delay:${delay.toFixed(2)}s`,
      "min-height:36px",
      "padding:5px 6px",
      "border-width:1px",
      "border-style:solid",
      "font-size:12px",
    ];
    styles.push(...svtdRoleStyleRules(role));
    const fromHtml = `
      <span class="lip-morph-word is-from" style="flex-direction:column;gap:2px;">
        <span>${escapeHtml(fromLabel)}</span>
        <span style="font-size:8.5px;line-height:1;font-weight:800;opacity:0.82;">${escapeHtml(fromCaption)}</span>
      </span>
    `;
    const toHtml = `<span class="lip-morph-word is-to">${escapeHtml(toLabel)}</span>`;
    return `<div class="lip-morph-chip aisth-svtd-final-chip" style="${styles.join(";")}">${fromHtml}${toHtml}</div>`;
  }

  function buildSvtdFlipSentenceHtml() {
    return `
      <div class="aisth-svtd-final-stage">
        <div class="aisth-svtd-final-sentence">I made Mina happy.</div>
        <div class="aisth-svtd-final-grid lip-morph-grid">
          ${buildSvtdFlipChip("S", "누가", "I", "subject", 0)}
          ${buildSvtdFlipChip("V", "했다", "made", "verb", 0.22)}
          ${buildSvtdFlipChip("T", "누구한테", "Mina", "target", 0.44)}
          ${buildSvtdFlipChip("D", "어떻게", "happy", "detail", 0.66)}
        </div>
      </div>
    `;
  }

  function buildThatTitleHtml(prefix, suffix) {
    return `<span style="display:block;">${escapeHtml(prefix)}${buildThatGlowWord("that", "title")}${escapeHtml(suffix)}</span>`;
  }

  function buildThatNoParticlesHtml() {
    const rows = [
      [
        { text: "I", role: "en" },
        { text: "는", role: "particle" },
        { text: "you", role: "en" },
        { text: "에게", role: "particle" },
        { text: "실망했다", role: "ko" },
      ],
      [
        { text: "you", role: "en" },
        { text: "와", role: "particle" },
        { text: "you", role: "en" },
        { text: "의", role: "particle" },
        { text: "puppy", role: "en" },
        { text: "는", role: "particle" },
        { text: "very happy", role: "en" },
        { text: "하게", role: "particle" },
        { text: "보인다", role: "ko" },
      ],
    ];
    return `
      <div class="lip-example-stack aisth-that-cross-stack">
        ${rows.map((parts, index) => `
          <div class="aisth-that-cross-line" style="--that-cross-delay:${(index * 0.42).toFixed(2)}s;">
            ${parts.map(buildThatWrongPart).join("")}
          </div>
        `).join("")}
      </div>
    `;
  }
  function buildThatBridgeOnlyHtml() {
    const chunks = [
      "I 원한다",
      "마라탕",
      "맛있는 거",
      "내가 어제 찾아놓은 맛집의",
    ];
    return `
      <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:5px 6px;min-width:0;">
        ${chunks.map((chunk, index) => `
          ${buildThatBridgeChunk(chunk)}
          ${index < chunks.length - 1 ? buildThatBridgePhrase("근데 그게 뭐냐면..") : ""}
        `).join("")}
      </div>
    `;
  }

  function buildThatNameHtml() {
    return `
      <div class="lip-example-stack" style="gap:8px;">
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildThatBridgePhrase("근데 그게 뭐냐면..")}
          ${buildTenseSymbol("→")}
          ${buildThatGlowWord("that", "hero")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildThatSentencePart("I know")}
          ${buildThatGlowWord("that")}
          ${buildThatSentencePart("you are right")}
        </div>
      </div>
    `;
  }

  function buildThatToggleHtml() {
    const rows = [
      ["the food", "I want"],
      ["the restaurant", "I found yesterday"],
    ];
    return `
      ${buildThatOptionalStylesHtml()}
      <div class="lip-example-stack" style="gap:8px;">
        ${rows.map(([front, tail]) => `
          <div style="display:flex;align-items:baseline;justify-content:center;gap:4px;min-width:0;white-space:nowrap;">
            ${buildThatSentencePart(front)}
            <span class="aisth-that-optional">${buildThatGlowWord("that")}</span>
            ${buildThatSentencePart(tail)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildThatWrongPart(part) {
    if (!part || typeof part !== "object") return "";
    const text = escapeHtml(part.text ?? "");
    if (part.role === "particle" || part.role === "bad") {
      return `<span class="aisth-that-particle">${text}</span>`;
    }
    const roleClass = part.role === "ko" ? " is-ko" : " is-en";
    return `<span class="aisth-that-token${roleClass}">${text}</span>`;
  }
  function buildThatBridgeChunk(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:25px;padding:3px 7px;border-radius:999px;background:rgba(255,255,255,0.82);border:1px solid rgba(126,49,6,0.14);font-size:12px;line-height:1.1;font-weight:950;color:#3c2d22;word-break:keep-all;">${escapeHtml(text)}</span>`;
  }

  function buildThatBridgePhrase(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:23px;padding:2px 6px;border-radius:7px;background:rgba(255,237,188,0.72);border:1px solid rgba(226,167,36,0.24);font-size:10.5px;line-height:1.1;font-weight:950;color:#8a4d00;word-break:keep-all;">${escapeHtml(text)}</span>`;
  }

  function buildThatSentencePart(text) {
    return `<span style="display:inline-flex;align-items:center;font-size:14px;line-height:1.25;font-weight:950;color:#3c2d22;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildThatGlowWord(text, size = "normal") {
    const sizes = {
      title: "font-size:1em;line-height:1;",
      hero: "font-size:24px;line-height:1;",
      normal: "font-size:17px;line-height:1;",
    };
    return `<span style="${thatGlowTextStyle()}${sizes[size] || sizes.normal}">${escapeHtml(text)}</span>`;
  }

  function thatGlowTextStyle() {
    return "display:inline-block;vertical-align:baseline;font-weight:950;background:linear-gradient(90deg,#f17b2a 0%,#ffd84a 52%,#f5a400 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 5px rgba(255,205,54,0.48)) drop-shadow(0 1px 0 rgba(126,49,6,0.14));";
  }

  function buildThatOptionalStylesHtml() {
    return `
      <style>
        .aisth-that-optional {
          display: inline-flex;
          align-items: baseline;
          justify-content: center;
          overflow: hidden;
          white-space: nowrap;
          max-width: 56px;
          animation: aisth-that-optional-toggle 3.4s ease-in-out infinite;
          will-change: max-width, opacity, transform;
        }
        @keyframes aisth-that-optional-toggle {
          0%, 39% {
            max-width: 56px;
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          52%, 86% {
            max-width: 0;
            opacity: 0;
            transform: translateY(-3px) scale(0.86);
          }
          100% {
            max-width: 56px;
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      </style>
    `;
  }

  function cleanStepTitle(title) {
    return String(title || "").replace(/^\s*\d+단계\s*[:：.]?\s*/, "").trim();
  }

  function buildStackedStepTitleHtml(title, index) {
    const clean = cleanStepTitle(title);
    return `<span style="display:block;">${escapeHtml(clean)}</span>`;
  }

  function normalizeSteps(entry) {
    const maxSteps = Number.isInteger(entry?.maxSteps) ? entry.maxSteps : 5;
    const rawSteps = (Array.isArray(entry?.steps) ? entry.steps : []).slice(0, maxSteps);
    return rawSteps.map((step, index) => ({
      title: cleanStepTitle(step.title),
      titleHtml: step.titleLayout === "stacked" ? buildStackedStepTitleHtml(step.title, index) : step.titleHtml,
      body: step.body,
      exampleHtml: step.exampleHtml ? String(step.exampleHtml) : buildExampleHtml(step.rows),
    }));
  }

  function getConfig(options) {
    const lesson = Number(options?.lesson);
    const exercise = Number(options?.exercise);
    const entry = INTRO_MAP[`${lesson}-${exercise}`];
    if (!entry) return null;

    return {
      pageLabel: String(options?.pageLabel || "Aisth"),
      title: entry.title,
      nextLabel: "다음",
      primaryLabel: String(options?.startLabel || "시작"),
      onPrimary: options?.onStart,
      steps: normalizeSteps(entry),
    };
  }

  function render(container, options) {
    if (!global.LessonIntroPlayer || typeof global.LessonIntroPlayer.render !== "function") return false;
    const config = getConfig(options);
    if (!config) return false;
    const rendered = global.LessonIntroPlayer.render(container, config);
    if (rendered) {
      const lesson = Number(options?.lesson);
      const exercise = Number(options?.exercise);
      const root = container.querySelector(".lip-intro");
      if (root && Number.isFinite(lesson) && Number.isFinite(exercise)) {
        root.classList.add(`aisth-intro-l${lesson}e${exercise}`);
      }
    }
    return rendered;
  }

  global.AisthIntroFronts = {
    getConfig,
    render,
  };
})(window);
