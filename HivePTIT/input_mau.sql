USE HivePTIT1;

-- 1. TẠO 12 USERS (Sinh viên PTIT)
-- Ranking core mặc định là 0, sẽ thay đổi khi bảng votes có dữ liệu
INSERT INTO `users` (student_id, password_hash, username, email, firstname, lastname, bio, is_verified) VALUES
('B21DCCN001', 'pass_hash_1', 'hoangnam_dev', 'nam.h@stu.ptit.edu.vn', 'Hoàng', 'Nam', 'Yêu thích Java và Spring Boot.', 'Y'),
('B21DCCN002', 'pass_hash_2', 'thuy_linh_99', 'linh.t@stu.ptit.edu.vn', 'Thùy', 'Linh', 'Đang học Frontend ReactJS.', 'Y'),
('B21DCCN003', 'pass_hash_3', 'minh_quang', 'quang.m@stu.ptit.edu.vn', 'Minh', 'Quang', 'AI/ML Enthusiast.', 'Y'),
('B21DCCN004', 'pass_hash_4', 'thu_ha_ptit', 'ha.t@stu.ptit.edu.vn', 'Thu', 'Hà', 'Thành viên CLB ProPTIT.', 'N'),
('B21DCCN005', 'pass_hash_5', 'duc_thang', 'thang.d@stu.ptit.edu.vn', 'Đức', 'Thắng', 'Chuyên trị thuật toán.', 'Y'),
('B21DCCN006', 'pass_hash_6', 'bao_ngoc_ui', 'ngoc.b@stu.ptit.edu.vn', 'Bảo', 'Ngọc', 'UI/UX Designer.', 'N'),
('B21DCCN007', 'pass_hash_7', 'tuan_kiet', 'kiet.t@stu.ptit.edu.vn', 'Tuấn', 'Kiệt', 'Mobile Developer (Flutter).', 'Y'),
('B21DCCN008', 'pass_hash_8', 'thanh_hang', 'hang.v@stu.ptit.edu.vn', 'Thanh', 'Hằng', 'Data Analyst tương lai.', 'Y'),
('B21DCCN009', 'pass_hash_9', 'quoc_bao', 'bao.q@stu.ptit.edu.vn', 'Quốc', 'Bảo', 'DevOps & Cloud AWS.', 'N'),
('B21DCCN010', 'pass_hash_10', 'hai_yen', 'yen.h@stu.ptit.edu.vn', 'Hải', 'Yến', 'Thích mèo và code Python.', 'Y'),
('B21DCCN011', 'pass_hash_11', 'viet_anh', 'anh.v@stu.ptit.edu.vn', 'Việt', 'Anh', 'Game Developer (Unity).', 'Y'),
('B21DCCN012', 'pass_hash_12', 'phuong_thao', 'thao.p@stu.ptit.edu.vn', 'Phương', 'Thảo', 'Tester / QA.', 'N');

-- 2. TẠO 5 TOPICS
INSERT INTO `topics` (name) VALUES 
('Java Spring Boot'), 
('Thuật toán & Cấu trúc dữ liệu'), 
('Trí tuệ nhân tạo (AI)'), 
('Cơ sở dữ liệu'), 
('Đời sống PTIT');

-- User follow topic (Mỗi topic vài người)
INSERT INTO `user_topic` (student_id, topic_id) VALUES
('B21DCCN001', 1), ('B21DCCN001', 2),
('B21DCCN002', 5), ('B21DCCN002', 1),
('B21DCCN003', 3), ('B21DCCN003', 2),
('B21DCCN005', 2), ('B21DCCN005', 4);

