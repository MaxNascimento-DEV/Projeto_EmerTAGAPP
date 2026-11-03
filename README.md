# 🚑 EmerTag - Cuidado que chega antes

O **EmerTag** é um aplicativo que guarda as informações de saúde mais importantes de uma pessoa e as coloca ao alcance de quem presta socorro, em segundos, por meio de um **QR Code**.

Em uma emergência, quem socorre não sabe se a vítima tem alergia, toma algum remédio controlado ou tem uma condição de saúde que muda o atendimento. Com o EmerTag, basta **escanear o QR Code com a câmera do celular**. Não é preciso criar conta nem instalar nada.

> Status: 🟢 Concluido | Projeto acadêmico de Análise e Desenvolvimento de Sistemas | App: React Native (Expo) | Servidor: Java + Spring Boot

---

## 🎬 Demonstração

Veja o aplicativo funcionando, do cadastro ao convite de um cuidador (cerca de 3 minutos):

https://github.com/user-attachments/assets/48e5b6ff-9374-4fae-b7a4-10c83780d5ed

O que aparece no vídeo:

1. **Boas-vindas e cadastro** de uma nova conta.
2. **Dados da conta**: nome, e-mail e telefone.
3. **Cadastro do perfil de emergência**, em 4 passos: dados pessoais, saúde e necessidades específicas.
4. **Painel do perfil**: dados de saúde, contatos de emergência, QR Code e o perfil público (o que o socorrista enxerga).
5. **Convite de um cuidador** por e-mail, com permissões escolhidas pelo dono do perfil.
6. **Leitura do QR Code** pela câmera.

---

## 💡 O problema que resolvemos

| Situação hoje                                            | Com o EmerTag                                                     |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| Socorristas não conhecem o histórico de saúde da vítima  | As informações essenciais aparecem na tela do celular em segundos |
| Familiares demoram a ser avisados                        | Os contatos de emergência já estão no perfil                      |
| Dados médicos em papel se perdem ou ficam desatualizados | O perfil é digital e pode ser atualizado a qualquer momento       |
| Compartilhar dados de saúde gera medo de exposição       | A pessoa escolhe exatamente o que fica visível                    |

---

## 🧭 Como funciona

1. **Cadastro.** A pessoa cria uma conta e monta o perfil de emergência, o dela mesma ou o de alguém de quem cuida, como um pai, uma mãe ou um filho.
2. **Informações de saúde.** Ela registra alergias, condições de saúde, medicamentos, necessidades específicas (como dificuldade auditiva) e cuidados de biossegurança.
3. **QR Code.** O aplicativo gera um QR Code exclusivo do perfil, que pode ser impresso ou salvo no celular.
4. **Socorro.** Em uma emergência, quem socorre escaneia o QR Code e vê uma página com as informações liberadas pelo dono do perfil.
5. **Rede de cuidado.** Familiares e pessoas de confiança podem ser convidados para acompanhar ou ajudar a manter o perfil.

---

## ⭐ Funcionalidades em destaque

### Para quem tem o perfil

- **Perfil para si ou para outra pessoa:** uma mesma conta pode cuidar de vários perfis.
- **Privacidade sob controle:** o dono escolhe quais categorias de informação aparecem para o socorrista.
- **QR Code renovável:** se o QR Code for perdido ou compartilhado sem querer, dá para gerar outro. O antigo deixa de funcionar na hora.
- **Contatos de emergência:** pessoas que devem ser avisadas, sempre à mão.

### Para a rede de cuidado

- **Convite por e-mail:** o dono convida familiares e amigos, e cada um aceita ou recusa.
- **Permissões individuais:** o dono define se cada cuidador pode **ver as informações privadas** e se pode **editar o perfil**.

### Para quem socorre

- **Sem cadastro e sem aplicativo:** basta a câmera do celular.
- **Só o essencial:** a página mostra apenas o que o dono liberou.

### Acessibilidade

- Cada pessoa ajusta o **tamanho do texto** e o **alto contraste** do aplicativo.

---

## 🔒 Privacidade e segurança

Por lidar com dados de saúde, a proteção das informações é parte central do projeto:

- **Senhas protegidas:** são guardadas de forma criptografada. Nem a equipe consegue ler a senha de alguém.
- **Acesso por login:** só quem está autenticado altera ou consulta os dados do perfil.
- **QR Code imprevisível:** o código de cada perfil é aleatório, então ninguém consegue adivinhar o de outra pessoa.
- **Página pública enxuta:** o socorrista vê somente o que o dono liberou, e os dados internos do sistema não aparecem.
- **Permissões por pessoa:** apenas o dono, ou um cuidador autorizado por ele, pode editar o perfil.
- **Login sem pistas:** o aviso de erro não revela se um e-mail está ou não cadastrado.

---

## 🛠️ Tecnologias utilizadas

| O que usamos              | Para que serve                                     |
| ------------------------- | -------------------------------------------------- |
| **React Native com Expo** | Aplicativo para celular (Android e iOS)            |
| **Java 21 e Spring Boot** | Servidor que processa as regras do sistema         |
| **MySQL**                 | Banco de dados onde as informações ficam guardadas |
| **Flyway**                | Controle das alterações na estrutura do banco      |
| **Spring Security e JWT** | Login e proteção das informações                   |

---

## 🤝 Equipe

Projeto **EmerTag** desenvolvido para fins acadêmicos.

- Maxwell Cadete (back-End)
- Alinne Gabrielle (front-End)
- Marcelo Henrique (Banco de Dados + Documentação)
- Felipe José (Mobile)
- Giovanna Alencastro (Front-End + Elaboração do Projeto)
- Jose Nilton (Banco de Dados + Documentação)
- Carlos Henrique (Back-End)
- Maysa Gabrielle (Documentação)
- Heberth Igor (Documentação)
