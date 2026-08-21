import type { Clue } from "../types/Clue";

interface Props {
    index: number;
    clue?: Clue | undefined;
    state: "empty" | "filled" | "pass" | "selected";
    clueGiver: boolean;
    onClick:()=> void;
    hideMobile: boolean;
}

export default function ClueButton({
    index,
    clue,
    state,
    clueGiver,
    onClick,
    hideMobile
}: Props) {

    // const getBackground = () => {

    //     switch (state) {

    //         case "selected":
    //             return "#FFE55A";

    //         case "pass":
    //             return "#FF7A7A";

    //         case "filled":
    //             return "#FFF7DA";

    //         default:
    //             return index < 25
    //                 ? "#EAF4FF"
    //                 : "#FFEAEA";
    //     }
    // };

    const getBackground = () => {

        switch (state) {

            case "selected":
                return "var(--color-selected)";

            case "pass":
                return "var(--color-pass)";

            case "filled":
                return "var(--color-filled)";

            default:
                return index < 25
                    ? "var(--color-blue)"
                    : "var(--color-red)";
        }
    };

    const text = clue?.pass
        ? "PASS"
        : clue?.text ?? "";

    let textSize = "text-base";

    if (text.length > 10)
        textSize = "text-sm";

    if (text.length > 13)
        textSize = "text-xs";

    return (
        <div className={`${hideMobile ? "hidden" : ""} clip-path-hex min-w-[60vw] text-navy md:min-w-auto md:flex items-center bg-black justify-center p-1 disabled:cursor-default`}>
            <button
                type="button"
                onClick={onClick}
                disabled={clue?.pass || !clueGiver}
                className="clip-path-hex flex items-center justify-center w-full h-full disabled:cursor-default"
                style={{
                    backgroundColor: getBackground(),
                }}
            >
                <div
                    className={`${textSize} font-bold text-center leading-none whitespace-nowrap overflow-hidden p-1`}
                >
                    {text || index + 1}
                </div>
            </button>
        </div>
    );
}