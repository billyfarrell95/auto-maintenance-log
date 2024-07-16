import { useEffect, useRef, useState } from "react";
import "./ArchivedDataModal.css";

function ArchivedDataModal() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        dialogRef.current?.showModal();
        setModalIsOpen(true)
    };

    const closeModal = () => {
        dialogRef.current?.close();
        setModalIsOpen(false)
    };

    const handleCloseModal = (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && modalIsOpen) {
        closeModal();
      }
    }

    useEffect(() => {    
        if (modalIsOpen) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }
    }, [modalIsOpen])
    return (
        <>
          <button onClick={openModal}>Open Modal</button>
          <dialog ref={dialogRef} onKeyDown={(e) => handleCloseModal(e)}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <p>Modal</p>
          </dialog>
        </>
      );
}

export default ArchivedDataModal;