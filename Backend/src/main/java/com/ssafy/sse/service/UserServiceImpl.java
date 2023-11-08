package com.ssafy.sse.service;


import com.ssafy.sse.entity.User;
import com.ssafy.sse.repository.User.UserRespository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRespository userRespository;


    @Override
    public Optional<User> findByEmail(String email) {
        return userRespository.findByEmail(email);
    }
}
