# HivePTIT API Documentation

**Base URL**: `/api`

---

## 1. Authentication APIs (`/api/auth`)

### 1.1. Đăng ký tài khoản

**Endpoint**: `POST /api/auth/signup`

**Mô tả**: Đăng ký tài khoản người dùng mới

**Request Body**: `SignUpRequest`

```json
{
  "studentId": "B21DCCN123",
  "username": "user123",
  "email": "user@stu.ptit.edu.vn",
  "password": "password123",
  "firstname": "Nguyen",
  "lastname": "Van A"
}
```

**Validation**:

- `studentId`: Bắt buộc, đúng 10 ký tự
- `username`: Bắt buộc, 3-30 ký tự
- `email`: Bắt buộc, phải có định dạng email hợp lệ và kết thúc bằng `@stu.ptit.edu.vn`
- `password`: Bắt buộc, 6-30 ký tự
- `firstname`, `lastname`: Tùy chọn

**Response**: `AuthResponse`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "studentId": "B21DCCN123",
  "username": "user123",
  "email": "user@stu.ptit.edu.vn",
  "message": "Đăng ký thành công",
  "success": true
}
```

**Status Codes**:

- `201 Created`: Đăng ký thành công
- `400 Bad Request`: Dữ liệu không hợp lệ

---

### 1.2. Đăng nhập

**Endpoint**: `POST /api/auth/login`

**Mô tả**: Đăng nhập vào hệ thống

**Request Body**: `LoginRequest`

```json
{
  "usernameOrEmail": "user123",
  "password": "password123"
}
```

**Validation**:

- `usernameOrEmail`: Bắt buộc
- `password`: Bắt buộc

**Response**: `AuthResponse`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "studentId": "B21DCCN123",
  "username": "user123",
  "email": "user@stu.ptit.edu.vn",
  "message": "Đăng nhập thành công",
  "success": true
}
```

**Status Codes**:

- `200 OK`: Đăng nhập thành công
- `401 Unauthorized`: Sai thông tin đăng nhập

---

### 1.3. Đăng xuất

**Endpoint**: `POST /api/auth/logout`

**Mô tả**: Đăng xuất khỏi hệ thống

**Authentication**: Required

**Response**: `AuthResponse`

```json
{
  "message": "Đăng xuất thành công",
  "success": true
}
```

**Status Codes**:

- `200 OK`: Đăng xuất thành công

---

### 1.4. Health Check

**Endpoint**: `GET /api/auth/health`

**Mô tả**: Kiểm tra trạng thái API

**Response**:

```text
Auth API is running!
```

**Status Codes**:

- `200 OK`: API đang hoạt động

---

## 2. User APIs (`/api/users`)

### 2.1. Lấy thông tin profile người dùng

**Endpoint**: `GET /api/users/{username}`

**Mô tả**: Xem thông tin profile của một người dùng

**Path Parameters**:

- `username`: Username của người dùng cần xem

**Authentication**: Optional (nếu đăng nhập sẽ hiển thị trạng thái follow)

**Response**: `UserProfileResponse`

```json
{
  "studentId": "B21DCCN123",
  "username": "user123",
  "email": "user@stu.ptit.edu.vn",
  "firstname": "Nguyen",
  "lastname": "Van A",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "Sinh viên PTIT khoa CNTT",
  "rankingCore": 100,
  "postCount": 25,
  "followerCount": 150,
  "followingCount": 80,
  "isFollowing": true
}
```

**Status Codes**:

- `200 OK`: Lấy thông tin thành công
- `404 Not Found`: Không tìm thấy người dùng

---

### 2.2. Cập nhật profile

**Endpoint**: `PUT /api/users/profile`

**Mô tả**: Cập nhật thông tin profile của người dùng hiện tại

**Authentication**: Required

**Request Body**: `UpdateProfileRequest`

```json
{
  "firstname": "Nguyen",
  "lastname": "Van B",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "bio": "Mô tả mới"
}
```

**Response**: `UpdateProfileResponse`

