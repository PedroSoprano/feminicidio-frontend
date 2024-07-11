import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface InactivityModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onTimeout: () => void;
  timeoutDuration: number;
  onStay: () => void;
}

const InactivityModal: React.FC<InactivityModalProps> = ({
  isOpen,
  onRequestClose,
  onTimeout,
  onStay,
  timeoutDuration,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(onTimeout, timeoutDuration * 1000); // Convertendo segundos para milissegundos
    }
    return () => clearTimeout(timer);
  }, [isOpen, onTimeout, timeoutDuration]);

  return (
    <Dialog open={isOpen} onClose={onRequestClose}>
      <DialogTitle>Você ainda está aí?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Você será desconectado em breve se não responder.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onStay} color="primary">
          Estou aqui
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InactivityModal;
