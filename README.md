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
``` 
{
	"mdp": "wss://rteuat.cybex.io",  // 获取快速行情服务器
	"nodes": [ 
		"ws://uatfn.51nebula.com" // 全节点
	],
	"limit_order": "ws://uatfn.51nebula.com",  // 订单服务器
	"eto":"https://etoapi.cybex.io/api", // eto服务器
	"gateway2":"https://gateway2test.cybex.io" // 网关服务器
}
```
7. json/pairs.json - 配置交易对的价格等显示精度
8. json/settings.json - 配置功能开关。比如打开/关闭ETO
9. public/Android_update.json - 配置Android APP更新提示
10. public/iOS_update.json - 配置IOS APP更新提示

## 常见操作

上线新币和交易对：
   - Cybex链创建代币，瑶池和网关配置好相关充提设置
   - 上传新币icon到public/icons
   - 添加币种id到assets.json
   - 添加币种充提详细信息到json/deposit/xxxx.json  json/withdraw/xxxx.json 
   - 添加交易对信息到bases.json文件
   - 添加交易对精度配置到pairs.json
   - 添加区块链浏览器信息到blockexplorer.json
   注：MDP需要重启才能获取变化后的交易对信息，因此需要提前一天完成配置交易对信息
   
 配置交易对精度：
 
 以CYB/USDT为例说明
 ``` 
 "USDT": {     // base
	"CYB": {
		"info": {   // 交易所左上角区域
				"last_price": "5",   // 最新价格，显示5位小数
				"change": "5",  // 绝对价格涨跌，显示5位小数
				"volume": "2" // 24小时成交额，显示2位小数
			},
		"book": {  // 订单表区域
				"last_price": "5", // 最新价格，显示5位小数
				"amount": "2", // 数量，显示2位小数
				"total": "6" // 成交额，显示2位小数
			},
		"choose": { // 切换交易对区域
				"last_price": "5", // 最新价格，显示5位小数
				"volume": "2" // 24小时成交额，显示2位小数
			},
		"form": { // 下单区域
				"min_trade_amount": "0.01", // 最小下单数量
				"amount_step": "0.01", // 下单数量步长
				"price_step": "0.00001",// 价格步长
				"min_order_value": "0.002",// 下单最低成交额
				"total_step": "0.000001"// 成交额步长
			}
		}
 ``` 

