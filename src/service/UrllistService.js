import core from '../module/core.js';


export default class UrllistService {

  get(project_id, range, sorted, filtered){
    return core.sendData('/settings/urllist/get', {project_id: project_id, range: range, sorted, filtered});
  }

  add(project_id, url){
    return core.sendData('/settings/urllist/add', {project_id: project_id, url: url});
  }

  change(project_id, id, url){
    return core.sendData('/settings/urllist/change', {project_id: project_id, id: id, url: url});
  }

  delete(project_id, id){
    return core.sendData('/settings/urllist/delete', {project_id: project_id, id: id});
  }

  getCount(project_id){
    return core.sendData('/settings/urllist/getCount', {project_id: project_id});
  }

  clean(project_id){
    return core.sendData('/settings/urllist/clean', {project_id: project_id});
  }


}//class
