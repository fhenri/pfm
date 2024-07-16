"use server";

import { getSession } from '@auth0/nextjs-auth0';
import User from '@/types/tenancy';
import { kv } from "@vercel/kv";

export async function getMyUser() {
      const session = await getSession();
      if (!session) return null;

      const auth0User = session.user;
      const dbUser = await User.findOne({ name: auth0User.name});

      if (!dbUser) return { ...auth0User, profile: [] };
      else return { ...auth0User, profile: dbUser.profileList };
}

export async function setUserProfile(user, profile: string) {
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

export async function getUserAvailableProfile(user) {
    const dbUser = await User.findOne({ name: user.name}) as User;
    if (dbUser === null) return null;
    return dbUser.profileList;
}

export async function getCurrentAccountList(user) {
    const currentProfileName = await getCurrentUserProfile(user);
    if (!currentProfileName) return null;
    const currentProfile = user.profile?.find(p => p.name === currentProfileName);
    if (!currentProfile) return null;
    return currentProfile.accountList;
}

export async function addSvcProfile(user, profile: string) {
    console.log("Adding profile to user:", user.name, profile)
    if (!profile) {
        console.error("Profile name is required.");
        return;
    }

    try {
        let dbUser: User = await User.findOne({ name: user.name });
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

        const profileObject = { name: profile, profileList: [] };
        dbUser.profileList.push(profileObject);
        await dbUser.save();
    } catch (error) {
        console.error("Error adding profile to user:", error);
    }
}

export async function delSvcProfile(user, profile: string) {
    if (!profile) {
        console.error("Profile name is required.");
        return;
    }

    try {
        const dbUser: User = await User.findOne({ name: user.name });
        if (!dbUser) {
            console.error("User not found.");
            return;
        }

        // Find the index of the profile to be deleted
        const profileIndex = dbUser.profileList.findIndex(p => p.name === profile);
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

export async function addSvcAccountToProfile(user, profile: string, accountId: string) {
    if (!profile) {
        console.error("Profile name is required.");
        return;
    }

    try {
        const dbUser: User = await User.findOne({ name: user.name });
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

        // add AccountId to the profile
        dbUser.profileList[profileIndex].accountList.push(accountId);

        // Save the updated user back to the database
        await dbUser.save();
    } catch (error) {
        console.error("Error adding profile to user:", error);
    }
}
export async function remSvcAccountToProfile(user, profile: string, accountId: string) {
    if (!profile) {
        console.error("Profile name is required.");
        return;
    }

    try {
        const dbUser: User = await User.findOne({ name: user.name });
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
        const accountIndex = dbUser.profileList[profileIndex].accountList.findIndex(a => a === accountId);
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