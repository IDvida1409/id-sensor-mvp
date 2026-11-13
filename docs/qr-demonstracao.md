# Consulta por QR na demonstração comercial

Este fluxo usa o painel existente e temperaturas simuladas. Não cadastra sensores físicos, não recebe telemetria real e não envia SMS/e-mails. A demonstração de troca não altera a temperatura-base dos 24 equipamentos.

No painel, o botão **QR da demonstração** abre `/consulta/demo.html`. Escolha o equipamento e abra ou baixe sua etiqueta. A leitura do QR leva a `/q/DE:00:00:00:00:01` (MAC fictício do dispositivo correspondente ao card escolhido).

A consulta usa o visual aprovado e oferece Temperatura, Certificado, Trocar dispositivo e Ajuda. Os valores são carregados do backend do painel; não há números fixos substituindo o resultado da API na página.

## Roteiro de apresentação

1. Abra a consulta pelo QR do equipamento.
2. Confira o card e o certificado de exemplo do painel.
3. Toque em Trocar dispositivo e digite **12345678**.
4. Escaneie um dos três QR Codes de dispositivos novos em `/consulta/demo.html`, ou digite `DEMO-NOVO-01`, `DEMO-NOVO-02` ou `DEMO-NOVO-03`.
5. O sistema exibe imagem pequena, MAC, data da calibração e fabricante. Fabricantes não confirmados estão identificados como exemplos demonstrativos.
6. Modelos com cabo oferecem a escolha entre substituir o conjunto ou manter o cabo. O modelo sem cabo vai diretamente à confirmação.
7. Ao escolher trocar o conjunto, o aviso aparece à frente antes de efetivar a troca.
8. Depois da confirmação, o mesmo equipamento permanece na mesma área, com o MAC e o documento demonstrativo do dispositivo novo.
9. A temperatura é simulada acima da faixa e converge gradualmente para dentro dela, para mostrar a estabilização ao cliente. O modo termina ao entrar na faixa; não há prazo fixo de 60 minutos.
10. Os alertas de temperatura são omitidos no card/NOC durante a estabilização, mantendo a condição de falta de comunicação. O relatório demonstrativo pode ser baixado após a troca.

Use Reiniciar troca demonstrativa na página de QR para repetir a apresentação. Isso apaga somente o estado da troca demonstrativa daquele equipamento. Não apaga cadastros nem histórico de outros módulos.

## QR enviado como referência

Não foi possível extrair um endereço da imagem enviada. O gerador recria o estilo pontilhado, os detalhes azuis e a marca central com um conteúdo diferente e legível para cada equipamento. O QR gerado foi decodificado em teste; os centros dos pontos azuis foram extraídos da referência e são desenhados como círculos vetoriais junto dos pontos pretos. Não há imagem colada, máscara ou pontos cortados. A matriz é gerada novamente para codificar o endereço público e o MAC.

As etiquetas recebem a origem da página onde são abertas. Para escanear com outro aparelho, a demonstração precisa estar publicada em um endereço acessível por esse aparelho. A câmera dentro da página exige HTTPS, exceto em localhost, e permissão do navegador. Também existe entrada manual de código.

## Arquivos e testes

- `backend/src/services/qrDemo.js`: catálogo e estado exclusivamente demonstrativos.
- `backend/src/qrDemoRoutes.js`: consulta, troca, QR e relatório demonstrativos.
- `painel-original/consulta/`: interface integrada ao painel, leitor local de QR e imagens.
- `painel-original/qr-panel.js`: entrada no painel existente.
- `backend/src/scripts/test-qr-demo.js`: testes de API, decodificação do QR e fluxo no navegador com banco temporário.

As três ilustrações foram recriadas a partir das fotos fornecidas usando a geração de imagens integrada. O visor do primeiro modelo permanece sem leitura de temperatura. As versões PNG originais continuam na pasta de imagens geradas do chat; as versões WebP usadas pela demonstração estão em `painel-original/consulta/assets`.

## Fichas de informações do dispositivo

- `/dispositivo/DE:10:00:00:00:01`: MST01 Pt100 novo (−200 °C a +200 °C), recebido no cliente em 10/11/2026, sem uso anterior.
- `/dispositivo/DE:00:00:00:00:01`: MST01 em uso (−40 °C a +125 °C), com áreas anteriores ilustrativas e o vínculo atual carregado do painel.

As fichas mostram imagem, fabricante, modelo, MAC, recebimento, condição de uso, calibração e certificado do próprio MAC. As datas de recebimento e passagens anteriores são exemplos comerciais, não um cadastro real do hospital. Não há histórico de certificados.

As fotos dos dois modelos foram recriadas com a ferramenta integrada de geração de imagens e aprovadas pelo usuário antes da aplicação. O MST01 Pt100 (novo) usa cabo metálico e probe Pt100 da referência aprovada, com faixa de −200 °C a +200 °C. O MST01 em uso usa cabo preto e a probe da referência aprovada, com faixa de −40 °C a +125 °C. Cada perfil mantém a própria foto, modelo e faixa; não se aplica a especificação Pt100 ao outro dispositivo. Na interface, os estados são Novo, Em uso ou Disponível.

Referências confirmadas: https://www.minew.com/product/mst01-pt100-temperature-sensor/ e https://www.minew.com/product/mst01-industrial-temperature-and-humidity-sensor/ .

O QR `/q/:mac` de um sensor de exemplo sem vínculo abre a ficha; quando ele está vinculado, abre a temperatura. A consulta de temperatura inclui um link para as informações. As fichas são de leitura; o fluxo de troca continua exigindo 12345678 e a confirmação do cabo.
