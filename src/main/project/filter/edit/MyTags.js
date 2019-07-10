import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

import '../../../../static/MyTags.css';

// const KeyCodes = {
//   comma: 188,
//   enter: 13,
// };
// const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default class MyTags extends Component {

  static defaultProps = {
    tags: [],
    suggestions: [],
    onChange: () => {}
  }

  constructor(props) {
     super(props);
     let tags = [];
     for (var i in this.props.tags) tags.push({ id: (parseInt(i, 10) + 1).toString(), text: this.props.tags[i] });

     this.state = {
       tags: tags,
       suggestions: this.props.suggestions,
     };
     this.handleDelete = this.handleDelete.bind(this);
     this.handleAddition = this.handleAddition.bind(this);
     this.handleDrag = this.handleDrag.bind(this);
     this.handleTagClick = this.handleTagClick.bind(this);
     this.handleInputBlur = this.handleInputBlur.bind(this);
   }

   handleDelete(i) {
     let tags = this.state.tags.filter((tag, index) => index !== i);
     this.props.onChange(tags.map(e => e.text));
     this.setState({
       tags: tags,
     });
   }

   handleAddition(tag) {
     console.log(tag);
     this.setState(state =>{
       tag = { id: (state.tags.length + 1).toString(), text: tag.text };
       state.tags.push(tag)
       this.props.onChange(state.tags.map(e => e.text));
       console.log(state);

       return state;
     });
   }

   handleDrag(tag, currPos, newPos) {
     const tags = [...this.state.tags];

     // mutate array
     tags.splice(currPos, 1);
     tags.splice(newPos, 0, tag);

     // re-render
     this.setState({ tags });
   }

   handleInputBlur(e){
     // console.log(e);
   }

   handleTagClick(index) {
     // console.log('The tag at index ' + index + ' was clicked');
   }

   render() {
     const { tags, suggestions } = this.state;
     for (let tag of tags) tag.id = tag.id.toString();

     return (
       <div>
       <ReactTags
           classNames={{
             tagInputField: '',
             tags: 'form-control tags',
           }}
           tags={tags}
           suggestions={suggestions}
           handleDelete={this.handleDelete}
           handleAddition={this.handleAddition}
           handleDrag={this.handleDrag}
           handleTagClick={this.handleTagClick}
           handleInputBlur={this.handleInputChange}
         />
      </div>
     );
   }

}