```json
{
  "message": "Profile updated successfully",
  "success": true,
  "user": {
    "studentId": "B21DCCN123",
    "username": "user123",
    "email": "user@stu.ptit.edu.vn",
    "firstname": "Nguyen",
    "lastname": "Van B",
    "avatarUrl": "https://example.com/new-avatar.jpg",
    "bio": "Mô tả mới",
    "rankingCore": 100,
    "postCount": 25,
    "followerCount": 150,
    "followingCount": 80
  }
}
```

**Status Codes**:

- `200 OK`: Cập nhật thành công
- `400 Bad Request`: Dữ liệu không hợp lệ

---

## 3. Post APIs (`/api/posts`)

### 3.1. Tạo bài viết mới

**Endpoint**: `POST /api/posts`

**Mô tả**: Tạo một bài viết mới

**Authentication**: Required

**Request Body**: `PostRequest`

```json
{
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết chi tiết...",
  "topicIds": [1, 2, 3]
}
```

**Validation**:

- `title`: Bắt buộc, tối đa 255 ký tự
- `content`: Bắt buộc
- `topicIds`: Tùy chọn, danh sách ID chủ đề

**Response**: `PostResponse`

```json
{
  "id": 1,
  "title": "Tiêu đề bài viết",
  "content": "Nội dung bài viết chi tiết...",
  "topics": [
    {
      "id": 1,
      "name": "Java"
    },
    {
      "id": 2,
      "name": "Spring Boot"
    }
  ],
  "author": {
    "studentId": "B21DCCN123",
    "username": "user123",
    "firstname": "Nguyen",
    "lastname": "Van A",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Sinh viên PTIT",
    "rankingCore": 100,
    "isFollowing": false
  },
  "createdAt": "2025-11-20T10:00:00Z",
  "updatedAt": "2025-11-20T10:00:00Z",
  "voteCount": 0
}
```

**Status Codes**:

- `201 Created`: Tạo bài viết thành công
- `400 Bad Request`: Dữ liệu không hợp lệ

---

### 3.2. Cập nhật bài viết

**Endpoint**: `PUT /api/posts/{id}`

**Mô tả**: Cập nhật bài viết (chỉ chủ bài viết)

**Authentication**: Required

**Path Parameters**:

- `id`: ID của bài viết

**Request Body**: `PostRequest`

```json
{
  "title": "Tiêu đề mới",
  "content": "Nội dung mới...",
  "topicIds": [1, 3, 5]
}
```

**Response**: `PostResponse`

**Status Codes**:

- `200 OK`: Cập nhật thành công
- `403 Forbidden`: Không có quyền
- `404 Not Found`: Không tìm thấy bài viết

---

### 3.3. Xóa bài viết

**Endpoint**: `DELETE /api/posts/{id}`

**Mô tả**: Xóa bài viết (chỉ chủ bài viết hoặc Admin)

**Authentication**: Required

**Path Parameters**:

- `id`: ID của bài viết

**Response**: Không có nội dung

**Status Codes**:

- `204 No Content`: Xóa thành công
- `403 Forbidden`: Không có quyền
- `404 Not Found`: Không tìm thấy bài viết

---

### 3.4. Xem chi tiết bài viết

**Endpoint**: `GET /api/posts/{id}`

**Mô tả**: Xem chi tiết một bài viết

**Path Parameters**:

- `id`: ID của bài viết

**Response**: `PostResponse`

**Status Codes**:

- `200 OK`: Lấy thông tin thành công
- `404 Not Found`: Không tìm thấy bài viết

---

## 4. Comment APIs (`/api`)

### 4.1. Lấy danh sách comment của bài viết

**Endpoint**: `GET /api/posts/{postId}/comments`

**Mô tả**: Lấy danh sách comment gốc (parent = null) của một bài viết

**Path Parameters**:

- `postId`: ID của bài viết

**Query Parameters**:

- `page`: Số trang (mặc định: 0)
- `size`: Số lượng comment mỗi trang (mặc định: 10)
- `sortBy`: Trường sắp xếp (mặc định: "createdAt")
- `direction`: Hướng sắp xếp - "asc" hoặc "desc" (mặc định: "asc")
- `depth`: Độ sâu của cây comment (mặc định: 0)

