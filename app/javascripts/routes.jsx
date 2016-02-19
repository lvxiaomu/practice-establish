import React from 'react'
import { Route, IndexRedirect, IndexRoute, Router } from 'react-router'
import { createAsyncHandler ,wrapComponent } from './common'
import NotFound from './pages/Notfound.jsx'
const defaultQuery = { pageNumber: 1 }
const defaultProject = (nextState, redirectTo) => {
  const {
    location: {
      pathname,
      query: {
        pageNumber
        }
      }
    } = nextState
  if (!(pageNumber > 0)) {
    redirectTo(nextState, pathname, defaultQuery)
  }
}


const title = (title) => React.createClass({
  render () {
    return <span>{title}</span>
  }
})


export default (
  <Router >
    <Route path="/" component={NotFound}/>
  </Router>
)
