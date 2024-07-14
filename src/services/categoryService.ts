import CategoryRule, { ICategoryRules } from '@/types/txRules';

export async function getCategoryForTransaction(description: string) {
    const categoryRules = await getCategoryRules();
    const rule = categoryRules.find((crule) => description.includes(crule._id));
    if (rule) {
        return rule.Categories;
    }
    return [];
}

const getCategoryRules = async():Promise<ICategoryRules[]> => {
    try {
        return await CategoryRule.find().sort({
            _id: "asc",
        });
    } catch (e) {
        console.error(e);
        return [];
    }
}
