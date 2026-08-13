import neostandard from 'neostandard'

export default neostandard({
  files: ['src/**/*.js', 'src/**/*.vue'],
  ignores: ['dist/**/*', 'tests/**', 'node_modules/*'],
  rules: {
    eqeqeq: true
  }
})
