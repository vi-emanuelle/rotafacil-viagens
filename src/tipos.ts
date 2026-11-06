// src/tipos.ts — o contrato do sistema: como é uma Viagem
//
// Union types literais: fecham os valores possíveis de cada campo.
// Na Aula 2 eles viram ENUM na tabela "viagens" do banco de dados MySQL.

// Situação da viagem (faz o papel da "prioridade" do TaskFlow — é ela que dá a cor)
export type Situacao = "planejada" | "confirmada" | "concluida";

// Tipo/motivo da viagem (faz o papel do "status" do TaskFlow)
export type TipoViagem = "lazer" | "trabalho" | "familia";

// A interface Viagem é um contrato: todo objeto Viagem precisa cumprir isto,
// e o compilador confere antes de a página rodar.
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
