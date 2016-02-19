import 'babel-polyfill'

//import '../sass/style.scss'

import React    from 'react'
import ReactDOM from 'react-dom'
import { ReduxRouter } from 'redux-router'
import { Provider } from 'react-redux'
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Theme from './enumeration/Theme'
import configureStore from './store/configureStore'
import Pure from 'react-addons-pure-render-mixin'
import injectTapEventPlugin from 'react-tap-event-plugin'


const root = document.querySelector('#root')

injectTapEventPlugin()
const store = configureStore()

class App extends React.Component {

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(Theme)
    }
  }

  //the app bar and button will receive our theme through
  //context and style accordingly
  render () {
    return (
      <Provider store={store}>
        <ReduxRouter />
      </Provider>
    );
  }
}
App.childContextTypes = {
  muiTheme: React.PropTypes.object
}

ReactDOM.render(<App/>, root)
