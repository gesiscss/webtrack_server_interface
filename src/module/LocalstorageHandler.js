module.exports = class LocalstorageHandler {

  /**
   * [constructor]
   * @param {String} id
   * @param {Unknown} defaultValue
   */
  constructor(id, defaultValue) {
    this.id = id;
    this.defaultValue = defaultValue
  }

  /**
   * [is check is set value of id]
   * @return {Boolean}
   */
  is(){
    return localStorage.getItem(this.id)? true: false
  }

  /**
   * [set // set value of id in localstorage]
   * @param {Unknown} data
   */
  set(data){
    data = JSON.stringify({timestamp: new Date().getTime(), value: data});
    localStorage.setItem(this.id, data);
  }

  /**
   * [get return the Object of id]
   * @return {Object}
   */
  _fetch(){
    let data = localStorage.getItem(this.id) || {value: this.defaultValue, timestamp: null}
    try {
      data = JSON.parse(data);
    } catch (e){}

    return data;
  }

  /**
   * [get return value of id]
   * @return {Unknown}
   */
  get(){
    return this._fetch().value;
  }

  /**
   * [get return timestamp of id]
   * @return {Integer}
   */
  getTimestamp(){
    return this._fetch().timestamp;
  }


  /**
   * [remove delete value of id]
   * @return {Boolean}
   */
  remove(){
    return localStorage.removeItem(this.id);
  }


}//class
