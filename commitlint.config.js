// The root package is ESM ("type": "module"), so this file must use `export
// default`. With `module.exports` commitlint fails to load the config entirely.
export default {
	extends: ['@commitlint/config-conventional'],
}
