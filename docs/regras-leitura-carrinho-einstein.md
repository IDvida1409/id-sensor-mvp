# Regras de leitura dos carrinhos - POC Einstein

Este documento descreve a regra operacional usada no painel de carrinhos de residuos do Hospital Einstein.

## Conceito principal

O painel trabalha com **ocupacao do carrinho**, de 0% a 100%.

- **0% ocupado**: carrinho livre.
- **25%, 50%, 75% ocupado**: faixas intermediarias para leitura visual.
- **100% ocupado**: carrinho cheio.
- O limite critico e configuravel por carrinho. Exemplo: se o limite critico for 50%, o painel considera critico quando a ocupacao validada chegar a 50% ou mais.

A distancia do sensor e medida em milimetros. Quanto **maior** a distancia lida, mais vazio esta o carrinho. Quanto **menor** a distancia lida, mais cheio esta o carrinho.

Exemplo com carrinho calibrado em 700 mm vazio:

- Leitura perto de 700 mm: 0% ocupado.
- Leitura no meio da faixa calibrada: perto de 50% ocupado.
- Leitura perto da distancia minima configurada: perto de 100% ocupado.

## Como o dado chega ao painel

O sensor MOKO mede a distancia e anuncia o dado por BLE. O gateway MOKO escuta o sensor e publica no MQTT/HiveMQ um pacote com a leitura recebida dentro do ciclo do gateway.

Na pratica, o backend recebe do MQTT um pacote com uma distancia do sensor. Essa distancia e chamada de **leitura bruta**, porque ainda nao foi confirmada pela regra operacional do painel.

O painel nao deve mudar o estado do carrinho por uma leitura isolada. Ele espera confirmacao.

## Regra de leitura oficial

Cada pacote MQTT recebido pelo backend conta como uma evidencia.

Para mudar o estado operacional do carrinho entre livre e critico:

1. O backend recebe uma leitura bruta.
2. Calcula a ocupacao real do carrinho.
3. Classifica a leitura como livre ou critica.
4. A mudanca so vira oficial depois de **2 leituras consecutivas** confirmando o mesmo estado.

Isso evita que uma oscilacao rapida do sensor mude o painel indevidamente.

## O que aparece no card do painel

No card do carrinho, o texto **Ultima leitura** significa:

> ultima leitura oficial validada pela regra do backend.

O card nao mostra mais duas informacoes separadas como "ultima comunicacao" e "ultima leitura valida", para nao confundir o operador.

A comunicacao bruta continua existindo internamente para auditoria, eventos e diagnostico, mas a informacao principal exibida ao cliente e a leitura validada.

## Faixas visuais de ocupacao

Para deixar a leitura simples para o cliente, o painel arredonda a ocupacao exibida para faixas:

- 0% a 12% vira **0%**.
- 13% a 37% vira **25%**.
- 38% a 62% vira **50%**.
- 63% a 87% vira **75%**.
- 88% a 100% vira **100%**.

Esse arredondamento e visual. A regra critica continua usando a ocupacao oficial calculada pelo backend.

## Margem de estabilidade

O sensor de distancia pode oscilar alguns milimetros. Por isso, pequenas variacoes perto do vazio sao tratadas como vazio.

A margem operacional padrao e:

- **50 mm**, ou
- **8% da faixa calibrada**,

considerando o maior dos dois quando aplicavel.

Exemplo: se o carrinho foi calibrado em 700 mm e uma leitura vem como 708 mm, isso nao deve virar um novo estado nem gerar alerta. Continua sendo tratado como carrinho livre.

## Obstrucao e sensor fora da posicao

Leituras tecnicas fora do comportamento esperado nao mudam o estado oficial imediatamente.

O backend exige **3 leituras consecutivas** para confirmar:

- possivel obstrucao;
- sensor fora da posicao;
- leitura fora da faixa calibrada.

Uma leitura isolada muito diferente fica como suspeita, mas nao deve derrubar a confianca do painel.

## Calibracao

Ao clicar em **Nova calibracao**, o painel nao usa leitura antiga.

Regra aplicada:

1. O painel mostra "Aguardando nova leitura do sensor".
2. A calibracao aceita somente leituras novas recebidas depois do clique.
3. As leituras precisam ter timestamps diferentes.
4. O painel coleta **2 leituras novas**.
5. As duas leituras precisam estar estaveis entre si.
6. A tolerancia de estabilidade e **50 mm ou 8% da media**, o que for maior.
7. Se as leituras forem estaveis, o painel sugere a media como nova calibracao.
8. Se as leituras forem muito diferentes, a calibracao e bloqueada e o operador deve tentar novamente com o sensor parado.

Como o gateway publica em ciclos, o painel aguarda ate 5 minutos para receber as leituras novas necessarias.

## Alertas

Os alertas devem ser gerados somente a partir de leituras oficiais ou eventos tecnicos confirmados.

Eventos principais:

- carrinho atingiu o limite critico;
- recorrencia de carrinho critico;
- troca de carrinho registrada;
- possivel obstrucao confirmada;
- sensor fora da posicao confirmado.

Os alertas sao vinculados ao cliente Einstein e nao devem aparecer em paineis de outros clientes.

## Troca de carrinho e transito

Existem duas logicas separadas:

1. **Troca de carrinho na sala atual**
   - A sala deve ter um carrinho ativo.
   - Se um carrinho critico para de ser lido e outro sensor diferente aparece com RSSI forte na mesma sala, o sistema entende que houve troca.

2. **Carrinho em transito**
   - Quando o carrinho sai da sala atual, futuramente ele podera passar por gateways nas salas de residuos e higienizacao.
   - Essa regra depende da leitura por gateway e RSSI, nao apenas de falta de comunicacao.

## Por que essa regra e adequada para o teste

Esta regra evita tres problemas comuns em sensor de distancia:

- trocar estado por uma leitura isolada;
- confundir comunicacao bruta com leitura validada;
- calibrar usando pacote antigo.

Para a POC de 20 a 30 dias, ela e simples, auditavel e forte o suficiente para explicar ao cliente como o painel decide se um carrinho esta livre, critico ou com leitura tecnica suspeita.
