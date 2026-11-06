// src/dom.ts — vem pronto (igual ao do TaskFlow).
// Na Aula 3 você vai entender como ele funciona por dentro (com o find). Até lá, use sem culpa.
//
// A função "elemento" recebe o id de um pedaço da página (o nome único daquele ponto)
// e devolve o elemento HTML correspondente, pronto para você escrever nele.
// Se o id não existir, ela avisa com um erro claro em vez de devolver null.

export function elemento(id: string): HTMLElement {
  const alvo = document.getElementById(id);
  if (alvo === null) {
    throw new Error(`Elemento com id "${id}" não foi encontrado na página.`);
  }
  return alvo;
}
