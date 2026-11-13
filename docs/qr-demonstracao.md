# Demonstração QR — três dispositivos

Esta apresentação usa o painel existente e temperaturas simuladas. Não provisiona hardware nem envia SMS ou e-mails.

| Papel | Modelo | MAC demonstrativo | Faixa de medição | Condição inicial |
| --- | --- | --- | --- | --- |
| Atual, instalado na Geladeira 01 | S1 | DE:00:00:00:00:01 | −20 °C a +60 °C | Em uso, sensor integrado sem probe externa |
| Opção de substituição com histórico | MST01 | DE:10:00:00:00:02 | −40 °C a +125 °C | Disponível, com passagens anteriores ilustrativas |
| Opção de substituição nova | MST01 Pt100 | DE:10:00:00:00:01 | −200 °C a +200 °C | Novo, sem registros de instalação |

As três fotos foram recriadas com a geração de imagens integrada e aprovadas pelo usuário antes da aplicação. Os visores dos MST01 permanecem sem temperatura. O S1 não possui visor nem cabo externo na representação aprovada.

## Consulta

A página /consulta/demo.html reúne as três etiquetas. Cada QR contém /q/:mac, no endereço público do painel, com o MAC escrito abaixo. O desenho usa pontos pretos e azuis vetoriais inteiros, sem imagem colada ou pontos recortados.

O S1 instalado abre o card de temperatura, com o mesmo valor do painel e o menu. O ícone de informações ao lado de Consulta pelo QR abre a ficha do MAC atual. Os dispositivos disponíveis abrem a ficha individual, também com menu. Uma página reutilizável carrega os dados por MAC; não há alternância de dispositivo dentro da ficha.

O título técnico é Faixa de medição. A descrição distingue o sensor integrado do S1 e as probes externas dos MST01. Faixa de medição e faixa de alarme da geladeira são informações distintas.

As datas de recebimento e as áreas anteriores são ilustrativas. O MST01 com histórico mostra Farmácia central e Laboratório de análises; o Pt100 novo não contém registros anteriores. Ao vincular uma das opções, a ficha passa a mostrar o uso atual no equipamento.

## Troca

1. Abra o QR do S1 instalado na geladeira.
2. Toque em Trocar dispositivo e use a chave de teste 12345678.
3. Escaneie o MST01 com histórico ou o MST01 Pt100 novo. Também é possível digitar o MAC, DEMO-USADO-01 ou DEMO-NOVO-01.
4. A câmera abre como diálogo modal, com enquadramento, zoom, leitura nativa quando disponível e jsQR em várias escalas como alternativa. A leitura continua após um QR não reconhecido.
5. Para os modelos com cabo, escolha trocar somente o dispositivo ou trocar dispositivo e cabo/probe. A escolha é obrigatória antes de continuar.
6. A troca completa abre o aviso aprovado em um diálogo na frente da tela. Somente a confirmação efetiva a substituição.
7. O equipamento mantém nome e área. Os dois cards compartilham a mesma amostra simulada e mostram Temperatura em estabilização — troca de dispositivo durante a estabilização.
8. As ocorrências fora de faixa são justificadas como Troca de dispositivo — em estabilização; alertas de temperatura são suprimidos, preservando a falta de comunicação. O modo termina quando a leitura entra na faixa, sem prazo de expiração fixo.
9. Após a estabilização, a leitura volta à fonte do equipamento. Manter a probe preserva a leitura do painel, sem impor um valor médio fixo.

O botão Reiniciar demonstração apaga somente o estado da troca demonstrativa da Geladeira 01 e restaura os três papéis iniciais.

## Calibração e ajuda

Datas, MAC e estado do certificado acompanham o dispositivo consultado, com as cores de vencimento do painel. Por autorização do usuário, os três abrem o mesmo PDF de exemplo já existente: painel-original/certificado-geladeira-1.pdf. Não há histórico de certificados.

O convite Alguma dúvida? aparece e desaparece; a cabeça do mascote fica dentro do botão. O acesso Ajuda continua fixo no menu.

## Fontes confirmadas

- S1: https://www.minew.com/pt/product/s1-ble-temperature-and-humidity-sensor/
- MST01: https://www.minew.com/product/mst01-industrial-temperature-and-humidity-sensor/
- MST01 Pt100: https://www.minew.com/product/mst01-pt100-temperature-sensor/

## Validação

backend/src/scripts/test-qr-demo.js verifica os três perfis, os dois caminhos de substituição, a escolha da probe, o aviso, o PDF, os dois cards e a decodificação das etiquetas.
backend/src/scripts/test-qr-camera.js verifica a câmera com vídeo simulado das etiquetas, permissão, fechamento, zoom, recuperação após erro e liberação das trilhas de vídeo. A leitura do QR não efetiva a troca sem confirmação.

## Ajustes visuais aprovados

Os menus das fichas usam os mesmos desenhos do primeiro modelo: termômetro, selo neutro de certificado, leitura QR e cabeça do mascote. Por enquanto, as dúvidas são as mesmas da consulta de temperatura. O rodapé usa o logo IDVIDA enviado pelo usuário, com 44 px de largura e altura proporcional, ao lado de Powered by. O acesso à página do fabricante foi removido da interface; o fabricante permanece como dado do dispositivo.
