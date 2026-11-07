// src/tipos.ts — o contrato do sistema: como é uma Viagem

export type Situacao = "planejada" | "confirmada" | "concluida";

// Tipo/motivo da viagem (faz o papel do "status" do TaskFlow)
export type TipoViagem = "lazer" | "trabalho" | "familia";

export interface Viagem {
  readonly id: number;        // readonly: não muda depois de criada
  destino: string;            // texto — para onde vamos
  pais: string;               // texto — país do destino
  situacao: Situacao;         // só aceita os valores do union type Situacao
  tipo: TipoViagem;           // só aceita os valores do union type TipoViagem
  observacao?: string;        // o ? indica propriedade OPCIONAL
  atividades: string[];       // lista (array de textos) — faz o papel das "tags"
  criadaEm: Date;             // quando o registro foi criado
}
