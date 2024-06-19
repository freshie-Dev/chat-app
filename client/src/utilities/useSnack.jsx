// hooks/useSnackbar.js
import { useSnackbar as useNotistackSnackbar } from 'notistack';


const useSnack = () => {
    const { enqueueSnackbar } = useNotistackSnackbar();
    

    const showSuccess = (message, options = {}) => {
        enqueueSnackbar(message, { variant: 'success', ...options });
    };

    const showError = (message, options = {}) => {
        enqueueSnackbar(message, { variant: 'error', ...options });
    };

    const showInfo = (message, options = {}) => {
        enqueueSnackbar(message, { variant: 'info', ...options });
    };

    const showWarning = (message, options = {}) => {
        enqueueSnackbar(message, { variant: 'warning', ...options });
    };

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };
};

export default useSnack;