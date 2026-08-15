export function normalizeForComparison(text: string): string {
    return text
        .replace(/♀/g, "F")
        .replace(/♂/g, "M")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
}