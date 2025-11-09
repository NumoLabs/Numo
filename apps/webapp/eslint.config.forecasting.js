// ESLint configuration for vault forecasting feature
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Allow unused vars in development
    '@typescript-eslint/no-unused-vars': 'warn',
    // Allow any types in existing code but warn for new code
    '@typescript-eslint/no-explicit-any': 'warn',
    // Allow unescaped entities in existing code
    'react/no-unescaped-entities': 'warn',
    // Allow missing dependencies in useEffect
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['features/vault-forecasting/**/*'],
      rules: {
        // Strict rules for the new feature
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'react/no-unescaped-entities': 'error',
        'react-hooks/exhaustive-deps': 'error',
      },
    },
  ],
};
