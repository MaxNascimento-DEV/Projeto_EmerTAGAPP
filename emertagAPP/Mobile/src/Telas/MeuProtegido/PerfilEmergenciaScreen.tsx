import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Avatar from '../Components/Avatar';
import { api, mensagemErro, PerfilPublico } from '../../services/api';

interface PerfilEmergenciaProps {
  onBack?: () => void;
  // Mesmo token do QR Code: a tela mostra exatamente o que o socorrista verá
  tokenPublico: string;
}

export function PerfilEmergenciaScreen({ onBack, tokenPublico }: PerfilEmergenciaProps) {
  const [perfil, setPerfil] = useState<PerfilPublico | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.perfis.publico(tokenPublico)
      .then(setPerfil)
      .catch((e) => setErro(mensagemErro(e)));
  }, [tokenPublico]);

  // null = oculto pela privacidade (não mostra o card); [] = sem registros
  const biosseguranca = perfil?.biosseguranca ? perfil.biosseguranca.split('; ') : perfil ? [] : null;

  const infoSecundaria = [
    perfil?.idade != null ? `${perfil.idade} anos` : null,
    perfil?.tipoSanguineo ? `Sangue ${perfil.tipoSanguineo}` : null,
  ].filter(Boolean).join(', ');

  const renderLista = (lista: string[]) =>
    lista.length === 0 ? (
      <Text style={styles.cardSubtitle}>Sem registros</Text>
    ) : (
      lista.map((item, i) => (
        <Text key={i} style={styles.cardSubtitle}>{item}</Text>
      ))
    );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* CABEÇALHO AZUL EXPANDIDO */}
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <Feather name="arrow-left" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <Text style={styles.headerTitle}>Perfil de Emergência</Text>

          {/* FOTO E NOME */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Avatar fotoUrl={perfil?.fotoUrl} style={styles.avatarImage} />
            </View>
            <Text style={styles.userName}>{perfil?.nome ?? ''}</Text>
            {!!infoSecundaria && <Text style={styles.userInfo}>{infoSecundaria}</Text>}
          </View>
        </View>

        {/* CORPO DE CONTEÚDO */}
        <View style={styles.body}>

          {!perfil && !erro && <ActivityIndicator color="#2563EB" />}
          {erro && <Text style={styles.cardSubtitle}>{erro}</Text>}

          {perfil && (
          <>
          {/* SEÇÃO INFORMAÇÕES MÉDICAS */}
          <Text style={styles.sectionTitle}>Informações Médicas</Text>

          {/* CARD ALERGIAS (ALERTA VERMELHO) */}
          {perfil.alergias && (
          <View style={[styles.card, styles.cardAlergias]}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Feather name="alert-triangle" size={22} color="#EF4444" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={[styles.cardTitle, { color: '#EF4444' }]}>ALERGIAS</Text>
              {renderLista(perfil.alergias)}
            </View>
          </View>
          )}

          {/* CARD CONDIÇÕES DE SAÚDE */}
          {perfil.condicoes && (
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="activity" size={22} color="#2563EB" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Doenças Crônicas</Text>
              {renderLista(perfil.condicoes)}
            </View>
          </View>
          )}

          {/* CARD MEDICAMENTOS */}
          {perfil.medicamentos && (
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="disc" size={22} color="#2563EB" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Medicamentos</Text>
              {renderLista(perfil.medicamentos)}
            </View>
          </View>
          )}

          {/* CARD BIOSSEGURANÇA */}
          {biosseguranca && (
          <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="shield" size={22} color="#2563EB" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Biossegurança</Text>
              {renderLista(biosseguranca)}
            </View>
          </View>
          )}

          {/* CARD NECESSIDADES ESPECÍFICAS (AMARELO) */}
          {perfil.necessidadesEspecificas && (
          <View style={[styles.card, styles.cardNecessidades]}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="user-check" size={22} color="#D97706" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>Necessidades específicas</Text>
              {renderLista(perfil.necessidadesEspecificas)}
            </View>
          </View>
          )}

          {/* SEÇÃO CONTATOS DE EMERGÊNCIA */}
          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Contatos de Emergência</Text>

          {(perfil.contatos ?? []).length === 0 && (
            <Text style={styles.cardSubtitle}>Nenhum contato cadastrado</Text>
          )}

          {/* CARDS DE CONTATO */}
          {(perfil.contatos ?? []).map((contato, i) => (
          <View key={i} style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="phone-call" size={22} color="#2563EB" />
            </View>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>{contato.nome}</Text>
              <Text style={styles.cardSubtitle}>{contato.relacao} • {contato.telefone}</Text>
            </View>
          </View>
          ))}
          </>
          )}

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export default PerfilEmergenciaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 14,
    color: '#DBEAFE',
    fontWeight: '500',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
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
  },
  cardAlergias: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  cardNecessidades: {
    borderColor: '#FCD34D',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 1,
  },
});