import { type AdminConfig } from '@opensaas/keystone-core/types'

import { CustomNavigation } from './components/CustomNavigation'
export const components: AdminConfig['components'] = {
  Navigation: CustomNavigation,
}
