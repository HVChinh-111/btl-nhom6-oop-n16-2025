# Hướng dẫn trang Bảng xếp hạng tác giả (Author Ranking)

## Tổng quan

Trang Author Ranking hiển thị bảng xếp hạng top 10 tác giả dựa trên điểm ranking (rankingCore), với podium đặc biệt cho top 3 và bảng chi tiết cho tất cả.

## Cấu trúc trang

### 1. **Header** (Giống index.html)

- Navigation menu với link về trang chủ, đang theo dõi, các chuyên mục
- Link "Bảng xếp hạng tác giả" được highlight khi đang ở trang này
- Avatar và menu người dùng (lấy dữ liệu từ API)

### 2. **Ranking Header**

- Tiêu đề: "Bảng xếp hạng"
- Filter dropdown để lọc theo lớp học (hiện tại chỉ có lớp mặc định)

### 3. **Podium (Top 3)**

Hiển thị 3 tác giả hàng đầu theo thứ tự:

- **Vị trí 2** (bên trái): Border màu bạc, background gradient bạc
- **Vị trí 1** (giữa): Border màu vàng, vương miện, cao nhất, background gradient vàng
- **Vị trí 3** (bên phải): Border màu đồng, background gradient đồng

Mỗi card podium bao gồm:

- Số thứ hạng (rank badge)
- Avatar (100px cho #2/#3, 120px cho #1)
- Tên đầy đủ
- Mã sinh viên
- Lớp học
- Thống kê: Làm đúng (màu xanh) / Đã nộp

### 4. **Ranking Table**

Bảng chi tiết 10 tác giả với các cột:

- STT (rank)
- Ảnh đại diện
- Tài khoản (link đến profile)
- Họ
- Tên
- Lớp học
- Lớp (mã lớp)
- Làm đúng (màu xanh)
- Đã thử

**Đặc điểm:**

- Top 3 rows có background gradient tương ứng màu vàng/bạc/đồng
- Hover effect trên mỗi row
- Username link đến trang profile của user

## API và Dữ liệu

### Hiện tại (Workaround)

Vì chưa có API endpoint riêng cho ranking, code đang:

1. Fetch posts từ `/api/feed/home?page=0&size=100`
2. Extract unique authors từ posts
3. Sort theo `rankingCore` (điểm ranking)
4. Lấy top 10

### Cấu trúc Author object

```javascript
{
  username: "user123",
  firstname: "Nguyen",
  lastname: "Van A",
  studentId: "B23DCCN123",
  avatarUrl: "https://...",
  rankingCore: 236,
  postCount: 10,
  correctCount: 236,  // Số bài làm đúng
  submittedCount: 240, // Số bài đã nộp
  class: "Lập trình hướng đối tượng - Nhóm 16",
  classCode: "D23CQCN03-B"
}
```

### Đề xuất API endpoint trong tương lai

```
GET /api/users/ranking?limit=10&class=D23CQCN03-B
```

## CSS Classes (BEM)

### Ranking Container

- `.ranking` - Container chính
- `.ranking__header` - Header với title và filter
- `.ranking__title` - Tiêu đề trang
- `.ranking__filter` - Bộ lọc
- `.ranking__filter-label` - Label cho filter
- `.ranking__filter-select` - Select dropdown

### Podium

- `.ranking__podium` - Section chứa podium
- `.podium` - Container podium (flex)
- `.podium__item` - Mỗi card podium
- `.podium__item--first` - Vị trí #1 (vàng)
- `.podium__item--second` - Vị trí #2 (bạc)
- `.podium__item--third` - Vị trí #3 (đồng)
- `.podium__crown` - Vương miện (chỉ #1)
- `.podium__rank` - Badge số thứ hạng
- `.podium__avatar` - Avatar
- `.podium__name` - Tên
- `.podium__student-id` - Mã sinh viên
- `.podium__class` - Lớp học
- `.podium__stats` - Container thống kê
- `.podium__stat` - Mỗi stat item
- `.podium__stat-value` - Giá trị (màu xanh)
- `.podium__stat-label` - Label

### Table

- `.ranking__table-section` - Section chứa table
- `.ranking-table` - Container table
- `.ranking-table__table` - Table element
- `.ranking-table__thead` - Table header
- `.ranking-table__tbody` - Table body
- `.ranking-table__th` - Table header cell
- `.ranking-table__td` - Table data cell
- `.ranking-table__row` - Table row
- `.ranking-table__row--top1` - Row #1 (gradient vàng)
- `.ranking-table__row--top2` - Row #2 (gradient bạc)
- `.ranking-table__row--top3` - Row #3 (gradient đồng)
- `.ranking-table__td--rank` - Cell rank (bold, màu accent)
- `.ranking-table__td--avatar` - Cell avatar
- `.ranking-table__avatar` - Avatar image
- `.ranking-table__link` - Link username
- `.ranking-table__td--correct` - Cell làm đúng (màu xanh)
- `.ranking-table__td--submitted` - Cell đã nộp
- `.ranking-table__loading` - Loading state
- `.ranking-table__empty` - Empty state

## Responsive Design

### Desktop (> 1024px)

- Podium 3 cards ngang, order: 2-1-3
- Table đầy đủ 9 cột

### Tablet (768px - 1024px)

- Podium nhỏ hơn
- Font size giảm
- Padding giảm

### Mobile (480px - 768px)

- Podium stack dọc
- Ẩn cột "Họ" và "Lớp học"
- Table font nhỏ hơn

### Mobile nhỏ (< 480px)

- Podium nhỏ hơn nữa
- Ẩn thêm cột "Tên" và "Lớp"
- Avatar nhỏ hơn

## JavaScript Functions

### State Management

```javascript
let allAuthors = []; // Tất cả authors
let currentUser = null; // User hiện tại
```

### API Calls

- `fetchCurrentUser()` - Lấy thông tin user hiện tại
- `fetchTopAuthors()` - Lấy danh sách top authors

### Render Functions

- `renderHeaderUserInfo(user)` - Render user info trong header
- `renderPodium(authors)` - Render podium top 3
- `renderPodiumItem(element, author, rank)` - Render 1 podium item
- `renderRankingTable(authors)` - Render bảng xếp hạng

### Event Handlers

- Class filter change - Lọc theo lớp học
- Logout - Đăng xuất

### Main Function

- `initRanking()` - Khởi tạo trang

## Đặc điểm nổi bật

1. **Visual Hierarchy**: Top 3 nổi bật với podium, gradient backgrounds
2. **Crown Animation**: Vương miện #1 có animation float
3. **Color Coding**:
   - Vàng (#FFD700) - Vị trí 1
   - Bạc (#C0C0C0) - Vị trí 2
   - Đồng (#CD7F32) - Vị trí 3
   - Xanh (#22C55E) - Số bài làm đúng
4. **Interactive**:
   - Hover effects trên cards và table rows
   - Username links đến profile
5. **Responsive**: Tự động điều chỉnh layout và ẩn cột phù hợp

## Navigation

- Click logo "HivePTIT" → Về trang chủ
- Click "Trang chủ" → index.html
- Click "Bảng xếp hạng tác giả" → Ở trang này (active)
- Click username trong table → profile.html?username=xxx
- Click "Trang cá nhân" trong menu → profile.html

## Testing Checklist

- [ ] Hiển thị đúng top 3 trên podium
- [ ] Crown animation hoạt động
- [ ] Bảng hiển thị đầy đủ 10 authors
- [ ] Top 3 rows có background gradient
- [ ] Click username chuyển đến profile
- [ ] Filter lớp học hoạt động
- [ ] Header user info lấy từ API
- [ ] Responsive trên mobile
- [ ] Logout hoạt động
- [ ] Auth check và redirect
