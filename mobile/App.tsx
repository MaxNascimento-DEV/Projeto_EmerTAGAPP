import React, { useCallback, useEffect, useState } from 'react';
import TelaCarregamentoScreen from './src/Telas/TelaCarregamentoScreen';
import LoginScreen from './src/Telas/Login';
import RegisterScreen from './src/Telas/Cadastro';
import HomeScreen, { Perfil } from './src/Telas/Home';
import CriarPerfilScreen from './src/Telas/CriarPerfil';
import DadosSaudePasso1 from './src/Telas/DadosSaude/Passo1';
import DadosSaudePasso2 from './src/Telas/DadosSaude/Passo2';
import DadosSaudePasso3 from './src/Telas/DadosSaude/Passo3';
import DadosSaudePasso4 from './src/Telas/DadosSaude/Passo4';
import RedeScreen from './src/Telas/Rede';
import ConvidarCuidadorScreen from './src/Telas/Rede/ConvidaCuidador';
import GerenciarMembroScreen from './src/Telas/Rede/GerenciarMembro';
import DadosProtegidoPasso1 from './src/Telas/DadosSaude/ProtegidoPasso1';
import ContaScreen from './src/Telas/Conta';
import DadosContaScreen from './src/Telas/Conta/DadosContaScreen';
import SegurancaScreen from './src/Telas/Conta/SegurancaScreen';
import AcessibilidadeScreen from './src/Telas/Conta/AcessibilidadeScreen';
import MeuProtegidoScreen from './src/Telas/MeuProtegido/MeuProtegidoScreen';
import DadosSaudeProtegidoScreen from './src/Telas/MeuProtegido/DadosSaudeProtegidoScreen';
import ContatosEmergenciaProtegidoScreen from './src/Telas/MeuProtegido/ContatosEmergenciaProtegidoScreen';
import AdicionarContatoProtegidoScreen from './src/Telas/MeuProtegido/AdicionarContatoProtegidoScreen';
import QrCodeScreen from './src/Telas/MeuProtegido/QrCode';
import PerfilEmergenciaScreen from './src/Telas/MeuProtegido/PerfilEmergenciaScreen';
import {
  api,
  sessao,
  DadosSaude,
  dadosSaudeVazios,
  saudeDaApi,
  saudeParaApi,
  formatarDataHora,
  rotuloTipoPerfil,
  mensagemErro,
  MembroRede,
  PerfilEmergencia,
  PerfilEmergenciaRequest,
  TipoPerfil,
  Usuario,
} from './src/services/api';
import { avisar } from './src/services/avisos';
import { escolherEEnviarFoto } from './src/services/fotos';

type Tela =
  | 'telaCarregamento'
  | 'login'
  | 'register'
  | 'home'
  | 'criarPerfil'
  | 'dadosPasso1'
  | 'dadosPasso2'
  | 'dadosPasso3'
  | 'dadosPasso4'
  | 'rede'
  | 'convidarCuidador'
  | 'gerenciarMembro'
  | 'dadosProtegidoPasso1'
  | 'conta'
  | 'dadosConta'
  | 'seguranca'
  | 'acessibilidade'
  | 'meuProtegido'
  | 'qrCode'
  | 'dadosSaudeProtegido'
  | 'contatosEmergenciaProtegido'
  | 'adicionarContatoProtegido'
  | 'perfilEmergencia';

