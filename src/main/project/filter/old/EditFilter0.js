import React from 'react';
import MyComponent from '../../module/MyComponent';


import project from '../../module/project';
import MyTags from './MyTags';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import moment from 'moment';


import MyModal from '../../module/MyModal';
import { FormGroup, ControlLabel, FormControl, Col } from 'react-bootstrap';


const OPTIONS = {
  REGEX: 'Regex',
  CONTAINS: 'Contains',
  SLIDERNUMBER: 'SliderNumber',
  SLIDERDATE: 'SliderDate'
}

export default class EditFilter extends MyComponent {

  static defaultProps = {
    id: null,
    title: 'New Filter',
    name: 'MyFilter',
    colume: 'URL',
    type: OPTIONS.REGEX,
    value: '',
    onSuccess: ()=>{},
    onCancel: ()=>{},
  }

  constructor(props) {
    super(props);

    this.result = {
      name: this.props.name,
      colume: this.props.colume,
      type: this.props.type,
      value: this.props.value,
      change: false
    }

    this.onModalSuccess = this.onModalSuccess.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
    this.onModalCancel = this.onModalCancel.bind(this);
    this.changeName = this.changeName.bind(this);
    this.getResult = this.getResult.bind(this);
    this.set = this.set.bind(this);
    this.getChangeColumeType = this.getChangeColumeType.bind(this);
    this.getTypeJsx = this.getTypeJsx.bind(this);

    this.type = React.createRef();

  }

  componentWillMount(){
    project.getColumns(this.props.project_id).then(columns => {

      this.columns = columns;
      this.colume2type = {};
      for (let e of columns){
        this.colume2type[e.name] = {
          type: e.type
        }
        if(e.props) this.colume2type[e.name].props = e.props.slice(0)
      }

      this.set();

    }).catch(this.msgError);

    // console.log();

  }

  componentDidUpdate(nextProps, nextState){
    // console.log(this.result);
    // console.log(nextState);
  }

  getResult(){
    let r = this.result;

    let optionsTyps = this.getOptionsOfType(this.colume2type[r.colume].type);

    if(r.colume === this.props.colume && optionsTyps.indexOf(this.props.type)>=0 && this.props.type === r.type){
      r.optionsTyp = this.props.type  // props
    }else if(!r.change || optionsTyps.indexOf(this.props.type)<0){
      r.optionsTyp = optionsTyps[0]
    }else{
      r.optionsTyp = r.type;
    }

    r.defaultProps = this.colume2type[r.colume].props;

    if(r.colume !== this.props.colume || r.type !== this.props.type) r.value = (this.colume2type[r.colume].props!==undefined? JSON.parse(JSON.stringify(this.colume2type[r.colume].props)) : undefined ) || []
    return r;
  }


  set(){
    this.result.change = true;
    let r = this.getResult();
    console.log(r);
    let type = this.colume2type[r.colume].type;

    // console.log(r, type, this.getOptionsOfType(type));
    // console.log(r);
    let key = `${Math.floor((Math.random() * 1000))}-min`;


    this.setState({
      columns: this.columns,
      typeSelectBox: this.getTypeSelectBox(type, r.optionsTyp, key),
      typeJsx: this.getTypeJsx(r.optionsTyp, r.value, key, r.defaultProps)
    })
  }

  /**
   * [getChangeColumeType return typeJsx  ]
   * @param  String colume [e.g. 'CONTENT']
   * @param  String type [e.g. 'Regex']
   * @return JSX    <FormControl />
   */
  getChangeColumeType(colume, type){
    let value = type===this.props.type? this.props.value: undefined;
    let props = this.state.colume2type[colume].hasOwnProperty('props')? this.state.colume2type[colume].props: undefined;
    return this.getTypeJsx(type, value, props);
  }


  getTypeSelectBox(type, defaultValue, key){
    defaultValue = defaultValue || null;
  

    return (
      <FormControl key={key} type="select" componentClass="select"
        onChange={e =>
          {
            // console.log('set', e.target.value);
            this.result.type = e.target.value; //change the result for colume
            this.set();
          }
         }

         defaultValue={defaultValue}>
      {
        this.getOptionsOfType(type).map( (e, i) => {
          // console.log(e);
          return <option key={i} value={e} >{e}</option>
        })
      }
      </FormControl>
    )

  }


