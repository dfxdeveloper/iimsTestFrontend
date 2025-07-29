import toast from 'react-hot-toast';

const defaultDuration = 5000; 

export const toastConfig = {
  success: {
    duration: defaultDuration,
    icon: '🎉',
    style: {
      background: '#4850E4',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '99px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    },
  },
  error: {
    duration: defaultDuration,
    style: {
      background: '#ff4b4b',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '99px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    },
  },
  loading: {
    style: {
      background: '#1a1a1a',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '99px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    },
  },
};

export const toastCustomConfig = {
  position: "top-center",
  reverseOrder: false,
  gutter: 8,
  toastOptions: {
    duration: defaultDuration,
    style: {
      borderRadius: '99px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    },
    animate: {
      enter: () => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        },
      }),
      exit: () => ({
        opacity: 0,
        scale: 0.9,
        y: -20,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 1, 1],
        },
      }),
    },
  },
};

export const showToast = {
  promise: (promise, messages, config = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'An error occurred',
      },
      {
        ...toastConfig,
        ...config,
      }
    );
  },
  success: (message, config = {}) => {
    return toast.success(message, {
      ...toastConfig.success,
      ...config,
    });
  },
  error: (message, config = {}) => {
    return toast.error(message, {
      ...toastConfig.error,
      ...config,
    });
  },
};