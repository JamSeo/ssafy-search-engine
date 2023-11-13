package com.ssafy.sse.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.sse.dto.FileDto;
import com.ssafy.sse.dto.FileResDto;
import com.ssafy.sse.dto.OcrResDto;
import com.ssafy.sse.entity.File;
import com.ssafy.sse.service.FileService;
import com.ssafy.sse.service.OcrService;
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
	private final OcrService ocrService;
	private final S3UploadService s3UploadService;

	@PostMapping("/summarize")
	public ResponseEntity summarize(@RequestParam(name="url") Optional<String> url, @RequestPart(value="image") MultipartFile image, @RequestParam(value="result") String result) throws IOException{
		if(url.isPresent()){
			File file = fileService.searchByUrl(String.valueOf(url));
			return ResponseEntity.ok(file.getSummary());
		}
		else{
			String sumResult = ocrService.sendSummarizeRequestToFlaskServer(result);
			String transResult = ocrService.sendTranslateRequestToFlaskServer(result);
			String s3Url = s3UploadService.saveFile(image);
			FileDto fileDto = FileDto.builder()
				.fileLocation(s3Url)
				.result(result)
				.summarizedResult(sumResult)
				.translatedResult(transResult)
				.build();
			fileService.create(fileDto);
			return ResponseEntity.ok(s3Url);
		}
	}
	@PostMapping("/translate")
	public ResponseEntity translate(@RequestParam(name="url") Optional<String> url, @RequestPart(value="image" ) MultipartFile image, @RequestParam(value="result" ) String result) throws IOException{
		if(url.isPresent()){
			File file = fileService.searchByUrl(String.valueOf(url));
			return ResponseEntity.ok(file.getTrans());
		}
		else {
			String sumResult = ocrService.sendSummarizeRequestToFlaskServer(result);
			String transResult = ocrService.sendTranslateRequestToFlaskServer(result);
			String s3Url = s3UploadService.saveFile(image);
			FileDto fileDto = FileDto.builder()
				.fileLocation(s3Url)
				.result(result)
				.summarizedResult(sumResult)
				.translatedResult(transResult)
				.build();
			fileService.create(fileDto);
			return ResponseEntity.ok(s3Url);
		}
	}

	@PostMapping("/url")
	public ResponseEntity getOcrUrl(@RequestParam(value="url") String url){
		ocrService.saveUrl(url);
		return ResponseEntity.ok("ok");
	}
	@PostMapping("/predict")
	public ResponseEntity predict( @RequestPart(value="image") MultipartFile image){
		// flask API 와 통신하여 결과 받아옴
		String res = ocrService.sendPostRequestToFlaskServer(image);
		OcrResDto ocrResDto = OcrResDto.builder()
			.result(res)
			.build();

		return ResponseEntity.ok(ocrResDto);
	}
	@PostMapping("/create")
	public ResponseEntity create(
								@RequestParam(value="result") String result,
								@RequestPart(value="image") MultipartFile image) throws IOException {
			String s3Url = s3UploadService.saveFile(image);
			FileDto fileDto = FileDto.builder()
				.fileLocation(s3Url)
				.result(result)
				.summarizedResult("")
				.translatedResult("")
				.build();
			fileService.create(fileDto);
			return ResponseEntity.ok(s3Url);

	}
	@GetMapping()
	public ResponseEntity getData(){
		// 이메일 수정 필요
		List<FileResDto> fileList = fileService.searchAll("2@2");
		return ResponseEntity.ok(fileList);
	}
	@GetMapping("/date")
	public ResponseEntity getDataByDate(
		@DateTimeFormat(pattern = "yyyy-MM-dd")
		@RequestParam(value="date") String date){
		// 이메일 수정 필요
		List<FileResDto> fileList = fileService.searchByDate(date,"2@2");
		return ResponseEntity.ok(fileList);
	}

	@GetMapping("/range")
	public ResponseEntity getDataByDateRange(
		@DateTimeFormat(pattern = "yyyy-MM-dd")
		@RequestParam(value="start") String start,
		@DateTimeFormat(pattern = "yyyy-MM-dd")
		@RequestParam(value="end") String end){
		// 이메일 수정 필요
		List<FileResDto> fileList = fileService.searchByDateBetween(start, end,"2@2");
		return ResponseEntity.ok(fileList);
	}
}
