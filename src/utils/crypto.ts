import crypto from 'crypto'

export const generateClientId = () => {
  return crypto.randomUUID()
}