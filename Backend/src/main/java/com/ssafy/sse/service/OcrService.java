package com.ssafy.sse.service;

import java.io.FileNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OcrService {

	@Value("${AI_OCR_URL}")
	private String url;

	@Autowired
	private RestTemplate restTemplate;

	public String sendPostRequestToFlaskServer(MultipartFile file) {
		try {
			byte[] fileBytes = file.getBytes();
			ByteArrayResource resource = new ByteArrayResource(fileBytes) {
				@Override
				public String getFilename() {
					return file.getOriginalFilename(); // 파일의 원본 이름을 사용합니다.
				}
			};

			// MultiValueMap 생성
			MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
			body.add("file", resource);

			// 요청 헤더 설정
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.MULTIPART_FORM_DATA);

			// HttpEntity 생성
			HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

			// POST 요청 보내기
			ResponseEntity<String> responseEntity = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);

			return responseEntity.getBody();
		} catch (Exception e) {
			e.printStackTrace();
			return "Error occurred: " + e.getMessage();
		}

	}
}
