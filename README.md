# BÁO CÁO KẾT QUẢ BÀI TẬP LỚN OOP NHÓM 6
## 1. Thông tin nhóm
**Tên Dự Án:** HivePTIT

**Link Dự Án:** ....

**Thành Viên Nhóm:**
- Hoàng Văn Chính - B23DCKH011
- Nguyễn Đăng Cường - B23DCKH015
- Hán Hữu Đăng - B23DCKH019

**Mô hình làm việc**
Team hoạt động theo mô hình Scrum.

**22h thứ 7 hàng tuần**, team sẽ ngồi lại để review công việc đã làm, cùng nhau giải quyết vấn đề đang gặp phải và lên kế hoạch phát triển các tính năng trong tuần tiếp theo.

**Version Control Strategy**

Team hoạt động theo Gitflow để quản lý code. Mỗi thành viên sẽ tạo branch từ develop để làm việc, các branch đặt theo format feature/ten-chuc-nang, sau khi hoàn thành sẽ tạo Pull Request để review code và merge vào develop

- Các nhánh chính:
  + `main`: Chứa code ổn định, đã qua kiểm tra và test kỹ lưỡng
  + `develop`: Chứa code mới nhất, đã qua review và test
  + `feature/`: Các nhánh chứa code đang phát triển, short-live, sau khi hoàn thành sẽ merge vào `develop`.
  ![image]()

Sau mỗi tuần, team sẽ merge `develop` vào `main` để release phiên bản mới.

## 2. Giới Thiệu Dự Án
**Mô tả :** 
 - **Tên Sản Phẩm:** HivePTIT
- **Thể loại:** Website trao đổi học thuật dành cho cộng đồng sinh viên PTIT
- **Điểm chính:** Tính năng, công nghệ
- **Công nghệ sử dụng:** Front-end: html,css,js - Back-end: Java Core - Database: MySQL
**Hướng dẫn sử dụng:** ....
## 3. Các Chức Năng Chính

- **Chức năng 1:** Đăng ký, đăng nhập. Đăng nhập bằng username hoặc email học viện
- **Chức năng 2:** Đăng bài viết chia sẻ các kiến thức học thuật
- **Chức năng 3:** Tìm kiếm bài viết quan tâm, lướt bài viết follow, trending
- **Chức năng 4:** Xem profile cá nhân, xem profile của các người dùng khác và danh sách bài viết họ đã đăng, theo dõi
- **Chức năng 5:** Bình luận và đánh giá bài viết qua hệ thống upvote-downvote và lưu lại bài viết yêu thích theo danh sách cá nhân hóa.
- **Chức năng 6:** Bảng xếp hạng tác giả
- **Chức năng 7:** Tích hợp AI tóm tắt bài viết
## 4. Công Nghệ
#### 4.1. Công Nghệ Sử Dụng
- Frontend: Html5, css3, js, thymeleaf, prism.js
- Backend: Java, Spring Boot, Spring Security  + JWT Authentication
- Database: MySQL
- AI: NVIDIA NIM API (Llama 3.1 405B)
- Tools: Maven (Build tool), Git&Github (Version control)
#### 4.2. Cấu Trúc Dự Án
**Sử dụng mô hình MVC, cấu trúc project như sau:** 
```

```

Diễn giải:

- ...

Luồng hoạt động cơ bản của project
![image]()


## 5. Ảnh Demo

**Ảnh Demo:**

