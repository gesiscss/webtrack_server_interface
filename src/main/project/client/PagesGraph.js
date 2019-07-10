import React, { Component } from 'react';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/tree';
import 'echarts/lib/component/tooltip';

import moment from 'moment';

export default class PagesGraph extends Component {

  static defaultProps = {
    tree: {
      name: 'User',
      children: []
    }
  }

  constructor(props){
    super(props);
    this.container = React.createRef();
    this.handleContextmenu = this.handleContextmenu.bind(this);
    this.state = {
      tree: this.props.tree
    }
    this.componentDidUpdate = this.update;
    this.componentDidMount = this.update;
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      tree: nextProps.tree
    })
  }

  handleContextmenu(param){
    if(param.data.id!==undefined) this.props.open(param.data.id, param.data.title);
  }

  update(){
    document.oncontextmenu = function() {
        return false;
    }
    this.myChart = echarts.init(this.container.current);
    this.myChart.on('contextmenu', this.handleContextmenu);
    // this.myChart.hideLoading();
    echarts.util.each(this.state.tree.children, function (datum, index) {
        index % 2 === 0 && (datum.collapsed = true);
    });
    this.myChart.setOption(this.getOption());
  }

  getOption(){
    return {
      tooltip: {
         trigger: 'item',
         triggerOn: 'mousemove',
         textStyle : {
           color: 'black',
           decoration: 'none',
           // fontFamily: 'Verdana, sans-serif',
           fontSize: 13,
           // fontStyle: 'italic',
           // fontWeight: 'bold'
         },
         backgroundColor : 'rgba(255,255,255,1)',
         borderColor : '#d9d9d9',
         borderRadius : 8,
         borderWidth: 2,
         padding: 10,
         formatter: function (p,ticket,callback) {
            if(p.data.title===undefined) return '';
            var res =  '<b>Title:</b> '+p.data.title
                       +'<br/><b>Starttime:</b> '+moment(p.data.starttime).format('YYYY-MM-DD HH:mm:ss')
                       +'<br/><b>Duration:</b> '+p.data.duration+' s'
                       +'<br/><b>URl:</b> '+p.data.url
            return res;
          }
        },
        series: [
          {
            type: 'tree',
            name: 'tree',
            data: [this.state.tree],

            top: '20%',
            left: '5%',
            bottom: '22%',
            right: '10%',

            symbolSize: 7,

            label: {
                normal: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right'
                }
            },

            leaves: {
                label: {
                    normal: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left'
                    }
                }
            },

            expandAndCollapse: true,

            animationDuration: 550,
            animationDurationUpdate: 750
        }
        ]
    }
  }

  render() {
    return (
      <div ref={this.container} style={{height: '100%'}}></div>
    );
  }
}
