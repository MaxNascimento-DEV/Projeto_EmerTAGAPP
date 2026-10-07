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
import { dataBrParaIso, mascaraData, TIPOS_SANGUINEOS } from '../../../services/api';
import { avisar } from '../../../services/avisos';
import { escolherEEnviarFoto } from '../../../services/fotos';
import Avatar from '../../Components/Avatar';

const PARENTESCOS = ['Pai', 'Mãe', 'Filho(a)', 'Avô', 'Avó', 'Irmão(ã)', 'Cônjuge', 'Neto(a)', 'Tio(a)', 'Outro'];

interface ProtegidoPasso1Props {
  onBack: () => void;
  // dataNascimento já sai no formato da API (yyyy-MM-dd)
  onNext?: (data: { nome: string; dataNascimento: string; parentesco: string; tipoSanguineo: string | null; fotoUrl: string | null }) => void;
}

export default function DadosProtegidoPasso1({ onBack, onNext }: ProtegidoPasso1Props) {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [seletorAberto, setSeletorAberto] = useState<'parentesco' | 'tipoSanguineo' | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const escolherFoto = async () => {
    setEnviandoFoto(true);
    const url = await escolherEEnviarFoto();
    if (url) setFotoUrl(url);
    setEnviandoFoto(false);
  };

  const handleContinue = () => {
    if (!onNext) return onBack();
    if (nome.trim().length < 3) return avisar('Informe nome e sobrenome.');
    const dataIso = dataBrParaIso(dataNascimento);
    if (!dataIso) return avisar('Data de nascimento inválida', 'Use o formato dd/mm/aaaa.');
    if (!parentesco) return avisar('Selecione o parentesco com o perfil.');

    onNext({ nome: nome.trim(), dataNascimento: dataIso, parentesco, tipoSanguineo: tipoSanguineo || null, fotoUrl });
  };

  const renderOpcoes = (opcoes: string[], selecionado: string, onSelect: (valor: string) => void) => (
    <View style={styles.optionsList}>
      {opcoes.map((opcao) => (
        <TouchableOpacity
          key={opcao}
          style={[styles.optionChip, selecionado === opcao && styles.optionChipSelected]}
          activeOpacity={0.8}
          onPress={() => {
            onSelect(selecionado === opcao ? '' : opcao);
            setSeletorAberto(null);
          }}
        >
          <Text style={[styles.optionChipText, selecionado === opcao && styles.optionChipTextSelected]}>{opcao}</Text>
        </TouchableOpacity>
      ))}
    </View>
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

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TÍTULO E ETAPA */}
          <View style={styles.stepTitleContainer}>
            <Text style={styles.title}>Dados pessoais</Text>
            <Text style={styles.stepSubtitle}>Passo 1 de 4</Text>
          </View>

          {/* BARRA DE PROGRESSO COM BOLSINHAS */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: '25%' }]} />
            </View>
            <View style={styles.stepsRow}>
              <View style={[styles.stepCircle, styles.stepActive]}>
                <Text style={styles.stepTextActive}>1</Text>
              </View>
              <View style={styles.stepCircle}>
                <Text style={styles.stepText}>2</Text>
              </View>
              <View style={styles.stepCircle}>
                <Text style={styles.stepText}>3</Text>
              </View>
              <View style={styles.stepCircle}>
                <Text style={styles.stepText}>4</Text>
              </View>
            </View>
          </View>

          {/* FOTO / AVATAR */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarCircle} activeOpacity={0.8} onPress={escolherFoto} disabled={enviandoFoto}>
              <View style={{ width: '100%', height: '100%', borderRadius: 55, overflow: 'hidden' }}>
                <Avatar fotoUrl={fotoUrl} style={{ width: '100%', height: '100%' }} tamanhoIcone={64} corIcone="#94A3B8" enviando={enviandoFoto} />
              </View>
              <View style={styles.cameraBadge}>
                <Feather name="camera" size={16} color="#2563EB" />
              </View>
            </TouchableOpacity>
          </View>

          {/* NOME E SOBRENOME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome e sobrenome <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Raimundo Oliveira"
              placeholderTextColor="#94A3B8"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* DATA DE NASCIMENTO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Data de nascimento <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWithIconContainer}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#94A3B8"
                value={dataNascimento}
                onChangeText={(t) => setDataNascimento(mascaraData(t))}
                maxLength={10}
                keyboardType="numeric"
              />
              <Feather name="calendar" size={20} color="#2563EB" style={styles.inputIcon} />
            </View>
          </View>

          {/* PARENTESCO COM O PERFIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Parentesco com o perfil <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.selectInput}
              activeOpacity={0.8}
              onPress={() => setSeletorAberto(seletorAberto === 'parentesco' ? null : 'parentesco')}
            >
              <Text style={parentesco ? styles.selectTextSelected : styles.selectTextPlaceholder}>
                {parentesco || 'Selecione...'}
              </Text>
              <Feather name={seletorAberto === 'parentesco' ? 'chevron-up' : 'chevron-down'} size={20} color="#2563EB" />
            </TouchableOpacity>
            {seletorAberto === 'parentesco' && renderOpcoes(PARENTESCOS, parentesco, setParentesco)}
          </View>

          {/* TIPO SANGUÍNEO */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo sanguíneo (opcional)</Text>
            <TouchableOpacity
              style={styles.selectInput}
              activeOpacity={0.8}
              onPress={() => setSeletorAberto(seletorAberto === 'tipoSanguineo' ? null : 'tipoSanguineo')}
            >
              <Text style={tipoSanguineo ? styles.selectTextSelected : styles.selectTextPlaceholder}>
                {tipoSanguineo || 'Selecione...'}
              </Text>
              <Feather name={seletorAberto === 'tipoSanguineo' ? 'chevron-up' : 'chevron-down'} size={20} color="#2563EB" />
            </TouchableOpacity>
            {seletorAberto === 'tipoSanguineo' && renderOpcoes(TIPOS_SANGUINEOS, tipoSanguineo, setTipoSanguineo)}
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
  stepSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  progressSection: {
    marginBottom: 28,
    position: 'relative',
    justifyContent: 'center',
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
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 2,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: '#2563EB',
  },
  stepText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  stepTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
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
  inputWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },
  inputIcon: {
    marginLeft: 8,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  selectTextPlaceholder: {
    fontSize: 15,
    color: '#94A3B8',
  },
  selectTextSelected: {
    fontSize: 15,
    color: '#1E293B',
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  optionChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  optionChipText: {
    fontSize: 14,
    color: '#1E293B',
  },
  optionChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
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