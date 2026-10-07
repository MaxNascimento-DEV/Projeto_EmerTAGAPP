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
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { api, mensagemErro, Usuario } from '../../services/api';
import { avisar } from '../../services/avisos';

interface DadosContaProps {
  usuario: Usuario | null;
  onBack: () => void;
  onSave?: (usuarioAtualizado: Usuario) => void;
}

export default function DadosContaScreen({ usuario, onBack, onSave }: DadosContaProps) {
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [telefone, setTelefone] = useState(usuario?.telefone ?? '');
  const [salvando, setSalvando] = useState(false);

  const handleSave = async () => {
    if (nome.trim().length < 3) return avisar('O nome deve ter pelo menos 3 caracteres.');
    setSalvando(true);
    try {
      const atualizado = await api.usuarios.atualizar({
        nome: nome.trim(),
        telefone: telefone.trim() || null,
        fotoUrl: usuario?.fotoUrl ?? null,
      });
      avisar('Dados atualizados!');
      onSave ? onSave(atualizado) : onBack();
    } catch (e) {
      avisar('Não foi possível salvar', mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Feather name="arrow-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados da Conta</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TÍTULO E SUBTÍTULO */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Informações pessoais</Text>
            <Text style={styles.subtitle}>
              Atualize os dados da sua conta.
            </Text>
          </View>

          {/* INPUT NOME E SOBRENOME */}
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

          {/* E-MAIL (identifica o login, não pode ser alterado) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#F1F5F9', color: '#64748B' }]}
              value={usuario?.email ?? ''}
              editable={false}
            />
          </View>

          {/* INPUT TELEFONE */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              maxLength={20}
              value={telefone}
              onChangeText={setTelefone}
            />
          </View>

          {/* BOTÃO SALVAR ALTERAÇÕES */}
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Salvar alterações</Text>
                <Feather name="check" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </>
            )}
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
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
  button: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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