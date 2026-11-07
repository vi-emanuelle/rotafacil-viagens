# ✈️ RotaFácil — Planejador de Viagens

Sistema de planejamento de viagens desenvolvido em **TypeScript + Vite**, rodando no navegador.
Projeto do grupo construído em paralelo ao **TaskFlow**, com o tema **viagens**.

> **Fase 1 (Aula 1):** ambiente, tipos primitivos, `interface` e `type`, array tipado e os três laços de repetição (`for...of`, `for`, `while`).

---

## 📸 Tela inicial

A página abre com o **nome** e a **versão** do sistema, a **data de hoje**, um painel com o **total de viagens** e quantas estão **planejadas**, e a **lista de viagens** com cores por situação:

| Situação | Cor |
|---|---|
| 🟠 `planejada` | laranja |
| 🟢 `confirmada` | verde |
| ⚫ `concluida` | cinza (esmaecida) |

---

## 🗂️ Estrutura do projeto

```
rotafacil-viagens/
├── index.html          # tela inicial (nome, versão e data)
├── package.json        # scripts: dev e verificar
├── tsconfig.json       # configuração do TypeScript (strict)
├── .gitignore
├── css/
│   └── style.css       # cores por situação + painel
└── src/
    ├── dom.ts          # vem pronto — função "elemento"
    ├── tipos.ts        # Types (union) + Interface Viagem
    ├── dados.ts        # Array de objetos (6 viagens)
    └── main.ts         # renderização com os 3 laços
```

---

## 🧩 Conceitos aplicados

### Types e Interface (`src/tipos.ts`)
- **`type` (union)** fecha os valores possíveis de um campo:
  - `Situacao`: `"planejada" | "confirmada" | "concluida"`
  - `TipoViagem`: `"lazer" | "trabalho" | "familia"`
- **`interface Viagem`** é o contrato: todo objeto precisa cumprir as propriedades declaradas.
  Usa `readonly` (id não muda), `?` (propriedade opcional) e `string[]` (array tipado).

### Array de objetos (`src/dados.ts`)
- `viagens: Viagem[]` — lista com 6 viagens. `Viagem[]` só aceita itens do tipo `Viagem`.
- Os itens são acessados por índice, que começa em **zero**.

### Os três laços (`src/main.ts`)
| Laço | Função no projeto |
|---|---|
| `for...of` | Percorre as viagens e desenha um `<li>` para cada uma na tela |
| `for` (com índice) | Conta quantas viagens ainda estão `planejada` (painel) |
| `while` | Encontra a primeira viagem planejada e mostra o aviso "Comece a planejar" |

---

## 🚀 Como rodar

> ⚠️ **Não abra o `index.html` com dois cliques.** Pelo endereço `file://` os módulos não carregam e a página aparece em branco. Use sempre o `npm run dev`.

```bash
# 1) Instalar as dependências (primeira vez)
npm install

# 2) Rodar em modo desenvolvimento
npm run dev
# Abra o endereço que aparecer: http://localhost:5173

# 3) Conferir os tipos (TypeScript)
npm run verificar      # roda: tsc --noEmit
```

---

## 🛠️ Tecnologias

- **TypeScript** — tipagem estática (`strict: true`)
- **Vite** — servidor de desenvolvimento e build

---

## 📅 Roadmap (aulas 1 → 7)

- [x] **Aula 1 — Fase 1:** tela inicial, tipos, interface e lista de viagens
- [ ] Próximas fases: banco de dados MySQL, filtros, formulários e funcionalidades extras
- [ ] **Aula 7 (26/11):** apresentação do sistema funcionando

---

## 👥 Grupo

Projeto desenvolvido pelo **grupo de Viagens** — tema escolhido para construir em paralelo ao TaskFlow.
