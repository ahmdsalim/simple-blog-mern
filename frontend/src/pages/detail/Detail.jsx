import axios from "axios";
import { GET_POSTS } from "../../services/api";
import { useLoaderData } from "react-router-dom";
import formatDate from "../../utils/formateDate.js"

export const loader = async ({params}) => {
  const { postId } = params
  const response = await axios.get(`${GET_POSTS}/${postId}`)
  const post = response.data.data

  return { post }
}

const Detail = () => {
  const { post } = useLoaderData()

  return (
    <div className="w-full flex items-center justify-center max-w-2xl">
      <div className="w-full flex items-center justify-center">
        <div className="w-full content px-4 sm:px-0">
          <h1 className="text-2xl md:text-4xl leading-snug font-custom font-extrabold my-[1.19em]">
            { post.ps_title }
          </h1>
          <article className="flex gap-x-4 items-center mb-9">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full p-4">
                <span className="text-lg font-custom">{ post.user.us_name.charAt(0).toUpperCase() }</span>
              </div>
            </div>
            <div className="flex-1 flex-col items-center font-custom">
              <p className="text-base">{ post.user.us_name }</p>
              <p className="text-sm text-gray-500">{ formatDate(post.createdAt) }</p>
            </div>
          </article>

          <div className="flex flex-col gap-y-5 text-wrap border-t-[1px] py-5">
            <img src={window.location.origin + `/thumbnails/${post.ps_thumbnail}`} alt="Thumbnail" />
            <article className="prose lg:prose-xl font-post-body break-words" dangerouslySetInnerHTML={{__html: post.ps_body}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
