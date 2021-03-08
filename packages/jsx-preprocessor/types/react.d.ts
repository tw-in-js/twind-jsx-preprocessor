import { Token } from 'twind'

declare global {
  namespace React {
    interface Attributes {
      tw?: Token
    }
  }
}
