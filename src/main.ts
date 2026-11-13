import { elemento } from "./dom";
import { viagens } from "./dados";
import { cadastrarViagem, separarAtividades, validarViagem } from "./servicos";
import type { NovaViagem, Situacao, TipoViagem } from "./tipos";

// ---------- Parte 1: tipos primitivos ----------
const nomeDoSistema: string = "RotaFácil";
const versao: string = "0.2.0";
const hoje: string = new Date().toLocaleDateString("pt-BR");
const autor = "Grupo de Viagens";

elemento("nome-do-sistema").textContent = nomeDoSistema;
elemento("versao").textContent = `v${versao}`;
elemento("data-de-hoje").textContent = hoje;
console.log(`RotaFácil iniciado. Autor: ${autor}`);

// ---------- Desenha a lista e o painel (usa os três laços) ----------
const lista = elemento("lista");

function atualizarTela(): void {
  lista.replaceChildren();

  // LAÇO 1 — for...of: desenha cada viagem
  for (const viagem of viagens) {
    const item = document.createElement("li");
    item.className = `viagem viagem--${viagem.situacao}`;

    const titulo = document.createElement("h3");
    titulo.className = "viagem__titulo";
    titulo.textContent = `#${viagem.id} ${viagem.destino}, ${viagem.pais}`;

    const etiqueta = document.createElement("span");
    etiqueta.className = `etiqueta etiqueta--${viagem.situacao}`;
    etiqueta.textContent = viagem.situacao;

    item.append(titulo, etiqueta);
    lista.append(item);
  }

  // LAÇO 2 — for com índice: conta as viagens planejadas
  let planejadas = 0;
  for (let i = 0; i < viagens.length; i++) {
    if (viagens[i].situacao === "planejada") {
      planejadas++;
    }
  }
  elemento("total").textContent = String(viagens.length);
  elemento("pendentes").textContent = String(planejadas);

  // LAÇO 3 — while: acha a primeira viagem planejada
  let posicao = 0;
  while (posicao < viagens.length && viagens[posicao].situacao !== "planejada") {
    posicao++;
  }
  const aviso = elemento("comece-por");
  if (posicao < viagens.length) {
    const proxima = viagens[posicao];
    aviso.textContent = `Comece a planejar: #${proxima.id} ${proxima.destino}`;
    aviso.hidden = false;
  } else {
    aviso.hidden = true;
  }
}

// ---------- Parte 2: formulário de cadastro ----------
const formulario = elemento("form-viagem") as HTMLFormElement;
const mensagem = elemento("mensagem-form");

function mostrarMensagem(texto: string, erro: boolean): void {
  mensagem.textContent = texto;
  mensagem.className = erro ? "mensagem mensagem--erro" : "mensagem mensagem--ok";
  mensagem.hidden = false;
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const observacao = (elemento("observacao") as HTMLInputElement).value.trim();
  const dados: NovaViagem = {
    destino: (elemento("destino") as HTMLInputElement).value,
    pais: (elemento("pais") as HTMLInputElement).value,
    situacao: (elemento("situacao") as HTMLSelectElement).value as Situacao,
    tipo: (elemento("tipo") as HTMLSelectElement).value as TipoViagem,
    atividades: separarAtividades((elemento("atividades") as HTMLInputElement).value),
    observacao: observacao === "" ? undefined : observacao,
  };

  const erro = validarViagem(dados);
  if (erro !== null) {
    mostrarMensagem(erro, true);
    return;
  }

  const nova = cadastrarViagem(dados);
  atualizarTela();
  formulario.reset();
  mostrarMensagem(`Viagem #${nova.id} (${nova.destino}) cadastrada!`, false);
});

atualizarTela();
