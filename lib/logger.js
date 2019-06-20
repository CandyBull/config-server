class Logger {
  /**
   * 标准化日志
   * @param {String} category 主类别
   * @param {String} sub 子类别
   */
  constructor(category, sub, logLevel = null) {
    this._category = category || 'Default'
    this._sub = sub
    this.logLevel = logLevel
  }

  // 功能性日志记录
  // ----------------- Error型 --------------------
  /**
   * 致命报错
   * @param {String} message info记录
   * @param {Error} err 错误对象
   * @param {String[]} tags 各类日志标签
   */
  fatal(...message) {
    if (this.logLevel || Logger.logLevel < Levels.FATAL) return
    let tags =  []
    tags.unshift('FATAL')
    return this._error(tags,...message)
  }
  /**
   * 错误日志
   * @param {String} message info记录
   * @param {Error} err 错误对象
   * @param {String[]} tags 各类日志标签
   */
  error(...message) {
    if (this.logLevel || Logger.logLevel < Levels.ERROR) return
    let tags =  []
    tags.unshift('ERROR')
    return this._error(tags,...message)
  }
  // ------------------- Log型 ----------------------
  /**
   * 警报日志
   * @param {String} message info记录
   * @param {String[]} tags 各类日志标签
   */
  warn(...message) {
    if (this.logLevel || Logger.logLevel < Levels.WARN) return
    let tags =  []
    tags.unshift('WARN')
    return this._log(tags,...message)
  }
  /**
   * 普通日志，但须有所注意
   * @param {String} message info记录
   * @param {String[]} tags 各类日志标签
   */
  notice(...message) {
    if (this.logLevel || Logger.logLevel < Levels.NOTICE) return
    let tags =  []
    tags.unshift('NOTICE')
    return this._log(tags,...message)
  }
  /**
   * 普通日志，常用方法，使用NOTICE级别
   * @param {String} message info记录
   * @param {String[]} tags 各类日志标签
   */
  log(...message) {
    if (this.logLevel || Logger.logLevel < Levels.NOTICE) return
    this._log(...message)
  }
  /**
   * 普通日志，带'INFO' tag
   * @param {String} message info记录
   * @param {String[]} tags 各类日志标签
   */
  info(...message) {
    if (this.logLevel || Logger.logLevel < Levels.INFO) return
    let tags = []
    tags.unshift('INFO')
    this._log(tags,...message)
  }
  /**
   * 调试日志
   * @param {String} message info记录
   * @param {String[]} tags 各类日志标签
   */
  debug(message, tags) {
    if (this.logLevel || Logger.logLevel < Levels.DEBUG) return
    tags = tags || []
    tags.unshift('DEBUG')
    this._log(message, tags)
  }

  // 通用私有方法
  /**
   * @param {String} message 日志记录
   * @param {String[]} tags 各类日志标签
   */
  _log(...message) {
    console.log(this._buildPrefix([]),...message)
  }

  _error(...message) {
    console.error(this._buildPrefix([]),...message)
  }

  /**
   * 生成LogPrefix
   * @param {String[]} tags 各类日志标签
   * @returns {String}
   */
  _buildPrefix(tags) {
    const category = !this._sub ? `[${this._category}]` : `[${this._category} - ${this._sub}]`
    const tagsStr = (tags || []).map(t => `[${t}]`).join('')
    return `${new Date().toLocaleString()}|${category}${tagsStr}|`
  }
}

const Levels = {
  NO_LOG: -1, // 无日志
  FATAL: 0, // 致命报错
  ERROR: 1, // 错误日志
  WARN: 2, // 警报日志
  NOTICE: 3, // 普通日志，但须有所注意
  INFO: 4, // 普通日志
  DEBUG: 5 // 调试日志
}
Logger.logLevel = Levels.INFO
Logger.Levels = Levels

module.exports = Logger
