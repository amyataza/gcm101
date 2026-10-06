#!/usr/bin/env python3
"""Run every Track C Python snippet extracted from the syllabus and check its printed numbers.

Each number printed by a snippet must appear in that snippet's own comments or in the text of the
same module (worked-example tables), after normalising thousands separators and minus signs.
Writes docs/testing/python-verification.md and exits non-zero on any mismatch or error.

Usage: python3 tools/verify_python.py   (needs scipy for the M4 and M13 snippets)
"""
import json
import re
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODS = ROOT / "web" / "content" / "modules"
OUT = ROOT / "docs" / "testing" / "python-verification.md"
NUM = re.compile(r"[-+−]?\d[\d,]*(?:\.\d+)?")


def norm(tok: str) -> str:
    t = tok.replace(",", "").replace("−", "-").lstrip("+-")
    if "." in t:
        t = t.rstrip("0").rstrip(".")
    return t or "0"


def numbers(text: str) -> set:
    return {norm(m.group(0)) for m in NUM.finditer(text)}


def main() -> int:
    rows, failures = [], 0
    for path in sorted(MODS.glob("m*.json"), key=lambda p: int(p.stem[1:])):
        mod = json.loads(path.read_text())
        corpus = " ".join(e["text"] for e in mod["examples"])
        for ex in mod["examples"]:
            for i, code in enumerate(ex["code"]):
                comments = " ".join(l.split("#", 1)[1] for l in code.splitlines() if "#" in l)
                # Inputs that a snippet echoes (e.g. the fee or confidence level in a loop) are allowed too.
                literals = numbers(" ".join(l.split("#", 1)[0] for l in code.splitlines()))
                allowed = numbers(comments) | numbers(corpus) | literals
                with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
                    f.write(code)
                proc = subprocess.run([sys.executable, f.name], capture_output=True, text=True, timeout=120)
                out = proc.stdout.strip()
                printed = [norm(m.group(0)) for m in NUM.finditer(out)]
                unmatched = sorted({p for p in printed if p not in allowed}, key=lambda x: float(x))
                ok = proc.returncode == 0 and not unmatched
                failures += 0 if ok else 1
                rows.append({
                    "where": f"{mod['code']} {ex['id']}" + (f" #{i + 1}" if len(ex["code"]) > 1 else ""),
                    "title": ex["title"], "ok": ok, "printed": len(printed), "unmatched": unmatched,
                    "error": proc.stderr.strip().splitlines()[-1] if proc.returncode else "", "output": out,
                })
    OUT.parent.mkdir(parents=True, exist_ok=True)
    py = sys.version.split()[0]
    try:
        import scipy  # noqa: F401
        sv = scipy.__version__
    except Exception:  # pragma: no cover
        sv = "not installed"
    lines = [
        "# Python snippet verification",
        "",
        f"Run on {date.today().isoformat()} with Python {py} and scipy {sv} by `npm run test:python`.",
        "Every number a snippet prints must appear in its own comments, in the module's worked-example text, or as an input literal the snippet echoes.",
        "",
        "| Snippet | Example | Result | Numbers printed | Unmatched |",
        "|---|---|:-:|--:|---|",
    ]
    for r in rows:
        lines.append(f"| {r['where']} | {r['title']} | {'✅ pass' if r['ok'] else '❌ fail'} | {r['printed']} | {', '.join(r['unmatched']) or '—'}{(' — ' + r['error']) if r['error'] else ''} |")
    lines += ["", f"**{sum(r['ok'] for r in rows)} of {len(rows)} snippets pass.**", "", "## Raw output", ""]
    for r in rows:
        lines += [f"### {r['where']} — {r['title']}", "", "```", r["output"], "```", ""]
    OUT.write_text("\n".join(lines))
    print(f"{sum(r['ok'] for r in rows)}/{len(rows)} snippets pass. Report: {OUT.relative_to(ROOT)}")
    for r in rows:
        if not r["ok"]:
            print(f"  FAIL {r['where']}: unmatched {r['unmatched']} {r['error']}")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
