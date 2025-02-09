const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
const config = getDefaultConfig(path.resolve());

config.transformer = {
...config.transformer,
babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

config.resolver = {
...config.resolver,
assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
sourceExts: [...config.resolver.sourceExts, "svg"],
extraNodeModules: {
    '@common': path.resolve(__dirname, '../common'),
  }
}; 

config.watchFolders = [
    path.resolve(__dirname, '../common'),
    ...config.watchFolders || []
  ];

return config;
})();