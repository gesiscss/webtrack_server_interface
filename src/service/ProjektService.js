import core from '../module/core.js';


export default class ProjektService {

  add(name, description){
    return core.sendData('/project/add', {name: name, description: description});
  }

  change(id, name, description){
    return core.sendData('/project/change', {id: id, name: name, description: description});
  }

  getAll(){
    return core.sendData('/project/getAll', {});
  }

  delete(id){
    return core.sendData('/project/delete', {id: id});
  }

  get(id){
    return core.sendData('/project/get', {id: id});
  }

  getClients(id){
    return core.sendData('/project/getClients', {id: id});
  }

  getClientPages(id, client_id){
    return core.sendData('/project/getClientPages', {id: id, client_id: client_id});
  }

  getPageEvents(id, page_id){
    return core.sendData('/project/getPageEvents', {id: id, page_id: page_id});
  }

  deletePageEvent(id, page_id, event_id){
    return core.sendData('/project/deletePageEvent', {id: id, page_id: page_id, event_id: event_id});
  }

  deletePage(id, page_ids){
    return core.sendData('/project/deletePage', {id: id, page_ids: page_ids});
  }

  getPageVersions(id, page_id){
    return core.sendData('/project/getPageVersions', {id: id, page_id: page_id});
  }

  getPageContent(id, page_id, version){
    return core.sendData('/project/getPageContent', {id: id, page_id: page_id, version: version});
  }

  deletePageContent(id, page_id, version){
    return core.sendData('/project/deletePageContent', {id: id, page_id: page_id, version: version});
  }

  getPermissions(id){
    return core.sendData('/project/getPermissions', {id: id});
  }

  addUserPermission(id, user_id){
    return core.sendData('/project/addUserPermission', {id: id, user_id: user_id});
  }

  deleteUserPermission(id, user_id){
    return core.sendData('/project/deleteUserPermission', {id: id, user_id: user_id});
  }

  changeUserPermission(id, user_id, boolean){
    return core.sendData('/project/changeUserPermission', {id: id, user_id: user_id, boolean: boolean});
  }

  hasAdminPermission(id){
    return core.sendData('/project/hasAdminPermission', {id: id});
  }

  getColumns(project_id){
    return core.sendData('/project/getColumns', {project_id: project_id});
  }

  sync(id){
    return core.sendData('/project/storage/update', {id: id});
  }

  

}//class