**Response**: `PagedResponse<CommentResponse>`

```json
{
  "content": [
    {
      "id": 1,
      "postId": 1,
      "author": {
        "studentId": "B21DCCN123",
        "username": "user123",
        "firstname": "Nguyen",
        "lastname": "Van A",
        "avatarUrl": "https://example.com/avatar.jpg",
        "bio": "Sinh viên PTIT",
        "rankingCore": 100,
        "isFollowing": false
      },
      "content": "Nội dung comment",
      "voteCount": 5,
      "isEdited": "N",
      "createdAt": "2025-11-20T10:00:00Z",
      "parentCommentId": null,
      "replies": []
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 50,
  "totalPages": 5,
  "last": false
}
```

**Status Codes**:

- `200 OK`: Lấy danh sách thành công

---

### 4.2. Xem chi tiết comment

**Endpoint**: `GET /api/comments/{id}`

**Mô tả**: Xem chi tiết một comment và các reply của nó

**Path Parameters**:

- `id`: ID của comment

**Query Parameters**:

- `depth`: Độ sâu của cây comment (mặc định: 1)

**Response**: `CommentResponse`

```json
{
  "id": 1,
  "postId": 1,
  "author": {
    "studentId": "B21DCCN123",
    "username": "user123",
    "firstname": "Nguyen",
    "lastname": "Van A",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Sinh viên PTIT",
    "rankingCore": 100,
    "isFollowing": false
  },
  "content": "Nội dung comment",
  "voteCount": 5,
  "isEdited": "N",
  "createdAt": "2025-11-20T10:00:00Z",
  "parentCommentId": null,
  "replies": [
    {
      "id": 2,
      "postId": 1,
      "author": {...},
      "content": "Reply comment",
      "voteCount": 2,
      "isEdited": "N",
      "createdAt": "2025-11-20T10:05:00Z",
      "parentCommentId": 1,
      "replies": []
    }
  ]
}
```

**Status Codes**:

- `200 OK`: Lấy thông tin thành công
- `404 Not Found`: Không tìm thấy comment

---

### 4.3. Tạo comment mới

**Endpoint**: `POST /api/posts/{postId}/comments`

**Mô tả**: Tạo comment mới cho bài viết hoặc reply cho comment khác

**Authentication**: Required

**Path Parameters**:

- `postId`: ID của bài viết

**Request Body**: `CommentCreateRequest`

```json
{
  "content": "Nội dung comment của bạn",
  "parentCommentId": null
}
```

**Validation**:

- `content`: Bắt buộc, tối đa 10,000 ký tự
- `parentCommentId`: Tùy chọn, null nếu là comment gốc

**Response**: `CommentResponse`

**Status Codes**:

- `201 Created`: Tạo comment thành công
- `400 Bad Request`: Dữ liệu không hợp lệ

---

### 4.4. Cập nhật comment

**Endpoint**: `PUT /api/comments/{id}`

**Mô tả**: Cập nhật nội dung comment (chỉ chủ comment hoặc Admin)

**Authentication**: Required

**Path Parameters**:

- `id`: ID của comment

**Request Body**: `CommentUpdateRequest`

```json
{
  "content": "Nội dung đã chỉnh sửa"
}
```

**Validation**:

- `content`: Bắt buộc, tối đa 10,000 ký tự

**Response**: `CommentResponse`

**Status Codes**:

- `200 OK`: Cập nhật thành công
- `403 Forbidden`: Không có quyền
- `404 Not Found`: Không tìm thấy comment

---

### 4.5. Xóa comment

**Endpoint**: `DELETE /api/comments/{id}`

**Mô tả**: Xóa comment (chỉ chủ comment hoặc Admin)

**Authentication**: Required

**Path Parameters**:

- `id`: ID của comment

**Response**: Không có nội dung

**Status Codes**:

- `204 No Content`: Xóa thành công
- `403 Forbidden`: Không có quyền
- `404 Not Found`: Không tìm thấy comment

---

## 5. Topic APIs (`/api/topics`)

### 5.1. Lấy danh sách tất cả chủ đề

