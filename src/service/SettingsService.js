import core from '../module/core.js';


export default class SettingsService {

  get(project_id){
    return core.sendData('/settings/get', {project_id: project_id});
  }

  changeBoolean(project_id, id, boolean){
    return core.sendData('/settings/changeBoolean', {project_id: project_id, id: id, boolean: boolean});
  }

  changeValue(project_id, id, value){
    return core.sendData('/settings/changeValue', {project_id: project_id, id: id, value: value});
  }

  storageSet(project_id, destination, credentials){
    return core.sendData('/settings/storage/set', {project_id: project_id, destination: destination, credentials: credentials});
  }

  storageGet(project_id){
    return core.sendData('/settings/storage/get', {project_id: project_id});
  }

  storageRemove(project_id){
    return core.sendData('/settings/storage/remove', {project_id: project_id});
  }

  storageChange(project_id, settings){
    return core.sendData('/settings/storage/change', {project_id: project_id, settings: settings});
  }


}//class
