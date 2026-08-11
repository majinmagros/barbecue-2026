# PROGRESSO — barbecue-2026

Contexto da sessão de auditoria (padrão aplicado no repo irmão `dna-2026`).

## Auditoria aplicada (skills: accessibility · production-audit · seo · make-interfaces-feel-better)

### SEO
- `index.html`, `churrasco2.html`, `churrasco3.html`:
  - `lang="pt-BR"` no `<html>`
  - viewport + meta description + Open Graph (og:title/description/type/locale) + theme-color
  - title descritivo por página
- `robots.txt` + `sitemap.xml` criados
- `404.html` criado (noindex, volta ao index)

### A11y
- `skip-link` "Pular para o conteúdo" no início do `<body>`
- `id="conteudo"` no bloco de conteúdo principal

### CSS (`css/main.css`)
- `:focus-visible` global (cyan #00bac6)
- font-smoothing / text-rendering
- `text-wrap: balance` em p/h1/h2/h3
- `font-variant-numeric: tabular-nums` nos resultados (`res-*`)
- estilo do `.skip-link`

## Pendências / observações
- **Dominio do sitemap/robots**: usar `https://formacaotech.itau.com.br/` — confirmar domínio real de produção antes de publicar.
- `canonical` não foi adicionado nas páginas (aguarda domínio real). 
- Menus de navegação (`href=""` vazios) e redes sociais (`<a href="">`) não foram preenchidos — escopo mantido fora da auditoria.
- Não commitado. Repo limpo na branch `master` antes da edição.
