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
import { api, mensagemErro } from '../../services/api';
import { avisar } from '../../services/avisos';

interface SegurancaScreenProps {
  onBack: () => void;
  onSave?: () => void;
}

export default function SegurancaScreen({ onBack, onSave }: SegurancaScreenProps) {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // Validações simples para os requisitos
  const tem8Caracteres = novaSenha.length >= 8;
  const temMinuscula = /[a-z]/.test(novaSenha);
  const temMaiuscula = /[A-Z]/.test(novaSenha);
  const temNumero = /[0-9]/.test(novaSenha);

  const [salvando, setSalvando] = useState(false);

  const handleSave = async () => {
    if (!senhaAtual) return avisar('Informe a senha atual.');
    if (!(tem8Caracteres && temMinuscula && temMaiuscula && temNumero)) {
      return avisar('A nova senha não atende aos requisitos.');
    }
    if (novaSenha !== confirmarSenha) return avisar('A confirmação não confere com a nova senha.');

    setSalvando(true);
    try {
      await api.usuarios.alterarSenha(senhaAtual, novaSenha);
      avisar('Senha alterada com sucesso!');
      onSave ? onSave() : onBack();
    } catch (e) {
      avisar('Não foi possível alterar a senha', mensagemErro(e));
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
        <Text style={styles.headerTitle}>Segurança</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TÍTULO E SUBTÍTULO */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Alterar senha</Text>
            <Text style={styles.subtitle}>
              Use uma senha segura para proteger sua conta.
            </Text>
          </View>

          {/* SENHA ATUAL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Senha atual <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showSenhaAtual}
                placeholder="************"
                placeholderTextColor="#94A3B8"
                value={senhaAtual}
                onChangeText={setSenhaAtual}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowSenhaAtual(!showSenhaAtual)}
              >
                <Feather name={showSenhaAtual ? "eye-off" : "eye"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* NOVA SENHA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nova senha <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showNovaSenha}
                placeholder="************"
                placeholderTextColor="#94A3B8"
                value={novaSenha}
                onChangeText={setNovaSenha}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowNovaSenha(!showNovaSenha)}
              >
                <Feather name={showNovaSenha ? "eye-off" : "eye"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRMAR NOVA SENHA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirmar nova senha <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirmarSenha}
                placeholder="************"
                placeholderTextColor="#94A3B8"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
              >
                <Feather name={showConfirmarSenha ? "eye-off" : "eye"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* CARD DE REQUISITOS DA SENHA */}
          <View style={styles.infoCard}>
            <View style={styles.infoTitleRow}>
              <Feather name="lock" size={18} color="#1E293B" style={{ marginRight: 8 }} />
              <Text style={styles.infoTitle}>Sua nova senha deve conter:</Text>
            </View>

            <View style={styles.checkRow}>
              <Feather name="check" size={16} color={tem8Caracteres ? "#00A3A0" : "#94A3B8"} />
              <Text style={[styles.checkText, tem8Caracteres && styles.checkTextActive]}>
                Pelo menos 8 caracteres
              </Text>
            </View>

            <View style={styles.checkRow}>
              <Feather name="check" size={16} color={temMinuscula ? "#00A3A0" : "#94A3B8"} />
              <Text style={[styles.checkText, temMinuscula && styles.checkTextActive]}>
                Uma letra minúscula
              </Text>
            </View>

            <View style={styles.checkRow}>
              <Feather name="check" size={16} color={temMaiuscula ? "#00A3A0" : "#94A3B8"} />
              <Text style={[styles.checkText, temMaiuscula && styles.checkTextActive]}>
                Uma letra maiúscula
              </Text>
            </View>

            <View style={styles.checkRow}>
              <Feather name="check" size={16} color={temNumero ? "#00A3A0" : "#94A3B8"} />
              <Text style={[styles.checkText, temNumero && styles.checkTextActive]}>
                Um número
              </Text>
            </View>
          </View>

          {/* BOTÃO SALVAR NOVA SENHA */}
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
                <Text style={styles.buttonText}>Salvar nova senha</Text>
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
    marginBottom: 28,
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
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },
  eyeIcon: {
    padding: 4,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginTop: 8,
    marginBottom: 28,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  checkTextActive: {
    color: '#1E293B',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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