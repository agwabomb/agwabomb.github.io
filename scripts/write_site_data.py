# ASCII-only writer so UTF-8 Korean lands on disk correctly.
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
custom = json.loads((ROOT / "custom-games.json").read_text(encoding="utf-8"))

data = {
    "profile": {
        "handle": "agwabomb",
        "role": "\uac8c\uc784 \uc2dc\uc2a4\ud15c & \ub808\ubca8 \uae30\ud68d\uc790",
        "education": "\uc5f0\uc138\ub300\ud559\uad50 \ucc9c\ubb38\uc6b0\uc8fc\ud559\uacfc \ud559\uc0ac \ubc0f \uc11d\uc0ac \uc878\uc5c5",
        "stacks": ["Unreal Engine", "Unity", "C#", "Python", "Git/GitHub", "AI-Assisted Prototyping"],
        "links": {
            "email": {"label": "Contact \uc774\uba54\uc77c", "href": "mailto:zaqxsw0517b@gmail.com"},
            "github": {"label": "GitHub", "href": "https://github.com/agwabomb"},
            "blog": {"label": "\uac1c\uc778 \ube14\ub85c\uadf8", "href": "https://blanktie.tistory.com"},
            "itch": {"label": "itch.io \ud504\ub85c\ud1a0\ud0c0\uc785", "href": "https://agwabomb.itch.io"},
        },
    },
    "philosophy": [
        {
            "title": "\uad50\uc804 \uc21c\ud658 \ub3d9\uc120",
            "body": "\ud55c \ubc88\uc758 \uad50\uc804\uc774 \ub9f5\uc744 \ub05d\ub0b4\uc9c0 \uc54a\uac8c \ud569\ub2c8\ub2e4. \uc2dc\uc57c \ucc28\ub2e8, \uc6b0\ud68c\ub85c, \uc7ac\uc9d1\uacb0 \uc9c0\uc810\uc744 \uac19\uc740 \ub8e8\ud504\uc5d0 \ubb36\uc5b4 \ud328\ubc30\ud55c \ucabd\ub3c4 \ub2e4\uc2dc \ubd99\uc744 \uc218 \uc788\uac8c \uc124\uacc4\ud569\ub2c8\ub2e4.",
        },
        {
            "title": "\uc0c1\ud0dc \uba38\uc2e0",
            "body": "\ub808\ubca8\ubcf4\ub2e4 \uc804\uc774 \uaddc\uce59\uc744 \uba3c\uc800 \ub2eb\uc2b5\ub2c8\ub2e4. \uc785\ub825\uc774 \uc138\uacc4\ub97c \uc5b4\ub5bb\uac8c \ubc14\uafb8\ub294\uc9c0\uac00 \ubd84\uba85\ud574\uc57c, \uacf5\uac04\uc774 \ud37c\uc990\uc774 \ub418\uace0 \ubc84\uadf8\uac00 \ub418\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
        },
        {
            "title": "\ub09c\uc774\ub3c4 \uace1\uc120",
            "body": "\uc5d0\uc784\uc774\ub098 \uc218\uce58\ub9cc\uc73c\ub85c \uc62c\ub9ac\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. \uc548\uc804 \uc2b5\uad00\uc744 \uc2ec\uc740 \ub4a4 \uadf8 \uc2b5\uad00\uc744 \ud68c\uc218\ud558\ub294 \ucabd\uc774, \ud50c\ub808\uc774\uc5b4\uac00 \uaddc\uce59\uc744 \ub0b4 \uac83\uc73c\ub85c \ub9cc\ub4dc\ub294 \uace1\uc120\uc785\ub2c8\ub2e4.",
        },
        {
            "title": "\uac00\uc124 \uac80\uc99d\ud615 \ubc38\ub7f0\uc2f1",
            "body": "\uac00\uc124\uc744 \uc218\uce58\ub85c \uc801\uace0, \ud50c\ub808\uc774\ud14c\uc2a4\ud2b8\ub85c \uc624\ucc28\ub97c \uc904\uc785\ub2c8\ub2e4. \uc7ac\ud604\ub418\uc9c0 \uc54a\ub294 \uc7ac\ubbf8\ub294 \uc6b4\uc774\uace0, \uc7ac\ud604\ub418\ub294 \uc7ac\ubbf8\ub294 \uc2dc\ud2b8\uc5d0 \ub0a8\uc2b5\ub2c8\ub2e4.",
        },
    ],
    "ui": {
        "all": "\uc804\uccb4",
        "viewPost": "\uc0c1\uc138 \uae30\ud68d\uc11c & \ud3ec\uc2a4\ud2b8 \ubcf4\uae30 \u2192",
        "backToList": "\u2190 \ubaa9\ub85d\uc73c\ub85c \ub3cc\uc544\uac00\uae30",
        "itchBuild": "itch.io \ube4c\ub4dc",
        "loadingPost": "\ud3ec\uc2a4\ud2b8\ub97c \ubd88\ub7ec\uc624\ub294 \uc911\uc785\ub2c8\ub2e4\u2026",
        "period": "\uac1c\ubc1c \uae30\uac04",
        "engine": "\uc5d4\uc9c4 / \uc2a4\ud0dd",
        "role": "\ub2f4\ub2f9 \uc5ed\ud560",
        "contribution": "\uae30\uc5ec\ub3c4",
        "playtimeUnknown": "\ud50c\ub808\uc774\ud0c0\uc784 \ubbf8\uae30\ub85d",
        "fallbackData": "\ub85c\uceec \ud3f4\ubc31 \ub370\uc774\ud130",
        "mergedData": "Steam + Custom \ubcd1\ud569",
        "emptyComment": "\uae30\ud68d \ucf54\uba58\ud2b8\ub294 custom-games.json\uc5d0\uc11c \ucd94\uac00\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        "openAnalysis": "\uae30\ud68d \ubd84\uc11d \ubcf4\uae30 \u2192",
        "mdError": "\ub9c8\ud06c\ub2e4\uc6b4 \ud3ec\uc2a4\ud2b8\ub97c \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. \ub85c\uceec\uc5d0\uc11c\ub294 python -m http.server \ub85c \uc5f4\uc5b4 \uc8fc\uc138\uc694.",
    },
    "fallbackCustomGames": custom,
}

out = ROOT / "js" / "site-data.json"
out.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("wrote", out, "ok", "\uad50\uc804" in out.read_text(encoding="utf-8"))