-- 3. TẠO FOLLOWS (Mỗi user follow 3-5 người khác)
INSERT INTO `follows` (follower_id, following_id) VALUES
-- User 1 follow 3 người
('B21DCCN001', 'B21DCCN002'), ('B21DCCN001', 'B21DCCN003'), ('B21DCCN001', 'B21DCCN004'),
-- User 2 follow 4 người
('B21DCCN002', 'B21DCCN001'), ('B21DCCN002', 'B21DCCN005'), ('B21DCCN002', 'B21DCCN006'), ('B21DCCN002', 'B21DCCN007'),
-- User 3 follow 3 người
('B21DCCN003', 'B21DCCN001'), ('B21DCCN003', 'B21DCCN008'), ('B21DCCN003', 'B21DCCN009'),
-- User 4 follow 5 người
('B21DCCN004', 'B21DCCN001'), ('B21DCCN004', 'B21DCCN002'), ('B21DCCN004', 'B21DCCN003'), ('B21DCCN004', 'B21DCCN010'), ('B21DCCN004', 'B21DCCN011'),
-- User 5 follow 3 người
('B21DCCN005', 'B21DCCN001'), ('B21DCCN005', 'B21DCCN004'), ('B21DCCN005', 'B21DCCN006'),
-- User 6 follow 3 người
('B21DCCN006', 'B21DCCN002'), ('B21DCCN006', 'B21DCCN005'), ('B21DCCN006', 'B21DCCN007'),
-- User 7 follow 3 người
('B21DCCN007', 'B21DCCN008'), ('B21DCCN007', 'B21DCCN009'), ('B21DCCN007', 'B21DCCN010'),
-- User 8 follow 4 người
('B21DCCN008', 'B21DCCN001'), ('B21DCCN008', 'B21DCCN002'), ('B21DCCN008', 'B21DCCN003'), ('B21DCCN008', 'B21DCCN004'),
-- User 9 follow 3 người
('B21DCCN009', 'B21DCCN010'), ('B21DCCN009', 'B21DCCN011'), ('B21DCCN009', 'B21DCCN012'),
-- User 10 follow 3 người
('B21DCCN010', 'B21DCCN001'), ('B21DCCN010', 'B21DCCN005'), ('B21DCCN010', 'B21DCCN009'),
-- User 11 follow 4 người
('B21DCCN011', 'B21DCCN002'), ('B21DCCN011', 'B21DCCN003'), ('B21DCCN011', 'B21DCCN004'), ('B21DCCN011', 'B21DCCN006'),
-- User 12 follow 3 người
('B21DCCN012', 'B21DCCN001'), ('B21DCCN012', 'B21DCCN007'), ('B21DCCN012', 'B21DCCN008');

-- 4. TẠO 72 POSTS (Chia đều cho 12 Users, mỗi user 6 bài)
-- Nội dung giả lập ngắn gọn
INSERT INTO `posts` (student_id, title, content) VALUES
-- User 1 (6 posts)
('B21DCCN001', 'Lộ trình học Spring Boot 2025', 'Chia sẻ lộ trình học backend với Java Spring Boot từ cơ bản đến nâng cao.'),
('B21DCCN001', 'Lỗi NullPointerException thường gặp', 'Cách xử lý lỗi null khi code Java.'),
('B21DCCN001', 'Review môn Cơ sở dữ liệu', 'Môn này thầy cô dạy khá kỹ, các bạn nhớ ôn tập chuẩn hóa form.'),
('B21DCCN001', 'Hỏi về đồ án tốt nghiệp', 'Nên chọn đề tài về AI hay Web App truyền thống?'),
('B21DCCN001', 'Góc tìm team hackathon', 'Mình cần tìm 2 bạn backend join team thi HivePTIT.'),
('B21DCCN001', 'Chia sẻ slide môn Mạng máy tính', 'Link drive bên dưới nhé mọi người.'),

-- User 2 (6 posts)
('B21DCCN002', 'ReactJS vs Angular', 'Tại sao mình chọn React thay vì Angular?'),
('B21DCCN002', 'CSS Flexbox trong 5 phút', 'Hướng dẫn nhanh cách dàn trang.'),
('B21DCCN002', 'Tìm người học nhóm tiếng Anh', 'Mục tiêu TOEIC 800+ ra trường.'),
('B21DCCN002', 'Sự kiện Job Fair PTIT', 'Có ai tham gia không nhỉ?'),
('B21DCCN002', 'Review quán cơm cổng sau', 'Ngon bổ rẻ cho sinh viên.'),
('B21DCCN002', 'Hỏi về thư viện UI Ant Design', 'Cách custom theme trong Antd.'),

