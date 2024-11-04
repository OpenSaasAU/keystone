/** @jsxRuntime classic */
/** @jsx jsx */
"use client"
import { Center, Inline, Heading, VisuallyHidden, jsx, useTheme } from '@keystone-ui/core'
import { PlusIcon } from '@keystone-ui/icons/icons/PlusIcon'
import { LoadingDots } from '@keystone-ui/loading'

import { PageContainer, HEADER_HEIGHT } from '../../../admin-ui/components/PageContainer'
import { Link, type LinkProps } from '../../../../admin-ui/router'
import type { ListMeta, VisibleLists } from '../../../types'
import type { KeystoneContext } from '@opensaas/keystone-core/types'

function ListCard ({
  listKey,
  count,
  hideCreate,
  list
}: {
  listKey: string
  hideCreate: boolean
  list: ListMeta
  count:
    | { type: 'success', count: number }
    | { type: 'no-access' }
    | { type: 'error', message: string }
    | { type: 'loading' }
}) {
  const { colors, palette, radii, spacing } = useTheme()
  return (
    <div css={{ position: 'relative' }}>
      <Link
        href={`/${list.path}${list.isSingleton ? '/1' : ''}`}
        css={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderRadius: radii.medium,
          borderWidth: 1,
          // boxShadow: shadow.s100,
          display: 'inline-block',
          minWidth: 280,
          padding: spacing.large,
          textDecoration: 'none',

          ':hover': {
            borderColor: palette.blue400,
          },
          ':hover h3': {
            textDecoration: 'underline',
          },
        }}
      >
        <h3 css={{ margin: `0 0 ${spacing.small}px 0` }}>{list.label} </h3>
        {list.isSingleton ? null : count.type === 'success' ? (
          <span css={{ color: colors.foreground, textDecoration: 'none' }}>
            {count.count} item{count.count !== 1 ? 's' : ''}
          </span>
        ) : count.type === 'error' ? (
          count.message
        ) : count.type === 'loading' ? (
          <LoadingDots label={`Loading count of ${list.plural}`} size="small" tone="passive" />
        ) : (
          'No access'
        )}
      </Link>
      {hideCreate === false && !list.isSingleton && (
        <CreateButton title={`Create ${list.singular}`} href={`/${list.path}/create`}>
          <PlusIcon size="large" />
          <VisuallyHidden>Create {list.singular}</VisuallyHidden>
        </CreateButton>
      )}
    </div>
  )
}

function CreateButton (props: LinkProps) {
  const theme = useTheme()
  return (
    <Link
      css={{
        alignItems: 'center',
        backgroundColor: theme.palette.neutral400,
        border: 0,
        borderRadius: theme.radii.xsmall,
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        height: 32,
        justifyContent: 'center',
        outline: 0,
        position: 'absolute',
        right: theme.spacing.large,
        top: theme.spacing.large,
        transition: 'background-color 80ms linear',
        width: 32,
        '&:hover, &:focus': {
          color: 'white',
          backgroundColor: theme.tones.positive.fill[0],
        },
      }}
      {...props}
    />
  )
}

export function HomePage ({lists, visibleLists} : {lists: {[list: string]: ListMeta}[], visibleLists: VisibleLists, context: KeystoneContext}) {

  return (
    <PageContainer header={<Heading type="h3">Dashboard</Heading>}>
    
        <Inline
          as="ul"
          gap="large"
          paddingY="xlarge"
          css={{
            paddingLeft: '0px',
            marginBottom: '0px',
          }}
        >
          {(() => {
            return Object.keys(lists).map(key => {
              return (
                <ListCard
                list={lists[key]}
                  count={
                    // data
                    //   ? result.errors
                    //     ? { type: 'error', message: result.errors[0].message }
                    //     : { type: 'success', count: data[key] }
                    //   : { type: 'loading' }
                    { type: 'success', count: 5 }
                  }
                  hideCreate={
                    // data?.keystone.adminMeta.lists.find((list: any) => list.key === key)
                    //   ?.hideCreate ?? false
                    false
                  }
                  key={key}
                  listKey={key}
                />
              )
            })
          })()}
        </Inline>
    </PageContainer>
  )
}
