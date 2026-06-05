# 01 - Conceito

O ID Sensor e um MVP para demonstrar uma camada mobile de alertas de sensores IoT.

Hoje o fluxo real depende de SMS e e-mail em muitos cenarios. O MVP testa uma alternativa: enviar primeiro uma notificacao push para o aplicativo, permitir que o responsavel confirme ciencia e registrar esse aceite.

## Objetivo da demonstracao

No dia 11, a demonstracao precisa provar que:

- um celular real pode ser ativado;
- um alerta pode ser disparado a partir de um backend online;
- o celular recebe push notification;
- o usuario abre o alerta e toca em `Estou ciente`;
- o aceite fica registrado no backend e aparece no painel, quando essa integracao for implementada;
- um QR Code de dispositivo permite que o app exiba o card daquele dispositivo dentro do aplicativo;
- o card mobile preserva a identidade visual e o conteudo principal do card do painel.

## Papel do painel HTML existente

O painel existente e uma referencia visual e funcional. Ele foi feito como demonstracao HTML/CSS/JS, com dados mockados no proprio codigo. Por isso, ao atualizar a pagina, parte do estado volta para o inicial.

Neste MVP, o painel original nao sera tratado como backend oficial. Ele servira como referencia para:

- estrutura visual dos cards;
- cores por status;
- campos exibidos;
- hierarquia visual;
- comportamento esperado do QR Code, sempre lido dentro do app e sem abrir site externo.

## Regra estrategica

O app deve reduzir o uso de SMS/e-mail. No desenho futuro:

1. alerta entra no sistema;
2. primeiro envio vai para o app ID Sensor;
3. se alguem confirmar ciencia no app, SMS/e-mail podem ser evitados;
4. se ninguem confirmar em X minutos, o sistema oficial pode escalar para SMS/e-mail.

O MVP nao implementa SMS/e-mail.
