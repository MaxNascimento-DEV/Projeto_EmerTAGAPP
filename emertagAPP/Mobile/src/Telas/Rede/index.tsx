import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { api, ConviteRede, MembroRede, mensagemErro, PerfilEmergencia, Usuario } from '../../services/api';
import { avisar, confirmar } from '../../services/avisos';

interface RedeScreenProps {
  usuario: Usuario | null;
  perfis: PerfilEmergencia[];
  idPerfilSelecionado: number | null;
  onChangePerfil: (idPerfil: number) => void;
  onNavigateHome: () => void;
  onConvidarCuidador?: () => void;
  onSelectMembro?: (membro: MembroRede) => void;
  onNavigateConta?: () => void;
}

export default function RedeScreen({
  usuario,
  perfis,
  idPerfilSelecionado,
  onChangePerfil,
  onNavigateHome,
  onConvidarCuidador,
  onSelectMembro,
  onNavigateConta
}: RedeScreenProps) {
  const perfilSelecionado = perfis.find(p => p.idPerfil === idPerfilSelecionado) ?? null;
  const idPerfil = perfilSelecionado?.idPerfil ?? null;
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [membros, setMembros] = useState<MembroRede[]>([]);
  const [convitesPendentes, setConvitesPendentes] = useState<ConviteRede[]>([]);
  const [convitesRecebidos, setConvitesRecebidos] = useState<ConviteRede[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregarPerfil = useCallback(async () => {
    if (idPerfil === null) return;
    setCarregando(true);
    try {
      const [cuidadores, convites] = await Promise.all([
        api.rede.cuidadores(idPerfil),
        api.convites.doPerfil(idPerfil),
      ]);
      setMembros(cuidadores);
      setConvitesPendentes(convites);
    } catch (e) {
      avisar('Erro ao carregar a rede', mensagemErro(e));
    } finally {
      setCarregando(false);
    }
  }, [idPerfil]);

  useEffect(() => { carregarPerfil(); }, [carregarPerfil]);

  useEffect(() => {
    api.convites.meus().then(setConvitesRecebidos).catch(() => {});
  }, []);

  const cancelarConvite = async (convite: ConviteRede) => {
    if (idPerfil === null) return;
    const ok = await confirmar('Cancelar convite', `Cancelar o convite enviado para ${convite.emailConvidado}?`, 'Cancelar convite');
    if (!ok) return;
    try {
      await api.convites.cancelar(idPerfil, convite.idConvite);
      setConvitesPendentes(lista => lista.filter(c => c.idConvite !== convite.idConvite));
    } catch (e) {
      avisar('Não foi possível cancelar', mensagemErro(e));
    }
  };

  const responderConvite = async (convite: ConviteRede, aceitar: boolean) => {
    try {
      if (aceitar) {
        await api.convites.aceitar(convite.idConvite);
        avisar('Convite aceito!', `Agora você faz parte da rede de cuidado de ${convite.nomePerfil}.`);
      } else {
        await api.convites.recusar(convite.idConvite);
      }
      setConvitesRecebidos(lista => lista.filter(c => c.idConvite !== convite.idConvite));
    } catch (e) {
      avisar('Não foi possível responder o convite', mensagemErro(e));
    }
  };

  const descricaoPermissao = (membro: MembroRede) => {
    if (membro.podeEditar) return 'Pode editar ';
    if (membro.podeVisualizarPrivado) return 'Vê dados privados ';
    return 'Somente leitura ';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* CABEÇALHO AZUL */}
      <View style={styles.headerBar} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* TÍTULO E SUBTÍTULO */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Sua Rede de Cuidado</Text>
          <Text style={styles.subtitle}>
            Gerencie quem pode acessar e atualizar as informações dos seus perfis.
          </Text>
        </View>

        {/* CONVITES RECEBIDOS (outras pessoas me convidando) */}
        {convitesRecebidos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Convites recebidos</Text>
            {convitesRecebidos.map((convite) => (
              <View key={convite.idConvite} style={styles.inviteCard}>
                <View style={styles.avatarBlueLight}>
                  <Feather name="mail" size={22} color="#2563EB" />
                </View>
                <View style={styles.inviteInfo}>
                  <Text style={styles.inviteEmail}>{convite.nomePerfil}</Text>
                  <Text style={styles.inviteStatus}>Convidou você para a rede de cuidado</Text>
                </View>
                <TouchableOpacity style={styles.moreButton} onPress={() => responderConvite(convite, true)} activeOpacity={0.6}>
                  <Feather name="check" size={22} color="#00A3A0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton} onPress={() => responderConvite(convite, false)} activeOpacity={0.6}>
                  <Feather name="x" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {perfis.length === 0 ? (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Crie um perfil de emergência para montar sua rede de cuidado.</Text>
          </View>
        ) : (
        <>
        {/* PERFIL DE EMERGÊNCIA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil de emergência</Text>
          <TouchableOpacity
            style={styles.selectorCard}
            activeOpacity={0.8}
            onPress={() => perfis.length > 1 && setSeletorAberto(!seletorAberto)}
          >
            <View style={styles.selectorLeft}>
              <View style={styles.avatarTeal}>
                <Feather name="user" size={24} color="#00A3A0" />
              </View>
              <Text style={styles.selectorName}>{perfilSelecionado?.nome ?? 'Selecione...'}</Text>
            </View>
            {perfis.length > 1 && (
              <Feather name={seletorAberto ? 'chevron-up' : 'chevron-down'} size={20} color="#64748B" />
            )}
          </TouchableOpacity>

          {seletorAberto && perfis
            .filter(p => p.idPerfil !== idPerfil)
            .map((p) => (
              <TouchableOpacity
                key={p.idPerfil}
                style={[styles.selectorCard, { marginTop: 8 }]}
                activeOpacity={0.8}
                onPress={() => { onChangePerfil(p.idPerfil); setSeletorAberto(false); }}
              >
                <View style={styles.selectorLeft}>
                  <View style={styles.avatarTeal}>
                    <Feather name="user" size={24} color="#00A3A0" />
                  </View>
                  <Text style={styles.selectorName}>{p.nome}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* MEMBROS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membros</Text>

          {/* O próprio usuário é o administrador dos perfis listados aqui */}
          <View style={styles.memberCard}>
            <View style={styles.avatarBlue}>
              <Feather name="user" size={24} color="#2563EB" />
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{usuario?.nome ?? 'Você'}</Text>
              <Text style={styles.memberRole}>Administrador</Text>
              <View style={styles.statusRow}>
                <Text style={styles.memberStatus}>Pode editar </Text>
                <Feather name="edit-2" size={12} color="#64748B" />
              </View>
            </View>
          </View>

          {carregando && <ActivityIndicator color="#2563EB" style={{ marginTop: 8 }} />}

          {membros.map((membro) => (
            <TouchableOpacity
              key={membro.idRede}
              style={styles.memberCard}
              activeOpacity={0.7}
              onPress={() => onSelectMembro?.(membro)}
            >
              <View style={styles.avatarBlue}>
                <Feather name="user" size={24} color="#2563EB" />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{membro.nomeUsuario}</Text>
                <Text style={styles.memberRole}>Cuidador</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.memberStatus}>{descricaoPermissao(membro)}</Text>
                  <Feather name={membro.podeEditar ? 'edit-2' : 'eye'} size={12} color="#64748B" />
                </View>
              </View>
              <View style={styles.moreButton}>
                <Feather name="more-vertical" size={20} color="#64748B" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CONVITES PENDENTES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Convites pendentes</Text>

          {!carregando && convitesPendentes.length === 0 && (
            <Text style={styles.subtitle}>Nenhum convite pendente.</Text>
          )}

          {convitesPendentes.map((convite) => (
            <View key={convite.idConvite} style={styles.inviteCard}>
              <View style={styles.avatarBlueLight}>
                <Feather name="mail" size={22} color="#2563EB" />
              </View>
              <View style={styles.inviteInfo}>
                <Text style={styles.inviteEmail}>{convite.emailConvidado}</Text>
                <Text style={styles.inviteStatus}>Aguardando aceite</Text>
              </View>
              <TouchableOpacity style={styles.moreButton} onPress={() => cancelarConvite(convite)} activeOpacity={0.6}>
                <Feather name="x" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* BOTÃO + CONVIDAR CUIDADOR */}
        <TouchableOpacity
          style={styles.convidarButtonTextOnly}
          activeOpacity={0.7}
          onPress={onConvidarCuidador}
        >
          <Text style={styles.convidarTextOnly}>+ Convidar cuidador</Text>
        </TouchableOpacity>
        </>
        )}

      </ScrollView>

      {/* MENU INFERIOR (BOTTOM TAB BAR) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={onNavigateHome} activeOpacity={0.7}>
          <Feather name="home" size={22} color="#64748B" />
          <Text style={styles.tabLabel}>Início</Text>
        </TouchableOpacity>

        {/* ABA REDE ATIVA */}
        <View style={styles.tabItem}>
          <View style={styles.activeTabCircle}>
            <Feather name="share-2" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.tabLabelActive}>Rede</Text>
        </View>

        <TouchableOpacity style={styles.tabItem} onPress={onNavigateConta} activeOpacity={0.7}>
          <Feather name="user" size={22} color="#64748B" />
          <Text style={styles.tabLabel}>Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    backgroundColor: '#2563EB',
    height: 60,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarTeal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F4F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  avatarBlue: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  memberRole: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  memberStatus: {
    fontSize: 13,
    color: '#64748B',
  },
  moreButton: {
    padding: 4,
  },
  inviteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  avatarBlueLight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteEmail: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  inviteStatus: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  convidarButtonTextOnly: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  convidarTextOnly: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomBar: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTabCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tabLabelActive: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 2,
  },
});