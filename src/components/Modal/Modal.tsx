import { useCallback, useEffect, useRef, useState } from "react";

import "./style.scss";

interface ModalProps {
  children: JSX.Element;
  className?: string;
  open?: boolean;
  onClose?: () => void;
}

function Modal({ children, className = "", open, onClose }: ModalProps) {
  const [isOpen, setOpen] = useState(open);
  const contentRef = useRef<HTMLDivElement | undefined>();

  const onModalClick = useCallback(
    (ev: any) => {
      if (
        !contentRef.current?.contains(
          ev.nativeEvent.composedPath()[0] as HTMLElement
        )
      ) {
        setOpen(false);
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    setOpen(open);
  }, [open]);

  return (
    <div
      id="modal"
      style={{ display: isOpen ? "flex" : "none" }}
      className={className}
      onClick={(ev: any) => onModalClick(ev)}
    >
      <div id="modal-content" ref={(ref) => ref && (contentRef.current = ref)}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
