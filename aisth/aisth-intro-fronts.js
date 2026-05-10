(function (global) {
  "use strict";

  const INTRO_MAP = {
    "2-1": {
      title: "\uC2DC\uC81C",
      steps: [
        {
          title: "\uC601\uC5B4 \uB3D9\uC0AC\uB294 \u201C\uC5B8\uC81C \uC77C\uC5B4\uB098\uB294 \uC77C\uC778\uC9C0\u201D\uC5D0 \uB530\uB77C \uBAA8\uC591\uC774 \uBC14\uB01D\uB2C8\uB2E4.",
          body: "\uC9C0\uAE08\uC778\uC9C0, \uC5B4\uC81C\uC778\uC9C0, \uB0B4\uC77C\uC778\uC9C0 \uBD10\uC57C \uD569\uB2C8\uB2E4.",
          rows: [
            ["\uC5B8\uC81C \uC77C\uC5B4\uB098\uB294 \uC77C\uC778\uC9C0"],
          ],
        },
        {
          title: "\uB9E4\uC77C \uD558\uB294 \uC77C\uC740 \uBCF4\uD1B5 \uAE30\uBCF8 \uB3D9\uC0AC\uB97C \uC501\uB2C8\uB2E4.",
          body: "\uC608: I go to school every day.",
          rows: [
            ["I go to school every day"],
          ],
        },
        {
          title: "\uACFC\uAC70 \uC77C\uC740 \uB3D9\uC0AC\uAC00 \uACFC\uAC70 \uBAA8\uC591\uC73C\uB85C \uBC14\uB01D\uB2C8\uB2E4.",
          body: "\uC608: watch \u2192 watched, go \u2192 went",
          rows: [
            ["watch"],
            ["watched, go"],
            ["went"],
          ],
        },
        {
          title: "\uBBF8\uB798\uB294 \uBCF4\uD1B5 will + \uB3D9\uC0AC \uAE30\uBCF8\uBAA8\uC591\uC73C\uB85C \uB9D0\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "\uC608: I will go.",
          rows: [
            ["will"],
            ["I will go"],
          ],
        },
        {
          title: "\uC9C0\uAE08 \uD558\uACE0 \uC788\uB294 \uC911\uC774\uBA74 am/are/is + -ing\uB97C \uC501\uB2C8\uB2E4.",
          body: "\uC608: She is watching TV now.",
          rows: [
            ["am", "are", "is"],
            ["She is watching TV now"],
          ],
        },
      ],
    },
    "2-2": {
      title: "\uC870\uB3D9\uC0AC",
      steps: [
        {
          title: "\uC5B4\uB5A4 \uB9D0\uC744 \uB3D9\uC0AC \uC55E\uC5D0 \uBD99\uC774\uBA74, \uD589\uB3D9\uC5D0 \uD2B9\uBCC4\uD55C \uB290\uB08C\uC774 \uC0DD\uAE41\uB2C8\uB2E4.",
          body: "\uC608: \u201C\uD560 \uC218 \uC788\uB2E4\u201D, \u201C\uD574\uC57C \uD55C\uB2E4\u201D, \u201C\uD558\uACE0 \uC2F6\uB2E4\u201D",
          rows: [
            ["\u201C\uD560 \uC218 \uC788\uB2E4\u201D"],
            ["\u201C\uD574\uC57C \uD55C\uB2E4\u201D"],
            ["\u201C\uD558\uACE0 \uC2F6\uB2E4\u201D"],
          ],
        },
        {
          title: "can\uC740 \u201C\uD560 \uC218 \uC788\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "I can swim. = \uB098\uB294 \uC218\uC601\uD560 \uC218 \uC788\uB2E4.",
          rows: [
            ["\uD560 \uC218 \uC788\uB2E4"],
            ["I can swim.", "\uB098\uB294 \uC218\uC601\uD560 \uC218 \uC788\uB2E4."],
          ],
        },
        {
          title: "must\uB294 \u201C\uBC18\uB4DC\uC2DC \uD574\uC57C \uD55C\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "You must study. = \uB108\uB294 \uACF5\uBD80\uD574\uC57C \uD55C\uB2E4.",
          rows: [
            ["\uBC18\uB4DC\uC2DC \uD574\uC57C \uD55C\uB2E4"],
            ["You must study.", "\uB108\uB294 \uACF5\uBD80\uD574\uC57C \uD55C\uB2E4."],
          ],
        },
        {
          title: "want to\uB294 \u201C~\uD558\uACE0 \uC2F6\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "I want to go. = \uB098\uB294 \uAC00\uACE0 \uC2F6\uB2E4.",
          rows: [
            ["~\uD558\uACE0 \uC2F6\uB2E4"],
            ["I want to go.", "\uB098\uB294 \uAC00\uACE0 \uC2F6\uB2E4."],
          ],
        },
        {
          title: "\uC774\uB7F0 \uB9D0 \uB4A4\uC5D0\uB294 \uBCF4\uD1B5 \uB3D9\uC0AC\uC758 \uAE30\uBCF8\uBAA8\uC591\uC774 \uC635\uB2C8\uB2E4.",
          body: "can swims\uAC00 \uC544\uB2C8\uB77C can swim\uC785\uB2C8\uB2E4.",
          rows: [
            ["can"],
            ["can"],
          ],
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
      steps: [
        {
          title: "\uC601\uC5B4 \uC9C8\uBB38\uC740 \uBCF4\uD1B5 \uBB38\uC7A5 \uC55E\uC5D0 \uC9C8\uBB38\uC6A9 \uB9D0\uC744 \uD558\uB098 \uC138\uC6C1\uB2C8\uB2E4.",
          body: "\uC608: Do, Does, Is, Are, Can, Did, Will",
          rows: [
            ["Do"],
            ["Does"],
            ["Is"],
            ["Are"],
            ["Can"],
            ["Did"],
            ["Will"],
          ],
        },
        {
          title: "\uC0C1\uD0DC \uC9C8\uBB38\uC774\uBA74 am / are / is\uB97C \uC55E\uC73C\uB85C \uBCF4\uB0C5\uB2C8\uB2E4.",
          body: "She is tired. \u2192 Is she tired?",
          rows: [
            ["am", "are"],
            ["She is tired.", "\u2192", "Is she tired?"],
          ],
        },
        {
          title: "\uD589\uB3D9 \uC9C8\uBB38\uC774\uBA74 \uC55E\uC5D0 do\uB098 does\uB97C \uBD99\uC785\uB2C8\uB2E4.",
          body: "You like animals. \u2192 Do you like animals?",
          rows: [
            ["You like animals."],
            ["\u2192"],
            ["Do you like animals?"],
          ],
        },
        {
          title: "\uC8FC\uC5B4\uAC00 he / she / it / \uD55C \uBA85\uC774\uBA74 \uC9C8\uBB38 \uC55E\uC5D0 does\uB97C \uC501\uB2C8\uB2E4.",
          body: "Does she like animals?",
          rows: [
            ["he"],
            ["she"],
            ["it"],
          ],
        },
        {
          title: "\uC774\uC81C \uD55C\uAD6D\uC5B4 \uC9C8\uBB38\uC744 \uBCF4\uACE0 \uC601\uC5B4 \uC9C8\uBB38\uC758 \uCCAB \uB2E8\uC5B4\uB97C \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
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
      steps: [
        {
          title: "\uBD80\uC815\uBB38\uC740 \u201C\uC544\uB2C8\uB2E4 / \uD558\uC9C0 \uC54A\uB294\uB2E4 / \uC5C6\uB2E4\u201D\uB97C \uB9D0\uD558\uB294 \uBB38\uC7A5\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uC544\uB2C8\uB2E4 / \uD558\uC9C0 \uC54A\uB294\uB2E4 / \uC5C6\uB2E4"],
          ],
        },
        {
          title: "am / are / is\uAC00 \uC788\uC73C\uBA74 \uB4A4\uC5D0 not\uC744 \uBD99\uC785\uB2C8\uB2E4.",
          body: "She is happy. \u2192 She is not happy.",
          rows: [
            ["am", "are"],
            ["She is happy.", "\u2192", "She is not happy."],
          ],
        },
        {
          title: "\uD589\uB3D9\uB3D9\uC0AC\uB294 don\u2019t / doesn\u2019t / didn\u2019t\uB97C \uC55E\uC5D0 \uBD99\uC5EC \uBD80\uC815\uD569\uB2C8\uB2E4.",
          body: "I like apples. \u2192 I don\u2019t like apples.",
          rows: [
            ["don", "doesn", "didn"],
            ["I like apples.", "\u2192", "I don\u2019t like apples."],
          ],
        },
        {
          title: "doesn\u2019t / didn\u2019t\uB97C \uC4F0\uBA74 \uB4A4\uC758 \uB3D9\uC0AC\uB294 \uAE30\uBCF8\uBAA8\uC591\uC73C\uB85C \uB3CC\uC544\uAC11\uB2C8\uB2E4.",
          body: "She likes \u2192 She doesn\u2019t like",
          rows: [
            ["doesn", "didn"],
            ["She likes", "\u2192", "She doesn\u2019t like"],
          ],
        },
        {
          title: "\uC774\uC81C \uBB38\uC7A5\uC5D0\uC11C \uBB34\uC5C7\uC744 \uBD80\uC815\uD574\uC57C \uD558\uB294\uC9C0 \uBCF4\uACE0 \uBD80\uC815\uBB38\uC744 \uB9CC\uB4E4\uC5B4\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "3-4": {
      title: "\uBE44\uAD50\uAE09 / \uCD5C\uC0C1\uAE09",
      steps: [
        {
          title: "\uB450 \uAC1C\uB97C \uBE44\uAD50\uD560 \uB54C\uB294 \u201C\uB354 ~\uD55C\u201D\uC774\uB77C\uB294 \uB9D0\uC744 \uC501\uB2C8\uB2E4.",
          body: "\uC601\uC5B4\uC5D0\uC11C\uB294 \uBCF4\uD1B5 -er \uB610\uB294 more\uB97C \uC501\uB2C8\uB2E4.",
          rows: [
            ["\uB354 ~\uD55C"],
            ["er"],
          ],
        },
        {
          title: "than\uC774 \uBCF4\uC774\uBA74 \uBCF4\uD1B5 \uBE44\uAD50\uAE09\uC744 \uC501\uB2C8\uB2E4.",
          body: "lighter than yours = \uB124 \uAC83\uBCF4\uB2E4 \uB354 \uAC00\uBCBC\uC6B4",
          rows: [
            ["lighter than yours"],
            ["\uB124 \uAC83\uBCF4\uB2E4 \uB354 \uAC00\uBCBC\uC6B4"],
          ],
        },
        {
          title: "\uC5EC\uB7EC \uAC1C \uC911\uC5D0\uC11C \u201C\uAC00\uC7A5 ~\uD55C\u201D\uC744 \uB9D0\uD560 \uB54C\uB294 \uCD5C\uC0C1\uAE09\uC744 \uC501\uB2C8\uB2E4.",
          body: "\uBCF4\uD1B5 the -est \uB610\uB294 the most\uB97C \uC501\uB2C8\uB2E4.",
          rows: [
            ["\uAC00\uC7A5 ~\uD55C"],
            ["the", "est", "the"],
          ],
        },
        {
          title: "among all, in the class, of the three\uCC98\uB7FC \uBC94\uC704\uAC00 \uB098\uC624\uBA74 \uCD5C\uC0C1\uAE09\uC77C \uAC00\uB2A5\uC131\uC774 \uD07D\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["among all"],
            ["in the"],
            ["class"],
            ["of the"],
          ],
        },
        {
          title: "\uC774\uC81C \uBB38\uC7A5\uC774 \u201C\uB458 \uBE44\uAD50\u201D\uC778\uC9C0 \u201C\uC804\uCCB4 \uC911 \uCD5C\uACE0\u201D\uC778\uC9C0 \uBCF4\uACE0 \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uB458 \uBE44\uAD50"],
            ["\uC804\uCCB4 \uC911 \uCD5C\uACE0"],
          ],
        },
      ],
    },
    "3-5": {
      title: "There is / Here is",
      steps: [
        {
          title: "There is\uB294 \u201C\uC5B4\uB518\uAC00\uC5D0 ~\uAC00 \uC788\uB2E4\u201D\uB77C\uACE0 \uCC98\uC74C \uC18C\uAC1C\uD560 \uB54C \uC501\uB2C8\uB2E4.",
          body: "There is a cat. = \uACE0\uC591\uC774\uAC00 \uC788\uB2E4.",
          rows: [
            ["\uC5B4\uB518\uAC00\uC5D0 ~\uAC00 \uC788\uB2E4"],
            ["There is a cat.", "\uACE0\uC591\uC774\uAC00 \uC788\uB2E4."],
          ],
        },
        {
          title: "Here is\uB294 \u201C\uC5EC\uAE30\uC5D0 ~\uAC00 \uC788\uB2E4 / \uC5EC\uAE30 ~\uAC00 \uC788\uB2E4\u201D\uCC98\uB7FC \uAC00\uAE4C\uC774 \uBCF4\uC5EC\uC904 \uB54C \uC501\uB2C8\uB2E4.",
          body: "Here is an apple. = \uC5EC\uAE30 \uC0AC\uACFC\uAC00 \uC788\uB2E4.",
          rows: [
            ["\uC5EC\uAE30\uC5D0 ~\uAC00 \uC788\uB2E4 / \uC5EC\uAE30 ~\uAC00 \uC788\uB2E4"],
            ["Here is an apple.", "\uC5EC\uAE30 \uC0AC\uACFC\uAC00 \uC788\uB2E4."],
          ],
        },
        {
          title: "\uD558\uB098\uBA74 There is, \uC5EC\uB7EC \uAC1C\uBA74 There are\uB97C \uC501\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["is"],
          ],
        },
        {
          title: "here\uB294 \uAC00\uAE4C\uC6B4 \uC5EC\uAE30, there\uB294 \uC800\uAE30\uB098 \uC5B4\uB5A4 \uC7A5\uC18C\uB97C \uAC00\uB9AC\uD0A4\uB294 \uB290\uB08C\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "\uC774\uC81C \u201C\uC5EC\uAE30 \uC788\uB2E4\u201D\uC778\uC9C0 \u201C\uC800\uAE30/\uC5B4\uB518\uAC00\uC5D0 \uC788\uB2E4\u201D\uC778\uC9C0 \uBCF4\uACE0 \uC601\uC791\uD574\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uC5EC\uAE30 \uC788\uB2E4"],
            ["\uC800\uAE30/\uC5B4\uB518\uAC00\uC5D0 \uC788\uB2E4"],
          ],
        },
      ],
    },
    "4-1": {
      title: "\uACA9",
      steps: [
        {
          title: "\uC601\uC5B4\uC5D0\uC11C\uB294 \uAC19\uC740 \uC0AC\uB78C\uB3C4 \uBB38\uC7A5 \uC548\uC758 \uC790\uB9AC\uC5D0 \uB530\uB77C \uBAA8\uC591\uC774 \uBC14\uB01D\uB2C8\uB2E4.",
          body: "I, me, my, mine\uC740 \uBAA8\uB450 \u201C\uB098\u201D\uC640 \uAD00\uB828\uB429\uB2C8\uB2E4.",
          rows: [
            ["\uB098"],
          ],
        },
        {
          title: "\uBB38\uC7A5\uC758 \uC8FC\uC778\uACF5\uC774\uBA74 I / he / she / they \uAC19\uC740 \uBAA8\uC591\uC744 \uC501\uB2C8\uB2E4.",
          body: "I like him.",
          rows: [
            ["he", "she", "they"],
            ["like him"],
          ],
        },
        {
          title: "\uD589\uB3D9\uC744 \uBC1B\uB294 \uCABD\uC774\uBA74 me / him / her / them \uAC19\uC740 \uBAA8\uC591\uC744 \uC501\uB2C8\uB2E4.",
          body: "Tom saw them.",
          rows: [
            ["me", "him", "her", "them"],
            ["Tom", "saw them"],
          ],
        },
        {
          title: "\u201C~\uC758\u201D\uB77C\uB294 \uB73B\uC774\uBA74 my / his / her / their\uB97C \uC501\uB2C8\uB2E4.",
          body: "her book = \uADF8\uB140\uC758 \uCC45",
          rows: [
            ["~\uC758"],
            ["her book", "\uADF8\uB140\uC758 \uCC45"],
          ],
        },
        {
          title: "\uC774\uC81C \uAD04\uD638 \uC18D \uB2E8\uC5B4\uAC00 \uBB38\uC7A5\uC5D0\uC11C \uC5B4\uB5A4 \uC790\uB9AC\uC778\uC9C0 \uBCF4\uACE0 \uBAA8\uC591\uC744 \uBC14\uAFD4\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "4-2": {
      title: "\uC804\uCE58\uC0AC1",
      steps: [
        {
          title: "\uC804\uCE58\uC0AC\uB294 \uC704\uCE58\uB97C \uC54C\uB824\uC8FC\uB294 \uC791\uC740 \uB9D0\uC785\uB2C8\uB2E4.",
          body: "\uC608: in, on, under, beside, behind",
          rows: [
            ["in"],
            ["on"],
            ["under"],
            ["beside"],
            ["behind"],
          ],
        },
        {
          title: "in\uC740 \uC548\uC5D0, on\uC740 \uC704\uC5D0, under\uB294 \uC544\uB798\uC5D0\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "beside\uB294 \uC606\uC5D0, behind\uB294 \uB4A4\uC5D0, across\uB294 \uAC74\uB108\uD3B8/\uAC00\uB85C\uC9C8\uB7EC\uC758 \uB290\uB08C\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "\uD55C\uAD6D\uC5B4\uC758 \u201C~\uC5D0\u201D \uD558\uB098\uAC00 \uC601\uC5B4\uC5D0\uC11C\uB294 \uC704\uCE58\uC5D0 \uB530\uB77C \uC5EC\uB7EC \uB9D0\uB85C \uB098\uB269\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["~\uC5D0"],
          ],
        },
        {
          title: "\uC774\uC81C \uADF8\uB9BC\uC744 \uB5A0\uC62C\uB9AC\uBA74\uC11C \uC54C\uB9DE\uC740 \uC704\uCE58 \uB9D0\uC744 \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "4-3": {
      title: "if : \uB9CC\uC57D\uC5D0\u2026",
      steps: [
        {
          title: "if\uB294 \u201C\uB9CC\uC57D ~\uB77C\uBA74\u201D\uC774\uB77C\uB294 \uB73B\uC785\uB2C8\uB2E4.",
          body: "\uB4A4\uC5D0 \uC870\uAC74\uC744 \uBD99\uC785\uB2C8\uB2E4.",
          rows: [
            ["\uB9CC\uC57D ~\uB77C\uBA74"],
          ],
        },
        {
          title: "If you are tired, you should go to bed.",
          body: "= \uB124\uAC00 \uD53C\uACE4\uD558\uB2E4\uBA74, \uC790\uC57C \uD574.",
          rows: [
            ["are"],
            ["should"],
          ],
        },
        {
          title: "if \uB4A4\uC5D0\uB294 \uC791\uC740 \uBB38\uC7A5\uC774 \uD558\uB098 \uB4E4\uC5B4\uAC11\uB2C8\uB2E4.",
          body: "you are tired, you finish your homework",
          rows: [
            ["if"],
            ["are"],
          ],
        },
        {
          title: "\uC870\uAC74\uC744 \uBA3C\uC800 \uB9D0\uD558\uACE0, \uADF8\uB2E4\uC74C \uACB0\uACFC\uB97C \uB9D0\uD569\uB2C8\uB2E4.",
          body: "\u201C\uB9CC\uC57D A\uB77C\uBA74, B\uD574\uB77C / B\uC77C \uAC83\uC774\uB2E4.\u201D",
          rows: [
            ["\uB9CC\uC57D A\uB77C\uBA74, B\uD574\uB77C / B\uC77C \uAC83\uC774\uB2E4."],
          ],
        },
        {
          title: "\uC774\uC81C \uD55C\uAD6D\uC5B4\uC758 \uC870\uAC74 \uBD80\uBD84\uC744 \uC601\uC5B4 If + \uC791\uC740 \uBB38\uC7A5\uC73C\uB85C \uB9CC\uB4E4\uC5B4\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["If"],
          ],
        },
      ],
    },
    "5-1": {
      title: "\uBD88\uADDC\uCE59",
      steps: [
        {
          title: "\uC601\uC5B4 \uB3D9\uC0AC\uB294 \uACFC\uAC70\uB97C \uB9D0\uD560 \uB54C \uBAA8\uC591\uC774 \uBC14\uB01D\uB2C8\uB2E4.",
          body: "\uBCF4\uD1B5\uC740 play \u2192 played\uCC98\uB7FC -ed\uB97C \uBD99\uC785\uB2C8\uB2E4.",
          rows: [
            ["\uBCF4\uD1B5\uC740 play"],
            ["\u2192"],
            ["played\uCC98\uB7FC -ed\uB97C \uBD99\uC785\uB2C8\uB2E4."],
          ],
        },
        {
          title: "\uADF8\uB7F0\uB370 \uC5B4\uB5A4 \uB3D9\uC0AC\uB294 \uADDC\uCE59\uB300\uB85C \uC548 \uBC14\uB01D\uB2C8\uB2E4.",
          body: "\uC774\uAC78 \uBD88\uADDC\uCE59 \uB3D9\uC0AC\uB77C\uACE0 \uD569\uB2C8\uB2E4.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "\uC608\uB97C \uB4E4\uC5B4 go\uB294 goed\uAC00 \uC544\uB2C8\uB77C went\uC785\uB2C8\uB2E4.",
          body: "see\uB294 saw, eat\uC740 ate\uC785\uB2C8\uB2E4.",
          rows: [
            ["saw"],
          ],
        },
        {
          title: "\uC5B4\uB5A4 \uBB38\uBC95\uC5D0\uC11C\uB294 \uC138 \uBC88\uC9F8 \uBAA8\uC591\uB3C4 \uD544\uC694\uD569\uB2C8\uB2E4.",
          body: "\uC608: go - went - gone, see - saw - seen",
          rows: [
            ["go - went - gone"],
            ["see - saw - seen"],
          ],
        },
        {
          title: "\uC774\uC81C \uB9D0\uB3C4 \uC548 \uB418\uB294 \uAC00\uC9DC \uD615\uD0DC\uB97C \uD53C\uD558\uACE0, \uC9C4\uC9DC \uBD88\uADDC\uCE59 3\uB2E8 \uBCC0\uD654\uB97C \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "5-2": {
      title: "\uD604\uC7AC\uC644\uB8CC",
      steps: [
        {
          title: "\uD604\uC7AC\uC644\uB8CC\uB294 \uACFC\uAC70\uC5D0 \uD55C \uC77C\uC774 \uC9C0\uAE08\uACFC \uC774\uC5B4\uC838 \uC788\uC744 \uB54C \uC501\uB2C8\uB2E4.",
          body: "\uBAA8\uC591\uC740 have/has + \uC138 \uBC88\uC9F8 \uB3D9\uC0AC\uBAA8\uC591\uC785\uB2C8\uB2E4.",
          rows: [
            ["have"],
            ["has"],
          ],
        },
        {
          title: "I have eaten dinner.",
          body: "= \uB098\uB294 \uC800\uB141\uC744 \uBA39\uC5C8\uB2E4. \uADF8\uB798\uC11C \uC9C0\uAE08 \uBC30\uBD80\uB974\uAC70\uB098, \uC77C\uC774 \uB05D\uB09C \uC0C1\uD0DC\uC785\uB2C8\uB2E4.",
          rows: [
            ["have eaten"],
            ["dinner"],
          ],
        },
        {
          title: "\uC8FC\uC5B4\uAC00 he / she / it / \uD55C \uBA85\uC774\uBA74 has\uB97C \uC501\uB2C8\uB2E4.",
          body: "She has seen it.",
          rows: [
            ["he", "she", "it"],
            ["She", "has seen", "it"],
          ],
        },
        {
          title: "already, never, ever, just, for, since, yet \uAC19\uC740 \uB9D0\uC774 \uC790\uC8FC \uAC19\uC774 \uB098\uC635\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["already"],
            ["never"],
            ["ever"],
            ["just"],
          ],
        },
        {
          title: "\uC774\uC81C \uC8FC\uC5B4\uC5D0 \uB9DE\uAC8C have / has\uB97C \uACE0\uB974\uACE0, \uB3D9\uC0AC\uB97C \uC138 \uBC88\uC9F8 \uBAA8\uC591\uC73C\uB85C \uBC14\uAFD4\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["have"],
          ],
        },
      ],
    },
    "5-3": {
      title: "\uC811\uC18D\uC0AC",
      steps: [
        {
          title: "\uC811\uC18D\uC0AC\uB294 \uBB38\uC7A5\uACFC \uBB38\uC7A5\uC744 \uC774\uC5B4\uC8FC\uB294 \uB9D0\uC785\uB2C8\uB2E4.",
          body: "\uC608: \uADF8\uB9AC\uACE0, \uD558\uC9C0\uB9CC, \uADF8\uB798\uC11C, \uC65C\uB0D0\uD558\uBA74",
          rows: [
            ["\uADF8\uB9AC\uACE0"],
            ["\uD558\uC9C0\uB9CC"],
            ["\uADF8\uB798\uC11C"],
            ["\uC65C\uB0D0\uD558\uBA74"],
          ],
        },
        {
          title: "and\uB294 \u201C\uADF8\uB9AC\uACE0\u201D\uC785\uB2C8\uB2E4.",
          body: "\uBE44\uC2B7\uD55C \uB0B4\uC6A9\uC744 \uC774\uC5B4\uC90D\uB2C8\uB2E4.",
          rows: [
            ["\uADF8\uB9AC\uACE0"],
          ],
        },
        {
          title: "but\uC740 \u201C\uD558\uC9C0\uB9CC\u201D\uC785\uB2C8\uB2E4.",
          body: "\uC55E\uB4A4 \uB0B4\uC6A9\uC774 \uBC18\uB300\uB418\uAC70\uB098 \uCDA9\uB3CC\uD569\uB2C8\uB2E4.",
          rows: [
            ["\uD558\uC9C0\uB9CC"],
          ],
        },
        {
          title: "so\uB294 \u201C\uADF8\uB798\uC11C\u201D, because\uB294 \u201C\uC65C\uB0D0\uD558\uBA74\u201D\uC785\uB2C8\uB2E4.",
          body: "\uC774\uC720\uC640 \uACB0\uACFC\uB97C \uC5F0\uACB0\uD569\uB2C8\uB2E4.",
          rows: [
            ["\uADF8\uB798\uC11C"],
            ["\uC65C\uB0D0\uD558\uBA74"],
          ],
        },
        {
          title: "\uC774\uC81C \uB450 \uBB38\uC7A5\uC758 \uAD00\uACC4\uB97C \uBCF4\uACE0 \uC54C\uB9DE\uC740 \uC5F0\uACB0\uC5B4\uB97C \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "5-4": {
      title: "\uC870\uB3D9\uC0AC2",
      steps: [
        {
          title: "\uC5B4\uB5A4 \uD45C\uD604\uC740 \uD55C \uB2E8\uC5B4\uAC00 \uC544\uB2C8\uB77C \uC5EC\uB7EC \uB2E8\uC5B4\uAC00 \uBB49\uCCD0\uC11C \uD2B9\uBCC4\uD55C \uB73B\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.",
          body: "\uC608: be going to, have to, would like to, used to",
          rows: [
            ["be going to"],
            ["have to"],
            ["would like to"],
            ["used to"],
          ],
        },
        {
          title: "be going to\uB294 \u201C~\uD560 \uC608\uC815\uC774\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "I\u2019m going to visit her. = \uB098\uB294 \uADF8\uB140\uB97C \uBC29\uBB38\uD560 \uC608\uC815\uC774\uB2E4.",
          rows: [
            ["~\uD560 \uC608\uC815\uC774\uB2E4"],
            ["I\u2019m going to visit her.", "\uB098\uB294 \uADF8\uB140\uB97C \uBC29\uBB38\uD560 \uC608\uC815\uC774\uB2E4."],
          ],
        },
        {
          title: "have to\uB294 \u201C\uD574\uC57C \uD55C\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "He has to finish it. = \uADF8\uB294 \uADF8\uAC83\uC744 \uB05D\uB0B4\uC57C \uD55C\uB2E4.",
          rows: [
            ["\uD574\uC57C \uD55C\uB2E4"],
            ["He has to finish it.", "\uADF8\uB294 \uADF8\uAC83\uC744 \uB05D\uB0B4\uC57C \uD55C\uB2E4."],
          ],
        },
        {
          title: "would like to\uB294 \u201C~\uD558\uACE0 \uC2F6\uC2B5\uB2C8\uB2E4\u201D\uCC98\uB7FC \uC870\uAE08 \uB354 \uACF5\uC190\uD55C \uD45C\uD604\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["would"],
          ],
        },
        {
          title: "\uC774\uC81C \uBB38\uC7A5\uC5D0\uC11C \uC774 \uD45C\uD604\uC774 \uC5B4\uB5A4 \uC758\uBBF8\uB85C \uC4F0\uC600\uB294\uC9C0 \uC77D\uACE0 \uB300\uB2F5\uD574\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "6-1": {
      title: "-ing / -ed 1. \uBD84\uC0AC",
      steps: [
        {
          title: "\uB3D9\uC0AC\uC5D0 -ing\uAC00 \uBD99\uC73C\uBA74 \uBCF4\uD1B5 \u201C~\uD558\uB294 / ~\uD558\uACE0 \uC788\uB294 / ~\uD558\uB294 \uAC83\u201D \uB290\uB08C\uC774 \uB0A9\uB2C8\uB2E4.",
          body: "running = \uB2EC\uB9AC\uB294, \uB2EC\uB9AC\uAE30",
          rows: [
            ["~\uD558\uB294 / ~\uD558\uACE0 \uC788\uB294 / ~\uD558\uB294 \uAC83"],
            ["running", "\uB2EC\uB9AC\uB294, \uB2EC\uB9AC\uAE30"],
          ],
        },
        {
          title: "running dog\uB294 \u201C\uB2EC\uB9AC\uB294 \uAC15\uC544\uC9C0\u201D\uC785\uB2C8\uB2E4.",
          body: "\uB4A4\uC758 \uBA85\uC0AC\uB97C \uC55E\uC5D0\uC11C \uC124\uBA85\uD569\uB2C8\uB2E4.",
          rows: [
            ["\uB2EC\uB9AC\uB294 \uAC15\uC544\uC9C0"],
          ],
        },
        {
          title: "I am running\uC740 \u201C\uB098\uB294 \uB2EC\uB9AC\uACE0 \uC788\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "\uC9C0\uAE08 \uD558\uB294 \uC911\uC774\uB77C\uB294 \uB73B\uC785\uB2C8\uB2E4.",
          rows: [
            ["am"],
          ],
        },
        {
          title: "-ed\uB098 \uC138 \uBC88\uC9F8 \uB3D9\uC0AC\uBAA8\uC591\uC740 \u201C~\uB41C / ~\uB2F9\uD55C / \uB05D\uB09C\u201D \uB290\uB08C\uC774 \uB0A0 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "broken window = \uAE68\uC9C4 \uCC3D\uBB38",
          rows: [
            ["~\uB41C / ~\uB2F9\uD55C / \uB05D\uB09C"],
            ["broken window", "\uAE68\uC9C4 \uCC3D\uBB38"],
          ],
        },
        {
          title: "\uC774\uC81C -ing\uC640 -ed\uAC00 \uBB38\uC7A5\uC5D0\uC11C \uC5B4\uB5A4 \uB73B\uC73C\uB85C \uC4F0\uC600\uB294\uC9C0 \uD574\uC11D\uD574\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
      ],
    },
    "6-2": {
      title: "-ing / -ed 2. \uB3D9\uBA85\uC0ACst",
      steps: [
        {
          title: "-ing\uB294 \u201C~\uD558\uB294 \uAC83\u201D\uC774\uB77C\uB294 \uC774\uB984\uCC98\uB7FC \uC4F0\uC77C \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "Swimming is fun. = \uC218\uC601\uD558\uB294 \uAC83\uC740 \uC7AC\uBBF8\uC788\uB2E4.",
          rows: [
            ["~\uD558\uB294 \uAC83"],
            ["Swimming is fun.", "\uC218\uC601\uD558\uB294 \uAC83\uC740 \uC7AC\uBBF8\uC788\uB2E4."],
          ],
        },
        {
          title: "\uD558\uC9C0\uB9CC I am swimming\uC740 \u201C\uB098\uB294 \uC218\uC601\uD558\uB294 \uAC83\uC774\uB2E4\u201D\uAC00 \uC544\uB2C8\uB77C \u201C\uB098\uB294 \uC218\uC601\uD558\uACE0 \uC788\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["am"],
          ],
        },
        {
          title: "\uC989 -ing\uAC00 \uC788\uB2E4\uACE0 \uD56D\uC0C1 \uAC19\uC740 \uB73B\uC740 \uC544\uB2D9\uB2C8\uB2E4.",
          body: "\uBB38\uC7A5 \uC548\uC5D0\uC11C \uC790\uB9AC\uB97C \uBD10\uC57C \uD569\uB2C8\uB2E4.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "\uBB38\uC7A5 \uB9E8 \uC55E\uC5D0\uC11C \uC8FC\uC5B4\uCC98\uB7FC \uC4F0\uC774\uBA74 \u201C~\uD558\uB294 \uAC83\u201D\uC77C \uAC00\uB2A5\uC131\uC774 \uD07D\uB2C8\uB2E4.",
          body: "Reading books is good.",
          rows: [
            ["~\uD558\uB294 \uAC83"],
            ["is"],
          ],
        },
        {
          title: "\uC774\uC81C \uD55C\uAD6D\uC5B4\uC758 \u201C~\uD558\uB294 \uAC83\u201D\uC774 \uC601\uC5B4\uC5D0\uC11C \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uC5B4\uB5BB\uAC8C \uB418\uB294\uC9C0 \uC601\uC791\uD574\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["~\uD558\uB294 \uAC83"],
          ],
        },
      ],
    },
    "6-3": {
      title: "-ing / -ed 3. \uC9C4\uD589\uD615 vs \uC218\uB3D9\uD0DC",
      steps: [
        {
          title: "\uAC10\uC815 \uD45C\uD604\uC5D0\uC11C\uB294 -ing\uC640 -ed\uAC00 \uC790\uC8FC \uD5F7\uAC08\uB9BD\uB2C8\uB2E4.",
          body: "interesting\uACFC interested\uB294 \uB2E4\uB985\uB2C8\uB2E4.",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
        },
        {
          title: "-ing\uB294 \uAC10\uC815\uC744 \uC77C\uC73C\uD0A4\uB294 \uCABD\uC785\uB2C8\uB2E4.",
          body: "The movie is interesting. = \uC601\uD654\uAC00 \uD765\uBBF8\uB97C \uC77C\uC73C\uD0A8\uB2E4 \u2192 \uC601\uD654\uAC00 \uD765\uBBF8\uB86D\uB2E4.",
          rows: [
            ["The movie is interesting."],
            ["\uC601\uD654\uAC00 \uD765\uBBF8\uB97C \uC77C\uC73C\uD0A8\uB2E4 \u2192 \uC601\uD654\uAC00 \uD765\uBBF8\uB86D\uB2E4."],
          ],
        },
        {
          title: "-ed\uB294 \uAC10\uC815\uC744 \uB290\uB07C\uB294 \uCABD\uC785\uB2C8\uB2E4.",
          body: "I am interested. = \uB098\uB294 \uD765\uBBF8\uB97C \uB290\uB080\uB2E4.",
          rows: [
            ["I am interested."],
            ["\uB098\uB294 \uD765\uBBF8\uB97C \uB290\uB080\uB2E4."],
          ],
        },
        {
          title: "\uC0AC\uB78C\uC774 \uAC10\uC815\uC744 \uB290\uB07C\uBA74 \uBCF4\uD1B5 -ed, \uBB3C\uAC74/\uC0AC\uAC74\uC774 \uAC10\uC815\uC744 \uC77C\uC73C\uD0A4\uBA74 \uBCF4\uD1B5 -ing\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["ed"],
          ],
        },
        {
          title: "\uC774\uC81C \uC8FC\uC5B4\uAC00 \uAC10\uC815\uC744 \uC8FC\uB294 \uCABD\uC778\uC9C0, \uBC1B\uB294 \uCABD\uC778\uC9C0 \uBCF4\uACE0 \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
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
      steps: [
        {
          title: "\uC5B4\uB5A4 \uB2E8\uC5B4\uB4E4\uC740 \uD2B9\uC815 \uC804\uCE58\uC0AC\uC640 \uC790\uC8FC \uBD99\uC5B4 \uB2E4\uB2D9\uB2C8\uB2E4.",
          body: "\uC774\uAC74 \uC704\uCE58\uB77C\uAE30\uBCF4\uB2E4 \u201C\uC9DD\uAFCD \uD45C\uD604\u201D\uC5D0 \uAC00\uAE5D\uC2B5\uB2C8\uB2E4.",
          rows: [
            ["\uC9DD\uAFCD \uD45C\uD604"],
          ],
        },
        {
          title: "interested in\uC740 \u201C~\uC5D0 \uAD00\uC2EC\uC774 \uC788\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "I\u2019m interested in music.",
          rows: [
            ["~\uC5D0 \uAD00\uC2EC\uC774 \uC788\uB2E4"],
            ["I\u2019m", "interested in", "music"],
          ],
        },
        {
          title: "ask for\uB294 \u201C~\uC744 \uC694\uCCAD\uD558\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "He asked for help.",
          rows: [
            ["~\uC744 \uC694\uCCAD\uD558\uB2E4"],
            ["He", "asked for", "help"],
          ],
        },
        {
          title: "talk about\uC740 \u201C~\uC5D0 \uB300\uD574 \uC774\uC57C\uAE30\uD558\uB2E4\u201D, succeed in\uC740 \u201C~\uC5D0 \uC131\uACF5\uD558\uB2E4\u201D\uC785\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["~\uC5D0 \uB300\uD574 \uC774\uC57C\uAE30\uD558\uB2E4"],
            ["~\uC5D0 \uC131\uACF5\uD558\uB2E4"],
          ],
        },
        {
          title: "\uC774\uC81C \uB2E8\uC5B4\uC640 \uC798 \uC5B4\uC6B8\uB9AC\uB294 \uC804\uCE58\uC0AC \uC9DD\uC744 \uACE8\uB77C\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["S"],
            ["V"],
            ["Point"],
          ],
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
      title: "that = \uC740, \uB294, \uC774, \uAC00, \uC744, \uB97C",
      steps: [
        {
          title: "\uC601\uC5B4\uC758 that\uC740 \uD56D\uC0C1 \u201C\uC800\uAC83\u201D\uC774\uB77C\uB294 \uB73B\uB9CC \uC788\uB294 \uAC8C \uC544\uB2D9\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uC800\uAC83"],
          ],
        },
        {
          title: "I think that he is right.\uC5D0\uC11C that\uC740 \uB4A4 \uBB38\uC7A5\uC744 \uD1B5\uC9F8\uB85C \uBB36\uC5B4\uC90D\uB2C8\uB2E4.",
          body: "\u201C\uADF8\uAC00 \uB9DE\uB2E4\uB294 \uAC83\u201D\uCC98\uB7FC \uB429\uB2C8\uB2E4.",
          rows: [
            ["is"],
            ["\uADF8\uAC00 \uB9DE\uB2E4\uB294 \uAC83"],
          ],
        },
        {
          title: "\uD55C\uAD6D\uC5B4\uB85C \uC62E\uAE38 \uB54C\uB294 that\uC774 \u201C\uC740/\uB294/\uC774/\uAC00/\uC744/\uB97C/\uAC83/\uB2E4\uACE0\u201D\uCC98\uB7FC \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uB179\uC544 \uC5C6\uC5B4\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uC740/\uB294/\uC774/\uAC00/\uC744/\uB97C/\uAC83/\uB2E4\uACE0"],
          ],
        },
        {
          title: "\uC911\uC694\uD55C \uAC74 that \uB4A4\uC5D0 \uC791\uC740 \uBB38\uC7A5\uC774 \uD558\uB098 \uB4E4\uC5B4\uC628\uB2E4\uB294 \uC810\uC785\uB2C8\uB2E4.",
          body: "that + \uC8FC\uC5B4 + \uB3D9\uC0AC",
          rows: [
            ["that"],
            ["that"],
          ],
        },
        {
          title: "\uC774\uC81C that\uC744 \uD558\uB098\uD558\uB098 \u201C\uC800\uAC83\u201D\uC73C\uB85C \uBC88\uC5ED\uD558\uC9C0 \uB9D0\uACE0, \uB4A4 \uBB38\uC7A5\uC744 \uB369\uC5B4\uB9AC\uB85C \uBB36\uC5B4 \uD574\uC11D\uD574\uBD05\uB2C8\uB2E4.",
          body: "",
          rows: [
            ["\uC800\uAC83"],
          ],
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

  function buildSvtdInlinePart(part) {
    if (!part || typeof part !== "object") return escapeHtml(part ?? "");
    return `<span${roleStyleAttr(part.role, ["display:inline-flex", "align-items:center", "justify-content:center", "min-height:1.5em", "padding:0.04em 0.42em", "border-radius:999px", "border-width:1px", "border-style:solid"])}>${escapeHtml(part.text ?? "")}</span>`;
  }

  function buildSvtdStackedTitleHtml(stepNumber, parts) {
    return [
      `<span style="display:block;font-size:12px;line-height:1.2;color:rgba(126,49,6,0.72);margin-bottom:5px;">${stepNumber}\uB2E8\uACC4</span>`,
      `<span style="display:block;">${(parts || []).map(buildSvtdInlinePart).join("")}</span>`,
    ].join("");
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

  function renumberStepTitle(title, index) {
    const clean = String(title || "").replace(/^\s*\d+\uB2E8\uACC4:\s*/, "").trim();
    return `${index + 1}\uB2E8\uACC4: ${clean}`;
  }

  function buildStackedStepTitleHtml(title, index) {
    const clean = String(title || "").replace(/^\s*\d+\uB2E8\uACC4:?\s*/, "").trim();
    return [
      `<span style="display:block;font-size:12px;line-height:1.2;color:rgba(126,49,6,0.72);margin-bottom:5px;">${index + 1}\uB2E8\uACC4</span>`,
      `<span style="display:block;">${escapeHtml(clean)}</span>`,
    ].join("");
  }

  function normalizeSteps(entry) {
    const rawSteps = (Array.isArray(entry?.steps) ? entry.steps : []).slice(0, 5);
    return rawSteps.map((step, index) => ({
      title: renumberStepTitle(step.title, index),
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
    return global.LessonIntroPlayer.render(container, config);
  }

  global.AisthIntroFronts = {
    getConfig,
    render,
  };
})(window);