**Endpoint**: `GET /api/topics`

**Mô tả**: Lấy danh sách tất cả các chủ đề

**Response**: `List<TopicResponse>`

```json
[
  {
    "name": "Java"
  },
  {
    "name": "Spring Boot"
  },
  {
    "name": "Database"
  }
]
```

**Status Codes**:

- `200 OK`: Lấy danh sách thành công

---

### 5.2. Tạo chủ đề mới

**Endpoint**: `POST /api/topics`

**Mô tả**: Tạo chủ đề mới (chỉ Admin)

**Authentication**: Required (Role: ADMIN)

**Request Body**: `TopicRequest`

```json
{
  "name": "React Native"
}
```

**Validation**:

- `name`: Bắt buộc

**Response**: `TopicResponse`

```json
{
  "name": "React Native"
}
```

**Status Codes**:

- `201 Created`: Tạo chủ đề thành công
- `403 Forbidden`: Không có quyền Admin

---

## 6. Follow APIs (`/api/follow`)

### 6.1. Toggle Follow/Unfollow

**Endpoint**: `POST /api/follow/toggle`

**Mô tả**: Follow hoặc unfollow một người dùng

**Authentication**: Required

**Request Body**: `FollowRequest`

```json
{
  "targetUsername": "user456"
}
```

**Response**: `FollowResponse`

```json
{
  "message": "Đã follow user456",
  "success": true,
  "action": "FOLLOWED",
  "followerCount": 151,
  "followingCount": 81
}
```

**Status Codes**:

- `200 OK`: Thực hiện thành công

---

### 6.2. Lấy danh sách followers

**Endpoint**: `GET /api/follow/{username}/followers`

**Mô tả**: Lấy danh sách người theo dõi của một user

**Path Parameters**:

- `username`: Username của người dùng

**Authentication**: Optional

**Response**: `List<UserSummaryDTO>`

```json
[
  {
    "studentId": "B21DCCN456",
    "username": "user456",
    "firstname": "Tran",
    "lastname": "Van B",
    "avatarUrl": "https://example.com/avatar2.jpg",
    "bio": "Student",
    "rankingCore": 50,
    "isFollowing": true
  }
]
```

**Status Codes**:

- `200 OK`: Lấy danh sách thành công

---

### 6.3. Lấy danh sách following

**Endpoint**: `GET /api/follow/{username}/following`

**Mô tả**: Lấy danh sách người mà user đang theo dõi

**Path Parameters**:

- `username`: Username của người dùng

**Authentication**: Optional

**Response**: `List<UserSummaryDTO>`

**Status Codes**:

- `200 OK`: Lấy danh sách thành công

---

### 6.4. Lấy thống kê follow

**Endpoint**: `GET /api/follow/{username}/stats`

**Mô tả**: Lấy số liệu thống kê followers và following

**Path Parameters**:

- `username`: Username của người dùng

**Response**:

```json
{
  "followers": 150,
  "following": 80
}
```

**Status Codes**:

- `200 OK`: Lấy thống kê thành công

---

### 6.5. Kiểm tra trạng thái follow

**Endpoint**: `GET /api/follow/check`

**Mô tả**: Kiểm tra xem có đang follow một user hay không

**Authentication**: Required

**Query Parameters**:

- `targetUsername`: Username của người cần kiểm tra

**Response**:

```json
{
  "isFollowing": true
}
```

**Status Codes**:

- `200 OK`: Kiểm tra thành công

---

## 7. Vote APIs (`/api/votes`)

### 7.1. Vote cho bài viết

**Endpoint**: `POST /api/votes/post`

**Mô tả**: Upvote, downvote hoặc hủy vote cho bài viết

**Authentication**: Required

**Request Body**: `VoteRequest`

```json
{
  "postId": 1,
  "commentId": null,
  "voteType": "UPVOTE"
}
```

**Vote Types**:

- `UPVOTE`: Upvote (+1)
- `DOWNVOTE`: Downvote (-1)
- `NONE`: Hủy vote

**Response**: `VoteResponse`

