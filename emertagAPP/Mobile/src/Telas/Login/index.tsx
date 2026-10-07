import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ImageBackground,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { api, sessao, mensagemErro, Usuario } from '../../services/api';
import { avisar } from '../../services/avisos';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: (usuario: Usuario) => void;
  emailInicial?: string;
}

export default function LoginScreen({ onNavigateToRegister, onLoginSuccess, emailInicial = '' }: LoginScreenProps) {
  const [email, setEmail] = useState(emailInicial);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      avisar('Preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      const resposta = await api.usuarios.login(email.trim(), password);
      sessao.definirToken(resposta.token);
      onLoginSuccess(resposta.usuario);
    } catch (e) {
      avisar('Não foi possível entrar', mensagemErro(e));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <ImageBackground 
        source={require('../../../assets/mapa-bg.png')} 
        style={styles.background}
        imageStyle={styles.mapaImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* CABEÇALHO DA LOGO */}
            <View style={styles.logoHeaderContainer}>
              <View style={styles.circlesWrapper}>
                <Image 
                  source={require('../../../assets/group7.png')} 
                  style={styles.circlesImage} 
                  resizeMode="contain" 
                />
                <Image 
                  source={require('../../../assets/logo-fb.png')} 
                  style={styles.logoFbImage} 
                  resizeMode="contain" 
                />
              </View>

              <Image 
                source={require('../../../assets/group16.png')} 
                style={styles.group16Image} 
                resizeMode="contain" 
              />
            </View>

            {/* CARD DE LOGIN */}
            <View style={styles.card}>
              <Text style={styles.title}>Bem-vindo de volta!</Text>

              {/* Input: E-mail */}
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Input: Senha */}
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Senha"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Opções: Lembrar de mim / Esqueci a senha */}
              <View style={styles.optionsRow}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  activeOpacity={0.8}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Feather name="check" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.optionsText}>Lembrar de mim</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
                </TouchableOpacity>
              </View>

              {/* Botão Entrar */}
              <TouchableOpacity activeOpacity={0.9} style={styles.buttonShadow} onPress={handleLogin} disabled={carregando}>
                <LinearGradient
                  colors={['#00A3A0', '#0052D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  {carregando ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Entrar</Text>
                      <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.arrowIcon} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Link para mudar para Cadastro */}
              <View style={styles.footerLinkContainer}>
                <Text style={styles.footerText}>Não tem uma conta? </Text>
                <TouchableOpacity onPress={onNavigateToRegister}>
                  <Text style={styles.linkText}>Cadastre-se aqui!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FD',
  },
  background: {
    flex: 1,
  },
  mapaImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 300,
    opacity: 1.0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  circlesWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlesImage: {
    width: 200,
    height: 200,
    position: 'absolute',
  },
  logoFbImage: {
    width: 125,
    height: 125,
    borderRadius: 62.5,
  },
  group16Image: {
    width: 240,
    height: 55,
    marginTop: 8,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 18,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#00A3A0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#00A3A0',
  },
  optionsText: {
    fontSize: 13,
    color: '#64748B',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#00A3A0',
    fontWeight: '600',
  },
  buttonShadow: {
    marginTop: 8,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#0052D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowIcon: {
    position: 'absolute',
    right: 25,
  },
  footerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  linkText: {
    fontSize: 14,
    color: '#00A3A0',
    fontWeight: '600',
  },
});