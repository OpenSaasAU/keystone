import { buildAdminUI } from '@opensaas/keystone-admin-ui'
import config from '../../../../keystone'
import { keystoneContext } from '../../../keystone/context'

const adminUI = buildAdminUI(config)

const pageWithKeystoneContext = (props) => adminUI.page(props, keystoneContext )

export default pageWithKeystoneContext

export const { generateStaticParams } = adminUI