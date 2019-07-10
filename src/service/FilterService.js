import core from '../module/core.js';


export default class FilterService {

  add(group_id, name, colume, type, value){
    return core.sendData('/filter/add', {group_id: parseInt(group_id, 10), name: name, colume:colume, type:type, value:value});
  }

  change(id, name, colume, type, value, cb){
    return core.sendData('/filter/change', {id: parseInt(id, 10), name: name, colume:colume, type:type, value:value});
  }

  delete(id, cb){
    return core.sendData('/filter/delete', {id: id});
  }

  groupAdd(project_id, name, cb){
    return core.sendData('/filter/group/add', {project_id: project_id, name: name});
  }

  groupChange(id, name, cb){
    return core.sendData('/filter/group/change', {id: id, name: name});
  }

  groupDelete(id, cb){
    return core.sendData('/filter/group/delete', {id: id});
  }

  groupGetAll(cb){
    return core.sendData('/filter/group/getAll', {});
  }



}//class