-- User 3 (6 posts)
('B21DCCN003', 'Nhập môn Machine Learning', 'Bắt đầu với Python và thư viện Scikit-learn.'),
('B21DCCN003', 'Deep Learning là gì?', 'Khái niệm cơ bản về Neural Network.'),
('B21DCCN003', 'Review sách AI', 'Cuốn "Deep Learning" của Ian Goodfellow.'),
('B21DCCN003', 'Dataset nhận diện biển số xe', 'Mình có bộ dataset Việt Nam, ai cần inbox.'),
('B21DCCN003', 'Python cho người mới', 'Cú pháp cơ bản cần nhớ.'),
('B21DCCN003', 'Cài đặt Anaconda trên Win 11', 'Hướng dẫn fix lỗi path environment.'),

-- User 4 (6 posts)
('B21DCCN004', 'CLB ProPTIT tuyển thành viên', 'Đợt tuyển gen mới bắt đầu.'),
('B21DCCN004', 'Kinh nghiệm phỏng vấn CLB', 'Tự tin và đam mê là chính.'),
('B21DCCN004', 'Học kỳ quân sự có gì vui?', 'Kỷ niệm khó quên tại Mai Lĩnh.'),
('B21DCCN004', 'Mất thẻ sinh viên', 'Mọi người cho hỏi thủ tục làm lại thẻ.'),
('B21DCCN004', 'Góc pass giáo trình', 'Mình pass lại sách Triết học giá rẻ.'),
('B21DCCN004', 'Tìm trọ khu Văn Quán', 'Tài chính 2tr quay đầu.'),

-- User 5 (6 posts)
('B21DCCN005', 'Giải bài tập Quy hoạch động', 'Phân tích bài toán cái túi.'),
('B21DCCN005', 'Đồ thị DFS và BFS', 'Khi nào dùng cái nào?'),
('B21DCCN005', 'Review Codeforces Round #800', 'Bài C khó hơn bình thường.'),
('B21DCCN005', 'Cây nhị phân tìm kiếm', 'Cài đặt bằng C++.'),
('B21DCCN005', 'Sắp xếp nhanh (Quick Sort)', 'Độ phức tạp và cách tối ưu.'),
('B21DCCN005', 'Thi Olympic Tin học', 'Kinh nghiệm ôn thi.'),

-- User 6 (6 posts)
('B21DCCN006', 'Thiết kế UX cho Mobile App', 'Những nguyên tắc vàng.'),
('B21DCCN006', 'Figma cơ bản', 'Công cụ không thể thiếu.'),
('B21DCCN006', 'Màu sắc trong thiết kế', 'Cách phối màu color palette.'),
('B21DCCN006', 'Hỏi về màn hình Laptop', 'Nên mua màn 100% sRGB không?'),
('B21DCCN006', 'Review môn Kiến trúc máy tính', 'Môn này hơi trừu tượng.'),
('B21DCCN006', 'Tìm bạn tập cầu lông', 'Sân ký túc xá chiều thứ 5.'),

-- User 7 (6 posts)
('B21DCCN007', 'Flutter 3.0 có gì mới?', 'Cập nhật tính năng.'),
('B21DCCN007', 'Dart vs Java', 'So sánh cú pháp.'),
('B21DCCN007', 'State Management trong Flutter', 'Provider hay Bloc?'),
('B21DCCN007', 'Build app Android đầu tiên', 'Hello World.'),
('B21DCCN007', 'Lỗi Gradle build failed', 'Cách fix đau đầu nhất.'),
('B21DCCN007', 'Review môn Hệ điều hành', 'Banker Algorithm.'),

