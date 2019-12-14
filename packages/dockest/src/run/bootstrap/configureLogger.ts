import { DockestConfig } from '../../@types'
import { hashCode } from '../../utils/hashCode'

const LOG_SYMBOLS: readonly string[] = [
  '🐉 ',
  '🐒 ',
  '🐙 ',
  '🐞 ',
  '🐥 ',
  '🐼 ',
  '🐿 ',
  '🦂 ',
  '🦃 ',
  '🦄 ',
  '🦊 ',
  '🦋 ',
  '🦍 ',
  '🦖 ',
  '🦚 ',
]

export const configureLogger = (config: DockestConfig) => {
  const {
    $: { runners },
  } = config

  let LOG_SYMBOLS_CLONE = LOG_SYMBOLS.slice(0)
  runners.forEach(({ dockestService: { serviceName }, logger }) => {
    const nameHash = Math.abs(hashCode(serviceName))

    if (LOG_SYMBOLS_CLONE.length === 0) {
      LOG_SYMBOLS_CLONE = LOG_SYMBOLS.slice(0)
    }

    const index = nameHash % LOG_SYMBOLS_CLONE.length
    const LOG_SYMBOL = LOG_SYMBOLS_CLONE.splice(index, 1)[0]

    logger.setRunnerSymbol(LOG_SYMBOL)
  })
}
