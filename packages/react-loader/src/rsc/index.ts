import {
  createQueryStore as createCoreQueryStore,
  type CreateQueryStoreOptions,
} from '@sanity/core-loader'

import { defineUseLiveMode } from '../defineUseLiveMode'
import { defineUseQuery } from '../defineUseQuery'
import type { QueryStore, UseLiveModeHook } from './types'

export type * from './types'

export const createQueryStore = (
  options: CreateQueryStoreOptions,
): QueryStore => {
  const { createFetcherStore, enableLiveMode } = createCoreQueryStore({
    tag: 'react-loader.rsc',
    ...options,
  })
  const useQuery = defineUseQuery({ createFetcherStore })

  const useLiveMode: UseLiveModeHook = defineUseLiveMode({ enableLiveMode })

  const loadQuery: QueryStore['loadQuery'] = () => {
    throw new Error('The `loadQuery` function is server only.')
  }

  const setServerClient: QueryStore['setServerClient'] = () => {
    throw new Error('The `setServerClient` function is server only.')
  }

  return {
    loadQuery,
    // @ts-expect-error - update typings
    useQuery,
    setServerClient,
    useLiveMode,
  }
}

export * from '../useEncodeDataAttribute'

/**
 * Shortcut setup for the main SSR use-case.
 * @public
 */
export const { loadQuery, setServerClient, useLiveMode, useQuery } =
  createQueryStore({
    client: false,
    ssr: true,
  })
