import { override, overrideDevServer, addWebpackPlugin } from "customize-cra";
import CopyPlugin from 'copy-webpack-plugin';
import RewireMultipleEntry from 'react-app-rewire-multiple-entry';

const multipleEntry = RewireMultipleEntry([
  {
    entry: 'src/popup/index.tsx',
    template: 'public/popup.html',
    outPath: '/popup.html'
  },
  {
    entry: 'src/page/index.tsx',
    template: 'public/index.html',
    outPath: '/index.html'
  },
])

const devServerConfig = () => config => {
  return {
    ...config,
    writeToDisk: true
  }
}

const copyPlugin = new CopyPlugin({
  patterns: [
    { from: 'public', to: '' },
    { from: 'src/background.js', to: '' }
  ]
})

export const webpack = override(
  addWebpackPlugin(
    copyPlugin
  ),
  multipleEntry.addMultiEntry
);
export const devServer = overrideDevServer(
  devServerConfig()
);