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
import { api, mensagemErro } from '../../../services/api';
import { avisar } from '../../../services/avisos';

interface ConvidarCuidadorProps {
  idPerfil: number;
  nomePerfil: string;
  onBack: () => void;
  onSendInvite?: () => void;
}

export default function ConvidarCuidadorScreen({ idPerfil, nomePerfil, onBack, onSendInvite }: ConvidarCuidadorProps) {
  const [email, setEmail] = useState('');
  const [visualizarPrivadas, setVisualizarPrivadas] = useState(true);
  const [editarInformacoes, setEditarInformacoes] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSend = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return avisar('Informe um e-mail válido.');
    setEnviando(true);
    try {
      await api.convites.criar(idPerfil, email.trim(), visualizarPrivadas, editarInformacoes);
      avisar('Convite enviado!', `Quando ${email.trim()} entrar no EmerTag, verá o convite na aba Rede.`);
      onSendInvite ? onSendInvite() : onBack();
    } catch (e) {
      avisar('Não foi possível enviar o convite', mensagemErro(e));
    } finally {
      setEnviando(false);
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
        <Text style={styles.headerTitle}>Convidar Cuidador</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* TÍTULO E SUBTÍTULO */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Novo cuidador</Text>
            <Text style={styles.subtitle}>
              Convide uma pessoa para fazer parte da rede de cuidado.
            </Text>
          </View>

          {/* INPUT E-MAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              E-mail <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="exemplo@email.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* SELETOR PERFIL DE EMERGÊNCIA */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Perfil de emergência</Text>
            {/* O perfil é o que está selecionado na tela Rede */}
            <View style={styles.selectorCard}>
              <View style={styles.selectorLeft}>
                <View style={styles.avatarCircleTeal}>
                  <Feather name="user" size={24} color="#00A3A0" />
                </View>
                <Text style={styles.selectorName}>{nomePerfil}</Text>
              </View>
            </View>
          </View>

          {/* SEÇÃO PERMISSÕES */}
          <View style={styles.inputGroup}>
            <Text style={styles.sectionTitle}>Permissões</Text>

            {/* CHECKBOX 1 */}
            <TouchableOpacity 
              style={styles.checkboxRow} 
              activeOpacity={0.7}
              onPress={() => setVisualizarPrivadas(!visualizarPrivadas)}
            >
              <View style={[styles.checkbox, visualizarPrivadas && styles.checkboxChecked]}>
                {visualizarPrivadas && <Feather name="check" size={14} color="#FFFFFF" />}
              </View>
              <View style={styles.checkboxTextWrapper}>
                <Text style={styles.checkboxTitle}>Visualizar informações privadas</Text>
                <Text style={styles.checkboxSubtitle}>Permite acessar dados não públicos.</Text>
              </View>
            </TouchableOpacity>

            {/* CHECKBOX 2 */}
            <TouchableOpacity 
              style={styles.checkboxRow} 
              activeOpacity={0.7}
              onPress={() => setEditarInformacoes(!editarInformacoes)}
            >
              <View style={[styles.checkbox, editarInformacoes && styles.checkboxChecked]}>
                {editarInformacoes && <Feather name="check" size={14} color="#FFFFFF" />}
              </View>
              <View style={styles.checkboxTextWrapper}>
                <Text style={styles.checkboxTitle}>Editar informações</Text>
                <Text style={styles.checkboxSubtitle}>Permite atualizar os dados do perfil.</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* BOTÃO ENVIAR CONVITE */}
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleSend}
            disabled={enviando}
          >
            {enviando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Enviar convite</Text>
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
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
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircleTeal: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F4F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  selectorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxTextWrapper: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  checkboxSubtitle: {
    fontSize: 13,
    color: '#64748B',
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