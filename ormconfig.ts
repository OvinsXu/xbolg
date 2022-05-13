module.exports = {
  type: process.env.SQL_TYPE,
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  //"autoLoadEntities": true,//这种方式只能在forRoot里使用,为了配置文件...
  entities: ['dist/src/**/*.entity.{js,ts}'], //ts会被转译到dist里
  synchronize: true,
  logging: false,
};
