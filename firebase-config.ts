# 📋 HỆ THỐNG CHẤM ĐIỂM RÈN LUYỆN SINH VIÊN - PHÂN HIỆU HỌC VIỆN PHỤ NỮ VIỆT NAM

## 🎯 Mục Tiêu

Xây dựng một hệ thống web hoàn chỉnh giúc sinh viên tự chấm và giảng viên chấm điểm rèn luyện, kèm theo minh chứng, thông báo, và trình xuất kết quả.

## 👤 Vai trò

* **Sinh viên**: Điền phiếu, gửi minh chứng, quản lý hồ sơ.
* **Giảng viên**: Quản lý sinh viên, xem và chấm điểm, gửi thông báo.

## 🧩 Chức Năng Chi Tiết

### 🎓 Sinh Viên:

* Đăng ký/Đăng nhập Firebase Auth
* Điền 5 mục chấm điểm:

  1. Học tập (20)
  2. Chấp hành nội quy (25)
  3. Hoạt động xã hội (20)
  4. Quan hệ công dân (25)
  5. Công tác lớp (10)
* Upload minh chứng (PDF, ảnh)
* Lưu nháp / gửi phiếu
* Xuất PDF/CSV phiếu
* Nhận thông báo
* Cập nhật hồ sơ

### 👨‍🏫 Giảng Viên:

* Dashboard thống kê (UI dạng CRM, sidebar trái cố định)
* Xem danh sách sinh viên
* Thêm sinh viên qua email
* Chấm điểm phiếu theo từng mục
* Gửi thông báo
* Xuất CSV danh sách (đầy đủ trường: tên, MSSV, lớp, điểm từng mục, điểm tổng, trạng thái, ngày nộp...)

## 🔧 Tech Stack

* **Next.js 14** (App Router)
* **Tailwind CSS** (theme màu xanh BIDV `#005BAC`, dark mode)
* **TypeScript**
* **shadcn/ui**
* **Firebase Auth + Firestore**
* **Next.js API Routes** (upload, export, grading)
* **Render.com** cho hosting

## 📁 Cấu trúc Thư Mục

```
app/
├── layout.tsx
├── page.tsx (Login)
├── register/page.tsx
├── student/dashboard/page.tsx
├── teacher/dashboard/page.tsx
├── api/
│   ├── upload/route.ts
│   ├── scores/route.ts
│   ├── students/route.ts
│   ├── students/export/route.ts
│   ├── grading/route.ts
│   ├── notifications/route.ts
│   ├── export/pdf/route.ts
│   └── export/csv/route.ts
components/
├── providers/auth-provider.tsx
├── layout/
├── student/
├── teacher/
├── shared/
└── auth/
```

## 🧠 Firebase Config

```ts
const firebaseConfig = {
  apiKey: "AIzaSyA2o8XRt_K5QFSIU3hqcsraiBDBhIw2r6c",
  authDomain: "hethongrenluyenwomanacademy.firebaseapp.com",
  databaseURL: "https://hethongrenluyenwomanacademy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hethongrenluyenwomanacademy",
  storageBucket: "hethongrenluyenwomanacademy.appspot.com",
  messagingSenderId: "961977680525",
  appId: "1:961977680525:web:9a1ac982617bdc289918c4",
  measurementId: "G-SC30MV1DN8"
}
```

## 🔐 Firebase Firestore Rules

```ts
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /classes/{classId} {
      allow read, write: if request.auth != null && request.auth.token.role == "teacher";

      match /students/{studentId} {
        allow read, write: if request.auth != null && request.auth.uid == studentId;

        match /evaluations/{semesterId} {
          allow read, write: if request.auth != null &&
            (request.auth.uid == studentId || request.auth.token.role == "teacher");
        }
      }
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /notifications/{notifId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.role == "teacher";
    }
  }
}
```

## 🔢 Data Models

### User:

```ts
{
  uid: string,
  email: string,
  role: "student" | "teacher",
  fullName: string,
  studentId?: string,
  classId?: string,
  avatar?: string,
  phone?: string,
  dateOfBirth?: string,
  department?: string,
  position?: string,
  createdAt: string
}
```

### Scoring:

```ts
{
  semester: string,
  academicYear: string,
  section1: { selfScore: number, classScore?: number, teacherScore?: number, evidence: string, files?: string[] },
  section2: { selfScore: number, classScore?: number, teacherScore?: number, evidence: string, files?: string[] },
  section3: { selfScore: number, classScore?: number, teacherScore?: number, evidence: string, files?: string[] },
  section4: { selfScore: number, classScore?: number, teacherScore?: number, evidence: string, files?: string[] },
  section5: { selfScore: number, classScore?: number, teacherScore?: number, evidence: string, files?: string[] },
  totalSelfScore: number,
  finalScore?: number,
  status: "draft" | "submitted" | "graded",
  submittedAt?: Date,
  gradedAt?: Date
}
```

## 🔄 API Endpoints

* `/api/user/profile`
* `/api/scores`
* `/api/export/pdf`
* `/api/export/csv`
* `/api/students`
* `/api/students/export`
* `/api/grading`
* `/api/notifications`
* `/api/upload`

## 🧪 Demo Accounts

```json
{
  "sinhvien@demo.com": {
    "uid": "7YYBQjndOBTs5LkWc0NyjFbzQai2",
    "fullName": "Quách Thành Long",
    "role": "student"
  },
  "giangvien@demo.com": {
    "uid": "uOIFWpZIxlSnzsO9LiwBGrnTrU52",
    "fullName": "Phạm Chí Dũng",
    "role": "teacher"
  }
}
```

## 📎 File Upload

* JPG, PNG, PDF, max 5MB
* Lưu tại `/public/uploads/` hoặc Firebase Storage

## 📤 Export

* PDF = jsPDF
* CSV = UTF-8 BOM for Excel
* Gồm đầy đủ: Họ tên, MSSV, lớp, học kỳ, điểm từng mục, minh chứng, trạng thái, thời gian gửi

## 🔔 Notification

* Real-time
* Phân loại: info, success, warning, error

## 🎯 Workflow

### Sinh Viên:

1. Login
2. Điền phiếu
3. Upload minh chứng
4. Gửi
5. Nhận thông báo
6. Xuất PDF/CSV

### Giảng Viên:

1. Login
2. Xem danh sách phiếu
3. Chấm điểm
4. Gửi thông báo
5. Quản lý sinh viên
6. Xuất CSV

## ⚙️ Error Handling

* Error boundary
* Try-catch cho API
* Loading states
* Toast feedback
* Firebase fallback

## 📦 Dependencies

* firebase
* jspdf
* lucide-react
* next
* react
* tailwindcss

## 🧱 UI Components

* shadcn/ui: Card, Button, Toast, Dialog, Tabs, Avatar...
* Sidebar trái kiểu CRM: Quản lý lớp, phiếu, điểm, export, thông báo...

## 🪪 Logo & Cấu Hình Ban Đầu

* Logo PNG/SVG bạn sẽ thêm vào tại `app/layout.tsx`
* Danh sách lớp mặc định (import ban đầu): Có thể tạo thủ công hoặc dùng script add qua Firestore

## 🚀 Deployment

* Render hoặc Vercel
* Env vars Firebase
* Static uploads
* 404, 500 pages
