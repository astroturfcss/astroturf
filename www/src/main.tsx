import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App';
import MDXComponents from './MDXContext';
import './index.css';
import Advanced from './pages/advanced.mdx';
import CrossFileDeps from './pages/cross-file-dependencies.mdx';
import Index from './pages/index';
import Introduction from './pages/introduction.mdx';
import Setup from './pages/setup.mdx';
import Tooling from './pages/tooling.mdx';

console.log(import.meta.env.BASE_URL);

const router = createBrowserRouter(
  [
    {
      path: '/',
      children: [
        { index: true, element: <Index /> },
        {
          element: <App />,
          children: [
            {
              path: 'introduction',
              element: <Introduction components={MDXComponents} />,
            },
            {
              path: 'cross-file-dependencies',
              element: <CrossFileDeps components={MDXComponents} />,
            },
            {
              path: 'setup',
              element: <Setup components={MDXComponents} />,
            },
            {
              path: 'tooling',
              element: <Tooling components={MDXComponents} />,
            },
            {
              path: 'advanced',
              element: <Advanced components={MDXComponents} />,
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
