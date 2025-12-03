const path = require('path');
const { UnifiedWebpackPluginV5 } = require('weapp-tailwindcss-webpack-plugin');

const config = {
  projectName: 'RetroBrickGame',
  date: '2023-10-27',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: '.',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
  },
  copy: {
    patterns: [
      { from: 'assets', to: 'dist/assets' }
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false
  },
  alias: {
    [path.resolve(__dirname, '..', 'components/primitives')]: path.resolve(__dirname, '..', 'components/primitives.taro.tsx'),
    [path.resolve(__dirname, '..', 'components/primitives.tsx')]: path.resolve(__dirname, '..', 'components/primitives.taro.tsx'),
    '@/components': path.resolve(__dirname, '..', 'components'),
    '@/utils': path.resolve(__dirname, '..', 'utils'),
    '@/hooks': path.resolve(__dirname, '..', 'hooks'),
  },
  mini: {
    webpackChain(chain) {
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [{
              appType: 'taro'
            }]
          }
        }
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 1kb
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}