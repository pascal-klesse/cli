import { GluegunCommand } from 'gluegun'
import * as open from 'open'
import { ExtendedGluegunToolbox } from '../../interfaces/extended-gluegun-toolbox'

/**
 * Open regex tool in browser
 */
const NewCommand: GluegunCommand = {
  name: 'regex',
  alias: [],
  description: 'Open regex tool in browser',
  hidden: false,
  run: async (toolbox: ExtendedGluegunToolbox) => {
    // Open link
    await open('https://regex101.com')

    // For tests
    return `open regex`
  }
}

export default NewCommand
