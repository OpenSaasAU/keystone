'use client'

export { HomePage } from './app/admin-ui/pages/HomePage'
import { getCreateItemPage } from './app/admin-ui/pages/CreateItemPage'
import { getItemPage } from './app/admin-ui/pages/ItemPage'
import { getListPage } from './app/admin-ui/pages/ListPage'
import React from 'react'


export function ItemPage ({ listKey }: { listKey: string }) {
    const ItemPage = getItemPage({ listKey })
  return <ItemPage />
}

export function CreateItemPage ({ listKey }: { listKey: string }) {
    const CreateItemPage = getCreateItemPage({ listKey })
  return <CreateItemPage />
}

export function ListPage ({ listKey }: { listKey: string }) {
    const ListPage = getListPage({ listKey })
  return <ListPage />
}
