import Cookies from 'universal-cookie';
const DEFAULT_OPTIONS = {
  path: '/'
}

export default class CookieHandler {

  /**
   * [constructor]
   * @param {String} id
   * @param {Unknown} defaultValue
   */
  constructor(id, defaultValue={}, options={}) {
    this.cookies = new Cookies();
    this.id = id;
    this.options = Object.assign(DEFAULT_OPTIONS, options);
    this.defaultValue = defaultValue
  }


  /**
   * [set // set value of id in localstorage]
   * @param {Unknown} data
   */
  set(data, options={}){
    data = JSON.stringify({timestamp: new Date().getTime(), value: data});
    this.cookies.set(this.id, data, Object.assign(this.options, options));
  }

  /**
   * [get return the Object of id]
   * @return {Object}
   */
  _fetch(){
    let data = this.cookies.get(this.id) || {value: this.defaultValue, timestamp: null}
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
   * [remove delete value of id]
   * @return {Boolean}
   */
  remove(){
    return this.cookies.remove(this.id);
  }


}//class
