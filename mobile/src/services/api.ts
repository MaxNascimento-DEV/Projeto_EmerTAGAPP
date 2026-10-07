import { Platform } from 'react-native';

// ==============================================
// Endereço do backend
// ----------------------------------------------
// Defina EXPO_PUBLIC_API_URL no arquivo Mobile/.env, ex.:
//   EXPO_PUBLIC_API_URL=http://192.168.0.10:8080
// (use o IP da máquina que roda o Spring quando testar no celular físico)
// Sem .env: emulador Android usa 10.0.2.2, o resto usa localhost.
// ==============================================
const PADRAO = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || PADRAO).replace(/\/$/, '');

// ---------- Tipos (espelham os DTOs do backend) ----------

export type TipoPerfil = 'PROPRIO' | 'PROTEGIDO';
export type TamanhoTexto = 'PEQUENO' | 'MEDIO' | 'GRANDE';

export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  telefone?: string | null;
  fotoUrl?: string | null;
  criadoEm?: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface PerfilEmergencia {
  idPerfil: number;
  nome: string;
  dataNascimento: string; // yyyy-MM-dd
  tipoSanguineo?: string | null;
  fotoUrl?: string | null;
  tipoPerfil: TipoPerfil;
  parentesco?: string | null;
  tokenPublico: string;
  urlPublica: string;
  ultimaAtualizacaoSaude?: string | null;
}

export interface PerfilEmergenciaRequest {
  nome: string;
  dataNascimento: string; // yyyy-MM-dd
  tipoSanguineo?: string | null;
  fotoUrl?: string | null;
  tipoPerfil: TipoPerfil;
  parentesco?: string | null;
}

// Formato usado pelo GET e PUT de /perfis/{id}/saude
export interface DadosSaudeApi {
  alergia: string[];
  condicoesSaude: string[];
  medicamentos: string[];
  necessidadeEspecificas: string[];
  biosseguranca: string[];
}

export interface PrivacidadePerfil {
  exibirAlergias: boolean;
  exibirCondicoes: boolean;
  exibirMedicamentos: boolean;
  exibirNecessidades: boolean;
  exibirBiosseguranca: boolean;
  exibirIdade: boolean;
  exibirTipoSanguineo: boolean;
}

export interface ContatoEmergencia {
  idContato: number;
  nome: string;
  relacao: string;
  telefone: string;
}

export type ContatoEmergenciaRequest = Omit<ContatoEmergencia, 'idContato'>;

export interface PerfilPublico {
  nome: string;
  idade?: number | null;
  tipoSanguineo?: string | null;
  fotoUrl?: string | null;
  alergias?: string[] | null;
  condicoes?: string[] | null;
  medicamentos?: string[] | null;
  necessidadesEspecificas?: string[] | null;
  biosseguranca?: string | null;
  contatos?: ContatoEmergenciaRequest[] | null;
}

export interface MembroRede {
  idRede: number;
  idPerfil: number;
  nomePerfil: string;
  idUsuario: number;
  nomeUsuario: string;
  podeVisualizarPrivado: boolean;
  podeEditar: boolean;
}

export interface ConviteRede {
  idConvite: number;
  idPerfil: number;
  nomePerfil: string;
  emailConvidado: string;
  podeVisualizarPrivado: boolean;
  podeEditar: boolean;
  status: 'PENDENTE' | 'ACEITO' | 'RECUSADO' | 'CANCELADO';
  criadoEm: string;
  respondidoEm?: string | null;
}

export interface ConfiguracaoAcessibilidade {
  tamanhoTexto: TamanhoTexto;
  altoContraste: boolean;
}

// ---------- Sessão ----------
// O token fica só em memória: fechar o app pede login de novo.

let token: string | null = null;
let aoExpirarSessao: (() => void) | null = null;

export const sessao = {
  definirToken(novo: string | null) {
    token = novo;
  },
  logado() {
    return token !== null;
  },
  // App.tsx registra aqui o que fazer quando o backend responder 401
  aoExpirar(callback: () => void) {
    aoExpirarSessao = callback;
  },
};

// ---------- Cliente HTTP ----------

export class ApiError extends Error {
  status: number;
  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.status = status;
  }
}

