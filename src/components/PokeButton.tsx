interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export default function PokeButton({
    children,
    onClick,
    disabled = false
}: Props) {

    return (

        <button
            disabled={disabled}
            onClick={onClick}
            className="w-full rounded-lg bg-gold px-4 py-2 font-semibold text-navy border-navy border-[1px] transition-colors hover:bg-gold-light disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer">
            {children}
        </button>

    );

}