(function (global) {
  "use strict";

  const INTRO_MAP = {
  "1-1": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc606\uc73c\ub85c \uc787\uae30",
    "title": "\uc811\uc18d\uc0ac\ub85c \uc787\uae30",
    "steps": [
      {
        "title": "\ub450 \ubb38\uc7a5\uc740 \uc5f0\uacb0\uc5b4 \ud558\ub098\ub85c \uc774\uc5b4\uc9c8 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "and, but, so, because \uac19\uc740 \ub9d0\uc785\ub2c8\ub2e4.",
        "rows": [
          [
            "and",
            "but",
            "so",
            "because"
          ]
        ]
      },
      {
        "title": "\uc5f0\uacb0\uc5b4\ub294 \ub450 \ubb38\uc7a5\uc758 \uad00\uacc4\ub97c \ubcf4\uc5ec\uc90d\ub2c8\ub2e4.",
        "body": "\uadf8\ub9ac\uace0 / \ud558\uc9c0\ub9cc / \uadf8\ub798\uc11c / \uc65c\ub0d0\ud558\uba74",
        "rows": [
          [
            "\uadf8\ub9ac\uace0",
            "\ud558\uc9c0\ub9cc",
            "\uadf8\ub798\uc11c",
            "\uc65c\ub0d0\ud558\uba74"
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \ub450 \ubb38\uc7a5\uc774 \uc5b4\ub5a4 \uad00\uacc4\uc778\uc9c0 \ubcf4\uace0 \ud558\ub098\ub85c \uc774\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "1-2": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc606\uc73c\ub85c \uc787\uae30",
    "title": "\uc5f0\uacb0\ub41c \ubb38\uc7a5 \uc77d\uae30",
    "steps": [
      {
        "title": "\uc811\uc18d\uc0ac\uac00 \ubcf4\uc774\uba74 \ubb38\uc7a5\uc744 \ub458\ub85c \ub098\ub215\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc811\uc18d\uc0ac\ub294 \ub450 \ubb38\uc7a5\uc774 \uc5b4\ub5a4 \uad00\uacc4\uc778\uc9c0 \uc54c\ub824\uc90d\ub2c8\ub2e4.",
        "body": "\uc774\uc720\uc778\uc9c0, \uc2dc\uac04\uc778\uc9c0, \ubc18\ub300\uc778\uc9c0 \ubd05\ub2c8\ub2e4.",
        "rows": [
          [
            "\uc774\uc720\uc778\uc9c0",
            "\uc2dc\uac04\uc778\uc9c0",
            "\ubc18\ub300\uc778\uc9c0 \ubd05\ub2c8\ub2e4."
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \uc811\uc18d\uc0ac\ub97c \uc911\uc2ec\uc73c\ub85c \uc55e\ub4a4 \uc758\ubbf8\ub97c \uc5f0\uacb0\ud574 \ud574\uc11d\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "1-3": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc606\uc73c\ub85c \uc787\uae30",
    "title": "\uac19\uc740 \uc8fc\uc5b4 \uc904\uc774\uae30",
    "steps": [
      {
        "title": "\ub450 \ubb38\uc7a5\uc5d0\uc11c \uac19\uc740 \uc8fc\uc5b4\uac00 \ubc18\ubcf5\ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "I washed... and I cleaned...",
        "rows": [
          [
            "I washed... and I cleaned..."
          ]
        ]
      },
      {
        "title": "\uc601\uc5b4\ub294 \ubc18\ubcf5\ub418\ub294 \uc8fc\uc5b4\ub97c \uc904\uc5ec\uc11c \ub9d0\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "I washed... and cleaned...",
        "rows": [
          [
            "I washed... and cleaned..."
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \uac19\uc740 \uc8fc\uc5b4\ub97c \ucc3e\uc544 \ud55c \ubc88\ub9cc \ub0a8\uaca8\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "1-4": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc606\uc73c\ub85c \uc787\uae30",
    "title": "\uc5ec\ub7ec \ud589\ub3d9 \ub098\uc5f4\ud558\uae30",
    "steps": [
      {
        "title": "\ud55c \uc0ac\ub78c\uc774 \uc5ec\ub7ec \ud589\ub3d9\uc744 \ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "\uc53b\uace0, \uccad\uc18c\ud558\uace0, \ubc84\ub9ac\uace0.",
        "rows": [
          [
            "\uc53b\uace0",
            "\uccad\uc18c\ud558\uace0",
            "\ubc84\ub9ac\uace0."
          ]
        ]
      },
      {
        "title": "\uc601\uc5b4\ub294 \uc774\ub7f0 \ud589\ub3d9\ub4e4\uc744 A, B, and C\ub85c \ub098\uc5f4\ud569\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uac19\uc740 \uc8fc\uc5b4 \uc544\ub798\uc5d0 \uc5ec\ub7ec \ub3d9\uc791\uc744 \uac00\uc9c0\ub7f0\ud788 \uc774\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "2-1": {
    "unitTitle": "\ubb38\uc7a5 \uc548\uc5d0 \ubb38\uc7a5 \ub123\uae30",
    "title": "\uad00\uacc4\uc808 \ub4a4\uc5d0 \ubd99\uc774\uae30",
    "steps": [
      {
        "title": "\ub450 \ubb38\uc7a5\uc5d0 \uac19\uc740 \uc0ac\ub78c\uc774 \ub098\uc624\uba74 \ud558\ub098\ub85c \ud569\uce60 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uac19\uc740 \uc0ac\ub78c\uc744 who\ub85c \ubc14\uafb8\uace0, \uc55e \uba85\uc0ac \ub4a4\uc5d0 \ubd99\uc785\ub2c8\ub2e4.",
        "body": "a girl who was crying",
        "rows": [
          [
            "a girl who was crying"
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \uba85\uc0ac \ub4a4\uc5d0 \u201c\uc5b4\ub5a4 \uc0ac\ub78c\uc778\uc9c0\u201d \uc124\uba85\uc744 \ubd99\uc5ec\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "2-2": {
    "unitTitle": "\ubb38\uc7a5 \uc548\uc5d0 \ubb38\uc7a5 \ub123\uae30",
    "title": "\uad00\uacc4\uc808 \uc911\uac04\uc5d0 \ub07c\uc6b0\uae30",
    "steps": [
      {
        "title": "\uad00\uacc4\uc808\uc740 \uafb8\ubbf8\ub294 \uba85\uc0ac \ubc14\ub85c \ub4a4\uc5d0 \ub4e4\uc5b4\uac11\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uadf8\ub798\uc11c \ubb38\uc7a5 \uc911\uac04\uc5d0\ub3c4 \ub07c\uc5b4\ub4e4 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "The girl who came early is here.",
        "rows": [
          [
            "The girl who came early is here."
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \uae34 \ubb38\uc7a5\uc5d0\uc11c \uc911\uc2ec \ubb38\uc7a5\uacfc \ub07c\uc5b4\ub4e0 \uc124\uba85\uc744 \ub098\ub220\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "2-3": {
    "unitTitle": "\ubb38\uc7a5 \uc548\uc5d0 \ubb38\uc7a5 \ub123\uae30",
    "title": "which\ub85c \ubb3c\uac74 \uc124\uba85\ud558\uae30",
    "steps": [
      {
        "title": "\uc0ac\ub78c\uc740 who, \ubb3c\uac74\uc740 which\ub098 that\uc73c\ub85c \uc124\uba85\ud569\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uac19\uc740 \ubb3c\uac74\uc744 \ucc3e\uc544 which\ub85c \ubc14\uafc9\ub2c8\ub2e4.",
        "body": "the book which I bought",
        "rows": [
          [
            "the book which I bought"
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \ubb3c\uac74 \ub4a4\uc5d0 \u201c\uc5b4\ub5a4 \ubb3c\uac74\uc778\uc9c0\u201d \ubd99\uc5ec\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "2-4": {
    "unitTitle": "\ubb38\uc7a5 \uc548\uc5d0 \ubb38\uc7a5 \ub123\uae30",
    "title": "where / when / why\ub85c \uc904\uc774\uae30",
    "steps": [
      {
        "title": "\uc7a5\uc18c, \uc2dc\uac04, \uc774\uc720\ub3c4 \uad00\uacc4\uc808\ub85c \uc124\uba85\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "in which\ub294 where\ucc98\ub7fc \uc904\uc5b4\ub4e4 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "the place in which I live \u2192 the place where I live",
        "rows": [
          [
            "the place in which I live \u2192 the place where I live"
          ]
        ]
      },
      {
        "title": "\uc774\uc81c which \uad6c\uc870\uac00 where / when / why\ub85c \ubc14\ub00c\ub294 \uac10\uac01\uc744 \uc775\ud600\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-1": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc9e7\uac8c \uc555\ucd95\ud558\uae30",
    "title": "to\ubd80\uc815\uc0ac\ub85c \uc555\ucd95\ud558\uae30",
    "steps": [
      {
        "title": "\uae34 \uc124\uba85\uc808\uc740 to + \ub3d9\uc0ac\ub85c \uc9e7\uc544\uc9c8 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "a report which I must write",
        "rows": [
          [
            "a report which I must write"
          ]
        ]
      },
      {
        "title": "\uc774\uac83\uc740 a report to write\ucc98\ub7fc \uc904\uc77c \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \u201c~\ud574\uc57c \ud560 / ~\ud560\u201d \ub290\ub08c\uc744 to + \ub3d9\uc0ac\ub85c \uc555\ucd95\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-2": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc9e7\uac8c \uc555\ucd95\ud558\uae30",
    "title": "\ubd84\uc0ac\uad6c\ubb38\uc73c\ub85c \uc555\ucd95\ud558\uae30 / \ub3d9\uba85\uc0ac\ub85c \uc555\ucd95\ud558\uae30",
    "steps": [
      {
        "title": "\uc774\uc720\ub098 \uc2dc\uac04 \uc808\uc740 \uc9e7\uac8c \uc904\uc77c \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "Because she was tired...",
        "rows": [
          [
            "Because she was tired..."
          ]
        ]
      },
      {
        "title": "\ubc18\ubcf5\ub418\ub294 \uc8fc\uc5b4\uc640 be\ub3d9\uc0ac\ub97c \ube7c\uba74 Tired\ucc98\ub7fc \ub0a8\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "That he lied \uac19\uc740 \ubb38\uc7a5 \uc804\uccb4\ub3c4 \uba85\uc0ac\ucc98\ub7fc \uc4f0\uc77c \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uac83\uc740 his lying\ucc98\ub7fc \ub354 \uc9e7\uac8c \ubc14\ub01d\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uae34 \ubd80\uc0ac\uc808\uc744 \uc9e7\uc740 \ubd84\uc0ac \ud45c\ud604\uc73c\ub85c \uc904\uc5ec\ubd05\ub2c8\ub2e4. / \uc774\uc81c \u201c\uadf8\uac00 ~\ud588\ub2e4\ub294 \uac83\u201d\uc744 \u201c\uadf8\uc758 ~\ud568\u201d\uc73c\ub85c \uc555\ucd95\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-3": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc9e7\uac8c \uc555\ucd95\ud558\uae30",
    "title": "if \uc0dd\ub7b5 \ud45c\ud604 / \uad00\uacc4\uc808 \uc555\ucd95\ud558\uae30",
    "steps": [
      {
        "title": "If it is necessary \uac19\uc740 \uc870\uac74\uc808\uc740 \uc9e7\uac8c \uc904\uc77c \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\ubed4\ud55c it is\ub97c \ube7c\uba74 If necessary\uac00 \ub429\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "who is, which is \uac19\uc740 \ub9d0\uc740 \uc790\uc8fc \uc0dd\ub7b5\ub429\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "the boy who is tall\uc740 the tall boy\uac00 \ub429\ub2c8\ub2e4.",
        "body": "the book that is on the table\uc740 the book on the table\uc774 \ub429\ub2c8\ub2e4.",
        "rows": [
          [
            "the book that is on the table\uc740 the book on the table\uc774 \ub429\ub2c8\ub2e4."
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \uc870\uac74\uc808\uc5d0\uc11c \uc228\uaca8\ub3c4 \ub418\ub294 \ub9d0\uc744 \ube7c\ubd05\ub2c8\ub2e4. / \uc774\uc81c \uad00\uacc4\uc808\uc744 \ud615\uc6a9\uc0ac, \ubd84\uc0ac, \uc804\uce58\uc0ac\uad6c\ub85c \uc904\uc5ec\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-4": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc9e7\uac8c \uc555\ucd95\ud558\uae30",
    "title": "\ub4a4 \uc124\uba85\uc744 \uc55e \uc124\uba85\uc73c\ub85c \uc555\ucd95\ud558\uae30",
    "steps": [
      {
        "title": "\uc601\uc5b4\ub294 \ub4a4\uc5d0\uc11c \uae38\uac8c \uc124\uba85\ud55c \ub9d0\uc744 \uc55e\uc5d0\uc11c \uc9e7\uac8c \ub9d0\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "an island that was lost for a long time\uc740 a long-lost island\uac00 \ub429\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uae34 \uc124\uba85\uc744 \uba85\uc0ac \uc55e\uc758 \uc9e7\uc740 \ud615\uc6a9\uc0ac \ud45c\ud604\uc73c\ub85c \ubc14\uafd4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-5": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc9e7\uac8c \uc555\ucd95\ud558\uae30",
    "title": "\uc228\uc740 \uad00\uacc4\uc808 \ubcf5\uc6d0\ud558\uae30",
    "steps": [
      {
        "title": "\uc9e7\uc740 \uc218\uc2dd\uc5b4 \uc548\uc5d0\ub294 \uad00\uacc4\uc808\uc774 \uc228\uc5b4 \uc788\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "reports submitted yesterday",
        "rows": [
          [
            "reports submitted yesterday"
          ]
        ]
      },
      {
        "title": "\uc774\uac83\uc740 reports that were submitted yesterday\uac00 \uc904\uc5b4\ub4e0 \ub9d0\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uc555\ucd95\ub41c \ud45c\ud604 \uc18d\uc5d0 \uc228\uc740 that / be\ub97c \ucc3e\uc544\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-6": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uc9e7\uac8c \uc555\ucd95\ud558\uae30",
    "title": "\uba85\uc0ac\ud615 \ud45c\ud604\uacfc \ub3d9\uc0ac\ud615 \ud45c\ud604",
    "steps": [
      {
        "title": "\uc601\uc5b4\ub294 \ub3d9\uc791\uc744 \uba85\uc0ac\ucc98\ub7fc \ub9d0\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "make a decision",
        "rows": [
          [
            "make a decision"
          ]
        ]
      },
      {
        "title": "\uac19\uc740 \ub73b\uc744 \ub3d9\uc0ac \ud558\ub098\ub85c\ub3c4 \ub9d0\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "make a decision \u2192 decide",
        "rows": [
          [
            "make a decision \u2192 decide"
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \uba85\uc0ac\ud615 \ud45c\ud604\uacfc \ub3d9\uc0ac\ud615 \ud45c\ud604\uc744 \uc11c\ub85c \uc5f0\uacb0\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "4-1": {
    "unitTitle": "\ub2e8\uc5b4\ub294 \uc790\ub9ac \ub530\ub77c \uc5ed\ud560\uc774 \ubc14\ub010\ub2e4",
    "title": "\uac19\uc740 \ub2e8\uc5b4, \ub2e4\ub978 \ud488\uc0ac",
    "steps": [
      {
        "title": "\uac19\uc740 \ub2e8\uc5b4\ub3c4 \ubb38\uc7a5 \uc548 \uc704\uce58\uc5d0 \ub530\ub77c \uc5ed\ud560\uc774 \ub2ec\ub77c\uc9d1\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "water\ub294 \uba85\uc0ac\uba74 \u201c\ubb3c\u201d, \ub3d9\uc0ac\uba74 \u201c\ubb3c\uc744 \uc8fc\ub2e4\u201d\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \ub2e8\uc5b4 \ub73b\ub9cc \ubcf4\uc9c0 \ub9d0\uace0, \ubb38\uc7a5 \uc548 \uc790\ub9ac\ub97c \ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "4-2": {
    "unitTitle": "\ub2e8\uc5b4\ub294 \uc790\ub9ac \ub530\ub77c \uc5ed\ud560\uc774 \ubc14\ub010\ub2e4",
    "title": "\ub2e4\uc758\uc5b4",
    "steps": [
      {
        "title": "\ud55c \ub2e8\uc5b4\ub294 \ud558\ub098\uc758 \uc911\uc2ec \ub73b\uc5d0\uc11c \uc5ec\ub7ec \ub73b\uc73c\ub85c \ud37c\uc9d1\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "propose\ub294 \uacc4\ud68d\uc744 \ub0b4\ub193\uc73c\uba74 \u201c\uc81c\uc548\ud558\ub2e4\u201d, \uacb0\ud63c\uc744 \ub0b4\ub193\uc73c\uba74 \u201c\uccad\ud63c\ud558\ub2e4\u201d\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \ub2e8\uc5b4\ub97c \ud558\ub098\uc758 \ub73b\uc73c\ub85c \uc678\uc6b0\uc9c0 \ub9d0\uace0 \ubb38\ub9e5 \uc18d\uc5d0\uc11c \uc77d\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "4-3": {
    "unitTitle": "\ub2e8\uc5b4\ub294 \uc790\ub9ac \ub530\ub77c \uc5ed\ud560\uc774 \ubc14\ub010\ub2e4",
    "title": "\ub300\uba85\uc0ac\uc640 \uc228\uc740 \uba85\uc0ac",
    "steps": [
      {
        "title": "\uc601\uc5b4\ub294 \uac19\uc740 \uba85\uc0ac\ub97c \ubc18\ubcf5\ud558\uc9c0 \uc54a\uace0 one, another, the other\ub85c \ub300\uc2e0\ud569\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "one \ub4a4\uc5d0\ub294 \uc55e\uc5d0 \ub098\uc628 \uba85\uc0ac\uac00 \uc228\uc5b4 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "a black bag and a brown one",
        "rows": [
          [
            "a black bag and a brown one"
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \ub300\uba85\uc0ac\uac00 \ub300\uc2e0\ud558\ub294 \uc228\uc740 \uba85\uc0ac\ub97c \ucc3e\uc544\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "5-1": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uba85\uc0ac \ub369\uc5b4\ub9ac\ub85c \ubc14\uafb8\uae30",
    "title": "\ubb38\uc7a5 \u2192 \uba85\uc0ac\uad6c",
    "steps": [
      {
        "title": "\uc644\uc804\ud55c \ubb38\uc7a5\ub3c4 \uba85\uc0ac \ud558\ub098\ub97c \uafb8\ubbf8\ub294 \ub9d0\ub85c \ubc14\ub014 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "Kevin ate sushi.",
        "rows": [
          [
            "Kevin ate sushi."
          ]
        ]
      },
      {
        "title": "\uc774\uac83\uc740 the sushi Kevin ate\uac00 \ub429\ub2c8\ub2e4.",
        "body": "\u201cKevin\uc774 \uba39\uc740 \ucd08\ubc25\u201d\uc785\ub2c8\ub2e4.",
        "rows": [
          [
            "\u201cKevin\uc774 \uba39\uc740 \ucd08\ubc25\u201d\uc785\ub2c8\ub2e4."
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \ubb38\uc7a5\uc744 \u201c~\ud55c \uac83 / ~\ud55c \uba85\uc0ac\u201d\ub85c \ubc14\uafd4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "5-1b": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uba85\uc0ac \ub369\uc5b4\ub9ac\ub85c \ubc14\uafb8\uae30",
    "title": "what\uc73c\ub85c \ubb36\uae30",
    "steps": [
      {
        "title": "what\uc740 \u201c\ubb34\uc5c7\u201d\ub9cc \ub73b\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "what I did\ub294 \u201c\ub0b4\uac00 \ud55c \uac83\u201d\uc785\ub2c8\ub2e4.",
        "body": "something I did\uc640 \ube44\uc2b7\ud569\ub2c8\ub2e4.",
        "rows": [
          [
            "something I did\uc640 \ube44\uc2b7\ud569\ub2c8\ub2e4."
          ]
        ]
      },
      {
        "title": "\uc774\uc81c what\uc744 \u201c~\ud55c \uac83\u201d\uc774\ub77c\ub294 \ub369\uc5b4\ub9ac\ub85c \uc77d\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "5-2": {
    "unitTitle": "\ubb38\uc7a5\uc744 \uba85\uc0ac \ub369\uc5b4\ub9ac\ub85c \ubc14\uafb8\uae30",
    "title": "\uc0ac\uac74\uc744 \uba85\uc0ac\uad6c\ub85c \ubc14\uafb8\uae30",
    "steps": [
      {
        "title": "Prices rose quickly \uac19\uc740 \uc0ac\uac74\ub3c4 \uba85\uc0ac\uad6c\ub85c \uc555\ucd95\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "rose quickly\ub294 rapid rise\uac00 \ub429\ub2c8\ub2e4.",
        "body": "Prices\ub294 of prices\ub85c \ubd99\uc2b5\ub2c8\ub2e4.",
        "rows": [
          [
            "Prices\ub294 of prices\ub85c \ubd99\uc2b5\ub2c8\ub2e4."
          ]
        ]
      },
      {
        "title": "\uc774\uc81c \ubb38\uc7a5 \ud558\ub098\ub97c the rapid rise of prices\ucc98\ub7fc \uc811\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "6-1": {
    "unitTitle": "\uc811\uc740 \ubb38\uc7a5\uc744 \ub354 \ud070 \ubb38\uc7a5\uc5d0 \ub123\uae30",
    "title": "\ud55c \uc0ac\uac74\uc744 \uba85\uc0ac\uad6c\ub85c \ub123\uae30",
    "steps": [
      {
        "title": "\ud55c \ubb38\uc7a5\uc744 \uba85\uc0ac\uad6c\ub85c \uc811\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "The committee approved the schedule.",
        "rows": [
          [
            "The committee approved the schedule."
          ]
        ]
      },
      {
        "title": "\uc774\uac83\uc740 the approval of the schedule\uc774 \ub429\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uc811\uc740 \uba85\uc0ac\uad6c\ub97c \ub2e4\ub978 \ubb38\uc7a5\uc758 it \uc790\ub9ac\uc5d0 \ub123\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "6-2": {
    "unitTitle": "\uc811\uc740 \ubb38\uc7a5\uc744 \ub354 \ud070 \ubb38\uc7a5\uc5d0 \ub123\uae30",
    "title": "\ub450 \uc0ac\uac74\uc744 \uba85\uc0ac\uad6c\ub85c \ubb36\uae30",
    "steps": [
      {
        "title": "\uc0ac\uac74\uc774 \ub450 \uac1c\uba74 \uac01\uac01 \uba85\uc0ac\uad6c\ub85c \uc811\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "the rise of prices and the increase in unemployment\ucc98\ub7fc \ubb36\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \ub450 \uc0ac\uac74\uc744 and\ub85c \uc774\uc5b4 \ud558\ub098\uc758 \ud070 \ub369\uc5b4\ub9ac\ub85c \ub9cc\ub4e4\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "6-3": {
    "unitTitle": "\uc811\uc740 \ubb38\uc7a5\uc744 \ub354 \ud070 \ubb38\uc7a5\uc5d0 \ub123\uae30",
    "title": "\uba85\uc0ac\uad6c\ub97c \ubb38\uc7a5 \uc911\uac04\uc5d0 \ub123\uae30",
    "steps": [
      {
        "title": "\uc811\uc740 \uba85\uc0ac\uad6c\ub294 \ubb38\uc7a5 \uc55e\uc5d0\ub9cc \uc624\ub294 \uac83\uc774 \uc544\ub2d9\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "about, of, for \uac19\uc740 \uc804\uce58\uc0ac \ub4a4\uc5d0\ub3c4 \ub4e4\uc5b4\uac08 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c it\uc774 \uac00\ub9ac\ud0a4\ub294 \uc0ac\uac74\uc744 \uba85\uc0ac\uad6c\ub85c \ubc14\uafd4 \ubb38\uc7a5 \uc911\uac04\uc5d0 \ub123\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "6-4": {
    "unitTitle": "\uc811\uc740 \ubb38\uc7a5\uc744 \ub354 \ud070 \ubb38\uc7a5\uc5d0 \ub123\uae30",
    "title": "\uc555\ucd95 \uba85\uc0ac\uad6c \uc77d\uae30",
    "steps": [
      {
        "title": "\uae34 \ubb38\uc7a5\uc5d0\ub294 \uc0ac\uac74\uc774 \uba85\uc0ac\ucc98\ub7fc \uc811\ud600 \uc788\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "the rapid rise of prices\ub294 Prices rose rapidly\uac00 \uc811\ud78c \ub9d0\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uae34 \uba85\uc0ac\uad6c\ub97c \ubcf4\uace0 \uc6d0\ub798 \uc5b4\ub5a4 \uc0ac\uac74\uc774\uc5c8\ub294\uc9c0 \ud480\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "6-5": {
    "unitTitle": "\uc811\uc740 \ubb38\uc7a5\uc744 \ub354 \ud070 \ubb38\uc7a5\uc5d0 \ub123\uae30",
    "title": "\ubb38\uc7a5\uacfc \uc870\uac01 \uad6c\ubd84\ud558\uae30",
    "steps": [
      {
        "title": "\uae38\ub2e4\uace0 \ub2e4 \ubb38\uc7a5\uc740 \uc544\ub2d9\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "The files you requested\ub294 \u201c\ub124\uac00 \uc694\uccad\ud55c \ud30c\uc77c\ub4e4\u201d\uc774\ub77c\ub294 \uc870\uac01\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uc911\uc2ec \ub3d9\uc0ac\uac00 \uc788\ub294\uc9c0 \ubcf4\uace0, \ubb38\uc7a5\uc778\uc9c0 \uba85\uc0ac\uad6c\uc778\uc9c0 \uad6c\ubd84\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  }
};

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function tokenClass(index) {
    return index === 0 ? " is-subject" : index === 1 ? " is-verb" : "";
  }

  function buildExampleHtml(rows) {
    if (!Array.isArray(rows) || !rows.length) return "";
    return rows.map((row) => {
      const cells = Array.isArray(row) ? row : [row];
      return `<div class="lip-example-row">${cells.map((cell, index) => `<span class="lip-example-token${tokenClass(index)}">${escapeHtml(cell)}</span>`).join("")}</div>`;
    }).join("");
  }

  function renumberStepTitle(title, index) {
    const clean = String(title || "").replace(/^\s*\d+단계[:.]\s*/, "").trim();
    return `${index + 1}단계: ${clean}`;
  }

  function normalizeSteps(entry) {
    const rawSteps = (Array.isArray(entry?.steps) ? entry.steps : []).slice(0, 5);
    return rawSteps.map((step, index) => ({
      title: renumberStepTitle(step.title, index),
      body: step.body,
      exampleHtml: buildExampleHtml(step.rows),
    }));
  }

  function makeKey(options) {
    const lesson = String(options?.lesson ?? "").trim();
    const exercise = String(options?.exercise ?? "").trim();
    if (!lesson || !exercise) return "";
    return `${lesson}-${exercise}`;
  }

  function getConfig(options) {
    const key = makeKey(options);
    const entry = INTRO_MAP[key];
    if (!entry) return null;

    const pageLabel = String(options?.pageLabel || `Herma L${String(options?.lesson ?? "").trim()}-E${String(options?.exercise ?? "").trim()}`);
    const title = entry.unitTitle ? `${entry.unitTitle} ? ${entry.title}` : entry.title;

    return {
      pageLabel,
      title,
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
    return global.LessonIntroPlayer.render(container, config);
  }

  global.HermaIntroFronts = {
    getConfig,
    render,
  };
})(window);
