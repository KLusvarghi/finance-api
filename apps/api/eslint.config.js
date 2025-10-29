import nodeConfig from '@finance-app/eslint-config/node.js'

export default [
    // Herda a configuração base do monorepo para Node.js
    // que já inclui as regras de sort e unused-imports.
    ...nodeConfig,

    // Adiciona regras específicas para este projeto (api)
    {
        rules: {
          // Proíbe imports diretos de subdiretórios específicos, forçando uso do barrel
          'no-restricted-imports': [
              'error',
              {
                  patterns: [
                      {
                          group: [
                              '@/shared/*',
                              '@/errors/*',
                              '@/repositories/postgres/*',
                              '@/factories/controllers/*',
                              '@/services/*',
                              '@/controllers/_helpers/*',
                              '@/controllers/*',
                              '@/schemas/*',
                              '@/test/*',
                              '@/adapters/*',
                              '@/routes/*',
                          ],
                          message:
                              'Use o barrel em vez de importar diretamente de subdiretórios específicos.',
                      },
                  ],
              },
          ],
        },
    },

    
]
