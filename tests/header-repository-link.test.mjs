import assert from 'node:assert/strict'
import test from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { createServer } from 'vite'

globalThis.__i18next_supportNoticeShown = true

const repositoryUrl = 'https://github.com/zcs19960929/it-toolbox'

test('GitHub button opens the project repository', async t => {
  const vite = await createServer({
    appType: 'custom',
    optimizeDeps: { noDiscovery: true },
    server: { hmr: false, middlewareMode: true, ws: false },
  })
  t.after(() => vite.close())

  const { Header } = await vite.ssrLoadModule('/src/components/layout/Header.tsx')
  const rootRoute = createRootRoute({ component: Header })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  await router.load()
  const html = renderToStaticMarkup(React.createElement(RouterProvider, { router }))

  assert.match(html, new RegExp(`href="${repositoryUrl}"`))
})