```json
{
  "message": "Voted successfully",
  "action": "UPVOTED",
  "totalScore": 15,
  "success": true
}
```

**Status Codes**:

- `200 OK`: Vote thành công

---

## 8. Bookmark APIs (`/api/bookmarks`)

### 8.1. Tạo danh sách bookmark

**Endpoint**: `POST /api/bookmarks/list/create`

**Mô tả**: Tạo một danh sách bookmark mới

**Authentication**: Required

**Query Parameters**:

- `listName`: Tên danh sách bookmark

**Response**: `BookmarkResponse`

```json
{
  "message": "Bookmark list created",
  "success": true,
  "listId": 1,
  "listName": "Yêu thích",
  "createdAt": "2025-11-20T10:00:00"
}
```

**Status Codes**:

- `200 OK`: Tạo danh sách thành công

---

### 8.2. Thêm bài viết vào bookmark

**Endpoint**: `POST /api/bookmarks/add`

**Mô tả**: Thêm bài viết vào danh sách bookmark

**Authentication**: Required

**Request Body**: `BookmarkRequest`

```json
{
  "listName": "Yêu thích",
  "postId": 1
}
```

**Response**: `BookmarkResponse`

```json
{
  "message": "Post added to bookmark",
  "success": true,
  "listId": 1,
  "listName": "Yêu thích",
  "createdAt": "2025-11-20T10:00:00"
}
```

**Status Codes**:

- `200 OK`: Thêm bài viết thành công

---

### 8.3. Xóa bài viết khỏi bookmark

**Endpoint**: `DELETE /api/bookmarks/remove`

**Mô tả**: Xóa bài viết khỏi danh sách bookmark

**Authentication**: Required

**Request Body**: `BookmarkRequest`

```json
{
  "listName": "Yêu thích",
  "postId": 1
}
```

**Response**: `BookmarkResponse`

**Status Codes**:

- `200 OK`: Xóa bài viết thành công

---

### 8.4. Lấy danh sách bookmark của user

**Endpoint**: `GET /api/bookmarks/lists`

**Mô tả**: Lấy tất cả danh sách bookmark của user hiện tại

**Authentication**: Required

**Response**: `List<Bookmark_List>`

```json
[
  {
    "id": 1,
    "listName": "Yêu thích",
    "createdAt": "2025-11-20T10:00:00",
    "posts": [...]
  }
]
```

**Status Codes**:

- `200 OK`: Lấy danh sách thành công

---

## 9. Feed APIs (`/api/feed`)

### 9.1. Lấy feed từ người đang follow

**Endpoint**: `GET /api/feed/following`

**Mô tả**: Lấy bài viết từ những người mà user đang theo dõi

**Authentication**: Required

**Query Parameters**:

- `page`: Số trang (mặc định: 0)
- `size`: Số lượng bài viết mỗi trang (mặc định: 20)

**Response**: `List<FeedPostResponse>`

```json
[
  {
    "postId": 1,
    "title": "Tiêu đề bài viết",
    "content": "Nội dung...",
    "voteCount": 15,
    "createdAt": "2025-11-20T10:00:00",
    "updatedAt": "2025-11-20T10:00:00",
    "authorUsername": "user123",
    "authorFirstname": "Nguyen",
    "authorLastname": "Van A",
    "authorAvatarUrl": "https://example.com/avatar.jpg",
    "topics": ["Java", "Spring Boot"],
    "commentCount": 5,
    "trendingScore": 25.5
  }
]
```

**Status Codes**:

- `200 OK`: Lấy feed thành công

---

### 9.2. Lấy feed trending

**Endpoint**: `GET /api/feed/trending`

**Mô tả**: Lấy các bài viết đang trending (phổ biến)

**Response**: `List<FeedPostResponse>`

**Status Codes**:

- `200 OK`: Lấy feed thành công

---

### 9.3. Lấy home feed

**Endpoint**: `GET /api/feed/home`

**Mô tả**: Lấy feed trang chủ (tất cả bài viết)

**Query Parameters**:

- `page`: Số trang (mặc định: 0)
- `size`: Số lượng bài viết mỗi trang (mặc định: 20)

