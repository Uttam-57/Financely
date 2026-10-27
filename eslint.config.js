import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

import importX from "eslint-plugin-import-x";


export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    plugins: {
      "import-x": importX,
    },

    settings: {
      "import-x/resolver": {
        node: {
          extensions: [".js", ".jsx"],
        },
      },
    },

    rules: {
      "no-unused-vars": "warn",
      // flag if defult not exist 
      "import-x/default": "error",
      // flag if named not exist
      "import-x/named": "error",

      "import-x/no-unresolved": [
        "error",
        {
          ignore: ["^@/.*",],
        }
      ],
    },
  },
]);
