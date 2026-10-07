import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface CriarPerfilScreenProps {
  onBack: () => void;
  onSelectParaMim?: () => void;
  onSelectOutraPessoa?: () => void;
}

export default function CriarPerfilScreen({ 
  onBack, 
  onSelectParaMim, 
  onSelectOutraPessoa 
}: CriarPerfilScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* CABEÇALHO COM BOTÃO VOLTAR */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* TÍTULO E SUBTÍTULO */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Criar Perfil</Text>
          <Text style={styles.subtitle}>Para quem é esse perfil?</Text>
        </View>

        {/* CARD 1: PARA MIM */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.8}
          onPress={onSelectParaMim}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
            <Feather name="user" size={26} color="#2563EB" />
          </View>
          
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitle}>Para mim</Text>
            <Text style={styles.cardSubtitle}>Criar meu perfil de emergência</Text>
          </View>

          <Feather name="arrow-right" size={22} color="#2563EB" />
        </TouchableOpacity>

        {/* CARD 2: PARA OUTRA PESSOA */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.8}
          onPress={onSelectOutraPessoa}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#E6F4F1' }]}>
            <Feather name="users" size={26} color="#00A3A0" />
          </View>

          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitle}>Para outra pessoa</Text>
            <Text style={styles.cardSubtitle}>Cadastrar uma pessoa protegida</Text>
          </View>

          <Feather name="arrow-right" size={22} color="#00A3A0" />
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
  header: {
    backgroundColor: '#2563EB',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
});