// src/dados.ts — o array principal do sistema (por enquanto, os dados ficam aqui)
//
// Viagem[] significa "array de Viagem": só aceita itens do tipo Viagem.
// Os itens são acessados por índice, que começa em zero:
// a primeira é viagens[0] e a última é viagens[viagens.length - 1].

import type { Viagem } from "./tipos";

export const viagens: Viagem[] = [
  { id: 1, destino: "Paris", pais: "França", situacao: "confirmada",
    tipo: "lazer", atividades: ["Torre Eiffel", "Louvre"], criadaEm: new Date() },
  { id: 2, destino: "Lisboa", pais: "Portugal", situacao: "concluida",
    tipo: "familia", atividades: ["Belém", "Sintra"], criadaEm: new Date() },
  { id: 3, destino: "Nova York", pais: "Estados Unidos", observacao: "Feira de tecnologia",
    situacao: "confirmada", tipo: "trabalho", atividades: ["Central Park", "Times Square"], criadaEm: new Date() },
  { id: 4, destino: "Tóquio", pais: "Japão", situacao: "planejada",
    tipo: "lazer", atividades: ["Shibuya", "Templo Senso-ji"], criadaEm: new Date() },
  { id: 5, destino: "Buenos Aires", pais: "Argentina", situacao: "planejada",
    tipo: "lazer", atividades: ["Caminito", "Casa Rosada"], criadaEm: new Date() },
  { id: 6, destino: "Fernando de Noronha", pais: "Brasil", situacao: "planejada",
    tipo: "familia", atividades: ["Baía do Sancho", "Mergulho"], criadaEm: new Date() },
];
