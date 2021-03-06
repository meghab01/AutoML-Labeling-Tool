/*
# Copyright 2020 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#            http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/

import React, { Component } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SentenceAnnotator from './SentenceAnnotator.js'
/*import PropTypes from 'prop-types'

RenderSentence.propTypes = {
  onLabelUpdate= PropTypes.function,
  annotations= PropTypes.string,
  sentenceId = PropTypes.string,
  type =  PropTypes.string,
  menuItems= PropTypes.object,     
  text = PropTypes.string
}*/

class RenderSentence extends Component {
  constructor(props) {
      super(props);

  }

  static defaultProps = { 
    
    type:"WhiteSpace", 
    text:""
  }



  render()
  {   
    if(this.props.type === "WhiteSpace" || this.props.type === "Punctuation") {      
      var numHardBreaks = (this.props.text.match(/\n/g) || []).length
      //console.log(numHardBreaks)
      //console.log(this.props.text)
      // this is so terrible, but quick and dirty and ungly
      // TODO: programatilly create react elements based on number of breaks.
      switch (numHardBreaks){

        // remember that whitespace collapses in html so mutiple spaces become one
        case 0: return " " // we already put punctuation in the text of the previous element in DocumentApi::parseDocument(). so we don't show the text if whitespace or punctuation
        case 1: return <br/>

        default:
        case 2: return <p/>
        case 3: return <p><br/></p>
        case 4: return <p><br/><br/></p>
      }      
    }
    

    return (            
        <SentenceAnnotator 
        sentenceOffset={this.props.sentenceOffset} 
        annotations={this.props.annotations} 
        menuItems={this.props.MenuItems}
        {...this.props}>
          {this.props.text}
        </SentenceAnnotator>        
      
  );
}
}


export default RenderSentence;