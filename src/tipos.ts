export type Situacao = "planejada" | "confirmada" | "concluida";
export type TipoViagem = "lazer" | "trabalho" | "familia";

export interface Viagem {
  readonly id: number;
  destino: string;
  pais: string;
  situacao: Situacao;
  tipo: TipoViagem;
  observacao?: string;
  atividades: string[];
  criadaEm: Date;
}

export type NovaViagem = Omit<Viagem, "id" | "criadaEm">;

export interface Sessao {
  token: string;
  nome: string;
}

export type Contagem = Record<Situacao, number>;