import { useEffect, useRef, useState } from "react";
import "./ArchivedDataModal.css";
import { Item } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { formatDate } from "../../utils/formatters";
import { ChangeEvent } from "react";

interface ArchivedDataModalProps {
  archivedItemsPreview: Item[],
  viewArchivePreview: (vehicleId: string) => Promise<void>,
  vehicleId: string,
  setArchivedItemsPreview: Dispatch<SetStateAction<Item[]>>,
  archivePreviewVehicleId: string,
  handleDeleteVehicle: (id: string) => Promise<void>,
  recoverArchivedItem: (vehicleId: string) => Promise<void>,
  vehicleName: string,
}

function ArchivedDataModal({ vehicleName, archivedItemsPreview, viewArchivePreview, setArchivedItemsPreview, vehicleId, archivePreviewVehicleId, handleDeleteVehicle, recoverArchivedItem }: ArchivedDataModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [recoverLoading, setRecoverLoading] = useState(false);
    const [manageLoading, setManageLoading] = useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);

    const handleManageBtnClick = async () => {
      setManageLoading(true)
      await viewArchivePreview(vehicleId)
      dialogRef.current?.showModal();
      setModalIsOpen(true)
      setManageLoading(false)
    }

    const closeModal = () => {
      setArchivedItemsPreview([])
      dialogRef.current?.close();
      setModalIsOpen(false)
    };

    const handleCloseModal = (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && modalIsOpen) {
        closeModal();
      }
    }

    const handleDeleteButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        setDeleteLoading(true);
        await handleDeleteVehicle(archivePreviewVehicleId);
        setDeleteLoading(false);
        document.body.classList.remove("overflow-hidden");
      } catch (error) {
        console.error("Error deleting items: ", error);
      }
    };

    const handleRecoverButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      try {
        setRecoverLoading(true);
        await recoverArchivedItem(archivePreviewVehicleId);
        setRecoverLoading(false);
        document.body.classList.remove("overflow-hidden");
      } catch (error) {
        console.error("Error recovering items: ", error)
      }
    }

    const handleDeleteConfChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.trim() == "delete") {
        setDeleteConfirmed(true);
      } else {
        setDeleteConfirmed(false);
      }
  };

    useEffect(() => {    
        if (modalIsOpen) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }
    }, [modalIsOpen]);
    
    return (
        <>
          <button className="btn btn-sm btn-secondary" onClick={handleManageBtnClick}>
            {manageLoading === true ? (
              <div className="spinner"></div>
            ) : (
              <i className="bi bi-database-fill-gear"></i> 
            )}
            <span> Manage</span>
          </button>
          <dialog ref={dialogRef} onKeyDown={(e) => handleCloseModal(e)} className="archived-modal">
            <button className="btn btn-sm btn-secondary archived-modal__close-btn" onClick={closeModal}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="archived-modal__content-wrapper">
              <h2>Vehicle name: {vehicleName}</h2>
              <div>
                  <div className="mb-1">
                    <p className="pb-1">This vehicle and associated items will be recovered back to your log.</p>
                    <button onClick={(e) => handleRecoverButtonClick(e)} className="btn btn-sm btn-secondary">
                      {recoverLoading === true ? (
                        <div className="spinner"></div>
                      ) : (
                        <i className="bi bi-arrow-counterclockwise"></i>
                      )}
                      <span> Recover</span>
                    </button>
                  </div>
                  <div>
                    <p className="pb-1">This vehicle and associated items will be permanently deleted.</p>
                    <div className="d-flex gap-1">
                      <input type="text" placeholder="delete" onChange={(e) => handleDeleteConfChange(e)} />
                      <button onClick={(e) => handleDeleteButtonClick(e)} className="btn btn-sm btn-danger" disabled={!deleteConfirmed}>
                        {deleteLoading === true ? (
                          <div className="spinner"></div>
                        ) : (
                          <i className="bi bi-trash3"></i>
                        )}
                        <span> Delete</span>
                      </button>
                    </div>
                    <span className="fs-small">Type "delete" to confirm.</span>
                  </div>
              </div>
              <p className="py-1 fw-bold">Associated items ({archivedItemsPreview.length}):</p>
              <div className="archived-modal__items-wrapper">
                {archivedItemsPreview.length > 0 && (
                      <>
                      {archivedItemsPreview.map((item) => (
                          <ul key={item.id} className="archived-modal__items-list fs-small">
                              <li><span className="fw-bold">Date:</span> {formatDate(item.date)}</li>
                              <li><span className="fw-bold">Description:</span> {item.description}</li>
                              <li><span className="fw-bold">Mileage:</span> {item.mileage}</li>
                              <li><span className="fw-bold">Vehicle:</span> {item.vehicle}</li>
                              <li><span className="fw-bold">Shop:</span> {item.shop}</li>
                              <li><span className="fw-bold">Cost:</span> {item.cost}</li>
                              <li><span className="fw-bold">Memo:</span> {item.memo}</li>
                          </ul>
                      ))}
                      </>
                  )}
              </div>
            </div>
          </dialog>
        </>
      );
}

export default ArchivedDataModal;