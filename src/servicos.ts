import type { Contagem, NovaViagem, Situacao, Viagem } from "./tipos";

// filter: selecionar por situação
export function filtrarPorSituacao(lista: Viagem[], situacao: Situacao): Viagem[] {
  return lista.filter((v) => v.situacao === situacao);
}

// filter + includes: pesquisar por destino ou país
export function pesquisarPorDestino(lista: Viagem[], termo: string): Viagem[] {
  const procurado = termo.trim().toLowerCase();
  return lista.filter(
    (v) =>
      v.destino.toLowerCase().includes(procurado) ||
      v.pais.toLowerCase().includes(procurado)
  );
}

// some e every: perguntas de sim ou não
export function existePlanejada(lista: Viagem[]): boolean {
  return lista.some((v) => v.situacao === "planejada");
}

export function todasConcluidas(lista: Viagem[]): boolean {
  return lista.length > 0 && lista.every((v) => v.situacao === "concluida");
}

// reduce: contagem local (alternativa ao GROUP BY do banco)
export function contarPorSituacao(lista: Viagem[]): Contagem {
  return lista.reduce<Contagem>(
    (acumulador, v) => {
      acumulador[v.situacao]++;
      return acumulador;
    },
    { planejada: 0, confirmada: 0, concluida: 0 }
  );
}

// sort: ordena sem alterar o array original
const pesoSituacao: Record<Situacao, number> = {
  planejada: 3,
  confirmada: 2,
  concluida: 1,
};

export function ordenarPorSituacao(lista: Viagem[]): Viagem[] {
  return [...lista].sort(
    (a, b) => pesoSituacao[b.situacao] - pesoSituacao[a.situacao]
  );
}

export function separarAtividades(texto: string): string[] {
  return texto
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

export function validarViagem(dados: NovaViagem): string | null {
  if (dados.destino.trim() === "") return "Informe o destino.";
  if (dados.pais.trim() === "") return "Informe o país.";
  return null;
}