import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and PDF files are allowed." },
        { status: 400 },
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    try {
      // For now, we'll use mock upload since Firebase Storage requires proper setup
      // In production, you would uncomment the Firebase code below and remove this mock section

      const timestamp = Date.now()
      const fileExtension = file.name.split(".").pop()
      const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`

      // Mock successful upload
      const mockUrl = `/uploads/${filename}`

      return NextResponse.json({
        success: true,
        filename,
        url: mockUrl,
        size: file.size,
        type: file.type,
        message: "File uploaded successfully (mock storage)",
      })

      /* 
      // Uncomment this section when Firebase Storage is properly configured:
      
      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage")
      const { storage } = await import("@/lib/firebase")
      
      // Create a unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split(".").pop()
      const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`

      // Create a reference to Firebase Storage
      const storageRef = ref(storage, `uploads/${filename}`)

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: file.type,
      })

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      return NextResponse.json({
        success: true,
        filename,
        url: downloadURL,
        size: file.size,
        type: file.type,
        message: "File uploaded successfully to Firebase Storage",
      })
      */
    } catch (firebaseError) {
      console.error("Firebase upload error:", firebaseError)

      // Fallback to mock upload if Firebase fails
      const timestamp = Date.now()
      const fileExtension = file.name.split(".").pop()
      const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`
      const mockUrl = `/uploads/${filename}`

      return NextResponse.json({
        success: true,
        filename,
        url: mockUrl,
        size: file.size,
        type: file.type,
        message: "File uploaded to mock storage (Firebase unavailable)",
      })
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Upload endpoint - use POST to upload files",
    supportedTypes: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
    maxSize: "5MB",
    note: "Currently using mock storage. Configure Firebase Storage for production use.",
  })
}
