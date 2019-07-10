import config from '../defined/config.json';
import CookieHandler from './CookieHandler';


var Core = function(data) {
    var self = this;
    this.data = config;
    this.cookie = new CookieHandler('webtrack', {});
    this.userdata = new CookieHandler('webtrack-user', {id: null});

    this.getServerURL = () => {
      if(self.data.development){
        return self.data.developmentTraget.protocol+self.data.developmentTraget.url+':'+self.data.developmentTraget.port;
      }else{
        return window.location.origin
      }
    }

    this._fetchBlob = (response) =>{
      response.then(blob => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'Project.zip';
        a.click();
        window.URL.revokeObjectURL(url);
          console.log(blob);
      })
    }

    this.fetchJSON = (res, response) => {
      return new Promise(async(resolve, reject)=>{
        try {
          var d = await response;
          if(d.error != null){
            reject({message: d.error.message || '', code: d.error.code || '', nr: d.error.nr || ''});
          }else {


            if(d.result.authData !== null && d.result.data !== null && Object.keys(d.result.data).includes('token')){
                let authData = d.result.authData;
                self.token.set({iat: new Date(authData.iat*1000), exp: new Date(authData.exp*1000), token:  d.result.data.token}, new Date(authData.exp*1000));
                self.token.runCallsbyTimeout();
                self.userdata.set({name: authData.name, id: authData.id, admin: authData.admin, enable: authData.enable}, new Date(authData.exp*1000));
            }

            var data = (typeof d.result==='object' && d.result.hasOwnProperty('data'))? d.result.data: d.result;
            resolve(data);
          }//if else
        } catch (err) {
          let message = '',
          code='';
          try {
            let error = typeof err==='string'? JSON.parse(err): err;
            message =  error.message.join('<br/>');
            code = error.code;
          } catch (e) {}
          reject({message: message, code: code, nr: res.status});
        }
      })
    }

    this.sendData = (path, data, authentication, header) => {
      return new Promise((resolve, reject)=>{
          var res = null;
          if(typeof authentication==='undefined') authentication = true;
          if(data==null) data = {};
          let url = self.getServerURL()+path.toString();
          let options = {
              method: 'POST',
              headers: {}
          };
          if(typeof header=== 'undefined' ) options.headers['Accept'] = 'application/json';
          if(data!=null){
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data)
          }
          if(authentication) options.headers.Authorization = self.token.get().token;


          fetch(url, options)
          .then(response => {
              res = response;

              if (!response.ok) throw response.statusText;

              let headers = Array.from(res.headers.entries(), pair => {
                  return { [pair[0]]: pair[1].replace(' ', '').split(';') }
              })
              let header = {};
              for (let c of headers) {
                for (var attr in c) header[attr] = c[attr]
              }

              if(header['content-type'].includes("application/json")){
                this.fetchJSON(res, response.json()).then(resolve).catch(reject)
              }else{
                response.blob().then(resolve).catch(reject)
              }

          });
      });
    }//()

    this.logout = () =>{
      self.token.leaseCallback = [];
      this.token.remove();
      this.userdata.remove();
    }

    this.token = {

      leaseCallback: [],

      set: (object, expires=new Date()) => this.cookie.set(object, expires),

      remove: () => this.cookie.remove(),

      get: () => this.cookie.get(),

      addCallsbyTimeout: (callback) => {
        self.token.leaseCallback.push(callback);
        return self.token.leaseCallback.length-1;
      },

      removeCallsbyTimeout: (index) => {
        delete self.token.leaseCallback[index];
        self.token.runCallsbyTimeout();
      },

      setTokenTimeout: (timeDiff) => {
        self.token.timeout = setTimeout(()=>{
          for (let callback of self.token.leaseCallback){
            if(typeof callback === 'function') callback(timeDiff);
          }
        }, timeDiff);
      },

      runCallsbyTimeout: () => {
        let timeDiff = null;
        let token = self.token.get();
        if(token.exp){
          timeDiff = new Date(token.exp).getTime()-new Date().getTime();
          // console.log('timeDiff=> ', timeDiff);

          if(timeDiff<=0) timeDiff = 0;
          if(typeof self.token.timeout==='number') clearTimeout(self.token.timeout);
        }
        self.token.setTokenTimeout(timeDiff);
      }

    }//token

};


export default new Core();
