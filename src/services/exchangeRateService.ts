import mongoose from "mongoose";
import CurrencyAPI from '@everapi/currencyapi-js';
import ExchangeRate from '@/types/currencyExchangeRate';

export async function getAmountEUR (
    fromCurrency: string,
    amount: number,
    transactionDate: Date): Promise<number> {
    try {
        if (fromCurrency == 'EUR') {
            return amount;
        }
        const baseCurrency = 'EUR';
        const dbRate = await getDBRate(fromCurrency, baseCurrency, transactionDate);
        if (dbRate == 1) {
            console.log("making api call to get rate for date:", transactionDate);
            const currencyApi = new CurrencyAPI(process.env.CURRENCY_API_KEY);
            /*
            const apiData = await currencyApi.historical({
                date: '2024-05-22',
                base_currency: fromCurrency,
                currencies : baseCurrency});
            const apiRate = apiData.data[fromCurrency].value;
            await saveDBRate(fromCurrency, baseCurrency, transactionDate, apiRate);
            console.log(`Rate: ${apiRate} and amount: ${amount / apiRate}`);
            return amount / apiRate;
            */
            return amount;
        } else {
            console.log(`using db rate: Rate: ${dbRate} and amount: ${amount} = ${amount * dbRate}`);
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
    date: Date): Promise<number> {

    const dbRate = await ExchangeRate.findOne({
        FromCurrency: fromCurrency,
        ToCurrency: toCurrency,
        RateDate: date,
    });
    console.log("search exchange rate with: ", fromCurrency, toCurrency, date, dbRate);

    if (dbRate != null) {
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