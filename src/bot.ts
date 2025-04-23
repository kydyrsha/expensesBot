import { Telegraf } from 'telegraf'
import { config } from 'dotenv'
import cron from 'node-cron'
import { loadExpenses, saveExpenses } from './storage'
import { parseAmount } from './utils'

config()
const bot = new Telegraf(process.env.BOT_TOKEN!)

let expenses = loadExpenses()

bot.on('text', (ctx) => {
    const userId = String(ctx.from.id)
    const amount = parseAmount(ctx.message.text)

    if (amount !== null) {
        if (!expenses[userId]) expenses[userId] = []
        expenses[userId].push(amount)
        saveExpenses(expenses)

        ctx.reply(`💸 Записал: ${amount}₸`)
    } else {
        ctx.reply('Напиши сумму расхода, например: 1200 или 500.50')
    }
})

// Рассылка в 23:59 каждый день
cron.schedule('59 23 * * *', async () => {
    for (const [userId, amounts] of Object.entries(expenses)) {
        const total = amounts.reduce((sum, val) => sum + val, 0)
        await bot.telegram.sendMessage(userId, `📊 Сегодня ты потратил: ${total.toFixed(2)}₸`)
    }

    expenses = {} // очищаем
    saveExpenses(expenses)
})

bot.launch()
console.log('🤖 Бот запущен')