"use client"
import React, { type ReactNode, createContext, useContext } from 'react'
import { ToastProvider } from '@keystone-ui/toast'
import { DrawerProvider } from '@keystone-ui/modals'
import {
  type AdminConfig,
  type AdminMeta,
  type FieldViews
} from '../types'
import {
  type AuthenticatedItem,
  type CreateViewFieldModes,
  type VisibleLists,
} from './utils/useLazyMetadata'

type KeystoneContextType = {
  adminConfig: AdminConfig
  adminMeta: AdminMeta
  fieldViews: FieldViews
  authenticatedItem: AuthenticatedItem
  visibleLists: VisibleLists
  createViewFieldModes: CreateViewFieldModes
  apiPath: string
}

const KeystoneContext = createContext<KeystoneContextType | undefined>(undefined)

type KeystoneProviderProps = {
  children: ReactNode
  adminConfig: AdminConfig
  adminMeta: AdminMeta
  authenticatedItem: AuthenticatedItem
  visibleLists: VisibleLists
  createViewFieldModes: CreateViewFieldModes
  fieldViews: FieldViews
  apiPath: string
}

function InternalKeystoneProvider ({
  adminConfig,
  fieldViews,
  adminMeta,
  children,
  apiPath,
  authenticatedItem,
  visibleLists,
  createViewFieldModes,
}: KeystoneProviderProps) {

  return (
    <ToastProvider>
      <DrawerProvider>
        <KeystoneContext.Provider
          value={{
            adminConfig,
            adminMeta,
            fieldViews,
            authenticatedItem,
            visibleLists,
            createViewFieldModes,
            apiPath,
          }}
        >
          {children}
        </KeystoneContext.Provider>
      </DrawerProvider>
    </ToastProvider>
  )
}

export function KeystoneProvider (props: KeystoneProviderProps) {
  return (
      <InternalKeystoneProvider {...props} />
  )
}

export function useKeystone (): {
  adminConfig: AdminConfig
  adminMeta: AdminMeta
  authenticatedItem: AuthenticatedItem
  visibleLists: VisibleLists
  createViewFieldModes: CreateViewFieldModes
  apiPath: string
} {
  const value = useContext(KeystoneContext)
  if (!value) throw new Error('useKeystone must be called inside a KeystoneProvider component')

  return {
    adminConfig: value.adminConfig,
    adminMeta: value.adminMeta,
    authenticatedItem: value.authenticatedItem,
    visibleLists: value.visibleLists,
    createViewFieldModes: value.createViewFieldModes,
    apiPath: value.apiPath,
  }
}

export function useRawKeystone () {
  const value = useContext(KeystoneContext)
  if (value) return value
  throw new Error('useRawKeystone must be called inside a KeystoneProvider component')
}

export function useList (key: string) {
  const {
    adminMeta: { lists },
  } = useKeystone()
  if (key in lists) return lists[key]
  throw new Error(`Invalid list key provided to useList: ${key}`)
}
