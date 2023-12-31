package com.project.careerfair.controller.members;

import com.project.careerfair.domain.Members;
import com.project.careerfair.service.members.UserPageService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/members/company-page/")
@PreAuthorize("isAuthenticated() and hasAuthority('company') or hasAnyAuthority('recruiter')")
@RequiredArgsConstructor
public class CompanyMypageController {
    private final UserPageService userService;

    @GetMapping("mypage")
    @PreAuthorize("hasAuthority('admin') or (isAuthenticated() and (authentication.name eq #id))")
    public void coMyPage(String id, Model model) {

        Members member = userService.get(id);
        model.addAttribute("members", member);

        Integer unreadNoteCount = userService.getUnreadNoteCount(id);
        model.addAttribute("unreadNote", unreadNoteCount);
    }


    @GetMapping("myinfo")
    @PreAuthorize("hasAuthority('admin') or (isAuthenticated() and (authentication.name eq #id))")
    public void coMyInfo(String id, Model model) {

        Members members = userService.get(id);

        model.addAttribute("members", members);
    }

    //회원 정보 수정
    @GetMapping("modify")
    @PreAuthorize("hasAuthority('admin') or (isAuthenticated() and (authentication.name eq #id))")
    public void coModifyForm(String id , Model model) {
        Members member = userService.get(id);
        model.addAttribute("member",member);
    }

    @PostMapping("modify")
    @PreAuthorize("isAuthenticated()")
    public String coModify(Members member, RedirectAttributes rttr, String oldPassword) {
        boolean ok = userService.modifyAccount(member, oldPassword);
        if(ok) {
            rttr.addFlashAttribute("message", "회원 정보가 수정되었습니다.");
            return "redirect:/members/company-page/myinfo?id=" + member.getId();
        }else {
            rttr.addFlashAttribute("message", "회원 정보 수정중 오류가 발생하였습니다.");
            return "redirect:/members/company-page/modify?id=" + member.getId();
        }

    }

    //탈퇴
    @PostMapping("remove")
    public String coIdRemove(Members member, RedirectAttributes rttr, HttpServletRequest request) throws ServletException {

        boolean ok = userService.removeAccout(member);
        if(ok) {
            rttr.addFlashAttribute("message", "회원 탈퇴가 완료되었습니다.");

            //로그아웃
            request.logout();
            return "redirect:/login";
        }else {
            rttr.addFlashAttribute("message","회원 탈퇴 중 문제가 발생하였습니다.");
            return "redirect:/members/company-page/myinfo?id=" + member.getId();
        }
    }

}
