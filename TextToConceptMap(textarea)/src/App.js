import React, { Component } from 'react';
import PropTypes from 'prop-types'
import SplitPane from 'react-split-pane';
import './SplitPanel.css';
import Text from './Text';
import TimeBar from './TimeBar';
import Error from './Error';
import ConceptMap from './ConceptMap';
import ColorBar from './ColorBar';
import VideoPlayer from './Video/VideoPlayer'
import {saveNode, saveLink, REF} from './Firebase';
import firebase from 'firebase'  
import {toArray} from './utils'
import parse, { getGraphData } from './parse';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './App.css';

injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);
    this.setText = this.setTree.bind(this);
    this.scrollInput = this.scrollInput.bind(this);
    this.addTimeStamp = this.addTimeStamp.bind(this);
    this.deleteTimeStamp = this.deleteTimeStamp.bind(this);
    this.setTimeStamp = this.setTimeStamp.bind(this);

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.jumpToVideoTime = this.jumpToVideoTime.bind(this);
    this.getConceptMapData = this.getConceptMapData.bind(this);
    this.saveGraph = this.saveGraph.bind(this);
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
  static propTypes = {
    videoURL: PropTypes.string,
  }
  static defaultProps={
    videoURL: "https://www.youtube.com/watch?v=1LpHDOWMAdA",
  }
  componentWillMount() {
    firebase.database().ref(REF.Node).once('value').then((snapshot)=>{
      const nodes = toArray(snapshot.val());
      console.log(nodes)
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
  }

  setTree(text) {
    try {
      const trees = parse(text, '\t');
      const tree = getGraphData(trees);
      tree.node = this.setTimeStamp(tree.nodes);
      // console.log(JSON.stringify(tree));
      this.setState({
        tree,
        error: null,
      });
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  }
  getConceptMapData(){
    console.log('getConceptMapData')
    return this.conceptMap.getConceptMapData()
  }
  saveGraph(){
    console.log('saveGraph')
    const graphData = this.conceptMap.getConceptMapData();
    console.log(graphData.nodes)
    for(var i=0; i< graphData.nodes.get().length; i++){
      saveNode(graphData.nodes.get()[i])
    }
    for(i=0; i< graphData.edges.length; i++){
      saveLink(graphData.edges.get()[i])
    }
  }
  scrollInput(position){
    this.setState({
      scrollPosition: position,
    });
  }
  addTimeStamp(index){
    var currentTime = this.refs.player.getPlayedTime();
    var timeQueue = this.state.timeQueue;
    if(timeQueue.length === this.state.tree.nodes.length) var del = 1;
    timeQueue.splice(index,del,currentTime);
    this.setState({timeQueue: timeQueue})
    console.log('addTimeStamp at ', index, 'with time: ', currentTime)
    //console.log(this.state.timeQueue)
  }
  deleteTimeStamp(index){
    var timeQueue = this.state.timeQueue;
    timeQueue.splice(index,1);
    this.setState({timeQueue: timeQueue})
    console.log('deleteTimeStamp at ', index)
    console.log(this.state.timeQueue)
  }
  setTimeStamp(nodes){
    const timeQueue = this.state.timeQueue;
    var result = nodes.map((node,index)=>{
      node.time = timeQueue[index];
      return node
    })
    return result
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
  render() {
    return (
      <SplitPane split="horizontal" minSize='30%' maxSize='70%' defaultSize='40%'  primary="second">

        <SplitPane split="vertical" minSize='30%' maxSize='70%' defaultSize='60%'>
         
          <div className='container'>
            <VideoPlayer className='video' courseURL={this.props.videoURL}  width={'100%'} height={'100%'} controls={true} ref='player'/>
          </div>
          <div className='container'>
            <ColorBar className='colorbar' scrollPosition={this.state.scrollPosition} colors={this.state.colors} nodes={this.state.tree.nodes} />
            <Text className="input-text" setText={this.setText} scrollInput={this.scrollInput}
            deleteTimeStamp={this.deleteTimeStamp} addTimeStamp={this.addTimeStamp}/>
            <TimeBar className='timebar' timeQueue={this.state.timeQueue} />
            <Error isActive={this.state.error} text={this.state.error} />
          </div>
     
        </SplitPane>

        <div className='container'>
          <RaisedButton className='save-btn' label="Save my concept map" primary={true} onClick={this.saveGraph}/>
          <ConceptMap ref={(e)=>{this.conceptMap=e}} className="output" graphData={this.state.tree} colors={this.state.colors}
          jumpToVideoTime={this.jumpToVideoTime}/>
        </div>

      </SplitPane>
    );
  }
}

export default App;
