import React, {Component} from 'react'
//var __html = require('./Help.html');

export default class Help extends Component{
	render() {
	    return (
	        <div style={{padding:'10px'}}>
	        	<h1 id="what-can-i-do-">What can I do?</h1>
				<h3 id="improve-the-concept-map-by-">Improve the concept map by...</h3>
				<p><strong>Add concept / Edit concept:</strong> Click on <em>any white space</em> and type the concept in the input area (on the bottom). When you add concept, the concept will store the video time automatically when it is added to the concept map. You can further use that timestamp to navigate the video.</p>
				<p><strong>Add link:</strong> Click on the &#39;Add link&#39; button and then drag-and-drop from the starting concept to the target concept. You can also press ctrl-shift (mac users: cmd-shift) to enable adding link.</p>
				<p><strong>Add link phrase / Edit link phrase:</strong> Click on the link and type the link phrase in the input area (on the bottom).</p>
				<p><strong>Delete concept / link:</strong> Click on the deleted target and click the delete button.</p>
				<p><strong>Move concept(s): </strong>You can drag on concept to move it or drag the canvas (any white space) to move the whole concept map.</p>
				<h3 id="use-the-concept-map-to-">Use the concept map to...</h3>
				<p><strong>Check current lecture progress:</strong> We highlight the concepts that are covered by the video with orange colors.</p>
				<p><strong>Navigate video:</strong> You can <em>double click</em> one concept to jump to according video time.</p>
				<p><strong>Review the lecture:</strong> You can review the concept map even after listing the lecture.</p>
	        </div>
	    );
	}
}