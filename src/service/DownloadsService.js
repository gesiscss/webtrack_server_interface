import core from '../module/core.js';


export default class DownloadsService {
  
  add(project_id, filter_ids, level){
    return core.sendData('/project/download/add', {project_id: project_id, filter_ids: filter_ids, level: level});
  }

  get(project_id, id){
    return core.sendData('/project/download/get', {project_id: project_id, id: id});
  }

  delete(project_id, id){
    return core.sendData('/project/download/delete', {project_id: project_id, id: id});
  }

  getList(project_id){
    return core.sendData('/project/download/list', {project_id: project_id});
  }

}
