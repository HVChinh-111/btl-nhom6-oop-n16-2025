package com.example.hiveptit.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Controller quản lý các trang HTML tĩnh và điều hướng chính
 */
@Controller
public class HomeController {

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    /**
     * Trang chủ - Hiển thị danh sách bài viết
     */
    @GetMapping({"/", "/index", "/index.html"})
    public String index(Model model) {
        try {
            logger.info("Accessing index page");
            return "index";
        } catch (Exception e) {
            logger.error("Error loading index page: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Trang đăng nhập
     */
    @GetMapping({"/sign-in", "/sign-in.html"})
    public String signIn(Model model) {
        try {
            logger.info("Accessing sign-in page");
            return "sign-in";
        } catch (Exception e) {
            logger.error("Error loading sign-in page: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Trang đăng ký
     */
    @GetMapping({"/sign-up", "/sign-up.html"})
    public String signUp(Model model) {
        try {
            logger.info("Accessing sign-up page");
            return "sign-up";
        } catch (Exception e) {
            logger.error("Error loading sign-up page: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Trang hồ sơ cá nhân
     */
    @GetMapping({"/profile", "/profile.html"})
    public String profile(Model model) {
        try {
            logger.info("Accessing profile page");
            return "profile";
        } catch (Exception e) {
            logger.error("Error loading profile page: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Trang bảng xếp hạng tác giả
     */
    @GetMapping({"/author-ranking", "/author-ranking.html"})
    public String authorRanking(Model model) {
        try {
            logger.info("Accessing author-ranking page");
            return "author-ranking";
        } catch (Exception e) {
            logger.error("Error loading author-ranking page: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Xử lý lỗi chung cho controller
     */
    @ExceptionHandler(Exception.class)
    public ModelAndView handleException(Exception e) {
        logger.error("Unhandled exception in HomeController: {}", e.getMessage(), e);
        ModelAndView mav = new ModelAndView("error");
        mav.addObject("errorMessage", "Đã xảy ra lỗi khi tải trang. Vui lòng thử lại sau.");
        mav.addObject("errorDetails", e.getMessage());
        return mav;
    }
}
