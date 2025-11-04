import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { db } from "@/app/index";
import { user, account } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { hashPassword } from "@/app/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Validate required fields
    if (!firstNames || !lastNames || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user
    const userId = nanoid();
    const hashedPassword = await hashPassword(password);

    await db.insert(user).values({
      id: userId,
      firstNames,
      lastNames,
      email,
      emailVerified: false,
      role,
      isActive: true,
      phone: phone || null,
      speciality: speciality || null,
      licenseNumber: licenseNumber || null,
      department: department || null,
      description: description || null,
      education: education || null,
      certifications: certifications || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create account with password
    await db.insert(account).values({
      id: nanoid(),
      userId,
      accountId: userId,
      providerId: "credential",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
