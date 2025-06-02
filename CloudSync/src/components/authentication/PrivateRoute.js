 //src/components/authentication/PrivateRoute.js

import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export default function PrivateRoute({ component: Component, render, ...rest }) {
  const { currentUser } = useAuth()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
          return <Redirect to="/login" />
        }

        
        if (render) {
          return render(props)
        } else if (Component) {
          return <Component {...props} />
        } else {
          return null
        }
      }}
    />
  )
}
