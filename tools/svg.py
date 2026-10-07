#!/usr/bin/env python3
"""Gera os desenhos técnicos SVG do site e injeta nos marcadores
<!--svg:nome-->...<!--/svg:nome--> dos arquivos HTML.

Uso: python3 tools/svg.py
"""
import math
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent


class Draw:
    """Acumula elementos com índice de animação sequencial (--i)."""

    def __init__(self, vb, cls="build-svg", label=None, max_i=40):
        self.vb, self.cls, self.items, self.i, self.max_i = vb, cls, [], 0, max_i

    def p(self, d, kind="", step=True, extra=""):
        k = f"tech {kind}".strip()
        i = min(self.i, self.max_i)
        self.items.append(f'<path class="{k} bp" pathLength="1" style="--i:{i}" d="{d}"{extra}/>')
        if step:
            self.i += 1

    def t(self, x, y, s, anchor="start", step=False):
        i = min(self.i, self.max_i)
        self.items.append(
            f'<text class="tech-text bm" style="--i:{i}" x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}">{s}</text>'
        )
        if step:
            self.i += 1

    def raw(self, s):
        self.items.append(s)

    def svg(self):
        return (
            f'<svg class="{self.cls}" viewBox="{self.vb}" focusable="false" aria-hidden="true">'
            + "".join(self.items)
            + "</svg>"
        )


def f(*a):
    return " ".join(f"{v:.1f}" if isinstance(v, float) else str(v) for v in a)


# ---------------------------------------------------------------- marca
def mark():
    return (
        '<svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">'
        '<rect x="0.75" y="0.75" width="38.5" height="38.5" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-width="1"/>'
        '<path d="M8 33 L18 7 H22 L32 33" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="miter"/>'
        '<path d="M12.6 24 H27.4" stroke="#e2672f" stroke-width="2.2"/>'
        '<path d="M5 33 H12 M28 33 H35" stroke="currentColor" stroke-width="2.2"/>'
        "</svg>"
    )


# ---------------------------------------------------------------- escoramento
def escoramento():
    d = Draw("0 0 400 300")
    d.p("M10 262 H390", "tech--thin")
    d.p("".join(f"M{x} 262 l-8 10 " for x in range(22, 392, 16)), "tech--thin")
    xs = [60, 130, 200, 270, 340]
    for x in xs:
        d.p(f"M{x-12} 256 H{x+12} M{x-3} 256 V158 M{x+3} 256 V158")
    for x in xs:
        d.p(f"M{x-8} 158 H{x+8} M{x-1.5} 158 V80 M{x+1.5} 158 V80 M{x-10} 80 H{x+10}", step=False)
        d.i += 1
    d.p("M24 72 H376 V80 H24 Z")
    d.p("".join(f"M{x} 62 h10 v10 h-10 Z " for x in range(34, 370, 28)), "tech--thin")
    d.p("M20 44 H380 V62 H20 Z", "tech--fill")
    for x in (95, 200, 305):
        d.p(f"M{x} 10 V36 M{x-5} 29 L{x} 36 L{x+5} 29", "tech--accent", step=False)
    d.i += 1
    d.p("M392 44 V256 M386 44 H398 M386 256 H398", "tech--thin")
    d.t(388, 154, "H", "end")
    d.t(206, 26, "q", "start")
    d.p("M232 53 L262 30 H300", "tech--thin", step=False)
    d.t(304, 33, "LAJE")
    d.p("M352 76 L362 100 H380", "tech--thin", step=False)
    d.t(340, 112, "VIGA")
    d.p("M206 200 L232 214 H262", "tech--thin", step=False)
    d.t(266, 217, "ESCORA")
    return d.svg()


# ---------------------------------------------------------------- fôrmas
def formas():
    d = Draw("0 0 400 300")
    d.p("M10 262 H390", "tech--thin")
    for r in range(2):
        for c in range(3):
            x, y = 60 + c * 100, 46 + r * 106
            d.p(
                f"M{x} {y} h96 v102 h-96 Z M{x} {y+51} h96 M{x+48} {y} v102 M{x+8} {y+8} h80 v86 h-80 Z",
                "tech--fill" if (r + c) % 2 == 0 else "",
            )
    for y in (98, 204):
        d.p(f"M44 {y-4} H372 M44 {y+4} H372", "tech--accent")
    ties = "".join(f"M{x-3} {y} h6 M{x} {y-3} v6 " for x in (108, 208, 308) for y in (98, 204))
    d.p(ties, "tech--accent")
    d.p("M60 98 L22 256 M60 204 L36 256 M16 256 h12 M30 256 h12", "")
    d.p("M60 30 H356 M60 24 V36 M356 24 V36", "tech--thin")
    d.t(208, 22, "L", "middle")
    d.p("M370 46 V254 M364 46 H376 M364 254 H376", "tech--thin")
    d.t(380, 154, "H")
    d.p("M300 120 L330 134 H360", "tech--thin", step=False)
    d.t(334, 128, "PAINEL")
    return d.svg()


