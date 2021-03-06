import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { registerComponent, Components } from 'meteor/vulcan:core';

class ChaptersItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
    }
  }

  showEdit = () => {
    this.setState({edit: true})
  }

  showChapter = () => {
    this.setState({edit: false})
  }

  renderTitleComponent = (chapter, canEdit) => <div>
    {chapter.subtitle ?   <div className="chapters-item-subtitle">
      {chapter.subtitle}
    </div> : null}
    {canEdit ? <a onClick={this.showEdit}>Add/Remove Posts</a> : null}
  </div>

  render() {
    const chapter = this.props.chapter;
    if (this.state.edit) {
      return <Components.ChaptersEditForm
                documentId={chapter._id}
                successCallback={this.showChapter}
                cancelCallback={this.showChapter} />
    } else {
      return <div className="chapters-item">
        <Components.Section title={chapter.title}
          titleComponent={this.renderTitleComponent(chapter, this.props.canEdit)}
        >
          {chapter.htmlDescription && <div className="chapters-item-description"> <div className="content-body" dangerouslySetInnerHTML={{__html: chapter.htmlDescription}}/> </div>}
          <div className="chapters-item-posts">
            <Components.SequencesPostsList posts={chapter.posts} chapter={chapter} />
          </div>
        </Components.Section>
      </div>
    }
  }
}

registerComponent('ChaptersItem', ChaptersItem)
