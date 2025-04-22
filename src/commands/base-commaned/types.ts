export type CliAPI = {
  createSessionId: () => Promise<ApiResponse<string>>
}

export type CliOptions = {
  api: CliAPI
}