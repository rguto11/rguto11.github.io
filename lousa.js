/* Portfólio em quadro-negro: monta os desenhos de giz e faz eles "se escreverem" ao rolar. */
(() => {
'use strict';

/* ---------- pequenos construtores de desenho ---------- */
const box   = (x,y,w,h,c)         => ({t:'box',x,y,w,h,c});
const arr   = (x1,y1,x2,y2,c)     => ({t:'arrow',x1,y1,x2,y2,c});
const line  = (pts,c)             => ({t:'line',pts,c});
const tx    = (x,y,s,c,lh)        => Array.isArray(s) ? {t:'text',x,y,lines:s,c,lh} : {t:'text',x,y,lines:[s],c,lh};

function build(svg, ops){
  let html = '', i = 0;
  for (const o of ops){
    const d = (i++ * 0.28).toFixed(2) + 's';
    if (o.t === 'box'){
      html += `<path class="ch ${o.c||''}" pathLength="1" style="--d:${d}" d="M${o.x} ${o.y}h${o.w}v${o.h}h${-o.w}z"/>`;
    } else if (o.t === 'line'){
      html += `<path class="ch ${o.c||''}" pathLength="1" style="--d:${d}" d="M${o.pts.map(p => p.join(' ')).join('L')}"/>`;
    } else if (o.t === 'arrow'){
      const a = Math.atan2(o.y2-o.y1, o.x2-o.x1), L = 14, p = s => [o.x2 - L*Math.cos(a+s), o.y2 - L*Math.sin(a+s)];
      const [ax,ay] = p(.45), [bx,by] = p(-.45);
      html += `<path class="ch ${o.c===undefined?'y':o.c}" pathLength="1" style="--d:${d}" d="M${o.x1} ${o.y1}L${o.x2} ${o.y2}M${ax.toFixed(1)} ${ay.toFixed(1)}L${o.x2} ${o.y2}L${bx.toFixed(1)} ${by.toFixed(1)}"/>`;
    } else if (o.t === 'text'){
      const lh = o.lh || 22;
      html += `<text class="tx ${o.c||''}" style="--d:${d}" x="${o.x}" y="${o.y}">` +
        o.lines.map((s,k) => `<tspan x="${o.x}" dy="${k?lh:0}">${s}</tspan>`).join('') + '</text>';
    }
  }
  svg.innerHTML = html;
}

/* ---------- os quadros ---------- */
const BOARDS = {
  'b-assistente': [
    box(10,120,130,70), tx(75,162,'pergunta','mid'),
    arr(144,155,198,155),
    box(202,95,210,130), tx(307,150,'orquestrador','mid lg'), tx(307,178,'classifica o assunto','mid xs'), tx(307,198,'e dá um nível de confiança','mid xs'),
    arr(416,135,500,57), arr(416,160,500,160), arr(416,185,500,263),
    box(504,15,306,84,'b'),  tx(657,50,'financeiro','mid'),            tx(657,76,'modelo monta a consulta, código calcula','mid xs'),
    box(504,118,306,84,'b'), tx(657,153,'informações internas','mid'), tx(657,179,'busca por significado (RAG), com fontes','mid xs'),
    box(504,221,306,84,'b'), tx(657,256,'ouvidoria','mid'),            tx(657,282,'busca exata por protocolo e filtros','mid xs'),
    tx(10,326,'confiança baixa? ele pergunta de volta, em vez de chutar.','y sm')
  ],
  'b-nexo': [
    box(10,140,150,80), tx(85,175,'planilha','mid'), tx(85,199,'CSV ou Excel','mid xs'),
    arr(164,180,204,180),
    box(208,40,236,260), tx(326,66,'orquestrador em Python puro','mid sm y'),
    box(228,88,196,56,'b'),  tx(326,122,'agente de dados','mid sm'),
    box(228,160,196,56,'b'), tx(326,194,'agente de análise','mid sm'),
    box(228,232,196,56,'b'), tx(326,266,'agente de visualização','mid sm'),
    arr(448,170,516,170),
    box(520,90,290,160,'b'), tx(665,136,'ferramentas','mid lg'), tx(665,168,'Pandas calcula','mid'), tx(665,194,'Plotly desenha','mid'), tx(665,226,'mesmo pedido, mesmo resultado','mid xs y'),
    arr(310,342,310,304,'p'), arr(342,304,342,340,'p'),
    box(208,344,236,46,'p'), tx(326,373,'modelo: Gemini ou Ollama','mid sm'),
    tx(458,370,'só interpreta o pedido, nunca calcula','xs p'),
    tx(520,282,'código do modelo? nunca é executado.','xs p')
  ],
  'b-mathclass': [
    box(10,40,210,64), tx(115,78,'pergunta em texto','mid sm'),
    box(10,130,210,64), tx(115,168,'foto do exercício','mid sm'),
    arr(224,72,296,110), arr(224,162,296,132),
    box(300,60,240,140), tx(420,100,'MathClass','mid lg'), tx(420,128,'Gemini 2.5 Flash','mid sm'), tx(420,152,'+ regras do professor','mid xs y'), tx(420,172,'+ conversa até aqui','mid xs y'),
    box(300,250,114,70,'b'), tx(357,278,['tutor:','passo a passo'],'mid xs',18),
    box(426,250,114,70,'b'), tx(483,278,['corretor:','resposta rápida'],'mid xs',18),
    arr(357,246,357,206), arr(483,246,483,206),
    arr(544,130,606,130),
    box(610,80,200,100), tx(710,122,'explicação','mid'), tx(710,148,'do professor','mid xs'),
    tx(10,352,'só matemática: se perguntarem outra coisa, ele recusa com humor.','p sm')
  ],
  'b-credito': [
    box(10,10,150,60),  tx(85,34,['dados de','28 colunas'],'mid sm',20),
    arr(164,40,196,40),
    box(200,10,120,60), tx(260,34,['limpeza','e preparação'],'mid sm',20),
    arr(324,40,356,40),
    box(360,10,150,60), tx(435,34,['importância das','variáveis'],'mid sm',20),
    arr(514,40,546,40),
    box(550,10,110,60,'b'), tx(605,34,['6 modelos','comparados'],'mid sm',20),
    arr(664,40,696,40),
    box(700,10,110,60,'y'), tx(755,34,['app','Streamlit'],'mid sm',20),
    tx(10,112,'acurácia de cada modelo, no conjunto de teste','b sm'),
    line([[20,330],[690,330]]),
    box(40,158,80,172,'y f'),  tx(80,150,'0,776','mid sm y'), tx(80,352,['Random','Forest'],'mid xs',16),
    box(150,161,80,169,'f'),   tx(190,153,'0,768','mid sm'),   tx(190,352,['Extra','Trees'],'mid xs',16),
    box(260,165,80,165,'f'),   tx(300,157,'0,751','mid sm'),   tx(300,352,['XGBoost'],'mid xs',16),
    box(370,166,80,164,'f'),   tx(410,158,'0,745','mid sm'),   tx(410,352,['Stacking'],'mid xs',16),
    box(480,173,80,157,'f'),   tx(520,165,'0,715','mid sm'),   tx(520,352,['Rede neural','(MLP)'],'mid xs',16),
    box(590,211,80,119,'p f'), tx(630,203,'0,541','mid sm p'), tx(630,352,['Modelo de','referência'],'mid xs',16),
    tx(704,170,['Random Forest:','AUROC 0,897'],'xs y',18)
  ],
  'b-logistica': [
    box(10,20,170,80),  tx(95,52,'relatório','mid'),       tx(95,78,'porta 8003','mid xs'),
    arr(184,60,222,60),
    box(226,20,190,80), tx(321,52,'processamento','mid'),  tx(321,78,'porta 8002','mid xs'),
    arr(420,60,458,60),
    box(462,20,150,80), tx(537,52,'dados','mid'),          tx(537,78,'porta 8001','mid xs'),
    arr(616,60,654,60),
    box(658,20,152,80,'b'), tx(734,52,'PostgreSQL','mid'), tx(734,78,'banco de dados','mid xs'),
    tx(10,150,'cada camada espera mais do que a de baixo leva no pior caso:','y sm'),
    tx(10,182,'processamento → dados: 5 s, até 2 tentativas (cerca de 11 s)','sm'),
    tx(10,208,'relatório → processamento: 30 s','sm'),
    tx(10,234,'servidor (gunicorn): 60 s','sm'),
    tx(10,298,'atraso = máx(0, entregue − prazo)','lg y'),
    tx(10,326,'atraso crítico: a partir de 120 minutos','sm b')
  ],
  'b-caminho': [
    arr(20,110,800,110,''),
    line([[90,96],[90,124]],'y'),  tx(90,82,'2021','mid y'),  tx(90,150,['professor de','matemática'],'mid sm',20),
    line([[300,96],[300,124]],'y'), tx(300,82,'2024','mid y'), tx(300,150,['estágio de BI','(dados e Python)'],'mid sm',20),
    line([[510,96],[510,124]],'y'), tx(510,82,'2026','mid y'), tx(510,150,['estágio de IA','(LLMs e ML)'],'mid sm',20),
    line([[720,96],[720,124]],'p'), tx(720,82,'2027','mid p'), tx(720,150,['formatura','(prevista)'],'mid sm',20)
  ]
};
Object.keys(BOARDS).forEach(id => { const svg = document.getElementById(id); if (svg) build(svg, BOARDS[id]); });

/* ---------- revelar ao rolar ---------- */
const targets = document.querySelectorAll('.proj, .sec');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.18});
  targets.forEach(t => io.observe(t));
} else { targets.forEach(t => t.classList.add('in')); }

/* ---------- animação sempre ligada ----------
   Única exceção automática: quem pede "reduzir movimento" no sistema vê os desenhos já prontos.
   (?estatico serve só para tirar capturas de tela.) */
const q = new URLSearchParams(location.search);
if (matchMedia('(prefers-reduced-motion: reduce)').matches || q.has('estatico')){
  document.body.classList.add('static');
  targets.forEach(t => t.classList.add('in'));
}
})();
