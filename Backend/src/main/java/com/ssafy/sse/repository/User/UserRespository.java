package com.ssafy.sse.repository.User;

import com.ssafy.sse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRespository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
