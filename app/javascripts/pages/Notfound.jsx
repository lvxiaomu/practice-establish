import React from 'react'
import { Router, Route, Link } from 'react-router'
import Pure from 'react-addons-pure-render-mixin'

const NotFound = React.createClass({
  displayName: 'NotFound',
  mixins: [ Pure ],

  render () {
    const errorBackground = {
      backgroundColor: "#F2F3F3",
      position: "absolute",
      bottom: "0",
      textAlign: "center",
      height: "100%",
      width: "100%",
      display: "block",
      overflow: "hidden",
      padding: "0"
    }
    const errorImage = {
      height: "262px",
      backgroundRepeat: "no-repeat",
      width: "846px",
      margin: "15% auto auto auto"
    }
    const errorPara = {
      fontSize: '16px',
      marginTop: "2%"
    }

    return (
      <div style={errorBackground}>
        <div style={errorImage}>
        </div>
        <div style={errorPara}>
          <p>您访问的页面已失联，点击<a href="/login">返回</a>重新连线</p>
        </div>
      </div>

    )
  }
})

export default NotFound
