/** @jsxRuntime classic */
/** @jsx jsx */
import { useEffect } from 'react'
import { jsx, Stack, useTheme } from '@keystone-ui/core'
import { Select } from '@keystone-ui/fields'
import { ChevronRightIcon, ChevronLeftIcon } from '@keystone-ui/icons'
import { Link, usePathname, useRouter, useSearchParams } from '../router'

type PaginationProps = {
  pageSize: number
  total: number
  currentPage: number
  singular: string
  plural: string
}

export function usePaginationParams ({ defaultPageSize }: { defaultPageSize: number }) {
   const searchParams = useSearchParams()
   const query = {}
   for (let [key, value] of searchParams.entries()) {
     query[key] = value
   }
  const currentPage = Math.max(
    typeof query.page === 'string' && !Number.isNaN(parseInt(query.page)) ? Number(query.page) : 1,
    1
  )
  const pageSize = typeof query.pageSize === 'string' && !Number.isNaN(parseInt(query.pageSize))
      ? parseInt(query.pageSize)
      : defaultPageSize
  return { currentPage, pageSize }
}

function getPaginationStats ({ singular, plural, pageSize, currentPage, total }: PaginationProps) {
  let stats = ''
  if (total > pageSize) {
    const start = pageSize * (currentPage - 1) + 1
    const end = Math.min(start + pageSize - 1, total)
    stats = `${start} - ${end} of ${total} ${plural}`
  } else {
    if (total > 1 && plural) {
      stats = `${total} ${plural}`
    } else if (total === 1 && singular) {
      stats = `${total} ${singular}`
    }
  }
  return { stats }
}

export function Pagination ({ currentPage, total, pageSize, singular, plural }: PaginationProps) {
  const { push } = useRouter()
  const searchParams = useSearchParams()  
  const pathname = usePathname()
   const query = {}
   for (let [key, value] of searchParams.entries()) {
     query[key] = value
   }
  const { stats } = getPaginationStats({ singular, plural, currentPage, total, pageSize })
  const { opacity } = useTheme()

  const nextPage = currentPage + 1
  const prevPage = currentPage - 1
  const minPage = 1

  const nxtQuery = { ...query, page: nextPage }
  const prevQuery = { ...query, page: prevPage }

  const limit = Math.ceil(total / pageSize)
  const pages = []

  useEffect(() => {
    // Check if the current page is larger than
    // the maximal page given the total and associated page size value.
    // (This could happen due to a deletion event, in which case we want to reroute the user to a previous page).
    if (currentPage > Math.ceil(total / pageSize)) {
      push({
        pathname,
        query: {
          ...query,
          page: Math.ceil(total / pageSize),
        },
      })
    }
  }, [total, pageSize, currentPage, pathname, query, push])

  // Don't render the pagination component if the pageSize is greater than the total number of items in the list.
  if (total <= pageSize) return null

  const onChange = (selectedOption: { value: string, label: string }) => {
    push({
      pathname,
      query: {
        ...query,
        page: selectedOption.value,
      },
    })
  }

  for (let page = minPage; page <= limit; page++) {
    pages.push({
      label: String(page),
      value: String(page),
    })
  }

  return (
    <Stack
      as="nav"
      role="navigation"
      aria-label="Pagination"
      paddingLeft="medium"
      paddingRight="medium"
      paddingTop="large"
      paddingBottom="large"
      across
      align="center"
      css={{
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Stack across gap="xxlarge" align="center">
        <span>{`${plural} per page: ${pageSize}`}</span>
        <span>
          <strong>{stats}</strong>
        </span>
      </Stack>

      <Stack gap="medium" across align="center">
        <Select
          width="medium"
          value={{ label: String(currentPage), value: String(currentPage) }}
          options={pages}
          styles={{
            valueContainer: provided => ({
              ...provided,
              paddingLeft: '12px',
              paddingRight: '16px',
            }),
          }}
          menuPortalTarget={document.body}
          onChange={onChange}
        />
        <span>of {limit}</span>
        <Link
          aria-label="Previous page"
          css={{
            color: '#415269',
            ...(prevPage < minPage && {
              pointerEvents: 'none',
              opacity: opacity.disabled,
            }),
          }}
          href={{ query: prevQuery }}
        >
          <ChevronLeftIcon />
        </Link>
        <Link
          aria-label="Next page"
          css={{
            color: '#415269',
            ...(nextPage > limit && {
              pointerEvents: 'none',
              opacity: opacity.disabled,
            }),
          }}
          href={{ query: nxtQuery }}
        >
          <ChevronRightIcon />
        </Link>
      </Stack>
    </Stack>
  )
}

export function PaginationLabel ({
  currentPage,
  pageSize,
  plural,
  singular,
  total,
}: PaginationProps) {
  const { stats } = getPaginationStats({
    plural,
    singular,
    currentPage,
    total,
    pageSize,
  })

  if (!total) {
    return <span>No {plural}</span>
  }

  return (
    <span>
      Showing <strong>{stats}</strong>
    </span>
  )
}
