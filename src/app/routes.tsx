import { createBrowserRouter } from 'react-router-dom'

import CounterPage from '../pages/CounterPage'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <CounterPage />
  }
])
