import fs from 'fs'
import path from 'path'

const FILE_PATH = path.resolve(__dirname, '../data/expenses.json')

type ExpenseData = Record<string, number[]>

export function loadExpenses(): ExpenseData {
    try {
        const raw = fs.readFileSync(FILE_PATH, 'utf-8')
        return JSON.parse(raw)
    } catch (e) {
        return {}
    }
}

export function saveExpenses(data: ExpenseData) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
}