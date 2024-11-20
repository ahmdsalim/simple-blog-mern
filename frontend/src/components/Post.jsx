import { LuTrash2, LuEye } from "react-icons/lu";
import DeleteModal from "./DeleteModal";
import { Link } from "react-router-dom";
import formatDate from "../utils/formateDate";

const Post = ({ data, index, handleConfirmDelete, handleDeleteId, loading}) => {
  const openModal = () => {
    handleDeleteId(data._id)
    document.getElementById("deleteModal").showModal()
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`w-full flex items-center justify-between ${ index !== 0 && 'border-t-[1px]'} py-4`}>
        <div className="flex flex-col flex-1">
          <Link to={`/my-posts/edit/${data._id}`} className="text-lg mb-2 hover:underline">
            { data.ps_title }
          </Link>
          <div className="flex gap-3 items-center">
            <p className="text-sm text-gray-500">{ formatDate(data.createdAt) }</p>
            <div className="flex p-2 rounded-xl border-[1px] border-slate-400 text-slate-400 text-xs">
              { data.category.cat_name }
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/${data._id}`} className="btn btn-sm text-gray-400 text-lg">
            <LuEye />
          </Link>
          <button className="btn btn-sm text-gray-400 text-lg" onClick={openModal}>
            <LuTrash2 />
          </button>
          <DeleteModal onDelete={() => handleConfirmDelete()} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Post;
