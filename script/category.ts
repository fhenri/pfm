#!/usr/bin/env tsx

import mongoose, { Connection } from "mongoose";
import Papa from 'papaparse';
import fs from 'fs';
import CategoryRule from '@/types/txRules';
import Category from '@/types/txCategory';

type CsvRowType = {
    description: string;
    category: string;
};

async function updateCategoryAndRules(filename: string) {
    console.log('update category and category rules:', filename);

    //const readableStream = fs.createReadStream(filename, { encoding: 'utf-8' });
    const fileContent = fs.readFileSync(filename, { encoding: 'utf-8' });
    Papa.parse(fileContent, {
        complete: async function(results) {
            for (const result in results.data) {
                const csvRow = results.data[result] as CsvRowType;
                const ruleKey: string = csvRow.description;
                const ruleCategory: string = csvRow.category;

                let rule = await CategoryRule.findById(ruleKey);
                if (rule == null) {
                    const rule = await CategoryRule.create({
                        _id: ruleKey,
                        Categories: [ ruleCategory ]
                    });
                } else {
                    if (rule.Categories.indexOf(ruleCategory) === -1) {
                        rule.Categories.push(ruleCategory);
                        rule.save();
                    }
                }

                const existCategory =
                    await Category.findOne({ CategoryName: ruleCategory }).exec();
                if (!existCategory) {
                  const nCategory = new Category({
                    _id: new mongoose.Types.ObjectId(),
                    CategoryName: ruleCategory
                  });
                  await nCategory.save();
                }
            }
        },
        skipEmptyLines: true,
        header: true,
    });

    return;
}

async function main() {
    const db = await mongoose.connect(process.env.MONGODB_URI!);
    await updateCategoryAndRules(process.cwd() + '/script/category_rules.csv');
    console.log("done update")

}

main().catch(console.error);
