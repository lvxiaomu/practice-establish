import { createStore, applyMiddleware, compose } from 'redux'
import { reduxReactRouter } from 'redux-router'
import thunkMiddleware from 'redux-thunk'
import { createHistory } from 'history';
import createLogger from 'redux-logger'
import rootReducer from '../reducers'
import routes from '../routes'

const devTools = (createStore) => {
  if (process.env.NODE_ENV !== 'production' && window.devToolsExtension)
    return window.devToolsExtension()(createStore)
  else
    return createStore
}

const finalCreateStore = compose(
  reduxReactRouter({ createHistory, routes }),
  applyMiddleware(thunkMiddleware, createLogger()),
  devTools
)(createStore)


export default function configureStore(initialState) {

  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers/index')
      store.replaceReducer(nextReducer)
  })
  }

  return store
}
