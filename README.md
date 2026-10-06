# Pace — comunidade de corrida

Protótipo mobile em React Native + Expo para Android e iPhone. Nome provisório.

## Rodar

Use Node.js 24 e npm 11. Na pasta do projeto:

```sh
npm ci
npm start
```

Abra pelo Expo Go compatível com o SDK 57 ou por um development build. Em máquina local, o celular e o computador devem ter conectividade entre si. Neste ambiente na nuvem, a validação do Metro é interna; o QR de localhost não é acessível pelo celular. Não há APK/IPA ou publicação nas lojas nesta etapa.

```sh
npm run typecheck
npm test -- --runInBand
EXPO_NO_TELEMETRY=1 CI=1 npx expo export --platform android --platform ios --output-dir /tmp/pace-native-export
```

No ambiente restrito, use `npm_config_cache=/tmp/athlete-npm-cache` nos comandos de instalação e `EXPO_NO_TELEMETRY=1` para a CLI Expo.

## Funcional nesta demonstração

- Navegação entre comunidade, provas, atividade e perfil.
- Publicações de texto, curtidas, edição do perfil e contadores locais.
- Busca de provas por nome/cidade, filtros de rua/trilha e marcação de interesse.
- Estados vazios e bloqueio de publicação/perfil sem conteúdo.

Todos os atletas, eventos e treinos exibidos são fictícios. Os dados ficam apenas na memória e são perdidos ao reiniciar. A aplicação não tem autenticação nem servidor e não coleta localização.

## Próximas etapas

1. Autenticação e banco de dados, com controle de acesso por usuário.
2. Fotos e vídeos com armazenamento e moderação; comentários e seguidores.
3. Catálogo de provas com fontes verificadas.
4. GPS em dispositivo real, permissões, gravação e privacidade. Localização ao vivo somente por escolha explícita do atleta.
5. Strava via OAuth, com serviço backend e credenciais em configuração segura.
6. Builds assinados, testes em dispositivos Android/iOS e publicação nas lojas.

Não coloque credenciais no aplicativo ou em arquivos versionados.
