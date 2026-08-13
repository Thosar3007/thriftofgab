interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export default function PrimaryButton({
    children,
    onClick,
    disabled = false
}: Props) {

    return (

        <button
            disabled={disabled}
            onClick={onClick}
            className="
                rounded-lg
                bg-blue-600
                px-4
                py-2
                font-semibold
                text-white
                transition-colors
                hover:bg-blue-700
                disabled:bg-gray-400
                disabled:cursor-not-allowed
            "
        >

            {children}

        </button>

    );

}