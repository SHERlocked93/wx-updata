# wx-updata

微信小程序官方 setData 替代品 ✈️

小程序代码片段预览地址： https://developers.weixin.qq.com/s/cJABB1mL7YjJ

[![npm](https://img.shields.io/npm/v/wx-updata.svg)](https://www.npmjs.com/package/wx-updata) [![npm](https://img.shields.io/npm/dt/wx-updata.svg)](https://www.npmjs.com/package/wx-updata)

[![NPM](https://nodei.co/npm/wx-updata.png?compact=true)](https://nodei.co/npm/wx-updata/)

## 优势

- 支持 setData 对象自动合并，就不用写蹩脚的对象路径了 🥳
- 支持对象中嵌套数组，数组中嵌套对象；
- 如果数组的某个值你不希望覆盖，请使用数组空位来跳过这个数组项，比如 `[1,,3]` 这个数组中间就是数组空位；
- 如果数组空位你的 Eslint 报错，可以使用 wx-updata 提供的 Empty 来代替 `[1, Empty, 3]`

## 安装

> 你也可以直接把 `dist` 目录下的 `wx-updata.js` 拷贝到项目里使用


```bash
$ npm i -S wx-updata
# or
$ yarn add wx-updata
```

然后：

1. 把微信开发者工具面板右侧的 `详情 - 本地设置 - 使用npm模块` 按钮打开；
2. 点击微信开发者工具面板工具栏的 `工具 - 构建npm`；

构建后成功生成 miniprogram_npm 文件夹就可以正常使用了

## 引入

### 方式一

可以使用直接挂载到 Page 上的方式，这样就可以在 Page 实例中像使用 setData 一样使用 upData 了

```javascript
// app.js
import { updataInit } from './miniprogram_npm/wx-updata/index'  // 你的库文件路径


App({
    onLaunch() {
        Page = updataInit(Page, { debug: true })
    }
})
```

```javascript
// 页面代码中

this.upData({
    info: { height: 155 },
    desc: [{ age: 13 }, '帅哥'],
    family: [, , [, , , { color: '灰色' }]]
})
```

### 方式二

有的框架可能在 Page 对象上进行了进一步修改，所以直接替换 Page 的方式可能就不太好了，wx-updata 同样暴露了工具方法，用户可以在页面代码中直接使用工具方法进行处理：

```javascript
// 页面代码中

import { objToPath } from './miniprogram_npm/wx-updata/index'  // 你的库文件路径

Page({
    data: { a: { b: 2}, c: [3,4,5]},

    // 自己封装一下
    upData(data) {
        return this.setData(objToPath(data))
    },

    // 你的方法中或生命周期函数
    yourMethod() {
        this.upData({ a: { b: 7}, c: [8,,9]})
    }
})
```

## API

###  `Page.prototype.upData(Object data, Function callback)`

1. `data`： 你希望设置的 data
2. `callback`： 跟 [setData](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#Page.prototype.setData(Object%20data,%20Function%20callback)) 第二个参数一样，引起界面更新渲染完毕后的回调函数

### `updataInit(Page, config)`

1. `Page`： 页面对象，需要在 `app.js` 中调用；
2. `config`： 若提供配置参数 `{ debug: true }`，会将路径化后的 data 打印出来，帮助用户进行调试；

### `objToPath(Object data)`

1. `data`： 你希望设置的 data 对象


## 使用

### 使用 Empty 代替数组空位

```javascript
// 页面代码中
import { Empty } from './miniprogram_npm/wx-updata/index'

this.upData({
    info: { height: 155 },
    desc: [{ age: 13 }, '帅哥'],
    family: [Empty, Empty, [Empty, Empty, Empty, { color: '灰色' }]]
})
```
