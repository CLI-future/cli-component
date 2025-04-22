declare global {
  interface ApiResponse<D = unknown> {
    data: D
    message: string
    code: number
    errorData: unknown
  }
}

export {}
