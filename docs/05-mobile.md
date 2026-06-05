# 05 - Mobile

O app mobile foi iniciado em React Native com Expo, na pasta:

```text
mobile-app
```

## Nome

O nome correto no app e `IDsensor`.

## Identidade visual

- Topo/tela inicial com logo completo IDsensor.
- Icone do app com o simbolo `S` do IDsensor.
- Rodape com `Powered by IDvida`.
- Cards com a mesma linguagem visual do painel:
  - azul para normal;
  - laranja para atencao;
  - vermelho para critico ou sem comunicacao.

## Telas do MVP

### Ativacao

1. App abre.
2. Se nao estiver ativado, mostra campo de codigo.
3. Usuario digita codigo ou escaneia QR de ativacao.
4. App chama `/activate`.
5. App recebe `app_device_id`, cliente e unidade.

Codigo demo:

```text
APP-DEMO-11
```

### Inicio

Tela principal para apresentacao:

- nome do cliente;
- unidade/area;
- resumo de equipamentos;
- criticos agora;
- ultimos alertas;
- equipamentos fora do normal.

### Alertas

- Lista de alertas do aparelho vinculado.
- Detalhe do alerta.
- Botao `Estou ciente`.

### Escanear

- Abre camera para QR Code de equipamento.
- Permite digitar codigo manualmente.
- Renderiza o card atualizado do equipamento no mesmo visual do painel.

### Configuracoes

- Som dos alertas.
- Notificacoes.
- Atualizacao automatica a cada 60 segundos.
- Dados do aparelho vinculado.

## QR Code hibrido

O QR Code de equipamento deve funcionar de duas formas:

1. Pela camera normal do celular: abre uma pagina web publica do equipamento.
2. Dentro do app IDsensor: o app extrai o codigo e abre o card dentro do aplicativo.

Formato recomendado:

```text
https://id-sensor-mvp.onrender.com/q/DEV-GELADEIRA-02
```

O endpoint `/devices/by-code/:codigo` aceita tanto o codigo puro quanto o link completo.

## Card mobile

O app nao deve inventar outro card. Ele deve consumir o contrato retornado pelo backend e reproduzir:

- nome do dispositivo;
- local;
- temperatura;
- faixa permitida;
- status;
- comunicacao;
- bateria;
- umidade, quando houver;
- hierarquia visual e cores do painel.

## Rodar no celular

Instalar Expo Go no celular.

Na raiz do projeto:

```powershell
npm run mobile:start
```

Ou diretamente:

```powershell
cd mobile-app
corepack pnpm install --ignore-scripts
.\node_modules\.bin\expo.cmd start --tunnel
```

Escanear o QR Code exibido pelo Expo com o aplicativo Expo Go.