**Response**: `List<FeedPostResponse>`

**Status Codes**:

- `200 OK`: Lấy feed thành công

---

### 9.4. Lấy feed của một user

**Endpoint**: `GET /api/feed/user/{username}`

**Mô tả**: Lấy tất cả bài viết của một user cụ thể

**Path Parameters**:

- `username`: Username của người dùng

**Query Parameters**:

- `page`: Số trang (mặc định: 0)
- `size`: Số lượng bài viết mỗi trang (mặc định: 20)

**Response**: `List<FeedPostResponse>`

**Status Codes**:

- `200 OK`: Lấy feed thành công
- `404 Not Found`: Không tìm thấy user

---

## 10. Leaderboard APIs (`/api/leaderboard`)

### 10.1. Lấy bảng xếp hạng có phân trang

**Endpoint**: `GET /api/leaderboard`

**Mô tả**: Lấy bảng xếp hạng tác giả theo rankingCore, có hỗ trợ phân trang

**Query Parameters**:

- `page`: Số trang (mặc định: 0, bắt đầu từ 0)
- `size`: Số lượng tác giả mỗi trang (mặc định: 10)

**Authentication**: Public (không cần đăng nhập)

**Response**:

```json
{
  "content": [
    {
      "rank": 1,
      "studentId": "B21DCCN123",
      "username": "user123",
      "firstname": "Nguyen",
      "lastname": "Van A",
      "avatarUrl": "https://example.com/avatar.jpg",
      "rankingCore": 500,
      "postCount": 50,
      "followerCount": 120
    },
    {
      "rank": 2,
      "studentId": "B21DCCN456",
      "username": "user456",
      "firstname": "Tran",
      "lastname": "Thi B",
      "avatarUrl": "https://example.com/avatar2.jpg",
      "rankingCore": 450,
      "postCount": 45,
      "followerCount": 100
    }
  ],
  "currentPage": 0,
  "totalItems": 100,
  "totalPages": 10,
  "pageSize": 10,
  "hasNext": true,
  "hasPrevious": false
}
```

**Status Codes**:

- `200 OK`: Lấy bảng xếp hạng thành công

**Lưu ý**:

- Rank (thứ hạng) được tính theo vị trí global, không phải vị trí trong trang
- Trang 2 sẽ có rank bắt đầu từ 11 (nếu size=10)
- Danh sách được sắp xếp theo rankingCore giảm dần (cao → thấp)

---

### 10.2. Lấy top 100 tác giả

**Endpoint**: `GET /api/leaderboard/top100`

**Mô tả**: Lấy danh sách top 100 tác giả (legacy endpoint)

**Authentication**: Public (không cần đăng nhập)

**Response**: `List<LeaderboardUserResponse>`

```json
[
  {
    "rank": 1,
    "studentId": "B21DCCN123",
    "username": "user123",
    "firstname": "Nguyen",
    "lastname": "Van A",
    "avatarUrl": "https://example.com/avatar.jpg",
    "rankingCore": 500,
    "postCount": 50,
    "followerCount": 120
  }
]
```

**Status Codes**:

- `200 OK`: Lấy danh sách thành công

---

## 11. Test APIs (`/api/test`)

### 11.1. Public endpoint

**Endpoint**: `GET /api/test/public`

**Mô tả**: Endpoint công khai, không cần xác thực

**Response**:

```json
{
  "message": "This is a public endpoint!",
  "description": "Anyone can access this without authentication"
}
```

**Status Codes**:

- `200 OK`

---

### 11.2. Authenticated endpoint

**Endpoint**: `GET /api/test/authenticated`

**Mô tả**: Endpoint yêu cầu xác thực

**Authentication**: Required

**Response**:

```json
{
  "message": "You are authenticated!",
  "username": "user123",
  "authorities": [...]
}
```

**Status Codes**:

- `200 OK`: Đã xác thực
- `401 Unauthorized`: Chưa xác thực

---

### 11.3. Admin endpoint

**Endpoint**: `GET /api/test/admin`

**Mô tả**: Endpoint chỉ dành cho Admin

**Authentication**: Required (Role: ADMIN)

