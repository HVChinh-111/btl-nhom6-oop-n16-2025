# Hướng dẫn sử dụng trang Profile

## Tổng quan

Trang Profile cho phép người dùng:

- Xem thông tin cá nhân (của bản thân hoặc người khác)
- Cập nhật thông tin profile (chỉ profile của bản thân)
- Tạo bài viết mới (chỉ khi xem profile của bản thân)
- Xem danh sách bài viết đã đăng
- Follow/Unfollow người dùng khác

## Các tính năng chính

### 1. Xem Profile

- **URL**: `profile.html?username=<username>`
- Nếu không có username trong URL, tự động chuyển đến profile của người dùng hiện tại
- Hiển thị thông tin:
  - Avatar, tên, username
  - Tiểu sử (bio)
  - Thống kê: Số bài viết, người theo dõi, đang theo dõi, điểm xếp hạng

### 2. Chỉnh sửa Profile (Chỉ profile của bản thân)

- Click nút "Chỉnh sửa" để mở modal
- Có thể cập nhật:
  - **Tên** (firstname)
  - **Họ** (lastname)
  - **URL Avatar** (avatarUrl)
  - **Tiểu sử** (bio)
- API endpoint: `PUT /api/users/profile`

### 3. Tạo bài viết mới (Chỉ profile của bản thân)

- Form tạo bài viết hiển thị ngay dưới thông tin profile
- Các trường:
  - **Tiêu đề**: Bắt buộc, tối đa 255 ký tự
  - **Nội dung**: Bắt buộc, hỗ trợ Markdown
  - **Chủ đề**: Tùy chọn, có thể chọn nhiều topic
- **Nội dung hỗ trợ Markdown**:
  ````markdown
  # Heading 1

  ## Heading 2

  **Bold text**
  _Italic text_

  - List item
    `code`
  ````
- API endpoint: `POST /api/posts`

### 4. Follow/Unfollow (Khi xem profile người khác)

- Nút "Theo dõi": Follow người dùng
- Nút "Đang theo dõi": Unfollow người dùng (hover để hiển thị màu đỏ)
- API endpoint: `POST /api/follows`

### 5. Danh sách bài viết

- Hiển thị tất cả bài viết của người dùng
- Phân trang (10 bài viết/trang)
- Mỗi bài viết hiển thị:
  - Các tag chủ đề
  - Tiêu đề
  - Thông tin tác giả và ngày đăng
  - Đoạn trích nội dung (200 ký tự đầu)
  - Nút "Đọc thêm"

## Cấu trúc File

### HTML: `profile.html`

- **Header**: Navigation bar với dropdown menu
- **Profile Header**: Ảnh bìa, avatar, thông tin, stats, action buttons
- **Edit Profile Modal**: Form chỉnh sửa thông tin (ẩn mặc định)
- **Create Post Section**: Form tạo bài viết (chỉ hiện với profile của bản thân)
- **User Posts**: Danh sách bài viết với pagination

### JavaScript: `profile.js`

#### State Management

```javascript
let currentUser = null; // User đang đăng nhập
let profileUser = null; // User đang xem profile
let isOwnProfile = false; // Có phải profile của bản thân?
let currentPage = 0; // Trang hiện tại
let totalPages = 0; // Tổng số trang
let allTopics = []; // Danh sách topics
```

#### Main Functions

- `initProfile()`: Khởi tạo trang profile
- `fetchUserProfile(username)`: Lấy thông tin profile
- `updateProfile(...)`: Cập nhật profile
- `createPost(...)`: Tạo bài viết mới
- `fetchUserPosts(username, page)`: Lấy bài viết của user
- `toggleFollow(username)`: Follow/Unfollow

### CSS: `general.css`

#### Profile Styles

- `.profile__header`: Header với cover image
- `.profile__avatar`: Avatar tròn lớn
- `.profile__info`: Thông tin và stats
- `.profile__btn`: Các nút action
- `.profile-edit`: Modal chỉnh sửa
- `.create-post`: Form tạo bài viết

## API Endpoints sử dụng

1. **GET** `/api/users/{username}` - Lấy thông tin profile
2. **PUT** `/api/users/profile` - Cập nhật profile (yêu cầu auth)
3. **POST** `/api/posts` - Tạo bài viết mới (yêu cầu auth)
4. **GET** `/api/feed/user/{username}` - Lấy bài viết của user
5. **GET** `/api/topics` - Lấy danh sách topics
6. **POST** `/api/follows` - Follow/Unfollow user (yêu cầu auth)

## Responsive Design

- **Desktop (> 1024px)**: Layout đầy đủ
- **Tablet (768px - 1024px)**: Avatar và font nhỏ hơn
- **Mobile (< 768px)**: Layout stack, avatar nhỏ, stats inline
- **Mobile nhỏ (< 480px)**: Tối ưu cho màn hình nhỏ

## Lưu ý kỹ thuật

1. **Authentication**:

   - Tất cả tính năng chỉnh sửa yêu cầu đăng nhập
   - JWT token được lưu trong localStorage
   - Tự động redirect đến sign-in nếu chưa đăng nhập

2. **Markdown Support**:

   - Textarea có class `form__textarea--markdown` với font monospace
   - Giữ nguyên định dạng khi enter (white-space trong CSS)
   - Backend xử lý render Markdown

3. **Dynamic Content**:

   - Tất cả dữ liệu được load từ API
   - Không hardcode bất kỳ nội dung nào
   - Loading states và empty states được xử lý

4. **BEM Naming Convention**:
   - Block: `profile`, `create-post`, `profile-edit`
   - Element: `profile__header`, `profile__avatar`, `create-post__form`
   - Modifier: `profile__btn--edit`, `profile__btn--follow`

## Testing Checklist

- [ ] Xem profile của bản thân
- [ ] Xem profile của người khác
- [ ] Chỉnh sửa thông tin profile
- [ ] Tạo bài viết mới với Markdown
- [ ] Follow/Unfollow người dùng
- [ ] Phân trang bài viết
- [ ] Responsive trên mobile
- [ ] Xử lý lỗi khi API fail
