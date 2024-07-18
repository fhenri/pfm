import mongoose from "mongoose";
import CurrencyAPI from '@everapi/currencyapi-js';
import ExchangeRate from '@/types/currencyExchangeRate';

export async function getAmountEUR (
    fromCurrency: string,
    amount: number,
    transactionDate: Date): Promise<number> {
    try {
        const baseCurrency = 'EUR';
        if (fromCurrency === baseCurrency) {
            return amount;
        }
        const dbRate = await getDBRate(fromCurrency, baseCurrency, transactionDate);
        if (dbRate == 1) {
            const currencyApi = new CurrencyAPI(process.env.CURRENCY_API_KEY);
            const apiData = await currencyApi.historical({
                date: transactionDate.toISOString().split('T')[0],
                base_currency: fromCurrency,
                currencies : baseCurrency});
            if (apiData.message === 'Validation error') {
                console.error('Currency API error:', apiData.errors);
                return amount;
            }
            const apiRate = apiData.data[baseCurrency].value;
            await saveDBRate(fromCurrency, baseCurrency, transactionDate, apiRate);
            return amount * apiRate;
        } else {
            console.log(`using db-rate: Rate: ${dbRate} and amount: ${amount}`);
            return amount * dbRate;
        }
    } catch (e) {
        console.error(e);
        return amount;
    }
}

export async function getDBRate(
    fromCurrency: string,
    toCurrency: string,
    txDate: Date): Promise<number> {

    const endOfDay = new Date(txDate);
    endOfDay.setDate(txDate.getDate() + 1);

    const dbRate = await ExchangeRate.findOne({
        FromCurrency: fromCurrency,
        ToCurrency: toCurrency,
        RateDate: {
            $gte: txDate,
            $lte: endOfDay
        }
    });

    if (dbRate !== null) {
        return dbRate.Rate;
    } else {
        return 1;
    }
}

export async function saveDBRate(
    fromCurrency: string,
    toCurrency: string,
    date: Date,
    rate: number) {

    const dbRate = await ExchangeRate.create({
        _id: new mongoose.Types.ObjectId(),
        FromCurrency: fromCurrency,
        ToCurrency: toCurrency,
        RateDate: date,
        Rate: rate
    });
    dbRate.save();
}