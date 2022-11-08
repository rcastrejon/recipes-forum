import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';

export interface State extends SnackbarOrigin {
  open: boolean;
}

interface Props {
  inputText: string;
}

export const CustomSnackbar: React.FC<Props> = ({inputText}) => {
  React.useEffect(() => {
    setState({ ...state, open: true });
  }, [inputText]);

  const [state, setState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
        open={open}
        onClose={handleClose}
        message={inputText}
        key={vertical + horizontal}
      />
    </div>
  );
}


