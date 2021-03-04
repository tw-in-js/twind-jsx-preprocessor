import { Token } from 'twind'

declare global {
  namespace React {
    interface DOMAttributes<T> {
      tw?: Token
    }
  }
}
