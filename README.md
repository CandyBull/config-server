# config and data server

用于提供简单的配置服务和数据服务

# 使用

## 环境
node 8.11

## 安装

根目录 npm install

## 配置

config.js中，目前只支持端口配置

sub 的 app中的config.js 也需要配置

## 使用

npm run start 
test

## 配置文件说明

1. public/icons - 所有币种ICON的存放路径 
2. json/assets.json - 币种白名单，需要在前端显示的币种ID必须配置在该文件中 
3. json/bases.json - 交易对配置文件 
4. json/blockexplorer.json - 配置币种的区块链浏览器，拼接具体的hash查询交易信息 
5. json/marketlists.json - 置顶交易对配置 
6. json/nodes_config.json - 节点等服务器配置文件  
``` js
{
	"mdp": "wss://rteuat.cybex.io",  // 获取快速行情服务器
	"nodes": [ 
		"ws://uatfn.51nebula.com" // 全节点
	],
	"limit_order": "ws://uatfn.51nebula.com",  // 订单服务器
	"eto":"https://etoapi.cybex.io/api", // eto服务器
	"gateway2":"https://gateway2test.cybex.io" // 网关服务器
}
7. json/pairs.json - 配置交易对的价格等显示精度
8. json/settings.json - 配置功能开关。比如打开/关闭ETO
9. public/Android_update.json - 配置Android APP更新提示
10. public/iOS_update.json - 配置IOS APP更新提示
