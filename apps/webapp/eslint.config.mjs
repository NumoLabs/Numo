// eslint-config-next 16 ships native flat configs. Wrapping them in
// FlatCompat (the eslint 8 -> 9 bridge, which is what this file used to do)
// crashes with "Converting circular structure to JSON".
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

export default [
	{
		ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**'],
	},
	...coreWebVitals,
	...typescript,
]
