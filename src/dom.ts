export function elemento(id: string): HTMLElement {
  const alvo = document.getElementById(id);
  if (alvo === null) {
    throw new Error(`Elemento com id "${id}" não foi encontrado na página.`);
  }
  return alvo;
}
