# @dotlim/scripts

## 设计方案

1. 采用类似 vue-cli 的设计，webpack 配置本身不会暴露在用户视野，对外只提供一份配置文件，用于覆盖默认的配置
2. 目前暂时采用基于 webpackConfig 的配置，后续会考虑支持 webpack-chain
3. 支持配置生产环境是否使用缓存
4. 支持配置生产环境是否使用文件压缩

### dotlim.config.js

| 属性                                 | 说明                                                          | 类型            | 默认值       |
| ------------------------------------ | ------------------------------------------------------------- | --------------- | ------------ |
| publicPath                           | 设置部署应用时的 URL                                          | string          | /            |
| entryFile                            | 设置应用编译入口文件                                          | string          | src/index.js |
| outputDir                            | 设置编译生成文件存放目录                                      | string          | build        |
| lineOnSave                           | 设置编译前校验代码                                            | boolean         | false        |
| devServer.open                       | 设置启动本地服务自动打开浏览器                                | boolean         | false        |
| devServer.port                       | 设置启动本地服务的端口号                                      | number          | 9090         |
| devServer.proxy                      | 设置启动本地服务的代理                                        | Object          | {}           |
| configureWebpack                     | 自定义 webpack 配置，会合并到最终的配置中                     | Object/Function | {}           |
| compilerOptions.shouldUseSourceMap   | 设置是否启用 source-map                                       | boolean         | false        |
| compilerOptions.inlineRuntimeChunk   |                                                               | boolean         | false        |
| compilerOptions.imageInlineSizeLimit | 设置图片使用空间限制，小于这个值使用 url-lodaer 编译成 base64 | number          | 10000        |
| compilerOptions.productionCache      | 设置生产环境是否启用缓存（CI 构建不需要缓存）                 | boolean         | true         |
| compilerOptions.productionGzip       | 设置生产环境是否启用 Gzip 压缩                                | boolean         | false        |

## 走过的坑

- css 提取成文件后图片路径错误【需要配置 `MiniCssExtractPlugin.loader` 的 `options.publicPath` 属性】
- 配置 `optimization.optimizer.runtimeChunk` 后运行报错【未解决】
- 使用 CopyWebpackPlugin 拷贝文件出错 `Multiple assets emit different content to the same filename index.html` 【未解决】
