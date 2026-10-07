"""Regenerate the local Chinese webfont after modifying authored copy (stdlib only)."""
import json,re,urllib.request,urllib.parse
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/"docs/font-subset.json").read_text(encoding="utf-8"))
chars="".join(sorted(set(re.findall(r"[\u3000-\u303f\u3400-\u9fff\uff00-\uffef]","\n".join(p.read_text(encoding="utf-8") for p in (root/"src").rglob("*") if p.suffix in (".ts",".tsx"))))))+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?/:;()-–—"
headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"}
url="https://fonts.googleapis.com/css2?"+urllib.parse.urlencode({"family":manifest["family"],"text":chars,"display":"swap"})
with urllib.request.urlopen(urllib.request.Request(url,headers=headers)) as r:css=r.read().decode()
url=re.findall(r"src:\s*url\(([^)]+)\)",css)[0]
with urllib.request.urlopen(urllib.request.Request(url,headers=headers)) as r:font=r.read()
if not font.startswith(b"wOF2"):raise RuntimeError("Expected WOFF2")
(root/"public"/manifest["path"]).write_bytes(font)
print("Saved",len(font),"bytes; authored Chinese characters covered:",len(chars))
