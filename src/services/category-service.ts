import CategoryRule, { ICategoryRules } from '@/types/txRules';
import Category, { ICategory } from '@/types/txCategory';

const getCategoryForTransaction =
async(description: string):Promise<String[]> => {
    const categoryRules = await getCategoryRules();
    const rule = categoryRules.find((crule) => description.includes(crule._id));
    if (rule) {
        return rule.Categories;
    }
    return [];
}

const getCategoryRules =
async():Promise<ICategoryRules[]> => {
    try {
        return await CategoryRule.find().sort({
            _id: "asc",
        });
    } catch (e) {
        console.error(e);
        return [];
    }
}

const getCategoryData =
async():Promise<ICategory[]> => {
    try {
        const categoryList = await Category.find().sort({
            CategoryName: "asc",
        });
        return categoryList;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export {
    getCategoryForTransaction,
    getCategoryRules,
    getCategoryData
}