package com.project.careerfair.controller.members;

import com.project.careerfair.service.generalmember.UserPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/login")
public class LoginController {

    private final UserPageService userService;

    @GetMapping
    @PreAuthorize("isAnonymous()")
    public String loginForm() {
        return "member/login";
    }

    @GetMapping("/locked")
    public String loginLockedForm() {
        return "member/locked";
    }
}
