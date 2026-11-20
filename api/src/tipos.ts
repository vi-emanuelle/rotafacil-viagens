export type Situacao = "planejada" | "confirmada" | "concluida";
export type TipoViagem = "lazer" | "trabalho" | "familia";

export const SITUACOES: Situacao[] = ["planejada", "confirmada", "concluida"];
export const TIPOS: TipoViagem[] = ["lazer", "trabalho", "familia"];

export interface DadosViagem {
  destino?: string;
  pais?: string;
  situacao?: Situacao;
  tipo?: TipoViagem;
  observacao?: string | null;
  atividades?: string[];
}