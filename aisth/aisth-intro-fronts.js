(function (global) {
  "use strict";

  const INTRO_MAP = {
    "2-1": {
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
      title: "\uC870\uB3D9\uC0AC",
      maxSteps: 5,
      steps: [
        {
          title: "\uADF8\uB7EC\uBA74, '\uD558\uACE0 \uC2F6\uB2E4!!'\uB294 \uC5B4\uB5BB\uAC8C \uC4F8\uAE4C\uC694? '\uD574\uC57C \uD55C\uB2E4', '\uC548 \uD55C\uB2E4'\uB294\uC694?",
          body: "",
          exampleHtml: buildModalQuestionHtml(),
        },
        {
          title: "\uC55E\uC5D0\uB2E4 \uBB58 \uBD99\uC5EC\uBD05\uC2DC\uB2E4. '\uD560 \uAC83\uC774\uB2E4' \uCC98\uB7FC \uB9D0\uC774\uC5D0\uC694.",
          body: "",
          exampleHtml: buildModalPrefixHtml(),
        },
        {
          title: "\uC6B0\uB9AC\uB294 \uC774\uAC78 '\uC870\uB3D9\uC0AC'\uB77C\uACE0 \uBD80\uB985\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildModalSingleWordListHtml(),
        },
        {
          title: "\uB2E8\uC5B4\uB97C \uB450\uAC1C \uC368\uB3C4, \uC870\uB3D9\uC0AC\uB85C \uAE30\uC5B5\uD574\uBC84\uB9AC\uC138\uC694!",
          body: "",
          exampleHtml: buildModalPhraseListHtml(),
        },
        {
          title: "\uC774\uC81C \uC9C1\uC811 \uC870\uB3D9\uC0AC\uB97C \uB123\uC5B4\uBCF4\uC138\uC694!",
          body: "",
          exampleHtml: buildModalPracticeHtml(),
        },
      ],
    },
    "2-3": {
      title: "\uC870\uB3D9\uC0AC",
      steps: [
        {
          title: "2-2\uC5D0\uC11C\uB294 can, must, want to\uCC98\uB7FC \uD589\uB3D9 \uC55E\uC5D0 \uBD99\uB294 \uB9D0\uC744 \uBC30\uC6E0\uC2B5\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["can"],
            ["must"],
          ],
        },
        {
          title: "have to\uB294 \u201C\uD574\uC57C \uD55C\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "I have to study. = \uB098\uB294 \uACF5\uBD80\uD574\uC57C \uD55C\uB2E4.",
          rows: [
            ["\uD574\uC57C \uD55C\uB2E4"],
            ["I have to study.", "\uB098\uB294 \uACF5\uBD80\uD574\uC57C \uD55C\uB2E4."],
          ],
        },
        {
          title: "need to\uB294 \u201C\uD560 \uD544\uC694\uAC00 \uC788\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "He needs to find a job. = \uADF8\uB294 \uC9C1\uC5C5\uC744 \uAD6C\uD560 \uD544\uC694\uAC00 \uC788\uB2E4.",
          rows: [
            ["\uD560 \uD544\uC694\uAC00 \uC788\uB2E4"],
            ["He needs to find a job.", "\uADF8\uB294 \uC9C1\uC5C5\uC744 \uAD6C\uD560 \uD544\uC694\uAC00 \uC788\uB2E4."],
          ],
        },
        {
          title: "don\u2019t have to\uB294 \u201C\uC548 \uD574\uB3C4 \uB41C\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "\u201C\uD558\uC9C0 \uB9D0\uC544\uC57C \uD55C\uB2E4\u201D\uAC00 \uC544\uB2C8\uB77C \u201C\uD560 \uD544\uC694\uAC00 \uC5C6\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          rows: [
            ["\uC548 \uD574\uB3C4 \uB41C\uB2E4"],
            ["\uD558\uC9C0 \uB9D0\uC544\uC57C \uD55C\uB2E4", "\uD560 \uD544\uC694\uAC00 \uC5C6\uB2E4"],
          ],
        },
        {
          title: "used to\uB294 \u201C\uC608\uC804\uC5D0\uB294 ~\uD558\uACE4 \uD588\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "\uC9C0\uAE08\uC740 \uC544\uB2D0 \uC218\uB3C4 \uC788\uB2E4\uB294 \uB290\uB08C\uC774 \uC788\uC2B5\uB2C8\uB2E4.",
          rows: [
            ["\uC608\uC804\uC5D0\uB294 ~\uD558\uACE4 \uD588\uB2E4"],
          ],
        },
      ],
    },
    "3-1": {
      title: "\uC758\uBB38\uBB38",
      maxSteps: 4,
      steps: [
        {
          title: "\uC9C8\uBB38\uC740 \uC5B4\uB5BB\uAC8C \uB9CC\uB4E4\uAE4C\uC694?",
          body: "",
          exampleHtml: buildQuestionAskHtml(),
        },
        {
          title: "\uC21C\uC11C\uB97C \uBC14\uAFD4\uC8FC\uBA74 \uB429\uB2C8\uB2E4. \uC0C8\uCE58\uAE30!",
          body: "",
          exampleHtml: buildQuestionSwapHtml(),
        },
        {
          title: "\uB3D9\uC0AC \uC548\uC758 (\uB610\uB294 be\uB3D9\uC0AC, \uC870\uB3D9\uC0AC)\uB97C \uC55E\uC73C\uB85C \uCABD\uC625 \uBF51\uC544\uC8FC\uC138\uC694.",
          body: "",
          exampleHtml: buildQuestionPullHtml(),
        },
        {
          title: "\uC758\uBB38\uBB38, \uC644\uC131\uC785\uB2C8\uB2E4!",
          body: "",
          exampleHtml: buildQuestionCompleteHtml(),
        },
      ],
    },
    "3-2": {
      title: "\uC758\uBB38\uBB38",
      steps: [
        {
          title: "\uD3C9\uC11C\uBB38\uC740 \uADF8\uB0E5 \uB9D0\uD558\uB294 \uBB38\uC7A5\uC785\uB2C8\uB2E4.",
          body: "He is tired. = \uADF8\uB294 \uD53C\uACE4\uD558\uB2E4.",
          rows: [
            ["He is tired."],
            ["\uADF8\uB294 \uD53C\uACE4\uD558\uB2E4."],
          ],
        },
        {
          title: "\uC758\uBB38\uBB38\uC740 \uBB3C\uC5B4\uBCF4\uB294 \uBB38\uC7A5\uC785\uB2C8\uB2E4.",
          body: "Is he tired? = \uADF8\uB294 \uD53C\uACE4\uD558\uB2C8?",
          rows: [
            ["Is he tired?"],
            ["\uADF8\uB294 \uD53C\uACE4\uD558\uB2C8?"],
          ],
        },
        {
          title: "am / are / is / can / will \uAC19\uC740 \uB9D0\uC774 \uC788\uC73C\uBA74 \uADF8\uAC83\uC744 \uC55E\uC73C\uB85C \uBCF4\uB0C5\uB2C8\uB2E4.",
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
          title: "\uADF8\uB7F0 \uB9D0\uC774 \uC5C6\uACE0 \uD589\uB3D9\uB3D9\uC0AC\uB9CC \uC788\uC73C\uBA74 \uC55E\uC5D0 do / does / did\uB97C \uBD99\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["do"],
            ["does"],
          ],
        },
        {
          title: "\uC774\uC81C \uD3C9\uC11C\uBB38\uC744 \uBCF4\uACE0 \uC9C8\uBB38 \uBB38\uC7A5\uC73C\uB85C \uBC14\uAFD4\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "3-3": {
      title: "\uBD80\uC815\uBB38",
      maxSteps: 4,
      steps: [
        {
          title: "'\uC544\uB2C8\uB2E4'\uB294 Not\uC785\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildNegativeNotHtml(),
        },
        {
          title: "\uADF8\uB7FC is, do(walk)\uB294 \uC5B4\uB5BB\uAC8C '\uC544\uB2C8\uB77C'\uACE0 \uD560\uAE4C\uC694?",
          body: "",
          exampleHtml: buildNegativeTargetsHtml(),
        },
        {
          title: "be\uB294 not\uC744 \uBD99\uC5EC\uBD05\uC2DC\uB2E4. \uC544\uB2C8\uC57C!",
          body: "",
          exampleHtml: buildNegativeBeHtml(),
        },
        {
          title: "do(walk)\uB294 don't walk\uC744 \uC55E\uC5D0 \uBD99\uC5EC\uC90D\uC2DC\uB2E4. \uC548\uD574!",
          body: "",
          exampleHtml: buildNegativeDoHtml(),
        },
      ],
    },
    "3-4": {
      title: "\uBE44\uAD50\uAE09 / \uCD5C\uC0C1\uAE09",
      maxSteps: 4,
      steps: [
        {
          title: "\uB0B4\uAC00 \uB354 \uBE68\uB77C!\uB294 \uC5B4\uB5BB\uAC8C \uB9D0\uD560\uAE4C\uC694?",
          body: "",
          exampleHtml: buildCompareMoreQuestionHtml(),
        },
        {
          title: "'more'\uC744 \uBD99\uC5EC\uC90D\uB2C8\uB2E4. \uC9E7\uC740 \uB2E8\uC5B4\uB294 '-er'\uC744 \uBD99\uC5EC\uBC84\uB824\uC694.",
          body: "",
          exampleHtml: buildCompareMoreErHtml(),
        },
        {
          title: "\uB108\uBCF4\uB2E4 \uB354 \uBE68\uB77C\uB294\uC694? 'than'\uAE4C\uC9C0 \uBD99\uC5EC\uC90D\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildCompareThanHtml(),
        },
        {
          title: "\uB0B4\uAC00 \uC81C\uC77C \uBE68\uB77C!\uB294\uC694? 'MOST'\uB97C \uBD99\uC5EC\uC90D\uB2C8\uB2E4. (\uB610\uB294 -est)",
          body: "",
          exampleHtml: buildCompareMostHtml(),
        },
      ],
    },
    "3-5": {
      title: "There is / Here is",
      maxSteps: 4,
      steps: [
        {
          title: "\uC5EC\uAE30\uC788\uB2E4, \uC800\uAE30\uC788\uB2E4!!\uB294 \uC5B4\uB5BB\uAC8C \uC4F8\uAE4C\uC694?",
          body: "",
          exampleHtml: buildThereHereQuestionHtml(),
        },
        {
          title: "\uAC15\uD558\uAC8C \uB9D0\uD558\uACE0 \uC2F6\uC73C\uB2C8, \uB9E8 \uC55E\uC5D0 \uC368\uC90D\uC2DC\uB2E4. \uC5EC\uAE30!! \uC800\uAE30!!",
          body: "",
          exampleHtml: buildThereFrontHtml(),
        },
        {
          title: "\uADF8 \uD6C4\uC5D0 '~\uC5D0 \uC788\uB2E4'\uB97C \uBD99\uC5EC\uC90D\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildThereIsHtml(),
        },
        {
          title: "\uC544\uBB34\uAC70\uB098 \uB123\uC5B4\uB3C4 \uC644\uC131!",
          body: "",
          exampleHtml: buildThereCompleteHtml(),
        },
      ],
    },
    "4-1": {
      title: "\uACA9",
      maxSteps: 4,
      steps: [
        {
          title: "\uC601\uC5B4\uC5D0\uB294 \uC740 / \uB294 \uC774 / \uAC00 \uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uADF8\uB7FC \uB098\uB294 / \uB098\uB97C / \uB098\uC758 \uB294 \uC5B4\uB5BB\uAC8C \uC4F8\uAE4C\uC694?",
          body: "",
          exampleHtml: buildPronounQuestionHtml(),
        },
        {
          title: "\uC815\uB2F5\uC740, \uB2E4 \uB530\uB85C \uB2E8\uC5B4\uB85C \uB9CC\uB4E0\uB2E4! \uC785\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildPronounSeparateHtml(),
        },
        {
          title: "\uB73B\uC5D0 \uB530\uB77C \uB2E4\uB974\uAC8C \uB123\uC5B4\uC918\uC57C\uD574\uC694.",
          body: "",
          exampleHtml: buildPronounMeaningShiftHtml(),
        },
        {
          title: "\uC5B5\uC6B8\uD558\uC9C0\uB9CC, \uB2E4 \uC678\uC6CC\uC90D\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildPronounMemorizeHtml(),
        },
      ],
    },
    "4-2": {
      title: "\uC804\uCE58\uC0AC1",
      maxSteps: 2,
      steps: [
        {
          title: "\uC704\uCE58\uB97C \uB354 \uAD6C\uCCB4\uC801\uC73C\uB85C \uB9D0\uD574\uBD05\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildPrepositionSpecificHtml(),
        },
        {
          title: "\uC4F0\uB294 \uC21C\uC11C\uC5D0 \uC8FC\uC758\uD558\uC138\uC694",
          body: "",
          exampleHtml: buildPrepositionOrderHtml(),
        },
      ],
    },
    "4-3": {
      title: "if : \uB9CC\uC57D\uC5D0\u2026",
      maxSteps: 2,
      steps: [
        {
          title: "\uB9CC\uC57D\uC5D0..\uB294 \uC5B4\uB5BB\uAC8C \uC368\uC8FC\uBA74 \uC88B\uC744\uAE4C\uC694?",
          body: "",
          exampleHtml: buildIfQuestionHtml(),
        },
        {
          title: "if\uB97C \uC368\uC90D\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildIfUseHtml(),
        },
      ],
    },
    "5-1": {
      title: "\uBD88\uADDC\uCE59",
      maxSteps: 4,
      steps: [
        {
          title: "\uC601\uC5B4\uB294 \uC815\uC2E0\uC774 \uB098\uAC14\uC2B5\uB2C8\uB2E4. \uC798 \uC4F0\uB358 ed\uB97C \uD30C\uAD34\uD574\uBD05\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildIrregularBreakHtml(),
        },
        {
          title: "\uADF8\uB300\uC2E0 \uC804\uC6A9 \uB2E8\uC5B4\uB97C \uC368\uC904\uAC70\uC5D0\uC694. \uBBF8\uCCE4\uC8E0?",
          body: "",
          exampleHtml: buildIrregularDedicatedHtml(),
        },
        {
          title: "\uC774\uAC78 \uBCF4\uD1B5 '\uBD88\uADDC\uCE59 \uB3D9\uC0AC'\uB77C\uACE0 \uBD80\uB985\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildIrregularNameHtml(),
        },
        {
          title: "\uC5B5\uC6B8\uD558\uC9C0\uB9CC, \uB2E4 \uC678\uC6CC\uC90D\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildIrregularMemorizeHtml(),
        },
      ],
    },
    "5-2": {
      title: "\uD604\uC7AC\uC644\uB8CC",
      maxSteps: 3,
      steps: [
        {
          title: "\uC774\uC81C \uAC15\uC870\uB97C \uC704\uD55C \uD45C\uD604\uC744 \uB610 \uBC30\uC6CC\uBD05\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildPerfectEmphasisHtml(),
        },
        {
          title: "\uC800\uBC88 \uC2DC\uAC04\uC5D0 \uBC30\uC6E0\uB358 P.P\uC5D0 have\uB97C \uB354\uD574\uC8FC\uBA74 \uB429\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildPerfectFormulaHtml(),
        },
        {
          title: "\uC790\uC8FC \uC4F0\uC9C4 \uC54A\uC9C0\uB9CC, \uCC30\uB5A1\uAC19\uC774 \uC4F0\uC785\uB2C8\uB2E4!",
          body: "",
          exampleHtml: buildPerfectUseHtml(),
        },
      ],
    },
    "5-3": {
      title: "\uC811\uC18D\uC0AC",
      maxSteps: 3,
      steps: [
        {
          title: "\uD560 \uB9D0\uC774 \uB9CE\uC73C\uBA74, \uC9E7\uC740 \uB9D0\uC744 \uC774\uC5B4\uC918\uC57C \uD569\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildConjunctionWordsHtml(),
        },
        {
          title: "\uBC29\uAE08 \uBB38\uC7A5\uC744 \uC601\uC5B4\uB85C \uADF8\uB300\uB85C \uC62E\uACA8\uBD05\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildConjunctionTranslateHtml(),
        },
        {
          title: "\uC790\uC8FC \uC4F0\uB294 \uC811\uC18D\uC0AC\uB97C \uBA3C\uC800 \uC0B4\uD3B4\uBD05\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildConjunctionListHtml(),
        },
      ],
    },
    "5-4": {
      title: "\uC870\uB3D9\uC0AC2",
      maxSteps: 4,
      steps: [
        {
          title: "\uB354 \uB354 \uC5B4\uB824\uC6B4 \uB9D0\uC740 \uC5B4\uB5BB\uAC8C \uC4F8\uAE4C\uC694? \uC870\uB3D9\uC0AC 2\uAC1C\uB85C?",
          body: "",
          exampleHtml: buildAdvancedModalQuestionHtml(),
        },
        {
          title: "\uC870\uB3D9\uC0AC\uB294 1\uAC1C\uB9CC \uC4F8 \uC218 \uC5C6\uC5B4\uC694.",
          body: "",
          exampleHtml: buildAdvancedModalWrongHtml(),
        },
        {
          title: "\uADF8\uB798\uC11C \uC61B\uB0A0 \uC0AC\uB78C\uB4E4\uC740 \uAF3C\uC218\uB97C \uBC1C\uACAC\uD588\uC2B5\uB2C8\uB2E4. \uC870\uB3D9\uC0AC\uCC98\uB7FC \uC4F0\uAE30!",
          body: "",
          exampleHtml: buildAdvancedModalTrickHtml(),
        },
        {
          title: "\uAE38\uC5B4\uBCF4\uC774\uC9C0\uB9CC, \uC870\uB3D9\uC0AC\uB780\uAC78 \uAE30\uC5B5\uD558\uC138\uC694!",
          body: "",
          exampleHtml: buildAdvancedModalRememberHtml(),
        },
      ],
    },
    "6-1": {
      title: "-ing / -ed 1. \uBD84\uC0AC",
      maxSteps: 4,
      steps: [
        {
          title: "ing\uC640 ed\uB97C \uAD6C\uBD84\uD574\uBD05\uC2DC\uB2E4. \uC2DC\uC81C\uC5D0\uC11C \uBD24\uC5C8\uC8E0?",
          body: "",
          exampleHtml: buildIngEdCompareHtml(),
        },
        {
          title: "ing\uB294 \uAC00\uD569\uB2C8\uB2E4. \uC9C0\uAE08 \uD558\uACE0\uC788\uC2B5\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildIngActiveHtml(),
        },
        {
          title: "ed\uB294 \uB2F9\uD569\uB2C8\uB2E4. \uC774\uBBF8 \uB2E4 \uB05D\uB0AC\uAC70\uB4E0\uC694.",
          body: "",
          exampleHtml: buildEdPassiveHtml(),
        },
        {
          title: "'\uAC00\uD558\uB294 \uC0C1\uD0DC', '\uB2F9\uD558\uB294 \uC0C1\uD0DC' \uB77C\uB294 \uAC1C\uB150\uC740 \uC55E\uC73C\uB85C\uB3C4 \uC544\uC8FC \uC911\uC694\uD558\uB2C8 \uAF2D \uAE30\uC5B5\uD574\uB461\uC2DC\uB2E4!",
          body: "",
          exampleHtml: buildIngEdDirectionHtml(),
        },
      ],
    },
    "6-2": {
      title: "-ing / -ed 2. \uB3D9\uBA85\uC0ACst",
      maxSteps: 3,
      steps: [
        {
          title: "\uC751\uC6A9\uD574\uBCFC\uAE4C\uC694?",
          body: "",
          exampleHtml: buildIngApplicationStartHtml(),
        },
        {
          title: "'\uAC00\uD558\uB294 \uC0C1\uD0DC'\uB9CC \uC54C\uACE0\uC788\uC73C\uBA74, \uC751\uC6A9\uC774 \uC27D\uC2B5\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildIngStateApplyHtml(),
        },
        {
          title: "\uD55C\uAD6D\uC5B4\uB85C \uC608\uC058\uAC8C \uB2E4\uB4EC\uC5B4\uB9CC \uC8FC\uC138\uC694.",
          body: "",
          exampleHtml: buildIngKoreanPolishHtml(),
        },
      ],
    },
    "6-3": {
      title: "-ing / -ed 3. \uC9C4\uD589\uD615 vs \uC218\uB3D9\uD0DC",
      maxSteps: 4,
      steps: [
        {
          title: "\uD55C\uAD6D\uC0AC\uB78C\uC774 \uC5B4\uB824\uC6B4 \uAC74 \uBC14\uB85C \uC5EC\uAE30\uC785\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildIngEdAdvancedWarningHtml(),
        },
        {
          title: "\uC7A0\uC2DC\uB9CC, \uBB3C\uAC74\uB4E4\uC774 \uC0B4\uC544\uB0AC\uB2E4\uACE0 \uC0DD\uAC01\uD574\uBD05\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildObjectsAliveHtml(),
        },
        {
          title: "\uBB3C\uAC74\uB4E4\uC774 \uAC00\uD588\uC744\uAE4C\uC694, \uB2F9\uD588\uC744\uAE4C\uC694?",
          body: "",
          exampleHtml: buildIngEdObjectQuestionHtml(),
        },
        {
          title: "\uBAB8\uC5D0 \uC775\uAE30 \uC804\uAE4C\uC9C4 \uCC28\uADFC\uCC28\uADFC \uC0DD\uAC01\uD574\uBD05\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildIngEdThinkSlowHtml(),
        },
      ],
    },
    "6-4": {
      title: "-ing / -ed 3. \uC9C4\uD589\uD615 vs \uC218\uB3D9\uD0DC",
      steps: [
        {
          title: "boring / bored, exciting / excited, annoying / annoyed\uB294 \uAC19\uC740 \uBFCC\uB9AC\uC9C0\uB9CC \uBC29\uD5A5\uC774 \uB2E4\uB985\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["boring"],
            ["bored"],
            ["exciting"],
            ["excited"],
          ],
        },
        {
          title: "boring\uC740 \u201C\uC9C0\uB8E8\uD558\uAC8C \uB9CC\uB4DC\uB294\u201D \uCABD\uC785\uB2C8\uB2E4.",
          body: "The class is boring. = \uC218\uC5C5\uC774 \uC9C0\uB8E8\uD558\uB2E4.",
          rows: [
            ["\uC9C0\uB8E8\uD558\uAC8C \uB9CC\uB4DC\uB294"],
            ["The class is boring.", "\uC218\uC5C5\uC774 \uC9C0\uB8E8\uD558\uB2E4."],
          ],
        },
        {
          title: "bored\uB294 \u201C\uC9C0\uB8E8\uD568\uC744 \uB290\uB07C\uB294\u201D \uCABD\uC785\uB2C8\uB2E4.",
          body: "I am bored. = \uB098\uB294 \uC9C0\uB8E8\uD558\uB2E4.",
          rows: [
            ["\uC9C0\uB8E8\uD568\uC744 \uB290\uB07C\uB294"],
            ["I am bored.", "\uB098\uB294 \uC9C0\uB8E8\uD558\uB2E4."],
          ],
        },
        {
          title: "\uC8FC\uC5B4\uAC00 \uC0AC\uB78C\uC774\uC5B4\uB3C4 \uB0A8\uC744 \uC9DC\uC99D\uB098\uAC8C \uB9CC\uB4DC\uB294 \uC0AC\uB78C\uC774\uBA74 annoying\uC774 \uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "You are annoying. = \uB108\uB294 \uC9DC\uC99D\uB098\uAC8C \uD574.",
          rows: [
            ["You are annoying."],
            ["\uB108\uB294 \uC9DC\uC99D\uB098\uAC8C \uD574."],
          ],
        },
        {
          title: "\uC774\uC81C \uBB38\uB9E5\uC744 \uBCF4\uACE0 \uC8FC\uC5B4\uAC00 \uAC10\uC815\uC758 \uC6D0\uC778\uC778\uC9C0, \uAC10\uC815\uC744 \uB290\uB07C\uB294 \uB300\uC0C1\uC778\uC9C0 \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "6-5": {
      title: "\uC804\uCE58\uC0AC2",
      maxSteps: 3,
      steps: [
        {
          title: "\uC5B4\uB5A4 \uC804\uCE58\uC0AC\uB294 \uD55C\uAD6D\uC5B4\uB85C \uB9D0\uC774 \uC548\uB429\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildPrepositionAwkwardHtml(),
        },
        {
          title: "\uADF8\uB7F4 \uB550, \uC9DD\uAFCD\uACFC \uD568\uAED8 \uC678\uC6CC\uC8FC\uB294 \uAC8C \uC88B\uC544\uC694.",
          body: "",
          exampleHtml: buildPrepositionPairsHtml(),
        },
        {
          title: "\uC5B5\uC6B8\uD558\uC9C0\uB9CC, \uB418\uB3C4\uB85D \uB9CE\uC774 \uC678\uC6CC\uC90D\uC2DC\uB2E4.",
          body: "",
          exampleHtml: buildPrepositionMemorizeHtml(),
        },
      ],
    },
    "7-1": {
      title: "S-V-T-D : \uD558\uB098\uB85C \uB05D.",
      steps: [
        {
          title: "\uc8fc\uc5b4-\ub3d9\uc0ac \ub4a4\uc5d4 \ubb50\uac00 \uc62c\uae4c\uc694?",
          titleHtml: buildSvtdStackedTitleHtml(1, [
            { text: "\uc8fc\uc5b4", role: "subject" },
            "-",
            { text: "\ub3d9\uc0ac", role: "verb" },
            " \ub4a4\uc5d4 \ubb50\uac00 \uc62c\uae4c\uc694?",
          ]),
          body: "",
          rows: [
            [
              { label: "S", caption: "\ub204\uac00", role: "subject" },
              { label: "\u2192", role: "arrow" },
              { label: "V", caption: "\ud588\ub2e4", role: "verb" },
              { label: "\u2192", role: "arrow" },
              { label: "?", caption: "\ub2e4\uc74c\uc740?", role: "pending" },
            ],
          ],
        },
        {
          title: "'\ub204\uad6c\ud55c\ud14c \ud588\uac8c\uc694?' \ubd80\ud130 \uc368\uc90d\ub2c8\ub2e4. \ubaa9\ud45c \uc870\uc900!",
          titleHtml: buildSvtdStackedTitleHtml(2, [
            "'",
            { text: "\ub204\uad6c\ud55c\ud14c \ud588\uac8c\uc694?", role: "target" },
            "' \ubd80\ud130 \uc368\uc90d\ub2c8\ub2e4. ",
            { text: "\ubaa9\ud45c \uc870\uc900!", role: "target" },
          ]),
          body: "",
          exampleHtml: buildSvtdTargetingHtml(),
        },
        {
          title: "'\uc5b4\ub5bb\uac8c \ud588\ub294 \uc9c0' \ub4a4\uc5d0 \uc124\uba85\ud569\ub2c8\ub2e4. \ucd94\uac00 \uc124\uba85!",
          titleHtml: buildSvtdStackedTitleHtml(3, [
            "'",
            { text: "\uc5b4\ub5bb\uac8c \ud588\ub294 \uc9c0", role: "detail" },
            "' \ub4a4\uc5d0 \uc124\uba85\ud569\ub2c8\ub2e4. ",
            { text: "\ucd94\uac00 \uc124\uba85!", role: "detail" },
          ]),
          body: "",
          rows: [
            [
              { label: "S", caption: "\ub204\uac00", role: "subject" },
              { label: "\u2192", role: "arrow" },
              { label: "V", caption: "\ud588\ub2e4", role: "verb" },
              { label: "\u2192", role: "arrow" },
              { label: "T", caption: "\ub204\uad6c\ud55c\ud14c", role: "target" },
              { label: "\u2192", role: "arrow" },
              { label: "D", caption: "\uc5b4\ub5bb\uac8c", role: "detail" },
            ],
          ],
        },
        {
          title: "S(\ub204\uac00) - V(\ud588\ub2e4) - T(\ub204\uad6c\ud55c\ud14c) - D(\uc5b4\ub5bb\uac8c)\uc758 \uc21c\uc11c\uc5d0 \uc775\uc219\ud574\uc838\ubcf4\uc138\uc694!",
          titleHtml: buildSvtdStackedTitleHtml(4, [
            { text: "S(\ub204\uac00)", role: "subject" },
            " - ",
            { text: "V(\ud588\ub2e4)", role: "verb" },
            " - ",
            { text: "T(\ub204\uad6c\ud55c\ud14c)", role: "target" },
            " - ",
            { text: "D(\uc5b4\ub5bb\uac8c)", role: "detail" },
            "\uc758 \uc21c\uc11c\uc5d0 \uc775\uc219\ud574\uc838\ubcf4\uc138\uc694!",
          ]),
          body: "",
          exampleHtml: buildSvtdFlipSentenceHtml(),
        },
      ],
    },
    "7-2": {
      title: "S-V-T-D : \uD558\uB098\uB85C \uB05D.",
      steps: [
        {
          title: "\uC774\uBC88\uC5D0\uB294 \uC774\uBBF8 \uC644\uC131\uB41C \uC601\uC5B4 \uBB38\uC7A5\uC744 \uB124 \uCE78\uC73C\uB85C \uB72F\uC5B4\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "\uBA3C\uC800 S, \uC989 \uBB38\uC7A5\uC758 \uC8FC\uC778\uACF5\uC744 \uCC3E\uC2B5\uB2C8\uB2E4.",
          body: "She cleaned the room.\uC5D0\uC11C She",
          rows: [
            ["She"],
            ["cleaned the"],
            ["room"],
            ["She"],
          ],
        },
        {
          title: "\uADF8\uB2E4\uC74C V, \uC989 \uD589\uB3D9\uC744 \uCC3E\uC2B5\uB2C8\uB2E4.",
          body: "cleaned",
          rows: [
            ["cleaned"],
          ],
        },
        {
          title: "\uADF8 \uD589\uB3D9\uC744 \uBC1B\uB294 \uB300\uC0C1\uC774 \uC788\uC73C\uBA74 T\uC785\uB2C8\uB2E4.",
          body: "the room",
          rows: [
            ["the room"],
          ],
        },
        {
          title: "\uB0A8\uC740 \uC2DC\uAC04, \uC7A5\uC18C, \uBC29\uBC95 \uC815\uBCF4\uAC00 \uC788\uC73C\uBA74 D\uC5D0 \uB123\uC2B5\uB2C8\uB2E4.",
          body: "\uC5C6\uC73C\uBA74 \uBE44\uC6CC\uB461\uB2C8\uB2E4.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "7-3": {
      title: "that",
      maxSteps: 4,
      steps: [
        {
          title: "\uC601\uC5B4\uC5D0\uB294 \uC740, \uB294, \uC774, \uAC00, \uC744, \uB97C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildThatNoParticlesHtml(),
        },
        {
          title: "\uC815 \uB2F5\uB2F5\uD560 \uACBD\uC6B0 '\uADFC\uB370 \uADF8\uAC8C \uBB50\uB0D0\uBA74..' \uB9CC \uC501\uB2C8\uB2E4.",
          body: "",
          exampleHtml: buildThatBridgeOnlyHtml(),
        },
        {
          title: "\uC6B0\uB9B0 \uC774\uAC78 that\uC774\uB77C\uACE0 \uBD80\uB985\uB2C8\uB2E4.",
          titleHtml: buildThatTitleHtml("\uC6B0\uB9B0 \uC774\uAC78 ", "\uC774\uB77C\uACE0 \uBD80\uB985\uB2C8\uB2E4."),
          body: "",
          exampleHtml: buildThatNameHtml(),
        },
        {
          title: "that\uC744 \uB123\uACE0 \uBE7C\uBCF4\uC138\uC694!",
          titleHtml: buildThatTitleHtml("", "\uC744 \uB123\uACE0 \uBE7C\uBCF4\uC138\uC694!"),
          body: "",
          exampleHtml: buildThatToggleHtml(),
        },
      ],
    },
    "7-4": {
      title: "\uAD00\uACC4\uC0AC",
      steps: [
        {
          title: "\uAD00\uACC4\uC0AC\uB294 \uC55E\uC758 \uBA85\uC0AC\uB97C \uB4A4\uC5D0\uC11C \uC124\uBA85\uD558\uAC8C \uD574\uC8FC\uB294 \uB9D0\uC785\uB2C8\uB2E4.",
          body: "\uC608: \u201C\uCD95\uAD6C\uD558\uB294 \uC18C\uB144\u201D",
          rows: [
            ["\u201C\uCD95\uAD6C\uD558\uB294 \uC18C\uB144\u201D"],
          ],
        },
        {
          title: "\uC601\uC5B4\uB294 \uC774\uB807\uAC8C \uB9D0\uD569\uB2C8\uB2E4.",
          body: "the boy who is playing soccer",
          rows: [
            ["is"],
          ],
        },
        {
          title: "\uC0AC\uB78C\uC744 \uC124\uBA85\uD558\uBA74 \uBCF4\uD1B5 who, \uBB3C\uAC74\uC774\uB098 \uB3D9\uBB3C\uC744 \uC124\uBA85\uD558\uBA74 which \uB610\uB294 that\uC744 \uC501\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["who"],
            ["which"],
          ],
        },
        {
          title: "\uC7A5\uC18C\uB97C \uC124\uBA85\uD558\uBA74 where, \uC2DC\uAC04\uC744 \uC124\uBA85\uD558\uBA74 when\uC744 \uC4F8 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["where"],
          ],
        },
        {
          title: "\uC774\uC81C \uC55E\uC758 \uBA85\uC0AC\uAC00 \uC0AC\uB78C\uC778\uC9C0, \uBB3C\uAC74\uC778\uC9C0, \uC7A5\uC18C\uC778\uC9C0 \uBCF4\uACE0 \uC54C\uB9DE\uC740 \uAD00\uACC4\uC0AC\uB97C \uB123\uC5B4\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "7-5": {
      title: "\uAD00\uACC4\uC0AC",
      steps: [
        {
          title: "\uAD00\uACC4\uC0AC\uB294 \uB450 \uBB38\uC7A5\uC744 \uD558\uB098\uB85C \uD569\uCE60 \uB54C\uB3C4 \uC501\uB2C8\uB2E4.",
          body: "He knows a place. You can relax there.",
          rows: [
            ["can"],
          ],
        },
        {
          title: "\uB450 \uBB38\uC7A5\uC5D0\uC11C \uAC19\uC740 \uB300\uC0C1\uC744 \uCC3E\uC2B5\uB2C8\uB2E4.",
          body: "\uC5EC\uAE30\uC11C\uB294 a place\uC640 there\uAC00 \uC5F0\uACB0\uB429\uB2C8\uB2E4.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "\uC7A5\uC18C\uB97C \uC124\uBA85\uD558\uB2C8\uAE4C where\uB97C \uC501\uB2C8\uB2E4.",
          body: "He knows a place where you can relax.",
          rows: [
            ["can"],
          ],
        },
        {
          title: "\uC774\uC720\uB97C \uC124\uBA85\uD558\uBA74 why, \uC18C\uC720\uB97C \uC124\uBA85\uD558\uBA74 whose, \uC0AC\uB78C\uC744 \uBAA9\uC801\uC5B4\uB85C \uBC1B\uC73C\uBA74 whom/who\uB3C4 \uC4F8 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["why"],
            ["whose"],
            ["whom"],
          ],
        },
        {
          title: "\uC774\uC81C \uB450 \uBB38\uC7A5\uC5D0\uC11C \uACB9\uCE58\uB294 \uB300\uC0C1\uC744 \uCC3E\uACE0, \uADF8 \uB300\uC0C1\uC5D0 \uB9DE\uB294 \uAD00\uACC4\uC0AC\uB85C \uC774\uC5B4\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "8-1": {
      title: "\uAC00\uC815\uBC95 \uACFC\uAC70\uC644\uB8CC",
      steps: [
        {
          title: "\uAC00\uC815\uBC95 \uACFC\uAC70\uC644\uB8CC\uB294 \u201C\uACFC\uAC70\uC5D0 \uC2E4\uC81C\uB85C\uB294 \uC548 \uD588\uB294\uB370, \uD588\uB354\uB77C\uBA74\u2026\u201D\uC744 \uB9D0\uD560 \uB54C \uC501\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uACFC\uAC70\uC5D0 \uC2E4\uC81C\uB85C\uB294 \uC548 \uD588\uB294\uB370, \uD588\uB354\uB77C\uBA74\u2026"],
          ],
        },
        {
          title: "\uAE30\uBCF8 \uB290\uB08C\uC740 \uD6C4\uD68C\uB098 \uC0C1\uC0C1\uC785\uB2C8\uB2E4.",
          body: "\u201C\uB0B4\uAC00 \uB354 \uC5F4\uC2EC\uD788 \uACF5\uBD80\uD588\uB354\uB77C\uBA74, \uD569\uACA9\uD588\uC744 \uD150\uB370.\u201D",
          rows: [
            ["\uB0B4\uAC00 \uB354 \uC5F4\uC2EC\uD788 \uACF5\uBD80\uD588\uB354\uB77C\uBA74, \uD569\uACA9\uD588\uC744 \uD150\uB370."],
          ],
        },
        {
          title: "\uC870\uAC74 \uCABD\uC740 If + had + \uC138 \uBC88\uC9F8 \uB3D9\uC0AC\uBAA8\uC591\uC744 \uC501\uB2C8\uB2E4.",
          body: "If I had studied harder",
          rows: [
            ["If", "had"],
            ["If", "had studied", "harder"],
          ],
        },
        {
          title: "\uACB0\uACFC \uCABD\uC740 would have + \uC138 \uBC88\uC9F8 \uB3D9\uC0AC\uBAA8\uC591\uC744 \uC501\uB2C8\uB2E4.",
          body: "I would have passed",
          rows: [
            ["would"],
            ["would"],
          ],
        },
        {
          title: "\uC774\uC81C \u201C\uACFC\uAC70\uC5D0 \uBABB \uD55C \uC77C\u201D\uACFC \u201C\uB2EC\uB77C\uC84C\uC744 \uACB0\uACFC\u201D\uB97C \uC5F0\uACB0\uD574\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uACFC\uAC70\uC5D0 \uBABB \uD55C \uC77C"],
            ["\uB2EC\uB77C\uC84C\uC744 \uACB0\uACFC"],
          ],
        },
      ],
    },
    "8-2": {
      title: "\uB3C4\uCE58, \uAC15\uC870, \uBD84\uC0AC\uAD6C\uBB38",
      steps: [
        {
          title: "\uC601\uC5B4\uB294 \uBCF4\uD1B5 \uC8FC\uC5B4 + \uB3D9\uC0AC \uC21C\uC11C\uC785\uB2C8\uB2E4.",
          body: "\uADF8\uB7F0\uB370 \uAC15\uC870\uD558\uB824\uACE0 \uC21C\uC11C\uAC00 \uBC14\uB00C\uB294 \uACBD\uC6B0\uAC00 \uC788\uC2B5\uB2C8\uB2E4.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "Never, Hardly, Only after \uAC19\uC740 \uB9D0\uC774 \uC55E\uC5D0 \uC624\uBA74 \uB4A4\uC758 \uC21C\uC11C\uAC00 \uD754\uB4E4\uB9B4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "Never have I seen...",
          rows: [
            ["Never", "Hardly", "Only", "after"],
            ["Never", "have", "seen"],
          ],
        },
        {
          title: "\uC774\uB7F0 \uBB38\uC7A5\uC744 \uBCFC \uB54C\uB294 \uB180\uB77C\uC9C0 \uB9D0\uACE0 \uC9C4\uC9DC \uC8FC\uC5B4\uC640 \uC9C4\uC9DC \uB3D9\uC0AC\uB97C \uB2E4\uC2DC \uCC3E\uC2B5\uB2C8\uB2E4.",
          body: "I have seen\uC774 \uC6D0\uB798 \uBF08\uB300\uC785\uB2C8\uB2E4.",
          rows: [
            ["have"],
          ],
        },
        {
          title: "\uBD84\uC0AC\uAD6C\uBB38\uC740 \uBB38\uC7A5\uC744 \uC9E7\uAC8C \uC904\uC778 \uD45C\uD604\uC785\uB2C8\uB2E4.",
          body: "Walking down the street, I saw him. = \uAE38\uC744 \uAC77\uB2E4\uAC00, \uB098\uB294 \uADF8\uB97C \uBCF4\uC558\uB2E4.",
          rows: [
            ["Walking down the street, I saw him."],
            ["\uAE38\uC744 \uAC77\uB2E4\uAC00, \uB098\uB294 \uADF8\uB97C \uBCF4\uC558\uB2E4."],
          ],
        },
        {
          title: "\uC774\uC81C \uD2B9\uC774\uD55C \uC5B4\uC21C\uC774\uB098 \uC904\uC5B4\uB4E0 \uD45C\uD604\uC774 \uB098\uC640\uB3C4 \uC911\uC2EC \uBB38\uC7A5\uC744 \uCC3E\uC544\uBD05\uB2C8\uB2E4.",
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
      title: "\uB300\uBA85\uC0AC it / that / one",
      steps: [
        {
          title: "\uB300\uBA85\uC0AC\uB294 \uC55E\uC5D0 \uB098\uC628 \uB9D0\uC744 \uB2E4\uC2DC \uAC00\uB9AC\uD0A4\uB294 \uB9D0\uC785\uB2C8\uB2E4.",
          body: "\uD558\uC9C0\uB9CC it, that, one\uC740 \uC4F0\uC784\uC774 \uB2E4\uB985\uB2C8\uB2E4.",
          rows: [
            ["it"],
            ["that"],
          ],
        },
        {
          title: "it\uC740 \uB0A0\uC528, \uC2DC\uAC04, \uC0C1\uD669, \uC55E\uC758 \uB300\uC0C1\uC744 \uBC1B\uC744 \uB54C \uC790\uC8FC \uC501\uB2C8\uB2E4.",
          body: "It is raining. = \uBE44\uAC00 \uC628\uB2E4.",
          rows: [
            ["It is raining."],
            ["\uBE44\uAC00 \uC628\uB2E4."],
          ],
        },
        {
          title: "that\uC740 \uC55E\uC5D0\uC11C \uB9D0\uD55C \uB0B4\uC6A9\uC774\uB098 \uB300\uC0C1\uC744 \uC870\uAE08 \uB5A8\uC5B4\uC838\uC11C \uAC00\uB9AC\uD0A4\uB294 \uB290\uB08C\uC785\uB2C8\uB2E4.",
          body: "That is true. = \uADF8\uAC83\uC740 \uC0AC\uC2E4\uC774\uB2E4.",
          rows: [
            ["That is true."],
            ["\uADF8\uAC83\uC740 \uC0AC\uC2E4\uC774\uB2E4."],
          ],
        },
        {
          title: "one\uC740 \uC55E\uC5D0 \uB098\uC628 \uBA85\uC0AC\uC640 \uAC19\uC740 \uC885\uB958\uC758 \u201C\uD558\uB098\u201D\uB97C \uB300\uC2E0\uD569\uB2C8\uB2E4.",
          body: "I need a pen. Do you have one?",
          rows: [
            ["\uD558\uB098"],
          ],
        },
        {
          title: "\uC774\uC81C \uB300\uBA85\uC0AC\uAC00 \uC815\uD655\uD788 \uBB34\uC5C7\uC744 \uB300\uC2E0\uD558\uB294\uC9C0 \uCC3E\uC544\uBD05\uB2C8\uB2E4.",
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
      title: "\uAC04\uC811\uC758\uBB38\uBB38",
      steps: [
        {
          title: "\uC9C1\uC811 \uC9C8\uBB38\uC740 Where is the restroom?\uCC98\uB7FC \uBB3B\uB294 \uBB38\uC7A5\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["is"],
          ],
        },
        {
          title: "\uAC04\uC811\uC758\uBB38\uBB38\uC740 \uC9C8\uBB38\uC744 \uB2E4\uB978 \uBB38\uC7A5 \uC548\uC5D0 \uB123\uC740 \uAC83\uC785\uB2C8\uB2E4.",
          body: "Can you tell me where the restroom is?",
          rows: [
            ["is"],
          ],
        },
        {
          title: "\uAC04\uC811\uC758\uBB38\uBB38 \uC548\uC5D0\uC11C\uB294 \uBCF4\uD1B5 \uC758\uBB38\uC0AC + \uC8FC\uC5B4 + \uB3D9\uC0AC \uC21C\uC11C\uAC00 \uB429\uB2C8\uB2E4.",
          body: "where + the restroom + is",
          rows: [
            ["is"],
          ],
        },
        {
          title: "\uD55C\uAD6D\uC5B4\uB85C\uB294 \u201C\uD654\uC7A5\uC2E4\uC774 \uC5B4\uB514\uC5D0 \uC788\uB294\uC9C0\u201D\uCC98\uB7FC ~\uC778\uC9C0 / ~\uD558\uB294\uC9C0 \uB290\uB08C\uC774 \uB0A9\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uD654\uC7A5\uC2E4\uC774 \uC5B4\uB514\uC5D0 \uC788\uB294\uC9C0"],
          ],
        },
        {
          title: "\uC774\uC81C \uBB38\uC7A5 \uC548\uC5D0\uC11C \u201C\uC5B4\uB514\uC5D0 \uC788\uB294\uC9C0 / \uC5B8\uC81C \uC2DC\uC791\uD558\uB294\uC9C0 / \uBB34\uC5C7\uC744 \uC6D0\uD558\uB294\uC9C0\u201D \uBD80\uBD84\uC744 \uCC3E\uC544 \uBC11\uC904\uCCD0\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uC5B4\uB514\uC5D0 \uC788\uB294\uC9C0 / \uC5B8\uC81C \uC2DC\uC791\uD558\uB294\uC9C0 / \uBB34\uC5C7\uC744 \uC6D0\uD558\uB294\uC9C0"],
          ],
        },
      ],
    },
    "8-5": {
      title: "To\uBD80\uC815\uC0AC\uC758 \uC6A9\uBC95",
      steps: [
        {
          title: "to + \uB3D9\uC0AC\uB294 \uBB38\uC7A5 \uC548\uC5D0\uC11C \uC5EC\uB7EC \uC5ED\uD560\uC744 \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "\uC608: to swim, to study, to be",
          rows: [
            ["to"],
            ["to swim", "to study", "to be"],
          ],
        },
        {
          title: "\u201C~\uD558\uB294 \uAC83\u201D\uC774\uB77C\uB294 \uB73B\uC774\uBA74 \uBA85\uC0AC\uCC98\uB7FC \uC4F0\uC778 \uAC83\uC785\uB2C8\uB2E4.",
          body: "To swim is fun. = \uC218\uC601\uD558\uB294 \uAC83\uC740 \uC7AC\uBBF8\uC788\uB2E4.",
          rows: [
            ["~\uD558\uB294 \uAC83"],
            ["To swim is fun.", "\uC218\uC601\uD558\uB294 \uAC83\uC740 \uC7AC\uBBF8\uC788\uB2E4."],
          ],
        },
        {
          title: "\uC55E\uC758 \uBA85\uC0AC\uB97C \uC124\uBA85\uD558\uBA74 \uD615\uC6A9\uC0AC\uCC98\uB7FC \uC4F0\uC778 \uAC83\uC785\uB2C8\uB2E4.",
          body: "something to eat = \uBA39\uC744 \uAC83",
          rows: [
            ["something to eat"],
            ["\uBA39\uC744 \uAC83"],
          ],
        },
        {
          title: "\uC774\uC720\uB098 \uBAA9\uC801\uC744 \uB9D0\uD558\uBA74 \uBD80\uC0AC\uCC98\uB7FC \uC4F0\uC778 \uAC83\uC785\uB2C8\uB2E4.",
          body: "I went there to study. = \uACF5\uBD80\uD558\uAE30 \uC704\uD574 \uAC70\uAE30\uC5D0 \uAC14\uB2E4.",
          rows: [
            ["I went there to study."],
            ["\uACF5\uBD80\uD558\uAE30 \uC704\uD574 \uAC70\uAE30\uC5D0 \uAC14\uB2E4."],
          ],
        },
        {
          title: "\uC774\uC81C to + \uB3D9\uC0AC\uAC00 \uBB38\uC7A5\uC5D0\uC11C \u201C\uAC83 / \uD560 / \uD558\uAE30 \uC704\uD574\u201D \uC911 \uC5B4\uB5A4 \uB290\uB08C\uC778\uC9C0 \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uAC83 / \uD560 / \uD558\uAE30 \uC704\uD574"],
          ],
        },
      ],
    },
    "8-6": {
      title: "\uB3D9\uBA85\uC0AC\uC640 To\uBD80\uC815\uC0AC\uC758 \uC758\uBBF8 \uCC28\uC774",
      steps: [
        {
          title: "-ing\uC640 to + \uB3D9\uC0AC\uB294 \uB458 \uB2E4 \u201C~\uD558\uB294 \uAC83\u201D\uCC98\uB7FC \uBCF4\uC77C \uB54C\uAC00 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["~\uD558\uB294 \uAC83"],
          ],
        },
        {
          title: "\uD558\uC9C0\uB9CC \uB290\uB08C\uC774 \uB2E4\uB985\uB2C8\uB2E4.",
          body: "-ing\uB294 \uC774\uBBF8 \uD558\uACE0 \uC788\uAC70\uB098 \uC2E4\uC81C\uB85C \uD55C \uD589\uB3D9\uC5D0 \uAC00\uAE4C\uC6B8 \uB54C\uAC00 \uB9CE\uC2B5\uB2C8\uB2E4.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "to + \uB3D9\uC0AC\uB294 \uC55E\uC73C\uB85C \uD560 \uC77C, \uBAA9\uC801, \uBC29\uD5A5\uC5D0 \uAC00\uAE4C\uC6B8 \uB54C\uAC00 \uB9CE\uC2B5\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["to"],
          ],
        },
        {
          title: "stop smoking\uC740 \u201C\uB2F4\uBC30 \uD53C\uC6B0\uB294 \uAC83\uC744 \uBA48\uCD94\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "stop to smoke\uB294 \u201C\uB2F4\uBC30 \uD53C\uC6B0\uB824\uACE0 \uBA48\uCD94\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          rows: [
            ["\uB2F4\uBC30 \uD53C\uC6B0\uB294 \uAC83\uC744 \uBA48\uCD94\uB2E4"],
            ["\uB2F4\uBC30 \uD53C\uC6B0\uB824\uACE0 \uBA48\uCD94\uB2E4"],
          ],
        },
        {
          title: "\uC774\uC81C -ing\uC778\uC9C0 to + \uB3D9\uC0AC\uC778\uC9C0\uC5D0 \uB530\uB77C \uC758\uBBF8\uAC00 \uC5B4\uB5BB\uAC8C \uB2EC\uB77C\uC9C0\uB294\uC9C0 \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["to"],
          ],
        },
      ],
    },
    "8-7": {
      title: "\uC0AC\uC5ED\uB3D9\uC0AC / \uC9C0\uAC01\uB3D9\uC0AC \uAD6C\uBB38",
      steps: [
        {
          title: "\uC5B4\uB5A4 \uB3D9\uC0AC\uB294 \u201C\uB204\uAC00 \uB204\uAD6C\uC5D0\uAC8C \uBB34\uC5C7\uC744 \uD558\uAC8C \uD588\uB2E4\u201D\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "\uC608: make, let, help",
          rows: [
            ["\uB204\uAC00 \uB204\uAD6C\uC5D0\uAC8C \uBB34\uC5C7\uC744 \uD558\uAC8C \uD588\uB2E4"],
            ["make", "let", "help"],
          ],
        },
        {
          title: "make + \uC0AC\uB78C + \uB3D9\uC0AC \uAE30\uBCF8\uBAA8\uC591\uC740 \u201C\uC0AC\uB78C\uC5D0\uAC8C ~\uD558\uAC8C \uC2DC\uD0A4\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "She made me wash the dishes.",
          rows: [
            ["\uC0AC\uB78C\uC5D0\uAC8C ~\uD558\uAC8C \uC2DC\uD0A4\uB2E4"],
            ["She", "made me", "wash the", "dishes"],
          ],
        },
        {
          title: "\uC5B4\uB5A4 \uB3D9\uC0AC\uB294 \u201C\uB204\uAC00 \uBB34\uC5C7\uC744 \uD558\uB294 \uAC83\uC744 \uBCF4\uC558\uB2E4/\uB4E4\uC5C8\uB2E4\u201D\uB97C \uB9CC\uB4E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "\uC608: see, hear, watch",
          rows: [
            ["\uB204\uAC00 \uBB34\uC5C7\uC744 \uD558\uB294 \uAC83\uC744 \uBCF4\uC558\uB2E4/\uB4E4\uC5C8\uB2E4"],
            ["see", "hear", "watch"],
          ],
        },
        {
          title: "see + \uC0AC\uB78C + \uB3D9\uC0AC \uAE30\uBCF8\uBAA8\uC591\uC740 \uADF8 \uD589\uB3D9\uC744 \uBD24\uB2E4\uB294 \uB73B\uC785\uB2C8\uB2E4.",
          body: "I saw him walk into the building.",
          rows: [
            ["see"],
            ["saw him", "walk into", "the building"],
          ],
        },
        {
          title: "\uC774\uC81C make / let / see / hear / watch \uB4A4\uC5D0 \uB204\uAC00 \uBB34\uC5C7\uC744 \uD558\uB294\uC9C0 \uCC3E\uC544\uBD05\uB2C8\uB2E4.",
          body: "9\uB2E8\uC6D0",
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
      title: "\uC790\uC798\uD55C \uCD08\uB4F1\uBB38\uBC95",
      steps: [
        {
          title: "\uC601\uC5B4\uC5D0\uB294 \uC791\uC9C0\uB9CC \uC790\uC8FC \uD2C0\uB9AC\uB294 \uAE30\uBCF8 \uADDC\uCE59\uB4E4\uC774 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "\uC608: a / an, \uBCF5\uC218\uD615, \uC140 \uC218 \uC788\uB294 \uBA85\uC0AC\uC640 \uC140 \uC218 \uC5C6\uB294 \uBA85\uC0AC",
          rows: [
            ["a / an"],
            ["\uBCF5\uC218\uD615"],
            ["\uC140 \uC218 \uC788\uB294 \uBA85\uC0AC\uC640 \uC140 \uC218 \uC5C6\uB294 \uBA85\uC0AC"],
          ],
        },
        {
          title: "a\uC640 an\uC740 \uAE00\uC790\uAC00 \uC544\uB2C8\uB77C \uC18C\uB9AC\uB85C \uACE0\uB985\uB2C8\uB2E4.",
          body: "\uBAA8\uC74C \uC18C\uB9AC\uB85C \uC2DC\uC791\uD558\uBA74 \uBCF4\uD1B5 an\uC744 \uC501\uB2C8\uB2E4. \uC608: an elephant, an honest man",
          rows: [
            ["an elephant"],
            ["an honest man"],
          ],
        },
        {
          title: "\uBCF5\uC218\uD615\uC740 \uBCF4\uD1B5 s\uB97C \uBD99\uC774\uC9C0\uB9CC, \uBD88\uADDC\uCE59\uB3C4 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "child \u2192 children, goose \u2192 geese",
          rows: [
            ["child"],
            ["\u2192"],
            ["children, goose \u2192 geese"],
          ],
        },
        {
          title: "\uC5B4\uB5A4 \uBA85\uC0AC\uB294 \uD558\uB098, \uB458\uB85C \uC138\uAE30 \uC5B4\uB835\uC2B5\uB2C8\uB2E4.",
          body: "information, advice, water \uAC19\uC740 \uB9D0\uC740 \uC870\uC2EC\uD574\uC57C \uD569\uB2C8\uB2E4.",
          rows: [
            ["information"],
            ["advice"],
            ["water"],
          ],
        },
        {
          title: "\uC774\uC81C \uC791\uC740 \uADDC\uCE59\uB4E4\uC744 \uD558\uB098\uC529 \uD655\uC778\uD558\uBA74\uC11C \uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uD45C\uD604\uC744 \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
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
      return ["border-color:#d5aa00", "background:#fff1a6", "color:#5d4a00"];
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
      return `<span class="lip-example-symbol" style="font-size:13px;line-height:1;">${escapeHtml(label || "\u2192")}</span>`;
    }
    const caption = tokenCaption(cell);
    const captionHtml = caption
      ? `<span style="font-size:9px;line-height:1;font-weight:800;opacity:0.78;">${escapeHtml(caption)}</span>`
      : "";
    return `<span class="lip-example-token${tokenClass(index, cell)}"${tokenStyle(cell)}><span>${escapeHtml(label)}</span>${captionHtml}</span>`;
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
      verb: ["border-color:#f1c18e", "background:#fff", "color:#7e3106"],
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
          ${buildTenseText("\uD3C9\uC18C\uBB38\uC7A5")}
          ${buildTenseSymbol("\u2192")}
          ${buildTenseMarker("\uC9C8\uBB38?")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildTenseText("\uC21C\uC11C\uB97C \uBC14\uAFC0 \uB9D0\uC744 \uCC3E\uC544\uBD05\uC2DC\uB2E4")}
        </div>
      </div>
    `;
  }

  function buildQuestionSwapHtml() {
    return `
      <div class="lip-example-stack">
        ${buildQuestionMoveLine("is", "She", "ready?")}
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildTenseText("\uAC00\uC6B4\uB370 \uB9D0\uC774 \uC55E\uC73C\uB85C \uC0C8\uCE58\uAE30")}
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
          ${buildTenseText("\uC544\uB2C8\uB2E4")}
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
          ${buildTenseText("\uB0B4\uAC00 ")}
          ${buildCompareKoreanMoreMarker()}
          ${buildTenseText(" \uBE68\uB77C!")}
        </div>
      </div>
    `;
  }

  function buildCompareKoreanMoreMarker() {
    return buildCompareYellowMarker("\uB354");
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
          ${buildTenseText("\uB108")}
          ${buildCompareKoreanPostpositionMarker("\uBCF4\uB2E4")}
          ${buildCompareKoreanMoreMarker()}
          ${buildTenseText(" \uBE68\uB77C")}
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
          ${buildTenseText("\uB0B4\uAC00 ")}
          ${buildCompareOrangeMarker("\uAC00\uC7A5")}
          ${buildTenseText(" \uBE68\uB77C!")}
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
          ${buildThereKoMarker("\uC5EC\uAE30")}
          ${buildTherePlain("\uC788\uB2E4!!")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildThereKoMarker("\uC800\uAE30")}
          ${buildTherePlain("\uC788\uB2E4!!")}
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
          ${buildTenseText("\uB9E8 \uC55E\uC5D0 \uC138\uC6CC\uC11C \uC2DC\uC120 \uC9D1\uC911")}
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
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildPronounKoMarker("\uB098\uB294")}
          ${buildPronounKoMarker("\uB098\uB97C")}
          ${buildPronounKoMarker("\uB098\uC758")}
        </div>
      </div>
    `;
  }

  function buildPronounSeparateHtml() {
    return `
      <div class="lip-example-stack">
        ${buildPronounRow("\uB098\uB294", "I")}
        ${buildPronounRow("\uB098\uB97C", "me")}
        ${buildPronounRow("\uB098\uC758", "my")}
        ${buildPronounRow("\uB098\uC758 \uAC83", "mine")}
      </div>
    `;
  }

  function buildPronounMeaningShiftHtml() {
    const items = [
      { word: "I", before: [], after: ["jump"], suffix: "", ko: "\uB098\uB294 \uC810\uD504\uD55C\uB2E4", fromX: "22px" },
      { word: "me", before: ["Tell"], after: [], suffix: ".", ko: "\uB098\uC5D0\uAC8C \uB9D0\uD574\uC918", fromX: "-18px" },
      { word: "my", before: [], after: ["book"], suffix: "", ko: "\uB098\uC758 \uCC45", fromX: "22px" },
      { word: "mine", before: ["This is"], after: [], suffix: ".", ko: "\uC774\uAC83\uC740 \uB098\uC758 \uAC83", fromX: "-24px" },
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
                    ${buildPronounEnMarker("I")}
                  </span>
                  <span style="position:absolute;left:0;right:0;top:58px;display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;">
                    ${item.before.map((text) => buildPronounSentenceText(text)).join("")}
                    <span style="position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:28px;">
                      ${buildPronounFlyingMarker(item.word, item.fromX)}
                      ${item.suffix ? buildPronounSentencePunctuation(item.suffix) : ""}
                    </span>
                    ${item.after.map((text) => buildPronounSentenceText(text)).join("")}
                  </span>
                  <span style="position:absolute;left:0;right:0;top:92px;text-align:center;font-size:12px;line-height:1.25;font-weight:900;color:#5b4c42;">${escapeHtml(item.ko)}</span>
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
      [
        ["I", "\uB098\uB294"],
        ["me", "\uB098\uB97C"],
        ["my", "\uB098\uC758"],
        ["mine", "\uB098\uC758 \uAC83"],
      ],
      [
        ["you", "\uB108\uB294"],
        ["you", "\uB108\uB97C"],
        ["your", "\uB108\uC758"],
        ["yours", "\uB108\uC758 \uAC83"],
      ],
      [
        ["he", "\uADF8\uB294"],
        ["him", "\uADF8\uB97C"],
        ["his", "\uADF8\uC758"],
        ["his", "\uADF8\uC758 \uAC83"],
      ],
      [
        ["she", "\uADF8\uB140\uB294"],
        ["her", "\uADF8\uB140\uB97C"],
        ["her", "\uADF8\uB140\uC758"],
        ["hers", "\uADF8\uB140\uC758 \uAC83"],
      ],
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;gap:5px;">
        ${rows.map((row, index) => `
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;${index ? "border-top:1px solid rgba(126,49,6,0.14);padding-top:5px;" : ""}">
            ${row.map(([en, ko]) => buildPronounMeaningMarker(en, ko)).join("")}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildPronounRow(ko, en) {
    return `
      <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
        ${buildPronounKoMarker(ko)}
        ${buildTenseSymbol("\u2192")}
        ${buildPronounEnMarker(en)}
      </div>
    `;
  }

  function buildPronounKoMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:1.36em;padding:0.04em 0.42em;border-radius:7px;background:#fff4bf;color:#111;font-size:13px;line-height:1;font-weight:950;border:1px solid #111;">${escapeHtml(text)}</span>`;
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

  function buildPronounFlyingMarker(word, fromX) {
    return `
      <span style="--pronoun-from-x:${fromX};position:relative;z-index:2;display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:28px;padding:4px 10px;border-radius:999px;background:#fff;border:1px solid #f1c18e;color:#7e3106;font-size:14px;line-height:1;font-weight:950;animation:aisth-pronoun-fly-in 5.6s infinite;animation-delay:var(--lip-delay, 0s);will-change:transform,opacity;">
        <span style="animation:aisth-pronoun-source-label 5.6s infinite;animation-delay:var(--lip-delay, 0s);">${escapeHtml("I")}</span>
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
      ["\uBA38\uB9AC", "\uC704"],
      ["\uB098\uBB34", "\uB4A4"],
      ["\uADC0", "\uC606"],
    ];
    return `
      <div class="lip-example-stack">
        ${items.map(([thing, place]) => `
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildPrepositionThing(thing)}
            ${buildPrepositionKoMarker(place)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildPrepositionOrderHtml() {
    const rows = [
      { thing: "\uBA38\uB9AC", place: "\uC704", prep: "on", object: "my head" },
      { thing: "\uB098\uBB34", place: "\uB4A4", prep: "behind", object: "the tree" },
      { thing: "\uADC0", place: "\uC606", prep: "beside", object: "my ear" },
    ];
    return `
      <div class="lip-example-stack">
        ${rows.map((row) => `
          <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
            ${buildPrepositionThing(row.thing)}
            ${buildPrepositionKoMarker(row.place)}
            ${buildTenseSymbol("\u2192")}
            ${buildPrepositionMarker(row.prep)}
            ${buildPrepositionObject(row.object)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildPrepositionAwkwardHtml() {
    const rows = [
      { head: "", prep: "on", tail: "time", literal: "\uC2DC\uAC04 \uC704\uC5D0" },
      { head: "interested", prep: "in", tail: "", literal: "~ \uC548\uC5D0 \uD765\uBBF8\uB97C \uB290\uB07C\uB2E4" },
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
      { head: "interested", prep: "in", meaning: "~\uC5D0 \uD765\uBBF8\uAC00 \uC788\uB294" },
      { head: "famous", prep: "for", meaning: "~\uB85C \uC720\uBA85\uD55C" },
      { head: "good", prep: "at", meaning: "~\uB97C \uC798\uD558\uB294" },
      { head: "afraid", prep: "of", meaning: "~\uB97C \uB450\uB824\uC6CC\uD558\uB294" },
      { head: "different", prep: "from", meaning: "~\uC640 \uB2E4\uB978" },
      { head: "similar", prep: "to", meaning: "~\uC640 \uBE44\uC2B7\uD55C" },
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
          <span style="font-size:12px;line-height:1;font-weight:950;color:#7e3106;white-space:nowrap;">\uC9DD\uAFCD \uD45C\uD604</span>
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

  function buildPrepositionKoMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:25px;padding:3px 8px;border-radius:7px;background:#e8f6df;color:#1f5b2b;border:1px solid #2f7b3a;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionMarker(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:25px;padding:3px 9px;border-radius:7px;background:#e8f6df;color:#1f5b2b;border:1px solid #2f7b3a;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildPrepositionObject(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:25px;padding:3px 8px;border-radius:999px;background:#fff;border:1px solid #cfc5b8;color:#111;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildIfQuestionHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildIfKoMarker("\uB9CC\uC57D\uC5D0..")}
          ${buildTenseText("\uBE44\uAC00 \uC624\uBA74?")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
          ${buildIfKoMarker("\uB9CC\uC57D\uC5D0..")}
          ${buildTenseText("\uB124\uAC00 \uD53C\uACE4\uD558\uBA74?")}
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
          ${buildIfKoMarker("\uB124\uAC00 \uD53C\uACE4\uD558\uB2E4\uBA74")}
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
          ${buildIrregularNameMarker("\uBD88\uADDC\uCE59 \uB3D9\uC0AC")}
        </div>
        <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
          ${buildIrregularGuideText("(\uAE30\uBCF8 - \uACFC\uAC70 - \uACFC\uAC70\uBD84\uC0AC(P.P)\uB85C \uC678\uC6CC\uC8FC\uBA74 \uC88B\uC544\uC694!)")}
        </div>
        ${buildIrregularThreeColumnRow(["\uAE30\uBCF8", "\uACFC\uAC70", "P.P"], "header")}
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
        ${buildIrregularThreeColumnRow(["\uAE30\uBCF8", "\uACFC\uAC70", "P.P"], "header")}
        ${rows.map((row) => buildIrregularThreeColumnRow(row)).join("")}
      </div>
    `;
  }

  function buildIrregularPairRow(base, past, fromWrong) {
    return `
      <div class="lip-example-row" style="justify-content:center;gap:7px;margin-bottom:0;">
        ${fromWrong ? buildIrregularWrongChip(base) : buildIrregularVerbChip(base)}
        ${buildTenseSymbol("\u2192")}
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
        ${buildTenseSymbol("\u2192")}
        ${buildIrregularRegularChip(past)}
      </span>
    `;
  }

  function buildIrregularCrossPair(base, wrong) {
    return `
      <span style="position:relative;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:7px 10px;">
        ${buildIrregularVerbChip(base)}
        ${buildTenseSymbol("\u2192")}
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
    const items = ["\uD574\uBC84\uB838\uC796\uC544!", "\uD574\uC654\uC5B4.", "\uC9C0\uAE08 \uB9C9 \uB05D\uB0AC\uB2E4\uAD6C!"];
    return `
      <div class="lip-example-stack">
        ${items.map((item) => `
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildPerfectKoMarker(item)}
          </div>
        `).join("")}
      </div>
    `;
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
      ["I", "have", "", "finished", "", "\uD574\uBC84\uB838\uC796\uC544!"],
      ["I", "have", "", "lived", "here", "\uD574\uC654\uC5B4."],
      ["I", "have", "just", "finished", "", "\uC9C0\uAE08 \uB9C9 \uB05D\uB0AC\uB2E4\uAD6C!"],
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
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:28px;padding:4px 10px;border-radius:8px;background:#eaf7f3;color:#155348;border:1px solid #2c7d70;font-size:13px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
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
      ["\uADF8\uB9AC\uACE0", "\uB514\uC800\uD2B8\uB3C4 \uBA39\uC5C8\uC5B4"],
      ["\uADF8\uB7EC\uB098", "\uC6B4\uB3D9\uC740 \uD558\uC9C0 \uC54A\uC558\uC5B4"],
    ];
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildTenseText("\uB098 \uC810\uC2EC \uBA39\uC5C8\uC5B4")}
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
            ${buildConjunctionPlainWord(connector)}
            ${buildTenseText(sentence)}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildConjunctionListHtml() {
    const rows = [
      ["and", "\uADF8\uB9AC\uACE0"],
      ["but", "\uADF8\uB7EC\uB098"],
      ["or", "\uB610\uB294"],
      ["so", "\uADF8\uB798\uC11C"],
      ["because", "\uC65C\uB0D0\uD558\uBA74"],
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr;">
        ${rows.map(([word, meaning], index) => `
          <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;padding:6px 0;${index ? "border-top:1px solid rgba(231,193,135,0.7);" : ""}">
            <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
              ${buildConjunctionPlainWord(word)}
              ${buildTenseSymbol("\u2192")}
              ${buildConjunctionPlainMeaning(meaning)}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildConjunctionKoChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:58px;min-height:26px;padding:4px 9px;border-radius:8px;background:#ffe8b8;color:#7e3106;border:1px solid #e7c187;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
  }

  function buildConjunctionEnChip(text) {
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:26px;padding:4px 9px;border-radius:999px;background:#ffe8b8;color:#7e3106;border:1px solid #e7c187;font-size:12px;line-height:1;font-weight:950;white-space:nowrap;">${escapeHtml(text)}</span>`;
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
        { text: "\uD558\uACE0\uC2F6\uC5B4\uC9C8 \uC218", role: "orange" },
        { text: "\uB3C4 \uC788\uB2E4", role: "plain" },
      ],
      [
        { text: "\uC544\uB2D0 \uC218\uB3C4 \uC788\uC744", role: "orange" },
        { text: " \uAC83\uC774\uB2E4", role: "plain" },
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
      ["will", "be able to", "work", "\uD560 \uC218 \uC788\uC744 \uAC83\uC774\uB2E4"],
      ["may", "have to", "leave", "\uD574\uC57C \uD560 \uC218\uB3C4 \uC788\uB2E4"],
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
      ["be able to", "\uD560 \uC218 \uC788\uB2E4"],
      ["be going to", "\uD560 \uAC83\uC774\uB2E4"],
      ["have to", "\uD574\uC57C \uD55C\uB2E4"],
      ["want to", "\uD558\uACE0 \uC2F6\uB2E4"],
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
          ${buildIngKoMarker("\uAC00\uD568")}
        </div>
        ${buildIngEdDivider("ing")}
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildIngEdPlainText("I am")}
          ${buildIngWord("kicking")}
          ${buildIngEdPlainText("now")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildIngMeaningLine("\uB0B4\uAC00 \uB108\uB97C \uCC28\uBC84\uB9B0\uB2E4!!")}
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
          ${buildEdKoMarker("\uB2F9\uD568 / \uB05D\uB0A8")}
        </div>
        ${buildIngEdDivider("ed")}
        <div class="lip-example-row" style="justify-content:center;gap:5px;margin-bottom:0;">
          ${buildIngEdPlainText("the")}
          ${buildEdWord("kicked")}
          ${buildIngEdPlainText("ball")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildEdMeaningLine("\uB0B4\uAC00 \uB108\uC5D0\uAC8C \uCC28\uC600\uB2E4!!")}
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
          ${buildIngMeaningLine("\uAC00\uD558\uB294 \uC0C1\uD0DC")}
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:7px;justify-items:center;min-width:0;">
          <div style="display:grid;grid-template-columns:1fr;gap:2px;justify-items:center;min-width:0;">
            ${buildCuteArrowFan("ed")}
            ${buildEdWord("frozen")}
          </div>
          ${buildEdMeaningLine("\uB2F9\uD558\uB294 \uC0C1\uD0DC")}
        </div>
      </div>
    `;
  }

  function buildIngApplicationStartHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:12px;line-height:1;font-weight:900;color:#7e3106;white-space:nowrap;">6-1 \uB9C8\uC9C0\uB9C9 \uB2E8\uACC4</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:2px;justify-items:center;min-width:0;">
          ${buildCuteArrowFan("ing")}
          ${buildIngWord("heating")}
        </div>
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          ${buildIngMeaningLine("\uAC00\uD558\uB294 \uC0C1\uD0DC")}
        </div>
      </div>
    `;
  }

  function buildIngStateApplyHtml() {
    const rows = [
      { lead: "\uB098\uB294 ", core: "\uC218\uC601\uD558\uB294 \uC0C1\uD0DC", tail: "\uC774\uB2E4" },
      { lead: "", core: "\uC218\uC601\uD558\uB294 \uC0C1\uD0DC", tail: "\uB294 \uC990\uAC81\uB2E4" },
      { lead: "", core: "\uC218\uC601\uD558\uB294 \uC0C1\uD0DC", tail: "\uC758 \uBB3C\uAC1C" },
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
        from: "\uB098\uB294 \uC218\uC601\uD558\uB294 \uC0C1\uD0DC\uC774\uB2E4",
        variants: [
          "\uB098\uB294 \uC218\uC601\uD558\uB294 \uC911\uC774\uB2E4",
          "= \uB098\uB294 \uC218\uC601\uD558\uACE0 \uC788\uB2E4",
        ],
      },
      {
        from: "\uC218\uC601\uD558\uB294 \uC0C1\uD0DC\uB294 \uC990\uAC81\uB2E4",
        to: "\uC218\uC601\uD558\uB294 \uAC83\uC740 \uC990\uAC81\uB2E4",
      },
      {
        from: "\uC218\uC601\uD558\uB294 \uC0C1\uD0DC\uC758 \uBB3C\uAC1C",
        to: "\uC218\uC601\uD558\uB294 \uBB3C\uAC1C",
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
          <span style="font-size:13px;line-height:1;font-weight:950;color:#c7001f;text-shadow:0 0 5px rgba(255,20,58,0.22);white-space:nowrap;">ing \uC2EC\uD654</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:3px;justify-items:center;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:10px;background:#fff7e8;border:2px solid #f17b2a;color:#c25a00;font-size:21px;line-height:1;font-weight:950;box-shadow:0 0 9px rgba(241,123,42,0.24);">!</span>
          <span style="font-size:11px;line-height:1;font-weight:950;color:#7e3106;white-space:nowrap;">\uC8FC\uC758</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:5px;justify-items:center;">
          ${buildEdWord("ed")}
          <span style="font-size:13px;line-height:1;font-weight:950;color:#075fc9;text-shadow:0 0 5px rgba(0,103,255,0.22);white-space:nowrap;">ed \uC2EC\uD654</span>
        </div>
      </div>
    `;
  }

  function buildObjectsAliveHtml() {
    return `
      <div class="lip-example-stack">
        <div class="lip-example-row" style="justify-content:center;margin-bottom:0;">
          <span style="font-size:15px;line-height:1.3;font-weight:950;color:#3c2d22;white-space:nowrap;">\uBB3C\uAC74\uB4E4\uC774 \uC0B4\uC544\uB0AC\uC5B4\uC694</span>
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
            ${buildIngStatePlain("\uC601\uD654\uAC00 \uB098\uB97C")}
            ${buildIngStateCore("\uC9C0\uB8E8\uD558\uAC8C")}
            ${buildIngStatePlain("\uD574\uC694.")}
          </div>
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildTenseSymbol("\u2192")}
            ${buildIngMeaningLine("\uC774 \uC9C0\uB8E8\uD55C \uC601\uD654")}
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:3px;min-width:0;">
          <div class="lip-example-row" style="justify-content:center;gap:4px;margin-bottom:0;">
            ${buildIngStatePlain("\uB098\uB294 \uB4F1\uC0B0\uC5D0\uAC8C")}
            ${buildEdStateCore("\uD53C\uACE4\uD568\uC744 \uB2F9\uD588\uC5B4\uC694.")}
          </div>
          <div class="lip-example-row" style="justify-content:center;gap:6px;margin-bottom:0;">
            ${buildTenseSymbol("\u2192")}
            ${buildEdMeaningLine("\uB098 \uC9C0\uAE08 \uD53C\uACE4\uD574.")}
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
          <span style="font-size:14px;line-height:1.25;font-weight:950;color:#c7001f;text-shadow:0 0 5px rgba(255,20,58,0.22);white-space:nowrap;">\uAC00\uD588\uB098\uC694?</span>
          <span style="font-size:12px;line-height:1.2;font-weight:900;color:#3c2d22;text-align:center;word-break:keep-all;">\uAC10\uC815\uC744 \uC77C\uC73C\uD0A4\uB294 \uCABD</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:5px;justify-items:center;min-width:0;">
          ${buildEdWord("ed")}
          <span style="font-size:14px;line-height:1.25;font-weight:950;color:#075fc9;text-shadow:0 0 5px rgba(0,103,255,0.22);white-space:nowrap;">\uB2F9\uD588\uB098\uC694?</span>
          <span style="font-size:12px;line-height:1.2;font-weight:900;color:#3c2d22;text-align:center;word-break:keep-all;">\uAC10\uC815\uC744 \uB290\uB07C\uB294 \uCABD</span>
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
          animation: aisth-polish-old-erase 4.6s ease-in-out infinite;
        }
        .aisth-polish-new {
          opacity: 0;
          animation: aisth-polish-new-write 4.6s ease-in-out infinite;
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
          animation: aisth-polish-eraser-sweep 4.6s ease-in-out infinite;
          z-index: 3;
        }
        .aisth-polish-variant {
          grid-area: 1 / 1;
          opacity: 0;
          transform: rotateX(90deg);
        }
        .aisth-polish-variant.is-first {
          animation: aisth-polish-variant-first 4.6s ease-in-out infinite;
        }
        .aisth-polish-variant.is-second {
          animation: aisth-polish-variant-second 4.6s ease-in-out infinite;
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
          0%, 28% { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); }
          56% { opacity: 1; clip-path: inset(0 0 0 100%); filter: blur(0.6px); }
          58%, 100% { opacity: 0; clip-path: inset(0 0 0 100%); }
        }
        @keyframes aisth-polish-new-write {
          0%, 57% { opacity: 0; clip-path: inset(0 100% 0 0); }
          64% { opacity: 1; clip-path: inset(0 100% 0 0); }
          88%, 100% { opacity: 1; clip-path: inset(0 0 0 0); }
        }
        @keyframes aisth-polish-eraser-sweep {
          0%, 28% { opacity: 0; left: 0; transform: translateX(-14px) rotate(-7deg); }
          34% { opacity: 1; left: 0; transform: translateX(0) rotate(-7deg); }
          45% { opacity: 1; left: calc(55% - 7px); transform: rotate(7deg); }
          56% { opacity: 1; left: calc(100% - 14px); transform: rotate(7deg); }
          64%, 100% { opacity: 0; left: calc(100% - 14px); transform: rotate(7deg); }
        }
        @keyframes aisth-polish-variant-first {
          0%, 62% { opacity: 0; transform: rotateX(90deg); }
          66%, 86% { opacity: 1; transform: rotateX(0deg); }
          91%, 100% { opacity: 0; transform: rotateX(-90deg); }
        }
        @keyframes aisth-polish-variant-second {
          0%, 89% { opacity: 0; transform: rotateX(90deg); }
          95%, 100% { opacity: 1; transform: rotateX(0deg); }
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
    const target = "\uC218\uC601\uD558\uB294 \uC0C1\uD0DC";
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
        ${items.map((text, index) => `<span class="aisth-polish-variant ${index === 0 ? "is-first" : "is-second"}">${buildIngPolishedLine(text, false)}</span>`).join("")}
      </span>
    `;
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
      { lead: "\uB098 \uC774\uAC70 ", mark: "\uD558\uACE0 \uC2F6\uB2E4!!", tail: "" },
      { lead: "\uC774\uAC74 \uAF2D ", mark: "\uD574\uC57C \uD55C\uB2E4", tail: "" },
      { lead: "\uC624\uB298\uC740 ", mark: "\uC548 \uD55C\uB2E4", tail: "" },
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
      ["can", ["swim", "run", "help"], "\uD560 \uC218 \uC788\uB2E4", "can"],
      ["may", ["leave", "use", "ask"], "\uD574\uB3C4 \uB41C\uB2E4", "may"],
      ["should", ["study", "sleep", "listen"], "\uD558\uB294 \uAC8C \uC88B\uB2E4", "should"],
      ["must", ["finish", "stop", "wait"], "\uBC18\uB4DC\uC2DC \uD574\uC57C \uD55C\uB2E4", "must"],
      ["will", ["go", "come", "start"], "\uD560 \uAC83\uC774\uB2E4", "future"],
      ["don't", ["run", "touch", "worry"], "\uC548 \uD55C\uB2E4", "negative"],
    ];
    return buildModalListHtml(rows);
  }

  function buildModalPhraseListHtml() {
    const rows = [
      ["want to", ["eat", "play", "learn"], "\uD558\uACE0 \uC2F6\uB2E4", "want"],
      ["need to", ["sleep", "practice", "check"], "\uD560 \uD544\uC694\uAC00 \uC788\uB2E4", "need"],
      ["have to", ["study", "clean", "leave"], "\uD574\uC57C \uD55C\uB2E4", "must"],
    ];
    return buildModalListHtml(rows);
  }

  function buildModalPracticeHtml() {
    const rows = [
      ["can", "swim", "\uC218\uC601\uD560 \uC218 \uC788\uB2E4", "can"],
      ["must", "study", "\uACF5\uBD80\uD574\uC57C \uD55C\uB2E4", "must"],
      ["will", "go", "\uAC08 \uAC83\uC774\uB2E4", "future"],
      ["want to", "eat", "\uBA39\uACE0 \uC2F6\uB2E4", "want"],
      ["don't", "run", "\uB2EC\uB9AC\uC9C0 \uC54A\uB294\uB2E4", "negative"],
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

  function buildSvtdTargetingHtml() {
    const flow = [
      { label: "S", caption: "\ub204\uac00", role: "subject" },
      { label: "\u2192", role: "arrow" },
      { label: "V", caption: "\ud588\ub2e4", role: "verb" },
    ].map((cell, index) => buildTokenHtml(cell, index)).join("");

    return `
      <div style="display:grid;grid-template-columns:minmax(0,1fr) 14px 58px;gap:5px;align-items:center;">
        <div class="lip-example-row" style="gap:5px;margin-bottom:0;">${flow}</div>
        <span class="lip-example-symbol" style="font-size:16px;line-height:1;color:#dc3f3f;">\u2192</span>
        <div style="position:relative;width:58px;height:58px;border:2px solid #dc3f3f;border-radius:50%;background:radial-gradient(circle,#dc3f3f 0 10%,#fff 11% 25%,#ffe1e1 26% 43%,#fff 44% 58%,#ffe1e1 59% 100%);box-shadow:0 6px 12px rgba(220,63,63,0.16);">
          <span style="position:absolute;left:50%;top:5px;bottom:5px;border-left:2px solid rgba(169,31,31,0.55);transform:translateX(-50%);"></span>
          <span style="position:absolute;left:5px;right:5px;top:50%;border-top:2px solid rgba(169,31,31,0.55);transform:translateY(-50%);"></span>
          <span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#dc3f3f;color:#fff;font-size:13px;font-weight:900;">T</span>
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
    return `<div class="lip-morph-chip" style="${styles.join(";")}">${fromHtml}${toHtml}</div>`;
  }

  function buildSvtdFlipSentenceHtml() {
    return `
      <div class="lip-example-stack">
        <div style="font-size:13px;line-height:1.35;font-weight:900;color:#3c2d22;">I made Mina happy.</div>
        <div class="lip-morph-grid" style="gap:5px;">
          ${buildSvtdFlipChip("S", "\ub204\uac00", "I", "subject", 0)}
          ${buildSvtdFlipChip("V", "\ud588\ub2e4", "made", "verb", 0.22)}
          ${buildSvtdFlipChip("T", "\ub204\uad6c\ud55c\ud14c", "Mina", "target", 0.44)}
          ${buildSvtdFlipChip("D", "\uc5b4\ub5bb\uac8c", "happy", "detail", 0.66)}
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
        { text: "\uB294", role: "bad" },
        { text: "you", role: "en" },
        { text: "\uC5D0\uAC8C", role: "bad" },
        { text: "\uC2E4\uB9DD\uD588\uB2E4", role: "ko" },
        { text: "X", role: "x" },
      ],
      [
        { text: "you", role: "en" },
        { text: "\uC640", role: "bad" },
        { text: "you", role: "en" },
        { text: "\uC758", role: "bad" },
        { text: "puppy", role: "en" },
        { text: "\uB294", role: "bad" },
        { text: "very happy", role: "en" },
        { text: "\uD558\uAC8C", role: "bad" },
        { text: "\uBCF4\uC778\uB2E4", role: "ko" },
        { text: "X", role: "x" },
      ],
    ];
    return `
      <div class="lip-example-stack" style="gap:8px;">
        ${rows.map((parts) => `
          <div style="display:flex;align-items:baseline;justify-content:center;flex-wrap:wrap;gap:3px 4px;min-width:0;">
            ${parts.map(buildThatWrongPart).join("")}
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildThatBridgeOnlyHtml() {
    const chunks = [
      "\u0049 \uC6D0\uD55C\uB2E4",
      "\uB9C8\uB77C\uD0D5",
      "\uB9DB\uC788\uB294 \uAC70",
      "\uB0B4\uAC00 \uC5B4\uC81C \uCC3E\uC544\uB193\uC740 \uB9DB\uC9D1\uC758",
    ];
    return `
      <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:5px 6px;min-width:0;">
        ${chunks.map((chunk, index) => `
          ${buildThatBridgeChunk(chunk)}
          ${index < chunks.length - 1 ? buildThatBridgePhrase("\uADFC\uB370 \uADF8\uAC8C \uBB50\uB0D0\uBA74..") : ""}
        `).join("")}
      </div>
    `;
  }

  function buildThatNameHtml() {
    return `
      <div class="lip-example-stack" style="gap:8px;">
        <div class="lip-example-row" style="justify-content:center;gap:8px;margin-bottom:0;">
          ${buildThatBridgePhrase("\uADFC\uB370 \uADF8\uAC8C \uBB50\uB0D0\uBA74..")}
          ${buildTenseSymbol("\u2192")}
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
    if (part.role === "bad") {
      return `<span style="display:inline-block;font-size:13px;line-height:1.2;font-weight:950;color:#c52525;border-bottom:2px solid rgba(197,37,37,0.42);text-shadow:0 0 5px rgba(197,37,37,0.18);">${text}</span>`;
    }
    if (part.role === "x") {
      return `<span style="display:inline-flex;align-items:center;justify-content:center;font-size:18px;line-height:1;font-weight:950;color:#c52525;text-shadow:0 0 6px rgba(197,37,37,0.2);">${text}</span>`;
    }
    const color = part.role === "ko" ? "#6b4a30" : "#111";
    return `<span style="display:inline-block;font-size:13px;line-height:1.2;font-weight:950;color:${color};white-space:nowrap;">${text}</span>`;
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
      nextLabel: "\uB2E4\uC74C",
      primaryLabel: String(options?.startLabel || "\uC2DC\uC791"),
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
