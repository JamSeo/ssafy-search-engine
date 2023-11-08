package com.ssafy.sse.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
		// 이메일 수정 필요
		File file = File.builder()
			.fileLocation(fileDto.getFileLocation())
			.result(fileDto.getResult())
			.email("2@2")
			.build();

		return fileRepository.save(file);
	}

	public List<FileResDto> searchAll(String email) {
		List<File> fileList = fileRepository.findAllByEmail(email);
		System.out.println(fileList.toString());
		return getFileResDtos(fileList);
	}

	public List<FileResDto> searchByDate(String date, String email){
		List<File> fileList = fileRepository.findAllByEmailAndDate(date, email);
		return getFileResDtos(fileList);
	}

	private List<FileResDto> getFileResDtos(List<File> fileList) {
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

	public List<FileResDto> searchByDateBetween(String start, String end, String email){
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");
		LocalDateTime startTime = LocalDateTime.parse(start + "T00:00:00.000", formatter);
		LocalDateTime endTime = LocalDateTime.parse(end + "T23:59:59.997", formatter);
		List<File> fileList = fileRepository.findAllByEmailAndDateBetween(startTime, endTime, email);
		return getFileResDtos(fileList);
	}
}