  /**
   * [getOptionsOfType return Array with Option-Types]
   * @param  String type [e.g string]
   * @return Array      [e.g [ 'Regex', 'Contains' ]]
   */
  getOptionsOfType(type){
    let options = [];
    switch (type) {
      case 'string':
        options = [ OPTIONS.REGEX, OPTIONS.CONTAINS ]
        break;
      case 'number':
        options = [ OPTIONS.SLIDERNUMBER ]
        break;
      case 'date':
        options = [ OPTIONS.SLIDERDATE ]
        break;
      default:
    }//switch
    return options;
  }

  getTypeJsx(type, value, key, defaultProps){
    // if(typeof value==='undefined') value = type===this.props.type? this.props.value: [];

    let onChangeSlider = (range)=>{
      // this.result.value = JSON.stringify(range);
      this.result.value = range;
    }
    let onChangeRegex = (e)=>{
      this.result.value = e.hasOwnProperty('target')? e.target.value: e;
    }
    let onChangeTags = (tags)=>{
      this.result.value = JSON.stringify(tags);
    }

    let jsx = null;
    switch (type) {
      case OPTIONS.REGEX:
        if(value.length===0) value = '//gm';
        jsx = <textarea key={key}  className="form-control" defaultValue={value} onChange={onChangeRegex} ></textarea>;
        onChangeRegex(value);
        break;
      case OPTIONS.CONTAINS:
        if(!Array.isArray(value)) value = [];
        jsx = <MyTags key={key}  tags={value} onChange={onChangeTags} />;
        onChangeTags(value);
        break;
      case OPTIONS.SLIDERNUMBER:
        if(defaultProps[0] === defaultProps[1]) defaultProps[1] += 1;
        jsx = <Nouislider key={key}  range={{ min: defaultProps[0], max: defaultProps[1] }} onKeydown={e=>{}} onChange={onChangeSlider} start={[value[0], value[1]]} connect tooltips format={ { to: value => { return parseInt(value, 10) }, from: value =>{ return value;} } } />;
        onChangeSlider(value);
        break;
      case OPTIONS.SLIDERDATE:
        for (let i in value){
          let d = (typeof value[i]!=='string' || (new Date(value[i]) instanceof Date && !isNaN(new Date(value[i]))) === false)?
              new Date(defaultProps[i]) : new Date(value[i]);
          value[i] = d.getTime();
        }
        if(value[0] === value[1]) value[1] += 1;

        for (let i in defaultProps) defaultProps[i] = new Date(defaultProps[i]).getTime();
        if(defaultProps[0] === defaultProps[1]) defaultProps[1] += 1;

        jsx = <Nouislider key={key}  range={{ min: defaultProps[0], max: defaultProps[1] }} onKeydown={e=>{}} onChange={onChangeSlider} start={[value[0], value[1]]} connect tooltips format={ { to: value => { return moment(value).format('YYYY-MM-DD HH:mm:ss')}, from: value =>{ return value;} } } />;
        onChangeSlider(value);
        break;

      default:
    }//switch

    return jsx;
  }





  changeName(e){
    this.result.name = e.target.value;
  }

  onModalSuccess(){

    if(Array.isArray(this.result.value)) this.result.value = JSON.stringify(this.result.value);
    this.props.onSuccess(this.props.id, this.result);
  }

  onModalOpen(){
    // console.log('onModalOpen');
  }

  onModalCancel(){
    // console.log('onModalCancel');
    this.props.onCancel();
  }

  render() {
    // console.log(this.props);

    if(this.state.columns===undefined) return null;

    //
    //  {this.state.typeJsx}
    return (
         <MyModal className={'editFilter'} bsSize={'lg'} title={this.props.title} onSuccess={this.onModalSuccess} onOpen={this.onModalOpen} onCancel={this.onModalCancel} >
             {this.state.msg}

             <FormGroup>
                  <ControlLabel>Name</ControlLabel>
                  <FormControl componentClass="input" onChange={this.changeName} defaultValue={this.props.name} placeholder={this.props.name}/>
             </FormGroup>
             <FormGroup>
                <Col lg={12}><ControlLabel>Filtername</ControlLabel></Col>

                <Col lg={3}>
                    <FormControl componentClass="select" placeholder="select" onChange={e =>
                      {
                        this.result.colume = e.target.value; //change the result for colume
                        this.set();
                      }
                     } defaultValue={this.props.colume}>
                    {
                      this.state.columns.map( (e, i) => {
                        return <option key={i} value={e.name} >{e.name}</option>
                      })
                    }
                    </FormControl>
                </Col>
                <Col lg={3}>
                  {this.state.typeSelectBox}
                </Col>
                <Col lg={6}>
                  {this.state.typeJsx}
                </Col>

              </FormGroup>


         </MyModal>
    );
  }

}