**Response**:

```json
{
  "message": "Welcome Admin!",
  "description": "Only users with ADMIN role can access this",
  "username": "admin"
}
```

**Status Codes**:

- `200 OK`: Có quyền Admin
- `403 Forbidden`: Không có quyền Admin

---

### 11.4. Moderator endpoint

**Endpoint**: `GET /api/test/moderator`

**Mô tả**: Endpoint cho Admin hoặc Moderator

**Authentication**: Required (Role: ADMIN hoặc MODERATOR)

**Response**:

```json
{
  "message": "Welcome Moderator!",
  "description": "Users with ADMIN or MODERATOR role can access this",
  "username": "moderator",
  "roles": [...]
}
```

**Status Codes**:

- `200 OK`: Có quyền
- `403 Forbidden`: Không có quyền

---

### 11.5. Create Post Permission

**Endpoint**: `GET /api/test/create-post`

**Mô tả**: Endpoint kiểm tra quyền POST_CREATE

**Authentication**: Required (Permission: POST_CREATE)

**Response**:

```json
{
  "message": "You can create posts!",
  "description": "Only users with POST_CREATE permission can access",
  "username": "user123",
  "permissions": [...]
}
```

**Status Codes**:

- `200 OK`: Có quyền
- `403 Forbidden`: Không có quyền

---

### 11.6. Admin Delete Permission

**Endpoint**: `GET /api/test/admin-delete`

**Mô tả**: Endpoint kiểm tra quyền POST_DELETE và USER_MANAGE

**Authentication**: Required (Permission: POST_DELETE và USER_MANAGE)

**Response**:

```json
{
  "message": "You can delete posts and manage users!",
  "description": "Need both POST_DELETE and USER_MANAGE permissions",
  "username": "admin"
}
```

**Status Codes**:

- `200 OK`: Có đủ quyền
- `403 Forbidden`: Không có đủ quyền

---

### 11.7. Edit Post Permission

**Endpoint**: `GET /api/test/edit-post`

**Mô tả**: Endpoint kiểm tra quyền Admin hoặc POST_EDIT

**Authentication**: Required (Role: ADMIN hoặc Permission: POST_EDIT)

**Response**:

```json
{
  "message": "You can edit posts!",
  "description": "Admin or users with POST_EDIT permission can access",
  "username": "user123"
}
```

**Status Codes**:

- `200 OK`: Có quyền
- `403 Forbidden`: Không có quyền

---

### 11.8. Get Current User

**Endpoint**: `GET /api/test/me`

**Mô tả**: Lấy thông tin người dùng hiện tại

**Authentication**: Required

**Response**:

```json
{
  "username": "user123",
  "authorities": [...],
  "authenticated": true,
  "details": {...}
}
```

**Status Codes**:

- `200 OK`: Lấy thông tin thành công

---

## Data Transfer Objects (DTOs)

### AuthResponse

```java
{
  "token": String,
  "studentId": String,
  "username": String,
  "email": String,
  "message": String,
  "success": boolean
}
```

### LoginRequest

```java
{
  "usernameOrEmail": String (required),
  "password": String (required)
}
```

### SignUpRequest

```java
{
  "studentId": String (required, 10 ký tự),
  "username": String (required, 3-30 ký tự),
  "email": String (required, @stu.ptit.edu.vn),
  "password": String (required, 6-30 ký tự),
  "firstname": String,
  "lastname": String
}
```

### PostRequest

```java
{
  "title": String (required, max 255),
  "content": String (required),
  "topicIds": List<Integer>
}
```

### PostResponse

```java
{
  "id": Integer,
  "title": String,
  "content": String,
  "topics": List<TopicSummary>,
  "author": UserSummaryDTO,
  "createdAt": Instant,
  "updatedAt": Instant,
  "voteCount": Integer
}
```

### CommentCreateRequest

```java
{
  "content": String (required, max 10,000),
  "parentCommentId": Integer (nullable)
}
```

### CommentUpdateRequest

```java
{
  "content": String (required, max 10,000)
}
```

### CommentResponse

