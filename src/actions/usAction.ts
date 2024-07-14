"use server";

import * as userService from '@/services/userService';
import { getSessionUser } from '@/lib/auth';
import { revalidatePath } from "next/cache";

export async function setUserProfileForm(
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
    const currentUser = await getSessionUser();
    userService.setUserProfile(currentUser, formData)
    revalidatePath('/');
}

export async function addProfile(
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
    const currentUser = await getSessionUser();
    userService.addSvcProfile(currentUser, formData.get('profileName'))
    revalidatePath('/');
}

export async function deleteProfile(
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
    const currentUser = await getSessionUser();
    userService.delSvcProfile(currentUser, formData.get('profileName'))
    revalidatePath('/');
}

export async function addAccountToProfile(
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
    const currentUser = await getSessionUser();
    userService.addSvcAccountToProfile(currentUser, formData.get('profileName'), formData.get('accountId'));
    revalidatePath('/');
}

export async function removeAccountToProfile(
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> {
    const currentUser = await getSessionUser();
    userService.remSvcAccountToProfile(currentUser, formData.get('profileName'), formData.get('accountId'));
    revalidatePath('/');
}

