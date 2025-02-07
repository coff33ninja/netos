
interface ErrorStateProps {
    message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => {
    return (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
            {message}
        </div>
    );
};
