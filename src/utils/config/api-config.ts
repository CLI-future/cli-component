import { ErrorMessages } from '../messages/error.js'

export enum ApiEndpoints {
  CREATE_SESSION_ID = 'CREATE_SESSION_ID',
}

export const getApiUrl = (endpoint: ApiEndpoints): string => {

  const API_CONFIG = {
    BASE_URL: process.env.BASE_URL,
    ENDPOINTS: {
      [ApiEndpoints.CREATE_SESSION_ID]: process.env.CLI_API_CREATE_SESSION_ID,
    },
  } as const

  const baseUrl = API_CONFIG.BASE_URL
  const endpointPath = API_CONFIG.ENDPOINTS[endpoint]

  if (!baseUrl || !endpointPath) {
    throw new Error(ErrorMessages.MISSING_API_CONFIG)
  }

  return `${baseUrl}${endpointPath}`
}
