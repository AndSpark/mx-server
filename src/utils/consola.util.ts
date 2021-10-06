import consola_, { FancyReporter, LogLevel } from 'consola'
import { argv } from 'yargs'
import { isDev } from './index.util'
class DateTimeReporter extends FancyReporter {
  formatDate(date: Date) {
    return date.toLocaleString(undefined, {
      hour12: false,
      timeStyle: 'medium',
      dateStyle: 'short',
    })
  }
}
const consola = consola_.create({
  reporters: [new DateTimeReporter()],
  level: isDev || argv.verbose ? LogLevel.Trace : LogLevel.Info,
})
consola.wrapAll()

export { consola }