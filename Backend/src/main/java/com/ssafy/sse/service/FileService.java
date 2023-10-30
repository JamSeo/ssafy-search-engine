package com.ssafy.sse.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.sse.dto.FileDto;
import com.ssafy.sse.dto.FileResDto;
import com.ssafy.sse.entity.File;
import com.ssafy.sse.repository.FileRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class FileService {

	private final FileRepository fileRepository;

	public File create(FileDto fileDto) {
		// 생성시 로그인된 이메일로 수정 필요
		File file = File.builder()
			.fileLocation(fileDto.getFileLocation())
			.result(fileDto.getResult())
			.email("2@2")
			.build();

		return fileRepository.save(file);
	}

	public File readOne(Long id) {
		return fileRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
	}

	public List<FileResDto> searchAll(String email) {
		List<File> fileList = fileRepository.findAllByEmail(email);
		System.out.println(fileList.toString());
		if (fileList.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
		List<FileResDto> files = new ArrayList<>();
		for(File file :fileList){
			FileResDto fileResDto = FileResDto.builder()
				.fileLocation(file.getFileLocation())
				.createDate(file.getCreateDate())
				.result(file.getResult())
				.build();
			files.add(fileResDto);
		}
		return files;
	}
}