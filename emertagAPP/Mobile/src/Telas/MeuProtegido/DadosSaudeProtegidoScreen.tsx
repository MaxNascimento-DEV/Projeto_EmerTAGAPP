import React from 'react';
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

interface DadosSaudeProtegidoScreenProps {
  onBack: () => void;
  onEditAlergias?: () => void;
  onEditCondicoes?: () => void;
  onEditMedicamentos?: () => void;
  onEditBiosseguranca?: () => void;
  onEditNecessidades?: () => void;
  dados?: {
    alergias: string[];
    condicoes: string[];
    medicamentos: string[];
    biosseguranca: string[];
    necessidades: string[];
  };
  nome?: string;
  tipo?: string;
  fotoUrl?: string | null;
  ultimaAtualizacao?: string | null; // já formatada, ex.: "08/09/2026 às 14h23"
}

export default function DadosSaudeProtegidoScreen({ 
  onBack,
  onEditAlergias,
  onEditCondicoes,
  onEditMedicamentos,
  onEditBiosseguranca,
  onEditNecessidades,
  dados,
  nome = '',
  tipo = '',
  fotoUrl,
  ultimaAtualizacao
}: DadosSaudeProtegidoScreenProps) {
  const alergias = dados?.alergias ?? [];
  const condicoes = dados?.condicoes ?? [];
  const medicamentos = dados?.medicamentos ?? [];
  const biosseguranca = dados?.biosseguranca ?? [];
  const necessidades = dados?.necessidades ?? [];

  const renderLista = (lista: string[]) =>
    lista.length === 0 ? (
      <Text style={styles.cardSubtitle}>Sem registros</Text>
    ) : (
      lista.map((item, i) => (
        <Text key={i} style={styles.cardSubtitle}>{item}</Text>
      ))  
    );
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onBack?.()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados de saúde</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* PERFIL DO PROTEGIDO */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar fotoUrl={fotoUrl} style={styles.avatarImage} />
          </View>
          <Text style={styles.userName}>{nome}</Text>
          <Text style={styles.userRole}>{tipo}</Text>
          <Text style={styles.updateText}>
            {ultimaAtualizacao ? `Última atualização: ${ultimaAtualizacao}` : 'Ainda sem atualizações'}
          </Text>
        </View>

        {/* SEÇÃO INFORMAÇÕES CADASTRADAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações cadastradas</Text>

          {/* CARD ALERGIAS */}
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Feather name="alert-circle" size={22} color="#00A3A0" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Alergias</Text>
              <Text style={styles.cardSubtitle}>{renderLista(alergias)}</Text>
            </View>
            <TouchableOpacity onPress={() => onEditAlergias?.()} style={styles.editButton} activeOpacity={0.7}>
              <Feather name="edit-2" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* CARD CONDIÇÕES DE SAÚDE */}
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Feather name="heart" size={22} color="#00A3A0" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Doenças crônicas</Text>
              {renderLista(condicoes)}
            </View>
            <TouchableOpacity onPress={() => onEditCondicoes?.()} style={styles.editButton} activeOpacity={0.7}>
              <Feather name="edit-2" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* CARD MEDICAMENTOS */}
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Feather name="disc" size={22} color="#00A3A0" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Medicamentos</Text>
              <Text style={styles.cardSubtitle}>{renderLista(medicamentos)}</Text>
            </View>
            <TouchableOpacity onPress={() => onEditMedicamentos?.()} style={styles.editButton} activeOpacity={0.7}>
              <Feather name="edit-2" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* CARD BIOSSEGURANÇA */}
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Feather name="shield" size={22} color="#00A3A0" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Biossegurança</Text>
              {renderLista(biosseguranca)}
            </View>
            <TouchableOpacity onPress={() => onEditBiosseguranca?.()} style={styles.editButton} activeOpacity={0.7}>
              <Feather name="edit-2" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* CARD NECESSIDADES ESPECÍFICAS */}
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
              <Feather name="user-check" size={22} color="#00A3A0" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Necessidades específicas</Text>
              <Text style={styles.cardSubtitle}>{renderLista(necessidades)}</Text>
            </View>
            <TouchableOpacity onPress={() => onEditNecessidades?.()} style={styles.editButton} activeOpacity={0.7}>
              <Feather name="edit-2" size={18} color="#2563EB" />
            </TouchableOpacity>
          </View>

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
    paddingTop: 24,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    marginBottom: 10,
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
  userRole: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 12,
  },
  updateText: {
    fontSize: 12,
    color: '#94A3B8',
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
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    fontSize: 14,
    color: '#64748B',
  },
  editButton: {
    padding: 6,
  },
});