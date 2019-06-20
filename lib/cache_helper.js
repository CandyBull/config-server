const NodeCache = require("node-cache");
const myCache = new NodeCache()
const Logger = require('./logger')
const logger = new Logger('appserver', 'cache')
function Cacher(cache_time,redis_time){
  var self = new Object();

  self.cache_time = cache_time
  self.set_cache = function (key,value,times,redis){
    //from mem
    if (redis){
      let redis_key = 'eto_cache:'+key
      redis.setex(redis_key,times,value)
      // redis.expire(redis_key,times)
      return
    }
    //from mem
    myCache.set(key,value,times)
  }
  self.cached = async function(name,times,redis,func){
    let re = await self.get_cache(name,redis)
    if (!re){
      re = await func()
      if (re){
        self.set_cache(name,JSON.stringify(re),times,redis)
      }
    }else{
      logger.info("get cache")
      re = JSON.parse(re)
    }
    return re
  }
  self.get_cache = async function (key,redis){
    let re
    if (self.cache_time){
      re =  myCache.get(key)
      if (re){
        return re
      }
    }
    if (redis){
      let redis_key = 'eto_cache:'+key
      re = await redis.getAsync(redis_key)
      if (self.cache_time){
        self.set_cache(key,re,self.cache_time)
      }
      if (re){
        logger.log('get cache redis ok:',redis_key)
      }else{
        logger.log('get cache redis nil:',redis_key)
      }
      return re
    }
    //from mem
    return  myCache.get(key)
  }
  return self
}

module.exports = Cacher