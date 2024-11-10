import { CreateItemPage, ItemPage, ListPage, HomePage } from './client'
import React from 'react'

// TODO: this shuold come from config
function normaliseListName (route: string) {
  // urls are kebab-case and plural, lists are PascalCase and singular
    const pascalCase = route.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join('')
    const singular = pascalCase.slice(0, -1)
    return singular
}

export async function Page ({
  params,
}: {
  params: Promise<{ adminUI: string }>
}) {
  const { adminUI } = await params
  console.log('admin', adminUI)
  if (!adminUI) {
    return <HomePage />
  }
  const listKey = normaliseListName(adminUI[0])
  console.log('listKey', listKey)
  if (adminUI.length === 1) {
    return <ListPage listKey={normaliseListName(adminUI[0]) } />
  }
  if (adminUI[1] === 'create') {
    return <CreateItemPage listKey={normaliseListName(adminUI[0]) } />
  }
  return <ItemPage listKey={normaliseListName(adminUI[0]) } />
}