async function requisicao<T>(metodo: string, endpoint: string, corpo?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${endpoint}`, {
      method: metodo,
      headers,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ApiError(`Não foi possível conectar ao servidor (${API_URL}).`, 0);
  }

  if (resposta.status === 401) {
    token = null;
    aoExpirarSessao?.();
    throw new ApiError('Sua sessão expirou. Faça login novamente.', 401);
  }

  if (!resposta.ok) {
    // GlobalExceptionHandler: { erro: "..." } ou, na validação, { campo: "mensagem" }
    const dados = await resposta.json().catch(() => null);
    let mensagem = `Erro ${resposta.status}`;
    if (dados?.erro) {
      mensagem = dados.erro;
    } else if (dados && typeof dados === 'object') {
      const validacoes = Object.values(dados).filter(v => typeof v === 'string');
      if (validacoes.length) mensagem = validacoes.join('\n');
    }
    throw new ApiError(mensagem, resposta.status);
  }

  if (resposta.status === 204) return undefined as T;
  const texto = await resposta.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

// Envia uma imagem (em base64) para POST /fotos e devolve o caminho salvo (ex.: /uploads/abc.jpg).
// Usa JSON e não FormData: o fetch do Expo 57 não aceita arquivos no formato { uri, name, type }.
async function enviarFoto(base64: string, mimeType = 'image/jpeg'): Promise<string> {
  const resposta = await requisicao<{ url: string }>('POST', '/fotos', { base64, mimeType });
  return resposta.url;
}

// Fotos salvas no backend vêm como caminho relativo (/uploads/...): completa com o endereço do servidor
export function urlFoto(fotoUrl?: string | null): string | null {
  if (!fotoUrl) return null;
  return fotoUrl.startsWith('/') ? `${API_URL}${fotoUrl}` : fotoUrl;
}

const get = <T>(endpoint: string) => requisicao<T>('GET', endpoint);
const post = <T>(endpoint: string, corpo?: unknown) => requisicao<T>('POST', endpoint, corpo);
const put = <T>(endpoint: string, corpo?: unknown) => requisicao<T>('PUT', endpoint, corpo);
const del = <T>(endpoint: string) => requisicao<T>('DELETE', endpoint);

// ---------- Endpoints ----------

export const api = {
  fotos: {
    enviar: enviarFoto,
  },

  usuarios: {
    cadastrar: (dados: { nome: string; email: string; senha: string; telefone?: string }) =>
      post<Usuario>('/usuarios', dados),
    login: (email: string, senha: string) => post<LoginResponse>('/usuarios/login', { email, senha }),
    meusDados: () => get<Usuario>('/usuarios/meus-dados'),
    atualizar: (dados: { nome: string; telefone?: string | null; fotoUrl?: string | null }) =>
      post<Usuario>('/usuarios/atualizar-dados', dados),
    alterarSenha: (senhaAtual: string, novaSenha: string) =>
      put<void>('/usuarios/senha', { senhaAtual, novaSenha }),
  },

  perfis: {
    meus: () => get<PerfilEmergencia[]>('/perfis/meus-perfis'),
    criar: (dados: PerfilEmergenciaRequest) => post<PerfilEmergencia>('/perfis/criar', dados),
    atualizar: (idPerfil: number, dados: PerfilEmergenciaRequest) =>
      put<PerfilEmergencia>(`/perfis/${idPerfil}`, dados),
    regenerarToken: (idPerfil: number) => post<PerfilEmergencia>(`/perfis/${idPerfil}/regenerar-token`),
    publico: (tokenPublico: string) => get<PerfilPublico>(`/perfis/publico/${encodeURIComponent(tokenPublico)}`),
  },

  saude: {
    buscar: (idPerfil: number) => get<DadosSaudeApi>(`/perfis/${idPerfil}/saude`),
    substituir: (idPerfil: number, dados: DadosSaudeApi) => put<DadosSaudeApi>(`/perfis/${idPerfil}/saude`, dados),
  },

  privacidade: {
    buscar: (idPerfil: number) => get<PrivacidadePerfil>(`/perfis/${idPerfil}/privacidade`),
    atualizar: (idPerfil: number, dados: PrivacidadePerfil) =>
      put<PrivacidadePerfil>(`/perfis/${idPerfil}/privacidade`, dados),
  },

  // Atenção: no backend esse controller usa /perfil (singular)
  contatos: {
    listar: (idPerfil: number) => get<ContatoEmergencia[]>(`/perfil/${idPerfil}/contatos`),
    adicionar: (idPerfil: number, dados: ContatoEmergenciaRequest) =>
      post<ContatoEmergencia>(`/perfil/${idPerfil}/contatos`, dados),
    atualizar: (idPerfil: number, idContato: number, dados: ContatoEmergenciaRequest) =>
      put<ContatoEmergencia>(`/perfil/${idPerfil}/contatos/${idContato}`, dados),
    remover: (idPerfil: number, idContato: number) => del<void>(`/perfil/${idPerfil}/contatos/${idContato}`),
  },

  rede: {
    cuidadores: (idPerfil: number) => get<MembroRede[]>(`/perfis/${idPerfil}/cuidadores`),
    minhaRede: () => get<MembroRede[]>('/minha-rede'),
    atualizarPermissoes: (idPerfil: number, idUsuario: number, podeVisualizarPrivado: boolean, podeEditar: boolean) =>
      put<MembroRede>(
        `/perfis/${idPerfil}/cuidadores/${idUsuario}?podeVisualizarPrivado=${podeVisualizarPrivado}&podeEditar=${podeEditar}`
      ),
    remover: (idPerfil: number, idUsuario: number) => del<void>(`/perfis/${idPerfil}/cuidadores/${idUsuario}`),
  },

  convites: {
    doPerfil: (idPerfil: number) => get<ConviteRede[]>(`/perfis/${idPerfil}/convites`),
    criar: (idPerfil: number, emailConvidado: string, podeVisualizarPrivado: boolean, podeEditar: boolean) =>
      post<ConviteRede>(`/perfis/${idPerfil}/convites`, { emailConvidado, podeVisualizarPrivado, podeEditar }),
    cancelar: (idPerfil: number, idConvite: number) => del<void>(`/perfis/${idPerfil}/convites/${idConvite}`),
    meus: () => get<ConviteRede[]>('/meus-convites'),
    aceitar: (idConvite: number) => post<void>(`/convites/${idConvite}/aceitar`),
    recusar: (idConvite: number) => post<void>(`/convites/${idConvite}/recusar`),
  },

  acessibilidade: {
    buscar: () => get<ConfiguracaoAcessibilidade>('/configuracoes/acessibilidade'),
    salvar: (dados: ConfiguracaoAcessibilidade) =>
      put<ConfiguracaoAcessibilidade>('/configuracoes/acessibilidade', dados),
  },
};

// ---------- Conversões entre o formato das telas e o da API ----------

// Formato usado pelas telas de Dados de Saúde
export interface DadosSaude {
  alergias: string[];
  condicoes: string[];
  medicamentos: string[];
  biosseguranca: string[];
  necessidades: string[];
}

export const dadosSaudeVazios: DadosSaude = {
  alergias: [],
  condicoes: [],
  medicamentos: [],
  biosseguranca: [],
  necessidades: [],
};

export function saudeDaApi(d: DadosSaudeApi): DadosSaude {
  return {
    alergias: d.alergia ?? [],
    condicoes: d.condicoesSaude ?? [],
    medicamentos: d.medicamentos ?? [],
    biosseguranca: d.biosseguranca ?? [],
    necessidades: d.necessidadeEspecificas ?? [],
  };
}

export function saudeParaApi(d: DadosSaude): DadosSaudeApi {
  return {
    alergia: d.alergias,
    condicoesSaude: d.condicoes,
    medicamentos: d.medicamentos,
    biosseguranca: d.biosseguranca,
    necessidadeEspecificas: d.necessidades,
  };
}

// "25/12/1950" -> "1950-12-25" (null se inválida)
export function dataBrParaIso(data: string): string | null {
  const m = data.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, dia, mes, ano] = m;
  const d = new Date(`${ano}-${mes}-${dia}T00:00:00`);
  if (isNaN(d.getTime()) || d.getDate() !== Number(dia) || d > new Date()) return null;
  return `${ano}-${mes}-${dia}`;
}

// Coloca as barras enquanto o usuário digita: "25121950" -> "25/12/1950"
export function mascaraData(texto: string): string {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
}

export const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// "o +" -> "O+"; "" -> null; inválido -> undefined
export function normalizarTipoSanguineo(texto: string): string | null | undefined {
  const t = texto.replace(/\s/g, '').toUpperCase();
  if (!t) return null;
  return TIPOS_SANGUINEOS.includes(t) ? t : undefined;
}

// "2026-09-08T14:23:00" -> "08/09/2026 às 14h23"
export function formatarDataHora(iso?: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} às ${p(d.getHours())}h${p(d.getMinutes())}`;
}

export function calcularIdade(isoData?: string | null): number | null {
  if (!isoData) return null;
  const nasc = new Date(`${isoData}T00:00:00`);
  if (isNaN(nasc.getTime())) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

export function rotuloTipoPerfil(tipo: TipoPerfil) {
  return tipo === 'PROPRIO' ? 'Meu perfil' : 'Meu protegido';
}

export function mensagemErro(e: unknown) {
  return e instanceof Error ? e.message : 'Ocorreu um erro inesperado.';
}
