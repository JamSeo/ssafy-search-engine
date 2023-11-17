package com.ssafy.sse.service;

import com.ssafy.sse.entity.User;

import java.util.Optional;

public interface UserService {

    Optional<User> findByEmail(String email);
}