// Dados pessoais preenchidos no passo 1, guardados até o "Concluir" do passo 4
type RascunhoPerfil = Omit<PerfilEmergenciaRequest, 'tipoPerfil'>;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Tela>('telaCarregamento');

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [emailLogin, setEmailLogin] = useState('');
  const [perfis, setPerfis] = useState<PerfilEmergencia[]>([]);
  const [idPerfilSelecionado, setIdPerfilSelecionado] = useState<number | null>(null);
  const [idPerfilRede, setIdPerfilRede] = useState<number | null>(null);
  const [membroSelecionado, setMembroSelecionado] = useState<MembroRede | null>(null);

  const [tipoCadastro, setTipoCadastro] = useState<TipoPerfil>('PROPRIO');
  const [rascunho, setRascunho] = useState<RascunhoPerfil | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dadosSaude, setDadosSaude] = useState<DadosSaude>(dadosSaudeVazios);
  const [salvando, setSalvando] = useState(false);

  const perfilSelecionado = perfis.find(p => p.idPerfil === idPerfilSelecionado) ?? null;
  // Perfil escolhido na aba Rede (o primeiro, se nenhum foi escolhido)
  const perfilRede = perfis.find(p => p.idPerfil === idPerfilRede) ?? perfis[0];

  const carregarPerfis = useCallback(async () => {
    try {
      const lista = await api.perfis.meus();
      setPerfis(lista);
      return lista;
    } catch (e) {
      avisar('Erro ao carregar perfis', mensagemErro(e));
      return [];
    }
  }, []);

  const sair = useCallback(() => {
    sessao.definirToken(null);
    setUsuario(null);
    setPerfis([]);
    setIdPerfilSelecionado(null);
    setIdPerfilRede(null);
    setCurrentScreen('login');
  }, []);

  // Token expirado/inválido: o cliente HTTP avisa e voltamos ao login
  useEffect(() => {
    sessao.aoExpirar(() => {
      avisar('Sessão expirada', 'Faça login novamente.');
      sair();
    });
  }, [sair]);

  // Atualiza um perfil na lista local depois de uma resposta da API
  const substituirPerfil = (atualizado: PerfilEmergencia) =>
    setPerfis(lista => lista.map(p => (p.idPerfil === atualizado.idPerfil ? atualizado : p)));

  const abrirPerfil = async (idPerfil: number) => {
    setIdPerfilSelecionado(idPerfil);
    setDadosSaude(dadosSaudeVazios);
    setCurrentScreen('meuProtegido');
    try {
      setDadosSaude(saudeDaApi(await api.saude.buscar(idPerfil)));
    } catch (e) {
      avisar('Erro ao carregar dados de saúde', mensagemErro(e));
    }
  };

  // Edição a partir da tela "Dados de saúde": grava tudo de uma vez na API
  const salvarEdicaoSaude = async (novos: DadosSaude) => {
    if (!perfilSelecionado) return;
    try {
      const resposta = await api.saude.substituir(perfilSelecionado.idPerfil, saudeParaApi(novos));
      setDadosSaude(saudeDaApi(resposta));
      carregarPerfis(); // atualiza "última atualização"
      setIsEditing(false);
      setCurrentScreen('dadosSaudeProtegido');
    } catch (e) {
      avisar('Não foi possível salvar', mensagemErro(e));
    }
  };

  // Passo 4 "Concluir": cria o perfil, depois grava saúde e privacidade
  const concluirCadastro = async (privacidade: {
    alergias: boolean; condicoes: boolean; medicamentos: boolean; biosseguranca: boolean;
    necessidades: boolean; idade: boolean; tipoSanguineo: boolean;
  }) => {
    if (!rascunho) return;
    setSalvando(true);
    let criado: PerfilEmergencia | null = null;
    try {
      criado = await api.perfis.criar({ ...rascunho, tipoPerfil: tipoCadastro });
      await api.saude.substituir(criado.idPerfil, saudeParaApi(dadosSaude));
      await api.privacidade.atualizar(criado.idPerfil, {
        exibirAlergias: privacidade.alergias,
        exibirCondicoes: privacidade.condicoes,
        exibirMedicamentos: privacidade.medicamentos,
        exibirBiosseguranca: privacidade.biosseguranca,
        exibirNecessidades: privacidade.necessidades,
        exibirIdade: privacidade.idade,
        exibirTipoSanguineo: privacidade.tipoSanguineo,
      });
      await carregarPerfis();
      setRascunho(null);
      setCurrentScreen('home');
    } catch (e) {
      if (criado) {
        // O perfil existe, mas algo depois falhou: mostra na Home para o usuário completar
        avisar('Perfil criado com pendências', `${mensagemErro(e)}\nVocê pode completar os dados pelo perfil.`);
        await carregarPerfis();
        setCurrentScreen('home');
      } else {
        avisar('Não foi possível criar o perfil', mensagemErro(e));
      }
    } finally {
      setSalvando(false);
    }
  };

  // Campos atuais do perfil, para o PUT /perfis/{id} (que exige o objeto completo)
  const requestDoPerfil = (p: PerfilEmergencia): PerfilEmergenciaRequest => ({
    nome: p.nome,
    dataNascimento: p.dataNascimento,
    tipoSanguineo: p.tipoSanguineo,
    fotoUrl: p.fotoUrl,
    tipoPerfil: p.tipoPerfil,
    parentesco: p.parentesco,
  });

  if (currentScreen === 'telaCarregamento') {
    return <TelaCarregamentoScreen onFinish={() => setCurrentScreen('login')} />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        key={emailLogin}
        emailInicial={emailLogin}
        onNavigateToRegister={() => setCurrentScreen('register')}
        onLoginSuccess={async (u) => {
          setUsuario(u);
          setCurrentScreen('home');
          await carregarPerfis();
        }}
      />
    );
  }

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onNavigateToLogin={() => setCurrentScreen('login')}
        onRegisterSuccess={(email) => {
          setEmailLogin(email);
          setCurrentScreen('login');
        }}
      />
    );
  }

  if (currentScreen === 'criarPerfil') {
    return (
      <CriarPerfilScreen
        onBack={() => setCurrentScreen('home')}
        onSelectParaMim={() => {
          setTipoCadastro('PROPRIO');
          setIsEditing(false);
          setDadosSaude(dadosSaudeVazios);
          setRascunho(null);
          setCurrentScreen('dadosPasso1');
        }}
        onSelectOutraPessoa={() => {
          setTipoCadastro('PROTEGIDO');
          setIsEditing(false);
          setDadosSaude(dadosSaudeVazios);
          setRascunho(null);
          setCurrentScreen('dadosProtegidoPasso1');
        }}
      />
    );
  }

  if (currentScreen === 'dadosPasso1') {
    return (
      <DadosSaudePasso1
        nomeInicial={usuario?.nome}
        fotoInicial={usuario?.fotoUrl ?? null}
        onBack={() => setCurrentScreen('criarPerfil')}
        onNext={(dados) => {
          setRascunho({ ...dados, parentesco: null });
          setCurrentScreen('dadosPasso2');
        }}
      />
    );
  }

  if (currentScreen === 'dadosProtegidoPasso1') {
    return (
      <DadosProtegidoPasso1
        onBack={() => setCurrentScreen('criarPerfil')}
        onNext={(dados) => {
          setRascunho(dados);
          setCurrentScreen('dadosPasso2');
        }}
      />
    );
  }

  if (currentScreen === 'dadosPasso2') {
    return (
      <DadosSaudePasso2
        isEditing={isEditing}
        initialData={dadosSaude}
        onBack={() => {
          if (isEditing) {
            setIsEditing(false);
            setCurrentScreen('dadosSaudeProtegido');
          } else if (tipoCadastro === 'PROTEGIDO') {
            setCurrentScreen('dadosProtegidoPasso1');
          } else {
            setCurrentScreen('dadosPasso1');
          }
        }}
        onNext={(dados) => {
          const novos = { ...dadosSaude, ...dados };
          if (isEditing) {
            salvarEdicaoSaude(novos);
          } else {
            setDadosSaude(novos);
            setCurrentScreen('dadosPasso3');
          }
        }}
      />
    );
  }

  if (currentScreen === 'dadosPasso3') {
    return (
      <DadosSaudePasso3
        isEditing={isEditing}
        initialData={dadosSaude}
        onBack={() => {
          if (isEditing) {
            setIsEditing(false);
            setCurrentScreen('dadosSaudeProtegido');
          } else {
            setCurrentScreen('dadosPasso2');
          }
        }}
        onNext={(dados) => {
          const novos = { ...dadosSaude, ...dados };
          if (isEditing) {
            salvarEdicaoSaude(novos);
          } else {
            setDadosSaude(novos);
            setCurrentScreen('dadosPasso4');
          }
        }}
      />
    );
  }

  if (currentScreen === 'dadosPasso4') {
    return (
      <DadosSaudePasso4
        salvando={salvando}
        onBack={() => setCurrentScreen('dadosPasso3')}
        onFinish={concluirCadastro}
      />
    );
  }

  if (currentScreen === 'rede') {
    return (
      <RedeScreen
        usuario={usuario}
        perfis={perfis}
        idPerfilSelecionado={perfilRede?.idPerfil ?? null}
        onChangePerfil={setIdPerfilRede}
        onNavigateHome={() => setCurrentScreen('home')}
        onConvidarCuidador={() => setCurrentScreen('convidarCuidador')}
        onSelectMembro={(membro) => {
          setMembroSelecionado(membro);
          setCurrentScreen('gerenciarMembro');
        }}
        onNavigateConta={() => setCurrentScreen('conta')}
      />
    );
  }

  if (currentScreen === 'convidarCuidador' && perfilRede) {
    return (
      <ConvidarCuidadorScreen
        idPerfil={perfilRede.idPerfil}
        nomePerfil={perfilRede.nome}
        onBack={() => setCurrentScreen('rede')}
        onSendInvite={() => setCurrentScreen('rede')}
      />
    );
  }

  if (currentScreen === 'gerenciarMembro' && membroSelecionado) {
    return (
      <GerenciarMembroScreen
        membro={membroSelecionado}
        onBack={() => setCurrentScreen('rede')}
        onSave={() => setCurrentScreen('rede')}
        onRemove={() => setCurrentScreen('rede')}
      />
    );
  }

  if (currentScreen === 'conta') {
    return (
      <ContaScreen
        usuario={usuario}
        onNavigateHome={() => setCurrentScreen('home')}
        onNavigateRede={() => setCurrentScreen('rede')}
        onNavigateDadosConta={() => setCurrentScreen('dadosConta')}
        onNavigateSeguranca={() => setCurrentScreen('seguranca')}
        onNavigateAcessibilidade={() => setCurrentScreen('acessibilidade')}
        onLogout={sair}
        onTrocarFoto={async () => {
          if (!usuario) return;
          const fotoUrl = await escolherEEnviarFoto();
          if (!fotoUrl) return;
          try {
            setUsuario(await api.usuarios.atualizar({ nome: usuario.nome, telefone: usuario.telefone, fotoUrl }));
          } catch (e) {
            avisar('Não foi possível salvar a foto', mensagemErro(e));
          }
        }}
      />
    );
  }

  if (currentScreen === 'dadosConta') {
    return (
      <DadosContaScreen
        usuario={usuario}
        onBack={() => setCurrentScreen('conta')}
        onSave={(atualizado) => {
          setUsuario(atualizado);
          setCurrentScreen('conta');
        }}
      />
    );
  }

  if (currentScreen === 'seguranca') {
    return (
      <SegurancaScreen
        onBack={() => setCurrentScreen('conta')}
        onSave={() => setCurrentScreen('conta')}
      />
    );
  }

  if (currentScreen === 'acessibilidade') {
    return (
      <AcessibilidadeScreen
        onBack={() => setCurrentScreen('conta')}
        onSave={() => setCurrentScreen('conta')}
      />
    );
  }

  // Telas abaixo dependem de um perfil selecionado
  if (perfilSelecionado) {
    const tipo = rotuloTipoPerfil(perfilSelecionado.tipoPerfil);

    if (currentScreen === 'meuProtegido') {
      return (
        <MeuProtegidoScreen
          key={perfilSelecionado.idPerfil}
          nome={perfilSelecionado.nome}
          tipo={tipo}
          fotoUrl={perfilSelecionado.fotoUrl}
          onBack={() => setCurrentScreen('home')}
          onNavigateQRCode={() => {
            carregarPerfis(); // garante a URL pública atual
            setCurrentScreen('qrCode');
          }}
          onNavigateDadosSaude={() => setCurrentScreen('dadosSaudeProtegido')}
          onNavigateContatos={() => setCurrentScreen('contatosEmergenciaProtegido')}
          onNavigatePerfilPublico={() => setCurrentScreen('perfilEmergencia')}
          onTrocarFoto={async () => {
            const fotoUrl = await escolherEEnviarFoto();
            if (!fotoUrl) return;
            try {
              substituirPerfil(await api.perfis.atualizar(perfilSelecionado.idPerfil, { ...requestDoPerfil(perfilSelecionado), fotoUrl }));
            } catch (e) {
              avisar('Não foi possível salvar a foto', mensagemErro(e));
            }
          }}
          onSalvarNome={async (nome) => {
            try {
              substituirPerfil(await api.perfis.atualizar(perfilSelecionado.idPerfil, { ...requestDoPerfil(perfilSelecionado), nome }));
            } catch (e) {
              avisar('Não foi possível alterar o nome', mensagemErro(e));
              throw e;
            }
          }}
        />
      );
    }

    if (currentScreen === 'dadosSaudeProtegido') {
      const editar = (tela: 'dadosPasso2' | 'dadosPasso3') => () => {
        setIsEditing(true);
        setCurrentScreen(tela);
      };
      return (
        <DadosSaudeProtegidoScreen
          dados={dadosSaude}
          nome={perfilSelecionado.nome}
          tipo={tipo}
          fotoUrl={perfilSelecionado.fotoUrl}
          ultimaAtualizacao={formatarDataHora(perfilSelecionado.ultimaAtualizacaoSaude)}
          onBack={() => setCurrentScreen('meuProtegido')}
          onEditAlergias={editar('dadosPasso2')}
          onEditCondicoes={editar('dadosPasso2')}
          onEditMedicamentos={editar('dadosPasso2')}
          onEditBiosseguranca={editar('dadosPasso2')}
          onEditNecessidades={editar('dadosPasso3')}
        />
      );
    }

    if (currentScreen === 'qrCode') {
      return (
        <QrCodeScreen
          urlPublica={perfilSelecionado.urlPublica}
          nome={perfilSelecionado.nome}
          tipo={tipo}
          fotoUrl={perfilSelecionado.fotoUrl}
          onBack={() => setCurrentScreen('meuProtegido')}
          onRegenerateQRCode={async () => {
            try {
              substituirPerfil(await api.perfis.regenerarToken(perfilSelecionado.idPerfil));
            } catch (e) {
              avisar('Não foi possível gerar um novo QR Code', mensagemErro(e));
            }
          }}
        />
      );
    }

    if (currentScreen === 'contatosEmergenciaProtegido') {
      return (
        <ContatosEmergenciaProtegidoScreen
          idPerfil={perfilSelecionado.idPerfil}
          onBack={() => setCurrentScreen('meuProtegido')}
          onAddContato={() => setCurrentScreen('adicionarContatoProtegido')}
        />
      );
    }

    if (currentScreen === 'adicionarContatoProtegido') {
      return (
        <AdicionarContatoProtegidoScreen
          idPerfil={perfilSelecionado.idPerfil}
          onBack={() => setCurrentScreen('contatosEmergenciaProtegido')}
          onSave={() => setCurrentScreen('contatosEmergenciaProtegido')}
        />
      );
    }

    if (currentScreen === 'perfilEmergencia') {
      return (
        <PerfilEmergenciaScreen
          tokenPublico={perfilSelecionado.tokenPublico}
          onBack={() => setCurrentScreen('meuProtegido')}
        />
      );
    }
  }

  const perfisHome: Perfil[] = perfis.map(p => ({
    id: String(p.idPerfil),
    nome: p.nome,
    tipo: rotuloTipoPerfil(p.tipoPerfil),
    fotoUrl: p.fotoUrl,
  }));

  return (
    <HomeScreen
      perfis={perfisHome}
      nomeUsuario={usuario?.nome}
      fotoUsuario={usuario?.fotoUrl}
      onLogout={sair}
      onNavigateToCriarPerfil={() => setCurrentScreen('criarPerfil')}
      onSelectRede={() => setCurrentScreen('rede')}
      onNavigateRede={() => setCurrentScreen('rede')}
      onNavigateConta={() => setCurrentScreen('conta')}
      onNavigateMeuProtegido={() => setCurrentScreen('meuProtegido')}
      onSelectPerfil={(perfil) => abrirPerfil(Number(perfil.id))}
    />
  );
}