-- User 8 (6 posts)
('B21DCCN008', 'SQL Injection là gì?', 'Cách phòng tránh.'),
('B21DCCN008', 'Normalization DB', 'Chuẩn 1NF, 2NF, 3NF.'),
('B21DCCN008', 'Học PowerBI ở đâu?', 'Xin review khóa học.'),
('B21DCCN008', 'Excel nâng cao', 'VLOOKUP và Pivot Table.'),
('B21DCCN008', 'Data Analyst Roadmap', 'Cần học những gì?'),
('B21DCCN008', 'Thực tập doanh nghiệp', 'Nên chọn công ty product hay outsource?'),

-- User 9 (6 posts)
('B21DCCN009', 'Docker cơ bản', 'Container hóa ứng dụng.'),
('B21DCCN009', 'Triển khai AWS EC2', 'Hướng dẫn tạo máy ảo Free Tier.'),
('B21DCCN009', 'CI/CD với Jenkins', 'Tự động hóa deploy.'),
('B21DCCN009', 'Linux Command Line', 'Các lệnh LS, CD, GREP.'),
('B21DCCN009', 'Git Flow là gì?', 'Quy trình quản lý source code.'),
('B21DCCN009', 'Cấu hình Nginx', 'Làm Reverse Proxy.'),

-- User 10 (6 posts)
('B21DCCN010', 'Nuôi mèo ở trọ', 'Có bị chủ nhà cấm không?'),
('B21DCCN010', 'Python Automation', 'Tự động gửi email.'),
('B21DCCN010', 'Web Scraping với BeautifulSoup', 'Cào dữ liệu web truyện.'),
('B21DCCN010', 'Flask vs Django', 'Framework nào nhẹ hơn?'),
('B21DCCN010', 'Review phim cuối tuần', 'Phim bom tấn mới ra rạp.'),
('B21DCCN010', 'Hỏi chỗ sửa laptop uy tín', 'Máy mình bị hỏng bản lề.'),

-- User 11 (6 posts)
('B21DCCN011', 'Làm game với Unity', 'C# scripting.'),
('B21DCCN011', 'Vật lý trong Game', 'Rigidbody và Collider.'),
('B21DCCN011', 'Game Design Document', 'Cách viết GDD.'),
('B21DCCN011', 'Hỏi về cấu hình PC chơi game', 'Tầm 20tr build được gì?'),
('B21DCCN011', 'Review môn An toàn thông tin', 'Mã hóa RSA khó hiểu quá.'),
('B21DCCN011', 'Tuyển Artist vẽ game 2D', 'Dự án bài tập lớn.'),

-- User 12 (6 posts)
('B21DCCN012', 'Manual Testing là gì?', 'Kiểm thử thủ công.'),
('B21DCCN012', 'Viết Test Case chuẩn', 'Cấu trúc một test case.'),
('B21DCCN012', 'Selenium WebDriver', 'Automation Test cơ bản.'),
('B21DCCN012', 'Bug Life Cycle', 'Vòng đời của lỗi.'),
('B21DCCN012', 'Review kỳ thực tập', 'Trải nghiệm làm Tester.'),
('B21DCCN012', 'Hỏi về học bổng PTIT', 'Điểm phẩy bao nhiêu thì được?');

-- 5. TẠO DỮ LIỆU BẢNG KHÁC (~8 dòng mỗi bảng)

-- Post Topics (Gắn topic cho một số bài viết)
INSERT INTO `post_topic` (post_id, topic_id) VALUES
(1, 1), (2, 1), -- Bài 1,2 về Java
(13, 3), (14, 3), -- Bài 13,14 về AI
(25, 2), (26, 2), -- Bài 25,26 về Thuật toán
(3, 4), (44, 4); -- Bài 3, 44 về DB

