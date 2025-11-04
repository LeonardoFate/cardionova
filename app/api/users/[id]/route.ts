import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/index";
import { user, account } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      firstNames,
      lastNames,
      email,
      password,
      role,
      phone,
      speciality,
      licenseNumber,
      department,
      description,
      education,
      certifications,
    } = body;

    // Update user
    await db
      .update(user)
      .set({
        firstNames,
        lastNames,
        email,
        role,
        phone: phone || null,
        speciality: speciality || null,
        licenseNumber: licenseNumber || null,
        department: department || null,
        description: description || null,
        education: education || null,
        certifications: certifications || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id));

    // Update password if provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db
        .update(account)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(account.userId, id));
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
