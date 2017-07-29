<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <div class="header-left">
          <h1><a href="https://github.com/vueact/babel-preset-transform-react-to-vue">babel-preset-transform-react-to-vue</a> REPL</h1>
          <h2>Built using <a href="https://github.com/egoist/poi">Poi</a> with almost zero-config, <a target="_blank" href="https://github.com/vueact/babel-preset-transform-react-to-vue/blob/master/repl">check out source code</a></h2>
        </div>

      </div>
    </header>
    <div class="editors">
      <div class="container">
        <textarea ref="input" class="input">{{ code }}</textarea>
        <div class="result">
          <pre class="code cm-s-default"><code v-html="result"></code></pre>
          <div class="error" v-show="error">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import highlight from 'cm-highlight'
  import CodeMirror from 'codemirror'
  import qs from 'querystring'

  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/mode/jsx/jsx'

  export default {
    name: 'JSXEditor',
    data() {
      const defaultValue = `
import ReactDOM from 'react-dom'
import React, { Component } from 'react'

class App extends Component {
  state = {
    hello: 'world'
  }
  myMethod = () => {
    this.setState({ hello: 'not world ;)' })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header" onClick={this.myMethod}>
          <h2>
            Hello {this.state.hello}
          </h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
  componentDidMount = () => console.log(this.state)
}

ReactDOM.render(<App />, document.getElementById('root'))
`.trim()
      const { input } = qs.parse(location.hash.substring(2))

      return {
        result: 'Loading...',
        error: '',
        code: input || defaultValue
      }
    },
    mounted() {
      this.editor = CodeMirror.fromTextArea(this.$refs.input, {
        mode: 'jsx',
        tabSize: 2,
        indentWithTabs: false,
        extraKeys: {
          Tab: cm => {
            cm.replaceSelection(' '.repeat(cm.getOption('tabSize')))
          }
        }
      })
      this.transform()
      this.editor.on('change', e => {
        this.code = e.getValue()
      })
    },
    watch: {
      code() {
        this.transform()
      },
      mode() {
        this.transform()
      }
    },
    methods: {
      async transform() {
        const code = this.code
        try {
          const [babel, react2vue] = await Promise.all([
            import('babel-standalone'),
            import('../src').then(v => v.default)
          ])

          const transformOptions = {
            presets: [react2vue]
          }
          const result = babel.transform(code, transformOptions)

          this.result = highlight(result.code, {
            mode: 'jsx'
          })

          this.updateURL({ input: code })
          this.error = null
        } catch (err) {
          this.error = err.message
        }
      },
      updateURL({ input }) {
        const query = qs.parse(location.hash.substring(2))
        if (input !== undefined) {
          query.input = input
        }
        location.hash = `#?${qs.stringify(query)}`
      }
    }
  }
</script>

<style src="codemirror/lib/codemirror.css"></style>
<style>
  html, body, #app, .CodeMirror {
    height: 100%;
  }
  body {
    margin: 0;
    font: 14px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Helvetica Neue,sans-serif;
  }
  * {
    box-sizing: border-box;
  }
  .container {
    max-width: 1080px;
    margin: 0 auto;
    height: 100%;
  }
  .header {
    height: 80px;
    background-color: #4fc08d;
    color: white;
    >.container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 {
      margin: 0;
      font-weight: 400;
      a {
        color: white;
      }
    }
    h2 {
      margin: 0;
      font-weight: 400;
      font-size: 14px;
      a {
        color: white;
      }
    }
    .header-right {
      display: flex;
      align-items: center;
    }
  }
  .editors {
    background-color: #f9f9f9;
    height: calc(100% - 80px);
    >.container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .CodeMirror, .result {
      width: 50%;
      padding: 10px;
      padding-right: 0;
      border-left: 1px solid #e2e2e2;
    }
  }
  .input {
    border: none;
    outline: none;
    resize: none;
    font-size: 1rem;
  }
  .result {
    position: relative;
    height: 100%;
    border-right: 1px solid #e2e2e2;
    background-color: white;
  }
  .code {
    margin: 0;
    height: 100%;
    word-wrap: normal;
    overflow: auto;
    line-height: 1.45;
    code {
      padding: 0;
      margin: 0;
      font-size: 100%;
      word-break: normal;
      white-space: pre;
      background: transparent;
      border: 0;
    }
  }
  .error {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: red;
    color: white;
    padding: 0;
    overflow: auto;
    padding: 10px;
    font-size: 16px;
    white-space: pre;
  }
</style>
