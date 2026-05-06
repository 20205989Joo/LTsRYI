(function (global) {
  "use strict";

  const STYLE_ID = "pleks-intro-fronts-style";
  const INTRO_MAP = {
  "1-1": {
    "unitTitle": "\ubb38\uc7a5 \uc870\uac01\uc744 \uc21c\uc11c\ub300\ub85c \uc138\uc6b0\uae30",
    "title": "Block Ordering",
    "steps": [
      {
        "title": "\uc601\uc5b4 \ubb38\uc7a5\uc740 \uc870\uac01\uc744 \uc544\ubb34 \uc21c\uc11c\ub85c\ub098 \ub193\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uba3c\uc800 \uc911\uc2ec \ubf08\ub300\ub97c \uc138\uc6b0\uace0, \uc124\uba85 \uc870\uac01\uc744 \uc54c\ub9de\uc740 \uc790\ub9ac\uc5d0 \ubd99\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c block\ub4e4\uc744 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \uc601\uc5b4 \uc21c\uc11c\ub85c \ubc30\uc5f4\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "1-2": {
    "unitTitle": "\ubb38\uc7a5 \uc870\uac01\uc744 \uc21c\uc11c\ub300\ub85c \uc138\uc6b0\uae30",
    "title": "Block Ordering, No Korean",
    "steps": [
      {
        "title": "\uc774\ubc88\uc5d0\ub294 \ud55c\uad6d\uc5b4 \ub73b \uc5c6\uc774 \uc601\uc5b4 \uc870\uac01\ub9cc \ubcf4\uace0 \uc21c\uc11c\ub97c \uc7a1\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\ub2e8\uc5b4 \ub73b\ubcf4\ub2e4, \uc8fc\uc5b4\u00b7\ub3d9\uc0ac\u00b7\ubaa9\uc801\uc5b4\u00b7\uc124\uba85 \uc870\uac01\uc758 \uc790\ub9ac\ub97c \ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uc601\uc5b4 \uad6c\uc870\ub9cc \ubcf4\uace0 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \ubb38\uc7a5\uc744 \ub9cc\ub4e4\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "2-1": {
    "unitTitle": "\ubb38\uc7a5 \uc548\uc758 \uc911\uc2ec\ucd95 \ubcf4\uae30",
    "title": "Fragment Linking & Pivot",
    "steps": [
      {
        "title": "\ubb38\uc7a5 \uc548\uc5d0\ub294 \uc5ec\ub7ec \uc870\uac01\uc744 \uc5f0\uacb0\ud558\ub294 \uc911\uc2ec \ub2e8\uc5b4\uac00 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774 \uc911\uc2ec \ub2e8\uc5b4\ub97c pivot\ucc98\ub7fc \ubcf4\uace0, \uc55e\ub4a4 \uc870\uac01\uc774 \uc5b4\ub5bb\uac8c \ubd99\ub294\uc9c0 \ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uc5b4\ub5a4 \ub2e8\uc5b4\ub97c \uc911\uc2ec\uc73c\ub85c \uc758\ubbf8\uac00 \uc5f0\uacb0\ub418\ub294\uc9c0 \ucc3e\uc544\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "2-2": {
    "unitTitle": "\ubb38\uc7a5 \uc548\uc758 \uc911\uc2ec\ucd95 \ubcf4\uae30",
    "title": "Block Conversion",
    "steps": [
      {
        "title": "\ub530\ub85c \ub5a8\uc5b4\uc9c4 \uc870\uac01\ub4e4\ub3c4 \uc11c\ub85c \uacb9\uccd0 \ud558\ub098\uc758 \ubb38\uc7a5\uc774 \ub420 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc911\uc694\ud55c \uac83\uc740 \uc870\uac01\uc744 \uadf8\ub0e5 \ubd99\uc774\ub294 \uac8c \uc544\ub2c8\ub77c, \uc790\uc5f0\uc2a4\ub7fd\uac8c \ud3ec\uac1c\ub294 \uac83\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uacb9\uce58\ub294 \uc870\uac01\ub4e4\uc744 \ud558\ub098\uc758 \ubb38\uc7a5\uc73c\ub85c \uc870\ub9bd\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "2-3": {
    "unitTitle": "\ubb38\uc7a5 \uc548\uc758 \uc911\uc2ec\ucd95 \ubcf4\uae30",
    "title": "Pivot Split",
    "steps": [
      {
        "title": "\ud55c \ub2e8\uc5b4\ub294 \ubb38\uc7a5 \ubf08\ub300\uc5d0\ub3c4 \uc18d\ud558\uace0, \uc218\uc2dd \uc870\uac01\uc5d0\ub3c4 \uc18d\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "pivot\uc744 \uae30\uc900\uc73c\ub85c \ubb38\uc7a5\uc744 \ub098\ub204\uba74 \uacb9\uce5c \uad6c\uc870\uac00 \ubcf4\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uc911\uc2ec \ub2e8\uc5b4\ub97c \uae30\uc900\uc73c\ub85c \ubb38\uc7a5 \uc870\uac01\ub4e4\uc744 \ubd84\ub9ac\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-1": {
    "unitTitle": "\uac19\uc774 \uc77d\uc5b4\uc57c \ud558\ub294 \ub369\uc5b4\ub9ac \ubcf4\uae30",
    "title": "Chunk-based Translation",
    "steps": [
      {
        "title": "\uc601\uc5b4\ub294 \ub2e8\uc5b4 \ud558\ub098\uc529\uc774 \uc544\ub2c8\ub77c, \uac19\uc774 \ubd99\uc5b4 \ub2e4\ub2c8\ub294 \ub369\uc5b4\ub9ac\ub85c \uc77d\uc5b4\uc57c \ud569\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "afraid of, depend on, take care of \uac19\uc740 \ud45c\ud604\uc740 \ud55c chunk\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uc8fc\uc5b4\uc9c4 chunk\ub97c \uc911\uc2ec\uc73c\ub85c \ubb38\uc7a5\uc744 \ud574\uc11d\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-2": {
    "unitTitle": "\uac19\uc774 \uc77d\uc5b4\uc57c \ud558\ub294 \ub369\uc5b4\ub9ac \ubcf4\uae30",
    "title": "Chunk Identification",
    "steps": [
      {
        "title": "\uc774\ubc88\uc5d0\ub294 chunk\uac00 \ubbf8\ub9ac \uc8fc\uc5b4\uc9c0\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\ubb38\uc7a5 \uc548\uc5d0\uc11c \uac19\uc774 \uc77d\uc5b4\uc57c \ud558\ub294 \ub2e8\uc5b4 \ubb36\uc74c\uc744 \uc9c1\uc811 \ucc3e\uc544\uc57c \ud569\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \ubb38\uc7a5 \uc18d\uc5d0\uc11c \uc758\ubbf8\uac00 \ubd99\uc5b4 \uc788\ub294 chunk\ub97c \uace8\ub77c\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-3": {
    "unitTitle": "\uac19\uc774 \uc77d\uc5b4\uc57c \ud558\ub294 \ub369\uc5b4\ub9ac \ubcf4\uae30",
    "title": "Pivot + Chunk Translation",
    "steps": [
      {
        "title": "\ud558\ub098\uc758 \uc911\uc2ec \ub2e8\uc5b4\uc5d0 \uc5ec\ub7ec chunk\uac00 \ubd99\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "built by, built for\ucc98\ub7fc \uac19\uc740 \ub3d9\uc0ac\uc5d0 \ub2e4\ub978 \ubc29\ud5a5\uc758 \uc758\ubbf8\uac00 \ubd99\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c pivot\uc5d0 \ubd99\uc740 chunk\ub4e4\uc744 \ub098\ub204\uc5b4 \ud574\uc11d\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "3-4": {
    "unitTitle": "\uac19\uc774 \uc77d\uc5b4\uc57c \ud558\ub294 \ub369\uc5b4\ub9ac \ubcf4\uae30",
    "title": "Multi-Chunk Long Sentence Translation",
    "steps": [
      {
        "title": "\uae34 \ubb38\uc7a5\uc5d0\ub294 chunk\uac00 \ud558\ub098\ub9cc \uc788\ub294 \uac83\uc774 \uc544\ub2d9\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc5ec\ub7ec chunk\ub97c \uac01\uac01 \uc7a1\uc544\uc57c \uc804\uccb4 \ubb38\uc7a5\uc774 \ub35c \ubcf5\uc7a1\ud574\uc9d1\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uae34 \ubb38\uc7a5\uc744 chunk \ub2e8\uc704\ub85c \ub098\ub204\uc5b4 \ud574\uc11d\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "4-1": {
    "unitTitle": "\uae34 \ubb38\uc7a5\uc744 fragment\ub85c \ubcf4\uae30",
    "title": "Guided Fragments",
    "steps": [
      {
        "title": "\uae34 \ubb38\uc7a5\uc740 \ud558\ub098\uc758 \uc904\uc774 \uc544\ub2c8\ub77c \uc5ec\ub7ec \uc758\ubbf8 \uc870\uac01\uc73c\ub85c \uc774\ub8e8\uc5b4\uc838 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "fragment\ub294 \ubb38\uc7a5 \uc548\uc5d0\uc11c \uc758\ubbf8\ub97c \uac00\uc9c4 \uc791\uc740 \uc870\uac01\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uc81c\uc2dc\ub41c fragment\ub4e4\uc744 \ubcf4\uba70 \uc804\uccb4 \ubb38\uc7a5\uc758 \ub73b\uc744 \uc870\ub9bd\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "4-2": {
    "unitTitle": "\uae34 \ubb38\uc7a5\uc744 fragment\ub85c \ubcf4\uae30",
    "title": "Fragments to Sentence Reconstruction",
    "steps": [
      {
        "title": "\uc774\ubc88\uc5d0\ub294 fragment\ub4e4\uc744 \ubcf4\uace0 \uc6d0\ub798 \ubb38\uc7a5\uc744 \ub2e4\uc2dc \ub9cc\ub4ed\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uac01 \uc870\uac01\uc774 \uc8fc\uc5b4\uc778\uc9c0, \ub3d9\uc0ac\uad6c\uc778\uc9c0, \uc218\uc2dd\uc5b4\uc778\uc9c0 \ubd10\uc57c \ud569\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c fragment\ub4e4\uc744 \uc790\uc5f0\uc2a4\ub7ec\uc6b4 \uc601\uc5b4 \ubb38\uc7a5\uc73c\ub85c \uc7ac\uc870\ub9bd\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "4-3": {
    "unitTitle": "\uae34 \ubb38\uc7a5\uc744 fragment\ub85c \ubcf4\uae30",
    "title": "Fragments to Sentence Reconstruction \uc2ec\ud654",
    "steps": [
      {
        "title": "fragment\ub4e4\uc740 \ub2e8\uc21c\ud788 \ub098\uc5f4\ub41c \uc870\uac01\uc774 \uc544\ub2c8\ub77c \uc11c\ub85c \uc548\uae30\uace0 \uacb9\uce69\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc5b4\ub5a4 \uc870\uac01\uc740 \uba85\uc0ac\ub97c \uafb8\ubbf8\uace0, \uc5b4\ub5a4 \uc870\uac01\uc740 \ubb38\uc7a5 \uc804\uccb4\ub97c \uc124\uba85\ud569\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c fragment\ub4e4\uc758 \ud3ec\ud568 \uad00\uacc4\ub97c \ubcf4\uba70 \ubb38\uc7a5\uc744 \uc644\uc131\ud574\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "5-1": {
    "unitTitle": "\ubb38\uc7a5 \uad6c\uc870 \ud328\ud134 \ubcf4\uae30",
    "title": "Parallel Listing",
    "steps": [
      {
        "title": "A, B, and C\ucc98\ub7fc \ub098\uc5f4\ub41c \ub9d0\ub4e4\uc740 \ubcf4\ud1b5 \uac19\uc740 \uce35\uc704\uc5d0 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc911\uc694\ud55c \uac83\uc740 \uac01\uac01\uc758 \ub73b\ubcf4\ub2e4, \uc774\ub4e4\uc774 \uc5b4\ub5a4 \uacf5\ud1b5 \uc8fc\uc81c\ub85c \ubb36\uc774\ub294\uc9c0 \ubcf4\ub294 \uac83\uc785\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \ub098\ub780\ud788 \ub193\uc778 \ub9d0\ub4e4\uacfc \uadf8 \uacf5\ud1b5 \ubc94\uc8fc\ub97c \ucc3e\uc544\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "5-2": {
    "unitTitle": "\ubb38\uc7a5 \uad6c\uc870 \ud328\ud134 \ubcf4\uae30",
    "title": "Parallel Antithesis ??",
    "steps": [
      {
        "title": "\ub300\uc870 \ubb38\uc7a5\uc740 \ub450 \ub300\uc0c1\uacfc \ub450 \uc18d\uc131\uc774 \uc11c\ub85c \ub9c8\uc8fc \ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "A\ub294 X\uc774\uace0, B\ub294 Y\uc778 \uad6c\uc870\ub97c \uc7a1\uc73c\uba74 \ubb38\uc7a5\uc774 \uc120\uba85\ud574\uc9d1\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\ub300\uc870\ub97c \uc77d\uc744 \ub54c\ub294 \uba3c\uc800 \ube44\uad50\ub418\ub294 \ub450 \ub300\uc0c1\uc744 \ucc3e\uc544\uc57c \ud569\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\ub300\uc870 \ubb38\uc7a5\uc740 \uc55e\ubd80\ubd84\uc758 \uad6c\uc870\ub97c \ub4a4\uc5d0\uc11c\ub3c4 \uc774\uc5b4\uac11\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \ubb34\uc5c7\uacfc \ubb34\uc5c7\uc774 \ub300\uc870\ub418\ub294\uc9c0, \uac01\uac01 \uc5b4\ub5a4 \ud2b9\uc9d5\uc744 \uac16\ub294\uc9c0 \ucc3e\uc544\ubd05\ub2c8\ub2e4. / \uc774\uc81c \ubb38\uc7a5\uc5d0\uc11c \ub300\uc870\ub418\ub294 \ub450 \ucd95\uc744 \ucc3e\uc544\ubd05\ub2c8\ub2e4. / \uc774\uc81c \uc55e \ubb38\uc7a5\uc758 \uad6c\uc870\ub97c \ubcf4\uace0 \ub4a4\uc5d0 \uc62c \ud45c\ud604\uc744 \uace8\ub77c\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "5-3": {
    "unitTitle": "\ubb38\uc7a5 \uad6c\uc870 \ud328\ud134 \ubcf4\uae30",
    "title": "Restatement & Frame Echo ??",
    "steps": [
      {
        "title": "\ud55c \ubb38\uc7a5 \uc548\uc5d0\uc11c \uac19\uc740 \ub300\uc0c1\uc744 \ub2e4\ub978 \ub9d0\ub85c \ub2e4\uc2dc \uc124\uba85\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc5b4\ub824\uc6b4 \ub9d0 \ub4a4\uc5d0 \uc26c\uc6b4 \uc124\uba85\uc774 \ucf64\ub9c8\ub85c \ubd99\ub294 \uacbd\uc6b0\uac00 \ub9ce\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uae00\uc5d0\uc11c\ub294 \uac19\uc740 \uac1c\ub150\uc744 \ub611\uac19\uc740 \ub9d0\ub85c \ubc18\ubcf5\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc5b4\ub5a4 \ubb38\uc7a5\uc740 \uc758\ubbf8\ubfd0 \uc544\ub2c8\ub77c \uad6c\uc870\uc758 \ud2c0\ub3c4 \ubc18\ubcf5\ub429\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc55e \ubb38\uc7a5\uc5d0 \ub450 \uac1c\ub150\uc774 \ub098\uc624\uba74, \ub2e4\uc74c \ubb38\uc7a5\uc5d0\uc11c \ub458 \ub2e4 \ub2e4\ub978 \ub9d0\ub85c \uc774\uc5b4\uc9c8 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "5-4": {
    "unitTitle": "\ubb38\uc7a5 \uad6c\uc870 \ud328\ud134 \ubcf4\uae30",
    "title": "Emphasis & Inversion",
    "steps": [
      {
        "title": "\uc601\uc5b4\ub294 \uac15\uc870\ud558\ub824\uace0 \ubb38\uc7a5 \uc21c\uc11c\ub97c \ubc14\uafb8\uac70\ub098 \ud2b9\uc218\ud55c \ud2c0\uc744 \uc501\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "It was ~ that, only after, never \uac19\uc740 \ud45c\ud604\uc740 \uac15\uc870\ub41c \ubd80\ubd84\uc744 \ubcf4\uc5ec\uc90d\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \uac15\uc870\u00b7\ub3c4\uce58 \ubb38\uc7a5\uc744 \uc77c\ubc18\uc801\uc778 \uc758\ubbf8 \uc21c\uc11c\ub85c \ud480\uc5b4\ubd05\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      }
    ]
  },
  "6-1": {
    "unitTitle": "\uad6c\uc870\uc640 \uc870\uac01\uc744 \ud568\uaed8 \ubcf4\uae30",
    "title": "Pleks Final",
    "steps": [
      {
        "title": "\uae34 \ubb38\uc7a5\uc5d0\ub294 fragment, chunk, pivot, \ubcd1\ub82c, \ub300\uc870, \uc7ac\uc9c4\uc220\uc774 \ud568\uaed8 \ub4e4\uc5b4 \uc788\uc2b5\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uba3c\uc800 \ud070 \uad6c\uc870 \ud328\ud134\uc744 \ubcf4\uace0, \uadf8\ub2e4\uc74c \uc791\uc740 \uc758\ubbf8 \uc870\uac01\uc73c\ub85c \ub098\ub215\ub2c8\ub2e4.",
        "body": "",
        "rows": []
      },
      {
        "title": "\uc774\uc81c \ubb38\uc7a5\uc744 \uc790\uc2e0\uc774 \uc77d\uae30 \ud3b8\ud55c \ub2e8\uc704\ub85c \ub098\ub204\uace0, \uad6c\uc870\ub97c \ud568\uaed8 \ud45c\uc2dc\ud574\ubd05\ub2c8\ub2e4.",
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

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #quiz-content .lip-intro {
        max-width: 620px;
        margin: 0 auto;
      }

      #quiz-content .lip-card {
        border-radius: 12px;
        padding: 10px;
      }

      #quiz-content .lip-step-shell {
        min-height: 176px;
      }

      #quiz-content .lip-step-headline {
        font-size: 14px;
      }

      #quiz-content .lip-example-token {
        min-height: 30px;
        padding: 5px 10px;
        font-size: 13px;
      }
    `;
    document.head.appendChild(style);
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

    const pageLabel = String(options?.pageLabel || `Pleks L${String(options?.lesson ?? "").trim()}-E${String(options?.exercise ?? "").trim()}`);
    const title = entry.unitTitle ? `${entry.unitTitle} ? ${entry.title}` : entry.title;

    return {
      pageLabel,
      title,
      nextLabel: "다음",
      primaryLabel: String(options?.startLabel || "Start"),
      onPrimary: options?.onStart,
      steps: normalizeSteps(entry),
    };
  }

  function render(container, options) {
    if (!global.LessonIntroPlayer || typeof global.LessonIntroPlayer.render !== "function") return false;
    const config = getConfig(options);
    if (!config) return false;
    ensureStyles();
    return global.LessonIntroPlayer.render(container, config);
  }

  global.PleksIntroFronts = {
    getConfig,
    render,
  };
})(window);
