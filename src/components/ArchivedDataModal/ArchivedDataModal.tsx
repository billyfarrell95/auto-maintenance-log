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

    useEffect(() => {
        // @todo remove class when using "esc" to close modal
        document.body.classList.toggle("overflow-hidden");
    }, [modalIsOpen])
    return (
        <>
          <button onClick={openModal}>Open Modal</button>
          <dialog ref={dialogRef} className="modal">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <p>Modal</p>
          </dialog>
        </>
      );
}

export default ArchivedDataModal;