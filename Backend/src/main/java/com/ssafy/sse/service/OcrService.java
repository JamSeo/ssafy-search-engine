package com.ssafy.sse.service;

import java.time.LocalDateTime;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
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

import com.ssafy.sse.entity.OcrUrl;
import com.ssafy.sse.repository.OcrUrlRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OcrService {

	private final OcrUrlRepository ocrUrlRepository;

	@Autowired
	private RestTemplate restTemplate;



	public String saveUrl(String url){
		String PrevOcrUrl = ocrUrlRepository.findTopDest();
		if(PrevOcrUrl != null) {
			ocrUrlRepository.updateDest(url);
			return "updated";
		}
		OcrUrl ocrUrl = OcrUrl.builder()
			.dest(url)
			.build();
		ocrUrlRepository.save(ocrUrl);
		return "saved";
	}

	public String sendPostRequestToFlaskServer(MultipartFile file) {
		String PrevOcrUrl = ocrUrlRepository.findTopDest();
		if(PrevOcrUrl == null){
			return "no_url";
		}
		try {
			byte[] fileBytes = file.getBytes();
			ByteArrayResource resource = new ByteArrayResource(fileBytes) {
				LocalDateTime now = LocalDateTime.now();
				@Override
				public String getFilename() {
					// return file.getOriginalFilename(); // 파일의 원본 이름을 사용합니다.
					return "email@" + now +".jpg";
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
			ResponseEntity<String> responseEntity = restTemplate.exchange(PrevOcrUrl + "/ai/ocr", HttpMethod.POST, requestEntity, String.class);

			return responseEntity.getBody();
		} catch (Exception e) {
			e.printStackTrace();
			return "Error occurred: " + e.getMessage();
		}

	}
}
