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
import Avatar from '../../Components/Avatar';
import { api, MembroRede, mensagemErro } from '../../../services/api';
import { avisar, confirmar } from '../../../services/avisos';

interface GerenciarMembroProps {
  membro: MembroRede;
  onBack: () => void;
  onSave?: () => void;
  onRemove?: () => void;
}

export default function GerenciarMembroScreen({ membro, onBack, onSave, onRemove }: GerenciarMembroProps) {
  const [visualizarPrivadas, setVisualizarPrivadas] = useState(!!membro.podeVisualizarPrivado);
  const [editarInformacoes, setEditarInformacoes] = useState(!!membro.podeEditar);
  const [salvando, setSalvando] = useState(false);

  const handleSave = async () => {
    setSalvando(true);
    try {
      await api.rede.atualizarPermissoes(membro.idPerfil, membro.idUsuario, visualizarPrivadas, editarInformacoes);
      onSave ? onSave() : onBack();
    } catch (e) {
      avisar('Não foi possível salvar', mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  };

  const handleRemove = async () => {
    const ok = await confirmar('Remover da rede', `Remover ${membro.nomeUsuario} da rede de cuidado de ${membro.nomePerfil}?`, 'Remover');
    if (!ok) return;
    try {
      await api.rede.remover(membro.idPerfil, membro.idUsuario);
      onRemove ? onRemove() : onBack();
    } catch (e) {
      avisar('Não foi possível remover', mensagemErro(e));
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
        <Text style={styles.headerTitle}>Gerenciar Membro</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* FOTO E PERFIL */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Avatar style={styles.avatarImage} />
          </View>
          <Text style={styles.memberName}>{membro.nomeUsuario}</Text>
          <Text style={styles.memberRole}>Cuidador</Text>
        </View>

        {/* SEÇÃO PERMISSÕES */}
        <View style={styles.section}>
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

        {/* BOTÃO SALVAR ALTERAÇÕES */}
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
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
              <Feather name="check" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>

        {/* BOTÃO REMOVER DA REDE */}
        <TouchableOpacity
          style={styles.removeButton}
          activeOpacity={0.8}
          onPress={handleRemove}
        >
          <Text style={styles.removeButtonText}>Remover da rede</Text>
          <Feather name="trash-2" size={20} color="#DC2626" style={{ marginLeft: 8 }} />
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    marginBottom: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  memberName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    marginBottom: 32,
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
  saveButton: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});