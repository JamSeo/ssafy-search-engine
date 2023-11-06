package com.ssafy.sse.config;

import com.ssafy.sse.common.util.jwt.filter.JwtExceptionFilter;
import com.ssafy.sse.service.CustomOAuth2UserService;
import com.ssafy.sse.common.util.jwt.filter.JwtAuthFilter;
import com.ssafy.sse.common.util.jwt.filter.MyAuthenticationFailureHandler;
import com.ssafy.sse.common.util.jwt.filter.MyAuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final MyAuthenticationSuccessHandler oAuth2LoginSuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final JwtAuthFilter jwtAuthFilter;
    private final MyAuthenticationFailureHandler oAuth2LoginFailureHandler;
    private final JwtExceptionFilter jwtExceptionFilter;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http

//                .cors().configurationSource(corsConfigurationSource())
//                .and()
                .httpBasic().disable()
                .csrf().disable()
                .formLogin().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                .and()
                //TODO: 허용할 주소 추가
                .authorizeRequests()
//                .antMatchers("/token/**").permitAll()
//                .antMatchers("/fail/**").permitAll()
//                .antMatchers("/succ/**").permitAll()
//                .antMatchers("/test/**").permitAll()
//                .antMatchers("/css/**","/images/**","/js/**").permitAll()
                    .antMatchers("/**").permitAll()
                    // .antMatchers().permitAll()
                    // .anyRequest().authenticated()

//                .anyRequest().authenticated()
                .and()

                .oauth2Login()//oauth2 로그인 설정 시작
                .userInfoEndpoint().userService(customOAuth2UserService)// OAuth2 로그인시 사용자 정보를 가져오는 엔드 포인트 및 사용자 서비스 설정
                .and()
                .failureHandler(oAuth2LoginFailureHandler)// oauth2 로그인 실패시 처리하는 핸들러
                .successHandler(oAuth2LoginSuccessHandler)
                .and()
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtExceptionFilter, JwtAuthFilter.class);

                //JWT 인증 필터를 usernapaaufilter 앞단에 적용한다.
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
