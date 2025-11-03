import 'dotenv/config';

async function createTestUser() {
  try {
    console.log("🔐 Creando usuario de prueba...");

    const response = await fetch("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@cardionova.com",
        password: "admin123",
        name: "Dr. Administrador",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Usuario creado exitosamente:");
      console.log("   Email: admin@cardionova.com");
      console.log("   Password: admin123");
      console.log("   Nombre: Dr. Administrador");
      console.log("\n📝 Ahora necesitas actualizar el rol a 'admin' en la base de datos");
      console.log("   ID del usuario:", data.user?.id);
    } else {
      const error = await response.text();
      console.error("❌ Error creando usuario:", error);
    }

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createTestUser();