```java
{
  "id": Integer,
  "postId": Integer,
  "author": UserSummaryDTO,
  "content": String,
  "voteCount": int,
  "isEdited": String ("Y" | "N"),
  "createdAt": Instant,
  "parentCommentId": Integer,
  "replies": List<CommentResponse>
}
```

### TopicRequest

```java
{
  "name": String (required)
}
```

### TopicResponse

```java
{
  "name": String
}
```

### FollowRequest

```java
{
  "targetUsername": String
}
```

### FollowResponse

```java
{
  "message": String,
  "success": boolean,
  "action": String,
  "followerCount": Long,
  "followingCount": Long
}
```

### VoteRequest

```java
{
  "postId": Integer,
  "commentId": Integer,
  "voteType": String ("UPVOTE" | "DOWNVOTE" | "NONE")
}
```

### VoteResponse

```java
{
  "message": String,
  "action": String,
  "totalScore": Integer,
  "success": boolean
}
```

### BookmarkRequest

```java
{
  "listName": String,
  "postId": Integer
}
```

### BookmarkResponse

```java
{
  "message": String,
  "success": boolean,
  "listId": Integer,
  "listName": String,
  "createdAt": LocalDateTime
}
```

### UpdateProfileRequest

```java
{
  "firstname": String,
  "lastname": String,
  "avatarUrl": String,
  "bio": String
}
```

### UpdateProfileResponse

```java
{
  "message": String,
  "success": boolean,
  "user": UserProfileResponse
}
```

### UserProfileResponse

```java
{
  "studentId": String,
  "username": String,
  "email": String,
  "firstname": String,
  "lastname": String,
  "avatarUrl": String,
  "bio": String,
  "rankingCore": Integer,
  "postCount": Long,
  "followerCount": Long,
  "followingCount": Long,
  "isFollowing": Boolean
}
```

### UserSummaryDTO

```java
{
  "studentId": String,
  "username": String,
  "firstname": String,
  "lastname": String,
  "avatarUrl": String,
  "bio": String,
  "rankingCore": Integer,
  "isFollowing": boolean
}
```

### FeedPostResponse

```java
{
  "postId": Integer,
  "title": String,
  "content": String,
  "voteCount": Integer,
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime,
  "authorUsername": String,
  "authorFirstname": String,
  "authorLastname": String,
  "authorAvatarUrl": String,
  "topics": List<String>,
  "commentCount": Integer,
  "trendingScore": Double
}
```

### PagedResponse<T>

```java
{
  "content": List<T>,
  "page": int,
  "size": int,
  "totalElements": long,
  "totalPages": int,
  "last": boolean
}
```

---

## Authentication & Authorization

### JWT Token

- Tất cả các API yêu cầu authentication cần gửi JWT token trong header:
  ```
  Authorization: Bearer <token>
  ```

### Roles

- `USER`: Người dùng thông thường
- `MODERATOR`: Người điều hành
- `ADMIN`: Quản trị viên

### Permissions

- `POST_CREATE`: Tạo bài viết
- `POST_EDIT`: Chỉnh sửa bài viết
- `POST_DELETE`: Xóa bài viết
- `USER_MANAGE`: Quản lý người dùng

---

## HTTP Status Codes

| Code                      | Mô tả                                  |
| ------------------------- | -------------------------------------- |
| 200 OK                    | Yêu cầu thành công                     |
| 201 Created               | Tạo tài nguyên thành công              |
| 204 No Content            | Xóa thành công                         |
| 400 Bad Request           | Dữ liệu không hợp lệ                   |
| 401 Unauthorized          | Chưa đăng nhập hoặc token không hợp lệ |
| 403 Forbidden             | Không có quyền truy cập                |
| 404 Not Found             | Không tìm thấy tài nguyên              |
| 500 Internal Server Error | Lỗi server                             |

---

## Lưu ý

- Tất cả các endpoint trả về JSON format
- Các API yêu cầu authentication phải gửi JWT token
- Pagination sử dụng zero-based index (bắt đầu từ 0)
- Tất cả timestamp sử dụng ISO 8601 format
- CORS được kích hoạt cho tất cả origins (`*`)
