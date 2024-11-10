import React from 'react'
import { NavItem, ListNavItems, NavigationContainer } from '@opensaas/keystone-admin-ui/admin-ui/components'
import type { NavigationProps } from '@opensaas/keystone-admin-ui/admin-ui/components'

export function CustomNavigation ({ lists, authenticatedItem }: NavigationProps) {
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <NavItem href="/">Dashboard</NavItem>
      <ListNavItems lists={lists} />
      <NavItem href="/custom-page">Custom Page</NavItem>
    </NavigationContainer>
  )
}
