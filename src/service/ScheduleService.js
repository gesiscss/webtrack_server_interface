import core from '../module/core.js';


export default class ScheduleService {

  get(project_id){
    return core.sendData('/settings/schedule/get', {project_id: project_id});
  }

  set(project_id, options){
    return core.sendData('/settings/schedule/set', {project_id: project_id, options: options});
  }

  remove(project_id){
    return core.sendData('/settings/schedule/remove', {project_id: project_id});
  }

}//class
