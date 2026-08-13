interface Props {
    title: string;
}

export default function TitleBar({
    title
}: Props) {

    return (

        <div className="flex items-center justify-center rounded-lg border border-gold bg-gradient-to-r from-light via-dark to-light shadow-md shadow-slate-900/15 tracking-wide">
            {title && (
                <div className="flex items-center justify-center font-bold -skew-x-25 text-3xl bg-[linear-gradient(-3deg,var(--color-gold),var(--color-gold),var(--color-background),var(--color-gold),var(--color-gold))] bg-clip-text text-transparent [-webkit-text-stroke:1px_navy]">
                    {title}
                </div>
            )}
        </div>

    );

}