# BÁO CÁO KẾT QUẢ BÀI TẬP LỚN OOP NHÓM 6
## 1. Thông tin nhóm
**Tên Dự Án:** HivePTIT

**Link Dự Án:** ....

**Thành Viên Nhóm:**
- Hoàng Văn Chính - B23DCKH011
- Nguyễn Đăng Cường - B23DCKH015
- Hán Hữu Đăng - B23DCKH019

**Mô hình làm việc**
Team hoạt động theo mô hình Scrum, sử dụng Linear để quản lý công việc. Các công việc được keep track đầy đủ trên Linear.

- Link linear: ...

**22h thứ 5 hàng tuần**, team sẽ ngồi lại để review công việc đã làm, cùng nhau giải quyết vấn đề đang gặp phải và lên kế hoạch phát triển các tính năng trong tuần tiếp theo.

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
- **Thể loại:** Website mạng xã hội trao đổi học thuật dành cho cộng đồng sinh viên PTIT
- **Điểm chính:** Tính năng, công nghệ
- **Công nghệ sử dụng:** Front-end: html,css,js - Back-end: Java Core - Database: MySQL
**Hướng dẫn sử dụng:** ....
## 3. Các Chức Năng Chính

- **Chức năng 1:** Đăng ký, đăng nhập. Tên đăng nhập mã sinh viên (xác thực bằng email học viện) hoặc đăng nhập bằng Slink
- **Chức năng 2:** Chọn các chủ đề quan tâm (Các bài viết sẽ liên quan đến chủ đề đã chọn)
- **Chức năng 3:** Đăng bài viết hỏi hoặc chia sẻ kiến thức học thuật
- **Chức năng 4:** Tìm kiếm các bài viết
- **Chức năng 5:** Nhắn tin thời gian thực - Có thể nhắn trực tiếp với người khác để hỏi trực tiếp
- **Chức năng 6:** Tích hợp chatbot - Hỏi và tổng hợp các kiến thức đã được chia sẻ trong nền tảng
- **Chức năng 7:** Xem profile của các người dùng khác và danh sách bài viết họ đã đăng, theo dõi
- **Chức năng 8:** Bình luận và đánh giá bài viết qua hệ thống upvote-downvote và lưu lại bài viết yêu thích theo danh sách cá nhân hóa.
## 4. Công Nghệ
#### 4.1. Công Nghệ Sử Dụng
- Liner, Github: Chính
- Html, css, js: Chính
- Java Spring Boot: Chính, Đăng, Cường
- WebSocket: Chính
- MySQL: Cường, Đăng
- AI: Đăng
- Docker:...
#### 4.2. Cấu Trúc Dự Án
**Sử dụng mô hình MVC, cấu trúc project như sau:** 
```
Pro-Room-Fund/
├── src
|    └── main
|        ├── java
|        |    ├── Controller
|        |    |   ├── ExpenditureManager.java
|        |    |   ├── HistoryManager.java
|        |    |   ├── RoomManager.java
|        |    |   ├── SignIn.java
|        |    |   ├── SignUp.java
|        |    ├── Model
|        |    |   ├── FileData
|        |    |   |    ├── Account.txt
|        |    |   |    ├── Username.dat
|        |    |   ├── Account.java
|        |    |   ├── AccountDAO.java
|        |    |   ├── Expenditure.java
|        |    |   ├── Expense.java
|        |    |   ├── Member.java
|        |    |   ├── Room.java
|        |    ├── Utility
|        |    |   ├── AddExpenseStatus.java
|        |    |   ├── ImageProcessor.java
|        |    |   ├── SceneManager.java
|        |    |   ├── SignUpStatus.java
|        |    ├── Utility
|        |    |   ├── AddExpenseView.java
|        |    |   ├── AddMemberView.java
|        |    |   ├── CalculateResultView.java
|        |    |   ├── ExpenditureView.java
|        |    |   ├── HistoryView.java
|        |    |   ├── Main.java
|        |    |   ├── MemberView.java
|        |    |   ├── OpenProofView.java
|        |    |   ├── OpenresultView.java
|        |    |   ├── RoomEditView.java
|        |    |   ├── RoomView.java
|        |    |   ├── SignInView.java
|        |    |   ├── SignUpView.java
|        └── resources
|            ├── FXML
|            |   ├── ExpenditureView
|            |   |   ├── AddExpenditure.css
|            |   |   ├── AddExpenditure.fxml
|            |   |   ├── CalculateResult.css
|            |   |   ├── CalculateResult.fxml
|            |   |   ├── ExpenditureView.css
|            |   |   ├── ExpenditureView.fxml
|            |   ├── HistoryView
|            |   |   ├── HistoryView.css
|            |   |   ├── HistoryView.fxml
|            |   |   ├── OpenResultView.fxml
|            |   ├── MemberView
|            |   |   ├── AddMemberView.css
|            |   |   ├── AddMemberView.fxml
|            |   |   ├── MemberView.css
|            |   |   ├── MemberView.fxml
|            |   ├── RoomView
|            |   |   ├── RoomEditView.fxml
|            |   |   ├── RoomView.css
|            |   |   ├── RoomView.fxml
|            |   ├── SignInView
|            |   |   ├── SignIn.css
|            |   |   ├── SignIn.fxml
|            |   ├── SignUpView
|            |   |   ├── SignUp.css
|            |   |   ├── SignUp.fxml
└──          └── Image
```

Diễn giải:

- **java:** Chứa các package phần Controller và Model
- **resources:** Chứa các file để render view

Luồng hoạt động cơ bản của project
![image]()


## 5. Ảnh Demo

**Ảnh Demo:**



## 6. Các Vấn Đề Gặp Phải

#### Vấn Đề 1: Tìm kiếm bài viết bị chậm do làm bằng HTTP
- 

#### Hành Động Giải Quyết 
**Giải pháp:** 

#### Kết Quả

* Database: (Đăng, Cường)
  * Thiết kế mô hình ER: Đăng
  * Chuẩn hóa và vẽ luôn mô hình
  * Deadline: trước 22h t5 tuần này
  * CN: chuyển ER thành mô hình quan hệ: Cường

* FE:
  * Code signin, signout, post