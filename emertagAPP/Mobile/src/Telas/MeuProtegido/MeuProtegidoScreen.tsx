import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Avatar from '../Components/Avatar';

interface MeuProtegidoScreenProps {
  onBack: () => void;
  onNavigateDadosSaude?: () => void;
  onNavigateContatos?: () => void;
  onNavigateQRCode?: () => void;
  onNavigatePerfilPublico?: () => void;
  // Salva o novo nome na API; deve lançar erro se falhar
  onSalvarNome?: (nome: string) => Promise<void>;
  // Abre a galeria, envia e grava a nova foto no perfil
  onTrocarFoto?: () => Promise<void>;
  nome?: string;
  tipo?: string;
  fotoUrl?: string | null;
}

export default function MeuProtegidoScreen({
  onBack,
  onNavigateDadosSaude,
  onNavigateContatos,
  onNavigateQRCode,
  onNavigatePerfilPublico,
  onSalvarNome,
  onTrocarFoto,
  nome = '',
  tipo = '',
  fotoUrl
}: MeuProtegidoScreenProps) {
  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNome, setNovoNome] = useState(nome);
  const [salvandoNome, setSalvandoNome] = useState(false);
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

  const salvarNome = async () => {
    if (!onSalvarNome || novoNome.trim().length < 3) return;
    setSalvandoNome(true);
    try {
      await onSalvarNome(novoNome.trim());
      setEditandoNome(false);
    } catch {
      // o aviso de erro já é mostrado por quem salvou
    } finally {
      setSalvandoNome(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => onBack?.()} 
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil de Emergência</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PERFIL DO PROTEGIDO */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar
              fotoUrl={fotoUrl}
              style={styles.avatarImage}
              onPress={onTrocarFoto ? trocarFoto : undefined}
              enviando={enviandoFoto}
            />
          </View>
          {editandoNome ? (
            <View style={styles.nameRow}>
              <TextInput
                style={styles.nameInput}
                value={novoNome}
                onChangeText={setNovoNome}
                autoFocus
                onSubmitEditing={salvarNome}
              />
              <TouchableOpacity onPress={salvarNome} style={styles.editButton} activeOpacity={0.7} disabled={salvandoNome}>
                {salvandoNome
                  ? <ActivityIndicator size="small" color="#2563EB" />
                  : <Feather name="check" size={18} color="#2563EB" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setEditandoNome(false); setNovoNome(nome); }} style={styles.editButton} activeOpacity={0.7}>
                <Feather name="x" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{nome}</Text>
              {onSalvarNome && (
                <TouchableOpacity
                  onPress={() => { setNovoNome(nome); setEditandoNome(true); }}
                  style={styles.editButton}
                  activeOpacity={0.7}
                >
                  <Feather name="edit-2" size={18} color="#2563EB" />
                </TouchableOpacity>
              )}
            </View>
          )}
          <Text style={styles.userRole}>{tipo}</Text>
        </View>

        {/* SEÇÃO INFORMAÇÕES DE EMERGÊNCIA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Emergência</Text>

          {/* DADOS DE SAÚDE */}
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => onNavigateDadosSaude?.()}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Feather name="disc" size={22} color="#00A3A0" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Dados de Saúde</Text>
              <Text style={styles.cardSubtitle}>Alergias, condições e medicamentos</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#00A3A0" />
          </TouchableOpacity>

          {/* CONTATOS DE EMERGÊNCIA */}
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => onNavigateContatos?.()}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Feather name="phone-call" size={22} color="#00A3A0" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Contatos de emergência</Text>
              <Text style={styles.cardSubtitle}>Ver contatos</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#00A3A0" />
          </TouchableOpacity>

          {/* QR CODE DE EMERGÊNCIA */}
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.7}
            onPress={() => onNavigateQRCode?.()}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Feather name="grid" size={22} color="#00A3A0" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>QR Code de emergência</Text>
              <Text style={styles.cardSubtitle}>Visualizar e baixar</Text>
            </View>
            <Feather name="arrow-right" size={20} color="#00A3A0" />
          </TouchableOpacity>

          {/* PRÉ-VISUALIZAÇÃO DO QUE APARECE AO LER O QR CODE */}
          {onNavigatePerfilPublico && (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={onNavigatePerfilPublico}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
                <Feather name="eye" size={22} color="#00A3A0" />
              </View>
              <View style={styles.cardTextWrapper}>
                <Text style={styles.cardTitle}>Perfil público</Text>
                <Text style={styles.cardSubtitle}>Como o socorrista vê ao ler o QR Code</Text>
              </View>
              <Feather name="arrow-right" size={20} color="#00A3A0" />
            </TouchableOpacity>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 8,
  },
  nameInput: {
    minWidth: 180,
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#2563EB',
    paddingVertical: 4,
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  userRole: {
    fontSize: 15,
    color: '#64748B',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
});