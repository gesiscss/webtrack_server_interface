import React from 'react';
import MyComponent from '../../module/MyComponent';
import { Panel, Checkbox, FormGroup } from 'react-bootstrap';

export default class Extensionsfilter extends MyComponent {

  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          description: 'All',
          name: 'all',
          enable: false,
        },
        {
          description: 'Javascript',
          name: 'js',
          enable: false,
        },
        {
          description: 'Cascading Style Sheets',
          name: 'css',
          enable: true,
        },
        {
          description: 'Images',
          name: 'img',
          enable: false,
        },
        {
          description: 'Videos-Files',
          name: 'video',
          enable: false,
        },
        {
          description: 'Music-Files',
          name: 'music',
          enable: false,
        }
      ]
    };
    this.state.list = this.getMergList(this.state.list, this.props.list);
  }

  componentWillReceiveProps(nextProps){
    this.update(this.state, nextProps.list);
  }

  getMergList(list, values={}){
    for (let e of list) {
      if(values.hasOwnProperty(e.name)){
        e.enable = values[e.name];
      }
    }
    return list
  }

  update(values){
    this.setState(state => {
      state.list = this.getMergList(state.list, values);
      return state;
    })
  }

  setHandler(index){
    this.setState(state => {
      state.list[index].enable = !state.list[index].enable;
      let values = {};
      for (let v of state.list) values[v.name] = v.enable
      this.props.handleChange('EXTENSIONSFILTER', values);
      return state;
    });
  }

  render() {
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass="h3">Extensionsfilter</Panel.Title>
        </Panel.Heading>
        <Panel.Body>

          <FormGroup>
            {this.state.list.map((v, i)=>{
              let disabled = v.name !== 'all' && this.state.list[0].enable? true: false;
              return <Checkbox  key={i} disabled={disabled} defaultChecked={v.enable} onChange={e => this.setHandler(i)}  >{v.description}</Checkbox>
            })}
          </FormGroup>

        </Panel.Body>
      </Panel>
    );
  }

}
