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
import LabelComAjuda from '../Components/LabelComAjuda';

interface Passo2Props {
  onBack: () => void;
  onNext: (data: { alergias: string[]; condicoes: string[]; medicamentos: string[]; biosseguranca: string[] }) => void;
  isEditing?: boolean;
  initialData?: { alergias?: string []; condicoes?: string[]; medicamentos?: string[]; biosseguranca: string[] };
}

export default function DadosSaudePasso2({ onBack, onNext, isEditing = false, initialData}: Passo2Props) {
  // Estados para os inputs de texto
  const [inputAlergia, setInputAlergia] = useState('');
  const [inputCondicao, setInputCondicao] = useState('');
  const [inputMedicamento, setInputMedicamento] = useState('');
  const [inputBiosseguranca, setInputBiosseguranca] = useState('');

  // Estados para as listas de tags (iniciados com exemplos visuais da imagem)
  const [alergias, setAlergias] = useState<string[]>(initialData?.alergias ?? []);
  const [condicoes, setCondicoes] = useState<string[]>(initialData?.condicoes ?? []);
  const [medicamentos, setMedicamentos] = useState<string[]>(initialData?.medicamentos ?? []);
  const [biosseguranca, setBiosseguranca] = useState<string[]>(initialData?.biosseguranca ?? []);

  // Funções para adicionar itens
  const mergePending = (list: string[], pending: string) => {
    const value = pending.trim();
    if (!value) return list;
    const exists = list.some(i => i.toLowerCase() === value.toLowerCase());
    return exists ? list : [...list, value];
  };

  const addAlergia = () => {
    setAlergias(mergePending(alergias, inputAlergia));
    setInputAlergia('');
  };

  const addCondicao = () => {
    setCondicoes(mergePending(condicoes, inputCondicao));
    setInputCondicao('');
  };

  const addMedicamento = () => {
    setMedicamentos(mergePending(medicamentos, inputMedicamento));
    setInputMedicamento('');
  };

  const addBiosseguranca = () => {
    setBiosseguranca(mergePending(biosseguranca, inputBiosseguranca));
    setInputBiosseguranca('');
  };

  // Funções para remover itens
  const removeAlergia = (index: number) => {
    setAlergias(alergias.filter((_, i) => i !== index));
  };

  const removeCondicao = (index: number) => {
    setCondicoes(condicoes.filter((_, i) => i !== index));
  };

  const removeMedicamento = (index: number) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };

  const removeBiosseguranca = (index: number) => {
    setBiosseguranca(biosseguranca.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    onNext({ 
      alergias: mergePending(alergias, inputAlergia), 
      condicoes: mergePending(condicoes, inputCondicao), 
      medicamentos: mergePending(medicamentos, inputMedicamento), 
      biosseguranca: mergePending(biosseguranca, inputBiosseguranca),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Dados de Saúde' : 'Dados de Saúde'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TÍTULO E PASSO */}
          <View style={styles.stepTitleContainer}>
            <Text style={styles.title}>Saúde e medicamentos</Text>
            <Text style={styles.stepText}>{!isEditing ? 'Passo 2 de 4' : ''}</Text>
          </View>

          {/* BARRA DE PROGRESSO (50%) */}
          {!isEditing && (
            <>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '50%' }]} />
          </View>
          

          {/* CÍRCULOS DE PROGRESSO */}
          <View style={styles.stepsCircleRow}>
            {/* Passo 1 Concluído */}
            <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
              <Feather name="check" size={18} color="#FFFFFF" />
            </View>
            {/* Passo 2 Ativo */}
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepCircleTextActive}>2</Text>
            </View>
            <View style={styles.stepCircle}>
              <Text style={styles.stepCircleText}>3</Text>
            </View>
            <View style={styles.stepCircle}>
              <Text style={styles.stepCircleText}>4</Text>
            </View>
          </View>
          </>
          )}

          {/* SEÇÃO: ALERGIAS */}
          <View style={styles.inputGroup}>
            <LabelComAjuda
              label="Alergias"
              ajuda="Informe medicamentos, alimentos ou substâncias que causam reação alérgica, como dipirona, penicilina ou amendoim."
              />
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Ex: Dipirona"
                placeholderTextColor="#94A3B8"
                value={inputAlergia}
                onChangeText={setInputAlergia}
                onSubmitEditing={addAlergia}
              />
              <TouchableOpacity onPress={addAlergia} activeOpacity={0.7}>
                <Feather name="plus" size={24} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {/* TAGS DE ALERGIAS */}
            <View style={styles.chipsRow}>
              {alergias.map((item, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeAlergia(index)}>
                    <Feather name="minus" size={14} color="#EF4444" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* SEÇÃO: CONDIÇÕES DE SAÚDE */}
          <View style={styles.inputGroup}>
            <LabelComAjuda
              label="Doenças crônicas"
              ajuda="Informe doenças de longa duração que exigem acompanhamento, como diabetes, hipertensão ou asma."
              />
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Ex: Diabetes tipo 1"
                placeholderTextColor="#94A3B8"
                value={inputCondicao}
                onChangeText={setInputCondicao}
                onSubmitEditing={addCondicao}
              />
              <TouchableOpacity onPress={addCondicao} activeOpacity={0.7}>
                <Feather name="plus" size={24} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {/* TAGS DE CONDIÇÕES */}
            <View style={styles.chipsRow}>
              {condicoes.map((item, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeCondicao(index)}>
                    <Feather name="minus" size={14} color="#EF4444" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* SEÇÃO: MEDICAMENTOS */}
          <View style={styles.inputGroup}>
            <LabelComAjuda
              label="Medicamentos"
              ajuda="Liste os remédios de uso contínuo, como insulina ou metformina. Isso ajuda a equipe de saúde a ser mais precisa."
            />
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Ex: Metformina"
                placeholderTextColor="#94A3B8"
                value={inputMedicamento}
                onChangeText={setInputMedicamento}
                onSubmitEditing={addMedicamento}
              />
              <TouchableOpacity onPress={addMedicamento} activeOpacity={0.7}>
                <Feather name="plus" size={24} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {/* TAGS DE MEDICAMENTOS */}
            <View style={styles.chipsRow}>
              {medicamentos.map((item, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeMedicamento(index)}>
                    <Feather name="minus" size={14} color="#EF4444" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* SEÇÃO: BIOSSEGURANÇA */}
          <View style={styles.inputGroup}>
            <LabelComAjuda
              label="Biossegurança"
              ajuda="Informe riscos de contaminação que exigem cuidado no atendimento, como infecção transmissível por sangue ou fluidos."
            />
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Ex: Infecção transmissível por sangue"
                placeholderTextColor="#94A3B8"
                value={inputBiosseguranca}
                onChangeText={setInputBiosseguranca}
                onSubmitEditing={addBiosseguranca}
              />
              <TouchableOpacity onPress={addBiosseguranca} activeOpacity={0.7}>
                <Feather name="plus" size={24} color="#2563EB" />
              </TouchableOpacity>
            </View>

            {/* TAGS DE BIOSSEGURANÇA */}
            <View style={styles.chipsRow}>
              {biosseguranca.map((item, index) => (
                <View key={index} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeBiosseguranca(index)}>
                    <Feather name="minus" size={14} color="#EF4444" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* BOTÃO CONTINUAR */}
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            activeOpacity={0.8}
            onPress={handleContinue}
          >
            <Text style={styles.buttonPrimaryText}> {isEditing ? 'Salvar alterações' : 'Continuar'} </Text>
            <Feather name={isEditing ? 'check' : 'arrow-right'} size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

        {/* BOTÃO CANCELAR */}
          <TouchableOpacity style={styles.buttonSecondary} activeOpacity={0.8} onPress={onBack}>
            <Feather
              name={isEditing ? 'x' : 'arrow-left'}
              size={20}
              color="#2563EB"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonSecondaryText}>{isEditing ? 'Cancelar' : 'Voltar'}</Text>
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
  stepCircleCompleted: {
    backgroundColor: '#0D9488',
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    minHeight: 0,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
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