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
import { api, mensagemErro } from '../../services/api';
import { avisar } from '../../services/avisos';

interface AdicionarContatoProtegidoScreenProps {
  idPerfil: number;
  onBack: () => void;
  onSave?: () => void;
}

export default function AdicionarContatoProtegidoScreen({
  idPerfil,
  onBack,
  onSave
}: AdicionarContatoProtegidoScreenProps) {
  const [nome, setNome] = useState('');
  const [relacao, setRelacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSave = async () => {
    if (!nome.trim() || !relacao.trim() || !telefone.trim()) {
      avisar('Preencha nome, relação e telefone.');
      return;
    }
    setSalvando(true);
    try {
      await api.contatos.adicionar(idPerfil, { nome: nome.trim(), relacao: relacao.trim(), telefone: telefone.trim() });
      onSave ? onSave() : onBack();
    } catch (e) {
      avisar('Não foi possível salvar o contato', mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onBack?.()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contatos de Emergência</Text>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* TÍTULO E SUBTÍTULO */}
          <Text style={styles.sectionTitle}>Novo contato</Text>
          <Text style={styles.sectionSubtitle}>
            Cadastre uma pessoa que poderá ser contatada em caso de emergência.
          </Text>

          {/* CAMPO: NOME E SOBRENOME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nome e sobrenome <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput 
              style={styles.input}
              placeholder="Ex: Raimundo Silva"
              placeholderTextColor="#94A3B8"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* CAMPO: RELAÇÃO COM A PESSOA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Relação com a pessoa <Text style={styles.asterisk}>*</Text>
            </Text>
            <View style={styles.selectContainer}>
              <TextInput 
                style={styles.selectInput}
                placeholder="Selecione..."
                placeholderTextColor="#94A3B8"
                value={relacao}
                onChangeText={setRelacao}
              />
              <Feather name="triangle" size={16} color="#94A3B8" style={styles.selectIcon} />
            </View>
          </View>

          {/* CAMPO: TELEFONE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Telefone <Text style={styles.asterisk}>*</Text>
            </Text>
            <TextInput 
              style={styles.input}
              placeholder="(00) 00000 - 0000"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />
          </View>

        </ScrollView>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.saveButton} 
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.saveButtonText}>Salvar Contato</Text>
                <Feather name="check" size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            activeOpacity={0.7}
            onPress={() => onBack?.()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  asterisk: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1E293B',
  },
  selectContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  selectInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    height: 52,
    paddingLeft: 16,
    paddingRight: 44,
    fontSize: 15,
    color: '#1E293B',
  },
  selectIcon: {
    position: 'absolute',
    right: 16,
    transform: [{ rotate: '180deg' }],
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#F8FAFC',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
  },
});