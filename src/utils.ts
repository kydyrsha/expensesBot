export function parseAmount(input: string): number | null {
    const normalized = input.replace(',', '.')
    const amount = parseFloat(normalized)
    return isNaN(amount) ? null : amount
}