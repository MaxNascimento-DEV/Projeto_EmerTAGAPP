import * as ImagePicker from 'expo-image-picker';
import { api, mensagemErro } from './api';
import { avisar } from './avisos';

// Abre a galeria, deixa recortar em quadrado e envia ao backend.
// Devolve o caminho salvo (para gravar em fotoUrl) ou null se o usuário cancelar / der erro.
export async function escolherEEnviarFoto(): Promise<string | null> {
  const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissao.granted) {
    avisar('Permissão necessária', 'Libere o acesso às fotos nas configurações do celular.');
    return null;
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true, // a foto vai para o backend em base64 (ver api.fotos.enviar)
  });
  if (resultado.canceled || !resultado.assets?.length) return null;

  const foto = resultado.assets[0];
  if (!foto.base64) {
    avisar('Não foi possível ler a foto selecionada.');
    return null;
  }
  try {
    // Com recorte e compressão o picker devolve JPEG; usa o tipo informado se houver
    return await api.fotos.enviar(foto.base64, foto.mimeType ?? 'image/jpeg');
  } catch (e) {
    avisar('Não foi possível enviar a foto', mensagemErro(e));
    return null;
  }
}
