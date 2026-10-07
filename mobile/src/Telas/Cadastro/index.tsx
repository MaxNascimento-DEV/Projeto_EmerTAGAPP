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
import { api, mensagemErro } from '../../services/api';
import { avisar } from '../../services/avisos';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess?: (email: string) => void;
}

export default function RegisterScreen({ onNavigateToLogin, onRegisterSuccess }: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleRegister = async () => {
    if (name.trim().length < 3) return avisar('Informe seu nome completo.');
    if (!email.trim()) return avisar('Informe seu e-mail.');
    if (password.length < 8) return avisar('A senha deve ter no mínimo 8 caracteres.');
    if (password !== confirmPassword) return avisar('As senhas não conferem.');
    if (!acceptedTerms) return avisar('Aceite os Termos de Uso para continuar.');

    setCarregando(true);
    try {
      await api.usuarios.cadastrar({ nome: name.trim(), email: email.trim(), senha: password });
      avisar('Conta criada!', 'Agora é só entrar com seu e-mail e senha.');
      onRegisterSuccess ? onRegisterSuccess(email.trim()) : onNavigateToLogin();
    } catch (e) {
      avisar('Não foi possível criar a conta', mensagemErro(e));
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

            {/* CARD DE CADASTRO */}
            <View style={styles.card}>
              <Text style={styles.title}>Seja Bem-Vindo!</Text>

              {/* Nome Completo */}
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nome Completo"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* E-mail */}
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

              {/* Senha */}
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

              {/* Confirmar Senha */}
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Checkbox Termos de Uso */}
              <TouchableOpacity 
                style={styles.termsContainer}
                activeOpacity={0.8}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
              >
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms && <Feather name="check" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  Aceito os <Text style={styles.termsLink}>Termos de Uso</Text> e <Text style={styles.termsLink}>Política de Privacidade</Text>
                </Text>
              </TouchableOpacity>

              {/* Botão Criar minha conta */}
              <TouchableOpacity activeOpacity={0.9} style={styles.buttonShadow} onPress={handleRegister} disabled={carregando}>
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
                      <Feather name="user-plus" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.buttonText}>Criar minha conta</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.orText}>ou</Text>

              {/* Botão Já tenho uma conta */}
              <TouchableOpacity 
                style={styles.secondaryButton} 
                activeOpacity={0.8}
                onPress={onNavigateToLogin}
              >
                <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
                <Feather name="arrow-right" size={20} color="#00A3A0" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
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
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
  },
  termsLink: {
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
  orText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginVertical: 10,
    fontSize: 14,
  },
  secondaryButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#00A3A0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#00A3A0',
    fontSize: 15,
    fontWeight: '600',
  },
});