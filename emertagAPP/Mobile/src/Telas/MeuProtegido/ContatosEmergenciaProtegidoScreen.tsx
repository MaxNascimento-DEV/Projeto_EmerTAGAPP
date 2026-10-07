import React, { useCallback, useEffect, useState } from 'react';
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
import { api, ContatoEmergencia, mensagemErro } from '../../services/api';
import { avisar, confirmar } from '../../services/avisos';

interface ContatosEmergenciaProtegidoScreenProps {
  idPerfil: number;
  onBack: () => void;
  onAddContato?: () => void;
}

export default function ContatosEmergenciaProtegidoScreen({ 
  idPerfil,
  onBack,
  onAddContato
}: ContatosEmergenciaProtegidoScreenProps) {
  const [contatos, setContatos] = useState<ContatoEmergencia[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setContatos(await api.contatos.listar(idPerfil));
    } catch (e) {
      avisar('Erro ao carregar contatos', mensagemErro(e));
    } finally {
      setCarregando(false);
    }
  }, [idPerfil]);

  useEffect(() => { carregar(); }, [carregar]);

  const remover = async (contato: ContatoEmergencia) => {
    const ok = await confirmar('Remover contato', `Remover ${contato.nome} dos contatos de emergência?`, 'Remover');
    if (!ok) return;
    try {
      await api.contatos.remover(idPerfil, contato.idContato);
      setContatos(lista => lista.filter(c => c.idContato !== contato.idContato));
    } catch (e) {
      avisar('Não foi possível remover', mensagemErro(e));
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
          
          {/* TÍTULO E SUBTÍTULO DA SEÇÃO */}
          <Text style={styles.sectionTitle}>Contatos Cadastrados</Text>
          <Text style={styles.sectionSubtitle}>
            Pessoas que podem ser contatadas em uma situação de emergência.
          </Text>

          {carregando && <ActivityIndicator color="#2563EB" style={{ marginTop: 16 }} />}

          {!carregando && contatos.length === 0 && (
            <Text style={styles.sectionSubtitle}>Nenhum contato cadastrado ainda.</Text>
          )}

          {/* CARDS DE CONTATO */}
          {contatos.map((contato) => (
            <View key={contato.idContato} style={styles.card}>
              <View style={styles.avatarCircle}>
                <Feather name="user" size={24} color="#2563EB" />
              </View>

              <View style={styles.cardTextWrapper}>
                <Text style={styles.contactName}>{contato.nome}</Text>
                <Text style={styles.contactRelation}>{contato.relacao}</Text>
                <Text style={styles.contactPhone}>{contato.telefone}</Text>
              </View>

              <TouchableOpacity onPress={() => remover(contato)} style={styles.moreButton} activeOpacity={0.7}>
                <Feather name="trash-2" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}

        </ScrollView>

        {/* BOTÃO ADICIONAR CONTATO */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.addButton} 
            activeOpacity={0.8}
            onPress={() => onAddContato?.()}
          >
            <Text style={styles.addButtonText}>Adicionar Contato</Text>
            <Feather name="plus" size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextWrapper: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  contactRelation: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: '#64748B',
  },
  moreButton: {
    padding: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#F8FAFC',
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});