import { list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { checkbox, relationship, text, timestamp } from '@opensaas/keystone-core/fields'
import { select } from '@opensaas/keystone-core/fields'

export const lists = {
  Task: list({
    access: allowAll,
    fields: {
      label: text({ validation: { isRequired: true } }),
      priority: select({
        type: 'enum',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      }),
      isComplete: checkbox(),
      assignedTo: relationship({ ref: 'Person.tasks', many: false }),
      finishBy: timestamp(),
    },
  }),
  Person: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      tasks: relationship({ ref: 'Task.assignedTo', many: true }),
    },
  }),
  SecretPlan: list({
    access: allowAll,
    fields: {
      label: text(),
      description: text(),
    },
    ui: {
      isHidden: true,
    },
  }),
}