# ---------------------------------------------------------------- andaimes
def andaimes():
    d = Draw("0 0 400 300")
    d.p("M10 270 H390", "tech--thin")
    xs = [60, 150, 240, 330]
    lv = [270, 208, 146, 84]
    d.p("".join(f"M{x-10} 266 H{x+10} M{x} 266 V262 " for x in xs))
    for k in range(3):
        y0, y1 = lv[k], lv[k + 1]
        parts = "".join(f"M{x} {y0-4} V{y1} " for x in xs)
        parts += f"M{xs[0]} {y1} H{xs[-1]} "
        for b in range(3):
            a, c = xs[b], xs[b + 1]
            parts += (f"M{a} {y0-4} L{c} {y1} " if (b + k) % 2 == 0 else f"M{c} {y0-4} L{a} {y1} ")
        d.raw(f'<g class="bm" style="--i:{2 + k * 3}">')
        d.p(parts)
        d.p(f"M{xs[0]} {y1-6} H{xs[-1]} V{y1} H{xs[0]} Z", "tech--fill tech--accent")
        d.raw("</g>")
        d.i += 1
    d.p(f"M{xs[0]} 84 V48 M{xs[-1]} 84 V48 M{xs[0]} 48 H{xs[-1]} M{xs[0]} 66 H{xs[-1]}", "tech--thin")
    d.p("M352 84 V270 M346 84 H358 M346 270 H358", "tech--thin")
    d.t(362, 180, "H")
    d.p("M198 112 L222 98 H252", "tech--thin", step=False)
    d.t(226, 93, "PLATAFORMA")
    return d.svg()


# ---------------------------------------------------------------- intro
def intro():
    d = Draw("0 0 560 220", "intro__svg")
    out = []
    i = 0

    def ln(dd, k=""):
        nonlocal i
        out.append(f'<path class="ln {k}" pathLength="1" style="--i:{i}" d="{dd}"/>')
        i += 1

    for x in range(0, 561, 70):
        ln(f"M{x} 0 V220", "ln--grid")
    i = 2
    ln("M10 206 H550")
    for x in (70, 160, 250, 310, 400, 490):
        ln(f"M{x-10} 204 H{x+10} M{x} 204 V60")
    ln("M40 60 H520 M40 52 H520")
    ln("M30 30 H530 V44 H30 Z")
    ln("M70 140 H490", "ln--accent")
    return '<svg class="intro__svg" viewBox="0 0 560 220" aria-hidden="true">' + "".join(out) + "</svg>"


# ---------------------------------------------------------------- finder (vazio)
def finder():
    d = Draw("0 0 160 120", "")
    return (
        '<svg viewBox="0 0 160 120" aria-hidden="true">'
        '<path class="tech" d="M80 10 L140 40 L80 70 L20 40 Z M20 40 V80 L80 110 V70 M140 40 V80 L80 110"/>'
        '<path class="tech tech--accent" d="M50 55 V95 M110 55 V95"/>'
        '<path class="tech tech--thin" d="M80 70 V110"/>'
        "</svg>"
    )


# ---------------------------------------------------------------- fôrma deslizante
def deslizante():
    d = Draw("0 0 400 400")
    d.p("M40 380 H360", "tech--thin")
    d.p("M140 380 V150 M260 380 V150 M150 380 V150 M250 380 V150")
    d.p("".join(f"M140 {y} H260 " for y in range(360, 150, -30)), "tech--thin")
    d.p("M128 112 H272 V150 H128 Z", "tech--accent")
    d.p("M150 112 V80 H250 V112 M170 80 V60 M230 80 V60", "")
    d.p("M100 112 H300 M100 118 H300", "")
    d.p("M170 60 V380 M230 60 V380", "tech--thin", extra=' stroke-dasharray="4 6"')
    d.p("M320 260 V140 M313 150 L320 140 L327 150", "tech--accent")
    d.t(330, 205, "AVANÇO")
    d.t(330, 218, "CONTÍNUO")
    d.p("M100 380 V150 M94 380 H106 M94 150 H106", "tech--thin")
    d.t(90, 268, "H", "end")
    return d.svg().replace('class="build-svg"', 'class="build-svg"')