-- Bookmark List
INSERT INTO `bookmark_list` (student_id, name) VALUES
('B21DCCN001', 'Bài hay cần đọc lại'),
('B21DCCN001', 'Tài liệu Java'),
('B21DCCN002', 'Frontend Tips'),
('B21DCCN003', 'AI Research'),
('B21DCCN005', 'Algorithm Hard'),
('B21DCCN008', 'Data Science'),
('B21DCCN010', 'Giải trí'),
('B21DCCN012', 'Testing Tools');

-- Book Post (Thêm bài vào list)
INSERT INTO `book_post` (list_id, post_id) VALUES
(1, 1), (1, 13),
(2, 1), (2, 2),
(3, 7), (3, 8),
(5, 25), (5, 26);

-- Comments (8 comment)
INSERT INTO `comments` (post_id, student_id, content) VALUES
(1, 'B21DCCN002', 'Bài viết rất hữu ích, cảm ơn bạn.'),
(1, 'B21DCCN005', 'Hóng phần nâng cao về Microservices.'),
(13, 'B21DCCN001', 'Mình xin link dataset với.'),
(25, 'B21DCCN003', 'Bài này dùng DP O(n^2) được không?'),
(7, 'B21DCCN006', 'React giờ phổ biến thật.'),
(40, 'B21DCCN004', 'Mình cũng đang học PowerBI.'),
(50, 'B21DCCN009', 'Nuôi mèo cẩn thận cào ghế sofa nhé.'),
(60, 'B21DCCN011', 'Học bổng kỳ này chắc phải 3.6.');

-- 6. TẠO VOTES ĐỂ TRIGGER TÍNH TOÁN RANKING CORE KHÁC NHAU
-- Logic: Insert vào votes -> Trigger chạy -> Update users.ranking_core và posts.vote_count

-- User 1 (B21DCCN001) - Cho nhiều Upvote -> Ranking cao nhất
INSERT INTO `votes` (student_id, post_id, vote_type) VALUES
('B21DCCN002', 1, 'upvote'), -- User 2 like bài 1 của User 1
('B21DCCN003', 1, 'upvote'),
('B21DCCN004', 1, 'upvote'),
('B21DCCN005', 1, 'upvote'),
('B21DCCN006', 2, 'upvote'),
('B21DCCN007', 2, 'upvote'),
('B21DCCN002', 3, 'upvote'); 
-- Dự kiến User 1 ranking tăng: 5*7 = 35 điểm (vì mỗi vote post +5)

-- User 5 (B21DCCN005) - Ranking trung bình
INSERT INTO `votes` (student_id, post_id, vote_type) VALUES
('B21DCCN001', 25, 'upvote'), -- Like bài 25 của User 5
('B21DCCN002', 25, 'upvote'),
('B21DCCN003', 26, 'upvote');
-- Dự kiến User 5 ranking tăng: 5*3 = 15 điểm

-- User 3 (B21DCCN003) - Ranking thấp (bị downvote vài cái)
INSERT INTO `votes` (student_id, post_id, vote_type) VALUES
('B21DCCN001', 13, 'upvote'),
('B21DCCN002', 13, 'downvote'); -- Bị dislike
-- Dự kiến User 3 ranking: 5 - 5 = 0 (hoặc thay đổi tùy logic trigger)

-- User 10 (B21DCCN010) - Vote cho comment (Ranking tăng ít hơn)
-- Comment id 1 là của User 2, id 2 là của User 5
INSERT INTO `votes` (student_id, comment_id, vote_type) VALUES
('B21DCCN001', 1, 'upvote'), -- Like comment 1 (của User 2)
('B21DCCN003', 2, 'upvote'); -- Like comment 2 (của User 5)
-- User 2 tăng thêm 1 điểm (do vote comment). User 5 tăng thêm 1 điểm.

-- Các user còn lại ranking = 0 do chưa được vote.

-- role
INSERT INTO `roles` (role_name) VALUES
 ('Admin'),('Guest'),('Student');
 
-- INSERT INTO user_role (student_id, role_id) VALUES
-- ('B23DCKH011', 1);
