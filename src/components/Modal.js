import './Modal.css';

export function Modal(props) {
  const { onClose } = props;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>Relación</h2>
        <p>Aquí va la explicación.</p>
        <p>En proceso.</p>
      </div>
    </div>
  );
}