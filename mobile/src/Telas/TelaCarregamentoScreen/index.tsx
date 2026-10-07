import React, { useEffect, useRef } from 'react';
import { Animated, Image, StatusBar, StyleSheet, View } from 'react-native';

interface TelaCarregamentoProps {
  onFinish: () => void;
}

export default function TelaCarregamentoScreen({ onFinish }: TelaCarregamentoProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <Animated.View style={[styles.content, { opacity }]}>
        {/* CÍRCULOS + LOGO NO CENTRO */}
        <View style={styles.logoArea}>
          <Image
            source={require('../../../assets/group7.png')}
            style={styles.circles}
            resizeMode="contain"
          />
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* NOME + LEMA */}
        <Image
          source={require('../../../assets/group16.png')}
          style={styles.nameImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoArea: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circles: {
    position: 'absolute',
    width: 260,
    height: 260,
  },
  logo: {
    width: 150,
    height: 150,
  },
  nameImage: {
    width: 240,
    height: 80,
    marginTop: 8,
  },
});