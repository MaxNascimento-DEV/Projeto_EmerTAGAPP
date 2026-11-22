import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Avatar from '../Components/Avatar';
import { avisar, confirmar } from '../../services/avisos';

// Imagem do QR Code gerada por serviço externo a partir da URL pública do perfil
const urlImagemQr = (dados: string, tamanho: number) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${tamanho}x${tamanho}&data=${encodeURIComponent(dados)}`;

interface QrCodeScreenProps {
  onBack: () => void;
  urlPublica: string;
  nome?: string;
  tipo?: string;
  fotoUrl?: string | null;
  // Pede um novo token à API; o QR Code antigo para de funcionar
  onRegenerateQRCode?: () => Promise<void>;
}

export default function QrCodeScreen({ 
  onBack,
  urlPublica,
  nome = '',
  tipo = '',
  fotoUrl,
  onRegenerateQRCode
}: QrCodeScreenProps) {
  const [gerando, setGerando] = useState(false);
  const [compartilhando, setCompartilhando] = useState(false);

  const baixar = () => {
    Linking.openURL(urlImagemQr(urlPublica, 1000)).catch(() => avisar('Não foi possível abrir o QR Code.'));
  };

  // Abre a página pública do perfil no navegador, sem precisar escanear o QR Code
  const visualizarPagina = () => {
    Linking.openURL(urlPublica).catch(() => avisar('Não foi possível abrir a página de emergência.'));
  };

  // Baixa a imagem para um arquivo temporário e abre o menu nativo de compartilhamento
  const compartilhar = async () => {
    setCompartilhando(true);
    try {
      // No navegador (Expo Web) não há arquivo local: compartilha o link da imagem
      if (Platform.OS === 'web') {
        const link = urlImagemQr(urlPublica, 1000);
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({ title: 'QR Code de Emergência', url: link });
        } else {
          avisar('Compartilhar não está disponível neste navegador.');
        }
        return;
      }

      if (!(await Sharing.isAvailableAsync())) {
        avisar('Compartilhar não está disponível neste aparelho.');
        return;
      }

      const destino = `${FileSystem.cacheDirectory}qrcode-emergencia.png`;
      const { uri, status } = await FileSystem.downloadAsync(urlImagemQr(urlPublica, 1000), destino);
      if (status !== 200) throw new Error('download');

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Compartilhar QR Code',
      });
    } catch {
      avisar('Não foi possível compartilhar o QR Code.');
    } finally {
      setCompartilhando(false);
    }
  };

  const regenerar = async () => {
    if (!onRegenerateQRCode) return;
    const ok = await confirmar(
      'Gerar novo QR Code',
      'O QR Code atual deixará de funcionar. Será preciso imprimir o novo. Deseja continuar?',
      'Gerar novo'
    );
    if (!ok) return;
    setGerando(true);
    try {
      await onRegenerateQRCode();
    } finally {
      setGerando(false);
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
        <Text style={styles.headerTitle}>QR Code de Emergência</Text>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* PERFIL DO PROTEGIDO */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Avatar fotoUrl={fotoUrl} style={styles.avatarImage} tamanhoIcone={40} />
            </View>
            <Text style={styles.userName}>{nome}</Text>
            <Text style={styles.userRole}>{tipo}</Text>
          </View>

          {/* SEÇÃO QR CODE */}
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>QR Code de Emergência</Text>
            
            <View style={styles.qrContainer}>
              {gerando ? (
                <ActivityIndicator color="#2563EB" />
              ) : (
                <Image 
                  source={{ uri: urlImagemQr(urlPublica, 250) }} 
                  style={styles.qrImage}
                />
              )}
            </View>

            <Text style={styles.urlText} onPress={() => Linking.openURL(urlPublica)}>
              <Text style={styles.urlLabel}>URL pública: </Text>
              {urlPublica}
            </Text>
          </View>

        </ScrollView>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.downloadButton} 
            activeOpacity={0.8}
            onPress={baixar}
          >
            <Feather name="download" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.downloadButtonText}>Baixar QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            activeOpacity={0.7}
            onPress={compartilhar}
            disabled={compartilhando || gerando}
          >
            {compartilhando ? (
              <ActivityIndicator color="#3B82F6" />
            ) : (
              <>
                <Feather name="share-2" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
                <Text style={styles.shareButtonText}>Compartilhar QR Code</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewButton}
            activeOpacity={0.7}
            onPress={visualizarPagina}
            disabled={gerando}
          >
            <Feather name="external-link" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={styles.viewButtonText}>Visualizar página de emergência</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.regenerateButton} 
            activeOpacity={0.7}
            onPress={regenerar}
            disabled={gerando}
          >
            <Feather name="refresh-cw" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
            <Text style={styles.regenerateButtonText}>Gerar novo QR Code</Text>
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
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: '#CBD5E1',
    marginBottom: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: '#64748B',
  },
  qrSection: {
    alignItems: 'center',
    width: '100%',
  },
  qrTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 16,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  urlText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  urlLabel: {
    fontWeight: '700',
    color: '#1E293B',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#F8FAFC',
    width: '100%',
  },
  downloadButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
  },
  viewButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
  },
  regenerateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regenerateButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
  },
});