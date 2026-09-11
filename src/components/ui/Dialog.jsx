import Modal from "./Modal";

// Thin alias so either name can be used for a plain content modal.
export default function Dialog(props) {
  return <Modal {...props} />;
}
