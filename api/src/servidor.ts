import "dotenv/config";
import bcrypt from "bcryptjs";
import express, { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { exigirLogin, SEGREDO, usuarioDe } from "./autenticacao";
import { banco } from "./banco";
import { SITUACOES, TIPOS, type DadosViagem, type Situacao } from "./tipos";

const app = express();
app.use(express.json());

const SELECT_VIAGENS = `
  SELECT id, destino, pais, situacao, tipo, observacao,
         criada_em AS criadaEm
    FROM viagens`;

function montarViagem(linha: RowDataPacket, atividades: RowDataPacket[]) {
  return {
    ...linha,
    observacao: linha.observacao ?? undefined,
    atividades: atividades
      .filter((a) => a.viagem_id === linha.id)
      .map((a) => a.nome as string),
  };
}

async function buscarUma(id: number, usuarioId: number) {
  const [linhas] = await banco.execute<RowDataPacket[]>(
    `${SELECT_VIAGENS} WHERE id = ? AND usuario_id = ?`,
    [id, usuarioId]
  );
  if (linhas.length === 0) {
    return undefined;
  }
  const [atividades] = await banco.execute<RowDataPacket[]>(
    "SELECT viagem_id, nome FROM atividades WHERE viagem_id = ? ORDER BY id",
    [id]
  );
  return montarViagem(linhas[0], atividades);
}

function validar(dados: DadosViagem): string | undefined {
  if (typeof dados.destino !== "string" || dados.destino.trim() === "") {
    return "Informe o destino.";
  }
  if (typeof dados.pais !== "string" || dados.pais.trim() === "") {
    return "Informe o país.";
  }
  if (dados.situacao !== undefined && !SITUACOES.includes(dados.situacao)) {
    return "Situação inválida.";
  }
  if (dados.tipo !== undefined && !TIPOS.includes(dados.tipo)) {
    return "Tipo inválido.";
  }
  return undefined;
}

// ROTAS DE VIAGENS 

app.get("/api/viagens", exigirLogin, async (_req, res) => {
  const usuarioId = usuarioDe(res);
  const [linhas] = await banco.execute<RowDataPacket[]>(
    `${SELECT_VIAGENS} WHERE usuario_id = ? ORDER BY id`,
    [usuarioId]
  );
  const [atividades] = await banco.execute<RowDataPacket[]>(
    "SELECT viagem_id, nome FROM atividades ORDER BY id"
  );
  res.json(linhas.map((linha) => montarViagem(linha, atividades)));
});

app.get("/api/viagens/:id", exigirLogin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(404).json({ erro: `Viagem #${req.params.id} não encontrada.` });
    return;
  }
  const viagem = await buscarUma(id, usuarioDe(res));
  if (!viagem) {
    res.status(404).json({ erro: `Viagem #${id} não encontrada.` });
    return;
  }
  res.json(viagem);
});

app.post("/api/viagens", exigirLogin, async (req, res) => {
  const dados = req.body as DadosViagem;
  const problema = validar(dados);
  if (problema) {
    res.status(400).json({ erro: problema });
    return;
  }

  const usuarioId = usuarioDe(res);
  const [resultado] = await banco.execute<ResultSetHeader>(
    `INSERT INTO viagens (usuario_id, destino, pais, situacao, tipo, observacao)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      usuarioId,
      dados.destino!.trim(),
      dados.pais!.trim(),
      dados.situacao ?? "planejada",
      dados.tipo ?? "lazer",
      dados.observacao?.trim() || null,
    ]
  );

  const novaId = resultado.insertId;
  const listaAtividades = Array.isArray(dados.atividades) ? dados.atividades : [];
  for (const nome of listaAtividades) {
    if (typeof nome === "string" && nome.trim() !== "") {
      await banco.execute(
        "INSERT INTO atividades (viagem_id, nome) VALUES (?, ?)",
        [novaId, nome.trim()]
      );
    }
  }

  res.status(201).json(await buscarUma(novaId, usuarioId));
});

app.patch("/api/viagens/:id/situacao", exigirLogin, async (req, res) => {
  const { situacao } = req.body as { situacao?: Situacao };
  if (!situacao || !SITUACOES.includes(situacao)) {
    res.status(400).json({ erro: "Situação inválida." });
    return;
  }

  const [resultado] = await banco.execute<ResultSetHeader>(
    "UPDATE viagens SET situacao = ? WHERE id = ? AND usuario_id = ?",
    [situacao, Number(req.params.id), usuarioDe(res)]
  );

  if (resultado.affectedRows === 0) {
    res.status(404).json({ erro: `Viagem #${req.params.id} não encontrada.` });
    return;
  }
  res.status(204).end();
});

app.delete("/api/viagens/:id", exigirLogin, async (req, res) => {
  const [resultado] = await banco.execute<ResultSetHeader>(
    "DELETE FROM viagens WHERE id = ? AND usuario_id = ?",
    [Number(req.params.id), usuarioDe(res)]
  );

  if (resultado.affectedRows === 0) {
    res.status(404).json({ erro: `Viagem #${req.params.id} não encontrada.` });
    return;
  }
  res.status(204).end();
});

// ---------- ROTAS DE USUÁRIOS ----------

app.post("/api/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body as {
    nome?: string;
    email?: string;
    senha?: string;
  };
  if (!nome?.trim() || !email?.includes("@") || !senha || senha.length < 6) {
    res.status(400).json({
      erro: "Preencha nome, e-mail válido e senha de 6 caracteres ou mais.",
    });
    return;
  }

  const hash = await bcrypt.hash(senha, 10);
  try {
    const [resultado] = await banco.execute<ResultSetHeader>(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
      [nome.trim(), email.trim().toLowerCase(), hash]
    );
    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    if ((erro as { code?: string }).code === "ER_DUP_ENTRY") {
      res.status(409).json({ erro: "Este e-mail já está cadastrado." });
      return;
    }
    throw erro;
  }
});

app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body as { email?: string; senha?: string };
  const [linhas] = await banco.execute<RowDataPacket[]>(
    "SELECT id, nome, senha_hash FROM usuarios WHERE email = ?",
    [email?.trim().toLowerCase() ?? ""]
  );
  const usuario = linhas[0];

  if (!usuario || !senha || !(await bcrypt.compare(senha, usuario.senha_hash))) {
    res.status(401).json({ erro: "E-mail ou senha inválidos." });
    return;
  }

  const token = jwt.sign({ id: usuario.id }, SEGREDO, { expiresIn: "8h" });
  res.json({ token, nome: usuario.nome });
});

app.use((erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(erro);
  res.status(500).json({ erro: "Algo deu errado no servidor. Tente de novo." });
});

app.listen(3000, () => console.log("API do RotaFácil em http://localhost:3000"));