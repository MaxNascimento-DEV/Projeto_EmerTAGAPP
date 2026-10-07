import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LabelComAjudaProps {
  label: string;
  ajuda: string;
}

export default function LabelComAjuda({ label, ajuda }: LabelComAjudaProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => setVisivel(true)}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.helpText}>?</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visivel}
        animationType="fade"
        onRequestClose={() => setVisivel(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisivel(false)}>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>{label}</Text>
            <Text style={styles.boxText}>{ajuda}</Text>
            <Text style={styles.boxClose}>Toque para fechar</Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  helpButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  helpText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  box: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  boxText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  boxClose: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 14,
    textAlign: 'right',
  },
});