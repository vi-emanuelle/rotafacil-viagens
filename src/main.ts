// src/main.ts — a versão final da noite, com os três laços
import { elemento } from "./dom";
import { viagens } from "./dados";

// ---------- Parte 1: tipos primitivos ----------
const nomeDoSistema: string = "RotaFácil";
const versao: string = "0.1.0";
const hoje: string = new Date().toLocaleDateString("pt-BR");
const autor = "Grupo de Viagens"; // inferência: o TypeScript deduz que é string

elemento("nome-do-sistema").textContent = nomeDoSistema;
elemento("versao").textContent = `v${versao}`;
elemento("data-de-hoje").textContent = hoje;
console.log(`RotaFácil iniciado. Autor: ${autor}`); // aparece no F12

// ---------- Parte 3: o array e os laços ----------
const lista = elemento("lista");

// LAÇO 1 — for...of: percorre os valores, sem índice (desenha cada viagem na tela)
for (const viagem of viagens) {
  const item = document.createElement("li");
  // a cor vem da folha de estilo: viagem--planejada / viagem--confirmada / viagem--concluida
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

// LAÇO 2 — for com índice: contando as viagens ainda planejadas
let planejadas = 0;
for (let i = 0; i < viagens.length; i++) {
  if (viagens[i].situacao === "planejada") {
    planejadas++;
  }
}
elemento("total").textContent = String(viagens.length);
elemento("pendentes").textContent = String(planejadas);

// LAÇO 3 — while: achar a primeira viagem ainda só planejada
// (não sabemos quantas voltas: o laço para assim que encontra)
let posicao = 0;
while (posicao < viagens.length && viagens[posicao].situacao !== "planejada") {
  posicao++;
}
if (posicao < viagens.length) {
  // achou: mostra o aviso na página
  const proxima = viagens[posicao];
  elemento("comece-por").textContent = `Comece a planejar: #${proxima.id} ${proxima.destino}`;
  elemento("comece-por").hidden = false;
}
