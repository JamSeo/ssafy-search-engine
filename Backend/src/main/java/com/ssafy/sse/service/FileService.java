package com.ssafy.sse.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.sse.dto.FileDto;
import com.ssafy.sse.entity.File;
import com.ssafy.sse.repository.FileRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FileService {

	private final FileRepository fileRepository;

	public File create(FileDto fileDto) {

		File file = File.builder()
			.fileType(fileDto.getFileType())
			.fileLocation(fileDto.getFileLocation())
			.result(fileDto.getResult())
			.build();

		return fileRepository.save(file);
	}

	public File readOne(Long id) {
		return fileRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}
}