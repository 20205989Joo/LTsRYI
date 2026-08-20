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

  const GAME_TUTORIALS = {
    "1-1": gameTutorial("두 문장 연결하기", "gold", [
      gameStep("두 문장의 관계를 보고 연결어를 고릅니다.", "tap", ["I was tired.", "I slept early."], "so", "원인 다음에 결과가 옵니다."),
      gameStep("연결어를 가운데 넣어 한 문장으로 타이핑합니다.", "type", ["I was tired,"], "so", "I was tired, so I slept early."),
      gameStep("마지막에는 뜻 조각을 순서대로 눌러 완성합니다.", "scramble", ["나는 피곤했다", "그래서", "일찍 잤다"], "그래서", "영어 순서를 기억하면 됩니다.")
    ]),
    "1-2": gameTutorial("연결 성분 찾아 읽기", "gold", [
      gameStep("문장 안에서 연결 성분을 먼저 누릅니다.", "tap", ["I stayed home because it rained."], "because", "금빛으로 보이는 지점이 경계입니다."),
      gameStep("연결어 앞뒤를 두 덩어리로 나눠 읽습니다.", "split", ["I stayed home", "it rained"], "because", "결과 / 이유"),
      gameStep("번역 조각을 앞 문장부터 차례대로 고릅니다.", "scramble", ["나는 집에 있었다", "비가 왔기 때문에"], "때문에", "연결어의 관계가 순서를 알려줍니다.")
    ]),
    "1-3": gameTutorial("반복 주어 약분하기", "orange", [
      gameStep("두 행동에서 반복되는 주어를 찾습니다.", "tap", ["I washed the dishes", "and I cleaned the table"], "I", "같은 주어가 두 번 보입니다."),
      gameStep("두 번째 주어를 눌러 흐리게 약분합니다.", "fade", ["I washed the dishes and I cleaned the table."], "I", "I washed the dishes and cleaned the table."),
      gameStep("남은 동작들이 같은 높이인지 확인합니다.", "scramble", ["washed", "and", "cleaned"], "and", "동작 둘을 한 주어 아래 연결합니다.")
    ]),
    "1-4": gameTutorial("여러 행동 나란히 놓기", "gold", [
      gameStep("같은 주어 아래의 행동 A·B·C를 찾습니다.", "tap", ["washed", "cleaned", "threw away"], "A · B · C", "세 동작은 같은 레벨입니다."),
      gameStep("마지막 행동 앞에 and를 놓아 나열합니다.", "insert", ["washed, cleaned,"], "and", "washed, cleaned, and threw away"),
      gameStep("행동 조각을 A → B → C 순서로 누릅니다.", "scramble", ["washed", "cleaned", "threw away"], "and", "마지막 연결만 금빛으로 표시됩니다.")
    ]),
    "2-1": gameTutorial("who 설명 붙이기", "blue", [
      gameStep("A와 B에서 같은 사람을 찾아 누릅니다.", "tap", ["I saw a girl.", "She was crying."], "girl / She", "같은 사람을 한 번만 남깁니다."),
      gameStep("B의 사람을 who로 바꾸어 명사 뒤에 붙입니다.", "drag", ["a girl", "who was crying"], "who", "a girl who was crying"),
      gameStep("합친 뒤에는 뜻 조각을 순서대로 정리합니다.", "scramble", ["울고 있던", "소녀를", "봤다"], "소녀", "파란 설명 덩어리를 통째로 읽습니다.")
    ]),
    "2-2": gameTutorial("설명을 문장 중간에 끼우기", "blue", [
      gameStep("설명을 받을 명사를 먼저 찾습니다.", "tap", ["The girl is here.", "She came early."], "The girl", "명사가 삽입 위치가 됩니다."),
      gameStep("B가 + 조각으로 바뀌면 명사 뒤 슬롯으로 옮깁니다.", "drag", ["The girl  +  is here."], "who came early", "The girl who came early is here."),
      gameStep("삽입된 파란 덩어리를 건너뛰며 중심 문장도 확인합니다.", "split", ["The girl", "who came early", "is here"], "who came early", "The girl is here.")
    ]),
    "2-3": gameTutorial("which 설명 끼우기", "blue", [
      gameStep("두 문장에서 같은 물건을 찾아 약분합니다.", "tap", ["I found the book.", "I bought it."], "book / it", "사람이 아니라 물건입니다."),
      gameStep("물건 자리에 which를 넣고 설명을 이동합니다.", "insert", ["the book  +"], "which I bought", "the book which I bought"),
      gameStep("완성 문장과 번역을 조각 순서로 맞춥니다.", "scramble", ["내가 샀던", "그 책을", "찾았다"], "그 책", "which 덩어리를 한 묶음으로 봅니다.")
    ]),
    "2-4": gameTutorial("which를 where·when·why로 바꾸기", "blue", [
      gameStep("문장 끝 전치사를 which 앞으로 드래그합니다.", "drag", ["the place which I live in"], "in", "the place in which I live"),
      gameStep("전치사 + which를 눌러 짧은 관계사로 바꿉니다.", "compress", ["in which"], "where", "the place where I live"),
      gameStep("장소·시간·이유에 맞는 변환을 고릅니다.", "scramble", ["in which", "on which", "for which"], "where · when · why", "색이 같은 조각끼리 대응합니다.")
    ]),
    "3-1": gameTutorial("to + 동사로 압축하기", "blue", [
      gameStep("겹치거나 없어도 되는 설명 성분을 눌러 약분합니다.", "fade", ["a report which I must write"], "which I must", "핵심 명사와 동사는 남깁니다."),
      gameStep("남은 동사 앞에 to를 붙여 짧게 압축합니다.", "compress", ["a report · write"], "to", "a report to write"),
      gameStep("완성된 영어와 한국어 조각의 순서를 맞춥니다.", "scramble", ["써야 할", "보고서"], "to write", "압축 덩어리를 명사 뒤에서 읽습니다.")
    ]),
    "3-2": gameTutorial("동명사 덩어리로 압축하기", "orange", [
      gameStep("강조된 절에서 줄일 부분을 눌러 흐리게 만듭니다.", "fade", ["That he lied surprised me."], "That he", "동작 lied가 중심입니다."),
      gameStep("빈자리에 소유격 + ing 표현을 타이핑합니다.", "type", ["___ surprised me."], "his lying", "His lying surprised me."),
      gameStep("마지막에는 뜻 조각을 한 덩어리로 조립합니다.", "scramble", ["그가", "거짓말한 것이", "나를 놀라게 했다"], "거짓말한 것", "행동 전체를 명사처럼 읽습니다.")
    ]),
    "3-3": gameTutorial("관계절을 짧게 접기", "orange", [
      gameStep("who·that·which와 be를 찾아 차례로 누릅니다.", "fade", ["the boy who is tall"], "who is", "줄여도 뜻이 남는 부분입니다."),
      gameStep("남은 설명을 짧은 수식 표현으로 압축합니다.", "compress", ["the boy · tall"], "tall", "the tall boy"),
      gameStep("섞인 영어와 뜻 조각을 순서대로 복원합니다.", "scramble", ["the", "tall", "boy"], "tall", "짧아진 설명 위치를 확인합니다.")
    ]),
    "3-4": gameTutorial("뒤 설명을 앞으로 옮기기", "blue", [
      gameStep("명사 뒤의 긴 설명 덩어리를 먼저 찾습니다.", "tap", ["an island that was lost for a long time"], "that was lost for a long time", "파란 밑줄이 이동할 덩어리입니다."),
      gameStep("짧아진 수식어를 명사 앞 슬롯으로 드래그합니다.", "drag", ["an  +  island"], "long-lost", "a long-lost island"),
      gameStep("앞수식 완성 순서와 뜻 순서를 맞춥니다.", "scramble", ["a", "long-lost", "island"], "long-lost", "수식어가 명사 앞에 붙습니다.")
    ]),
    "3-5": gameTutorial("숨은 관계절 복원하기", "blue", [
      gameStep("짧은 표현 사이에 나타나는 + 슬롯을 살펴봅니다.", "tap", ["reports  +  submitted yesterday"], "+", "숨은 단어가 들어갈 자리입니다."),
      gameStep("제공된 that·be 조각을 알맞은 슬롯에 넣습니다.", "insert", ["reports  +  +  submitted yesterday"], "that were", "reports that were submitted yesterday"),
      gameStep("복원된 문장을 보고 원래 뜻을 순서대로 맞춥니다.", "scramble", ["어제", "제출된", "보고서들"], "that were", "숨은 구조를 눈으로 확인합니다.")
    ]),
    "3-6": gameTutorial("명사형을 동사 하나로 바꾸기", "orange", [
      gameStep("문장 속 긴 명사형 표현을 먼저 누릅니다.", "tap", ["They made a decision."], "made a decision", "강조된 덩어리가 바꿀 대상입니다."),
      gameStep("같은 뜻의 동사 한 단어만 타이핑합니다.", "type", ["They ___ ."], "decided", "They decided."),
      gameStep("완성된 동사형 문장과 뜻을 연결합니다.", "scramble", ["그들은", "결정했다"], "decided", "긴 표현을 짧은 동사로 읽습니다.")
    ]),
    "4-1": gameTutorial("자리로 품사 판별하기", "blue", [
      gameStep("A와 B에서 같은 모양의 단어를 찾습니다.", "tap", ["Drink water.", "Water the plant."], "water", "단어 모양은 같아도 자리가 다릅니다."),
      gameStep("좌우 화살표로 A·B 문장을 오가며 뜻을 비교합니다.", "switch", ["water = 물", "water = 물을 주다"], "A ↔ B", "명사 / 동사"),
      gameStep("현재 보이는 문장의 번역 조각만 골라 완성합니다.", "scramble", ["물을", "마셔라", "화분에 물을 줘라"], "A / B", "활성 박스에 맞는 뜻을 고릅니다.")
    ]),
    "4-2": gameTutorial("문맥으로 여러 뜻 고르기", "blue", [
      gameStep("두 문장에서 반복되는 중심 단어를 찾습니다.", "tap", ["propose a plan", "propose to her"], "propose", "뿌리는 같지만 대상이 다릅니다."),
      gameStep("A·B를 전환하며 문맥에 맞는 뜻을 확인합니다.", "switch", ["계획을 제안하다", "그녀에게 청혼하다"], "A ↔ B", "문맥이 뜻을 결정합니다."),
      gameStep("각 화면에 맞는 번역 조각을 따로 조립합니다.", "scramble", ["제안했다", "청혼했다"], "propose", "같은 단어를 한 뜻으로 고정하지 않습니다.")
    ]),
    "4-3": gameTutorial("대명사 속 명사 찾기", "blue", [
      gameStep("one·another·the other 같은 대명사를 누릅니다.", "tap", ["a black bag and a brown one"], "one", "앞에서 반복된 명사가 숨어 있습니다."),
      gameStep("누른 자리에 숨은 명사가 동시에 드러납니다.", "reveal", ["a brown one"], "bag", "a brown bag"),
      gameStep("드러난 명사를 포함해 전체 뜻을 맞춥니다.", "scramble", ["검은 가방과", "갈색 가방"], "bag", "대명사가 무엇을 대신했는지 확인합니다.")
    ]),
    "5-1": gameTutorial("원문을 명사구로 다시 조립하기", "blue", [
      gameStep("원문 단어를 눌러 아래 빈 슬롯으로 옮깁니다.", "drag", ["Kevin ate sushi."], "sushi · Kevin · ate", "the sushi Kevin ate"),
      gameStep("변형이 필요한 동사는 한 번 더 눌러 p.p로 바꿉니다.", "pp", ["eat"], "eat → eaten", "바뀔 때 짧게 흔들립니다."),
      gameStep("완성한 명사구와 번역 조각을 순서대로 맞춥니다.", "scramble", ["Kevin이", "먹은", "초밥"], "the sushi", "원문 단어를 재사용합니다.")
    ]),
    "5-1b": gameTutorial("관계 표현으로 뒤집기", "blue", [
      gameStep("원문 단어를 눌러 중간 표현을 먼저 만듭니다.", "drag", ["Kevin ate sushi."], "Kevin · ate", "the sushi Kevin ate"),
      gameStep("앞 명사구를 다시 눌러 관계 표현으로 변환합니다.", "flip", ["the sushi Kevin ate"], "the sushi that Kevin ate", "원문과 뒤집힌 표현을 비교합니다."),
      gameStep("마지막 조립판에서 목표 표현 조각을 차례로 고릅니다.", "scramble", ["the sushi", "that", "Kevin ate"], "that", "마지막 조각을 다시 누르면 취소됩니다.")
    ]),
    "5-2": gameTutorial("사건을 명사구로 뒤집기", "orange", [
      gameStep("먼저 원래 영어 문장을 작은 조각으로 조립합니다.", "scramble", ["Prices", "rose", "quickly"], "rose", "Prices rose quickly."),
      gameStep("사건을 뒤집어 형용사 + 명사 + of 구조로 바꿉니다.", "flip", ["Prices rose quickly."], "rapid rise", "the rapid rise of prices"),
      gameStep("원문형과 명사구형 중 제시된 쪽의 뜻을 완성합니다.", "switch", ["사건", "사건의 이름"], "원문 ↔ 뒤집기", "두 표현의 대응을 익힙니다.")
    ]),
    "6-1": gameTutorial("한 사건을 큰 문장에 넣기", "orange", [
      gameStep("A문장을 눌러 그 자리에서 명사구 만들기를 엽니다.", "tap", ["The committee approved the schedule."], "A", "원문 박스 안에서 화면이 바뀝니다."),
      gameStep("원문 단어를 슬롯에 넣어 사건 이름을 만듭니다.", "bundle", ["approved · schedule"], "approval", "the approval of the schedule"),
      gameStep("B의 It을 눌러 만든 명사구로 교체합니다.", "insert", ["It was welcomed."], "the approval of the schedule", "The approval of the schedule was welcomed."),
    ]),
    "6-2": gameTutorial("두 사건을 묶어 넣기", "orange", [
      gameStep("A와 B를 각각 눌러 명사구를 하나씩 만듭니다.", "bundle", ["Prices rose.", "Unemployment increased."], "A · B", "두 사건이 각각 이름표가 됩니다."),
      gameStep("완성된 두 명사구를 and로 연결합니다.", "insert", ["the rise of prices", "the increase in unemployment"], "and", "하나의 큰 주어 덩어리"),
      gameStep("C의 It을 눌러 큰 덩어리로 교체합니다.", "compress", ["It worried people."], "A and B", "The rise of prices and the increase in unemployment worried people."),
    ]),
    "6-3": gameTutorial("명사구를 문장 중간에 넣기", "blue", [
      gameStep("A·B 사건을 각각 명사구로 접어 둡니다.", "bundle", ["The policy changed.", "People reacted."], "A · B", "먼저 쓸 수 있는 덩어리로 만듭니다."),
      gameStep("about·of·for 같은 전치사 뒤 슬롯을 찾습니다.", "tap", ["We talked about  +  ."], "about +", "문장 중간도 삽입 위치가 됩니다."),
      gameStep("접은 명사구를 그 슬롯으로 드래그합니다.", "drag", ["We talked about  +  ."], "the change in policy", "We talked about the change in policy."),
    ]),
    "6-4": gameTutorial("압축 명사구 해체하기", "blue", [
      gameStep("문장 안에서 사건 전체를 이름처럼 묶은 부분을 누릅니다.", "tap", ["The rapid rise of prices worried us."], "The rapid rise of prices", "명사구별 밑줄색을 따라갑니다."),
      gameStep("선택한 명사구의 한국어 빈칸을 조각으로 채웁니다.", "scramble", ["물가가", "빠르게", "오름"], "빠르게 오름", "완료된 덩어리는 초록으로 바뀝니다."),
      gameStep("모든 명사구를 해체한 뒤 전체 해석을 조립합니다.", "reveal", ["the rapid rise of prices"], "Prices rose rapidly.", "접힌 사건을 원래 문장으로 펼칩니다."),
    ]),
    "6-5": gameTutorial("문장과 조각 스위치", "gold", [
      gameStep("A·B·C·D를 읽고 중심 동사가 있는지 살펴봅니다.", "tap", ["The files you requested", "The files arrived"], "중심 동사", "길이만 보고 판단하지 않습니다."),
      gameStep("각 카드의 스위치를 문장 또는 조각 쪽으로 옮깁니다.", "classify", ["조각", "문장"], "OFF ↔ ON", "스위치와 카드색이 함께 바뀝니다."),
      gameStep("네 카드를 모두 정한 뒤 한 번에 확인합니다.", "switch", ["A  조각", "B  문장", "C  조각", "D  문장"], "제출", "틀린 카드만 다시 조정하면 됩니다."),
    ]),
  };

  function gameTutorial(title, accent, steps) {
    return { title, accent, steps };
  }

  function gameStep(title, kind, source, focus, result) {
    return { title, kind, source, focus, result };
  }

  function getAccentStyle(accent) {
    const palettes = {
      gold: {
        main: "#b87808",
        dark: "#714000",
        soft: "#fff2c9",
        glow: "rgba(222, 164, 31, .34)",
      },
      orange: {
        main: "#cf6716",
        dark: "#78300b",
        soft: "#ffead8",
        glow: "rgba(213, 121, 25, .30)",
      },
      blue: {
        main: "#2f62c8",
        dark: "#173d8d",
        soft: "#e7efff",
        glow: "rgba(47, 98, 200, .28)",
      },
    };
    return palettes[accent] || palettes.gold;
  }

  function buildTutorialDemo(step, accent) {
    const palette = getAccentStyle(accent);
    const sources = Array.isArray(step?.source) ? step.source : [step?.source];
    const kind = String(step?.kind || "tap");
    const focus = String(step?.focus || "");
    const result = String(step?.result || "");
    const style = `--htd-main:${palette.main};--htd-dark:${palette.dark};--htd-soft:${palette.soft};--htd-glow:${palette.glow};`;
    const sourceHtml = sources
      .filter((value) => value !== undefined && value !== null && String(value).trim())
      .map((value, index) => `<div class="htd-source-line" style="--htd-i:${index}">${escapeHtml(value)}</div>`)
      .join("");
    const focusLetters = Array.from(focus).map((letter, index) => (
      `<span class="htd-letter" style="--htd-i:${index}">${letter === " " ? "&nbsp;" : escapeHtml(letter)}</span>`
    )).join("");
    const chips = sources.map((value, index) => (
      `<span class="htd-chip" style="--htd-i:${index}">${escapeHtml(value)}</span>`
    )).join("");

    let actionHtml = `
      <span class="htd-hand" aria-hidden="true">◆</span>
      <span class="htd-focus">${escapeHtml(focus)}</span>
      <span class="htd-slot" aria-hidden="true"></span>
    `;
    if (kind === "type") {
      actionHtml = `<span class="htd-type-line">${focusLetters}<span class="htd-caret" aria-hidden="true"></span></span>`;
    } else if (kind === "scramble") {
      actionHtml = `<div class="htd-chip-rack">${chips}</div><div class="htd-chip-tray"><span>${escapeHtml(focus)}</span></div>`;
    } else if (kind === "switch" || kind === "classify") {
      actionHtml = `
        <span class="htd-switch-label">${escapeHtml(sources[0] || "A")}</span>
        <span class="htd-switch" aria-hidden="true"><span></span></span>
        <span class="htd-switch-label">${escapeHtml(sources[1] || "B")}</span>
      `;
    } else if (kind === "pp") {
      actionHtml = `
        <span class="htd-focus htd-focus-from">${escapeHtml(sources[0] || focus)}</span>
        <span class="htd-transform-arrow">→</span>
        <span class="htd-focus htd-focus-to">${escapeHtml(focus)}</span>
      `;
    }

    return `
      <div class="herma-tutorial-demo is-${escapeHtml(kind)}" style="${style}">
        <div class="htd-source">${sourceHtml}</div>
        <div class="htd-action">${actionHtml}</div>
        <div class="htd-result"><span>✓</span>${escapeHtml(result)}</div>
      </div>
    `;
  }

  function ensureTutorialStyles() {
    if (document.getElementById("herma-game-tutorial-styles")) return;
    const style = document.createElement("style");
    style.id = "herma-game-tutorial-styles";
    style.textContent = `
      @import url("https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap");

      .herma-tutorial-demo {
        position: relative;
        min-height: 142px;
        padding: 12px 13px 11px;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--htd-main) 42%, #fff);
        border-radius: 14px;
        background:
          radial-gradient(circle at 92% 8%, var(--htd-glow), transparent 31%),
          linear-gradient(145deg, #fffdf8 0%, #fffaf0 54%, var(--htd-soft) 155%);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.94), 0 7px 16px rgba(74,42,8,.08);
        color: #362718;
        font-family: inherit;
      }
      .herma-tutorial-demo::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(112deg, transparent 32%, rgba(255,255,255,.62) 48%, transparent 64%);
        transform: translateX(-115%);
        animation: herma-tutorial-sheen 4.8s ease-in-out 1s infinite;
        animation-iteration-count: infinite !important;
      }
      .htd-source {
        position: relative;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 5px 8px;
        min-height: 44px;
        margin-top: 2px;
      }
      .htd-source-line {
        padding: 6px 9px;
        border: 1px solid rgba(91,65,35,.12);
        border-radius: 8px;
        background: rgba(255,255,255,.78);
        box-shadow: 0 2px 4px rgba(56,36,12,.07);
        color: #4a3824;
        font-size: 12px;
        font-weight: 750;
        line-height: 1.15;
      }
      .htd-source-line:nth-child(even) {
        border-color: color-mix(in srgb, var(--htd-main) 28%, transparent);
        background: color-mix(in srgb, var(--htd-soft) 48%, white);
      }
      .htd-action {
        position: relative;
        z-index: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 7px;
        min-height: 34px;
      }
      .htd-focus,
      .htd-type-line,
      .htd-chip,
      .htd-chip-tray,
      .htd-switch-label {
        color: var(--htd-dark);
        font-size: 11px;
        font-weight: 900;
      }
      .htd-focus {
        position: relative;
        z-index: 2;
        padding: 5px 9px;
        border: 1.5px solid var(--htd-main);
        border-radius: 8px;
        background: var(--htd-soft);
        box-shadow: 0 0 0 0 var(--htd-glow);
        white-space: nowrap;
        animation: herma-tutorial-focus 2.7s ease-in-out infinite;
        animation-iteration-count: infinite !important;
      }
      .htd-hand {
        position: absolute;
        z-index: 4;
        left: calc(50% - 6px);
        bottom: -1px;
        color: var(--htd-dark);
        font-size: 9px;
        filter: drop-shadow(0 2px 1px rgba(0,0,0,.14));
        transform: rotate(45deg);
        animation: herma-tutorial-hand 2.7s ease-in-out infinite;
        animation-iteration-count: infinite !important;
      }
      .htd-slot {
        width: 48px;
        height: 25px;
        border: 1.5px dashed color-mix(in srgb, var(--htd-main) 62%, transparent);
        border-radius: 8px;
        background: color-mix(in srgb, var(--htd-soft) 48%, transparent);
      }
      .htd-result {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        min-height: 20px;
        color: #27733d;
        font-size: 10px;
        font-weight: 800;
        line-height: 1.2;
        text-align: center;
        opacity: .32;
        transform: translateY(4px);
        animation: herma-tutorial-result 2.7s ease-in-out infinite;
        animation-iteration-count: infinite !important;
      }
      .htd-result span {
        display: grid;
        width: 15px;
        height: 15px;
        place-items: center;
        border-radius: 50%;
        background: #daf3df;
        color: #23723a;
        font-size: 9px;
      }
      .htd-type-line {
        min-width: 88px;
        padding: 5px 8px;
        border-bottom: 2px solid var(--htd-main);
        text-align: left;
      }
      .htd-letter {
        opacity: .12;
        animation: herma-tutorial-letter 3.2s ease-in-out infinite;
        animation-delay: calc(var(--htd-i) * .10s);
        animation-iteration-count: infinite !important;
      }
      .htd-caret {
        display: inline-block;
        width: 1px;
        height: 12px;
        margin-left: 2px;
        vertical-align: -2px;
        background: var(--htd-dark);
        animation: herma-tutorial-caret .7s step-end infinite;
        animation-iteration-count: infinite !important;
      }
      .htd-chip-rack { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; }
      .htd-chip {
        display: inline-flex;
        padding: 4px 6px;
        border: 1px solid color-mix(in srgb, var(--htd-main) 36%, #ddd);
        border-radius: 7px;
        background: #fff;
        box-shadow: 0 2px 0 color-mix(in srgb, var(--htd-main) 18%, #ddd);
        animation: herma-tutorial-chip 3.2s ease-in-out infinite;
        animation-delay: calc(var(--htd-i) * .22s);
        animation-iteration-count: infinite !important;
      }
      .htd-chip-tray {
        min-width: 44px;
        padding: 5px 7px;
        border: 1.5px dashed var(--htd-main);
        border-radius: 8px;
        background: var(--htd-soft);
        text-align: center;
      }
      .htd-switch {
        position: relative;
        width: 47px;
        height: 24px;
        border: 1px solid color-mix(in srgb, var(--htd-main) 48%, #aaa);
        border-radius: 999px;
        background: #ece6dc;
        box-shadow: inset 0 2px 4px rgba(49,30,8,.13);
        animation: herma-tutorial-switch-bg 3s ease-in-out infinite;
        animation-iteration-count: infinite !important;
      }
      .htd-switch > span {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 2px 5px rgba(0,0,0,.22);
        animation: herma-tutorial-switch 3s ease-in-out infinite;
        animation-iteration-count: infinite !important;
      }
      .htd-transform-arrow { color: var(--htd-main); font-weight: 900; }
      .htd-focus-to { animation-name: herma-tutorial-transform-to; }
      .htd-focus-from { animation-name: herma-tutorial-transform-from; }

      .herma-tutorial-demo.is-fade .htd-focus { animation-name: herma-tutorial-fade; }
      .herma-tutorial-demo.is-drag .htd-focus,
      .herma-tutorial-demo.is-insert .htd-focus { animation-name: herma-tutorial-drag; }
      .herma-tutorial-demo.is-compress .htd-focus,
      .herma-tutorial-demo.is-bundle .htd-focus { animation-name: herma-tutorial-compress; }
      .herma-tutorial-demo.is-reveal .htd-focus { animation-name: herma-tutorial-reveal; }
      .herma-tutorial-demo.is-flip .htd-focus,
      .herma-tutorial-demo.is-split .htd-focus { animation-name: herma-tutorial-flip; }

      @keyframes herma-tutorial-sheen {
        0%, 62% { transform: translateX(-115%); }
        82%, 100% { transform: translateX(115%); }
      }
      @keyframes herma-tutorial-focus {
        0%, 18%, 100% { transform: scale(1); box-shadow: 0 0 0 0 var(--htd-glow); }
        34%, 55% { transform: scale(1.06); box-shadow: 0 0 0 6px transparent; }
      }
      @keyframes herma-tutorial-hand {
        0%, 10%, 100% { opacity: 0; transform: translate(13px, 8px) rotate(45deg); }
        24%, 42% { opacity: .9; transform: translate(0, 0) rotate(45deg); }
        54%, 100% { opacity: 0; transform: translate(0, -2px) rotate(45deg); }
      }
      @keyframes herma-tutorial-result {
        0%, 50%, 100% { opacity: .25; transform: translateY(4px); }
        68%, 86% { opacity: 1; transform: translateY(0); }
      }
      @keyframes herma-tutorial-letter {
        0%, 12%, 100% { opacity: .12; }
        30%, 75% { opacity: 1; }
      }
      @keyframes herma-tutorial-caret { 0%, 48% { opacity: 1; } 49%, 100% { opacity: 0; } }
      @keyframes herma-tutorial-chip {
        0%, 12%, 100% { transform: translateY(0); background: #fff; }
        30%, 56% { transform: translateY(5px); background: var(--htd-soft); }
      }
      @keyframes herma-tutorial-switch {
        0%, 18%, 100% { transform: translateX(0); }
        42%, 78% { transform: translateX(23px); }
      }
      @keyframes herma-tutorial-switch-bg {
        0%, 18%, 100% { background: #ece6dc; }
        42%, 78% { background: var(--htd-main); }
      }
      @keyframes herma-tutorial-fade {
        0%, 18%, 100% { opacity: 1; transform: scale(1); filter: saturate(1); }
        48%, 80% { opacity: .2; transform: scale(.88); filter: saturate(0); }
      }
      @keyframes herma-tutorial-drag {
        0%, 18%, 100% { transform: translateX(0) scale(1); }
        50%, 76% { transform: translateX(53px) scale(.92); }
      }
      @keyframes herma-tutorial-compress {
        0%, 18%, 100% { transform: scaleX(1); letter-spacing: normal; }
        52%, 78% { transform: scaleX(.72); letter-spacing: -.05em; }
      }
      @keyframes herma-tutorial-reveal {
        0%, 22%, 100% { clip-path: inset(0 100% 0 0); opacity: .2; }
        55%, 82% { clip-path: inset(0); opacity: 1; }
      }
      @keyframes herma-tutorial-flip {
        0%, 18%, 100% { transform: perspective(140px) rotateX(0); }
        50% { transform: perspective(140px) rotateX(92deg); }
        58%, 80% { transform: perspective(140px) rotateX(0); }
      }
      @keyframes herma-tutorial-transform-from {
        0%, 22%, 100% { opacity: 1; transform: scale(1); }
        48%, 80% { opacity: .18; transform: scale(.78); }
      }
      @keyframes herma-tutorial-transform-to {
        0%, 35%, 100% { opacity: .18; transform: scale(.78); }
        58%, 82% { opacity: 1; transform: scale(1.05); }
      }

      /* Herma front pages use the current Aisth stage and surface system. */
      #cafe_int:has(#quiz-area .lip-intro) {
        position: absolute !important;
        top: 14px !important;
        left: 50% !important;
        width: 340px !important;
        height: 596px !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        transform: translateX(-50%) !important;
        border-radius: 20px !important;
        background:
          radial-gradient(circle at 15% 22%, rgba(29,104,173,.20), transparent 28%),
          radial-gradient(circle at 84% 78%, rgba(170,30,62,.17), transparent 30%),
          linear-gradient(118deg, transparent 0 56%, rgba(70,132,185,.11) 56.4% 57.1%, transparent 57.5% 100%),
          repeating-linear-gradient(92deg, rgba(255,255,255,.022) 0 1px, transparent 1px 18px),
          linear-gradient(135deg, #0b0f14 0%, #252c34 46%, #11151b 100%) !important;
        box-shadow:
          inset 0 0 0 2px rgba(117,145,174,.18),
          inset 0 0 34px rgba(0,0,0,.38),
          -4px 0 18px rgba(25,92,151,.12),
          4px 0 18px rgba(151,24,54,.10) !important;
      }
      #quiz-area:has(.lip-intro) {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 12px !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        border: 2px dashed rgba(143,199,183,.78) !important;
        border-radius: 20px !important;
        background:
          linear-gradient(126deg, transparent 0 18%, rgba(50,113,174,.12) 18.2% 18.7%, transparent 19% 100%),
          linear-gradient(58deg, transparent 0 73%, rgba(169,38,67,.10) 73.2% 73.8%, transparent 74.1% 100%),
          repeating-linear-gradient(90deg, #0c1015 0 28px, #171c23 28px 58px, #252b33 58px 86px) !important;
        border-color: rgba(102,128,156,.82) !important;
      }
      .main-page:has(#quiz-area .lip-intro) > #back-btn {
        position: absolute !important;
        right: 12px !important;
        bottom: 12px !important;
        z-index: 5 !important;
        width: auto !important;
        min-width: 86px !important;
        height: 34px !important;
        margin: 0 !important;
        padding: 0 14px !important;
        border: 1px solid rgba(143,199,183,.58) !important;
        border-radius: 999px !important;
        background: linear-gradient(100deg, #173f62 0%, #202832 52%, #652033 100%) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,.24), inset 0 -2px 0 rgba(0,0,0,.18) !important;
        color: #fff !important;
      }
      #quiz-area .lip-intro {
        display: flex !important;
        height: 100% !important;
        min-height: 0 !important;
        color: #2b231c !important;
        font-family: "Gowun Batang", serif !important;
      }
      #quiz-area .lip-card {
        position: relative !important;
        display: flex !important;
        flex: 1 1 auto !important;
        flex-direction: column !important;
        height: 100% !important;
        min-height: 0 !important;
        padding: 13px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        border: 1px solid rgba(143,199,183,.82) !important;
        border-radius: 18px !important;
        background:
          linear-gradient(90deg, rgba(43,115,177,.44), rgba(171,43,69,.30)) 22px 25px / calc(100% - 44px) 1px no-repeat,
          linear-gradient(180deg, rgba(43,115,177,.28), rgba(171,43,69,.20)) calc(100% - 22px) 25px / 1px calc(100% - 50px) no-repeat,
          linear-gradient(90deg, rgba(171,43,69,.24), rgba(43,115,177,.34)) 22px calc(100% - 25px) / calc(100% - 44px) 1px no-repeat,
          linear-gradient(180deg, rgba(43,115,177,.24), rgba(171,43,69,.18)) 22px 25px / 1px calc(100% - 50px) no-repeat,
          linear-gradient(180deg, #fffefb 0%, #fff8ec 100%) !important;
        box-shadow: 0 12px 24px rgba(0,0,0,.18), -1px 0 0 rgba(43,115,177,.22), 1px 0 0 rgba(171,43,69,.18) !important;
      }
      #quiz-area .lip-card::before,
      #quiz-area .lip-card::after {
        content: "";
        position: absolute;
        z-index: 0;
        pointer-events: none;
        background: url("herma-raven-cluster.svg") center / 100% 100% no-repeat;
        filter: drop-shadow(0 0 8px rgba(26,62,99,.28));
      }
      #quiz-area .lip-card::before {
        top: -9px;
        right: -22px;
        width: 238px;
        height: 166px;
        opacity: 1;
        transform: scaleX(-1) rotate(-3deg);
      }
      #quiz-area .lip-card::after {
        left: -24px;
        bottom: -9px;
        width: 226px;
        height: 158px;
        opacity: .88;
        transform: rotate(178deg);
      }
      #quiz-area .lip-card > * { position: relative; z-index: 1; }
      #quiz-area .lip-page-label {
        margin-bottom: 2px !important;
        font-size: 18px !important;
        background: linear-gradient(90deg, #155c94 0%, #155c94 48%, #a52948 78%, #a52948 100%);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent !important;
        -webkit-text-fill-color: transparent;
      }
      #quiz-area .lip-title {
        margin-bottom: 9px !important;
        color: #9c2e49 !important;
        font-size: 14px !important;
      }
      #quiz-area .lip-progress {
        margin-top: 7px !important;
        margin-bottom: 8px !important;
        padding-top: 8px !important;
        border-top: 1px solid rgba(52,100,148,.27) !important;
      }
      #quiz-area .lip-progress-dot { background: rgba(41,84,126,.16) !important; }
      #quiz-area .lip-progress-dot.is-active {
        background: linear-gradient(135deg, #2178b4 0 48%, #b42d4c 52% 100%) !important;
        box-shadow: 0 0 0 3px rgba(74,103,141,.18), -2px 0 7px rgba(34,119,183,.20), 2px 0 7px rgba(180,45,76,.18) !important;
      }
      #quiz-area .lip-progress-label { color: #275e91 !important; }
      #quiz-area .lip-step-shell {
        display: flex !important;
        flex: 1 1 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }
      #quiz-area .lip-step-card {
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        gap: 12px !important;
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        padding: 13px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        border: 1px solid rgba(151,191,208,.86) !important;
        border-radius: 16px !important;
        background:
          linear-gradient(142deg, transparent 0 72%, rgba(122,216,240,.14) 72.3% 72.9%, transparent 73.2% 100%),
          linear-gradient(180deg, #e9f5ee 0%, #dbeef1 100%) !important;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.72), 0 6px 14px rgba(0,0,0,.08) !important;
      }
      #quiz-area .lip-step-card .lip-step-text {
        flex: 0 0 auto !important;
        margin: 0 !important;
        padding: 7px 13px 3px !important;
      }
      #quiz-area .lip-step-headline {
        color: #2b231c !important;
        font-size: 18px !important;
        line-height: 1.34 !important;
      }
      #quiz-area .herma-step-number { color: #a32745; }
      #quiz-area .herma-step-copy { color: #214f79; }
      #quiz-area .lip-step-card .lip-example {
        display: flex !important;
        flex: 1 1 auto !important;
        flex-direction: column !important;
        justify-content: flex-start !important;
        width: 100% !important;
        min-height: 0 !important;
        padding: 13px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        border: 1px solid rgba(151,191,208,.86) !important;
        border-radius: 14px !important;
        background: #fff !important;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.92), 0 6px 14px rgba(0,0,0,.06) !important;
      }
      #quiz-area .lip-step-card .lip-example-label {
        flex: 0 0 auto !important;
        margin: 0 0 8px !important;
        padding: 0 0 8px !important;
        border-bottom: 1px solid rgba(48,100,151,.25) !important;
        color: #a12d48 !important;
      }
      #quiz-area .lip-step-card .lip-example > :not(.lip-example-label):not(style) {
        flex: 1 1 auto !important;
        min-height: 0 !important;
        width: 100% !important;
      }
      #quiz-area .lip-actions { margin-top: 10px !important; }
      #quiz-area .lip-btn {
        min-height: 43px !important;
        border: 1px solid rgba(92,116,143,.66) !important;
        border-radius: 12px !important;
        color: #e9ffff !important;
        background:
          linear-gradient(90deg, rgba(27,98,156,.30), transparent 30% 70%, rgba(164,35,66,.27)),
          repeating-linear-gradient(90deg, rgba(255,255,255,.018) 0 18px, rgba(0,0,0,.035) 18px 36px),
          linear-gradient(180deg, #29313a 0%, #151a20 100%) !important;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 5px 12px rgba(0,0,0,.24) !important;
      }

      /* The example itself is animation content, not another panel. */
      #quiz-area .herma-tutorial-demo {
        display: flex !important;
        flex: 1 1 auto !important;
        flex-direction: column !important;
        justify-content: center !important;
        min-height: 0 !important;
        padding: 0 3px !important;
        overflow: visible !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }
      #quiz-area .herma-tutorial-demo::after,
      #quiz-area .htd-status { display: none !important; }
      #quiz-area .htd-source { margin-top: 0 !important; }
      #quiz-area .htd-source-line {
        border-color: rgba(79,160,142,.24) !important;
        background: rgba(255,255,255,.9) !important;
        color: #203736 !important;
      }
      #quiz-area .htd-source-line:nth-child(even) {
        border-color: rgba(150,105,222,.22) !important;
        background: rgba(223,243,236,.66) !important;
      }
      #quiz-area .htd-action { min-height: 40px !important; }
      #quiz-area .htd-result { min-height: 23px !important; color: #2f8f68 !important; }
      @media (prefers-reduced-motion: reduce) {
        .herma-tutorial-demo *, .herma-tutorial-demo::after { animation-duration: 8s !important; }
      }
      @media (max-width: 520px) {
        .herma-tutorial-demo { min-height: 0; padding-inline: 2px; }
        .htd-source-line { font-size: 10px; padding: 5px 6px; }
        .htd-result { font-size: 9px; }
      }
    `;
    document.head.appendChild(style);
  }

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

  function normalizeSteps(entry, key) {
    const tutorial = GAME_TUTORIALS[key];
    if (tutorial) {
      return tutorial.steps.slice(0, 5).map((step, index) => ({
        title: renumberStepTitle(step.title, index),
        titleHtml: `<span class="herma-step-number">${index + 1}단계:</span> <span class="herma-step-copy">${escapeHtml(step.title)}</span>`,
        body: "",
        exampleHtml: buildTutorialDemo(step, tutorial.accent),
      }));
    }
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
    const tutorial = GAME_TUTORIALS[key];
    const tutorialTitle = tutorial?.title || entry.title;
    const title = entry.unitTitle ? `${entry.unitTitle} · ${tutorialTitle}` : tutorialTitle;

    return {
      pageLabel,
      title,
      nextLabel: "다음",
      primaryLabel: String(options?.startLabel || "시작"),
      onPrimary: options?.onStart,
      steps: normalizeSteps(entry, key),
    };
  }

  function prepareIntroShell(container) {
    const cafe = container?.closest?.("#cafe_int");
    const page = cafe?.closest?.(".main-page");
    const backButton = cafe?.querySelector?.(":scope > #back-btn");
    if (!cafe || !page || !backButton) return () => {};

    const marker = document.createComment("herma-back-button-home");
    cafe.insertBefore(marker, backButton);
    page.appendChild(backButton);
    let restored = false;

    return () => {
      if (restored) return;
      restored = true;
      if (marker.parentNode) marker.parentNode.insertBefore(backButton, marker);
      marker.remove();
    };
  }

  function render(container, options) {
    if (!global.LessonIntroPlayer || typeof global.LessonIntroPlayer.render !== "function") return false;
    const config = getConfig(options);
    if (!config) return false;
    ensureTutorialStyles();
    const restoreShell = prepareIntroShell(container);
    const onPrimary = config.onPrimary;
    config.onPrimary = () => {
      restoreShell();
      if (typeof onPrimary === "function") onPrimary();
    };
    const rendered = global.LessonIntroPlayer.render(container, config);
    if (!rendered) restoreShell();
    return rendered;
  }

  global.HermaIntroFronts = {
    getConfig,
    render,
    tutorials: GAME_TUTORIALS,
  };
})(window);
