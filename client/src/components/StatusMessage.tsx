type StatusType = 'error' | 'success' | 'loading';

type Props = {
    message: string;
    type: StatusType;
    withSpinner?: boolean;
};

export const StatusMessage = ({ message, type, withSpinner }: Props) => {
    const baseStyle = 'px-4 py-2 rounded border mt-4 flex items-center gap-2 text-sm';

    const typeStyles: Record<StatusType, string> = {
        error: 'bg-red-100 text-red-800 border-red-300',
        success: 'bg-green-50 text-green-700 border-green-300',
        loading: 'bg-gray-100 text-gray-600 border-gray-300 animate-pulse',
    };

    return (
        <div className={`${baseStyle} ${typeStyles[type]}`}>
            {withSpinner && (
                <div role="status"
                     className="animate-spin h-4 w-4 border-t-2 border-b-2 border-current rounded-full" />
            )}
            <span>{message}</span>
        </div>
    );
};
