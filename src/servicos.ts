import type { NovaViagem, Viagem } from "./tipos";

export function separarAtividades(texto: string): string[] {
  const partes = texto.split(",");
  const atividades: string[] = [];
  for (const parte of partes) {
    const limpa = parte.trim();
    if (limpa !== "") {
      atividades.push(limpa);
    }
  }
  return atividades;
}

export function validarViagem(dados: NovaViagem): string | null {
  if (dados.destino.trim() === "") {
    return "Informe o destino.";
  }
  if (dados.pais.trim() === "") {
    return "Informe o país.";
  }
  return null;
}

function proximoId(lista: Viagem[]): number {
  let maior = 0;
  for (const viagem of lista) {
    if (viagem.id > maior) {
      maior = viagem.id;
    }
  }
  return maior + 1;
}

// O cadastro ainda grava só na tela (a lista que veio da API). Ir para o banco é o próximo passo.
export function cadastrarViagem(lista: Viagem[], dados: NovaViagem): Viagem {
  const nova: Viagem = {
    id: proximoId(lista),
    destino: dados.destino.trim(),
    pais: dados.pais.trim(),
    situacao: dados.situacao,
    tipo: dados.tipo,
    observacao: dados.observacao,
    atividades: dados.atividades,
    criadaEm: new Date(),
  };
  lista.push(nova);
  return nova;
}
