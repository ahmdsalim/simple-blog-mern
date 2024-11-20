import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../utils/formateDate";

const Article = ({ post, index }) => {
  return (
    <div className="w-full flex-col items-center px-4 cursor-pointer">
      { index !== 0 && (<div className="w-full border-b-[1px] mb-6"></div>) }
      <Link to={`/${post._id}`} className={`w-full flex gap-x-2 items-center ${ index === 0 && 'mt-[20px]' } `}>
        <div className="flex-col flex-1">
          <div className="flex gap-2 items-center">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content w-6 rounded-full">
                <span className="font-custom text-gray-400">{ post.user.us_name.charAt(0).toUpperCase() }</span>
              </div>
            </div>
            <div className="flex">
              <p className="text-sm font-custom">{ post.user.us_name }</p>
            </div>
          </div>
          <h1 className="text-xl font-extrabold font-custom mt-3">
            { post.ps_title }
          </h1>
          <p className="text-gray-500 font-custom mt-2">
            { post.summary }
          </p>
          <p className="text-sm text-gray-600 font-custom mt-4 mb-6">{ formatDate(post.createdAt) }</p>
        </div>
        <div className="w-24 md:w-40">
          <img
            src={window.location.origin + `/thumbnails/${post.ps_thumbnail}`}
            alt="Thumbnail"
            loading="lazy"
          />
        </div>
      </Link>
    </div>
  );
};

export default Article;
