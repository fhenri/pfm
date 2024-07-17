import dbConnect from '@/lib/mongo';

export async function register() {
    await dbConnect()
}
