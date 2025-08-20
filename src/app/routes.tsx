import { createBrowserRouter } from 'react-router-dom'

import FormPage from '../pages/FormPage'

export const routes = createBrowserRouter(
  [
    {
      path: '/',
      element: <FormPage />
    }
  ],
  {
    basename: '/recruitment-form'
  }
)
