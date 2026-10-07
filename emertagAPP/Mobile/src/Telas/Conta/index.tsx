import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Avatar from '../Components/Avatar';
import { Usuario } from '../../services/api';

interface ContaProps {
  usuario: Usuario | null;
  onNavigateHome: () => void;
  onNavigateRede: () => void;
  onNavigateDadosConta?: () => void;
  onNavigateSeguranca?: () => void;
  onNavigateAcessibilidade?: () => void;
  onLogout?: () => void;
  // Abre a galeria, envia e grava a nova foto da conta
  onTrocarFoto?: () => Promise<void>;
}

export default function ContaScreen({
  usuario,
  onNavigateHome,
  onNavigateRede,
  onNavigateDadosConta,
  onNavigateSeguranca,
  onNavigateAcessibilidade,
  onLogout,
  onTrocarFoto
}: ContaProps) {
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const trocarFoto = async () => {
    if (!onTrocarFoto) return;
    setEnviandoFoto(true);
    try {
      await onTrocarFoto();
    } finally {
      setEnviandoFoto(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <View style={styles.headerBar} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* FOTO E DADOS DE PERFIL */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar
              fotoUrl={usuario?.fotoUrl}
              style={styles.avatarImage}
              onPress={onTrocarFoto ? trocarFoto : undefined}
              enviando={enviandoFoto}
            />
          </View>
          <Text style={styles.userName}>{usuario?.nome ?? ''}</Text>
          <Text style={styles.userEmail}>{usuario?.email ?? ''}</Text>
        </View>

        {/* SEÇÃO CONTA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={onNavigateDadosConta}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="user" size={22} color="#2563EB" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Dados da conta</Text>
              <Text style={styles.cardSubtitle}>Nome e e-mail</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={onNavigateSeguranca}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="key" size={22} color="#2563EB" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Segurança</Text>
              <Text style={styles.cardSubtitle}>Alterar senha</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* SEÇÃO CONFIGURAÇÕES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={onNavigateAcessibilidade}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="eye" size={22} color="#2563EB" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Acessibilidade</Text>
              <Text style={styles.cardSubtitle}>Texto e alto contraste</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          activeOpacity={0.8}
          onPress={onLogout}
        >
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
          <Feather name="log-out" size={20} color="#DC2626" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

      </ScrollView>

      {/* MENU INFERIOR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={onNavigateHome} activeOpacity={0.7}>
          <Feather name="home" size={22} color="#64748B" />
          <Text style={styles.tabLabel}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={onNavigateRede} activeOpacity={0.7}>
          <Feather name="share-2" size={22} color="#64748B" />
          <Text style={styles.tabLabel}>Rede</Text>
        </TouchableOpacity>

        <View style={styles.tabItem}>
          <View style={styles.activeTabCircle}>
            <Feather name="user" size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.tabLabelActive}>Conta</Text>
        </View>
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
    paddingTop: 16,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    marginBottom: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  section: {
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
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
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