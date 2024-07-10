import { Prisma } from 'database';
import { ZodSchema, z } from 'zod';

export const SortDirectionEnum = Prisma.SortOrder;

export const sortDirection = z
  .enum([SortDirectionEnum.asc, SortDirectionEnum.desc])
  .optional();

export type SortDirection = z.infer<typeof sortDirection>;

export const pagedListInputSchema = z.object({
  pageSize: z.number().min(1).optional().default(10),
  page: z.number().min(0).optional().default(0),
});
export type PagedListInput = z.infer<typeof pagedListInputSchema>;

export const pagedListInputFactory = <
  TFilters,
  TOrderByKeys extends Parameters<typeof orderByInputFactory>[0],
>({
  filters,
  orderBy,
}: {
  filters: ZodSchema<TFilters>;
  orderBy: TOrderByKeys;
}) =>
  pagedListInputSchema.extend({
    filters,
    orderBy: orderByInputFactory<TOrderByKeys>(orderBy),
  });

export const orderByInputFactory = <TKeys extends string[]>(keys: TKeys) =>
  z
    .object(
      Object.fromEntries(keys.map((key) => [key, sortDirection])) as {
        [key in TKeys[number]]: typeof sortDirection;
      },
    )
    .partial()
    .optional();

export const pagedListOutputFactory = <TListItemSchema extends ZodSchema>(
  listItemSchema: TListItemSchema,
) => {
  return z.object({
    count: z.number(),
    items: z.array(listItemSchema),
  });
};
