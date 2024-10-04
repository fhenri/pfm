import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';

import dbConnect from '@/lib/mongo';

import Papa from 'papaparse';
import CategoryRule from '@/types/txRules';
import Category from '@/types/txCategory';

export const dynamic = 'force-dynamic' // defaults to auto

type CsvRowType = {
    description: string;
    category: string;
};

export async function GET (req: NextRequest, res: NextResponse) {
    try {
        await dbConnect();

        const file = await fs.readFile(process.cwd() + '/src/config/rules.csv', 'utf8');
        Papa.parse(file, {
            complete: async function(results) {
                // dont use forEach here
                for (const result in results.data) {
                    const csvRow = results.data[result] as CsvRowType;
                    const ruleKey:string = csvRow.description;
                    const ruleCategory:string = csvRow.category;

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
                }
            },
            skipEmptyLines: true,
            header: true,
        });

        return new Response('data imported', {
            status: 200
        })

    } catch (e) {
        console.error(e);
        return new Response('cannot import rules', {
            status: 500
        })
    }
}
