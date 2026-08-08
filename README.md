# 🍖 Churrasco Formação Tech — Barbecue 2026

> Página web para organização do churrasco da **Formação Tech Itaú** no **Clube Itaú Guarapiranga**, com visual moderno 3D em **Three.js (r185)**.

## 🔗 Acesso online

- **Página principal:** https://majinmagros.github.io/barbecue-2026/
- **Página 2 (com mapa):** https://majinmagros.github.io/barbecue-2026/churrasco2.html
- **Página 3:** https://majinmagros.github.io/barbecue-2026/churrasco3.html

> **Nota:** O site usa ES Modules via `importmap` + Three.js CDN (unpkg). Funciona apenas via HTTP/HTTPS (não abre via `file://`). Para rodar localmente, use um servidor HTTP (ex: `python -m http.server 9000`).

## 📋 Sobre o projeto

Este projeto calcula a estimativa de consumo de um churrasco com base no número de participantes informados pelo usuário:

- **Quantidade de convidados** por grupo (homens, mulheres e crianças);
- **Melhor data** para o evento (votação simples via `prompt`);
- **Estimativas de consumo**: carnes, cervejas, refrigerantes e acompanhamentos.

Ao carregar a página, o usuário responde alguns prompts e recebe na tela as quantidades calculadas para cada categoria.

## ✨ Novidades da versão 2026

A versão 2026 substitui as fotos estáticas por **cards 3D animados e interativos**, criados proceduralmente com **Three.js (r185)** — sem depender de arquivos de imagem para o conteúdo dos cards:

| Card | Cena 3D procedural |
| --- | --- |
| Homens | Três humanoides com camisas azul, vermelha e verde |
| Mulheres | Grupo de figuras dançando com vestidos coloridos |
| Crianças | Três crianças brincando + bola quicando |
| Carnes | Pedaços de carne sobre a tábua |
| Cervejas | Garrafas cilíndricas alinhadas em um engradado |
| Acompanhamentos | Tigelas de salada, farofa e legumes |
| Refrigerantes | Latas empilhadas em pirâmide |
| Sucos | Copos com sucos coloridos e canudos |
| Clube | Guarda-sóis, piscina e área de lazer |

Cada card:

- Roda em **WebGL** com o próprio renderer;
- **Animação contínua** (rotação suave, flutuação, partículas);
- **Interage com o mouse** (inclinação ao passar o cursor);
- **Pausa automaticamente** quando fora da tela (`IntersectionObserver`) para economizar recursos;
- Usa `renderer.setAnimationLoop()` e `outputColorSpace = SRGBColorSpace` (boas práticas atuais do Three.js).

### 🎨 Melhorias Three.js r185

- **ACESFilmicToneMapping** + `toneMappingExposure` para HDR realista
- **PCFSoftShadowMap** com bias/normalBias para sombras suaves
- **MeshPhysicalMaterial** com `clearcoat`, `transmission`, `iridescence`, `ior` (vidro, líquidos, metal, água)
- **InstancedMesh** para garrafas (5), latas (6), copos (4), guarda-sóis (2) — performance ×10-100
- **Environment Map procedural** (PMREM via DataTexture) para reflexos realistas sem CORS
- **EffectComposer** + **UnrealBloomPass** (brasas/garrafas) + **FXAA** (anti-aliasing)
- **Sombras PCFSoft** com `castShadow`/`receiveShadow` em todos os objetos

Além dos cards, há uma **cena hero 3D** no topo da página principal com uma churrasqueira animada (brasas, faíscas, fumaça, bloom, sombras).

## 🛠️ Tecnologias

- **HTML5 / CSS3** — estrutura e layout responsivo
- **JavaScript (ES Modules)** — lógica de cálculo e cenas 3D
- **Three.js r185** — renderização 3D via CDN (`unpkg`) com `importmap`
- **jQuery + Slick** — carrossel de imagens nas páginas secundárias (legado)

### 📁 Estrutura do projeto

```
barbecue/
├── index.html          # Página principal (hero 3D + cards 3D + estimativas)
├── churrasco2.html     # Página secundária (slider + cards 3D)
├── churrasco3.html     # Página secundária (slider + cards 3D)
├── css/
│   ├── main.css        # Estilos gerais + .hero-3d + .card-3d + .btn-estimar
│   └── slick.css       # Estilos do carrossel
├── js/
│   ├── cards.js        # Fábrica de cards 3D (renderer, loop, tilt, pausa, envMap, sombras)
│   ├── calculo.js      # Lógica de estimativa de consumo (botão)
│   ├── hero-scene.js   # Cena 3D do topo (churrasqueira + EffectComposer + Bloom + FXAA)
│   ├── themes/         # Cenas 3D de cada card
│   │   ├── homens.js
│   │   ├── mulheres.js
│   │   ├── criancas.js
│   │   ├── carnes.js
│   │   ├── cervejas.js
│   │   ├── acompanhamentos.js
│   │   ├── refrigerantes.js
│   │   ├── sucos.js
│   │   ├── clube.js
│   │   └── common.js   # Helpers + MeshPhysicalMaterial + InstancedMesh
│   ├── main.js         # Carrossel (jQuery/Slick)
│   └── jquery*.js, slick.min.js
└── img/                # Logos, ícones e imagens
```

## 🚀 Como executar localmente

Como os scripts usam **ES Modules** e um `importmap` apontando para CDN, é recomendado servir via HTTP (evita restrições de CORS com `file://`):

```bash
# Na raiz do projeto, com Python 3:
python -m http.server 9000
```

Depois acesse no navegador:

```
http://127.0.0.1:9000/index.html
```

Ou abra os arquivos diretamente pelo navegador (`index.html`, `churrasco2.html` ou `churrasco3.html`).

## 📐 Como funciona o cálculo

| Item | Homens | Mulheres | Crianças |
| --- | --- | --- | --- |
| Cerveja | 5 unidades | 3 unidades | — |
| Carne | 800 g | 700 g | 400 g |
| Acompanhamento | 500 g | 600 g | 300 g |
| Refrigerante | — | — | 5 unidades |

Os valores informados pelo usuário nos prompts alimentam os `getElementById().innerHTML` que exibem os totais em cada card.

## 🧭 Páginas

- `index.html` — página principal com a cena hero e os 9 cards 3D;
- `churrasco2.html` — inclui também o endereço do clube (Google Maps embed);
- `churrasco3.html` — variação com a descrição do clube.

## 📝 Notas

- O arquivo `página barbecue.pdf` é material de referência e **não** faz parte do site (fora do versionamento).
- O Three.js é carregado da CDN `unpkg.com`; é necessária conexão com a internet para renderizar os cards.

## 📄 Licença

Projeto de estudo da turma **Formação Tech Itaú**. Sinta-se livre para usar e adaptar.