# ---------------------------------------------------------------- torre isométrica
def iso(x, y, z, ox=240, oy=348, s=0.82):
    c, sn = math.cos(math.radians(30)), math.sin(math.radians(30))
    return ox + (x - y) * c * s, oy + (x + y) * sn * s - z * s


def torre():
    d = Draw("0 0 500 500", max_i=60)
    S = 120
    Z = [0, 85, 170, 255, 320]

    def P(x, y, z):
        a, b = iso(x, y, z)
        return f"{a:.1f} {b:.1f}"

    # base
    d.p(f"M{P(-25,-25,0)} L{P(S+25,-25,0)} L{P(S+25,S+25,0)} L{P(-25,S+25,0)} Z", "tech--thin")
    corners = [(0, 0), (S, 0), (S, S), (0, S)]
    for x, y in corners:
        d.p(f"M{P(x-12,y,0)} L{P(x+12,y,0)} M{P(x,y-12,0)} L{P(x,y+12,0)}", "tech--thin", step=False)
    d.i += 1
    for x, y in corners:
        d.p(f"M{P(x,y,4)} L{P(x,y,Z[-1])}", "", step=False)
    d.i += 1
    for k, z in enumerate(Z[:-1]):
        z2 = z + 4 if k == 0 else z
        d.p(f"M{P(0,0,z2)} L{P(S,0,z2)} L{P(S,S,z2)} L{P(0,S,z2)} Z", "")
    for k in range(3):
        za, zb = Z[k], Z[k + 1]
        if k % 2 == 0:
            d.p(f"M{P(0,S,za)} L{P(S,S,zb)} M{P(S,0,za)} L{P(S,S,zb)}", "tech--accent", step=False)
        else:
            d.p(f"M{P(S,S,za)} L{P(0,S,zb)} M{P(S,S,za)} L{P(S,0,zb)}", "tech--accent", step=False)
        d.i += 1
    zt = Z[-1]
    for x in (0, S):
        d.p(f"M{P(x,-50,zt)} L{P(x,S+50,zt)} M{P(x,-50,zt+10)} L{P(x,S+50,zt+10)}", "")
    for y in range(-40, S + 50, 30):
        d.p(f"M{P(-30,y,zt+10)} L{P(S+30,y,zt+10)}", "tech--thin", step=False)
    d.i += 1
    d.p(f"M{P(-40,-55,zt+18)} L{P(S+40,-55,zt+18)} L{P(S+40,S+55,zt+18)} L{P(-40,S+55,zt+18)} Z", "tech--fill")

    # cotas
    ax, ay = iso(S + 60, -20, 0)
    bx, by = iso(S + 60, -20, zt)
    d.p(f"M{ax:.1f} {ay:.1f} L{bx:.1f} {by:.1f} M{ax-6:.1f} {ay:.1f} h12 M{bx-6:.1f} {by:.1f} h12", "tech--thin")
    d.t(bx + 8, (ay + by) / 2, "H = variável")
    cx, cy = iso(0, S + 30, 0)
    ex, ey = iso(S, S + 30, 0)
    d.p(f"M{cx:.1f} {cy:.1f} L{ex:.1f} {ey:.1f}", "tech--thin")
    d.t((cx + ex) / 2 + 6, (cy + ey) / 2 + 16, "módulo")

    def lead(px, py, pz, dx, dy, txt):
        a, b = iso(px, py, pz)
        d.p(f"M{a:.1f} {b:.1f} l{dx} {dy} h{(-30 if dx < 0 else 30)}", "tech--thin", step=False)
        tx = a + dx + (-34 if dx < 0 else 34)
        d.t(tx, b + dy + 3, txt, "end" if dx < 0 else "start")

    lead(0, 0, Z[2], -60, -10, "MONTANTE")
    lead(0, S, Z[3] - 20, -40, 40, "DIAGONAL")
    lead(S, 0, zt + 10, 40, -40, "VIGAMENTO")
    lead(0, 0, 4, -40, 20, "BASE")
    d.t(18, 28, "ARGENTO / ESQUEMA ISOMÉTRICO", step=False)
    d.t(18, 42, "SEM ESCALA", step=False)
    return d.svg()


