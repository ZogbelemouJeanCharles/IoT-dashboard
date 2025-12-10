import RBModal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function Modal({ open, title, onClose, children }) {
  return (
    <RBModal show={open} onHide={onClose} centered backdrop="static">
      <RBModal.Header closeButton>
        <RBModal.Title>{title}</RBModal.Title>
      </RBModal.Header>
      <RBModal.Body>{children}</RBModal.Body>
      <RBModal.Footer>
        <Button variant="secondary" onClick={onClose}>Annuleren</Button>
        {/* De “Opslaan” knop wordt altijd vanuit het formulier aangestuurd; laat hier leeg of maak prop mee als je wilt */}
      </RBModal.Footer>
    </RBModal>
  );
}


