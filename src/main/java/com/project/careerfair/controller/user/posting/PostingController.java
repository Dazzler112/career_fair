package com.project.careerfair.controller.user.posting;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("userPostingController")
@RequestMapping("/user/posting/")
@RequiredArgsConstructor
public class PostingController {

    @GetMapping("list")
    public String list() {
        return "user/posting/list";
    }

    @GetMapping("{postingId}")
    public String detail(@PathVariable Integer postingId) {
        return "user/posting/detail";
    }

    @GetMapping("/application")
    public String application() {
        return "user/posting/application";
    }
}