# ---------------------------------------------------------------- segurança (planta)
def seguranca():
    d = Draw("0 0 420 300")
    d.p("M20 20 H400 V280 H20 Z")
    d.p("M20 20 H400 V280 H20 Z", "tech--fill", step=False)
    d.p("".join(f"M{x} 20 V280 " for x in range(80, 400, 60)), "tech--thin")
    d.p("".join(f"M20 {y} H400 " for y in range(80, 280, 60)), "tech--thin")
    pts = "".join(f"M{x-4} {y} a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 " for x in range(50, 400, 60) for y in range(50, 280, 60))
    d.p(pts, "tech--accent")
    d.p("M50 296 H110 M50 290 V300 M110 290 V300", "tech--thin")
    d.t(80, 292, "a", "middle")
    d.p("M408 50 V110 M402 50 H414 M402 110 H414", "tech--thin")
    d.t(416, 84, "b")
    d.t(28, 14, "PLANTA · DISTRIBUIÇÃO DE APOIOS (ESQUEMA)", step=False)
    return d.svg()


# ---------------------------------------------------------------- slot de case
def case_slot():
    return (
        '<svg viewBox="0 0 360 240" aria-hidden="true">'
        '<path class="tech tech--thin" d="M0 0 H360 V240 H0 Z M0 0 L360 240 M360 0 L0 240"/>'
        '<path class="tech" d="M0 18 V0 H18 M342 0 H360 V18 M360 222 V240 H342 M18 240 H0 V222"/>'
        '<path class="tech tech--accent" d="M170 120 h20 M180 110 v20"/>'
        '<text class="tech-text" x="180" y="150" text-anchor="middle" style="fill:#3a414a">FOTO DA OBRA</text>'
        "</svg>"
    )


# ---------------------------------------------------------------- travamento (pilar)
def travamento():
    d = Draw("0 0 400 300")
    d.p("M10 270 H390", "tech--thin")
    d.p("M170 270 V30 M230 270 V30", "tech--fill")
    d.p("M162 270 V30 M238 270 V30")
    for y in range(52, 262, 42):
        d.p(f"M140 {y} H260 M140 {y+8} H260 M150 {y-4} V{y+12} M250 {y-4} V{y+12}", "tech--accent", step=False)
        d.i += 1
    d.p("M162 90 L60 266 M238 90 L340 266 M48 266 h24 M328 266 h24")
    d.p("M300 52 V262 M294 52 H306 M294 262 H306", "tech--thin")
    d.t(310, 160, "PASSO")
    d.p("M262 140 L290 120 H330", "tech--thin", step=False)
    d.t(294, 114, "GRAVATA")
    d.p("M110 180 L80 160 H50", "tech--thin", step=False)
    d.t(14, 152, "APRUMADOR")
    return d.svg()


# ---------------------------------------------------------------- tubular convencional
def tubular():
    d = Draw("0 0 400 300")
    d.p("M10 272 H390", "tech--thin")
    d.p("M40 272 Q120 250 200 262 T390 240", "tech--thin")
    xs = [(60, 268), (140, 258), (220, 262), (300, 252), (370, 244)]
    d.p("".join(f"M{x} {g} V40 " for x, g in xs))
    for y in (220, 160, 100):
        d.p(f"M50 {y} H380", "", step=False)
        d.i += 1
    d.p("M60 220 L140 160 M140 220 L220 160 M220 160 L300 100 M300 160 L370 100 M60 100 L140 40 H220", "tech--thin")
    clamps = "".join(f"M{x-4} {y-4} h8 v8 h-8 Z " for x, _ in xs for y in (220, 160, 100))
    d.p(clamps, "tech--accent")
    d.p("M60 94 H370 V100 H60 Z", "tech--fill")
    d.p("M232 168 L262 186 H300", "tech--thin", step=False)
    d.t(266, 198, "BRAÇADEIRA")
    return d.svg()


BLOCKS = {
    "travamento": travamento,
    "tubular": tubular,
    "mark": mark,
    "escoramento": escoramento,
    "formas": formas,
    "andaimes": andaimes,
    "intro": intro,
    "finder": finder,
    "deslizante": deslizante,
    "torre": torre,
    "seguranca": seguranca,
    "case": case_slot,
}


def main():
    cache = {k: fn() for k, fn in BLOCKS.items()}
    for html in list(ROOT.glob("*.html")) + list(ROOT.glob("solucoes/*.html")):
        src = html.read_text(encoding="utf-8")

        def rep(m):
            name = m.group(1)
            return f"<!--svg:{name}-->{cache[name]}<!--/svg:{name}-->"

        out = re.sub(r"<!--svg:([a-z]+)-->.*?<!--/svg:\1-->", rep, src, flags=re.S)
        if out != src:
            html.write_text(out, encoding="utf-8")
            print("atualizado:", html.relative_to(ROOT))


if __name__ == "__main__":
    main()
