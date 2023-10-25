package com.ssafy.sse.controller;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.sse.dto.FileDto;
import com.ssafy.sse.entity.File;
import com.ssafy.sse.service.FileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/ocr")
@Configuration
public class FileController {
	private final FileService fileService;

	@PostMapping
	public ResponseEntity create(@RequestBody FileDto fileDto) {
		log.info("create file");
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
