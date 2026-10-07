import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Avatar from '../Components/Avatar';
import { urlFoto } from '../../services/api';

// Tipo simples para representar um perfil cadastrado
export interface Perfil {
  id: string;
  nome: string;
  tipo: string;
  fotoUrl?: string | null;
}

interface HomeScreenProps {
  onLogout: () => void;
  onNavigateToCriarPerfil?: () => void;
  onSelectPerfil?: (perfil: Perfil) => void;
  onSelectRede?: () => void;
  onNavigateRede?: () => void;
  onNavigateConta?: () => void;
  onNavigateMeuProtegido?: () => void;
  perfis?: Perfil[];
  nomeUsuario?: string;
  fotoUsuario?: string | null;
}

export default function HomeScreen({ 
  onLogout, 
  onNavigateToCriarPerfil,
  onSelectPerfil,
  onSelectRede,
  onNavigateRede,
  onNavigateConta,
  onNavigateMeuProtegido,
  perfis = [],
  nomeUsuario = '',
  fotoUsuario
}: HomeScreenProps) {
  
  const temPerfis = perfis.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* CABEÇALHO AZUL */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
            <Feather name="log-out" size={22} color="#FFFFFF" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* FOTO DE PERFIL (AVATAR SOBREPOSTO) */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarCircle, { overflow: 'hidden' }]}>
            <Avatar fotoUrl={fotoUsuario} style={{ width: '100%', height: '100%' }} tamanhoIcone={60} corIcone="#94A3B8" />
          </View>
        </View>

        {/* MENSAGEM DE BOAS-VINDAS */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greetingTitle}>Olá{nomeUsuario ? `, ${nomeUsuario.split(' ')[0]}` : ''}!</Text>
          <Text style={styles.greetingSubtitle}>
            {temPerfis 
              ? "Gerencie seus perfis de emergência." 
              : "Comece configurando seu perfil de emergência."}
          </Text>
        </View>

        {/* SEÇÃO 1: PERFIS DE EMERGÊNCIA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfis de emergência</Text>
          
          {!temPerfis ? (
            /* VISUAL 1: QUANDO NÃO HÁ PERFIS CADASTRADOS */
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircleLight}>
                  <Feather name="user" size={24} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Nenhum perfil cadastrado</Text>
              </View>

              <Text style={styles.cardDescription}>
                Crie um perfil para disponibilizar informações importantes em emergências.
              </Text>

              <TouchableOpacity 
                style={styles.actionButton} 
                activeOpacity={0.7}
                onPress={onNavigateToCriarPerfil}
              >
                <Text style={styles.actionButtonText}>+ Criar um perfil</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* VISUAL 2: QUANDO HÁ PERFIS CADASTRADOS (HOME PREENCHIDA) */
            <View>
              {perfis.map((perfil) => (
                <TouchableOpacity 
                  key={perfil.id}
                  style={[styles.card, { marginBottom: 12 }]} 
                  activeOpacity={0.8}
                  onPress={() => {
                    if (perfil.tipo === 'Meu protegido') {
                      onNavigateMeuProtegido && onSelectPerfil?.(perfil);
                    } else {
                      onSelectPerfil && onSelectPerfil(perfil);
                    }
                  }}
                >
                  <View style={styles.cardContentRow}>
                    <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1', overflow: 'hidden' }]}>
                      {perfil.fotoUrl ? (
                        <Image source={{ uri: urlFoto(perfil.fotoUrl) ?? undefined }} style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <Feather name="users" size={24} color="#00A3A0" />
                      )}
                    </View>

                    <View style={styles.cardTextWrapper}>
                      <Text style={styles.cardTitle}>{perfil.nome}</Text>
                      <Text style={styles.cardSubtitle}>{perfil.tipo}</Text>
                    </View>

                    <Feather name="arrow-right" size={22} color="#00A3A0" />
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity 
                style={styles.criarPerfilButtonOutside} 
                activeOpacity={0.7}
                onPress={onNavigateToCriarPerfil}
              >
                <Text style={styles.criarPerfilTextOutside}>+ Criar um perfil</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SEÇÃO 2: REDE DE CUIDADO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rede de cuidado</Text>

          {!temPerfis ? (
            /* REDE DE CUIDADO VAZIA */
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircleLight}>
                  <Feather name="share-2" size={22} color="#2563EB" />
                </View>
                <View style={styles.cardHeaderTextWrapper}>
                  <Text style={styles.cardTitle}>Sua rede está vazia</Text>
                  <Text style={styles.cardDescriptionCompact}>
                    Crie um perfil de emergência para começar.
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            /* REDE DE CUIDADO CADASTRADA */
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.8}
              onPress={onSelectRede}
            >
              <View style={styles.cardContentRow}>
                <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <Feather name="share-2" size={24} color="#2563EB" />
                </View>

                <View style={styles.cardTextWrapper}>
                  <Text style={styles.cardTitle}>Minha rede de cuidado</Text>
                  <Text style={styles.cardSubtitle}>Nenhum membro conectado</Text>
                </View>

                <Feather name="arrow-right" size={22} color="#00A3A0" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* MENU INFERIOR (BOTTOM TAB BAR) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7}>
          <View style={styles.activeTabPill}>
            <Feather name="home" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.activeTabText}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} activeOpacity={0.7} onPress={onNavigateRede}>
          <Feather name="share-2" size={20} color="#94A3B8" />
          <Text style={styles.tabText}>Rede</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={onNavigateConta} activeOpacity={0.7}>
          <Feather name="user" size={20} color="#94A3B8" />
          <Text style={styles.tabText}>Conta</Text>
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
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#2563EB',
    height: 100,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  logoutButton: {
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  avatarContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginTop: -50,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2E8F0',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircleLight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardHeaderTextWrapper: {
    flex: 1,
  },
  cardDescriptionCompact: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionButtonText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  criarPerfilButtonOutside: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  criarPerfilTextOutside: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabPill: {
    backgroundColor: '#2563EB',
    width: 48,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
});