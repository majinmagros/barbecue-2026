# CHANGELOG — Barbecue 2026 (Formação Tech Itaú)

Todas as alterações significativas neste projeto são documentadas aqui.

---

## [2.3.0] - 2026-08-08 — GitHub Pages + README links

### Adicionado
- Deploy automático no **GitHub Pages**: https://majinmagros.github.io/barbecue-2026/
- Links no README para as 3 páginas publicadas
- Nota sobre ES Modules exigirem servidor HTTP/HTTPS

---

## [2.2.0] - 2026-08-08 — Correções finais de animação

### Corrigido
- **EnvMap procedural** (sem PMREMGenerator/CORS) — `cards.js`
- **clearcoat apenas em MeshPhysicalMaterial** — `themes/common.js` + todos temas
- Import `THREE` faltando em `themes/common.js`

### Commit
- `2174098` fix: import THREE no common.js
- `c06b4bd` fix: remove PMREMGenerator (CORS) + clearcoat
- `e65e852` fix: envMap procedural + clearcoat
- `25baa85` chore: remove pdf
- `2174098` fix: import THREE no common.js

---

## [2.1.0] - 2026-08-08 — Three.js r185 upgrades completos

### Adicionado
- **ACESFilmicToneMapping** + `toneMappingExposure` (HDR)
- **PCFSoftShadowMap** com bias/normalBias
- **MeshPhysicalMaterial** com `clearcoat`, `transmission`, `iridescence`, `ior`
- **InstancedMesh** para garrafas (5), latas (6), copos (4), guarda-sóis (2)
- **Environment Map procedural** (DataTexture equirectangular)
- **EffectComposer** + **UnrealBloomPass** + **FXAA** (hero-scene)
- **Sombras PCFSoft** em todos os objetos (`castShadow`/`receiveShadow`)
- Materiais físicos: vidro (transmission 0.98), líquidos (ior 1.33), metal, água, madeira, plástico

### Arquivos novos/modificados
- `js/cards.js` — renderer base, envMap, sombras, loop
- `js/hero-scene.js` — EffectComposer, Bloom, FXAA, sombras
- `js/themes/common.js` — PhysicalMaterial library + helpers
- `js/themes/*.js` (9 arquivos) — PhysicalMaterial + InstancedMesh
- `css/main.css` — .btn-estimar, .res-data

### Commit
- `7656a4c` feat: Three.js r185 upgrades completos

---

## [2.0.0] - 2026-08-08 — Cálculo opcional via botão

### Adicionado
- Botão **"Calcular estimativa do churrasco"** no topo
- `js/calculo.js` — lógica movida do inline script para arquivo separado
- `document.write` → `getElementById().innerHTML` nas 3 páginas
- `id` nos 8 cards de resultado (`res-data`, `res-homens`, `res-mulheres`, `res-criancas`, `res-carnes`, `res-cervejas`, `res-acompanhamentos`, `res-refri`)
- Botão `.btn-estimar` + CSS

### Removido
- `alert`/`prompt`/`document.write` automáticos no carregamento

### Commit
- `62efbef` feat: calculo opcional via botão + js/calculo.js

---

## [1.5.0] - 2026-08-08 — Ajustes de layout dos cards

### Ajustado
- Card 3D: altura `220px` → `165px`
- Caixa `.bloco-imagem`: altura `300px` → `340px` + `overflow:hidden`
- Fonte `.bloco-imagem p`: `13px` / `line-height 1.35`

### Commit
- `ce6118b` fix: ajusta altura dos cards 3D e fonte dos textos

---

## [1.4.0] - 2026-08-08 — README detalhado

### Adicionado
- `README.md` completo com: visão geral, tecnologias, estrutura, como rodar, cálculo, páginas, notas

### Commit
- `37d119a` docs: adiciona README detalhado

---

## [1.3.0] - 2026-08-08 — Cards 3D procedurais (primeira versão)

### Adicionado
- 9 temas Three.js procedurais: `homens`, `mulheres`, `criancas`, `carnes`, `cervejas`, `acompanhamentos`, `refrigerantes`, `sucos`, `clube`
- `js/cards.js` — fábrica de cards (renderer, loop, tilt, IntersectionObserver, ResizeObserver)
- `js/hero-scene.js` — churrasqueira animada (faíscas, fumaça, brasas)
- `js/themes/common.js` — helpers (fakeShadow, sphereNoise, makeTable)
- Substituição de 9 `<img>` por `<div class="card-3d" data-theme="...">` nas 3 páginas
- CSS `.card-3d` + `.hero-3d`

### Commit
- `c73eb1d` V2026: cards 3D Three.js + hero-scene + logos

---

## [1.2.0] - 2026-08-07 — Preparação e logos

### Adicionado
- `img/logo-topo.png`, `img/logo-rodape.png`
- Correções de typos (`acompKids` → `acompKids`, logos renomeados)
- `index.html`: importmap Three.js r185, hero 3D no lugar do slider

### Commit
- `b1267e1` primeiro comit (base original)

---

## Estrutura final do projeto

```
barbecue/
├── index.html          # Página principal (hero 3D + cards 3D + estimativas)
├── churrasco2.html     # Página secundária (slider + cards 3D + mapa)
├── churrasco3.html     # Página secundária (slider + cards 3D)
├── css/
│   ├── main.css        # Estilos + .hero-3d + .card-3d + .btn-estimar + .res-data
│   └── slick.css       # Carrossel (legado)
├── js/
│   ├── cards.js        # Fábrica cards 3D (renderer, loop, tilt, pausa, envMap, sombras)
│   ├── calculo.js      # Lógica estimativa (botão)
│   ├── hero-scene.js   # Hero 3D (EffectComposer + Bloom + FXAA + sombras)
│   ├── themes/
│   │   ├── homens.js
│   │   ├── mulheres.js
│   │   ├── criancas.js
│   │   ├── carnes.js
│   │   ├── cervejas.js
│   │   ├── acompanhamentos.js
│   │   ├── refrigerantes.js
│   │   ├── sucos.js
│   │   ├── clube.js
│   │   └── common.js   # PhysicalMaterial + InstancedMesh + helpers
│   ├── main.js         # Carrossel (jQuery/Slick)
│   └── jquery*.js, slick.min.js
├── css/
├── img/                # Logos, ícones
└── README.md
```

---

## URLs de produção

| Página | URL |
|--------|-----|
| Principal | https://majinmagros.github.io/barbecue-2026/ |
| Com mapa | https://majinmagros.github.io/barbecue-2026/churrasco2.html |
| Variação | https://majinmagros.github.io/barbecue-2026/churrasco3.html |

---

## Como rodar localmente

```bash
python -m http.server 9000
# Acesse http://127.0.0.1:9000/index.html
```

> **Importante:** ES Modules + importmap exigem HTTP/HTTPS. Não abre via `file://`.

---

## Tech Stack

- **Three.js r185** via CDN (unpkg) + importmap
- **ES Modules** nativos
- **jQuery + Slick** (legado, páginas 2/3)
- **GitHub Pages** para deploy