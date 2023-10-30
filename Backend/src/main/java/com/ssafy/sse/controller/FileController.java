package com.ssafy.sse.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sse.dto.FileDto;
import com.ssafy.sse.dto.FileResDto;
import com.ssafy.sse.entity.File;
import com.ssafy.sse.service.FileService;
import com.ssafy.sse.service.S3UploadService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/ocr")
@Configuration
public class FileController {
	private final FileService fileService;
	private final S3UploadService s3UploadService;

	@PostMapping
	public ResponseEntity create(@RequestParam(value="result") String result,
								@RequestPart(value="image") MultipartFile image) throws IOException {
		String s3Url = s3UploadService.saveFile(image);
		FileDto fileDto = FileDto.builder()
			.fileLocation(s3Url)
			.result(result)
			.build();
		File file = fileService.create(fileDto);
		return ResponseEntity.ok(file);
	}
	@GetMapping
	public ResponseEntity getData(){
		// 사용자 로그인한 이메일로 변경 필요
		List<FileResDto> fileList = fileService.searchAll("2@2");
		return ResponseEntity.ok(fileList);
	}
}
