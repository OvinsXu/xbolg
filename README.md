# 项目说明

使用Nest.js框架+TypeORM+MariaDB

参考文档:  
[Nest.js官方文档](https://docs.nestjs.cn/8/)  
[Nest.js 8.x 中文文档](https://www.bookstack.cn/read/nestjs-8-zh)

## 接口说明

一般情况使用`nest g resource 模块`后选择创建一个Restful Api风格的接口模块,目录如下  
├── dto:------------------------**数据传输对象**  
│         ├── create-test.dto.ts  
│         └── update-test.dto.ts  
├── entities:-------------------**实体类**  
│         └── test.entity.ts  
├── test.controller.ts  
├── test.module.ts  
└── test.service.ts  

### 接口的一般请求流程

**发起请求**-->(前端/客户端发起)  
**中间件**-->(在鉴权前的操作,比如访问日志登记...)  
**守卫**-->(判断是否有权限访问)  
**拦截器(请求)**-->()  
**管道**-->(对传来的数据进行处理,比如判断或者转化数据类型)  
**接口**-->  
**拦截器(响应)**-->(比如统一响应格式)  
**响应**  
期间发生异常可被**异常过滤器**捕捉处理

```shell
#创建的快捷命令如下
nest g mi 中间件 common/middlewares
nest g gu 守卫 common/guards
nest g in 拦截器 common/interceptors
nest g pi 管道 common/pipes
nest g f 异常过滤器 common/filters
```

### Restful API格式
参考:https://restfulapi.cn/
```shell
#示例
GET     /zoos                   列出所有动物园
POST    /zoos                   新建一个动物园
GET     /zoos/:id               获取某个指定动物园的信息
PUT     /zoos/:id               更新某个指定动物园的全部信息
PATCH   /zoos/:id               更新某个指定动物园的部分信息
DELETE  /zoos/:id               删除某个动物园
GET     /zoos/:id/animals       列出某个指定动物园的所有动物
DELETE  /zoos/:id/animals/:id   删除某个指定动物园的指定动物
```

## 依赖技术/解决方案

### 认证方案

互联网服务离不开用户认证。

#### session方案

1. 用户向服务器发送用户名和密码。
2. 服务器验证通过后，在当前对话（session）里面保存相关数据，比如用户角色、登录时间等等。
3. 服务器向用户返回一个 session_id，写入用户的 Cookie。
4. 用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。
5. 服务器收到 session_id，找到前期保存的数据，由此得知用户的身份。

这种模式的问题在于，扩展性（scaling）不好。单机当然没有问题，如果是服务器集群，或者是跨域的服务导向架构，就要求 session 数据共享，每台服务器都能够读取 session。  
举例来说，A 网站和 B 网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，请问怎么实现？  
一种解决方案是 session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败。  
另一种方案是服务器索性不保存 session 数据了，所有数据都保存在客户端，每次请求都发回服务器。JWT 就是这种方案的一个代表。  

#### JWT方案

JWT 不仅可以用于认证，也可以用于交换信息.  
JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。
```json
{
"姓名": "张三",
"角色": "管理员",
"到期时间": "2018年7月1日0点0分"
}
```
以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名（详见后文）。  
服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了，从而比较容易实现扩展。

JWT 的三个部分依次如下。
1. Header（头部）:描述 JWT 的元数据(算法,类型)
2. Payload（负载）:存放实际需要传递的数据(签发人 过期时间 主题 受众 生效时间 签发时间 编号)
3. Signature（签名）:对前两部分的签名，防止数据篡改(需要指定一个密钥（secret）。这个密钥只有服务器才知道)

### ORM方案
Java里常用Mybatis,JPA等,JS/TS里常用sequelize,TypeOrm,prisma等,这里采用TypeOrm.  
TypeOrm中文文档:https://typeorm.bootcss.com/

### 日志方案

采用Winston,官方文档:https://github.com/winstonjs/winston  
nest-winston的官方文档:https://github.com/gremo/nest-winston

### 幂等性问题的解决方案

接口幂等性是指用户对于同一操作发起的一次请求或者多次请求的结果是一致的，不会因为多次点击而产生了副作用。   
这类问题多发于接口的：  
insert操作，这种情况下多次请求，可能会产生重复数据。  
update操作，如果只是单纯的更新数据，比如：update user set status=1 where id=1，是没有问题的。如果还有计算，比如：update user set status=status+1 where id=1，这种情况下多次请求，可能会导致数据错误。  

1. insert前先select
2. 加悲观锁
3. 加乐观锁
4. 加唯一索引
5. 建防重表
6. ...等,参考:https://www.zhihu.com/question/324268535

采用方案:生成一个token请求令牌,发送给前端,并且储存在服务器端(比如redis),请求需携带此令牌,第一次请求,就删除redis中对应项,不给再次访问

## Installation

```shell
$ npm install
```

## Running the app

```shell
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```shell
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## License

Xbolg is [MIT licensed](MIT LICENSE)
