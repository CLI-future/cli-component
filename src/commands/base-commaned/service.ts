import fetch from 'node-fetch'

import { ApiEndpoints, getApiUrl } from '../../utils/config/api-config.js'
import { ErrorMessages } from '../../utils/messages/error.js'
import { errorHandler } from '../../utils/errorHandler.js'

export const createSessionId = async (): Promise<ApiResponse<string>> => {
  try {
    const url = getApiUrl(ApiEndpoints.CREATE_SESSION_ID)
    const response = await fetch(url)

    if (!response.ok) {
      errorHandler(`HTTP error! status: ${response.status.toString()}`)
    }

    return (await response.json()) as ApiResponse<string>
  } catch (err) {
    return {
      data: '',
      message: ErrorMessages.SESSION_ID_GENERATION_FAILED,
      code: 500,
      errorData: err,
    }
  }
}
