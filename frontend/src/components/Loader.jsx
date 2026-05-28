const Loader = ({ fullScreen = true }) => (
  <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
  </div>
);

export default Loader;
