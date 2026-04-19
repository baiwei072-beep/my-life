"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function safeMessage(message) {
  return encodeURIComponent(message);
}

function normalizeUsername(rawValue) {
  return String(rawValue || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_-]/g, "");
}

function usernameToEmail(username) {
  return `${username}@gmail.com`;
}

export async function signIn(formData) {
  const username = normalizeUsername(formData.get("username"));
  const password = String(formData.get("password") || "").trim();
  const supabase = await createClient();
  const email = usernameToEmail(username);

  if (username.length < 3) {
    redirect(`/login?error=${safeMessage("用户名至少需要 3 位，只能使用字母、数字、下划线或短横线。")}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${safeMessage(error.message)}`);
  }

  redirect("/");
}

export async function signUp(formData) {
  const username = normalizeUsername(formData.get("username"));
  const password = String(formData.get("password") || "").trim();
  const nickname = String(formData.get("nickname") || "").trim();
  const supabase = await createClient();
  const email = usernameToEmail(username);

  if (username.length < 3) {
    redirect(`/login?error=${safeMessage("用户名至少需要 3 位，只能使用字母、数字、下划线或短横线。")}`);
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        nickname,
      },
    },
  });

  if (error) {
    redirect(`/login?error=${safeMessage(error.message)}`);
  }

  redirect("/login?message=" + safeMessage("注册成功。现在可以直接用用户名和密码登录。"));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login?message=" + safeMessage("你已经退出当前空间。"));
}

export async function updateProfile(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const nickname = String(formData.get("nickname") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const avatarPreset = String(formData.get("avatar_preset") || "bug-purple");

  const { error } = await supabase
    .from("profiles")
    .update({
      nickname,
      bio,
      avatar_preset: avatarPreset,
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/settings/profile?error=${safeMessage(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/settings/profile");
  redirect("/settings/profile?message=" + safeMessage("资料已保存。"));
}

export async function createPost(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const category = String(formData.get("category") || "daily").trim();
  const content = String(formData.get("content") || "").trim();

  if (!title || !content) {
    redirect("/?error=" + safeMessage("标题和正文不能为空。"));
  }

  const { data: space } = await supabase
    .from("spaces")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  const { error } = await supabase.from("posts").insert({
    owner_id: user.id,
    space_id: space?.id || null,
    title,
    summary,
    category,
    content,
  });

  if (error) {
    redirect("/?error=" + safeMessage(error.message));
  }

  revalidatePath("/");
  redirect("/?message=" + safeMessage("新内容已经放进你的空间。"));
}

export async function deletePost(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const postId = String(formData.get("post_id") || "").trim();

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("owner_id", user.id);

  if (error) {
    redirect("/?error=" + safeMessage(error.message));
  }

  revalidatePath("/");
  redirect("/?message=" + safeMessage("这条内容已经删除。"));
}
