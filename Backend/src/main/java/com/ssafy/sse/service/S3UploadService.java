package com.ssafy.sse.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3UploadService {

	private final AmazonS3 amazonS3;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	public String saveFile(MultipartFile multipartFile) throws IOException {
		String originalFilename = multipartFile.getOriginalFilename();
		// 이미지 파일 네이밍 규칙
		// 사용자 닉네임 +"_" + 일시
		LocalDateTime now = LocalDateTime.now();
		String fileName = "nickname" + "_" + now;
		ObjectMetadata metadata = new ObjectMetadata();
		metadata.setContentLength(multipartFile.getSize());
		metadata.setContentType(multipartFile.getContentType());

		amazonS3.putObject(bucket, fileName, multipartFile.getInputStream(), metadata);
		return amazonS3.getUrl(bucket, fileName).toString();
	}
}