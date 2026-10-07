import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { dataBrParaIso, mascaraData, normalizarTipoSanguineo } from '../../services/api';
import { avisar } from '../../services/avisos';
import { escolherEEnviarFoto } from '../../services/fotos';
import Avatar from '../Components/Avatar';

interface Passo1Props {
  onBack: () => void;
  // dataNascimento já sai no formato da API (yyyy-MM-dd)
  onNext: (data: { nome: string; dataNascimento: string; tipoSanguineo: string | null; fotoUrl: string | null }) => void;
  nomeInicial?: string;
  fotoInicial?: string | null;
}

export default function DadosSaudePasso1({ onBack, onNext, nomeInicial = '', fotoInicial = null }: Passo1Props) {
  const [nome, setNome] = useState(nomeInicial);
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(fotoInicial);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const escolherFoto = async () => {
    setEnviandoFoto(true);
    const url = await escolherEEnviarFoto();
    if (url) setFotoUrl(url);
    setEnviandoFoto(false);
  };

  const handleContinue = () => {
    if (nome.trim().length < 3) return avisar('Informe nome e sobrenome.');
    const dataIso = dataBrParaIso(dataNascimento);
    if (!dataIso) return avisar('Data de nascimento inválida', 'Use o formato dd/mm/aaaa.');
    const tipo = normalizarTipoSanguineo(tipoSanguineo);
    if (tipo === undefined) return avisar('Tipo sanguíneo inválido', 'Use A+, A-, B+, B-, AB+, AB-, O+ ou O-.');

    onNext({ nome: nome.trim(), dataNascimento: dataIso, tipoSanguineo: tipo, fotoUrl });
  };

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

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TÍTULO E PASSO */}
          <View style={styles.stepTitleContainer}>
            <Text style={styles.title}>Dados pessoais</Text>
            <Text style={styles.stepText}>Passo 1 de 4</Text>
          </View>

          {/* BARRA DE PROGRESSO */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '25%' }]} />
          </View>

          {/* CÍRCULOS DE PROGRESSO */}
          <View style={styles.stepsCircleRow}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepCircleTextActive}>1</Text>
            </View>
            <View style={styles.stepCircle}>
              <Text style={styles.stepCircleText}>2</Text>
            </View>
            <View style={styles.stepCircle}>
              <Text style={styles.stepCircleText}>3</Text>
            </View>
            <View style={styles.stepCircle}>
              <Text style={styles.stepCircleText}>4</Text>
            </View>
          </View>

          {/* AVATAR COM ÍCONE DE CÂMERA */}
          <View style={styles.avatarWrapper}>
            <TouchableOpacity style={[styles.avatarCircle, { overflow: 'hidden' }]} activeOpacity={0.8} onPress={escolherFoto} disabled={enviandoFoto}>
              <Avatar fotoUrl={fotoUrl} style={{ width: '100%', height: '100%' }} tamanhoIcone={64} corIcone="#94A3B8" enviando={enviandoFoto} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8} onPress={escolherFoto} disabled={enviandoFoto}>
              <Feather name="camera" size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>

          {/* INPUT: NOME E SOBRENOME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome e sobrenome <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fernanda Oliveira"
              placeholderTextColor="#94A3B8"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* INPUT: DATA DE NASCIMENTO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Data de nascimento <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={dataNascimento}
                onChangeText={(t) => setDataNascimento(mascaraData(t))}
                maxLength={10}
              />
              <Feather name="calendar" size={20} color="#2563EB" />
            </View>
          </View>

          {/* INPUT: TIPO SANGUÍNEO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo sanguíneo (opcional)</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Ex: O+"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={3}
                value={tipoSanguineo}
                onChangeText={setTipoSanguineo}
              />
              <Feather name="chevron-down" size={20} color="#94A3B8" />
            </View>
          </View>

          {/* BOTÃO CONTINUAR */}
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continuar</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 28,
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
  stepCircleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  stepCircleTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  avatarWrapper: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 28,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: '#1E293B',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  inputFlex: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },
  button: {
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});