import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { api, mensagemErro, TamanhoTexto } from '../../services/api';
import { avisar } from '../../services/avisos';

// Rótulo da tela <-> enum TamanhoTexto do backend
const PARA_API: Record<'Pequeno' | 'Médio' | 'Grande', TamanhoTexto> = {
  Pequeno: 'PEQUENO',
  Médio: 'MEDIO',
  Grande: 'GRANDE',
};
const DA_API: Record<TamanhoTexto, 'Pequeno' | 'Médio' | 'Grande'> = {
  PEQUENO: 'Pequeno',
  MEDIO: 'Médio',
  GRANDE: 'Grande',
};

interface AcessibilidadeScreenProps {
  onBack: () => void;
  onSave?: () => void;
}

export default function AcessibilidadeScreen({ onBack, onSave }: AcessibilidadeScreenProps) {
  const [tamanhoTexto, setTamanhoTexto] = useState<'Pequeno' | 'Médio' | 'Grande'>('Médio');
  const [altoContraste, setAltoContraste] = useState(false);

  // Ajusta dinamicamente o tamanho da fonte no card de Pré-visualização
  const getFontSizePreview = () => {
    switch (tamanhoTexto) {
      case 'Pequeno':
        return 13;
      case 'Grande':
        return 17;
      case 'Médio':
      default:
        return 15;
    }
  };

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api.acessibilidade.buscar()
      .then((config) => {
        setTamanhoTexto(DA_API[config.tamanhoTexto] ?? 'Médio');
        setAltoContraste(!!config.altoContraste);
      })
      .catch(() => { /* mantém o padrão da tela */ });
  }, []);

  const handleSave = async () => {
    setSalvando(true);
    try {
      await api.acessibilidade.salvar({ tamanhoTexto: PARA_API[tamanhoTexto], altoContraste });
      avisar('Preferências salvas!');
      onSave ? onSave() : onBack();
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
        <Text style={styles.headerTitle}>Acessibilidade</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TÍTULO E SUBTÍTULO */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Ajustes de visualização</Text>
          <Text style={styles.subtitle}>
            Personalize a interface para facilitar a leitura e o uso do aplicativo.
          </Text>
        </View>

        {/* SEÇÃO TAMANHO DO TEXTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tamanho do texto</Text>
          <Text style={styles.sectionSubtitle}>
            Escolha o tamanho mais confortável para leitura.
          </Text>

          {/* BOTOES SELETORES */}
          <View style={styles.buttonGroup}>
            {(['Pequeno', 'Médio', 'Grande'] as const).map((opcao) => {
              const isSelected = tamanhoTexto === opcao;
              return (
                <TouchableOpacity
                  key={opcao}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  activeOpacity={0.8}
                  onPress={() => setTamanhoTexto(opcao)}
                >
                  <Text style={[styles.optionButtonText, isSelected && styles.optionButtonTextSelected]}>
                    {opcao}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* PRÉ-VISUALIZAÇÃO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pré-visualização</Text>
          <View style={styles.previewCard}>
            <Text style={[styles.previewText, { fontSize: getFontSizePreview() }]}>
              Este é um exemplo de como os textos serão exibidos.
            </Text>
          </View>
        </View>

        {/* ALTO CONTRASTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alto contraste</Text>
          <View style={styles.contrastCard}>
            <Text style={styles.contrastText}>
              Aumenta o contraste entre textos e elementos da tela.
            </Text>
            <View style={styles.switchWrapper}>
              <Switch
                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                thumbColor={altoContraste ? '#2563EB' : '#F1F5F9'}
                ios_backgroundColor="#CBD5E1"
                onValueChange={setAltoContraste}
                value={altoContraste}
              />
            </View>
          </View>
        </View>

        {/* BOTÃO SALVAR PREFERÊNCIAS */}
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
              <Text style={styles.buttonText}>Salvar preferências</Text>
              <Feather name="check" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </>
          )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  optionButtonSelected: {
    backgroundColor: '#2563EB',
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    minHeight: 80,
    justifyContent: 'center',
  },
  previewText: {
    color: '#64748B',
    lineHeight: 22,
  },
  contrastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    alignItems: 'center',
  },
  contrastText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  switchWrapper: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
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