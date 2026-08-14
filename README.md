# 🍖 Churrasco Formação Tech — Barbecue 2026

> Página web para organização do churrasco da **Formação Tech Itaú** no **Clube Itaú Guarapiranga**, com **hero 3D em Three.js (r185)** e estimativa de consumo calculada por `prompt()`.

## 🔗 Acesso online

- **Página principal:** https://majinmagros.github.io/barbecue-2026/
- **Página 2:** https://majinmagros.github.io/barbecue-2026/churrasco2.html
- **Página 3:** https://majinmagros.github.io/barbecue-2026/churrasco3.html

> **Nota:** O site usa ES Modules via `importmap` + Three.js CDN (unpkg). Funciona apenas via HTTP/HTTPS (não abre via `file://`). Para rodar localmente, use um servidor HTTP (ex: `python -m http.server 9000`).

## 📋 Sobre o projeto

Ao carregar a página, o usuário responde alguns `prompt()` (quantidade de **homens**, **mulheres**, **crianças** e a **melhor data**) e recebe na tela as estimativas calculadas para cada categoria:

- **Consumo por pessoa**: cerveja (5 H / 3 M), carne (800 g H / 700 g M / 400 g C), acompanhamento (500 g / 600 g / 300 g), refrigerante (5 por criança).
- **Totais exibidos** por grupo e no total geral (carnes, cervejas, acompanhamento, refrigerantes).
- Data escolhida apresentada em destaque após o cálculo.

## ✨ Hero 3D

O topo da página principal tem uma **cena hero 3D** em **Three.js (r185)** renderizada por `js/hero-scene.js`:

- Textura de partículas gerada proceduralmente (gradiente radial em canvas).
- Entidades mescladas via `mergeGeometries` e partículas animadas.
- Elementos carregados da CDN (**unpkg**) via `importmap` — é necessária conexão com a internet.

## 🛠️ Tecnologias

- **HTML5 / CSS3** — estrutura, layout responsivo e estilos do site
- **Three.js r185** — cena hero 3D via CDN (`unpkg`) com `importmap`
- **jQuery + Slick** — carrossel nas páginas secundárias (legado)

## 📁 Estrutura do projeto

```
barbecue-2026/
├── index.html          # Página principal (hero 3D + prompts de estimativa)
├── churrasco2.html     # Página secundária (slider + embed do Google Maps do Clube Itaú Guarapiranga)
├── churrasco3.html     # Página secundária (slider principal)
├── css/
│   ├── main.css        # Estilos gerais + .hero-3d
│   └── slick.css       # Estilos do carrossel (Slick)
├── js/
│   ├── hero-scene.js   # Cena 3D do topo (partículas Three.js)
│   ├── main.js         # Inicialização do carrossel (Slick)
│   ├── jquery.js, jquery-migrate.js, slick.min.js   # Bibliotecas (CDN/local)
├── scripts/
│   └── verify.py       # Verificador de qualidade (HTML/CSS/JS)
├── .github/workflows/
│   └── quality.yml     # CI: roda python scripts/verify.py . em push/PR
└── img/                # Logos, ícones e imagens
```

## 🚀 Como executar localmente

Como os scripts usam **ES Modules** + `importmap` (CDN), é recomendado servir via HTTP:

```bash
python -m http.server 9000
```

Depois acesse no navegador: `http://127.0.0.1:9000/index.html`.

## ✅ Qualidade (CI)

O repositório tem um workflow que roda `python scripts/verify.py .` em `push`/`pull_request`:
verifica **sintaxe JS** (`node --check`, pulando vendored), **referências locais de src/href** inexistentes em HTML/CSS, **atributos vazios** e **balanceamento de chaves no CSS**.

## 📝 Notas

- O arquivo `página barbecue.pdf` é material de referência e **não** faz parte do site.
- O Three.js é carregado da CDN `unpkg.com`; é necessária conexão com a internet.

## 📄 Licença

Projeto de estudo da turma **Formação Tech Itaú**. Sinta-se livre para usar e adaptar.