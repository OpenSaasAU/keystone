"use client"

import { Core as RawCore } from '@keystone-ui/core'

export const Core = ({children}) => {
  return (
    <RawCore>
        {children}
    </RawCore>
  )
}