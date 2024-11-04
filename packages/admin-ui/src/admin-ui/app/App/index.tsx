import React from 'react'
import { type AppProps } from 'next/app'
import type { AdminMeta, AuthenticatedItem, CreateViewFieldModes, VisibleLists, AdminConfig, FieldViews } from '../../../types'
import { ErrorBoundary } from '../../../../admin-ui/components'
import { KeystoneProvider } from '../../../../admin-ui/context'
import { Core } from './core'

type AppConfig = {
  adminConfig: AdminConfig
  adminMeta: AdminMeta
  authenticatedItem: AuthenticatedItem
  visibleLists: VisibleLists
  createViewFieldModes: CreateViewFieldModes
  fieldViews: FieldViews
  apiPath: string
}

export const getApp =
  (props: AppConfig) =>
  ({ Component, pageProps }: AppProps) => {
    return (
      <Core>
        <KeystoneProvider {...props}>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </KeystoneProvider>
      </Core>
    )
  }
