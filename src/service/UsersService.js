import core from '../module/core.js';


export default class UsersService {

  getAll(){
    return core.sendData('/users/getAll', {});
  }

  add(user){
    return core.sendData('/users/add', user);
  }

  delete(id){
    return core.sendData('/users/del', {id: id});
  }

  setEnable(id, boolean){
    return core.sendData('/users/setEnable', {id: id, boolean: boolean});
  }

  setAdmin(id, boolean){
    return core.sendData('/users/setAdmin', {id: id, boolean: boolean});
  }

  changePw(id, pw){
    return core.sendData('/users/changePw', {id: id, pw: pw});
  }



}//class
