'use strict'

import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
const locale = require('element-ui/lib/locale/lang/ja')

import App from './App'

// ----------------------------------------------------------------------------

Vue.use(ElementUI, { locale })

new Vue({
  el: '#app',
  render: h => h(App),
})

