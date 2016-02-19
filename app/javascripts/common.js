

import React from 'react'

export const wrapComponent = (Component, props) => React.createClass({
  render () {
    return React.createElement(Component, props);
  }
})

export const defaultMergeProps = (stateProps, dispatchProps, parentProps) => ({
  ...parentProps,
  ...stateProps,
...dispatchProps
});

function handleErrors(response) {
  if (response.ok === undefined) {
    throw  Error(response.msg)
  }
  return response
}

export function betterFetch (...arg) {
  const headers =
    {...arg[1].headers,'Content-Type': 'application/json','Cache-Control': "no-cache",'Pragma':'no-cache'}
  const argument1 = {...arg[1],headers: headers}
  const argument = [arg[0],argument1]
  return fetch(...argument)
.then((response)=>{
    if(!response.ok){
    response = response.json()
  }
  return response
})
.then(handleErrors)
}


export function createAsyncHandler(getHandlerAsync, displayName) {
  var Handler = null;

  return React.createClass({
    displayName: displayName,

    statics: {
      willTransitionTo(transition, params, query, callback) {
        getHandlerAsync().then(resolvedHandler => {
          Handler = resolvedHandler;

        if (!Handler.willTransitionTo) {
          return callback();
        }

        Handler.willTransitionTo(transition, params, query, callback);
        if (Handler.willTransitionTo.length < 4) {
          callback();
        }
      });
      },

      willTransitionFrom(transition, component, callback) {
        if (!Handler || !Handler.willTransitionFrom) {
          callback();
        }

        Handler.willTransitionFrom(transition, component, callback);
        if (Handler.willTransitionFrom.length < 3) {
          callback();
        }
      }
    },

    render() {
      return <Handler {...this.props} />;
    }
  });
}

