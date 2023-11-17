package com.ssafy.sse.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TestController {

    @GetMapping("/fail")
    public String test() {

        // 엑세스 토큰으로 현재 Redis 정보 삭제
        return "loginfail";
    }
    @GetMapping("/test")
    public String tess_2(@RequestParam String code) {
        log.info(code);
        // 엑세스 토큰으로 현재 Redis 정보 삭제
        return "loginfail";
    }
}
