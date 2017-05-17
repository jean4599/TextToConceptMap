import React, { Component } from 'react';
import PropTypes from 'prop-types'
import SplitPane from 'react-split-pane';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import HelpIcon from 'material-ui/svg-icons/action/help-outline';
import './SplitPanel.css';
import ConceptMap from './ConceptMap';
import Help from './Help'
import VideoPlayer from './Video/VideoPlayer'
import {saveNode, saveLink, REF} from './Firebase';
import firebase from 'firebase'  
import {toArray} from './utils'
// import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';

injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);
    this.getTimeStamp = this.getTimeStamp.bind(this);
    this.updateVideoTime = this.updateVideoTime.bind(this);
    this.getVideo = this.getVideo.bind(this);

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.jumpToVideoTime = this.jumpToVideoTime.bind(this);

    this.getVideo();
  }
  state = {
    tree: {
      nodes: [],
      edges: [],
    },
    colors: ['#FF7637', '#FFAC87', '#FFD3C0', '#FFECE4', '#FFFAF8'],
    error: false,
    timeQueue:[],
    size: undefined,
    dragging: false,
  }
  componentDidMount() {
    firebase.database().ref(REF.Node).once('value').then((snapshot)=>{
      const nodes = toArray(snapshot.val());
      //console.log(nodes)
      firebase.database().ref(REF.Link).once('value').then((snapshot)=>{
        const edges = toArray(snapshot.val());
        this.setState({
          tree: {
            nodes: nodes,
            edges: edges
          }
        })
      })
      
    })

    //save the concept map before closeing the window
    window.addEventListener("beforeunload", (ev) => 
    {  
        const conceptMapData = this.conceptmap.getNetworkData();
        firebase.database().ref().push(conceptMapData)
    });
  }
  getVideo(){
    firebase.database().ref(REF.Video).once('value').then((snapshot)=>{
      console.log('video: ',snapshot.val())
      this.setState({videoURL: snapshot.val()})
    })
  }
  getTimeStamp(){
    return this.refs.player.getPlayedTime();
  }
  updateVideoTime(time){
    this.setState({videoTime: time})
  }
  jumpToVideoTime(time){
    this.refs.player.jumpToTime(time);
  }
  handleDragStart() {
      this.setState({
          dragging: true,
      });
  }

  handleDragEnd() {
      this.setState({
          dragging: false,
      });
      setTimeout(() => {
          this.setState({ size: undefined });
      }, 0);
  }

  handleDrag(width) {
      if (width >= 300 && width <= 400) {
          this.setState({ size: 300 });
      } else if (width > 400 && width <= 500) {
          this.setState({ size: 500 });
      } else {
          this.setState({ size: undefined });
      }
  }
  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});
  render() {
    // <RaisedButton className='save-btn' label="Save my concept map" primary={true} onClick={()=>this.saveGraph(this.state.tree)}/>
    return (
      <div className='container'>
        <div>
        <FlatButton
              icon={<HelpIcon />}
              style={{float:'right', minWidth:'36px'}}
              onTouchTap={this.handleToggle}/>
        <Drawer
              docked={false}
              width={500}
              open={this.state.open}
              openSecondary={true}
              onRequestChange={(open) => this.setState({open})}
            >
            <Help />
        </Drawer>
        </div>
        <SplitPane split="vertical" minSize='30%' maxSize='70%' defaultSize='53%'>
         
          <div className='container'>
            <VideoPlayer className='video' courseURL={this.state.videoURL}  width={'100%'} height={'100%'} controls={true} ref='player'
            updateVideoTime={this.updateVideoTime}/>
          </div>

          <div className='container'>

            <ConceptMap className="output" graphData={this.state.tree} colors={this.state.colors}
            jumpToVideoTime={this.jumpToVideoTime}
            getTimeStamp={this.getTimeStamp}
            videoTime={this.state.videoTime}
            ref={o=>{this.conceptmap = o}}/>
          </div>
     
        </SplitPane>
      </div>
    );
  }
}
export default App;

