import { useNavigation } from "@react-navigation/native";

interface IErrorFallbackProps {
    resetErrorBoundary: (...args: unknown[]) => void;
}

const ErrorFallback = ({ resetErrorBoundary }: IErrorFallbackProps) => {
    const navigation = useNavigation();

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Hubo un problema en la solicitud!</h2>
            <div className="flex flex-col items-center justify-around border border-gray-200 rounded-2xl m-2 py-20 max-w-5xl w-full bg-white">
                <h2 className="md:text-4xl/14 text-2xl font-bold bg-linear-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">Opps!...</h2>
                <p className="mt-4 text-slate-500 max-w-xl text-center">Hubo un problema en la solicitud!</p>
                <div className="flex items-center gap-4 mt-6 text-sm">
                    <button type="button" onClick={() => resetErrorBoundary()} className="bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer px-8 py-3 text-white font-medium rounded-full active:scale-95">
                        Intentar de nuevo
                    </button>
                    <button type="button" onClick={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    }} className="group flex items-center gap-2 px-8 py-3 cursor-pointer font-medium border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 transition active:scale-95">
                        Go Home
                        <svg className="mt-1 group-hover:translate-x-1 transition-all" width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 5.5h13.092M8.949 1l5.143 4.5L8.949 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorFallback;