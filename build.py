#!/usr/bin/env python3
"""Costruisce www/index.html (APK) e artifact.html (versione dentro Claude). Funziona senza rete."""
import base64, pathlib
q = pathlib.Path(__file__).parent
ff = lambda nome, f, pes: f"@font-face{{font-family:'{nome}';font-weight:{pes};src:url(data:font/woff2;base64,{base64.b64encode((q/'font'/f).read_bytes()).decode()}) format('woff2');font-display:swap}}"
fonts = ff('SM Kalam','k400.woff2',400)+ff('SM Kalam','k700.woff2',700)+ff('SM Hand','ph.woff2',400)
pul = lambda f: (q/f).read_text().split('if(typeof module')[0]
js = pul('sim.js')+pul('ric.js')+pul('dati.js')+(q/'gioco.js').read_text()
corpo = f"""<canvas id="foglio" aria-label="Foglio a quadretti"></canvas>
<div id="alto" class="bar"></div>
<div id="att" class="bar" hidden><button data-tool="matita">Matita</button><button data-tool="gomma">Gomma</button><button data-tool="mano">Sposta</button><button id="und">Annulla</button><button id="red">Ripeti</button></div>
<button id="prova" hidden>Dai corrente</button>
<div id="vel" hidden><button id="oscb">Oscilloscopio</button><button data-v="1" class="on">Tempo vero</button><button data-v="0.1">1/10</button><button data-v="0.01">1/100</button><button data-v="0.001">1/1000</button></div>
<div id="osc" hidden><canvas></canvas><div class="r"><span><button data-s="0">Sonda CH1</button> <button data-s="1">Sonda CH2</button></span><span><button data-td="1">1 s/div</button> <button data-td="0.1" class="on">100 ms</button> <button data-td="0.01">10 ms</button> <button data-td="0.001">1 ms</button></span></div><div class="r" style="padding-bottom:4px">Verticale: ±12 V</div></div>
<div id="chip"></div><div id="tag"></div><div id="msg" hidden></div><div id="ov"></div>
<span style="position:absolute;opacity:0;font-family:'SM Kalam';font-weight:700">0</span><span style="position:absolute;opacity:0;font-family:'SM Hand'">0</span>
<script>{js}</script>"""
testa = f"<title>Schema a mano</title><style>{fonts}{(q/'stile.css').read_text()}</style>"
(q/'www').mkdir(exist_ok=True)
(q/'www'/'index.html').write_text(f'<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no"><meta name="theme-color" content="#fbfaf3">{testa}</head><body>{corpo}</body></html>')
(q/'artifact.html').write_text(f'{testa}\n{corpo}')
print('ok', len(corpo)+len(testa))
