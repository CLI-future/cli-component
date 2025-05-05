declare global {
  interface ApiResponse<D = unknown> {
    data: D
    message: string
    code: number
    errorData: unknown
  }

  interface CliConfig {
    technicalConfig: any,
    clientConfig: any
  }
}

export {}
