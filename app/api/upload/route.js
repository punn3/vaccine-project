// app/api/upload/route.js
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request) {
    try {
        // 1. รับข้อมูลจากหน้าบ้าน (FormData)
        const data = await request.formData();
        const file = data.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // 2. แปลงไฟล์เป็น Buffer เพื่อเตรียมบันทึก
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);

        // 3. ตั้งชื่อไฟล์ใหม่ (ใส่วันที่ข้างหน้ากันชื่อซ้ำ และลบช่องว่าง)
        // ตัวอย่าง: 171569999_vaccine.jpg
        const fileName = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;

        // 4. หา Path ของโฟลเดอร์ public/img
        const uploadDir = path.join(process.cwd(), "public/img");
        const filePath = path.join(uploadDir, fileName);

        // 5. บันทึกไฟล์ลงเครื่อง
        await writeFile(filePath, buffer);

        // 6. ส่ง Path กลับไปบอกหน้าบ้าน
        return NextResponse.json({
            message: "Upload successful",
            imageUrl: `/img/${fileName}`,
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: "Error uploading file" },
            { status: 500 },
        );
    }
}
