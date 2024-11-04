import type { KeystoneConfig, KeystoneContext } from '@opensaas/keystone-core/types'
import { createSystem } from '@opensaas/keystone-core/lib'
import { HomePage } from './admin-ui/app/HomePage'
import type { AdminConfig, ListMeta } from './types'
import { getApp } from './admin-ui/app/App'
import React from 'react'


export function buildAdminUI (_config: KeystoneConfig) {
    const {config, lists} = createSystem(_config)
    return {
        page: async ({ params }: {
            params: Promise<{ adminUI?: string[] }>
          }, context: KeystoneContext) => {
            
            const App = getApp({
                adminConfig: {
                    components: {},
                },
                adminMeta: {
                    lists: {},
                },
                fieldViews: {},
                apiPath: '',
                authenticatedItem: {
                    state: 'unauthenticated'
                },
                visibleLists: {
                    state: 'loaded',
                    lists: new Set('User')
                },
                createViewFieldModes: {
                    state: 'loaded',
                    lists: {
                        User: {}
                    }
                },
            })
            const { adminUI } = await params
            if (!adminUI) {
                const listsMetadata: {
                    [list: string]: ListMeta
                }[] = []
                Object.values(lists).forEach(list => {
                    listsMetadata.push = {
                        key: list.key,
                        label: list.ui.labels.singular
                    }
                })
                return (
                <App>
                <HomePage lists={listsMetadata} />
                </App>
                )
            }
            return (
                <div>
                    <h1>Admin UI: {JSON.stringify(adminUI)}</h1>
                    <p>config: {JSON.stringify(config)}</p>
                    {/* <p>context: {JSON.stringify(context)}</p> */}
                    <p>thing: {JSON.stringify(thing)}</p>
                </div>
            )
        },
        generateStaticParams: async () => {
            const pages: {adminUI?: string[] }[] = [{ adminUI: undefined}]
            Object.values(lists).forEach(listKey => pages.push({ adminUI: [listKey.ui.labels.path] }, { adminUI: [listKey.ui.labels.path, 'create'] }))
            return pages
        }
    }
  
}