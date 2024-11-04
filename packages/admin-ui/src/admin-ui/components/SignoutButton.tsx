/** @jsxRuntime classic */
/** @jsx jsx */
"use client"

import { jsx } from '@keystone-ui/core'
import { Button } from '@keystone-ui/button'
import { type ReactNode } from 'react'

function SignoutButton ({ children }: { children?: ReactNode }) {


  return (
    <Button size="small" isLoading={loading} onClick={() => endSession()}>
      {children || 'Sign out'}
    </Button>
  )
}
export { SignoutButton }
