import {
  type BaseListTypeInfo,
  fieldType,
  type FieldTypeFunc,
  type CommonFieldConfig,
  orderDirectionEnum,
} from '@opensaas/keystone-core/types'
import { graphql } from '@opensaas/keystone-core'

type TextFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
  isIndexed?: boolean | 'unique'
}

export function text<ListTypeInfo extends BaseListTypeInfo> ({
  isIndexed,
  ...config
}: TextFieldConfig<ListTypeInfo> = {}): FieldTypeFunc<ListTypeInfo> {
  return meta =>
    fieldType({
      kind: 'scalar',
      mode: 'optional',
      scalar: 'String',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
    })({
      ...config,
      input: {
        create: {
          arg: graphql.arg({ type: graphql.String }),
          resolve (value, context) {
            return value
          },
        },
        update: { arg: graphql.arg({ type: graphql.String }) },
        orderBy: { arg: graphql.arg({ type: orderDirectionEnum }) },
      },
      output: graphql.field({
        type: graphql.String,
        resolve ({ value, item }, args, context, info) {
          return value
        },
      }),
      views: './1-text-field/views',
      getAdminMeta () {
        return {}
      },
    })
}
