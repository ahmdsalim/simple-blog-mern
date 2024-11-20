const DeleteModal = ({ onDelete, loading }) => {
  return (
    <dialog id="deleteModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm delete</h3>
        <p className="py-4">Are you sure want to delete this item?</p>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={() => onDelete()} disabled={loading}>{ loading ? (<span className="loading loading-spinner loading-md"></span>) : 'Oke' }</button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteModal;
