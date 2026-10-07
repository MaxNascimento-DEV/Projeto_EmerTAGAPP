import React from 'react';
import { ActivityIndicator, Image, ImageStyle, StyleProp, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { urlFoto } from '../../services/api';

interface AvatarProps {
  fotoUrl?: string | null;
  style: StyleProp<ImageStyle>;
  tamanhoIcone?: number;
  corIcone?: string;
  // Se informado, o avatar vira um botão para trocar a foto (mostra uma faixa com câmera)
  onPress?: () => void;
  enviando?: boolean;
}

// Mostra a foto vinda da API ou, sem foto, um ícone de usuário no mesmo espaço
export default function Avatar({ fotoUrl, style, tamanhoIcone = 56, corIcone = '#FFFFFF', onPress, enviando = false }: AvatarProps) {
  const uri = urlFoto(fotoUrl);

  const conteudo = enviando ? (
    <View style={[style as object, { alignItems: 'center', justifyContent: 'center' }]}>
      <ActivityIndicator color="#2563EB" />
    </View>
  ) : uri ? (
    <Image source={{ uri }} style={style} />
  ) : (
    <View style={[style as object, { alignItems: 'center', justifyContent: 'center' }]}>
      <Feather name="user" size={tamanhoIcone} color={corIcone} />
    </View>
  );

  if (!onPress) return conteudo;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={enviando}>
      {conteudo}
      {/* Faixa na base: fica dentro do círculo mesmo com overflow hidden no contêiner */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28%',
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name="camera" size={16} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
}
