export function elemento(id: string): HTMLElement {
  const alvo = document.getElementById(id);
  if (alvo === null) {
    throw new Error(`Elemento com id "${id}" não foi encontrado na página.`);
  }
  return alvo;
}

export function campo(id: string): HTMLInputElement {
  const alvo = elemento(id);
  if (!(alvo instanceof HTMLInputElement)) {
    throw new Error(`O elemento "${id}" não é um <input>.`);
  }
  return alvo;
}

export function selecao(id: string): HTMLSelectElement {
  const alvo = elemento(id);
  if (!(alvo instanceof HTMLSelectElement)) {
    throw new Error(`O elemento "${id}" não é um <select>.`);
  }
  return alvo;
}
