'use strict'

import Vue from 'vue'
import Component from 'vue-class-component'
import ElementUI from 'element-ui'

import {
  Configuration,
  Pattern,
  loadConfigFromBackground,
  saveConfigForBackground,
} from '../config'

import './App.scss'

// ----------------------------------------------------------------------------

@Component({
  template: require('./App.html'),
})
export default class AppComponent extends Vue {
  rules = {
    owner: [
      { required: true, message: '所有者は必ず指定してください。', trigger: 'change' },
    ]
  }

  config = Configuration.empty()
  pattern = Pattern.empty()
  patterns: Pattern.T[] = []

  async mounted() {
    this.config = await loadConfigFromBackground()
    this.patterns = this.config.exclude
  }

  submitForm(formName: string) {
    const form = <ElementUI.Form>this.$refs[formName]
    form.validate(async valid => {
      if (!valid) return false

      this.patterns.push(Object.assign({}, this.pattern))
      form.resetFields()

      await saveConfigForBackground(this.config)
      if (DEBUG) {
        console.log('saved', this.config)
      }
    })
  }

  handleDelete(index: number) {
    this.patterns.splice(index, 1)
  }
}
