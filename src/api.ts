import type { NovaViagem, Sessao, Situacao, Viagem } from "./tipos";

const CHAVE_SESSAO = "rotafacil:sessao";

export function sessaoAtual(): Sessao | undefined {
  const texto = localStorage.getItem(CHAVE_SESSAO);
  return texto ? (JSON.parse(texto) as Sessao) : undefined;
}

export function guardarSessao(sessao: Sessao): void {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

export function encerrarSessao(): void {
  localStorage.removeItem(CHAVE_SESSAO);
}

async function enviar(metodo: string, url: string, corpo?: unknown): Promise<Response> {
  const sessao = sessaoAtual();
  const resposta = await fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      ...(sessao ? { Authorization: `Bearer ${sessao.token}` } : {}),
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });

  if (resposta.status === 401 && sessao) {
    encerrarSessao();
    location.reload();
  }

  if (!resposta.ok) {
    const dados = (await resposta.json().catch(() => ({}))) as { erro?: string };
    const semApi = resposta.status === 502 || resposta.status === 504;
    throw new Error(
      dados.erro ??
        (semApi
          ? "A API não respondeu. Rode npm run dev na pasta api."
          : `Erro ${resposta.status}`)
    );
  }
  return resposta;
}

function converter(viagem: Viagem): Viagem {
  return { ...viagem, criadaEm: new Date(viagem.criadaEm) };
}

export async function listarViagens(): Promise<Viagem[]> {
  const resposta = await enviar("GET", "/api/viagens");
  const bruto = (await resposta.json()) as Viagem[];
  return bruto.map(converter);
}

export async function cadastrarViagemApi(dados: NovaViagem): Promise<Viagem> {
  const resposta = await enviar("POST", "/api/viagens", dados);
  return converter((await resposta.json()) as Viagem);
}

export async function alterarSituacao(id: number, situacao: Situacao): Promise<void> {
  await enviar("PATCH", `/api/viagens/${id}/situacao`, { situacao });
}

export async function removerViagem(id: number): Promise<void> {
  await enviar("DELETE", `/api/viagens/${id}`);
}

export async function entrar(email: string, senha: string): Promise<Sessao> {
  const resposta = await enviar("POST", "/api/login", { email, senha });
  return (await resposta.json()) as Sessao;
}

export async function criarConta(nome: string, email: string, senha: string): Promise<void> {
  await enviar("POST", "/api/usuarios", { nome, email, senha });
}