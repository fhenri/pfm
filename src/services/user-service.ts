"use server";

import { getSession } from '@auth0/nextjs-auth0';
import User, {IUser, IProfile} from '@/types/tenancy';
import { kv } from "@vercel/kv";

export async function getMyUser() {
    const session = await getSession();
    if (!session) return null;

    const auth0User = session.user;
    const dbUser = await User.findOne({ name: auth0User.name}).exec();

    if (!dbUser) return { ...auth0User, profileList: [] };
    else return { ...auth0User, profileList: dbUser.profileList };
}

export async function setUserProfile(user: IUser, profile: string) {
    await kv.set(user.name, profile);
}

export async function getCurrentUserProfile(user) {
    try {
        const userProfile = await kv.get(user.name);
        return userProfile;
    } catch (e) {
        return null;
    }
}

export async function getUserAvailableProfile(user: IUser) {
    const dbUser = await User.findOne({ name: user.name});
    if (dbUser === null) return null;
    return dbUser.profileList;
}

export async function getCurrentAccountList(user: IUser) {
    const currentProfileName = await getCurrentUserProfile(user);
    if (!currentProfileName) return null;
    const currentProfile = user.profileList?.find(p => p.name === currentProfileName);
    if (!currentProfile) return null;
    return currentProfile.accountList;
}

export async function addSvcProfile(user: IUser, profile: string) {
    if (!profile) {
        console.error("Profile name is required.");
        return;
    }

    try {
        let dbUser: IUser | null = await User.findOne({ name: user.name });
        if (!dbUser) {
            // this is only case where we'll create the user
            console.error("User not found - creating");
            dbUser = new User({ name: user.name, profileList: [] });
            await dbUser.save();
        }

        // Check if profile with the same name already exists
        const existingProfile = dbUser.profileList.find(p => p.name === profile);
        if (existingProfile) {
            console.error(`Profile with name ${profile} already exists.`);
            return;
        }

        const profileObject: IProfile = { name: profile, accountList: [] };
        dbUser.profileList.push(profileObject);
        await dbUser.save();
    } catch (error) {
        console.error("Error adding profile to user:", error);
    }
}

export async function delSvcProfile(user: typeof User, profile: string) {
    if (!profile) {
        console.error("Profile name is required.");
        return;
    }

    try {
        const dbUser: IUser | null = await User.findOne({ name: user.name });
        if (!dbUser) {
            console.error("User not found.");
            return;
        }

        // Find the index of the profile to be deleted
        const profileIndex = dbUser.profileList.findIndex((p: IProfile) => p.name === profile);
        if (profileIndex === -1) {
            console.error(`Profile with name ${profile} does not exist.`);
            return;
        }

        // Remove the profile from the list
        dbUser.profileList.splice(profileIndex, 1);

        // Save the updated user back to the database
        await dbUser.save();
    } catch (error) {
        console.error("Error adding profile to user:", error);
    }
}

export async function addSvcAccountToProfile(user: typeof User, profile: string, accountId: string) {
    if (!profile) {
        console.error("Profile name is required.");
        return;
    }

    try {
        const dbUser: IUser | null = await User.findOne({ name: user.name });
        if (!dbUser) {
            console.error("User not found.");
            return;
        }

        // Find the index of the profile to be deleted
        const profileIndex = dbUser.profileList.findIndex((p: IProfile) => p.name === profile);
        if (profileIndex === -1) {
            console.error(`Profile with name ${profile} does not exist.`);
            return;
        }

        // add AccountId to the profile if it does not exists
        if (dbUser.profileList[profileIndex].accountList.includes(accountId)) {
            console.error(`Account ${accountId} already exists.`);
            return;
        } else {
            dbUser.profileList[profileIndex].accountList.push(accountId);
        }

        // Save the updated user back to the database
        await dbUser.save();
    } catch (error) {
        console.error("Error adding profile to user:", error);
    }
}
export async function remSvcAccountToProfile(user: typeof User, profile: string, accountId: string) {
    if (!profile) {
        console.error("Profile name is required.");
        return;
    }

    try {
        const dbUser: IUser | null = await User.findOne({ name: user.name });
        if (!dbUser) {
            console.error("User not found.");
            return;
        }

        // Find the index of the profile to be updated
        const profileIndex = dbUser.profileList.findIndex(p => p.name === profile);
        if (profileIndex === -1) {
            console.error(`Profile with name ${profile} does not exist.`);
            return;
        }

        // search AccountId from the profile
        const accountIndex = dbUser.profileList[profileIndex].accountList.findIndex((a: string) => a === accountId);
        if (profileIndex === -1) {
            console.error(`Account ${accountId} does not exist.`);
            return;
        }

        // remove AccountId from the profile
        dbUser.profileList[profileIndex].accountList.splice(accountIndex, 1);

        // Save the updated user back to the database
        await dbUser.save();
    } catch (error) {
        console.error("Error adding profile to user:", error);
    }
}