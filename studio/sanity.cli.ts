/**
 * Configuração da linha de comando (`sanity deploy`, `sanity build`).
 *
 * Em `.ts` de propósito: o `package.json` daqui é `"type": "module"`, e nesse
 * modo o carregador de config do CLI não consegue ler um `sanity.cli.js` — ele
 * não desembrulha o `export default` do ESM e reclama de `projectId` faltando.
 * O CLI compila `.ts` nativamente, sem tsconfig, e aí lê certo.
 */
export default {
  api: {
    projectId: 'mcpf4hd5',
    dataset: 'production',
  },
}
