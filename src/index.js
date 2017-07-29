import jsx from 'babel-plugin-syntax-jsx'
import classProperties from 'babel-plugin-syntax-class-properties'
import restSpread from 'babel-plugin-syntax-object-rest-spread'
import react2vue from 'babel-plugin-transform-react-to-vue'

export default {
  plugins: [
    jsx,
    classProperties,
    restSpread,
    react2vue
  ]
}
