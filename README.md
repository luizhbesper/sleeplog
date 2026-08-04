# Sleeplog

App React Native onde um pai/mãe registra o sono do bebê e recebe uma análise semanal gerada por IA.

## Rodando

```bash
npm install
npm run ios      # ou: npm run android
```

A análise usa a API da Anthropic. Crie um `.env` com:

```
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
```

## Estrutura

```
src/
├── domain/         # tipos, schema zod, cálculo de duração e estatísticas
├── business/       # hooks de estado, cliente da API, prompt de análise
└── presentation/   # telas, componentes e design tokens
```

- **Log** — lista de registros (`FlatList`), estado vazio e bottom sheet de cadastro (`Modal` nativo + react-hook-form + zod).
- **Analysis** — dispara a análise ao focar a aba, com skeleton, resultado e erro com retry.

## Decisões

- **Estatísticas calculadas localmente**, não pela LLM. Maior/menor/média/horário médio são determinísticos — o modelo recebe os números prontos e só escreve o resumo e a dica, então nada é alucinado e os cards renderizam antes da resposta chegar.
- **Sem biblioteca de bottom sheet.** O `Modal` do próprio React Native resolve o padrão do wireframe.
- **Sem gerenciador de estado.** Context é suficiente para dois consumidores.
- **Estado em memória.** Persistência estava fora do escopo do exercício.
- **Chave de API no bundle** (marcada com um comentário `ponytail:` no código) — para um build de entrevista. Em produção iria para um proxy no backend.
