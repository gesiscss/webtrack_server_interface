
import Core from './core.js';

var Authentication = () => {
  // var self = this;

  this.sendCredits = function(name, password) {
    return new Promise((resolve, reject)=>{

      Core.sendData('/api/login', {username: name, password: password}, false).then(resolve).catch(reject);

    });
  };

  this.leaseCallback = (cb) => {
    let index = Core.token.addCallsbyTimeout(cb);
    Core.token.runCallsbyTimeout();
    return index;
  };

  this.deleteLeaseCallback = (index) => Core.token.removeCallsbyTimeout(index);

  this.getUserdata = () => {
    return Core.userdata.get();
  };

  this.logout = () =>{
    Core.logout();
  }

  return this;
}

export default new Authentication();
