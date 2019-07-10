import React from 'react';
import MyComponent from '../../module/MyComponent';
import { Panel, Checkbox } from 'react-bootstrap';
import { scheduleService } from '../../../module/services';
import Toggle from 'react-bootstrap-toggle';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import wNumb from 'wnumb';

const daylist = {
  SUN: 'Sunday',
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday'
}

export default class Schedule extends MyComponent {

  static defaultProps = {
    offstyle: 'default',
    on: 'on',
    off: 'off'
  }

  constructor(props) {
    super(props)
    this.s = {};
    this.onToggle = this.onToggle.bind(this);
    this.sendUpdate = this.sendUpdate.bind(this);
    this.handleSlide = this.handleSlide.bind(this);

  }

  componentWillReceiveProps(nextProps){
    this.update(nextProps);
  }

  componentWillMount(){
    this.update(this.props)
  }

  update(props){
    if(props.isScheudle){
      scheduleService.get(this.props.project_id).then(s => {
        this.s.time = {};
        this.s.days = {};
        for (var i in s)  typeof s[i] === 'boolean'? this.s.days[i] = s[i]: this.s.time[i] = s[i];
        this.setState({
          isScheudle: props.isScheudle
        });
      }).catch(this.msgError);
    }else
      this.setState({
        isScheudle: props.isScheudle
      });
  }

  sendUpdate(){
    return new Promise((resolve, reject)=>{
        scheduleService.set(this.props.project_id, Object.assign(this.s.days, this.s.time)).then(resolve).catch(this.msgError)
    })
  }

  onToggle(b=false) {
    if(!b){
      scheduleService.remove(this.props.project_id).then(()=>{
         this.props.handleChange('SCHEDULE', b);
       }).catch(this.msgError)
    }else{
      this.props.handleChange('SCHEDULE', b);
    }
  }

  handleSlide(e){
    let [start, end] = e;
    start = start.split(':').map( v => parseInt(v, 10));
    this.s.time.START = start[0]*60 + start[1];
    end = end.split(':').map( v => parseInt(v, 10));
    this.s.time.END = end[0]*60 + end[1];
    this.sendUpdate();
  }

  getSlider(start=240, end=1080){
    var aproximateHour = mins => {
        let minutes = Math.round(mins % 60);
        if (minutes === 60 || minutes === 0)
        {
          return mins / 60;
        }
        return Math.trunc (mins / 60) + minutes / 100;
      }

    var filter_hour = (value, type) => (value % 60 === 0) ? 1 : 0;

    let options = {
      start : [start, end],
      connect: true,
      behaviour: 'tap-drag',
      step: 5,
      tooltips: true,
      range : {'min': 0, 'max': 1440},
      format:  wNumb({
           decimals: 2,
           mark: ":",
           encoder: a => aproximateHour(a)
      }),
      pips: {
         mode : 'steps',
         format:  wNumb({
             mark: ":",
             decimals: 1,
             encoder: a => aproximateHour(a)
         }),
         filter : filter_hour,
         stepped : true,
         density:1
      }
    };

    return (
      <Nouislider onChange={this.handleSlide} className={'schedule'} {...options} />
    );
  }

  handleCheckDate(date){
    this.s.days[date] = !this.s.days[date];
    this.sendUpdate();
  }

  getDates(){
    return (
      <div>
        {
          Object.keys(this.s.days).map( (v,i)=>{
            if(daylist[v]===undefined) return null
            return <Checkbox key={i} onChange={b => this.handleCheckDate(v)} defaultChecked={this.s.days[v]} >{daylist[v]}</Checkbox>
          })
        }
      </div>
    )
  }

  render() {
    let content = !this.state.isScheudle? <p>Schedule is not activated</p>: <div>
    {this.getSlider(this.s.time.START, this.s.time.END)}
    {this.getDates()}
    </div>;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3" className={'panel-flex'}>
          Schedule

          <Toggle
              onClick={this.onToggle}
              on={this.props.on}
              off={this.props.off}
              offstyle={this.props.offstyle}
              active={this.state.isScheudle}
            />

          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
        {content}
        </Panel.Body>
      </Panel>
    );
  }

}
