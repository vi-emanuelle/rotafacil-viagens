import { campo, elemento, selecao } from "./dom";
import {
  alterarSituacao,
  cadastrarViagemApi,
  criarConta,
  encerrarSessao,
  entrar,
  guardarSessao,
  listarViagens,
  removerViagem,
  sessaoAtual,
} from "./api";
import { separarAtividades, validarViagem } from "./servicos";
import type { NovaViagem, Situacao, TipoViagem, Viagem } from "./tipos";

elemento("nome-do-sistema").textContent = "RotaFácil";
elemento("versao").textContent = "v0.5.0";
elemento("data-de-hoje").textContent = new Date().toLocaleDateString("pt-BR");

let lista: Viagem[] = [];

function botao(texto: string, extra: string, aoClicar: () => void): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `botao botao--pequeno ${extra}`;
  btn.textContent = texto;
  btn.addEventListener("click", aoClicar);
  return btn;
}

function criarItem(viagem: Viagem): HTMLLIElement {
  const item = document.createElement("li");
  item.className = `viagem viagem--${viagem.situacao}`;

  const titulo = document.createElement("h3");
  titulo.className = "viagem__titulo";
  titulo.textContent = `#${viagem.id} ${viagem.destino}, ${viagem.pais}`;

  const atividades = viagem.atividades.map((nome) => {
    const span = document.createElement("span");
    span.className = "atividade";
    span.textContent = nome;
    return span;
  });
  const linhaAtividades = document.createElement("div");
  linhaAtividades.className = "viagem__atividades";
  linhaAtividades.append(...atividades);

  const texto = document.createElement("div");
  texto.append(titulo, linhaAtividades);

  const acoes = document.createElement("div");
  acoes.className = "viagem__acoes";

  const etiqueta = document.createElement("span");
  etiqueta.className = `etiqueta etiqueta--${viagem.situacao}`;
  etiqueta.textContent = viagem.situacao;
  acoes.append(etiqueta);

  if (viagem.situacao !== "concluida") {
    if (viagem.situacao === "planejada") {
      acoes.append(botao("Confirmar", "", () => mudarSituacao(viagem.id, "confirmada")));
    }
    acoes.append(botao("Concluir", "botao--sucesso", () => mudarSituacao(viagem.id, "concluida")));
  } else {
    acoes.append(botao("Reabrir", "", () => mudarSituacao(viagem.id, "planejada")));
  }
  acoes.append(botao("Remover", "botao--perigo", () => remover(viagem.id)));

  item.append(texto, acoes);
  return item;
}

function desenhar(): void {
  elemento("lista").replaceChildren(...lista.map(criarItem));

  const planejadas = lista.filter((v) => v.situacao === "planejada");
  elemento("total").textContent = String(lista.length);
  elemento("pendentes").textContent = String(planejadas.length);

  const primeira = lista.find((v) => v.situacao === "planejada");
  const aviso = elemento("comece-por");
  if (primeira) {
    aviso.textContent = `Comece a planejar: #${primeira.id} ${primeira.destino}`;
    aviso.hidden = false;
  } else {
    aviso.hidden = true;
  }
}

async function mudarSituacao(id: number, situacao: Situacao): Promise<void> {
  try {
    await alterarSituacao(id, situacao);
    lista = lista.map((v) => (v.id === id ? { ...v, situacao } : v));
    desenhar();
  } catch (erro) {
    mostrarMensagem(erro instanceof Error ? erro.message : "Erro ao atualizar.", true);
  }
}

async function remover(id: number): Promise<void> {
  try {
    await removerViagem(id);
    lista = lista.filter((v) => v.id !== id);
    desenhar();
  } catch (erro) {
    mostrarMensagem(erro instanceof Error ? erro.message : "Erro ao remover.", true);
  }
}

const mensagem = elemento("mensagem-form");

function mostrarMensagem(texto: string, erro: boolean): void {
  mensagem.textContent = texto;
  mensagem.className = erro ? "mensagem mensagem--erro" : "mensagem mensagem--ok";
  mensagem.hidden = false;
}

elemento("form-viagem").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const observacao = campo("observacao").value.trim();
  const dados: NovaViagem = {
    destino: campo("destino").value,
    pais: campo("pais").value,
    situacao: selecao("situacao").value as Situacao,
    tipo: selecao("tipo").value as TipoViagem,
    atividades: separarAtividades(campo("atividades").value),
    observacao: observacao === "" ? undefined : observacao,
  };

  const erro = validarViagem(dados);
  if (erro !== null) {
    mostrarMensagem(erro, true);
    return;
  }

  try {
    const nova = await cadastrarViagemApi(dados);
    lista = [...lista, nova];
    desenhar();
    (elemento("form-viagem") as HTMLFormElement).reset();
    mostrarMensagem(`Viagem #${nova.id} (${nova.destino}) cadastrada!`, false);
  } catch (e) {
    mostrarMensagem(e instanceof Error ? e.message : "Erro ao cadastrar.", true);
  }
});

function mostrarErroEntrada(erro: unknown): void {
  elemento("erro-entrada").textContent =
    erro instanceof Error ? erro.message : "Erro inesperado.";
}

function mostrarFormulario(criando: boolean): void {
  elemento("form-criar").hidden = !criando;
  elemento("form-entrar").hidden = criando;
  elemento("alternar-entrada").textContent = criando
    ? "Já tenho conta"
    : "Ainda não tenho conta";
  elemento("erro-entrada").textContent = "";
}

elemento("alternar-entrada").addEventListener("click", () => {
  mostrarFormulario(elemento("form-criar").hidden === true);
});

elemento("form-entrar").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  try {
    guardarSessao(await entrar(campo("entrar-email").value, campo("entrar-senha").value));
    campo("entrar-senha").value = "";
    await iniciar();
  } catch (erro) {
    mostrarErroEntrada(erro);
  }
});

elemento("form-criar").addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const email = campo("criar-email").value;
  const senha = campo("criar-senha").value;
  try {
    await criarConta(campo("criar-nome").value, email, senha);
    guardarSessao(await entrar(email, senha));
    (elemento("form-criar") as HTMLFormElement).reset();
    await iniciar();
  } catch (erro) {
    mostrarErroEntrada(erro);
  }
});

elemento("botao-sair").addEventListener("click", () => {
  encerrarSessao();
  lista = [];
  (elemento("form-entrar") as HTMLFormElement).reset();
  mostrarFormulario(false);
  iniciar();
});

async function iniciar(): Promise<void> {
  const sessao = sessaoAtual();
  elemento("tela-entrada").hidden = sessao !== undefined;
  elemento("tela-app").hidden = sessao === undefined;
  elemento("botao-sair").hidden = sessao === undefined;
  elemento("usuario-nome").textContent = sessao?.nome ?? "";

  if (!sessao) {
    return;
  }

  elemento("erro-entrada").textContent = "";
  const avisoApi = elemento("erro-api");
  avisoApi.hidden = true;

  try {
    lista = await listarViagens();
    desenhar();
  } catch (erro) {
    avisoApi.textContent = erro instanceof Error ? erro.message : "Erro ao carregar.";
    avisoApi.hidden = false;
  }
}

iniciar();