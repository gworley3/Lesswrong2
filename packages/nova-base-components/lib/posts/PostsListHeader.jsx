import Telescope from 'meteor/nova:lib';
import React from 'react';
import Categories from "meteor/nova:categories";

const PostsListHeader = () => {

  return (
    <div>
      <div className="posts-list-header">
        <div className="posts-list-header-categories">
          <Telescope.components.CategoriesList />
        </div>
        <Telescope.components.PostsViews />
        <Telescope.components.SearchForm/>
      </div>
    </div>
  )
}

PostsListHeader.displayName = "PostsListHeader";

module.exports = PostsListHeader;
export default PostsListHeader;
