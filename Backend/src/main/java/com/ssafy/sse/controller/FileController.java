package com.ssafy.sse.controller;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sse.dto.FileDto;
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
	public ResponseEntity create(@RequestPart(value="dto") FileDto fileDto,
								@RequestPart(value="image") MultipartFile image) throws IOException {

		log.info("create file");
		String res = s3UploadService.saveFile(image);
		System.out.println(res);
		File file = fileService.create(fileDto);
		return ResponseEntity.ok(file);
	}

	@GetMapping("{id}")
	public ResponseEntity getUser(@PathVariable Long id) {
		log.info("readOne");
		File file = fileService.readOne(id);
		return ResponseEntity.ok(file);
	}
}
