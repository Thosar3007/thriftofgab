interface Props {
    title?: string;
    children?: React.ReactNode;
}

export default function Panel({
    title,
    children
}: Props) {

    return (

        <div className="flex flex-col h-full w-full rounded-lg border border-dark bg-background2 shadow-md justify-start">

            {title && (
                <div className="flex max-h-12 justify-self-start items-center justify-center px-4 py-2 font-bold">
                    {title}
                </div>
            )}

            {children && (
                <div className="flex-1 min-h-0 flex px-4 py-2">
                    {children}
                </div>
            )}

        </div>

    );

}