import core from '../module/core.js';


export default class ClientsService {

  get(project_id, range=[], sorted=[], filtered=[]){
    return core.sendData('/project/client/get', {id: project_id, range: range, sorted: sorted, filtered: filtered});
  }

  getCount(project_id){
    return core.sendData('/project/client/getCount', {id: project_id});
  }

  add(project_id, values){
    return core.sendData('/project/client/create', {id: project_id, list: values});
  }

  delete(project_id, client_id, onlyLink=false){
    return core.sendData('/project/client/delete', {id: project_id, client_id: client_id, onlyLink: onlyLink});
  }

  change(project_id, client_id, name){
    return core.sendData('/project/client/change', {id: project_id, client_id: client_id, name: name});
  }

  clean(project_id){
    return core.sendData('/project/client/clean', {id: project_id});
  }

}
