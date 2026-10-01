import { useState } from 'react'
import { RouterProvider} from 'react-router'
import {AuthProvider} from './features/auth/auth.context.jsx'

import {router} from './app.routes.jsx'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App 
