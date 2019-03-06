/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 * @param {WebpackConfigHelpers} helpers - object with useful helpers when working with config.
 **/
export default function(config, env, helpers) {
  if (env.isProd) {
    config.devtool = false; // disable sourcemaps

    const uglifyPlugin = helpers.getPluginsByName(config, "UglifyJsPlugin")[0];
    if (uglifyPlugin) {
      config.plugins.splice(uglifyPlugin.index, 1);
    }
  }
}
