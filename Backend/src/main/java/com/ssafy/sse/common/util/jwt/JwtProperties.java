package com.ssafy.sse.common.util.jwt;


import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Data
@Component
//@ConfigurationProperties(prefix = "spring.jwt")
public class JwtProperties {
    @Value("spring.jwt.secret")
    private String secret;
}
