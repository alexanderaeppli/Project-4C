const mix = require('laravel-mix')
const normalize = require.resolve('normalize.css')

mix.ts('src/App.vue', '/dist/js').vue()
// .sass('ressources/styles/client.scss', 'dist/styles')
