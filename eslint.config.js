import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin-js'


export default [
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "@stylistic/js/padded-blocks": ["error", "never"],
    }
  },
    stylistic.configs["all-flat"]
];