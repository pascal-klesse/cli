import { ExtendedGluegunToolbox } from '../../interfaces/extended-gluegun-toolbox'

/**
 * Docs commands
 */
module.exports = {
  name: 'docs',
  description: 'Docs commands',
  hidden: true,
  run: async (toolbox: ExtendedGluegunToolbox) => {
    const {
      helper: { commandSelector }
    } = toolbox
    await commandSelector(toolbox, {
      level: 1,
      parentCommand: 'docs',
      welcome: 'Docs commands'
    })
    return 'docs'
  }
}
