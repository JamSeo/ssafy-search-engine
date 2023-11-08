package com.ssafy.sse.repository.User;

import com.ssafy.sse.dto.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken,String> {

    Optional<RefreshToken> findByAccessToken(String accesstoken);

}
