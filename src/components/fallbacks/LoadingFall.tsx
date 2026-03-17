const LoadingFallback = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center h-fit mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-white border-gray-700"></div>
        </div>
    );
};

export default LoadingFallback;