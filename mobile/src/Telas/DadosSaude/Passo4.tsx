import React, { useState } from 'react';
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

interface Passo4Props {
  onBack: () => void;
  onFinish: (privacyConfig: {
    alergias: boolean;
    condicoes: boolean;
    medicamentos: boolean;
    biosseguranca: boolean;
    necessidades: boolean;
    idade: boolean;
    tipoSanguineo: boolean;
  }) => void;
  salvando?: boolean;
}

export default function DadosSaudePasso4({ onBack, onFinish, salvando = false }: Passo4Props) {
  // Estados para cada opção de privacidade
  const [alergias, setAlergias] = useState(true);
  const [condicoes, setCondicoes] = useState(true);
  const [medicamentos, setMedicamentos] = useState(true);
  const [biosseguranca, setBiosseguranca] = useState(true);
  const [necessidades, setNecessidades] = useState(true);
  const [idade, setIdade] = useState(false);
  const [tipoSanguineo, setTipoSanguineo] = useState(true);

  const handleFinish = () => {
    onFinish({
      alergias,
      condicoes,
      medicamentos,
      biosseguranca,
      necessidades,
      idade,
      tipoSanguineo,
    });
  };

  const renderCheckbox = (
    label: string, 
    value: boolean, 
    onToggle: () => void
  ) => (
    <TouchableOpacity 
      style={styles.checkboxRow} 
      activeOpacity={0.7} 
      onPress={onToggle}
    >
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Feather name="check" size={14} color="#FFFFFF" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados de Saúde</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TÍTULO E PASSO */}
        <View style={styles.stepTitleContainer}>
          <Text style={styles.title}>Privacidade do Perfil</Text>
          <Text style={styles.stepText}>Passo 4 de 4</Text>
        </View>

        {/* BARRA DE PROGRESSO (100%) */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '100%' }]} />
        </View>

        {/* CÍRCULOS DE PROGRESSO */}
        <View style={styles.stepsCircleRow}>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Feather name="check" size={18} color="#FFFFFF" />
          </View>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Feather name="check" size={18} color="#FFFFFF" />
          </View>
          <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
            <Feather name="check" size={18} color="#FFFFFF" />
          </View>
          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <Text style={styles.stepCircleTextActive}>4</Text>
          </View>
        </View>

        {/* INSTRUÇÃO */}
        <Text style={styles.instructionText}>
          Escolha quais informações poderão ser visualizadas por qualquer pessoa que escanear o QR Code:
        </Text>

        {/* SEÇÃO 1: INFORMAÇÕES MÉDICAS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Informações médicas</Text>
          {renderCheckbox('Alergias', alergias, () => setAlergias(!alergias))}
          {renderCheckbox('Doenças crônicas', condicoes, () => setCondicoes(!condicoes))}
          {renderCheckbox('Medicamentos', medicamentos, () => setMedicamentos(!medicamentos))}
          {renderCheckbox('Biossegurança', biosseguranca, () => setBiosseguranca(!biosseguranca))}
          {renderCheckbox('Necessidades específicas', necessidades, () => setNecessidades(!necessidades))}
        </View>

        {/* SEÇÃO 2: INFORMAÇÕES ADICIONAIS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Informações adicionais</Text>
          {renderCheckbox('Idade', idade, () => setIdade(!idade))}
          {renderCheckbox('Tipo sanguíneo', tipoSanguineo, () => setTipoSanguineo(!tipoSanguineo))}
        </View>

        <Text style={styles.noteText}>
          Você poderá alterar essas configurações depois.
        </Text>

        {/* BOTÃO CONCLUIR */}
        <TouchableOpacity 
          style={styles.buttonPrimary} 
          activeOpacity={0.8}
          onPress={handleFinish}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buttonPrimaryText}>Concluir</Text>
              <Feather name="check" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        {/* BOTÃO VOLTAR */}
        <TouchableOpacity 
          style={styles.buttonSecondary} 
          activeOpacity={0.8}
          onPress={onBack}
        >
          <Feather name="arrow-left" size={20} color="#2563EB" style={{ marginRight: 8 }} />
          <Text style={styles.buttonSecondaryText}>Voltar</Text>
        </TouchableOpacity>

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
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  stepTitleContainer: {
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: '#64748B',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E2E8F0',
    marginHorizontal: -24,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
  },
  stepsCircleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#2563EB',
  },
  stepCircleCompleted: {
    backgroundColor: '#0D9488',
  },
  stepCircleTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  instructionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#334155',
  },
  noteText: {
    fontSize: 13,
    color: '#64748B',
    marginVertical: 12,
  },
  buttonPrimary: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonSecondaryText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});